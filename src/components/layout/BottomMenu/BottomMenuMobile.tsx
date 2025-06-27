"use client";

import React, { useState, useRef, useEffect } from "react";
import styles from "./BottomMenuMobile.module.css";
import { useAppStore, deriveCurrentElement } from "../../../store/appStore";
import { elements } from "../../../elementsData/elementsData";
import { ElementSelect } from "../../AtomModel/ElementSelect/ElementSelect";
import { ParticleControl } from "./ParticleControl";
import { CONFIG } from "../../AtomModel/AtomModel";
import { ShakeIcon } from "../../../assets/icons/ShakeIcon";
import { RefreshIcon } from "../../../assets/icons/RefreshIcon";
import { ChevronUpIcon } from "../../../assets/icons/ChevronUpIcon";

const PARTICLE_LIMIT = 300;

export const BottomMenuMobile = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const element = useAppStore(deriveCurrentElement);
  const {
    sliderValue,
    setSliderValue,
    protons,
    neutrons,
    electrons,
    setParticles,
    setSelectedElement,
    triggerShake,
    triggerRefresh,
    hideInfoPanel,
    resetToDefaults,
  } = useAppStore();
  const speedSliderRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const updateSliderFill = () => {
      const slider = speedSliderRef.current;
      if (slider) {
        const min = Number(slider.min);
        const max = Number(slider.max);
        const value = Number(slider.value);
        const percentage = ((value - min) / (max - min)) * 100;
        slider.style.setProperty("--slider-fill-percentage", `${percentage}%`);
      }
    };

    if (isExpanded) {
      updateSliderFill();
      const slider = speedSliderRef.current;
      slider?.addEventListener("input", updateSliderFill);
      return () => slider?.removeEventListener("input", updateSliderFill);
    }
  }, [sliderValue, isExpanded]);

  const handleRefreshClick = () => {
    triggerRefresh();
    resetToDefaults();
    hideInfoPanel();
  };

  const handleElementSelection = (value: React.SetStateAction<string>) => {
    const newName = typeof value === "function" ? value(element.name) : value;
    setSelectedElement(newName, undefined, false);
  };

  return (
    <div
      className={`${styles.bottomMenuMobile} ${
        isExpanded ? styles.expanded : ""
      }`}
    >
      <div className={styles.bar}>
        <button
          className={styles.toggleButton}
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
          aria-label={isExpanded ? "Collapse menu" : "Expand menu"}
        >
          <ChevronUpIcon />
        </button>
        <div className={styles.elementSelectorWrapper}>
          <ElementSelect
            elements={elements}
            selectedElementName={element.name}
            setSelectedElement={handleElementSelection}
          />
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.particleControls}>
          <ParticleControl
            name="Protons"
            count={protons}
            color={CONFIG.protonColor}
            max={PARTICLE_LIMIT}
            onCountChange={(newCount) => setParticles({ protons: newCount })}
          />
          <ParticleControl
            name="Neutrons"
            count={neutrons}
            color={CONFIG.neutronColor}
            max={PARTICLE_LIMIT}
            onCountChange={(newCount) => setParticles({ neutrons: newCount })}
          />
          <ParticleControl
            name="Electrons"
            count={electrons}
            color={CONFIG.electronColor}
            max={PARTICLE_LIMIT}
            onCountChange={(newCount) => setParticles({ electrons: newCount })}
          />
        </div>

        <div className={styles.controlsRow}>
          <div className={styles.controlGroup}>
            <label htmlFor="speedMobile">Speed:</label>
            <input
              id="speedMobile"
              type="range"
              ref={speedSliderRef}
              min={1}
              max={100}
              value={sliderValue}
              onChange={(e) => setSliderValue(Number(e.target.value))}
            />
          </div>
          <div className={styles.actionButtons}>
            <button
              className={styles.actionButton}
              onClick={triggerShake}
              title="Shake Atom"
              aria-label="Shake Atom"
            >
              <ShakeIcon />
            </button>
            <button
              className={styles.actionButton}
              onClick={handleRefreshClick}
              title="Reset View"
              aria-label="Reset View"
            >
              <RefreshIcon size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
