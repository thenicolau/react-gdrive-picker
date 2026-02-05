"use client";

import { ChevronRightIcon } from "./Icons";
import type { GoogleDriveFolder } from "../types";

interface DriveBreadcrumbProps {
  folderStack: GoogleDriveFolder[];
  onNavigate: (index: number) => void;
}

export function DriveBreadcrumb({
  folderStack,
  onNavigate,
}: DriveBreadcrumbProps) {
  return (
    <nav className="gdrive-picker__breadcrumb" aria-label="Folder navigation">
      <button
        type="button"
        className={`gdrive-picker__breadcrumb-item ${folderStack.length === 0 ? "gdrive-picker__breadcrumb-item--active" : ""}`}
        onClick={() => onNavigate(-1)}
      >
        My Drive
      </button>
      {folderStack.map((folder, index) => (
        <span key={folder.id} className="gdrive-picker__breadcrumb-segment">
          <ChevronRightIcon className="gdrive-picker__breadcrumb-separator" />
          <button
            type="button"
            className={`gdrive-picker__breadcrumb-item ${index === folderStack.length - 1 ? "gdrive-picker__breadcrumb-item--active" : ""}`}
            onClick={() => onNavigate(index)}
          >
            {folder.name}
          </button>
        </span>
      ))}
    </nav>
  );
}
