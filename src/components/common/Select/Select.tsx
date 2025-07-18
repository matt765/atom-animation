"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";

import styles from "./Select.module.css";

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
}

export const Select = ({
  options,
  value,
  onChange,
  onFocus,
  onBlur,
}: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);
  const [dropdownRect, setDropdownRect] = useState<DOMRect | null>(null);

  const selectedOption = options.find((option) => option.value === value);

  const updateDropdownPosition = useCallback(() => {
    if (selectRef.current) {
      const rect = selectRef.current.getBoundingClientRect();
      setDropdownRect({
        left: rect.left,
        top: rect.bottom + 4,
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
      updateDropdownPosition();
      window.addEventListener("resize", updateDropdownPosition);
      window.addEventListener("scroll", updateDropdownPosition, true);
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
    } else {
      onBlur?.();
    }
  };

  const handleOptionClick = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    onBlur?.();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        selectRef.current &&
        !selectRef.current.contains(event.target as Node) &&
        (!dropdownRef.current ||
          !dropdownRef.current.contains(event.target as Node))
      ) {
        setIsOpen(false);
        onBlur?.();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onBlur]);

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
            }}
          >
            <ul className={styles.selectDropdown} ref={dropdownRef}>
              {options.map((option) => (
                <li
                  key={option.value}
                  className={styles.selectOption}
                  onClick={() => handleOptionClick(option.value)}
                >
                  {option.label}
                </li>
              ))}
            </ul>
          </div>,
          document.body
        )}
    </div>
  );
};
