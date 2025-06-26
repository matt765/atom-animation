"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./SideMenu.module.css";
import { AtomIcon } from "@/assets/icons/AtomIcon";
import { PeriodicTableIcon } from "@/assets/icons/PeriodicTableIcon";
import { ChartIcon } from "@/assets/icons/ChartIcon";

const navItems = [
  { href: "/", label: "Atom Model", icon: <AtomIcon /> },
  {
    href: "/periodic-table",
    label: "Periodic Table",
    icon: <PeriodicTableIcon />,
  },
  { href: "/statistics", label: "Statistics", icon: <ChartIcon /> },
];

export const SideMenu = () => {
  const pathname = usePathname();

  return (
    <div className={styles.sideMenuContainer}>
      <nav className={styles.nav}>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.navButton} ${
              pathname === item.href ? styles.active : ""
            }`}
            title={item.label}
          >
            {item.icon}
          </Link>
        ))}
      </nav>
    </div>
  );
};
