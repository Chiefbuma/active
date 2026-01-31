export function Logo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <g fill="currentColor">
        {/* 'T' shape */}
        <rect x="30" y="20" width="40" height="10" rx="5" />
        <rect x="45" y="20" width="10" height="60" rx="5" />
        {/* Plus sign for 'Health' */}
        <rect x="65" y="45" width="20" height="10" rx="2.5" />
        <rect x="72.5" y="37.5" width="5" height="25" rx="2.5" />
      </g>
    </svg>
  );
}
