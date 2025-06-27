"use client";

import React from "react";
import styles from "./Statistics.module.css";
import { useAppStore } from "@/store/appStore";
import { SortingTable } from "./sortingTable/SortingTable";
// W przyszłości tu będzie import widoku z wykresami
// import { ChartsView } from "./dataGraphs/ChartsView";

export const Statistics = () => {
  const { statisticsTab, setStatisticsTab } = useAppStore();

  return (
    <div className={styles.pageContainer}>
      <div className={styles.tabsContainer}>
        <button
          className={`${styles.tabButton} ${
            statisticsTab === "charts" ? styles.activeTab : ""
          }`}
          onClick={() => setStatisticsTab("charts")}
        >
          Charts
        </button>
        <button
          className={`${styles.tabButton} ${
            statisticsTab === "table" ? styles.activeTab : ""
          }`}
          onClick={() => setStatisticsTab("table")}
        >
          Table
        </button>
      </div>

      {statisticsTab === "charts" && (
        <div className={styles.chartsViewContainer}>
          {/* Tu w przyszłości będzie komponent <ChartsView /> */}
          <p>Charts will be displayed here.</p>
        </div>
      )}

      {statisticsTab === "table" && <SortingTable />}
    </div>
  );
};
