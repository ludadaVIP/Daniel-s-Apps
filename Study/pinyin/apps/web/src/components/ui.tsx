import { useEffect, useState } from 'react';
import type { Word } from '../content/schema';

export function Icon({
  name,
  size = 20,
}: {
  name:
    | 'map'
    | 'sound'
    | 'keyboard'
    | 'chart'
    | 'arrow'
    | 'check'
    | 'clock'
    | 'spark'
    | 'book'
    | 'home';
  size?: number;
}) {
  const paths = {
    map: 'm3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Zm6-3v15m6-12v15',
    sound: 'm11 5-6 4H2v6h3l6 4V5Zm4 3a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14',
    keyboard:
      'M3 5h18v14H3V5Zm4 4h.01M11 9h.01M15 9h.01M7 12h.01M11 12h.01M15 12h.01M7 16h10',
    chart: 'M4 20V10m8 10V4m8 16v-7',
    arrow: 'M4 12h16m-6-6 6 6-6 6',
    check: 'm5 12 4 4L19 6',
    clock: 'M12 8v4l3 2M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',
    spark: 'm12 3 3 6 6 3-6 3-3 6-3-6-6-3 6-3 3-6Z',
    book: 'M12 6C8 3 4 3 2 4v15c4-1 7 0 10 2 3-2 6-3 10-2V4c-4-1-7 0-10 2Zm0 0v15',
    home: 'm3 10 9-7 9 7v11h-6v-7H9v7H3V10Z',
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[name]} />
    </svg>
  );
}
const audioFiles = import.meta.glob('../audio/*.wav', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;
let currentAudio: HTMLAudioElement | undefined;
export function stopAudio() {
  currentAudio?.pause();
}
export function SoundButton({
  word,
  label = '听示范',
  slow = false,
}: {
  word: Word;
  label?: string;
  slow?: boolean;
}) {
  const [status, setStatus] = useState('');
  useEffect(
    () => () => {
      stopAudio();
    },
    [],
  );
  async function play() {
    stopAudio();
    const url = audioFiles[`../audio/${word.audio}.wav`];
    if (!url) {
      setStatus('音频尚未准备好');
      return;
    }
    const audio = new Audio(url);
    currentAudio = audio;
    audio.playbackRate = slow ? 0.8 : 1;
    audio.onended = () => setStatus('');
    audio.onerror = () => setStatus('播放失败，请重试');
    try {
      await audio.play();
      setStatus('播放中');
    } catch {
      setStatus('播放失败，请重试');
    }
  }
  return (
    <span className="py-sound-wrap">
      <button
        className="py-sound"
        type="button"
        onClick={play}
        aria-label={label}
      >
        <Icon name="sound" size={17} />
        {label}
      </button>
      {status && <small role="status">{status}</small>}
    </span>
  );
}
export function WordCard({
  word,
  hideHanzi,
  hidePinyin,
  slow,
}: {
  word: Word;
  hideHanzi: boolean;
  hidePinyin: boolean;
  slow: boolean;
}) {
  return (
    <div className="py-word">
      <span className="py-word-pinyin">
        {hidePinyin ? '· · ·' : word.pinyinMarked}
      </span>
      <span className="py-word-hanzi">
        {hideHanzi ? '先读再核对' : word.hanzi}
      </span>
      <SoundButton
        word={word}
        slow={slow}
        label={word.id === 'ma0' ? '听问句' : '听示范'}
      />
    </div>
  );
}
