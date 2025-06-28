"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./MobileMenu.module.css";
import { AtomIcon } from "@/assets/icons/AtomIcon";
import { PeriodicTableIcon } from "@/assets/icons/PeriodicTableIcon";

import { GitHubIcon } from "@/assets/icons/GithubIcon";


const navItems = [
  { href: "/", label: "Atom Model", icon: <AtomIcon /> },
  {
    href: "/periodic-table",
    label: "Periodic Table",
    icon: <PeriodicTableIcon />,
  }
];

interface MobileMenuProps {
  onLinkClick: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ onLinkClick }) => {
  const pathname = usePathname();

  return (
    <div className={styles.mobileMenu}>
      <nav className={styles.nav}>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.navLink} ${
              pathname === item.href ? styles.active : ""
            }`}
            onClick={onLinkClick}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      <a
        href="https://github.com/matt765/atom-animation"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.githubLink}
        aria-label="View source on GitHub"
        title="View source on GitHub"
        onClick={onLinkClick}
      >
        <GitHubIcon size={25} />
        <span>Github Repository</span>
      </a>
    </div>
  );
};
