"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useGoogleDrive } from "../hooks/useGoogleDrive";
import { DriveToolbar } from "./DriveToolbar";
import { DriveBreadcrumb } from "./DriveBreadcrumb";
import { DriveFileGrid } from "./DriveFileGrid";
import { DriveFileList } from "./DriveFileList";
import { DriveLoadingState } from "./DriveLoadingState";
import { GoogleDriveIcon } from "./Icons";
import type {
  DrivePickerProps,
  GoogleDriveFile,
  GoogleDriveFolder,
  ViewMode,
} from "../types";

export function DrivePicker({
  clientId,
  apiKey,
  onSelect,
  multiple = false,
  mimeTypes,
  defaultView = "grid",
  showToolbar = true,
  showBreadcrumb = true,
  className,
  onAuthChange,
  onError,
  onNavigate,
}: DrivePickerProps) {
  const {
    isLoading: isInitializing,
    isAuthenticated,
    signIn,
    error,
    listFiles,
    searchFiles,
    isListingFiles,
  } = useGoogleDrive({ clientId, apiKey, onError, mimeTypes });

  const [viewMode, setViewMode] = useState<ViewMode>(defaultView);
  const [folderStack, setFolderStack] = useState<GoogleDriveFolder[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<GoogleDriveFile[]>([]);
  const [files, setFiles] = useState<GoogleDriveFile[]>([]);
  const [folders, setFolders] = useState<GoogleDriveFolder[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [nextPageToken, setNextPageToken] = useState<string | undefined>();
  const [hasLoadedInitial, setHasLoadedInitial] = useState(false);

  const prevAuthRef = useRef(isAuthenticated);

  // Notify auth changes
  useEffect(() => {
    if (prevAuthRef.current !== isAuthenticated) {
      prevAuthRef.current = isAuthenticated;
      onAuthChange?.(isAuthenticated);
    }
  }, [isAuthenticated, onAuthChange]);

  const currentFolderId =
    folderStack.length > 0 ? folderStack[folderStack.length - 1].id : undefined;

  // Load folder contents
  const loadFolder = useCallback(
    async (folderId?: string, pageToken?: string) => {
      try {
        const result = await listFiles(folderId, pageToken);
        if (pageToken) {
          setFiles((prev) => [...prev, ...result.files]);
        } else {
          setFiles(result.files);
          setFolders(result.folders);
        }
        setNextPageToken(result.nextPageToken);
        setHasLoadedInitial(true);
      } catch (err) {
        onError?.(
          err instanceof Error ? err : new Error("Failed to load files")
        );
      }
    },
    [listFiles, onError]
  );

  // Load search results
  const loadSearch = useCallback(
    async (query: string, pageToken?: string) => {
      try {
        const result = await searchFiles(query, pageToken);
        if (pageToken) {
          setFiles((prev) => [...prev, ...result.files]);
        } else {
          setFiles(result.files);
          setFolders([]);
        }
        setNextPageToken(result.nextPageToken);
      } catch (err) {
        onError?.(
          err instanceof Error ? err : new Error("Failed to search files")
        );
      }
    },
    [searchFiles, onError]
  );

  // Fetch on auth or folder change
  useEffect(() => {
    if (!isAuthenticated) return;

    if (searchQuery) {
      loadSearch(searchQuery);
    } else {
      loadFolder(currentFolderId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, currentFolderId]);

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
      setSelectedFiles([]);
      if (query) {
        loadSearch(query);
      } else {
        loadFolder(currentFolderId);
      }
    },
    [loadSearch, loadFolder, currentFolderId]
  );

  const handleFolderClick = useCallback(
    (folder: GoogleDriveFolder) => {
      setFolderStack((prev) => [...prev, folder]);
      setSelectedFiles([]);
      setSearchQuery("");
      onNavigate?.(folder);
    },
    [onNavigate]
  );

  const handleBreadcrumbNavigate = useCallback(
    (index: number) => {
      if (index === -1) {
        // Navigate to root
        setFolderStack([]);
        onNavigate?.(null);
      } else {
        setFolderStack((prev) => prev.slice(0, index + 1));
        onNavigate?.(folderStack[index] || null);
      }
      setSelectedFiles([]);
      setSearchQuery("");
    },
    [folderStack, onNavigate]
  );

  const handleFileClick = useCallback(
    (file: GoogleDriveFile) => {
      if (!multiple) {
        onSelect([file]);
        return;
      }

      setSelectedFiles((prev) => {
        const exists = prev.some((f) => f.id === file.id);
        if (exists) {
          return prev.filter((f) => f.id !== file.id);
        }
        return [...prev, file];
      });
    },
    [multiple, onSelect]
  );

  const handleConfirmSelection = useCallback(() => {
    if (selectedFiles.length > 0) {
      onSelect(selectedFiles);
    }
  }, [selectedFiles, onSelect]);

  const handleLoadMore = useCallback(() => {
    if (!nextPageToken) return;

    if (searchQuery) {
      loadSearch(searchQuery, nextPageToken);
    } else {
      loadFolder(currentFolderId, nextPageToken);
    }
  }, [nextPageToken, searchQuery, loadSearch, loadFolder, currentFolderId]);

  const wrapperClass = ["gdrive-picker", className].filter(Boolean).join(" ");

  // Initializing Google APIs
  if (isInitializing) {
    return (
      <div className={wrapperClass}>
        <div className="gdrive-picker__loading-init">
          <div className="gdrive-picker__spinner" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !isAuthenticated) {
    return (
      <div className={wrapperClass}>
        <div className="gdrive-picker__error">
          <p>Failed to initialize: {error.message}</p>
        </div>
      </div>
    );
  }

  // Sign-in screen
  if (!isAuthenticated) {
    return (
      <div className={wrapperClass}>
        <div className="gdrive-picker__signin">
          <GoogleDriveIcon size={48} className="gdrive-picker__signin-icon" />
          <h3 className="gdrive-picker__signin-title">
            Connect to Google Drive
          </h3>
          <p className="gdrive-picker__signin-description">
            Sign in to browse and select files from your Google Drive
          </p>
          <button
            type="button"
            className="gdrive-picker__signin-button"
            onClick={signIn}
          >
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  // Authenticated — show picker
  const isEmpty = !isListingFiles && hasLoadedInitial && files.length === 0 && folders.length === 0;

  return (
    <div className={wrapperClass}>
      {showToolbar && (
        <DriveToolbar
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onSearch={handleSearch}
          isSearching={isListingFiles}
        />
      )}

      {showBreadcrumb && !searchQuery && (
        <DriveBreadcrumb
          folderStack={folderStack}
          onNavigate={handleBreadcrumbNavigate}
        />
      )}

      {searchQuery && (
        <div className="gdrive-picker__search-info">
          Searching for &ldquo;{searchQuery}&rdquo;
        </div>
      )}

      <div className="gdrive-picker__content">
        {isListingFiles && !hasLoadedInitial ? (
          <DriveLoadingState viewMode={viewMode} />
        ) : isEmpty ? (
          <div className="gdrive-picker__empty">
            <p>
              {searchQuery
                ? "No files found matching your search"
                : "This folder is empty"}
            </p>
          </div>
        ) : viewMode === "grid" ? (
          <DriveFileGrid
            files={files}
            folders={folders}
            selectedFiles={selectedFiles}
            onFileClick={handleFileClick}
            onFolderClick={handleFolderClick}
            multiple={multiple}
          />
        ) : (
          <DriveFileList
            files={files}
            folders={folders}
            selectedFiles={selectedFiles}
            onFileClick={handleFileClick}
            onFolderClick={handleFolderClick}
            multiple={multiple}
          />
        )}

        {isListingFiles && hasLoadedInitial && (
          <div className="gdrive-picker__loading-more">
            <div className="gdrive-picker__spinner" />
          </div>
        )}

        {nextPageToken && !isListingFiles && (
          <button
            type="button"
            className="gdrive-picker__load-more"
            onClick={handleLoadMore}
          >
            Load more
          </button>
        )}
      </div>

      {multiple && selectedFiles.length > 0 && (
        <div className="gdrive-picker__selection-bar">
          <span className="gdrive-picker__selection-count">
            {selectedFiles.length} file{selectedFiles.length !== 1 ? "s" : ""}{" "}
            selected
          </span>
          <button
            type="button"
            className="gdrive-picker__selection-button"
            onClick={handleConfirmSelection}
          >
            Select
          </button>
        </div>
      )}
    </div>
  );
}
