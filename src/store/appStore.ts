import { create } from "zustand";
import { ElementConfig, elements } from "../components/AtomModel/elementsData";

import type { SetStateAction } from "react";

interface AppState {
  // Stan
  selectedElementName: string;
  sliderValue: number;
  isPanelVisible: boolean;
  panelPosition: { x: number; y: number };
  refreshCounter: number;

  // Akcje
  setSelectedElement: (update: SetStateAction<string>) => void;
  setSliderValue: (value: number) => void;
  showInfoPanel: (position?: { x: number; y: number }) => void; // Zmieniono na opcjonalny
  hideInfoPanel: () => void;
  setPanelPosition: (position: { x: number; y: number }) => void;
  triggerRefresh: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Stan początkowy
  selectedElementName: "Oxygen",
  sliderValue: 50,
  isPanelVisible: false,
  panelPosition: { x: 0, y: 0 },
  refreshCounter: 0,

  // Implementacje akcji
  setSelectedElement: (update) =>
    set((state) => ({
      selectedElementName:
        typeof update === "function"
          ? update(state.selectedElementName)
          : update,
    })),
  setSliderValue: (value) => set({ sliderValue: value }),
  showInfoPanel: (position) =>
    set((state) => ({
      isPanelVisible: true,
      // Jeśli pozycja jest podana, zaktualizuj ją. W przeciwnym razie, użyj istniejącej.
      panelPosition: position !== undefined ? position : state.panelPosition,
    })),
  hideInfoPanel: () => set({ isPanelVisible: false }),
  setPanelPosition: (position) => set({ panelPosition: position }),
  triggerRefresh: () =>
    set((state) => ({ refreshCounter: state.refreshCounter + 1 })),
}));

// Selektor, który zwraca cały obiekt aktualnie wybranego pierwiastka
export const useCurrentElement = (): ElementConfig => {
  const selectedName = useAppStore((state) => state.selectedElementName);
  const element = elements.find((el) => el.name === selectedName);
  return element || elements[0];
};
