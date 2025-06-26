"use client";

import React from "react";
import styles from "./TopBarMobile.module.css";
import { useAppStore, deriveCurrentElement } from "@/store/appStore";

/**
 * TopBarMobile component
 * Displays the current element's symbol and name at the top of the screen on mobile devices.
 * It is a fixed bar that is always visible.
 */
export const TopBarMobile = () => {
  const element = useAppStore(deriveCurrentElement);

  return (
    <div className={styles.topBar}>
      <span className={styles.elementSymbol}>{element.symbol}</span>
      <span className={styles.elementName}>{element.name}</span>
    </div>
  );
};
