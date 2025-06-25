"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  useCallback,
} from "react";
import { useAppStore } from "@/store/appStore";
import { elements, ElementConfig } from "@/components/AtomModel/elementsData";
import { groupsData, GroupData } from "@/components/AtomModel/groupsData";
import styles from "./PeriodicTable.module.css";
import { getElementCategory, ElementCategory } from "../AtomModel/elementUtils";

const ELEMENT_CATEGORY_COLORS: Record<ElementCategory, string> = {
  "alkali-metal": "rgb(90, 74, 66)",
  "alkaline-earth-metal": "rgb(90, 82, 66)",
  "transition-metal": "rgb(99, 79, 92)",
  lanthanide: "rgb(66, 90, 82)",
  actinide: "rgb(66, 90, 90)",
  "other-metal": "rgb(76, 89, 111)",
  metalloid: "rgb(66, 90, 71)",
  nonmetal: "rgb(71, 88, 104)",
  halogen: "rgb(92, 79, 99)",
  "noble-gas": "rgb(92, 79, 120)",
  unknown: "rgb(68, 68, 68)",
};

const legendDisplayData = groupsData.filter(
  (group) => group.class !== "unknown"
);

const LegendAndExample = ({
  onGroupHover,
  onGroupClick,
}: {
  onGroupHover: (groupClass: ElementCategory | null) => void;
  onGroupClick: (group: GroupData) => void;
}) => (
  <div className={styles.legendAndExampleContainer}>
    <div className={styles.legendContainer}>
      {legendDisplayData.slice(0, 5).map((item) => (
        <div
          key={item.name}
          className={styles.legendItem}
          onMouseEnter={() => onGroupHover(item.class as ElementCategory)}
          onMouseLeave={() => onGroupHover(null)}
          onClick={() => onGroupClick(item)}
        >
          <div
            className={styles.legendSwatch}
            style={{
              backgroundColor:
                ELEMENT_CATEGORY_COLORS[item.class as ElementCategory],
            }}
          />
          <span>{item.name}</span>
        </div>
      ))}
    </div>
    <div className={styles.legendContainer}>
      {legendDisplayData.slice(5).map((item) => (
        <div
          key={item.name}
          className={styles.legendItem}
          onMouseEnter={() => onGroupHover(item.class as ElementCategory)}
          onMouseLeave={() => onGroupHover(null)}
          onClick={() => onGroupClick(item)}
        >
          <div
            className={styles.legendSwatch}
            style={{
              backgroundColor:
                ELEMENT_CATEGORY_COLORS[item.class as ElementCategory],
            }}
          />
          <span>{item.name}</span>
        </div>
      ))}
    </div>
    <div
      className={styles.exampleTile}
      style={{
        backgroundColor: ELEMENT_CATEGORY_COLORS["transition-metal"],
      }}
    >
      <div className={styles.exampleContent}>
        <div className={styles.exampleNumber}>78</div>
        <div className={styles.exampleSymbol}>Pt</div>
        <div className={styles.exampleName}>Platinum</div>
        <div className={styles.exampleWeight}>195.1</div>
      </div>
      <div className={styles.exampleLabel} style={{ top: "5%", left: "105%" }}>
        Atomic Number
      </div>
      <div className={styles.exampleLabel} style={{ top: "35%", left: "105%" }}>
        Symbol
      </div>
      <div className={styles.exampleLabel} style={{ top: "60%", left: "105%" }}>
        Name
      </div>
      <div className={styles.exampleLabel} style={{ top: "85%", left: "105%" }}>
        Atomic Mass
      </div>
    </div>
  </div>
);

const getGridPosition = (element: ElementConfig) => {
  const gridColumnOffset = 1;
  const gridRowOffset = 1;

  if (element.group > 0) {
    return {
      gridRow: element.period + gridRowOffset,
      gridColumn: element.group + gridColumnOffset,
    };
  }
  const atomicNumber = element.protons;
  if (atomicNumber >= 57 && atomicNumber <= 71) {
    return {
      gridRow: 10,
      gridColumn: atomicNumber - 57 + 3 + gridColumnOffset,
    };
  }
  if (atomicNumber >= 89 && atomicNumber <= 103) {
    return {
      gridRow: 11,
      gridColumn: atomicNumber - 89 + 3 + gridColumnOffset,
    };
  }
  return {};
};

const columnHeaders = [
  { group: 1, row: 1, col: 2 },
  { group: 2, row: 2, col: 3 },
  { group: 3, row: 4, col: 4 },
  { group: 4, row: 4, col: 5 },
  { group: 5, row: 4, col: 6 },
  { group: 6, row: 4, col: 7 },
  { group: 7, row: 4, col: 8 },
  { group: 8, row: 4, col: 9 },
  { group: 9, row: 4, col: 10 },
  { group: 10, row: 4, col: 11 },
  { group: 11, row: 4, col: 12 },
  { group: 12, row: 4, col: 13 },
  { group: 13, row: 2, col: 14 },
  { group: 14, row: 2, col: 15 },
  { group: 15, row: 2, col: 16 },
  { group: 16, row: 2, col: 17 },
  { group: 17, row: 2, col: 18 },
  { group: 18, row: 1, col: 19 },
];

export const PeriodicTable = () => {
  const {
    protons,
    setSelectedElement,
    showGroupInfo,
    hideInfoPanel,
    isNavigating,
  } = useAppStore();

  const [viewState, setViewState] = useState({ x: 0, y: 0, scale: 1 });
  const [hoveredGroup, setHoveredGroup] = useState<ElementCategory | null>(
    null
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const actionStateRef = useRef({
    isPointerDown: false,
    isDragging: false,
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
  });

  const resetView = useCallback(() => {
    const container = containerRef.current;
    const table = tableRef.current;
    if (!container || !table) return;

    const containerRect = container.getBoundingClientRect();
    const tableWidth = table.scrollWidth;
    const tableHeight = table.scrollHeight;

    const scaleX = containerRect.width / tableWidth;
    const scaleY = containerRect.height / tableHeight;
    const initialScale = Math.min(scaleX, scaleY) * 0.75;

    const initialX = (containerRect.width - tableWidth * initialScale) / 2;
    const initialY = (containerRect.height - tableHeight * initialScale) / 2;

    setViewState({ x: initialX, y: initialY, scale: initialScale });
  }, []);

  useLayoutEffect(() => {
    resetView();
  }, [resetView]);

  const handleElementClick = useCallback(
    (newElementName: string) => {
      const { infoPanelContent } = useAppStore.getState();
      if (
        infoPanelContent?.type === "element" &&
        infoPanelContent.data.name === newElementName
      ) {
        hideInfoPanel();
      } else {
        setSelectedElement(newElementName, undefined, true);
      }
    },
    [hideInfoPanel, setSelectedElement]
  );

  const handleGroupClick = useCallback(
    (group: GroupData) => {
      const { infoPanelContent } = useAppStore.getState();
      if (
        infoPanelContent?.type === "group" &&
        infoPanelContent.data.name === group.name
      ) {
        hideInfoPanel();
      } else {
        showGroupInfo(group);
      }
    },
    [hideInfoPanel, showGroupInfo]
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!actionStateRef.current.isPointerDown) return;

      if (!actionStateRef.current.isDragging) {
        const dist = Math.hypot(
          e.clientX - actionStateRef.current.startX,
          e.clientY - actionStateRef.current.startY
        );
        if (dist > 5) {
          actionStateRef.current.isDragging = true;
          if (containerRef.current)
            containerRef.current.classList.add(styles.isDragging);
        }
      }

      if (actionStateRef.current.isDragging) {
        const deltaX = e.clientX - actionStateRef.current.lastX;
        const deltaY = e.clientY - actionStateRef.current.lastY;
        actionStateRef.current.lastX = e.clientX;
        actionStateRef.current.lastY = e.clientY;
        setViewState((prev) => ({
          ...prev,
          x: prev.x + deltaX,
          y: prev.y + deltaY,
        }));
      }
    };

    const handleMouseUp = () => {
      if (!actionStateRef.current.isPointerDown) return;
      actionStateRef.current.isPointerDown = false;
      actionStateRef.current.isDragging = false;
      if (containerRef.current)
        containerRef.current.classList.remove(styles.isDragging);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 2) return;

    const target = e.target as HTMLElement;

    if (target.closest(`.${styles.legendItem}`)) {
      return;
    }

    if (target.closest(`[data-element-name]`)) {
      return;
    }

    e.preventDefault();
    actionStateRef.current.isPointerDown = true;
    actionStateRef.current.startX = e.clientX;
    actionStateRef.current.startY = e.clientY;
    actionStateRef.current.lastX = e.clientX;
    actionStateRef.current.lastY = e.clientY;
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!containerRef.current) return;
    e.preventDefault();

    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const scaleFactor = 1.1;
    const newScale =
      e.deltaY < 0
        ? viewState.scale * scaleFactor
        : viewState.scale / scaleFactor;
    const clampedScale = Math.max(0.2, Math.min(newScale, 3));

    const contentMouseX = (mouseX - viewState.x) / viewState.scale;
    const contentMouseY = (mouseY - viewState.y) / viewState.scale;

    const newX = mouseX - contentMouseX * clampedScale;
    const newY = mouseY - contentMouseY * clampedScale;

    setViewState({ x: newX, y: newY, scale: clampedScale });
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const currentModelElement = elements.find((el) => el.protons === protons);

  return (
    <div
      ref={containerRef}
      className={`${styles.tableViewport} ${
        isNavigating ? styles.navigating : ""
      }`}
      onMouseDown={handleMouseDown}
      onWheel={handleWheel}
      onContextMenu={handleContextMenu}
    >
      <div
        ref={tableRef}
        className={styles.table}
        data-is-periodic-grid="true"
        style={{
          transform: `translate(${viewState.x}px, ${viewState.y}px) scale(${viewState.scale})`,
        }}
      >
        {columnHeaders.map(({ group, row, col }) => (
          <div
            key={`col-header-${group}`}
            className={styles.columnHeader}
            style={{ gridRow: row, gridColumn: col }}
          >
            {group}
          </div>
        ))}

        {Array.from({ length: 7 }, (_, i) => (
          <div
            key={`row-header-${i}`}
            className={styles.rowHeader}
            style={{ gridRow: i + 2, gridColumn: 1 }}
          >
            {i + 1}
          </div>
        ))}

        <LegendAndExample
          onGroupHover={setHoveredGroup}
          onGroupClick={handleGroupClick}
        />
        {elements.map((element) => {
          const isActive = element.name === currentModelElement?.name;
          const categoryClass = getElementCategory(element);
          const isHighlighted = hoveredGroup === categoryClass;
          const gridPosition = getGridPosition(element);
          return (
            <div
              key={element.name}
              data-element-name={element.name}
              onClick={() => handleElementClick(element.name)}
              className={`${styles.element} ${isActive ? styles.active : ""} ${
                isHighlighted ? styles.highlighted : ""
              }`}
              style={{
                ...gridPosition,
                backgroundColor: ELEMENT_CATEGORY_COLORS[categoryClass],
              }}
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
