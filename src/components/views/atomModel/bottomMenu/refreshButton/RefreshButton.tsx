import React from "react";

import { RefreshIcon } from "@/assets/icons/RefreshIcon";
import styles from "./RefreshButton.module.css";

type RefreshButtonProps = {
  onClick: () => void;
};

export const RefreshButton = ({ onClick }: RefreshButtonProps) => (
  <button
    className={styles.button}
    onClick={onClick}
    aria-label="Refresh view"
    title="Reset view"
  >
    <RefreshIcon fill="rgb(255,255,255,0.6)" />
  </button>
);
