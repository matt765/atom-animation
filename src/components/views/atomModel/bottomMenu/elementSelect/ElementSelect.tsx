"use client";

import React, {
  useState,
  useMemo,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { createPortal } from "react-dom";

import styles from "./ElementSelect.module.css";
import type { ElementConfig } from "@/elementsData/types";
import { useAppStore } from "@/store/appStore";
import { useLongPress } from "@/hooks/useLongPress";
import { SearchIcon } from "@/assets/icons/SearchIcon";

export interface SelectOption {
  value: string;
  label: string;
}

interface ElementSelectProps {
  elements: ElementConfig[];
  selectedElementName: string;
  setSelectedElement: React.Dispatch<React.SetStateAction<string>>;
}

export const ElementSelect = ({
  elements,
  selectedElementName,
  setSelectedElement,
}: ElementSelectProps) => {
  const { setParticleControlInputFocus } = useAppStore();
  const [searchTerm, setSearchTerm] = useState("");

  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [dropdownRect, setDropdownRect] = useState<DOMRect | null>(null);

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

  const selectedOption = useMemo(
    () => elementOptions.find((option) => option.value === selectedElementName),
    [elementOptions, selectedElementName]
  );

  const filteredOptions = useMemo(() => {
    if (!searchTerm.trim()) {
      return elementOptions;
    }
    const lowercasedFilter = searchTerm.toLowerCase().trim();
    return elements
      .filter(
        (el) =>
          el.name.toLowerCase().includes(lowercasedFilter) ||
          el.symbol.toLowerCase().includes(lowercasedFilter)
      )
      .map((el) => ({ value: el.name, label: el.name }));
  }, [elementOptions, elements, searchTerm]);

  useEffect(() => {
    const lowercasedFilter = searchTerm.toLowerCase().trim();
    if (!lowercasedFilter) return;

    const filtered = elements.filter(
      (el) =>
        el.name.toLowerCase().includes(lowercasedFilter) ||
        el.symbol.toLowerCase().includes(lowercasedFilter)
    );

    if (filtered.length > 0 && selectedElementName !== filtered[0].name) {
      setSelectedElement(filtered[0].name);
    }
  }, [searchTerm, elements, setSelectedElement, selectedElementName]);

  useEffect(() => {
    if (isOpen && selectRef.current) {
      const rect = selectRef.current.getBoundingClientRect();
      setDropdownRect({
        left: rect.left,
        top: rect.top - 4,
        width: rect.width,
        height: 0,
        x: rect.x,
        y: rect.y,
        right: rect.right,
        bottom: rect.bottom,
        toJSON: () => ({}),
      });
    } else if (!isOpen) {
      setDropdownRect(null);
    }
  }, [isOpen]);

  const updatePositionOnScrollOrResize = useCallback(() => {
    if (selectRef.current) {
      const rect = selectRef.current.getBoundingClientRect();
      setDropdownRect({
        left: rect.left,
        top: rect.top - 4,
        width: rect.width,
        height: 0,
        x: rect.x,
        y: rect.y,
        right: rect.right,
        bottom: rect.bottom,
        toJSON: () => ({}),
      });
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      window.addEventListener("resize", updatePositionOnScrollOrResize);
      window.addEventListener("scroll", updatePositionOnScrollOrResize, true);
    }
    return () => {
      window.removeEventListener("resize", updatePositionOnScrollOrResize);
      window.removeEventListener(
        "scroll",
        updatePositionOnScrollOrResize,
        true
      );
    };
  }, [isOpen, updatePositionOnScrollOrResize]);

  const handleToggle = () => {
    const nextIsOpen = !isOpen;
    setIsOpen(nextIsOpen);
    if (nextIsOpen) {
      setParticleControlInputFocus(true);
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 0);
    } else {
      setParticleControlInputFocus(false);
      setSearchTerm("");
    }
  };

  const handleOptionClick = (value: string) => {
    setSelectedElement(value);
    setIsOpen(false);
    setParticleControlInputFocus(false);
    setSearchTerm("");
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (filteredOptions.length > 0) {
        setSelectedElement(filteredOptions[0].value);
        setIsOpen(false);
        setParticleControlInputFocus(false);
        setSearchTerm("");
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setParticleControlInputFocus(false);
      setSearchTerm("");
    } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        selectRef.current &&
        !selectRef.current.contains(event.target as Node) &&
        (!dropdownRef.current ||
          !dropdownRef.current.contains(event.target as Node)) &&
        (!searchInputRef.current ||
          !searchInputRef.current.contains(event.target as Node))
      ) {
        setIsOpen(false);
        setParticleControlInputFocus(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, setParticleControlInputFocus, setSearchTerm]);

  return (
    <div className={styles.controlGroup}>
      <label>Element:</label>
      <div className={styles.selectContainer} ref={selectRef}>
        <div
          className={`${styles.selectDisplay} ${isOpen ? styles.isOpen : ""}`}
          onClick={handleToggle}
        >
          <span>{selectedOption?.label || ""}</span>
          <span className={styles.arrow}>▼</span>
        </div>

        {isOpen &&
          dropdownRect &&
          createPortal(
            <div
              className={styles.dropdownPortalWrapper}
              style={{
                position: "fixed",
                left: `${dropdownRect.left}px`,
                top: `${dropdownRect.top}px`,
                width: `${dropdownRect.width}px`,
                zIndex: 999999,
                transform: "translateY(-100%)",
              }}
            >
              <div
                className={styles.searchOverlay}
                onMouseDown={(e) => e.stopPropagation()}
              >
                <SearchIcon />
                <input
                  type="text"
                  placeholder="Search..."
                  className={styles.searchInput}
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onKeyDown={handleSearchKeyDown}
                  ref={searchInputRef}
                  autoFocus
                />
              </div>
              <ul className={styles.selectDropdown} ref={dropdownRef}>
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((option) => (
                    <li
                      key={option.value}
                      className={styles.selectOption}
                      onClick={() => handleOptionClick(option.value)}
                    >
                      {option.label}
                    </li>
                  ))
                ) : (
                  <li className={styles.noResults}>No results</li>
                )}
              </ul>
            </div>,
            document.body
          )}
      </div>
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
