import React from "react";

export const ShakeIcon = ({
  fill = "currentColor",
  size = 20,
}: {
  fill?: string;
  size?: number | string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M16.8897 9.99994C16.5138 9.28314 15.8239 8.76184 15 8.57994M12 4.57994V8.57994M9.87973 17.5799C9.17613 17.2381 8.63613 16.6358 8.32973 15.9201M7.10973 13.9999C6.71613 13.2831 6.17613 12.7618 5.49973 12.5799M7.10973 9.99994C6.71613 10.7167 6.17613 11.2381 5.49973 11.42M12 20.58V15.42M14.12 6.57994C14.8239 6.23804 15.3638 5.63584 15.6703 4.92004"
      stroke={fill}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M17 14L19 12L17 10"
      stroke={fill}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
