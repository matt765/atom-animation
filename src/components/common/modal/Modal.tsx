// components/common/modal/Modal.tsx

"use client";

import React, {
  useRef,
  useCallback,
  useEffect,
  useState,
  RefObject,
} from "react";
import { createPortal } from "react-dom";
import styles from "./Modal.module.css";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useAppStore } from "@/store/appStore";

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
  position: { x: number; y: number };
  isManuallyPositioned: boolean;
  isSmallScreen: boolean;
  isPeriodicTableMode?: boolean;
  isDetailedMode?: boolean;
  isCentered?: boolean;
  ignoredRefs?: RefObject<HTMLElement | null>[];
  renderHeader: (dragProps: {
    listeners: ReturnType<typeof useDraggable>["listeners"];
    attributes: ReturnType<typeof useDraggable>["attributes"];
  }) => React.ReactNode;
}

export const Modal = ({
  children,
  onClose,
  position,
  isManuallyPositioned,
  isSmallScreen,
  isPeriodicTableMode,
  isDetailedMode,
  isCentered,
  ignoredRefs,
  renderHeader,
}: ModalProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null!);

  const { setPanelPosition, setPanelManuallyPositioned } = useAppStore();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      if (panelRef.current && panelRef.current.contains(target)) {
        return;
      }

      if (ignoredRefs?.some((ref) => ref.current?.contains(target))) {
        return;
      }

      if (target.closest('[data-is-periodic-grid="true"]')) {
        return;
      }

      onClose();
    };

    document.addEventListener("mousedown", handleMouseDown);
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, [onClose, ignoredRefs]);

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: "draggable-modal",
      disabled: isSmallScreen,
    });

  useEffect(() => {
    if (isDragging && !isManuallyPositioned && panelRef.current) {
      const rect = panelRef.current.getBoundingClientRect();
      setPanelPosition({ x: rect.left, y: rect.top });
      setPanelManuallyPositioned(true);
    }
  }, [
    isDragging,
    isManuallyPositioned,
    setPanelPosition,
    setPanelManuallyPositioned,
  ]);

  const style: React.CSSProperties = {};
  if (!isSmallScreen) {
    style.position = "fixed";
    style.top = `${position.y}px`;
    style.left = `${position.x}px`;
    style.transform = transform ? CSS.Translate.toString(transform) : undefined;
  }

  const combinedRef = useCallback(
    (node: HTMLDivElement) => {
      setNodeRef(node);
      panelRef.current = node;
    },
    [setNodeRef]
  );

  if (!isMounted) {
    return null;
  }

  const modalContent = (
    <div
      ref={combinedRef}
      className={`${styles.panel} ${
        isSmallScreen ? styles.mobileFullScreen : ""
      } ${isCentered && !isManuallyPositioned ? styles.centered : ""} ${
        isPeriodicTableMode ? styles.dark : ""
      } ${
        isDetailedMode && !isManuallyPositioned && !isSmallScreen
          ? styles.sideView
          : ""
      }`}
      style={style}
    >
      {renderHeader({ listeners, attributes })}
      <div className={styles.contentWrapper}>{children}</div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
