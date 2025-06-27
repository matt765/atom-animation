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

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
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

  const isMainPage = isMobile ? true : pathname === "/";
  const isPeriodicTable = !isMobile && pathname === "/periodic-table";
  const isStatistics = !isMobile && pathname === "/statistics";

  const clickOutsideTracker = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    hideInfoPanel();
    resetActionCounters();
  }, [pathname, hideInfoPanel, resetActionCounters]);

  useEffect(() => {
    const isPanelVisible = panelMode !== "hidden";

    if (!isPanelVisible || panelMode === "periodic-table") return;

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      const target = e.target as HTMLElement;

      const onInfoPanel = target.closest('[class*="InfoPanel_panel"]');
      const onBottomMenu = target.closest('[class*="BottomMenu_bottomMenu"]');
      const onBottomMenuMobile = target.closest(
        '[class*="BottomMenuMobile_bottomMenuMobile"]'
      );
      const onTopBarMobile = target.closest('[class*="TopBarMobile_topBar"]');
      const onGitHubLink = target.closest('a[href*="github.com"]');

      if (
        onInfoPanel ||
        onBottomMenu ||
        onBottomMenuMobile ||
        onTopBarMobile ||
        onGitHubLink
      ) {
        return;
      }

      clickOutsideTracker.current = { x: e.clientX, y: e.clientY };
    };
    const handleMouseUp = (e: MouseEvent) => {
      if (e.button !== 0) return;
      if (clickOutsideTracker.current) {
        const dist = Math.sqrt(
          (e.clientX - clickOutsideTracker.current.x) ** 2 +
            (e.clientY - clickOutsideTracker.current.y) ** 2
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

  const contentForPanel = isPeriodicTable
    ? infoPanelContent
    : { type: "element" as const, data: current3DElement };

  const showControls = isMainPage && !isPeriodicTable && !isStatistics;
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
      {!isMobile && <SideMenu />}
      {isMobile && showControls && <TopBarMobile />}

      {/* ZMIANA: Dodana warunkowa klasa .scrollable */}
      <main
        className={`${styles.main} ${isMobile ? styles.mobileLayout : ""} ${
          pathname === "/statistics" ? styles.scrollable : ""
        }`}
      >
        {children}
      </main>

      {showControls && (isMobile ? <BottomMenuMobile /> : <BottomMenu />)}

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
