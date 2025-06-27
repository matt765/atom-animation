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
import { elements } from "@/elementsData/elementsData";
import { GroupData } from "../../../elementsData/groupsData";
import { OutlinedButton } from "../../common/OutlinedButton/OutlinedButton";
import { getElementCategory } from "../elementUtils";

type InfoPanelProps = {
  content: InfoPanelContent;
  position: { x: number; y: number };
  mode: "hidden" | "default" | "detailed" | "periodic-table";
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
  const { navigateToHomepage } = useAppStore();

  const handleShowIn3D = () => {
    const elementName =
      elements.find((el) => el.protons === element.protons)?.name || "Unknown";
    navigateToHomepage(router, elementName);
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

export const InfoPanel = ({ content, position, mode }: InfoPanelProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const { hideInfoPanel, setPanelPosition, isPanelManuallyPositioned } =
    useAppStore();
  const panelRef = useRef<HTMLDivElement | null>(null);

  // Ten stan decyduje, czy panel jest pozycjonowany przez CSS (false) czy JS (true)
  const [isPositionedByJs, setIsPositionedByJs] = useState(
    mode !== "periodic-table"
  );

  useEffect(() => {
    setIsMounted(true);
    // Resetuj stan pozycjonowania przy zmianie trybu panelu
    // Używamy isPanelManuallyPositioned z globalnego store, aby "przeżyć" ponowne renderowanie
    if (isPanelManuallyPositioned) {
      setIsPositionedByJs(true);
    } else {
      setIsPositionedByJs(mode !== "periodic-table");
    }
  }, [mode, isPanelManuallyPositioned]);

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `draggable-panel-${content.type}-${
        content.type === "element" ? content.data.name : content.data.title
      }`,
    });

  // Kiedy zaczynamy przeciągać panel, który był pozycjonowany przez CSS,
  // odczytujemy jego pozycję i przełączamy go na stałe w tryb pozycjonowania JS.
  useEffect(() => {
    if (isDragging && !isPositionedByJs && panelRef.current) {
      const rect = panelRef.current.getBoundingClientRect();
      setPanelPosition({ x: rect.left, y: rect.top });
      setIsPositionedByJs(true);
    }
  }, [isDragging, isPositionedByJs, setPanelPosition]);

  const combinedRef = useCallback(
    (node: HTMLDivElement) => {
      setNodeRef(node);
      panelRef.current = node;
    },
    [setNodeRef]
  );

  const style: React.CSSProperties = {};
  if (isPositionedByJs) {
    style.position = "fixed";
    style.top = `${position.y}px`;
    style.left = `${position.x}px`;
    style.transform = transform ? CSS.Translate.toString(transform) : undefined;
  }

  const getTitle = () => {
    if (!content) return "";
    if (content.type === "group") return content.data.title;

    const element = content.data;
    if (element.name === "Unknown") return "Custom Particle";
    if (element.isIsotope)
      return `Isotope: ${element.name}-${element.atomicWeight}`;
    if (element.charge !== 0) return `Ion: ${element.name}`;
    return element.title;
  };

  if (!isMounted) {
    return null;
  }

  const isPeriodicTableMode = mode === "periodic-table";
  const isDetailedMode = mode === "detailed";

  const panelContent = (
    <div
      ref={combinedRef}
      className={`${styles.panel} ${
        isPeriodicTableMode && !isPositionedByJs ? styles.centered : ""
      } ${isPeriodicTableMode ? styles.dark : ""} ${
        isDetailedMode && !isPanelManuallyPositioned ? styles.sideView : ""
      }`}
      style={style}
    >
      {isPeriodicTableMode && (
        <button
          onClick={hideInfoPanel}
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
          isOnPeriodicTableView={isPeriodicTableMode}
        />
      ) : (
        <GroupContent
          group={content.data}
          isOnPeriodicTableView={isPeriodicTableMode}
        />
      )}
    </div>
  );

  return createPortal(panelContent, document.body);
};
