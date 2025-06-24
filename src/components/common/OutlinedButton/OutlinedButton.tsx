"use client";

import React from "react";
import styles from "./OutlinedButton.module.css";

type OutlinedButtonProps = {
  onClick: () => void;
  children: React.ReactNode;
  className?: string; // Pozwala na przekazanie dodatkowych klas
  ariaLabel?: string;
};

export const OutlinedButton = ({
  onClick,
  children,
  className = "",
  ariaLabel,
}: OutlinedButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`${styles.button} ${className}`}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
};
