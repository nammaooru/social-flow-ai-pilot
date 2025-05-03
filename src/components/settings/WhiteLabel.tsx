
import React from "react";

const WhiteLabel: React.FC<{ className?: string, size?: number }> = ({ className, size = 24 }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
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
      <rect width="18" height="12" x="3" y="6" rx="2" />
      <path d="M3 10h18" />
      <path d="M7 15h2" />
      <path d="M11 15h6" />
    </svg>
  );
};

export default WhiteLabel;
