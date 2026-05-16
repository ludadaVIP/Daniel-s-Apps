import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Shared TTS playback primitive used by every sub-app that plays audio.
 *
 * Each app owns its own *URL resolution* (which endpoint, what body,
 * caching policy, blob vs remote URL). This hook owns the boring,
 * easy-to-get-wrong parts:
 *
 *   - only ONE <audio> element plays at a time (auto-pause on new play)
 *   - a cancel token so a stop() or a fresh play() invalidates any
 *     in-flight URL fetch (the awaiting caller gets a TtsCancelled)
 *   - speakingKey / loadingKey / error state for UI highlighting
 *   - URL.revokeObjectURL cleanup when the caller hands over a blob URL
 *   - cleanup on unmount
 *
 * Callers invoke:
 *
 *   play({
 *     key,              // string identifying which UI button is "active"
 *     getUrl,            // async () => ({ url, revokeOnEnd?, meta? })
 *     waitForEnd,        // if true, the promise resolves only after audio ends
 *     onResolved,        // optional, called with the getUrl result before play
 *   })
 *
 * The hook never inspects the URL — it just hands it to <audio>.
 */

export class TtsCancelled extends Error {
  constructor() {
    super("Playback cancelled.");
    this.name = "TtsCancelled";
  }
}

export function isTtsCancelled(err) {
  return err instanceof TtsCancelled || err?.name === "TtsCancelled";
}

export function useTts() {
  const audioRef = useRef(null);
  const objectUrlRef = useRef("");
  const cancelTokenRef = useRef(0);
  const pendingRejectRef = useRef(null);
  const [speakingKey, setSpeakingKey] = useState("");
  const [loadingKey, setLoadingKey] = useState("");
  const [error, setError] = useState("");
  const [paused, setPaused] = useState(false);

  const revokePendingObjectUrl = useCallback(() => {
    if (objectUrlRef.current) {
      try {
        URL.revokeObjectURL(objectUrlRef.current);
      } catch {
        /* ignore */
      }
      objectUrlRef.current = "";
    }
  }, []);

  const detachAudio = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      try {
        audio.pause();
        audio.removeAttribute("src");
        audio.load();
      } catch {
        /* ignore */
      }
      audioRef.current = null;
    }
    setPaused(false);
    revokePendingObjectUrl();
  }, [revokePendingObjectUrl]);

  const stop = useCallback(() => {
    cancelTokenRef.current += 1;
    detachAudio();
    const reject = pendingRejectRef.current;
    pendingRejectRef.current = null;
    if (reject) reject(new TtsCancelled());
    setSpeakingKey("");
    setLoadingKey("");
    setPaused(false);
  }, [detachAudio]);

  const pause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || audio.paused) return;
    audio.pause();
    setPaused(true);
  }, []);

  const resume = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || !audio.paused) return;
    await audio.play();
    setPaused(false);
  }, []);

  const play = useCallback(
    async ({ key = "", getUrl, waitForEnd = false, onResolved } = {}) => {
      if (typeof getUrl !== "function") {
        throw new Error("useTts.play requires a getUrl function.");
      }

      // Cancel any prior in-flight play before reserving our token.
      const previousReject = pendingRejectRef.current;
      pendingRejectRef.current = null;
      if (previousReject) previousReject(new TtsCancelled());

      cancelTokenRef.current += 1;
      const ownToken = cancelTokenRef.current;

      detachAudio();
      setError("");
      setSpeakingKey(key);
      setLoadingKey(key);
      setPaused(false);

      let resolved;
      try {
        resolved = await getUrl();
      } catch (err) {
        if (ownToken === cancelTokenRef.current) {
          setError(err?.message || "Could not load audio.");
          setSpeakingKey("");
          setLoadingKey("");
        }
        throw err;
      }

      if (ownToken !== cancelTokenRef.current) {
        // Someone called stop() or play() again while we were fetching.
        // If the caller created a blob URL, revoke it so it doesn't leak.
        if (resolved?.revokeOnEnd && resolved?.url) {
          try {
            URL.revokeObjectURL(resolved.url);
          } catch {
            /* ignore */
          }
        }
        throw new TtsCancelled();
      }

      const { url, revokeOnEnd = false } = resolved || {};
      if (!url) {
        setSpeakingKey("");
        setLoadingKey("");
        throw new Error("getUrl did not return a url.");
      }

      const audio = new Audio(url);
      audio.preload = "auto";
      audioRef.current = audio;
      if (revokeOnEnd) objectUrlRef.current = url;

      try {
        onResolved?.(resolved);
      } catch {
        /* user callback errors shouldn't break playback */
      }

      const ended = new Promise((resolve, reject) => {
        pendingRejectRef.current = reject;
        const finish = (err) => {
          audio.onended = null;
          audio.onerror = null;
          if (pendingRejectRef.current === reject) pendingRejectRef.current = null;
          if (audioRef.current === audio) {
            audioRef.current = null;
            if (objectUrlRef.current === url) revokePendingObjectUrl();
            if (ownToken === cancelTokenRef.current) setSpeakingKey("");
            if (ownToken === cancelTokenRef.current) setPaused(false);
          }
          if (err) reject(err);
          else resolve();
        };
        audio.onended = () => finish();
        audio.onerror = () => finish(new Error("Audio playback failed."));
      });

      try {
        await audio.play();
        if (ownToken === cancelTokenRef.current) setLoadingKey("");
        if (ownToken === cancelTokenRef.current) setPaused(false);
      } catch (err) {
        if (ownToken === cancelTokenRef.current) {
          setError(err?.message || "Could not start playback.");
          setSpeakingKey("");
          setLoadingKey("");
        }
        // Drain the ended promise so it doesn't become an unhandled rejection.
        ended.catch(() => {});
        throw err;
      }

      if (waitForEnd) {
        try {
          await ended;
        } catch (err) {
          if (ownToken === cancelTokenRef.current && !isTtsCancelled(err)) {
            setError(err?.message || "Audio playback failed.");
          }
          throw err;
        }
        if (ownToken !== cancelTokenRef.current) throw new TtsCancelled();
      } else {
        ended.catch((err) => {
          if (ownToken === cancelTokenRef.current && !isTtsCancelled(err)) {
            setError(err?.message || "Audio playback failed.");
          }
        });
      }
    },
    [detachAudio, revokePendingObjectUrl]
  );

  useEffect(() => stop, [stop]);

  return { play, stop, pause, resume, paused, speakingKey, loadingKey, error, setError };
}
