"use client";

import React, { useState, useRef, useEffect } from "react";
import styles from "./TopBarMobile.module.css";
import { useAppStore, deriveCurrentElement } from "@/store/appStore";
import { HamburgerIcon } from "@/assets/icons/HamburgerIcon";
import { MobileMenu } from "./MobileMenu";

export const TopBarMobile = () => {
  const element = useAppStore(deriveCurrentElement);
  const { hideInfoPanel } = useAppStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const topBarRef = useRef<HTMLDivElement>(null);

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    const willBeOpen = !isMenuOpen;
    if (willBeOpen) {
      hideInfoPanel();
    }
    setIsMenuOpen(willBeOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        topBarRef.current &&
        !topBarRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={topBarRef} className={styles.topBarWrapper}>
      <div className={styles.topBar}>
        <div className={styles.spacer} />
        <div className={styles.elementInfo}>
          <span className={styles.elementSymbol}>{element.symbol}</span>
          <span className={styles.elementName}>{element.name}</span>
        </div>
        <button
          onClick={toggleMenu}
          className={styles.hamburgerButton}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          <HamburgerIcon />
        </button>
      </div>
      {isMenuOpen && <MobileMenu onLinkClick={() => setIsMenuOpen(false)} />}
    </div>
  );
};
