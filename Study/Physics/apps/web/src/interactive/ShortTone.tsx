import { useEffect, useRef, useState } from 'react';
import type { LanguageMode } from '@study/shared';
import { B } from '../ui';
import { toneModel } from './soundModels';
export function ShortTone({
  mode,
  frequency,
  amplitude,
}: {
  mode: LanguageMode;
  frequency: number;
  amplitude: number;
}) {
  const session = useRef<
      | {
          ctx: AudioContext;
          osc: OscillatorNode;
          gain: GainNode;
          stopAt: number;
        }
      | undefined
    >(undefined),
    [playing, setPlaying] = useState(false),
    [error, setError] = useState(false);
  const stop = () => {
    const s = session.current;
    session.current = undefined;
    if (s) {
      s.osc.onended = null;
      try {
        s.osc.stop();
      } catch {
        /* already ended */
      }
      void s.ctx.close().catch(() => {});
    }
    setPlaying(false);
  };
  useEffect(
    () => () => {
      const s = session.current;
      session.current = undefined;
      if (s) {
        s.osc.onended = null;
        void s.ctx.close().catch(() => {});
      }
    },
    [],
  );
  useEffect(() => {
    const s = session.current;
    if (s && Number.isFinite(s.stopAt) && s.ctx.currentTime < s.stopAt - 0.04) {
      s.osc.frequency.setTargetAtTime(frequency, s.ctx.currentTime, 0.01);
      s.gain.gain.cancelScheduledValues(s.ctx.currentTime);
      s.gain.gain.setTargetAtTime(
        toneModel(frequency, amplitude).audioGain,
        s.ctx.currentTime,
        0.01,
      );
      s.gain.gain.setValueAtTime(
        toneModel(frequency, amplitude).audioGain,
        s.stopAt - 0.04,
      );
      s.gain.gain.linearRampToValueAtTime(0, s.stopAt);
    }
  }, [frequency, amplitude]);
  const play = async () => {
    if (session.current) {
      stop();
      return;
    }
    setError(false);
    let ctx: AudioContext | undefined;
    try {
      ctx = new AudioContext();
      const osc = ctx.createOscillator(),
        gain = ctx.createGain(),
        s = { ctx, osc, gain, stopAt: Infinity };
      session.current = s;
      await ctx.resume();
      if (session.current !== s) {
        void ctx.close().catch(() => {});
        return;
      }
      s.stopAt = ctx.currentTime + 0.7;
      osc.type = 'sine';
      osc.frequency.value = frequency;
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(
        toneModel(frequency, amplitude).audioGain,
        ctx.currentTime + 0.02,
      );
      gain.gain.setValueAtTime(
        toneModel(frequency, amplitude).audioGain,
        ctx.currentTime + 0.66,
      );
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.7);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.onended = () => {
        if (session.current === s) {
          session.current = undefined;
          setPlaying(false);
        }
        void s.ctx.close().catch(() => {});
      };
      osc.start();
      osc.stop(ctx.currentTime + 0.7);
      setPlaying(true);
    } catch {
      session.current = undefined;
      if (ctx) void ctx.close().catch(() => {});
      setPlaying(false);
      setError(true);
    }
  };
  return (
    <div className="phy-sound-audio">
      <button className="phy-button secondary" onClick={() => void play()}>
        <B
          zh={playing ? '停止试听' : '试听0.7秒短音'}
          en={playing ? 'Stop listening' : 'Play a 0.7-second tone'}
          mode={mode}
        />
      </button>
      <p role="status">
        <B
          zh={
            error
              ? '当前设备无法播放，仍可用图完成比较。'
              : playing
                ? '短音播放中；调节滑块可听到变化。'
                : '先把设备音量调低。短音只是比较工具，不测分贝或听力；切走页面会停止。'
          }
          en={
            error
              ? 'Audio unavailable on this device; use the graph to complete comparisons.'
              : playing
                ? 'Brief tone playing; sliders change it while it plays.'
                : 'Start at low device volume. Tones compare changes, not decibels or hearing; leaving this page stops them.'
          }
          mode={mode}
        />
      </p>
    </div>
  );
}
