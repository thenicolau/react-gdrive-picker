// ── Public types ──

export interface GoogleDriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: number;
  thumbnailLink?: string;
  modifiedTime?: string;
  iconLink?: string;
}

export interface GoogleDriveFolder {
  id: string;
  name: string;
}

export type ViewMode = "grid" | "list";

export interface DrivePickerProps {
  /** Google OAuth 2.0 Client ID */
  clientId: string;
  /** Google API Key */
  apiKey: string;
  /** Called when files are selected */
  onSelect: (files: GoogleDriveFile[]) => void;
  /** Allow multiple file selection. Default: false */
  multiple?: boolean;
  /** Allowed MIME types. Default: images + videos */
  mimeTypes?: string[];
  /** Initial view mode. Default: "grid" */
  defaultView?: ViewMode;
  /** Show toolbar with search and view toggle. Default: true */
  showToolbar?: boolean;
  /** Show breadcrumb navigation. Default: true */
  showBreadcrumb?: boolean;
  /** Additional CSS class for the wrapper */
  className?: string;
  /** Called when authentication state changes */
  onAuthChange?: (authenticated: boolean) => void;
  /** Called on errors */
  onError?: (error: Error) => void;
  /** Called when navigating into a folder */
  onNavigate?: (folder: GoogleDriveFolder | null) => void;
}

// ── Hook types ──

export interface UseGoogleDriveOptions {
  clientId: string;
  apiKey: string;
  onError?: (error: Error) => void;
  mimeTypes?: string[];
}

export interface UseGoogleDriveReturn {
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: () => Promise<void>;
  signOut: () => void;
  error: Error | null;
  getAccessToken: () => string | null;
  listFiles: (
    folderId?: string,
    pageToken?: string
  ) => Promise<{
    files: GoogleDriveFile[];
    folders: GoogleDriveFolder[];
    nextPageToken?: string;
  }>;
  searchFiles: (
    query: string,
    pageToken?: string
  ) => Promise<{
    files: GoogleDriveFile[];
    nextPageToken?: string;
  }>;
  isListingFiles: boolean;
}

// ── Internal Google API types ──

export interface GapiTokenResponse {
  access_token?: string;
  error?: string;
}

export interface GapiTokenClient {
  requestAccessToken: (options?: { prompt?: string }) => void;
}

export interface GapiDriveFile {
  id?: string;
  name?: string;
  mimeType?: string;
  size?: string;
  thumbnailLink?: string;
  modifiedTime?: string;
  iconLink?: string;
}

export interface GapiDriveListResponse {
  result: {
    files?: GapiDriveFile[];
    nextPageToken?: string;
  };
}

declare global {
  interface Window {
    gapi:
      | {
          load: (
            api: string,
            config: { callback: () => void; onerror: () => void }
          ) => void;
          client: {
            init: (config: {
              apiKey: string;
              discoveryDocs: string[];
            }) => Promise<void>;
            drive?: {
              files: {
                list: (params: Record<string, unknown>) => Promise<GapiDriveListResponse>;
              };
            };
          };
        }
      | undefined;
    google:
      | {
          accounts: {
            oauth2: {
              initTokenClient: (config: {
                client_id: string;
                scope: string;
                callback: (response: GapiTokenResponse) => void;
              }) => GapiTokenClient;
              revoke: (token: string, callback?: () => void) => void;
            };
          };
        }
      | undefined;
  }
}
