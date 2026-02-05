"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { SearchIcon, GridViewIcon, ListViewIcon } from "./Icons";
import type { ViewMode } from "../types";

interface DriveToolbarProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onSearch: (query: string) => void;
  isSearching: boolean;
}

export function DriveToolbar({
  viewMode,
  onViewModeChange,
  onSearch,
  isSearching,
}: DriveToolbarProps) {
  const [inputValue, setInputValue] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setInputValue(value);

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        onSearch(value.trim());
      }, 400);
    },
    [onSearch]
  );

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return (
    <div className="gdrive-picker__toolbar">
      <div className="gdrive-picker__search">
        <SearchIcon className="gdrive-picker__search-icon" />
        <input
          type="text"
          className="gdrive-picker__search-input"
          placeholder="Search in Drive..."
          value={inputValue}
          onChange={handleInputChange}
          disabled={isSearching}
        />
      </div>
      <div className="gdrive-picker__view-toggle">
        <button
          type="button"
          className={`gdrive-picker__view-button ${viewMode === "grid" ? "gdrive-picker__view-button--active" : ""}`}
          onClick={() => onViewModeChange("grid")}
          aria-label="Grid view"
        >
          <GridViewIcon />
        </button>
        <button
          type="button"
          className={`gdrive-picker__view-button ${viewMode === "list" ? "gdrive-picker__view-button--active" : ""}`}
          onClick={() => onViewModeChange("list")}
          aria-label="List view"
        >
          <ListViewIcon />
        </button>
      </div>
    </div>
  );
}
