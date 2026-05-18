import { Pause, Play, Square } from "lucide-react";

export function NineHundredProgressDock({
  currentIndex,
  itemLabel = "sentence",
  jumpLabel,
  label,
  onPause,
  onResume,
  onSeek,
  onStop,
  paused,
  pauseLabel = "Pause",
  resumeLabel = "Resume",
  stopLabel = "Stop",
  total,
  visible,
}) {
  if (!visible || !total) return null;

  const current = Math.min(Math.max(currentIndex + 1, 1), total);
  const percent = Math.round((current / total) * 100);

  return (
    <aside className="nh-progress-dock" aria-label="Playback progress">
      <div className="nh-progress-top">
        <div>
          <strong>{label || "Playing queue"}</strong>
          <span>{current} / {total} · {percent}%</span>
        </div>
        <div className="nh-progress-actions">
          <button type="button" onClick={paused ? onResume : onPause}>
            {paused ? <Play size={16} /> : <Pause size={16} />}
            {paused ? resumeLabel : pauseLabel}
          </button>
          <button type="button" onClick={onStop}>
            <Square size={15} />
            {stopLabel}
          </button>
        </div>
      </div>
      <input
        type="range"
        min="1"
        max={total}
        value={current}
        onChange={(event) => onSeek(Number(event.target.value) - 1)}
        aria-label={jumpLabel || `Jump to ${itemLabel}`}
      />
    </aside>
  );
}
