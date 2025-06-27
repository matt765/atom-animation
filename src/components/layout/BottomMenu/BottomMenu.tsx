"use client";

import React, { useRef, useEffect } from "react";
import styles from "./BottomMenu.module.css";
import { ElementSelect } from "../../AtomModel/ElementSelect/ElementSelect";
import { CONFIG } from "../../AtomModel/AtomModel";
import { useAppStore, deriveCurrentElement } from "../../../store/appStore";
import { elements } from "../../../elementsData/elementsData";
import { ParticleControl } from "./ParticleControl";
import { ShakeIcon } from "@/assets/icons/ShakeIcon";
import { RefreshIcon } from "@/assets/icons/RefreshIcon";

const PARTICLE_LIMIT = 300;

const formatCharge = (charge: number): string => {
  if (charge === 0) return "";
  const sign = charge > 0 ? "+" : "−";
  const absCharge = Math.abs(charge);
  if (absCharge === 1) return sign;
  return `${absCharge}${sign}`;
};

export const BottomMenu = () => {
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
    showDetailedView,
  } = useAppStore();
  const element = useAppStore(deriveCurrentElement);
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
    updateSliderFill();
    const slider = speedSliderRef.current;
    slider?.addEventListener("input", updateSliderFill);
    return () => slider?.removeEventListener("input", updateSliderFill);
  }, [sliderValue]);

  const handleRefreshClick = () => {
    triggerRefresh();
    resetToDefaults();
    hideInfoPanel();
  };

  const handleElementSelection = (value: React.SetStateAction<string>) => {
    const newName = typeof value === "function" ? value(element.name) : value;
    setSelectedElement(newName, undefined, false);
  };

  const handleDisplayClick = () => {
    // Ta akcja ma zawsze włączać widok szczegółowy.
    // Zamykanie tego widoku odbywa się poprzez inne akcje (np. kliknięcie poza panelem).
    // To uproszczenie eliminuje niespójne zachowanie przycisku.
    showDetailedView();
  };

  const isLongConfig = element.electronConfiguration.split(" ").length >= 5;

  return (
    <div className={styles.bottomMenu}>
      <div className={styles.elementDisplayWrapper}>
        <div
          className={`${styles.elementDisplay} ${
            isLongConfig ? styles.wideDisplay : ""
          }`}
          onClick={handleDisplayClick}
        >
          <div className={styles.atomicNumber}>
            {element.protons > 0 ? element.protons : ""}
          </div>
          <div className={styles.electronConfiguration}>
            {element.electronConfiguration}
          </div>
          <div className={styles.elementSymbol}>
            {element.symbol}
            {element.charge !== 0 && (
              <sup className={styles.chargeIndicator}>
                {formatCharge(element.charge)}
              </sup>
            )}
          </div>
          <div className={styles.elementName}>{element.name}</div>
          <div className={styles.atomicWeight}>{element.atomicWeight}</div>
        </div>
      </div>
      <div className={styles.rightPanel}>
        <div className={styles.controlsRow}>
          <ElementSelect
            elements={elements}
            selectedElementName={element.name}
            setSelectedElement={handleElementSelection}
          />
          <div className={styles.controlGroup} id="speed-control-group">
            <label htmlFor="speed">Speed:</label>
            <input
              id="speed"
              type="range"
              ref={speedSliderRef}
              min={1}
              max={100}
              value={sliderValue}
              onChange={(e) => setSliderValue(Number(e.target.value))}
            />
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
        <div className={styles.legend}>
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
      </div>
    </div>
  );
};
