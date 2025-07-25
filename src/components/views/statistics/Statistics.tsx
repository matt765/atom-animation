"use client";

import React from "react";
import styles from "./Statistics.module.css";
import { useAppStore } from "@/store/appStore";
import { SortingTable } from "./sortingTable/SortingTable";
import { DataCharts } from "./dataCharts/DataCharts";

export const Statistics = () => {
  const { statisticsActiveTab, setStatisticsActiveTab } = useAppStore();

  return (
    <div className={styles.pageContainer}>
      <div className={styles.tabsContainer}>
        <button
          className={`${styles.tabButton} ${
            statisticsActiveTab === "charts" ? styles.activeTab : ""
          }`}
          onClick={() => setStatisticsActiveTab("charts")}
        >
          Charts
        </button>
        <button
          className={`${styles.tabButton} ${
            statisticsActiveTab === "table" ? styles.activeTab : ""
          }`}
          onClick={() => setStatisticsActiveTab("table")}
        >
          Table
        </button>
      </div>
      {statisticsActiveTab === "charts" && <DataCharts />}
      {statisticsActiveTab === "table" && <SortingTable />}
    </div>
  );
};
