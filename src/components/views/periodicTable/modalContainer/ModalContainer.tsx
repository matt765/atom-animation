"use client";

import React, { RefObject } from "react";
import { useAppStore } from "@/store/appStore";
import { Modal } from "@/components/common/modal/Modal";
import styles from "./ModalContainer.module.css";
import { useDraggable } from "@dnd-kit/core";
import { FullGroupData } from "@/elementsData/groupsData";
import { ElementModalExtended } from "../elementModalExtended/ElementModalExtended";
import { GroupModal } from "../groupModal/GroupModal";

interface ModalContainerProps {
  ignoredRefs?: RefObject<HTMLElement | null>[];
}

type DragHeaderProps = {
  listeners: ReturnType<typeof useDraggable>["listeners"];
  attributes: ReturnType<typeof useDraggable>["attributes"];
};

export const ModalContainer = ({ ignoredRefs }: ModalContainerProps) => {
  const {
    infoPanelContent,
    panelMode,
    hideInfoPanel,
    panelPosition,
    isPanelManuallyPositioned,
  } = useAppStore();

  const isVisible = panelMode !== "hidden" && infoPanelContent;

  const isSmallScreen =
    typeof window !== "undefined" && window.innerWidth < 600;

  if (!isVisible) {
    return null;
  }

  const getTitle = () => {
    if (infoPanelContent.type === "group") {
      return infoPanelContent.data.title;
    }
    const element = infoPanelContent.data;
    if (element.name === "Unknown") return "Custom Particle";
    if (element.isIsotope)
      return `Isotope: ${element.name}-${Math.round(element.atomicWeight)}`;
    if (element.charge !== 0) return `Ion: ${element.name}`;
    return element.title;
  };

  const renderHeader = ({ listeners, attributes }: DragHeaderProps) => (
    <div className={styles.header} {...listeners} {...attributes}>
      <h3 className={styles.title}>{getTitle()}</h3>
      <button onClick={hideInfoPanel} className={styles.closeButton}>
        &times;
      </button>
    </div>
  );

  return (
    <Modal
      onClose={hideInfoPanel}
      position={panelPosition}
      isManuallyPositioned={isPanelManuallyPositioned}
      isSmallScreen={isSmallScreen}
      isPeriodicTableMode={true}
      isCentered={true}
      renderHeader={renderHeader}
      ignoredRefs={ignoredRefs}
    >
      {infoPanelContent.type === "element" && (
        <ElementModalExtended element={infoPanelContent.data} />
      )}
      {infoPanelContent.type === "group" && (
        <GroupModal group={infoPanelContent.data as FullGroupData} />
      )}
    </Modal>
  );
};
