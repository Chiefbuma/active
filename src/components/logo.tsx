export function Logo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 150 40"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
    >
      <text
        x="0"
        y="30"
        fontFamily="PT Sans, sans-serif"
        fontSize="30"
        fontWeight="bold"
      >
        Taria
      </text>
      <text
        x="75"
        y="30"
        fontFamily="PT Sans, sans-serif"
        fontSize="30"
        fontWeight="normal"
        opacity="0.7"
      >
        Health
      </text>
    </svg>
  );
}
