import { create } from "zustand";
import { ElementConfig, elements } from "../components/AtomModel/elementsData";
import type { SetStateAction } from "react";

export type ExtendedElementConfig = ElementConfig & {
  isIsotope: boolean;
  isStable: boolean;
  charge: number;
  defaultNeutrons: number;
  electrons: number;
};

const UNKNOWN_ELEMENT: ElementConfig = {
  name: "Unknown",
  symbol: "?",
  protons: 0,
  neutrons: 0,
  stableNeutrons: [],
  shells: [],
  atomicWeight: "—",
  electronConfiguration: "[Unknown]",
  title: "Custom Particle",
  description:
    "This combination of particles does not correspond to a known element. You are exploring the frontiers of physics!",
  group: 0,
  period: 0,
  stateAtSTP: "Unknown",
  meltingPointK: null,
  boilingPointK: null,
};

const calculateShells = (electronCount: number): number[] => {
  if (electronCount <= 0) return [];
  const shells: number[] = [];
  let remainingElectrons = electronCount;
  const shellCapacities = [2, 8, 18, 32, 32, 18, 8];

  for (const capacity of shellCapacities) {
    if (remainingElectrons > 0) {
      const electronsInShell = Math.min(remainingElectrons, capacity);
      shells.push(electronsInShell);
      remainingElectrons -= electronsInShell;
    } else {
      break;
    }
  }
  if (remainingElectrons > 0) {
    shells.push(remainingElectrons);
  }
  return shells;
};

interface AppState {
  selectedElementName: string;
  protons: number;
  neutrons: number;
  electrons: number;
  sliderValue: number;
  isPanelVisible: boolean;
  panelPosition: { x: number; y: number };
  refreshCounter: number;
  shakeCounter: number;
  isInputFocused: boolean;

  setParticles: (particles: {
    protons?: number;
    neutrons?: number;
    electrons?: number;
  }) => void;
  setSelectedElement: (update: SetStateAction<string>) => void;
  updateParticlesFromElement: (elementName: string) => void;
  setSliderValue: (value: number) => void;
  setInputFocus: (isFocused: boolean) => void;
  showInfoPanel: (position?: { x: number; y: number }) => void;
  hideInfoPanel: () => void;
  setPanelPosition: (position: { x: number; y: number }) => void;
  triggerRefresh: () => void;
  triggerShake: () => void;
  resetActionCounters: () => void;
  resetToDefaults: () => void; // NOWA AKCJA
}

export const useAppStore = create<AppState>((set, get) => ({
  selectedElementName: "Carbon",
  protons: 6,
  neutrons: 6,
  electrons: 6,
  sliderValue: 25, // ZMNIEJSZONA WARTOŚĆ DOMYŚLNA
  isPanelVisible: false,
  panelPosition: { x: 0, y: 0 },
  refreshCounter: 0,
  shakeCounter: 0,
  isInputFocused: false,

  setParticles: (particles) => {
    const currentState = get();
    const newProtons = particles.protons ?? currentState.protons;
    const baseElement = elements.find((el) => el.protons === newProtons);
    set({
      ...particles,
      selectedElementName: baseElement ? baseElement.name : "Unknown",
    });
  },
  setSelectedElement: (update) => {
    const currentName = get().selectedElementName;
    const newName = typeof update === "function" ? update(currentName) : update;
    get().updateParticlesFromElement(newName);
  },
  updateParticlesFromElement: (elementName) => {
    const element =
      elements.find((el) => el.name === elementName) || UNKNOWN_ELEMENT;
    set({
      selectedElementName: elementName,
      protons: element.protons,
      neutrons: element.neutrons,
      electrons: element.protons,
    });
  },
  setSliderValue: (value) => set({ sliderValue: value }),
  setInputFocus: (isFocused) => set({ isInputFocused: isFocused }),
  showInfoPanel: (position) =>
    set((state) => ({
      isPanelVisible: true,
      panelPosition: position !== undefined ? position : state.panelPosition,
    })),
  hideInfoPanel: () => set({ isPanelVisible: false }),
  setPanelPosition: (position) => set({ panelPosition: position }),
  triggerRefresh: () =>
    set((state) => ({ refreshCounter: state.refreshCounter + 1 })),
  triggerShake: () =>
    set((state) => ({ shakeCounter: state.shakeCounter + 1 })),
  resetActionCounters: () => set({ refreshCounter: 0, shakeCounter: 0 }),

  // IMPLEMENTACJA NOWEJ AKCJI
  resetToDefaults: () => {
    const { protons } = get();
    const element =
      elements.find((el) => el.protons === protons) || UNKNOWN_ELEMENT;
    set({
      neutrons: element.neutrons, // Domyślna liczba neutronów
      electrons: element.protons, // Domyślna liczba elektronów (równa liczbie protonów)
      sliderValue: 25, // Domyślna wartość suwaka
    });
  },
}));

export const useCurrentElement = (): ExtendedElementConfig => {
  const { protons, neutrons, electrons } = useAppStore();

  const baseElement = elements.find((el) => el.protons === protons);
  const charge = protons - electrons;

  if (!baseElement) {
    return {
      ...UNKNOWN_ELEMENT,
      protons,
      neutrons,
      electrons,
      atomicWeight: (protons + neutrons).toString(),
      shells: calculateShells(electrons),
      isIsotope: true,
      isStable: false,
      charge,
      defaultNeutrons: 0,
    };
  }

  const isIsotope = baseElement.neutrons !== neutrons;
  const isStable = baseElement.stableNeutrons.includes(neutrons);

  return {
    ...baseElement,
    protons,
    neutrons,
    electrons,
    atomicWeight: (protons + neutrons).toString(),
    shells: calculateShells(electrons),
    isIsotope,
    isStable,
    charge,
    defaultNeutrons: baseElement.neutrons,
  };
};
