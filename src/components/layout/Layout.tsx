"use client";

import React, { useRef, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import styles from "./Layout.module.css";
import { InfoPanel } from "../AtomModel/InfoPanel";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";

import { useAppStore, useCurrentElement } from "../../store/appStore";
import { BottomMenu } from "./BottomMenu/BottomMenu";
import { BottomMenuMobile } from "./BottomMenu/BottomMenuMobile";
import { SideMenu } from "./SideMenu/SideMenu";
import { TopBarMobile } from "./TopBarMobile/TopBarMobile";

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
    isPanelVisible,
    panelPosition,
    infoPanelContent,
    hideInfoPanel,
    setPanelPosition,
    resetActionCounters,
  } = useAppStore();

  const current3DElement = useCurrentElement();
  const pathname = usePathname();
  const isMobile = useIsMobile();

  // On mobile, we assume only the main page with the atom model is available.
  const isMainPage = isMobile ? true : pathname === "/";
  const isPeriodicTable = !isMobile && pathname === "/periodic-table";
  const isStatistics = !isMobile && pathname === "/statistics";

  const clickOutsideTracker = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    hideInfoPanel();
    setPanelPosition({ x: 0, y: 0 });
    resetActionCounters();
  }, [pathname, hideInfoPanel, setPanelPosition, resetActionCounters]);

  useEffect(() => {
    if (!isPanelVisible || isPeriodicTable) return;

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      const target = e.target as HTMLElement;

      const onInfoPanel = target.closest('[class*="InfoPanel_panel"]');
      const onBottomMenu = target.closest('[class*="BottomMenu_bottomMenu"]');
      const onBottomMenuMobile = target.closest(
        '[class*="BottomMenuMobile_bottomMenuMobile"]'
      );
      const onTopBarMobile = target.closest('[class*="TopBarMobile_topBar"]');

      if (onInfoPanel || onBottomMenu || onBottomMenuMobile || onTopBarMobile) {
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
          setPanelPosition({ x: 0, y: 0 });
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
  }, [isPanelVisible, hideInfoPanel, setPanelPosition, isPeriodicTable]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 10 },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { delta } = event;
    setPanelPosition({
      x: panelPosition.x + delta.x,
      y: panelPosition.y + delta.y,
    });
  };

  const contentForPanel = isPeriodicTable
    ? infoPanelContent
    : { type: "element" as const, data: current3DElement };

  // Determine whether to show any bottom menu
  const showControls = isMainPage && !isPeriodicTable && !isStatistics;

  return (
    <div className={styles.mainContainer}>
      {!isMobile && <SideMenu />}
      {isMobile && showControls && <TopBarMobile />}

      <main className={`${styles.main} ${isMobile ? styles.mobileLayout : ""}`}>
        {" "}
        {children}
      </main>

      {showControls && (isMobile ? <BottomMenuMobile /> : <BottomMenu />)}

      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        {isPanelVisible && contentForPanel && (
          <InfoPanel
            content={contentForPanel}
            position={panelPosition}
            isCentered={isPeriodicTable}
            isOnPeriodicTableView={isPeriodicTable}
          />
        )}
      </DndContext>
    </div>
  );
};
