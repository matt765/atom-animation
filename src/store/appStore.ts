import { create } from "zustand";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { elements, ElementConfig } from "../elementsData/elementsData";
import { getElementByProtons } from "../components/AtomModel/elementUtils";
import { GroupData } from "@/elementsData/groupsData";

export interface ExtendedElementConfig extends ElementConfig {
  electrons: number;
  isIsotope: boolean;
  isStable: boolean;
  charge: number;
  defaultNeutrons: number;
}

export type InfoPanelContent =
  | { type: "element"; data: ExtendedElementConfig }
  | { type: "group"; data: GroupData };

type PanelMode = "hidden" | "default" | "detailed" | "periodic-table";
type StatisticsTab = "charts" | "table";

type AppState = {
  panelMode: PanelMode;
  isPanelManuallyPositioned: boolean;
  panelPosition: { x: number; y: number };
  infoPanelContent: InfoPanelContent | null;
  sliderValue: number;
  protons: number;
  neutrons: number;
  electrons: number;
  selectedElementName: string;
  refreshCounter: number;
  shakeCounter: number;
  isInputFocused: boolean;
  isNavigating: boolean;
  isCameraAnimating: boolean;
  statisticsTab: StatisticsTab;
};

type AppActions = {
  showInfoPanel: (
    content: InfoPanelContent,
    position?: { x: number; y: number }
  ) => void;
  showGroupInfo: (group: GroupData) => void;
  hideInfoPanel: () => void;
  setPanelPosition: (position: { x: number; y: number }) => void;
  setPanelManuallyPositioned: (isManual: boolean) => void;
  showDetailedView: () => void;
  setSliderValue: (value: number) => void;
  setParticles: (particles: {
    protons?: number;
    neutrons?: number;
    electrons?: number;
  }) => void;
  setSelectedElement: (
    name: string,
    position?: { x: number; y: number },
    showPanel?: boolean
  ) => void;
  triggerRefresh: () => void;
  triggerShake: () => void;
  resetToDefaults: () => void;
  resetActionCounters: () => void;
  setInputFocus: (isFocused: boolean) => void;
  navigateToHomepage: (
    router: AppRouterInstance,
    elementName: string
  ) => Promise<void>;
  setIsCameraAnimating: (isAnimating: boolean) => void;
  setStatisticsTab: (tab: StatisticsTab) => void;
};

const initialState: AppState = {
  panelMode: "hidden",
  isPanelManuallyPositioned: false,
  panelPosition: { x: 0, y: 0 },
  infoPanelContent: null,
  sliderValue: 50,
  protons: 22,
  neutrons: 26,
  electrons: 22,
  selectedElementName: "Titanium",
  refreshCounter: 0,
  shakeCounter: 0,
  isInputFocused: false,
  isNavigating: false,
  isCameraAnimating: false,
  statisticsTab: "charts",
};

export const useAppStore = create<AppState & AppActions>((set, get) => ({
  ...initialState,

  showInfoPanel: (content, position) => {
    set({
      panelMode: "default",
      infoPanelContent: content,
      panelPosition: position || { x: 0, y: 0 },
      isPanelManuallyPositioned: !!position,
    });
  },

  showGroupInfo: (group: GroupData) => {
    if (get().panelMode === "periodic-table") {
      set({ infoPanelContent: { type: "group", data: group } });
    } else {
      set({
        panelMode: "periodic-table",
        infoPanelContent: { type: "group", data: group },
        panelPosition: { x: 0, y: 0 },
        isPanelManuallyPositioned: false,
      });
    }
  },

  hideInfoPanel: () => {
    set({
      panelMode: "hidden",
      infoPanelContent: null,
      panelPosition: { x: 0, y: 0 },
      isPanelManuallyPositioned: false,
      isCameraAnimating: false,
    });
  },

  setPanelPosition: (position) => {
    set({ panelPosition: position });
  },

  setPanelManuallyPositioned: (isManual: boolean) => {
    set({ isPanelManuallyPositioned: isManual });
  },

  showDetailedView: () => {
    const element = deriveCurrentElement(get());
    const content = { type: "element" as const, data: element };

    const panelWidth = 480;
    const panelHeight = 600;
    const x = window.innerWidth - panelWidth - window.innerWidth * 0.15;
    const y = (window.innerHeight - panelHeight) / 2;

    set({
      panelMode: "detailed",
      infoPanelContent: content,
      isCameraAnimating: true,
      panelPosition: { x: Math.max(10, x), y: Math.max(10, y) },
      isPanelManuallyPositioned: true,
    });
  },

  setSliderValue: (value) => set({ sliderValue: value }),

  setParticles: (newParticles) => {
    const currentState = get();
    const {
      protons = currentState.protons,
      neutrons,
      electrons,
    } = newParticles;
    const elementData = getElementByProtons(protons);

    set({
      protons,
      neutrons: neutrons !== undefined ? neutrons : currentState.neutrons,
      electrons: electrons !== undefined ? electrons : currentState.electrons,
      selectedElementName: elementData.name,
    });
  },

  setSelectedElement: (name, position, showPanel = true) => {
    const element = elements.find((el) => el.name === name);
    if (element) {
      const newState = {
        selectedElementName: element.name,
        protons: element.protons,
        neutrons: element.neutrons,
        electrons: element.protons,
      };
      set(newState);

      if (showPanel) {
        const extendedElement = deriveCurrentElement({ ...get(), ...newState });
        if (position) {
          get().showInfoPanel(
            { type: "element", data: extendedElement },
            position
          );
        } else {
          if (get().panelMode === "periodic-table") {
            set({
              infoPanelContent: { type: "element", data: extendedElement },
            });
          } else {
            set({
              panelMode: "periodic-table",
              infoPanelContent: { type: "element", data: extendedElement },
              panelPosition: { x: 0, y: 0 },
              isPanelManuallyPositioned: false,
            });
          }
        }
      }
    }
  },

  triggerRefresh: () =>
    set((state) => ({ refreshCounter: state.refreshCounter + 1 })),
  triggerShake: () =>
    set((state) => ({ shakeCounter: state.shakeCounter + 1 })),
  resetActionCounters: () => set({ refreshCounter: 0, shakeCounter: 0 }),
  setInputFocus: (isFocused) => set({ isInputFocused: isFocused }),
  resetToDefaults: () => {
    const defaultElement = elements.find((el) => el.name === "Titanium");
    if (defaultElement) {
      set({
        sliderValue: 50,
        selectedElementName: defaultElement.name,
        protons: defaultElement.protons,
        neutrons: defaultElement.neutrons,
        electrons: defaultElement.protons,
        isCameraAnimating: false,
      });
    }
  },
  navigateToHomepage: async (router, elementName) => {
    set({ isNavigating: true });
    get().setSelectedElement(elementName, undefined, false);
    await router.push("/");
    setTimeout(() => set({ isNavigating: false }), 100);
  },
  setIsCameraAnimating: (isAnimating) =>
    set({ isCameraAnimating: isAnimating }),
  setStatisticsTab: (tab) => set({ statisticsTab: tab }),
}));

export const deriveCurrentElement = (
  state: AppState
): ExtendedElementConfig => {
  const { protons, neutrons, electrons, selectedElementName } = state;
  const baseElement =
    elements.find((el) => el.name === selectedElementName) ||
    getElementByProtons(protons);

  const isIsotope = baseElement.neutrons !== neutrons;
  const charge = protons - electrons;
  const massNumber = protons + neutrons;

  const getStability = () => {
    return baseElement.stableNeutrons.includes(neutrons);
  };

  return {
    ...baseElement,
    protons,
    neutrons,
    electrons,
    atomicWeight: isIsotope ? massNumber.toString() : baseElement.atomicWeight,
    isIsotope,
    charge,
    isStable: getStability(),
    defaultNeutrons: baseElement.neutrons,
  };
};
