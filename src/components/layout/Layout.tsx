"use client";

import React, { useRef, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import styles from "./Layout.module.css";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import { createPortal } from "react-dom";

import { useAppStore, deriveCurrentElement } from "../../store/appStore";
import { BottomMenu } from "./BottomMenu/BottomMenu";
import { BottomMenuMobile } from "./BottomMenu/BottomMenuMobile";
import { SideMenu } from "./SideMenu/SideMenu";
import { TopBarMobile } from "./TopBarMobile/TopBarMobile";
import { GitHubLink } from "./GithubLink/GithubLink";
import { InfoPanel } from "../AtomModel/InfoPanel/InfoPanel";

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1280);
    };

    if (typeof window !== "undefined") {
      checkScreenSize();
      window.addEventListener("resize", checkScreenSize);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", checkScreenSize);
      }
    };
  }, []);

  return isMobile;
};

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const {
    panelMode,
    panelPosition,
    infoPanelContent,
    hideInfoPanel,
    setPanelPosition,
    setPanelManuallyPositioned,
    resetActionCounters,
    isNavigating,
  } = useAppStore();

  const current3DElement = useAppStore(deriveCurrentElement);
  const pathname = usePathname();
  const isMobile = useIsMobile();

  const clickOutsideTracker = useRef<{ x: number; y: number } | null>(null);

  // Zaktualizowana, bardziej czytelna logika widoczności
  const showDesktopControls = !isMobile && pathname === "/";
  const showMobileBottomControls = isMobile && pathname === "/";
  const showMobileTopBar = isMobile;

  useEffect(() => {
    hideInfoPanel();
    resetActionCounters();
  }, [pathname, hideInfoPanel, resetActionCounters]);

  useEffect(() => {
    const isPanelVisible = panelMode !== "hidden";

    if (!isPanelVisible) return;

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      const target = e.target as HTMLElement;

      const ignoredElements = [
        '[class*="InfoPanel_panel"]',
        '[class*="BottomMenu_bottomMenu"]',
        '[class*="BottomMenuMobile_bottomMenuMobile"]',
        '[class*="TopBarMobile_topBar"]',
        'a[href*="github.com"]',
      ];

      if (ignoredElements.some((selector) => target.closest(selector))) {
        return;
      }

      clickOutsideTracker.current = { x: e.clientX, y: e.clientY };
    };
    const handleMouseUp = (e: MouseEvent) => {
      if (e.button !== 0) return;
      if (clickOutsideTracker.current) {
        const dist = Math.hypot(
          e.clientX - clickOutsideTracker.current.x,
          e.clientY - clickOutsideTracker.current.y
        );
        if (dist < 5) {
          hideInfoPanel();
        }
      }
      clickOutsideTracker.current = null;
    };
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [panelMode, hideInfoPanel]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 10 },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { delta } = event;
    const currentPosition = useAppStore.getState().panelPosition;
    setPanelPosition({
      x: currentPosition.x + delta.x,
      y: currentPosition.y + delta.y,
    });
    setPanelManuallyPositioned(true);
  };

  const contentForPanel =
    pathname === "/periodic-table"
      ? infoPanelContent
      : { type: "element" as const, data: current3DElement };

  const isPanelVisible = panelMode !== "hidden";

  return (
    <div className={styles.mainContainer}>
      {isNavigating &&
        createPortal(
          <div className={styles.fullScreenLoader}>
            <div className={styles.loaderSpinner}></div>
          </div>,
          document.body
        )}
      <GitHubLink />
      <SideMenu />
      {showMobileTopBar && <TopBarMobile />}

      <main
        className={`${styles.main} ${isMobile ? styles.mobileLayout : ""} ${
          pathname === "/statistics" ? styles.scrollable : ""
        }`}
      >
        {children}
      </main>

      {isMobile
        ? showMobileBottomControls && <BottomMenuMobile />
        : showDesktopControls && <BottomMenu />}

      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        {isPanelVisible && contentForPanel && (
          <InfoPanel
            content={contentForPanel}
            position={panelPosition}
            mode={panelMode}
          />
        )}
      </DndContext>
    </div>
  );
};
