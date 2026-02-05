interface IconProps {
  size?: number;
  className?: string;
}

export function FolderIcon({ size = 20, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="M10 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V8C22 6.9 21.1 6 20 6H12L10 4Z"
        fill="#5f6368"
      />
    </svg>
  );
}

export function ImageIcon({ size = 20, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <rect x="3" y="3" width="18" height="18" rx="2" fill="#4285f4" />
      <circle cx="8.5" cy="8.5" r="2" fill="#fff" />
      <path d="M21 15L16 10L5 21H19C20.1 21 21 20.1 21 19V15Z" fill="#fff" opacity="0.8" />
    </svg>
  );
}

export function VideoIcon({ size = 20, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <rect x="2" y="4" width="20" height="16" rx="2" fill="#ea4335" />
      <path d="M10 8.5V15.5L16 12L10 8.5Z" fill="#fff" />
    </svg>
  );
}

export function FileIcon({ size = 20, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z"
        fill="#5f6368"
      />
      <path d="M14 2V8H20" fill="#fff" opacity="0.4" />
    </svg>
  );
}

export function GoogleDriveIcon({ size = 48, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 87.3 78"
      className={className}
    >
      <path
        d="M6.6 66.85L3.3 72.35C2.4 73.85 2.4 75.65 3.3 77.15L6.6 66.85Z"
        fill="#0066da"
      />
      <path
        d="M43.65 0L26.55 29.25L0 78L17.1 78L43.65 29.25L70.2 78L87.3 78L43.65 0Z"
        fill="#00ac47"
        opacity="0.6"
      />
      <path d="M43.65 0L70.2 78H87.3L43.65 0Z" fill="#ea4335" opacity="0.6" />
      <path d="M0 78H17.1L43.65 29.25L26.55 29.25L0 78Z" fill="#00832d" />
      <path d="M43.65 29.25L70.2 78H87.3L60.75 29.25H43.65Z" fill="#e37400" />
      <path d="M26.55 29.25H60.75L43.65 0L26.55 29.25Z" fill="#2684fc" />
    </svg>
  );
}

export function SearchIcon({ size = 18, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

export function GridViewIcon({ size = 18, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

export function ListViewIcon({ size = 18, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <rect x="3" y="4" width="18" height="2" rx="1" />
      <rect x="3" y="11" width="18" height="2" rx="1" />
      <rect x="3" y="18" width="18" height="2" rx="1" />
    </svg>
  );
}

export function ChevronRightIcon({ size = 16, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

export function CheckIcon({ size = 16, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export function getFileIcon(mimeType: string): typeof ImageIcon {
  if (mimeType.startsWith("image/")) return ImageIcon;
  if (mimeType.startsWith("video/")) return VideoIcon;
  return FileIcon;
}
