"use client";

import { FolderIcon, CheckIcon, getFileIcon } from "./Icons";
import type { GoogleDriveFile, GoogleDriveFolder } from "../types";
import { formatFileSize, formatDate } from "../utils";

interface DriveFileListProps {
  files: GoogleDriveFile[];
  folders: GoogleDriveFolder[];
  selectedFiles: GoogleDriveFile[];
  onFileClick: (file: GoogleDriveFile) => void;
  onFolderClick: (folder: GoogleDriveFolder) => void;
  multiple: boolean;
}

export function DriveFileList({
  files,
  folders,
  selectedFiles,
  onFileClick,
  onFolderClick,
  multiple,
}: DriveFileListProps) {
  const selectedIds = new Set(selectedFiles.map((f) => f.id));

  return (
    <div className="gdrive-picker__list">
      <div className="gdrive-picker__list-header">
        <span className="gdrive-picker__list-header-name">Name</span>
        <span className="gdrive-picker__list-header-date">Modified</span>
        <span className="gdrive-picker__list-header-size">Size</span>
      </div>

      {folders.map((folder) => (
        <button
          key={folder.id}
          type="button"
          className="gdrive-picker__list-item gdrive-picker__list-item--folder"
          onClick={() => onFolderClick(folder)}
        >
          <span className="gdrive-picker__list-item-icon">
            <FolderIcon size={20} />
          </span>
          <span className="gdrive-picker__list-item-name" title={folder.name}>
            {folder.name}
          </span>
          <span className="gdrive-picker__list-item-date">—</span>
          <span className="gdrive-picker__list-item-size">—</span>
        </button>
      ))}

      {files.map((file) => {
        const isSelected = selectedIds.has(file.id);
        const FileTypeIcon = getFileIcon(file.mimeType);

        return (
          <button
            key={file.id}
            type="button"
            className={`gdrive-picker__list-item gdrive-picker__list-item--file ${isSelected ? "gdrive-picker__list-item--selected" : ""}`}
            onClick={() => onFileClick(file)}
          >
            <span className="gdrive-picker__list-item-icon">
              {multiple && isSelected ? (
                <CheckIcon size={16} />
              ) : (
                <FileTypeIcon size={20} />
              )}
            </span>
            <span className="gdrive-picker__list-item-name" title={file.name}>
              {file.name}
            </span>
            <span className="gdrive-picker__list-item-date">
              {file.modifiedTime ? formatDate(file.modifiedTime) : "—"}
            </span>
            <span className="gdrive-picker__list-item-size">
              {file.size ? formatFileSize(file.size) : "—"}
            </span>
          </button>
        );
      })}
    </div>
  );
}
