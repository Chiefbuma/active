import type React from 'react';

const Logo = ({ className = '', ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 200 50"
    className={className}
    {...props}
  >
    <style>
      {`
        .logo-text {
          font-family: 'PT Sans', sans-serif;
          font-weight: 700;
        }
        .logo-mark-fill {
            fill: hsl(var(--primary));
        }
        .logo-text-fill {
            fill: hsl(var(--foreground));
        }
      `}
    </style>
    <g>
      {/* Abstract medical cross mark */}
      <path
        className="logo-mark-fill"
        d="M25,5 L30,5 L30,20 L45,20 L45,25 L30,25 L30,40 L25,40 L25,25 L10,25 L10,20 L25,20 Z"
        transform="rotate(45 27.5 22.5)"
      />
      {/* Text */}
      <text
        x="60"
        y="32"
        fontSize="24"
        className="logo-text logo-text-fill"
      >
        Taria Health
      </text>
    </g>
  </svg>
);

export default Logo;
