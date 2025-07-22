"use client";

import React, { useEffect, useState, useRef } from "react";
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
import { useAppStore, deriveCurrentElement } from "@/store/appStore";

import { SideMenu } from "./sideMenu/SideMenu";
import { TopBarMobile } from "./topBarMobile/TopBarMobile";
import { GitHubLink } from "./githubLink/GithubLink";
import { BottomMenuMobile } from "@/components/views/atomModel/bottomMenu/BottomMenuMobile";
import { BottomMenu } from "@/components/views/atomModel/bottomMenu/BottomMenu";
import { ModalContainer } from "@/components/views/periodicTable/modalContainer/ModalContainer";
import { ElementModalSimple } from "@/components/views/atomModel/elementModalSimple/ElementModalSimple";

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkScreenSize = () => setIsMobile(window.innerWidth < 1280);
    if (typeof window !== "undefined") {
      checkScreenSize();
      window.addEventListener("resize", checkScreenSize);
      return () => window.removeEventListener("resize", checkScreenSize);
    }
  }, []);
  return isMobile;
};

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const {
    panelMode,
    panelPosition,
    hideInfoPanel,
    setPanelPosition,
    setPanelManuallyPositioned,
    resetActionCounters,
    isNavigating,
    isPanelManuallyPositioned,
  } = useAppStore();

  const current3DElement = useAppStore(deriveCurrentElement);
  const pathname = usePathname();
  const isMobile = useIsMobile();

  const sideMenuRef = useRef<HTMLDivElement>(null);
  const topBarRef = useRef<HTMLDivElement>(null);
  const bottomMenuRef = useRef<HTMLDivElement>(null);
  const githubLinkRef = useRef<HTMLDivElement>(null);

  const ignoredRefs = [sideMenuRef, topBarRef, bottomMenuRef, githubLinkRef];

  const showDesktopControls = !isMobile && pathname === "/";
  const showMobileBottomControls = isMobile && pathname === "/";
  const showMobileTopBar = isMobile;

  useEffect(() => {
    hideInfoPanel();
    resetActionCounters();
  }, [pathname, hideInfoPanel, resetActionCounters]);

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

  const renderActiveModal = () => {
    const isPanelVisible = panelMode !== "hidden";
    if (!isPanelVisible) return null;

    if (pathname === "/") {
      return (
        <ElementModalSimple
          element={current3DElement}
          position={panelPosition}
          isSmallScreen={isMobile}
          isManuallyPositioned={isPanelManuallyPositioned}
          ignoredRefs={ignoredRefs}
        />
      );
    }

    return null;
  };

  return (
    <div className={styles.mainContainer}>
      {isNavigating &&
        createPortal(
          <div className={styles.fullScreenLoader}>
            <div className={styles.loaderSpinner}></div>
          </div>,
          document.body
        )}
      <div ref={githubLinkRef}>
        <GitHubLink />
      </div>
      <div ref={sideMenuRef}>
        <SideMenu />
      </div>
      {showMobileTopBar && (
        <div ref={topBarRef}>
          <TopBarMobile />
        </div>
      )}

      <main
        className={`${styles.main} ${isMobile ? styles.mobileLayout : ""} ${
          pathname === "/statistics" ? styles.scrollable : ""
        }`}
      >
        {children}
      </main>

      <div ref={bottomMenuRef}>
        {isMobile
          ? showMobileBottomControls && <BottomMenuMobile />
          : showDesktopControls && <BottomMenu />}
      </div>

      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        {renderActiveModal()}
        {pathname === "/periodic-table" && (
          <ModalContainer ignoredRefs={ignoredRefs} />
        )}
      </DndContext>
    </div>
  );
};
