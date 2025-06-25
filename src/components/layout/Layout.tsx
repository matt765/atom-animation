"use client";

import React, { useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import styles from "./Layout.module.css";

import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";

import { useAppStore } from "../../store/appStore";
import { BottomMenu } from "./BottomMenu/BottomMenu";
import { SideMenu } from "./SideMenu/SideMenu";
import { InfoPanel } from "../AtomModel/InfoPanel";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const {
    isPanelVisible,
    panelPosition,
    infoPanelContent,
    hideInfoPanel,
    setPanelPosition,
    resetActionCounters,
  } = useAppStore();

  const pathname = usePathname();
  const isPeriodicTable = pathname === "/periodic-table";

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

      if (onInfoPanel || onBottomMenu) {
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

  return (
    <div className={styles.mainContainer}>
      <SideMenu />
      <main className={styles.main}> {children}</main>

      {!isPeriodicTable && <BottomMenu />}

      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        {isPanelVisible && infoPanelContent && (
          <InfoPanel
            content={infoPanelContent}
            position={panelPosition}
            isCentered={isPeriodicTable}
            isOnPeriodicTableView={isPeriodicTable}
          />
        )}
      </DndContext>
    </div>
  );
};
