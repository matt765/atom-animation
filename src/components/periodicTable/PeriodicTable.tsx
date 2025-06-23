"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/appStore";
import { elements, ElementConfig } from "@/components/AtomModel/elementsData";
import styles from "./PeriodicTable.module.css";

const getGridPosition = (element: ElementConfig) => {
  if (element.group > 0) {
    return {
      gridRow: element.period,
      gridColumn: element.group,
    };
  }

  const atomicNumber = element.protons;

  if (atomicNumber >= 58 && atomicNumber <= 71) {
    return {
      gridRow: 9,
      gridColumn: atomicNumber - 58 + 3,
    };
  }

  if (atomicNumber >= 90 && atomicNumber <= 103) {
    return {
      gridRow: 10,
      gridColumn: atomicNumber - 90 + 3,
    };
  }

  return {};
};

export const PeriodicTable = () => {
  const { selectedElementName, setSelectedElement } = useAppStore();
  const router = useRouter();

  const handleElementClick = (elementName: string) => {
    setSelectedElement(elementName);
    router.push("/");
  };

  return (
    <div className={styles.tableContainer}>
      <div className={styles.table}>
        {elements.map((element) => {
          const isActive = element.name === selectedElementName;
          const gridPosition = getGridPosition(element);

          return (
            <div
              key={element.name}
              className={`${styles.element} ${isActive ? styles.active : ""}`}
              style={gridPosition}
              onClick={() => handleElementClick(element.name)}
              title={element.name}
            >
              <div className={styles.atomicNumber}>{element.protons}</div>
              <div className={styles.symbol}>{element.symbol}</div>
              <div className={styles.name}>{element.name}</div>
              <div className={styles.atomicWeight}>{element.atomicWeight}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
