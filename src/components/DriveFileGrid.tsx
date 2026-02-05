"use client";

import { FolderIcon, CheckIcon, getFileIcon } from "./Icons";
import type { GoogleDriveFile, GoogleDriveFolder } from "../types";
import { formatFileSize } from "../utils";

interface DriveFileGridProps {
  files: GoogleDriveFile[];
  folders: GoogleDriveFolder[];
  selectedFiles: GoogleDriveFile[];
  onFileClick: (file: GoogleDriveFile) => void;
  onFolderClick: (folder: GoogleDriveFolder) => void;
  multiple: boolean;
}

export function DriveFileGrid({
  files,
  folders,
  selectedFiles,
  onFileClick,
  onFolderClick,
  multiple,
}: DriveFileGridProps) {
  const selectedIds = new Set(selectedFiles.map((f) => f.id));

  return (
    <div className="gdrive-picker__grid">
      {folders.map((folder) => (
        <button
          key={folder.id}
          type="button"
          className="gdrive-picker__grid-item gdrive-picker__grid-item--folder"
          onClick={() => onFolderClick(folder)}
        >
          <div className="gdrive-picker__grid-item-thumbnail">
            <FolderIcon size={40} />
          </div>
          <span className="gdrive-picker__grid-item-name" title={folder.name}>
            {folder.name}
          </span>
        </button>
      ))}

      {files.map((file) => {
        const isSelected = selectedIds.has(file.id);
        const FileTypeIcon = getFileIcon(file.mimeType);

        return (
          <button
            key={file.id}
            type="button"
            className={`gdrive-picker__grid-item gdrive-picker__grid-item--file ${isSelected ? "gdrive-picker__grid-item--selected" : ""}`}
            onClick={() => onFileClick(file)}
          >
            {multiple && isSelected && (
              <div className="gdrive-picker__grid-item-check">
                <CheckIcon size={14} />
              </div>
            )}
            <div className="gdrive-picker__grid-item-thumbnail">
              {file.thumbnailLink ? (
                <img
                  src={file.thumbnailLink}
                  alt={file.name}
                  className="gdrive-picker__grid-item-image"
                  loading="lazy"
                />
              ) : (
                <FileTypeIcon size={40} />
              )}
            </div>
            <span className="gdrive-picker__grid-item-name" title={file.name}>
              {file.name}
            </span>
            {file.size ? (
              <span className="gdrive-picker__grid-item-meta">
                {formatFileSize(file.size)}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
