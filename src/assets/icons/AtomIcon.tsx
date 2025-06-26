import React from "react";

export const AtomIcon = ({ size = 24 }: { size?: number }) => (
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
  >
    <circle cx="12" cy="12" r="1" />
    <path d="M20.2 20.2c2.04-2.03.02-5.91-4.14-10.06-4.16-4.16-8.03-6.18-10.06-4.14-2.03 2.04-.02 5.91 4.14 10.06 4.16 4.16 8.03 6.18 10.06 4.14Z" />
    <path d="M3.8 20.2c-2.04-2.03-.02-5.91 4.14-10.06 4.16-4.16 8.03-6.18 10.06-4.14 2.03 2.04.02 5.91-4.14 10.06-4.16 4.16-8.03 6.18-10.06 4.14Z" />
  </svg>
);