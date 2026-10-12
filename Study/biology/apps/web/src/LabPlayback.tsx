import { useEffect, useState } from 'react';
import type { LanguageMode } from '@study/shared';
import { t } from './schema';
import { Text } from './ui';
export function useFrames(last: number, onExplore: () => void) {
  const [frame, setFrame] = useState(0),
    [playing, setPlaying] = useState(false);
  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(
      () => setFrame((f) => Math.min(last, f + 1)),
      1400,
    );
    return () => clearInterval(timer);
  }, [playing, last]);
  useEffect(() => {
    if (frame === last) setPlaying(false);
  }, [frame, last]);
  return {
    frame,
    playing,
    choose: (value: number) => {
      setFrame(value);
      setPlaying(false);
      onExplore();
    },
    reset: () => {
      setFrame(0);
      setPlaying(false);
    },
    play: () => {
      if (frame === last) setFrame(0);
      setPlaying(!playing);
      onExplore();
    },
    next: () => {
      setFrame((f) => Math.min(last, f + 1));
      onExplore();
    },
    replay: () => {
      setFrame(0);
      setPlaying(false);
      onExplore();
    },
    last,
  };
}
export function Playback({
  flow,
  mode,
}: {
  flow: ReturnType<typeof useFrames>;
  mode: LanguageMode;
}) {
  return (
    <div className="bio-playback">
      <button onClick={flow.play}>
        <Text
          mode={mode}
          text={flow.playing ? t('Ⅱ 暂停', 'Ⅱ Pause') : t('▷ 播放', '▷ Play')}
        />
      </button>
      <button
        disabled={flow.playing || flow.frame === flow.last}
        onClick={flow.next}
      >
        <Text mode={mode} text={t('下一步', 'Next step')} />
      </button>
      <button onClick={flow.replay}>
        <Text mode={mode} text={t('↺ 重播', '↺ Replay')} />
      </button>
      <span>
        {flow.frame + 1} / {flow.last + 1}
      </span>
    </div>
  );
}
