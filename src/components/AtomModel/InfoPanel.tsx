"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import styles from "./InfoPanel.module.css";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useRouter } from "next/navigation";
import {
  useAppStore,
  ExtendedElementConfig,
  InfoPanelContent,
} from "@/store/appStore";
import { elements } from "@/components/AtomModel/elementsData";
import { GroupData } from "./groupsData";
import { OutlinedButton } from "../common/OutlinedButton/OutlinedButton";
import { getElementCategory } from "../AtomModel/elementUtils";

type InfoPanelProps = {
  content: InfoPanelContent;
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

const ElementContent = ({
  element,
  isOnPeriodicTableView,
}: {
  element: ExtendedElementConfig;
  isOnPeriodicTableView?: boolean;
}) => {
  const router = useRouter();
  const { setSelectedElement, hideInfoPanel, setPanelPosition } = useAppStore();

  const handleShowIn3D = () => {
    const elementName =
      elements.find((el) => el.protons === element.protons)?.name || "Unknown";
    setSelectedElement(elementName, undefined, false);
    hideInfoPanel();
    setPanelPosition({ x: 0, y: 0 });
    router.push("/");
  };

  const isCustomParticle = element.isIsotope || element.charge !== 0;

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

  return (
    <>
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
          <OutlinedButton onClick={handleShowIn3D}>Show in 3D</OutlinedButton>
        </div>
      )}
    </>
  );
};

const GroupContent = ({
  group,
  isOnPeriodicTableView,
}: {
  group: GroupData;
  isOnPeriodicTableView?: boolean;
}) => {
  const { setSelectedElement } = useAppStore();

  const groupElements = elements.filter(
    (el) => getElementCategory(el) === group.class
  );

  return (
    <div
      className={`${styles.content} ${
        isOnPeriodicTableView ? styles.contentPeriodic : ""
      }`}
    >
      {group.description.map((paragraph, index) => (
        <p key={index} className={styles.description}>
          {paragraph}
        </p>
      ))}

      {groupElements.length > 0 && (
        <>
          <div className={styles.divider}></div>
          <h4 className={styles.listHeader}>Elements in this group:</h4>
          <ul className={styles.elementList}>
            {groupElements.map((el) => (
              <li
                key={el.name}
                onClick={() => setSelectedElement(el.name, undefined, true)}
              >
                {el.name}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export const InfoPanel = ({
  content,
  position,
  isCentered = false,
  isOnPeriodicTableView = false,
}: InfoPanelProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const { hideInfoPanel, setPanelPosition } = useAppStore();
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [isPositionedByJs, setIsPositionedByJs] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setIsPositionedByJs(!isCentered);
  }, [isCentered]);

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `draggable-panel-${content.type}-${content.data.name}`,
    });

  const combinedRef = useCallback(
    (node: HTMLDivElement) => {
      setNodeRef(node);
      panelRef.current = node;
    },
    [setNodeRef]
  );

  useEffect(() => {
    if (isDragging && !isPositionedByJs && panelRef.current) {
      const rect = panelRef.current.getBoundingClientRect();
      setPanelPosition({ x: rect.left, y: rect.top });
      setIsPositionedByJs(true);
    }
  }, [isDragging, isPositionedByJs, setPanelPosition]);

  const dndTransform = transform ? CSS.Translate.toString(transform) : "";

  const style: React.CSSProperties = isPositionedByJs
    ? {
        top: `${position.y}px`,
        left: `${position.x}px`,
        transform: dndTransform,
        position: "fixed",
      }
    : {};

  const handleClose = () => {
    hideInfoPanel();
    setPanelPosition({ x: 0, y: 0 });
  };

  const getTitle = () => {
    if (content.type === "group") return content.data.title;

    const element = content.data;
    if (element.name === "Unknown") return "Custom Particle";
    if (element.isIsotope)
      return `Isotope: ${element.name}-${element.atomicWeight}`;
    if (element.charge !== 0) return `Ion: ${element.name}`;
    return element.title;
  };

  const panelContent = (
    <div
      ref={combinedRef}
      className={`${styles.panel} ${!isPositionedByJs ? styles.centered : ""} ${
        isOnPeriodicTableView ? styles.dark : ""
      }`}
      style={style}
    >
      {isOnPeriodicTableView && (
        <button
          onClick={handleClose}
          className={styles.closeButton}
          aria-label="Close panel"
        >
          &times;
        </button>
      )}
      <div className={styles.header} {...listeners} {...attributes}>
        <h3 className={styles.title}>{getTitle()}</h3>
      </div>

      {content.type === "element" ? (
        <ElementContent
          element={content.data}
          isOnPeriodicTableView={isOnPeriodicTableView}
        />
      ) : (
        <GroupContent
          group={content.data}
          isOnPeriodicTableView={isOnPeriodicTableView}
        />
      )}
    </div>
  );

  if (isMounted) {
    return createPortal(panelContent, document.body);
  }

  return null;
};
