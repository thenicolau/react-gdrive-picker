import type { ViewMode } from "../types";

interface DriveLoadingStateProps {
  viewMode: ViewMode;
}

export function DriveLoadingState({ viewMode }: DriveLoadingStateProps) {
  if (viewMode === "grid") {
    return (
      <div className="gdrive-picker__grid">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="gdrive-picker__grid-item gdrive-picker__skeleton-card">
            <div className="gdrive-picker__skeleton gdrive-picker__skeleton--thumbnail" />
            <div className="gdrive-picker__skeleton gdrive-picker__skeleton--text" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="gdrive-picker__list">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="gdrive-picker__list-item gdrive-picker__skeleton-row">
          <div className="gdrive-picker__skeleton gdrive-picker__skeleton--icon" />
          <div className="gdrive-picker__skeleton gdrive-picker__skeleton--text-wide" />
          <div className="gdrive-picker__skeleton gdrive-picker__skeleton--text-short" />
          <div className="gdrive-picker__skeleton gdrive-picker__skeleton--text-short" />
        </div>
      ))}
    </div>
  );
}
