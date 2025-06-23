"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import styles from "./ElementInfoPanel.module.css";
import { ElementConfig } from "./elementsData";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import {  useRouter } from "next/navigation";
import { useAppStore } from "@/store/appStore";

type ElementInfoPanelProps = {
  element: ElementConfig;
  position: { x: number; y: number };
  isCentered?: boolean;
  isOnPeriodicTableView?: boolean;
};

const formatValue = (
  value: number | string | undefined | null,
  unit: string = ""
) => {
  if (value === undefined || value === null) return "N/A";
  if (typeof value === "number") {
    return `${value.toLocaleString()} ${unit}`.trim();
  }
  return `${value} ${unit}`.trim();
};

export const ElementInfoPanel = ({
  element,
  position,
  isCentered = false,
  isOnPeriodicTableView = false,
}: ElementInfoPanelProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const { setSelectedElement, hideInfoPanel, setPanelPosition } = useAppStore();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `draggable-panel-${element.name}`,
    disabled: isCentered,
  });

  const dndTransform = transform ? CSS.Translate.toString(transform) : "";

  const style: React.CSSProperties = isCentered
    ? {}
    : {
        top: `${position.y}px`,
        left: `${position.x}px`,
        transform: dndTransform,
      };

  const handleShowIn3D = () => {
    setSelectedElement(element.name);
    hideInfoPanel();
    setPanelPosition({ x: 0, y: 0 });
    router.push("/");
  };

  const handleClose = () => {
    hideInfoPanel();
    setPanelPosition({ x: 0, y: 0 });
  };

  const panelContent = (
    <div
      ref={setNodeRef}
      className={`${styles.panel} ${isCentered ? styles.centered : ""} ${
        isOnPeriodicTableView ? styles.dark : ""
      }`}
      style={style}
      onMouseDown={(e) => {
        if (
          !(e.target as HTMLElement).closest(`.${styles.header}`) ||
          isCentered
        ) {
          e.stopPropagation();
        }
      }}
    >
      {isCentered && (
        <button
          onClick={handleClose}
          className={styles.closeButton}
          aria-label="Close panel"
        >
          &times;
        </button>
      )}
      <div
        className={`${styles.header} ${
          isOnPeriodicTableView ? styles.headerPeriodic : ""
        }`}
        {...(isCentered ? {} : listeners)}
        {...(isCentered ? {} : attributes)}
      >
        <h3 className={styles.title}>{element.title}</h3>
      </div>
      <div
        className={`${styles.content} ${
          isOnPeriodicTableView ? styles.contentPeriodic : ""
        }`}
      >
        <p className={styles.description}>{element.description}</p>
        <div className={styles.divider}></div>
        <div className={styles.propertiesGrid}>
          <div className={styles.property}>
            <span className={styles.label}>ATOMIC NO.</span>
            <span className={styles.value}>{element.protons}</span>
          </div>
          <div className={styles.property}>
            <span className={styles.label}>ATOMIC MASS</span>
            <span className={styles.value}>
              {formatValue(element.atomicWeight, "u")}
            </span>
          </div>
          <div className={styles.property}>
            <span className={styles.label}>GROUP</span>
            <span className={styles.value}>
              {element.group > 0 ? element.group : "N/A"}
            </span>
          </div>
          <div className={styles.property}>
            <span className={styles.label}>PERIOD</span>
            <span className={styles.value}>{element.period}</span>
          </div>
          <div className={styles.property}>
            <span className={styles.label}>E. CONFIGURATION</span>
            <span className={styles.value}>
              {element.electronConfiguration}
            </span>
          </div>
          <div className={styles.property}>
            <span className={styles.label}>STATE (STP)</span>
            <span className={styles.value}>{element.stateAtSTP}</span>
          </div>
          <div className={styles.property}>
            <span className={styles.label}>MELTING PT.</span>
            <span className={styles.value}>
              {formatValue(element.meltingPointK, "K")}
            </span>
          </div>
          <div className={styles.property}>
            <span className={styles.label}>BOILING PT.</span>
            <span className={styles.value}>
              {formatValue(element.boilingPointK, "K")}
            </span>
          </div>
        </div>
      </div>
      {isOnPeriodicTableView && (
        <div
          className={`${styles.footer} ${
            isOnPeriodicTableView ? styles.footerPeriodic : ""
          }`}
        >
          <button onClick={handleShowIn3D} className={styles.show3dButton}>
            Show in 3D
          </button>
        </div>
      )}
    </div>
  );

  if (isMounted) {
    return createPortal(panelContent, document.body);
  }

  return null;
};
