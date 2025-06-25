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

type ElementCategory =
  | "alkali-metal"
  | "alkaline-earth-metal"
  | "lanthanide"
  | "actinide"
  | "transition-metal"
  | "post-transition-metal"
  | "metalloid"
  | "reactive-nonmetal"
  | "noble-gas"
  | "unknown";

const ELEMENT_CATEGORY_COLORS: Record<ElementCategory, string> = {
  "alkali-metal": "#5a4a42",
  "alkaline-earth-metal": "#5a5242",
  "transition-metal": "#634f5c",
  lanthanide: "#425a52",
  actinide: "#425a5a",
  "post-transition-metal": "#4c596f",
  metalloid: "#425a47",
  "reactive-nonmetal": "#475868",
  "noble-gas": "#5c4f63",
  unknown: "#444444",
};

const getElementCategory = (element: ElementConfig): ElementCategory => {
  const { protons, group } = element;
  if (protons >= 57 && protons <= 71) return "lanthanide";
  if (protons >= 89 && protons <= 103) return "actinide";
  if (group === 1) return protons === 1 ? "reactive-nonmetal" : "alkali-metal";
  if (group === 2) return "alkaline-earth-metal";
  if (group >= 3 && group <= 12) return "transition-metal";
  if (group === 18) return "noble-gas";

  const metalloids: number[] = [5, 14, 32, 33, 51, 52, 84];
  if (metalloids.includes(protons)) return "metalloid";

  const postTransitionMetals: number[] = [
    13, 31, 49, 50, 81, 82, 83, 113, 114, 115, 116,
  ];
  if (postTransitionMetals.includes(protons)) return "post-transition-metal";

  const reactiveNonmetals: number[] = [
    1, 6, 7, 8, 9, 15, 16, 17, 34, 35, 53, 85, 117,
  ];
  if (reactiveNonmetals.includes(protons)) return "reactive-nonmetal";

  return "unknown";
};

const LegendAndExample = ({
  onGroupHover,
  onGroupClick,
}: {
  onGroupHover: (groupClass: ElementCategory | null) => void;
  onGroupClick: (group: GroupData) => void;
}) => (
  <div className={styles.legendAndExampleContainer}>
    <div className={styles.legendContainer}>
      {groupsData.slice(0, 5).map((item) => (
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
      {groupsData.slice(5).map((item) => (
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
  const { protons, setSelectedElement, setSelectedGroup, hideInfoPanel } =
    useAppStore();

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
    target: null as EventTarget | null,
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
        setSelectedElement(newElementName);
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
        setSelectedGroup(group);
      }
    },
    [hideInfoPanel, setSelectedGroup]
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

      if (!actionStateRef.current.isDragging) {
        const clickedElementDiv = (
          actionStateRef.current.target as HTMLElement
        )?.closest("[data-element-name]");
        if (clickedElementDiv) {
          const elementName =
            clickedElementDiv.getAttribute("data-element-name");
          if (elementName) {
            handleElementClick(elementName);
          }
        }
      }
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
  }, [handleElementClick]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    const target = e.target as HTMLElement;

    if (
      target.closest(`.${styles.legendItem}`) ||
      target.closest(`.${styles.legendAndExampleContainer}`)
    ) {
      e.stopPropagation();
      return;
    }

    e.preventDefault();
    actionStateRef.current.isPointerDown = true;
    actionStateRef.current.startX = e.clientX;
    actionStateRef.current.startY = e.clientY;
    actionStateRef.current.lastX = e.clientX;
    actionStateRef.current.lastY = e.clientY;
    actionStateRef.current.target = e.target;
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

  const currentModelElement = elements.find((el) => el.protons === protons);

  return (
    <div
      ref={containerRef}
      className={styles.tableViewport}
      onMouseDown={handleMouseDown}
      onWheel={handleWheel}
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
