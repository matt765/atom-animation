import { create } from "zustand";
import { ElementConfig, elements } from "../components/AtomModel/elementsData";
import { GroupData } from "../components/AtomModel/groupsData";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export type ExtendedElementConfig = ElementConfig & {
  isIsotope: boolean;
  isStable: boolean;
  charge: number;
  defaultNeutrons: number;
  electrons: number;
};

export type InfoPanelContent =
  | { type: "element"; data: ExtendedElementConfig }
  | { type: "group"; data: GroupData };

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

const calculateExtendedElementConfig = (
  protons: number,
  neutrons: number,
  electrons: number
): ExtendedElementConfig => {
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

interface AppState {
  protons: number;
  neutrons: number;
  electrons: number;
  sliderValue: number;
  isPanelVisible: boolean;
  panelPosition: { x: number; y: number };
  infoPanelContent: InfoPanelContent | null;
  isNavigating: boolean;
  refreshCounter: number;
  shakeCounter: number;
  isInputFocused: boolean;

  setParticles: (particles: {
    protons?: number;
    neutrons?: number;
    electrons?: number;
  }) => void;
  setSelectedElement: (
    elementName: string,
    position?: { x: number; y: number },
    shouldShowPanel?: boolean
  ) => void;
  showGroupInfo: (group: GroupData) => void;
  updateParticlesFromElement: (elementName: string) => void;
  navigateToHomepage: (router: AppRouterInstance, elementName: string) => void;
  setSliderValue: (value: number) => void;
  setInputFocus: (isFocused: boolean) => void;
  hideInfoPanel: () => void;
  setPanelPosition: (position: { x: number; y: number }) => void;
  triggerRefresh: () => void;
  triggerShake: () => void;
  resetActionCounters: () => void;
  resetToDefaults: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  protons: 22,
  neutrons: 26,
  electrons: 22,
  sliderValue: 25,
  isPanelVisible: false,
  panelPosition: { x: 0, y: 0 },
  infoPanelContent: null,
  isNavigating: false,
  refreshCounter: 0,
  shakeCounter: 0,
  isInputFocused: false,

  setParticles: (particles) => {
    set({ ...particles });
  },
  updateParticlesFromElement: (elementName) => {
    const element =
      elements.find((el) => el.name === elementName) || UNKNOWN_ELEMENT;
    set({
      protons: element.protons,
      neutrons: element.neutrons,
      electrons: element.protons,
    });
  },
  setSelectedElement: (elementName, position, shouldShowPanel = false) => {
    get().updateParticlesFromElement(elementName);

    if (shouldShowPanel) {
      const wasPanelVisible = get().isPanelVisible;
      const element = elements.find((el) => el.name === elementName);
      if (!element) return;

      const extendedConfig = calculateExtendedElementConfig(
        element.protons,
        element.neutrons,
        element.protons
      );
      set({
        infoPanelContent: { type: "element", data: extendedConfig },
        isPanelVisible: true,
        panelPosition:
          position ?? (wasPanelVisible ? get().panelPosition : { x: 0, y: 0 }),
      });
    }
  },
  showGroupInfo: (group) => {
    const wasPanelVisible = get().isPanelVisible;
    set({
      infoPanelContent: { type: "group", data: group },
      isPanelVisible: true,
    });
    if (!wasPanelVisible) {
      set({ panelPosition: { x: 0, y: 0 } });
    }
  },
  navigateToHomepage: (router, elementName) => {
    set({ isNavigating: true });
    get().setSelectedElement(elementName, undefined, false);

    setTimeout(() => {
      router.push("/");
    }, 500);
  },
  setSliderValue: (value) => set({ sliderValue: value }),
  setInputFocus: (isFocused) => set({ isInputFocused: isFocused }),
  hideInfoPanel: () =>
    set({ isPanelVisible: false, infoPanelContent: null, isNavigating: false }),
  setPanelPosition: (position) => set({ panelPosition: position }),
  triggerRefresh: () =>
    set((state) => ({ refreshCounter: state.refreshCounter + 1 })),
  triggerShake: () =>
    set((state) => ({ shakeCounter: state.shakeCounter + 1 })),
  resetActionCounters: () => set({ refreshCounter: 0, shakeCounter: 0 }),
  resetToDefaults: () => {
    const { protons } = get();
    const element =
      elements.find((el) => el.protons === protons) || UNKNOWN_ELEMENT;
    set({
      neutrons: element.neutrons,
      electrons: element.protons,
      sliderValue: 25,
    });
  },
}));

export const useCurrentElement = (): ExtendedElementConfig => {
  const { protons, neutrons, electrons } = useAppStore();
  return calculateExtendedElementConfig(protons, neutrons, electrons);
};
