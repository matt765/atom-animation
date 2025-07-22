"use client";

import React, { RefObject } from "react";
import styles from "./ElementModalSimple.module.css";
import { useAppStore, ExtendedElementConfig } from "@/store/appStore";
import { Modal } from "@/components/common/modal/Modal";
import { useDraggable } from "@dnd-kit/core";
import { formatValueWithUnit, formatIonCharge } from "@/utils/elementUtils";

interface ElementModalSimpleProps {
  element: ExtendedElementConfig;
  position: { x: number; y: number };
  isManuallyPositioned: boolean;
  isSmallScreen: boolean;
  ignoredRefs?: RefObject<HTMLElement | null>[];
}

type DragHeaderProps = {
  listeners: ReturnType<typeof useDraggable>["listeners"];
  attributes: ReturnType<typeof useDraggable>["attributes"];
};

export const ElementModalSimple = ({
  element,
  position,
  isManuallyPositioned,
  isSmallScreen,
  ignoredRefs,
}: ElementModalSimpleProps) => {
  const { hideInfoPanel } = useAppStore();

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

  const renderHeader = ({ listeners, attributes }: DragHeaderProps) => (
    <div className={styles.header} {...listeners} {...attributes}>
      <h3 className={styles.title}>{getTitle()}</h3>
    </div>
  );

  const meltingPointK = element.phaseTransitions.find(
    (pt) => pt.type === "melting"
  )?.temperature_K;
  const boilingPointK = element.phaseTransitions.find(
    (pt) => pt.type === "boiling"
  )?.temperature_K;
  const isCustomParticle = element.isIsotope || element.charge !== 0;

  return (
    <Modal
      onClose={hideInfoPanel}
      position={position}
      isManuallyPositioned={isManuallyPositioned}
      isSmallScreen={isSmallScreen}
      renderHeader={renderHeader}
      ignoredRefs={ignoredRefs}
    >
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
              {`${element.name}-${element.protons + element.defaultNeutrons}`}
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
    </Modal>
  );
};
