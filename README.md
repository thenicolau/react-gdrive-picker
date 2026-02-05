# react-gdrive-picker

A customizable, inline Google Drive file picker component for React. Browse folders, search files, preview thumbnails, and select single or multiple files — all without leaving your app.

## Features

- **Inline / Embedded** — Renders directly in the page flow, no modal or popup required
- **Folder Navigation** — Browse through Drive folders with a clickable breadcrumb trail
- **Search** — Full-text search across your Google Drive files with debounced input
- **Grid & List Views** — Toggle between thumbnail grid and detailed list views
- **Single & Multi-Select** — Pick one file at a time or select multiple with a confirmation step
- **Thumbnail Previews** — Automatic thumbnail loading for images and videos
- **Customizable Theme** — Ship with a default theme using CSS custom properties, or style from scratch
- **Dark Mode** — Automatic dark mode support via `prefers-color-scheme`
- **Zero Dependencies** — Only React as a peer dependency, nothing else
- **TypeScript** — Full type definitions included
- **Next.js Compatible** — Works with App Router (`"use client"` directives included)

## Installation

```bash
npm install react-gdrive-picker
```

```bash
yarn add react-gdrive-picker
```

```bash
pnpm add react-gdrive-picker
```

### Peer Dependencies

React 18 or later is required:

```json
{
  "react": ">=18.0.0",
  "react-dom": ">=18.0.0"
}
```

## Prerequisites

Before using this library, you need Google API credentials:

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select an existing one)
3. Enable the **Google Drive API** in _APIs & Services > Library_
4. Create an **OAuth 2.0 Client ID** in _APIs & Services > Credentials_
   - Application type: **Web application**
   - Add your domain to **Authorized JavaScript origins** (e.g., `http://localhost:5173` for development)
5. Create an **API Key** in _APIs & Services > Credentials_
   - Optionally restrict it to the Google Drive API

## Quick Start

```tsx
import { DrivePicker } from "react-gdrive-picker";
import "react-gdrive-picker/styles.css";

function App() {
  return (
    <DrivePicker
      clientId="YOUR_GOOGLE_CLIENT_ID"
      apiKey="YOUR_GOOGLE_API_KEY"
      onSelect={(files) => {
        console.log("Selected:", files);
      }}
    />
  );
}
```

## `<DrivePicker>` API

### Required Props

| Prop | Type | Description |
|------|------|-------------|
| `clientId` | `string` | Google OAuth 2.0 Client ID |
| `apiKey` | `string` | Google API Key |
| `onSelect` | `(files: GoogleDriveFile[]) => void` | Called when files are selected |

### Optional Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `multiple` | `boolean` | `false` | Enable multi-file selection |
| `mimeTypes` | `string[]` | `["image/jpeg", "image/png", "image/webp", "video/mp4", "video/quicktime"]` | Allowed file MIME types |
| `defaultView` | `"grid" \| "list"` | `"grid"` | Initial view mode |
| `showToolbar` | `boolean` | `true` | Show the search bar and view toggle |
| `showBreadcrumb` | `boolean` | `true` | Show the folder breadcrumb navigation |
| `className` | `string` | — | Additional CSS class on the wrapper element |
| `onAuthChange` | `(authenticated: boolean) => void` | — | Called when authentication state changes |
| `onError` | `(error: Error) => void` | — | Called when an error occurs |
| `onNavigate` | `(folder: GoogleDriveFolder \| null) => void` | — | Called when navigating into a folder (`null` = root) |

### Selection Behavior

- **Single mode** (`multiple={false}`): Clicking a file immediately triggers `onSelect` with a single-element array.
- **Multi mode** (`multiple={true}`): Clicking a file toggles its selection. A bottom bar shows the count and a "Select" button to confirm. `onSelect` fires with all selected files.

## `useGoogleDrive` Hook

For custom UIs, you can use the hook directly instead of the `<DrivePicker>` component:

```tsx
import { useGoogleDrive } from "react-gdrive-picker";

function CustomPicker() {
  const {
    isLoading,
    isAuthenticated,
    signIn,
    signOut,
    error,
    getAccessToken,
    listFiles,
    searchFiles,
    isListingFiles,
  } = useGoogleDrive({
    clientId: "YOUR_GOOGLE_CLIENT_ID",
    apiKey: "YOUR_GOOGLE_API_KEY",
    onError: (err) => console.error(err),
    mimeTypes: ["image/jpeg", "image/png"],
  });

  const handleBrowse = async () => {
    await signIn();
    const { files, folders, nextPageToken } = await listFiles();
    console.log(files, folders);
  };

  const handleSearch = async () => {
    const { files } = await searchFiles("photo");
    console.log(files);
  };

  // Build your own UI...
}
```

### Hook Options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `clientId` | `string` | Yes | Google OAuth 2.0 Client ID |
| `apiKey` | `string` | Yes | Google API Key |
| `onError` | `(error: Error) => void` | No | Error callback |
| `mimeTypes` | `string[]` | No | Allowed MIME types for file listing |

### Hook Return Value

| Property | Type | Description |
|----------|------|-------------|
| `isLoading` | `boolean` | `true` while Google API scripts are loading |
| `isAuthenticated` | `boolean` | `true` after successful OAuth sign-in |
| `signIn` | `() => Promise<void>` | Triggers the Google OAuth consent flow |
| `signOut` | `() => void` | Revokes the access token and signs out |
| `error` | `Error \| null` | The most recent error, or `null` |
| `getAccessToken` | `() => string \| null` | Returns the current OAuth access token |
| `listFiles` | `(folderId?, pageToken?) => Promise<{files, folders, nextPageToken?}>` | Lists files and folders in a Drive folder |
| `searchFiles` | `(query, pageToken?) => Promise<{files, nextPageToken?}>` | Searches files by name across the entire Drive |
| `isListingFiles` | `boolean` | `true` while a `listFiles` or `searchFiles` call is in progress |

## Types

All types are exported for your convenience:

```tsx
import type {
  GoogleDriveFile,
  GoogleDriveFolder,
  DrivePickerProps,
  ViewMode,
  UseGoogleDriveOptions,
  UseGoogleDriveReturn,
} from "react-gdrive-picker";
```

### `GoogleDriveFile`

```ts
interface GoogleDriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: number;
  thumbnailLink?: string;
  modifiedTime?: string;
  iconLink?: string;
}
```

### `GoogleDriveFolder`

```ts
interface GoogleDriveFolder {
  id: string;
  name: string;
}
```

## Styling

### Using the Default Theme

Import the CSS file for a clean, Google-inspired look:

```tsx
import "react-gdrive-picker/styles.css";
```

The theme supports both light and dark mode automatically via `prefers-color-scheme`.

### Customizing with CSS Variables

Override any of the following CSS custom properties on the `.gdrive-picker` selector:

```css
.gdrive-picker {
  --gdp-bg: #ffffff;
  --gdp-bg-hover: #f5f5f5;
  --gdp-bg-selected: #e8f0fe;
  --gdp-text: #1f1f1f;
  --gdp-text-secondary: #5f6368;
  --gdp-border: #e0e0e0;
  --gdp-accent: #1a73e8;
  --gdp-accent-hover: #1557b0;
  --gdp-accent-text: #ffffff;
  --gdp-radius: 8px;
  --gdp-radius-sm: 4px;
  --gdp-font-family: inherit;
  --gdp-font-size: 14px;
  --gdp-grid-columns: 4;
  --gdp-item-gap: 12px;
  --gdp-thumbnail-size: 120px;
}
```

#### Example: Custom accent color

```css
.gdrive-picker {
  --gdp-accent: #ff6b00;
  --gdp-accent-hover: #e05f00;
  --gdp-radius: 4px;
}
```

#### Example: Force dark theme

```css
.gdrive-picker {
  --gdp-bg: #1e1e1e;
  --gdp-bg-hover: #2a2a2a;
  --gdp-bg-selected: #1a3a5c;
  --gdp-text: #e0e0e0;
  --gdp-text-secondary: #9aa0a6;
  --gdp-border: #3c3c3c;
  --gdp-accent: #8ab4f8;
  --gdp-accent-hover: #aecbfa;
  --gdp-accent-text: #1e1e1e;
}
```

### Styling from Scratch

Don't import the CSS file. The component renders with semantic BEM-like class names that you can target directly:

```
.gdrive-picker
.gdrive-picker__toolbar
.gdrive-picker__search
.gdrive-picker__search-input
.gdrive-picker__view-toggle
.gdrive-picker__view-button
.gdrive-picker__view-button--active
.gdrive-picker__breadcrumb
.gdrive-picker__breadcrumb-item
.gdrive-picker__breadcrumb-item--active
.gdrive-picker__content
.gdrive-picker__grid
.gdrive-picker__grid-item
.gdrive-picker__grid-item--folder
.gdrive-picker__grid-item--file
.gdrive-picker__grid-item--selected
.gdrive-picker__grid-item-thumbnail
.gdrive-picker__grid-item-image
.gdrive-picker__grid-item-name
.gdrive-picker__grid-item-meta
.gdrive-picker__list
.gdrive-picker__list-header
.gdrive-picker__list-item
.gdrive-picker__list-item--folder
.gdrive-picker__list-item--file
.gdrive-picker__list-item--selected
.gdrive-picker__list-item-icon
.gdrive-picker__list-item-name
.gdrive-picker__list-item-date
.gdrive-picker__list-item-size
.gdrive-picker__signin
.gdrive-picker__signin-button
.gdrive-picker__selection-bar
.gdrive-picker__selection-button
.gdrive-picker__load-more
.gdrive-picker__empty
.gdrive-picker__error
.gdrive-picker__spinner
```

You can also pass a `className` prop to add your own class to the wrapper for scoped overrides.

## MIME Types

The `mimeTypes` prop controls which file types are shown. Some common values:

| MIME Type | Description |
|-----------|-------------|
| `image/jpeg` | JPEG images |
| `image/png` | PNG images |
| `image/webp` | WebP images |
| `image/gif` | GIF images |
| `image/svg+xml` | SVG images |
| `video/mp4` | MP4 videos |
| `video/quicktime` | QuickTime / MOV videos |
| `application/pdf` | PDF documents |
| `application/vnd.google-apps.document` | Google Docs |
| `application/vnd.google-apps.spreadsheet` | Google Sheets |
| `application/vnd.google-apps.presentation` | Google Slides |
| `audio/mpeg` | MP3 audio |

To show all file types, pass a broad list or use wildcards in your Google Cloud Console API restrictions.

## Google API Scopes

The library requests the following OAuth scopes:

- `https://www.googleapis.com/auth/drive.readonly` — Read-only access to file content
- `https://www.googleapis.com/auth/drive.metadata.readonly` — Read-only access to file metadata

These are **read-only** scopes. The library never modifies, uploads, or deletes files.

## Browser Support

Works in all modern browsers (Chrome, Firefox, Safari, Edge). Requires JavaScript enabled.

## License

[MIT](./LICENSE)
