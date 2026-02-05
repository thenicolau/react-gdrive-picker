"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type {
  GoogleDriveFile,
  GoogleDriveFolder,
  GapiDriveFile,
  GapiTokenClient,
  UseGoogleDriveOptions,
  UseGoogleDriveReturn,
} from "../types";

const SCOPES = [
  "https://www.googleapis.com/auth/drive.readonly",
  "https://www.googleapis.com/auth/drive.metadata.readonly",
].join(" ");

const GOOGLE_API_SCRIPT_ID = "google-api-script";
const GOOGLE_GSI_SCRIPT_ID = "google-gsi-script";
const GOOGLE_API_URL = "https://apis.google.com/js/api.js";
const GOOGLE_GSI_URL = "https://accounts.google.com/gsi/client";
const DRIVE_DISCOVERY_DOC =
  "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest";

const DEFAULT_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "video/mp4",
  "video/quicktime",
];

function loadScript(src: string, id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("Window is not defined"));
      return;
    }

    const existing = document.getElementById(id);
    if (existing) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.id = id;
    script.src = src;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(script);
  });
}

function buildMimeTypeFilter(mimeTypes: string[]): string {
  return mimeTypes.map((m) => `mimeType='${m}'`).join(" or ");
}

function mapDriveFile(file: GapiDriveFile): GoogleDriveFile {
  return {
    id: file.id || "",
    name: file.name || "",
    mimeType: file.mimeType || "",
    size: parseInt(file.size || "0", 10) || undefined,
    thumbnailLink: file.thumbnailLink,
    modifiedTime: file.modifiedTime,
    iconLink: file.iconLink,
  };
}

function mapDriveFolder(folder: GapiDriveFile): GoogleDriveFolder {
  return {
    id: folder.id || "",
    name: folder.name || "",
  };
}

export function useGoogleDrive({
  clientId,
  apiKey,
  onError,
  mimeTypes = DEFAULT_MIME_TYPES,
}: UseGoogleDriveOptions): UseGoogleDriveReturn {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isListingFiles, setIsListingFiles] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const tokenClientRef = useRef<GapiTokenClient | null>(null);
  const accessTokenRef = useRef<string | null>(null);
  const isInitializedRef = useRef(false);
  const pendingSignInResolveRef = useRef<(() => void) | null>(null);

  const initializeGoogleApis = useCallback(async () => {
    if (isInitializedRef.current) return;

    try {
      await loadScript(GOOGLE_API_URL, GOOGLE_API_SCRIPT_ID);
      await loadScript(GOOGLE_GSI_URL, GOOGLE_GSI_SCRIPT_ID);

      await new Promise<void>((resolve, reject) => {
        if (!window.gapi) {
          reject(new Error("Google API not loaded"));
          return;
        }
        window.gapi.load("client", { callback: resolve, onerror: reject });
      });

      await window.gapi?.client.init({
        apiKey,
        discoveryDocs: [DRIVE_DISCOVERY_DOC],
      });

      if (!window.google?.accounts?.oauth2) {
        throw new Error("Google Identity Services not loaded");
      }

      tokenClientRef.current = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: SCOPES,
        callback: (tokenResponse) => {
          if (tokenResponse.error) {
            const err = new Error(tokenResponse.error);
            setError(err);
            onError?.(err);
            pendingSignInResolveRef.current = null;
            return;
          }

          if (tokenResponse.access_token) {
            accessTokenRef.current = tokenResponse.access_token;
            setIsAuthenticated(true);
            pendingSignInResolveRef.current?.();
            pendingSignInResolveRef.current = null;
          }
        },
      });

      isInitializedRef.current = true;
      setIsLoading(false);
    } catch (err) {
      const error =
        err instanceof Error
          ? err
          : new Error("Failed to initialize Google APIs");
      setError(error);
      onError?.(error);
      setIsLoading(false);
    }
  }, [apiKey, clientId, onError]);

  useEffect(() => {
    initializeGoogleApis();
  }, [initializeGoogleApis]);

  const signIn = useCallback(async (): Promise<void> => {
    if (!tokenClientRef.current) {
      const err = new Error("Google Identity Services not initialized");
      setError(err);
      throw err;
    }

    if (accessTokenRef.current) {
      setIsAuthenticated(true);
      return;
    }

    return new Promise<void>((resolve) => {
      pendingSignInResolveRef.current = resolve;
      tokenClientRef.current?.requestAccessToken({ prompt: "consent" });
    });
  }, []);

  const signOut = useCallback(() => {
    if (accessTokenRef.current && window.google?.accounts?.oauth2) {
      window.google.accounts.oauth2.revoke(accessTokenRef.current);
      accessTokenRef.current = null;
    }
    setIsAuthenticated(false);
  }, []);

  const getAccessToken = useCallback((): string | null => {
    return accessTokenRef.current;
  }, []);

  const listFiles = useCallback(
    async (
      folderId?: string,
      pageToken?: string
    ): Promise<{
      files: GoogleDriveFile[];
      folders: GoogleDriveFolder[];
      nextPageToken?: string;
    }> => {
      if (!accessTokenRef.current) {
        throw new Error("Not authenticated");
      }

      if (!window.gapi?.client?.drive?.files) {
        throw new Error("Google Drive API not initialized");
      }

      setIsListingFiles(true);

      try {
        const mimeTypeFilter = buildMimeTypeFilter(mimeTypes);
        const folderFilter = folderId
          ? `'${folderId}' in parents`
          : "'root' in parents";

        const [filesResponse, foldersResponse] = await Promise.all([
          window.gapi.client.drive.files.list({
            q: `(${mimeTypeFilter}) and ${folderFilter} and trashed=false`,
            fields:
              "nextPageToken, files(id, name, mimeType, size, thumbnailLink, modifiedTime, iconLink)",
            pageSize: 50,
            pageToken: pageToken,
            orderBy: "modifiedTime desc",
          }),
          window.gapi.client.drive.files.list({
            q: `mimeType='application/vnd.google-apps.folder' and ${folderFilter} and trashed=false`,
            fields: "files(id, name)",
            pageSize: 100,
            orderBy: "name",
          }),
        ]);

        return {
          files: (filesResponse.result.files || []).map(mapDriveFile),
          folders: (foldersResponse.result.files || []).map(mapDriveFolder),
          nextPageToken: filesResponse.result.nextPageToken,
        };
      } finally {
        setIsListingFiles(false);
      }
    },
    [mimeTypes]
  );

  const searchFiles = useCallback(
    async (
      query: string,
      pageToken?: string
    ): Promise<{
      files: GoogleDriveFile[];
      nextPageToken?: string;
    }> => {
      if (!accessTokenRef.current) {
        throw new Error("Not authenticated");
      }

      if (!window.gapi?.client?.drive?.files) {
        throw new Error("Google Drive API not initialized");
      }

      setIsListingFiles(true);

      try {
        const mimeTypeFilter = buildMimeTypeFilter(mimeTypes);
        const escapedQuery = query.replace(/'/g, "\\'");

        const response = await window.gapi.client.drive.files.list({
          q: `name contains '${escapedQuery}' and (${mimeTypeFilter}) and trashed=false`,
          fields:
            "nextPageToken, files(id, name, mimeType, size, thumbnailLink, modifiedTime, iconLink)",
          pageSize: 50,
          pageToken: pageToken,
          orderBy: "modifiedTime desc",
        });

        return {
          files: (response.result.files || []).map(mapDriveFile),
          nextPageToken: response.result.nextPageToken,
        };
      } finally {
        setIsListingFiles(false);
      }
    },
    [mimeTypes]
  );

  return {
    isLoading,
    isAuthenticated,
    signIn,
    signOut,
    error,
    getAccessToken,
    listFiles,
    searchFiles,
    isListingFiles,
  };
}
