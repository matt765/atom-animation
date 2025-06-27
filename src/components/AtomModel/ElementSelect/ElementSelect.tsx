// components/AtomModel/ElementSelect/ElementSelect.tsx
"use client";

import React, { useState, useMemo, useEffect } from "react";
import styles from "./ElementSelect.module.css";
import { Select, SelectOption } from "../../common/Select/Select";
import { useAppStore } from "../../../store/appStore";
import { useLongPress } from "../../../hooks/useLongPress";

export interface ElementData {
  name: string;
  protons: number;
  neutrons: number;
  atomicWeight: string;
  symbol: string;
  electronConfiguration: string;
  shells: number[];
}

interface ElementSelectProps {
  elements: ElementData[];
  selectedElementName: string;
  setSelectedElement: React.Dispatch<React.SetStateAction<string>>;
}

export const ElementSelect = ({
  elements,
  selectedElementName,
  setSelectedElement,
}: ElementSelectProps) => {
  const { setInputFocus } = useAppStore();
  const [searchTerm, setSearchTerm] = useState("");

  const handleNextElement = () => {
    setSelectedElement((currentElementName) => {
      const currentIndex = elements.findIndex(
        (el) => el.name === currentElementName
      );
      const nextIndex = (currentIndex + 1) % elements.length;
      return elements[nextIndex].name;
    });
  };

  const handlePreviousElement = () => {
    setSelectedElement((currentElementName) => {
      const currentIndex = elements.findIndex(
        (el) => el.name === currentElementName
      );
      const prevIndex = (currentIndex - 1 + elements.length) % elements.length;
      return elements[prevIndex].name;
    });
  };

  const previousElementProps = useLongPress(handlePreviousElement);
  const nextElementProps = useLongPress(handleNextElement);

  const elementOptions: SelectOption[] = useMemo(
    () => elements.map((el) => ({ value: el.name, label: el.name })),
    [elements]
  );

  // Automatyczna zmiana elementu na podstawie wyszukiwania
  useEffect(() => {
    const lowercasedFilter = searchTerm.toLowerCase().trim();
    if (!lowercasedFilter) return;

    const filtered = elements.filter(
      (el) =>
        el.name.toLowerCase().includes(lowercasedFilter) ||
        el.symbol.toLowerCase().includes(lowercasedFilter)
    );

    // Natychmiast zmień na pierwszy znaleziony element
    if (filtered.length > 0 && selectedElementName !== filtered[0].name) {
      setSelectedElement(filtered[0].name);
    }
  }, [searchTerm, elements, setSelectedElement, selectedElementName]);

  const handleSelectFocus = () => {
    setInputFocus(true);
  };

  const handleSelectBlur = () => {
    setInputFocus(false);
    setSearchTerm(""); // Resetuj searchTerm po utracie focusu
  };

  const handleSelectChange = (value: string) => {
    setSelectedElement(value);
    setSearchTerm(""); // Resetuj searchTerm po wybraniu opcji
  };

  return (
    <div className={styles.controlGroup}>
      <label>Element:</label>
      <Select
        options={elementOptions}
        value={selectedElementName}
        onChange={handleSelectChange}
        onFocus={handleSelectFocus}
        onBlur={handleSelectBlur}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      <div className={styles.navButtonGroup}>
        <button
          {...previousElementProps}
          className={styles.elementNavButton}
          title="Previous element"
        >
          ▼
        </button>
        <button
          {...nextElementProps}
          className={styles.elementNavButton}
          title="Next element"
        >
          ▲
        </button>
      </div>
    </div>
  );
};
