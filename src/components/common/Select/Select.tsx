// common/Select/Select.tsx
"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import styles from "./Select.module.css";
import { SearchIcon } from "@/assets/icons/SearchIcon";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export const Select = ({
  options,
  value,
  onChange,
  onFocus,
  onBlur,
  searchTerm,
  setSearchTerm,
}: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [dropdownRect, setDropdownRect] = useState<DOMRect | null>(null);

  const selectedOption = options.find((option) => option.value === value);

  // Filtruj opcje na podstawie searchTerm
  const filteredOptions = React.useMemo(() => {
    if (!searchTerm.trim()) {
      return options;
    }
    const lowercasedFilter = searchTerm.toLowerCase().trim();
    return options.filter(
      (option) =>
        option.label.toLowerCase().includes(lowercasedFilter) ||
        option.value.toLowerCase().includes(lowercasedFilter)
    );
  }, [options, searchTerm]);

  const updateDropdownPosition = useCallback(() => {
    if (selectRef.current && isOpen) {
      const rect = selectRef.current.getBoundingClientRect();
      setDropdownRect({
        left: rect.left,
        top: rect.top - 4, // Pozycjonuj nad selectem (odejmujemy 4px gap)
        width: rect.width,
        height: 0,
        x: rect.x,
        y: rect.y,
        right: rect.right,
        bottom: rect.bottom,
        toJSON: () => ({}),
      });
    } else {
      setDropdownRect(null);
    }
  }, [isOpen]);

  useEffect(() => {
    updateDropdownPosition();
  }, [isOpen, updateDropdownPosition]);

  useEffect(() => {
    if (isOpen) {
      window.addEventListener("resize", updateDropdownPosition);
      window.addEventListener("scroll", updateDropdownPosition, true);
    } else {
      window.removeEventListener("resize", updateDropdownPosition);
      window.removeEventListener("scroll", updateDropdownPosition, true);
    }
    return () => {
      window.removeEventListener("resize", updateDropdownPosition);
      window.removeEventListener("scroll", updateDropdownPosition, true);
    };
  }, [isOpen, updateDropdownPosition]);

  const handleToggle = () => {
    const nextIsOpen = !isOpen;
    setIsOpen(nextIsOpen);
    if (nextIsOpen) {
      onFocus?.();
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 0);
    } else {
      onBlur?.();
      setSearchTerm("");
    }
  };

  const handleOptionClick = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    onBlur?.();
    setSearchTerm(""); // Clear search after selection
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (filteredOptions.length > 0) {
        onChange(filteredOptions[0].value);
        setIsOpen(false);
        onBlur?.();
        setSearchTerm("");
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
      onBlur?.();
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
        onBlur?.();
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onBlur, setSearchTerm]);

  return (
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
              transform: "translateY(-100%)", // Przesuń całość w górę o własną wysokość
            }}
          >
            {/* Szukajka przyklejona na górze dropdownu */}
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
            {/* Lista opcji z przewijaniem */}
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
  );
};
