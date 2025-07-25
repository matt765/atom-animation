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
import { ElementModalSimple } from "@/components/views/atomModel/elementModalSimple/ElementModalSimple";
import { ModalContainer } from "../views/periodicTable/modalContainer/ModalContainer";

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
    homepageModal,
    hideHomepageModal,
    hidePeriodicTableModal,
    setModalPosition,
    setModalManuallyPositioned,
    resetActionCounters,
    isNavigatingBetweenPages,
  } = useAppStore();

  const liveElement = useAppStore(deriveCurrentElement);

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
    hideHomepageModal();
    hidePeriodicTableModal();
    resetActionCounters();
  }, [
    pathname,
    hideHomepageModal,
    hidePeriodicTableModal,
    resetActionCounters,
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 10 },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { delta, active } = event;
    const modalId = active.id as string;

    let modalType: "homepage" | "periodicTable" | null = null;

    if (modalId.startsWith("homepage-")) {
      modalType = "homepage";
    } else if (modalId.startsWith("periodic-table")) {
      modalType = "periodicTable";
    }

    if (!modalType) return;

    const currentPosition =
      useAppStore.getState()[`${modalType}Modal`].currentPosition;

    setModalPosition(modalType, {
      x: currentPosition.x + delta.x,
      y: currentPosition.y + delta.y,
    });
    setModalManuallyPositioned(modalType, true);
  };

  return (
    <div className={styles.mainContainer}>
      {isNavigatingBetweenPages &&
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
        {/* Modal for Homepage */}
        {homepageModal.isVisible &&
          homepageModal.content?.type === "element" && (
            <ElementModalSimple
              element={liveElement}
              currentPosition={homepageModal.currentPosition}
              isManuallyPositioned={homepageModal.isManuallyPositioned}
              isSmallScreen={isMobile}
              onClose={hideHomepageModal}
              ignoredRefs={ignoredRefs}
            />
          )}

        {/* Modal for Periodic Table */}
        {pathname === "/periodic-table" && (
          <ModalContainer ignoredRefs={ignoredRefs} />
        )}
      </DndContext>
    </div>
  );
};
