"use client";

import React from "react";
import styles from "./GroupModal.module.css";
import { useAppStore } from "@/store/appStore";
import { FullGroupData } from "@/elementsData/groupsData";

interface GroupModalProps {
  group: FullGroupData;
}

export const GroupModal = ({ group }: GroupModalProps) => {
  const { setSelectedElement } = useAppStore();

  return (
    <div className={styles.contentPeriodic}>
      {group.description.map((paragraph, index) => (
        <p key={index} className={styles.description}>
          {paragraph}
        </p>
      ))}

      {group.elements && group.elements.length > 0 && (
        <>
          <div className={styles.divider}></div>
          <h4 className={styles.listHeader}>Elements in this category:</h4>
          <div className={styles.elementGrid}>
            {group.elements.map((el) => (
              <div
                key={el.name}
                className={styles.elementListItem}
                onClick={() => setSelectedElement(el.name, undefined, true)}
              >
                <span className={styles.elementSymbol}>{el.symbol}</span>
                <span className={styles.elementName}>{el.name}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
