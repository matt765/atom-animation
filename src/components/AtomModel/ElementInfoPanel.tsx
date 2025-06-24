"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import styles from "./ElementInfoPanel.module.css";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useRouter } from "next/navigation";
import { useAppStore, ExtendedElementConfig } from "@/store/appStore";
import { elements } from "@/components/AtomModel/elementsData";

type ElementInfoPanelProps = {
  element: ExtendedElementConfig;
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

const formatCharge = (charge: number): string => {
  if (charge === 0) return "Neutral";
  const sign = charge > 0 ? "+" : "−";
  const absCharge = Math.abs(charge);
  return `${absCharge}${sign}`;
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
    const elementName =
      elements.find((el) => el.protons === element.protons)?.name || "Unknown";
    setSelectedElement(elementName);
    hideInfoPanel();
    setPanelPosition({ x: 0, y: 0 });
    router.push("/");
  };

  const handleClose = () => {
    hideInfoPanel();
    setPanelPosition({ x: 0, y: 0 });
  };

  const isCustomParticle = element.isIsotope || element.charge !== 0;

  const getTitle = () => {
    if (element.name === "Unknown") return "Custom Particle";
    if (element.isIsotope)
      return `Isotope: ${element.name}-${element.atomicWeight}`;
    if (element.charge !== 0) return `Ion: ${element.name}`;
    return element.title;
  };

  const getDescription = () => {
    if (element.name === "Unknown") return element.description;
    if (element.isIsotope && element.charge !== 0) {
      return `This is an ion of the isotope ${element.name}-${element.atomicWeight}. This charged isotope has gained or lost electrons, altering its chemical reactivity and bonding behavior compared to the neutral atom.`;
    }
    if (element.isIsotope) {
      return `This is an isotope of ${element.name} with a mass number of ${element.atomicWeight}. It contains the standard ${element.protons} protons, but has ${element.neutrons} neutrons.`;
    }
    if (element.charge !== 0) {
      return `This is an ion of ${element.name}. An ion is an atom that has a net electrical charge because its number of electrons does not equal its number of protons.`;
    }
    return element.description;
  };

  const panelContent = (
    <div
      ref={setNodeRef}
      className={`${styles.panel} ${isCentered ? styles.centered : ""} ${
        isOnPeriodicTableView ? styles.dark : ""
      }`}
      style={style}
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
        <h3 className={styles.title}>{getTitle()}</h3>
      </div>
      <div
        className={`${styles.content} ${
          isOnPeriodicTableView ? styles.contentPeriodic : ""
        }`}
      >
        <p className={styles.description}>{getDescription()}</p>

        {element.charge !== 0 && element.name !== "Unknown" && (
          <div className={styles.ionInfo}>
            <span className={styles.label}>ION CHARGE</span>
            <span className={styles.value}>
              {formatCharge(element.charge)}
              <span className={styles.detailValue}>
                ({element.protons} Protons, {element.electrons} Electrons)
              </span>
            </span>
          </div>
        )}

        {element.isIsotope && element.name !== "Unknown" && (
          <>
            <div className={styles.stabilityInfo}>
              <span className={styles.label}>STABILITY</span>
              <span
                className={`${styles.value} ${
                  element.isStable ? styles.stable : styles.unstable
                }`}
              >
                {element.isStable ? "Stable" : "Unstable"}
              </span>
            </div>
            <div className={styles.isotopeInfo}>
              <span className={styles.label}>MOST COMMON ISOTOPE</span>
              <span className={styles.value}>
                {`${element.name}-${element.protons + element.defaultNeutrons}`}
                <span className={styles.detailValue}>
                  ({element.defaultNeutrons} Neutrons)
                </span>
              </span>
            </div>
          </>
        )}

        {!isCustomParticle && element.name !== "Unknown" && (
          <>
            <div className={styles.divider}></div>
            <div className={styles.propertiesGrid}>
              {/* ... pełna siatka 8 statystyk ... */}
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
          </>
        )}
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
