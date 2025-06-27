"use client";

import React from "react";
import styles from "./Statistics.module.css";
import { useAppStore } from "@/store/appStore";
import { SortingTable } from "./sortingTable/SortingTable";
import { DataCharts } from "./dataCharts/DataCharts";

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

      {statisticsTab === "charts" && <DataCharts />}

      {statisticsTab === "table" && <SortingTable />}
    </div>
  );
};
