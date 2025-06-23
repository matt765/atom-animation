"use client";

import React, { useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import styles from "./Layout.module.css";
import { ElementInfoPanel } from "../AtomModel/ElementInfoPanel";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";

import { useAppStore, useCurrentElement } from "../../store/appStore";
import { RefreshButton } from "./RefreshButton/RefreshButton";
import { BottomMenu } from "./BottomMenu/BottomMenu";
import { SideMenu } from "./SideMenu/SideMenu";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const {
    isPanelVisible,
    panelPosition,
    hideInfoPanel,
    setPanelPosition,
    triggerRefresh,
  } = useAppStore();

  const element = useCurrentElement();
  const pathname = usePathname();

  const clickOutsideTracker = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!isPanelVisible) return;
    const handleMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      const target = e.target as HTMLElement;
      const onInfoPanel = target.closest('[class*="ElementInfoPanel_panel"]');
      const onControlsPanel = target.closest(`.${styles.secondRow}`);
      if (!onInfoPanel && !onControlsPanel) {
        clickOutsideTracker.current = { x: e.clientX, y: e.clientY };
      }
    };
    const handleMouseUp = (e: MouseEvent) => {
      if (e.button !== 0) return;
      if (clickOutsideTracker.current) {
        const dist = Math.sqrt(
          (e.clientX - clickOutsideTracker.current.x) ** 2 +
            (e.clientY - clickOutsideTracker.current.y) ** 2
        );
        if (dist < 5) hideInfoPanel();
      }
      clickOutsideTracker.current = null;
    };
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isPanelVisible, hideInfoPanel, styles.secondRow]);

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

  const handleRefresh = () => {
    triggerRefresh();
    hideInfoPanel();
  };

  return (
    <div className={styles.mainContainer}>
      <RefreshButton onClick={handleRefresh} />
      <SideMenu />
      <main className={styles.main}> {children}</main>

      {pathname !== "/periodic-table" && <BottomMenu />}

      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        {isPanelVisible && (
          <ElementInfoPanel element={element} position={panelPosition} />
        )}
      </DndContext>
    </div>
  );
};
