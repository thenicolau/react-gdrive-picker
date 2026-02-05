# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-02-05

### Added

- `<DrivePicker>` component: inline, embeddable Google Drive file browser.
- `useGoogleDrive` hook: standalone hook for Google Drive authentication and file operations.
- Google OAuth 2.0 authentication with automatic script loading.
- Folder navigation with breadcrumb trail.
- Full-text search across Google Drive files.
- Grid view with thumbnail previews.
- List view with file name, modified date, and size columns.
- Single-file and multi-file selection modes.
- Skeleton loading states for both grid and list views.
- "Load more" pagination for large folders.
- Default CSS theme with CSS custom properties (variables) for easy theming.
- Dark mode support via `prefers-color-scheme` media query.
- Responsive grid layout (4 columns desktop, 2 tablet, 1 mobile).
- BEM-like class names for unstyled/custom usage without the default theme.
- Full TypeScript support with exported types.
- ESM and CommonJS output bundles.
- Compatible with React 18+ and React 19.
- Compatible with Next.js App Router (`"use client"` directives included).
