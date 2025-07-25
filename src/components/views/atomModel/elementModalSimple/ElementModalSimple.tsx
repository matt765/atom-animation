"use client";

import React, { useEffect, useState, useRef, RefObject } from "react";
import { createPortal } from "react-dom";
import styles from "./ElementModalSimple.module.css";
import { useDraggableModal } from "@/hooks/useDraggableModal";
import { useClickOutside } from "@/hooks/useClickOutside";
import { ExtendedElementConfig } from "@/store/appStore";
import { formatValueWithUnit, formatIonCharge } from "@/utils/elementUtils";

interface ElementModalSimpleProps {
  element: ExtendedElementConfig;
  currentPosition: { x: number; y: number };
  isManuallyPositioned: boolean;
  isSmallScreen: boolean;
  onClose: () => void;
  ignoredRefs?: RefObject<HTMLElement | null>[];
}

export const ElementModalSimple = ({
  element,
  currentPosition,
  isSmallScreen,
  onClose,
  ignoredRefs,
}: ElementModalSimpleProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useClickOutside(modalRef, onClose, ignoredRefs);

  const {
    setNodeRef,
    listeners,
    attributes,
    style: dragStyle,
  } = useDraggableModal("homepage-modal");

  const getTitle = () => {
    if (element.name === "Unknown") return "Custom Particle";
    if (element.isIsotope)
      return `Isotope: ${element.name}-${Math.round(element.atomicWeight)}`;
    if (element.charge !== 0) return `Ion: ${element.name}`;
    return element.title;
  };

  const getDescription = () => {
    if (element.name === "Unknown") return element.description;
    if (element.isIsotope && element.charge !== 0) {
      return `This is an ion of the isotope ${element.name}-${Math.round(
        element.atomicWeight
      )}. This charged isotope has gained or lost electrons, altering its chemical reactivity and bonding behavior compared to the neutral atom.`;
    }
    if (element.isIsotope) {
      return `This is an isotope of ${
        element.name
      } with a mass number of ${Math.round(
        element.atomicWeight
      )}. It contains the standard ${element.protons} protons, but has ${
        element.neutrons
      } neutrons.`;
    }
    if (element.charge !== 0) {
      return `This is an ion of ${element.name}. An ion is an atom that has a net electrical charge because its number of electrons does not equal its number of protons.`;
    }
    return element.description;
  };

  const meltingPointK = element.phaseTransitions.find(
    (pt) => pt.type === "melting"
  )?.temperature_K;
  const boilingPointK = element.phaseTransitions.find(
    (pt) => pt.type === "boiling"
  )?.temperature_K;
  const isCustomParticle = element.isIsotope || element.charge !== 0;

  if (!isMounted) {
    return null;
  }

  const modalStyle: React.CSSProperties = {
    ...(!isSmallScreen && {
      position: "fixed",
      top: `${currentPosition.y}px`,
      left: `${currentPosition.x}px`,
    }),
    ...dragStyle,
  };

  const modalClasses = [
    styles.panel,
    isSmallScreen ? styles.mobileFullScreen : "",
  ]
    .filter(Boolean)
    .join(" ");

  const modalContent = (
    <div ref={modalRef} className={modalClasses} style={modalStyle}>
      <div ref={setNodeRef}>
        <div className={styles.header} {...listeners} {...attributes}>
          <h3 className={styles.title}>{getTitle()}</h3>
          <button onClick={onClose} className={styles.closeButton}>
            &times;
          </button>
        </div>
        <div className={styles.contentWrapper}>
          <div className={styles.content}>
            <p className={styles.description}>{getDescription()}</p>
            {element.charge !== 0 && element.name !== "Unknown" && (
              <div className={styles.ionInfo}>
                <span className={styles.label}>ION CHARGE</span>
                <span className={styles.value}>
                  {formatIonCharge(element.charge)}
                  <span className={styles.detailValue}>
                    ({element.protons} Protons, {element.electrons} Electrons)
                  </span>
                </span>
              </div>
            )}
            {element.isIsotope &&
              element.name !== "Unknown" &&
              element.charge === 0 && (
                <div className={styles.stabilityInfo}>
                  <span className={styles.label}>CORE STABILITY</span>
                  <span
                    className={`${styles.value} ${
                      element.isStable ? styles.stable : styles.unstable
                    }`}
                  >
                    {element.isStable ? "Stable" : "Unstable"}
                  </span>
                </div>
              )}
            {element.isIsotope && element.name !== "Unknown" && (
              <div className={styles.isotopeInfo}>
                <span className={styles.label}>MOST COMMON ISOTOPE</span>
                <span className={styles.value}>
                  {`${element.name}-${
                    element.protons + element.defaultNeutrons
                  }`}
                  <span className={styles.detailValue}>
                    ({element.defaultNeutrons} Neutrons)
                  </span>
                </span>
              </div>
            )}
            {!isCustomParticle && element.name !== "Unknown" && (
              <>
                <div className={styles.divider}></div>
                <div className={styles.propertiesGrid}>
                  <div className={styles.property}>
                    <span className={styles.label}>ATOMIC NO.</span>
                    <span className={styles.value}>{element.protons}</span>
                  </div>
                  <div className={styles.property}>
                    <span className={styles.label}>ATOMIC MASS</span>
                    <span className={styles.value}>
                      {formatValueWithUnit(element.atomicWeight, "u")}
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
                      {formatValueWithUnit(meltingPointK, "K")}
                    </span>
                  </div>
                  <div className={styles.property}>
                    <span className={styles.label}>BOILING PT.</span>
                    <span className={styles.value}>
                      {formatValueWithUnit(boilingPointK, "K")}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
