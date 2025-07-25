"use client";

import React, { useEffect, useState, useRef, RefObject } from "react";
import { createPortal } from "react-dom";
import { useAppStore, ExtendedElementConfig } from "@/store/appStore";
import { FullGroupData } from "@/elementsData/groupsData";
import { useDraggableModal } from "@/hooks/useDraggableModal";
import { useClickOutside } from "@/hooks/useClickOutside";
import { ElementModalExtended } from "../elementModalExtended/ElementModalExtended";
import { GroupModal } from "../groupModal/GroupModal";
import styles from "./ModalContainer.module.css";

interface ModalContainerProps {
  ignoredRefs?: RefObject<HTMLElement | null>[];
}

export const ModalContainer = ({ ignoredRefs }: ModalContainerProps) => {
  const {
    periodicTableModal,
    hidePeriodicTableModal,
    setModalPosition,
    setModalManuallyPositioned,
  } = useAppStore();
  const {
    content,
    currentPosition: position,
    isManuallyPositioned,
    isVisible,
  } = periodicTableModal;

  const [isMounted, setIsMounted] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useClickOutside(modalRef, hidePeriodicTableModal, ignoredRefs);

  const {
    setNodeRef,
    listeners,
    attributes,
    style: dragStyle,
    isDragging,
  } = useDraggableModal("periodic-table-modal");

  useEffect(() => {
    if (isDragging && !isManuallyPositioned && modalRef.current) {
      const rect = modalRef.current.getBoundingClientRect();
      setModalPosition("periodicTable", { x: rect.left, y: rect.top });
      setModalManuallyPositioned("periodicTable", true);
    }
  }, [
    isDragging,
    isManuallyPositioned,
    setModalPosition,
    setModalManuallyPositioned,
  ]);

  const isSmallScreen =
    typeof window !== "undefined" && window.innerWidth < 600;

  if (!isMounted || !isVisible || !content) {
    return null;
  }

  const getTitle = () => {
    if (content.type === "group") return content.data.title;
    const element = content.data;
    if (element.name === "Unknown") return "Custom Particle";
    if (element.isIsotope)
      return `Isotope: ${element.name}-${Math.round(element.atomicWeight)}`;
    if (element.charge !== 0) return `Ion: ${element.name}`;
    return element.title;
  };

  const modalStyle: React.CSSProperties = {
    ...(!isSmallScreen && !isManuallyPositioned && { margin: "auto" }),
    ...(!isSmallScreen &&
      isManuallyPositioned && {
        top: `${position.y}px`,
        left: `${position.x}px`,
      }),
    ...dragStyle,
  };

  const modalClasses = [
    styles.panel,
    isSmallScreen ? styles.mobileFullScreen : styles.fixed,
    !isManuallyPositioned && !isSmallScreen ? styles.centered : "",
  ]
    .filter(Boolean)
    .join(" ");

  const modalJSX = (
    <div ref={modalRef} className={modalClasses} style={modalStyle}>
      <div ref={setNodeRef}>
        <div className={styles.header} {...listeners} {...attributes}>
          <h3 className={styles.title}>{getTitle()}</h3>
          <button
            onClick={hidePeriodicTableModal}
            className={styles.closeButton}
          >
            &times;
          </button>
        </div>
        <div className={styles.contentWrapper}>
          <div
            style={{
              display: content.type === "element" ? "flex" : "none",
              flexDirection: "column",
              flexGrow: 1,
            }}
          >
            {content.type === "element" && (
              <ElementModalExtended
                element={content.data as ExtendedElementConfig}
              />
            )}
          </div>
          <div
            style={{
              display: content.type === "group" ? "flex" : "none",
              flexDirection: "column",
              flexGrow: 1,
            }}
          >
            {content.type === "group" && (
              <GroupModal group={content.data as FullGroupData} />
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalJSX, document.body);
};
