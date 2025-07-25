import { create } from "zustand";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { elements } from "../elementsData/elementsData";
import { getElementByProtons } from "../utils/elementUtils";
import { FullGroupData } from "@/elementsData/groupsData";
import { ElementConfig } from "@/elementsData/types";

export interface ExtendedElementConfig extends ElementConfig {
  isIsotope: boolean;
  isStable: boolean;
  charge: number;
  defaultNeutrons: number;
}

export type ModalContent =
  | { type: "element"; data: ExtendedElementConfig }
  | { type: "group"; data: FullGroupData };

interface ModalState {
  isVisible: boolean;
  content: ModalContent | null;
  currentPosition: { x: number; y: number };
  isManuallyPositioned: boolean;
  initialPlacement: "cursor" | "right-side";
}

type StatisticsTab = "charts" | "table";
type ModalType = "homepage" | "periodicTable";

type AppState = {
  homepageModal: ModalState;
  periodicTableModal: Omit<ModalState, "initialPlacement">;
  isAtomModelInFocusView: boolean;
  bottomMenuSliderValue: number;
  bottomMenuProtons: number;
  bottomMenuNeutrons: number;
  bottomMenuElectrons: number;
  selectedElementName: string;
  bottomMenuRefreshCounter: number;
  bottomMenuShakeCounter: number;
  isParticleControlInputFocused: boolean;
  isNavigatingBetweenPages: boolean;
  statisticsActiveTab: StatisticsTab;
};

type AppActions = {
  showHomepageModal: (
    placement: "cursor" | "right-side",
    position?: { x: number; y: number }
  ) => void;
  hideHomepageModal: () => void;
  showPeriodicTableModal: (content: ModalContent) => void;
  hidePeriodicTableModal: () => void;
  setModalPosition: (
    type: ModalType,
    position: { x: number; y: number }
  ) => void;
  setModalManuallyPositioned: (type: ModalType, isManual: boolean) => void;
  setBottomMenuSliderValue: (value: number) => void;
  setBottomMenuParticles: (particles: {
    protons?: number;
    neutrons?: number;
    electrons?: number;
  }) => void;
  setSelectedElement: (
    name: string,
    position?: { x: number; y: number }
  ) => void;
  triggerAtomModelRefresh: () => void;
  triggerAtomModelShake: () => void;
  resetAtomModelToDefaults: () => void;
  resetActionCounters: () => void;
  setParticleControlInputFocus: (isFocused: boolean) => void;
  navigateToHomepage: (
    router: AppRouterInstance,
    elementName: string
  ) => Promise<void>;
  setIsAtomModelInFocusView: (isAnimating: boolean) => void;
  setStatisticsActiveTab: (tab: StatisticsTab) => void;
};

const initialModalState: ModalState = {
  isVisible: false,
  content: null,
  currentPosition: { x: 0, y: 0 },
  isManuallyPositioned: false,
  initialPlacement: "cursor",
};

const initialPeriodicTableState: Omit<ModalState, "initialPlacement"> = {
  isVisible: false,
  content: null,
  currentPosition: { x: 0, y: 0 },
  isManuallyPositioned: false,
};

const initialState: AppState = {
  homepageModal: { ...initialModalState },
  periodicTableModal: { ...initialPeriodicTableState },
  isAtomModelInFocusView: false,
  bottomMenuSliderValue: 50,
  bottomMenuProtons: 22,
  bottomMenuNeutrons: 26,
  bottomMenuElectrons: 22,
  selectedElementName: "Titanium",
  bottomMenuRefreshCounter: 0,
  bottomMenuShakeCounter: 0,
  isParticleControlInputFocused: false,
  isNavigatingBetweenPages: false,
  statisticsActiveTab: "charts",
};

export const useAppStore = create<AppState & AppActions>((set, get) => ({
  ...initialState,

  showHomepageModal: (placement, position) => {
    const element = deriveCurrentElement(get());
    const content = { type: "element" as const, data: element };

    let modalPosition = position || { x: 0, y: 0 };
    let isManuallyPositioned = !!position;
    let isFocusView = false;

    if (placement === "right-side") {
      const panelWidth = 480;
      const panelHeight = 600;
      const x = window.innerWidth - panelWidth - window.innerWidth * 0.15;
      const y = (window.innerHeight - panelHeight) / 2;
      modalPosition = { x: Math.max(10, x), y: Math.max(10, y) };
      isManuallyPositioned = true;
      isFocusView = true;
    }

    set({
      homepageModal: {
        isVisible: true,
        content: content,
        currentPosition: modalPosition,
        isManuallyPositioned: isManuallyPositioned,
        initialPlacement: placement,
      },
      isAtomModelInFocusView: isFocusView,
    });
  },

  hideHomepageModal: () => {
    set({
      homepageModal: { ...initialModalState },
      isAtomModelInFocusView: false,
    });
  },

  showPeriodicTableModal: (content) => {
    const currentState = get().periodicTableModal;

    if (currentState.isVisible) {
      set({
        periodicTableModal: {
          ...currentState,
          content,
        },
      });
    } else {
      set({
        periodicTableModal: {
          ...initialPeriodicTableState,
          isVisible: true,
          content,
        },
      });
    }
  },

  hidePeriodicTableModal: () => {
    set({ periodicTableModal: { ...initialPeriodicTableState } });
  },

  setModalPosition: (type, position) => {
    const modalName = `${type}Modal` as "homepageModal" | "periodicTableModal";
    set((state) => ({
      [modalName]: { ...state[modalName], currentPosition: position },
    }));
  },

  setModalManuallyPositioned: (type, isManual) => {
    const modalName = `${type}Modal` as "homepageModal" | "periodicTableModal";
    set((state) => ({
      [modalName]: {
        ...state[modalName],
        isManuallyPositioned: isManual,
      },
    }));
  },

  setBottomMenuSliderValue: (value) => set({ bottomMenuSliderValue: value }),

  setBottomMenuParticles: (newParticles) => {
    const currentState = get();
    const {
      protons = currentState.bottomMenuProtons,
      neutrons,
      electrons,
    } = newParticles;
    const elementData = getElementByProtons(protons);
    set({
      bottomMenuProtons: protons,
      bottomMenuNeutrons:
        neutrons !== undefined ? neutrons : currentState.bottomMenuNeutrons,
      bottomMenuElectrons:
        electrons !== undefined ? electrons : currentState.bottomMenuElectrons,
      selectedElementName: elementData.name,
    });
  },

  setSelectedElement: (name, position) => {
    if (position) {
      get().showHomepageModal("cursor", position);
    } else {
      const element = elements.find((el) => el.name === name);
      if (!element) return;

      const elementStateUpdate = {
        selectedElementName: element.name,
        bottomMenuProtons: element.protons,
        bottomMenuNeutrons: element.neutrons,
        bottomMenuElectrons: element.protons,
      };
      set(elementStateUpdate);

      const extendedElement = deriveCurrentElement({
        ...get(),
        ...elementStateUpdate,
      });
      const content = { type: "element" as const, data: extendedElement };
      get().showPeriodicTableModal(content);
    }
  },

  triggerAtomModelRefresh: () =>
    set((state) => ({
      bottomMenuRefreshCounter: state.bottomMenuRefreshCounter + 1,
    })),

  triggerAtomModelShake: () =>
    set((state) => ({
      bottomMenuShakeCounter: state.bottomMenuShakeCounter + 1,
    })),

  resetActionCounters: () =>
    set({ bottomMenuRefreshCounter: 0, bottomMenuShakeCounter: 0 }),

  setParticleControlInputFocus: (isFocused) =>
    set({ isParticleControlInputFocused: isFocused }),

  resetAtomModelToDefaults: () => {
    const currentState = get();
    const currentProtons = currentState.bottomMenuProtons;

    let targetElement = [...elements]
      .sort((a, b) => b.protons - a.protons)
      .find((el) => el.protons <= currentProtons);

    if (!targetElement) {
      targetElement = elements[0];
    }

    set({
      bottomMenuSliderValue: 50,
      selectedElementName: targetElement.name,
      bottomMenuProtons: targetElement.protons,
      bottomMenuNeutrons: targetElement.neutrons,
      bottomMenuElectrons: targetElement.protons,
      isAtomModelInFocusView: false,
      homepageModal: { ...initialModalState },
      bottomMenuRefreshCounter: currentState.bottomMenuRefreshCounter + 1,
    });
  },

  navigateToHomepage: async (router, elementName) => {
    set({ isNavigatingBetweenPages: true });
    const element = elements.find((el) => el.name === elementName);
    if (element) {
      set({
        selectedElementName: element.name,
        bottomMenuProtons: element.protons,
        bottomMenuNeutrons: element.neutrons,
        bottomMenuElectrons: element.protons,
      });
    }
    await router.push("/");
    setTimeout(() => set({ isNavigatingBetweenPages: false }), 100);
  },

  setIsAtomModelInFocusView: (isAnimating) =>
    set({ isAtomModelInFocusView: isAnimating }),
  setStatisticsActiveTab: (tab) => set({ statisticsActiveTab: tab }),
}));

export const deriveCurrentElement = (
  state: AppState
): ExtendedElementConfig => {
  const {
    bottomMenuProtons,
    bottomMenuNeutrons,
    bottomMenuElectrons,
    selectedElementName,
  } = state;
  const baseElement =
    elements.find((el) => el.name === selectedElementName) ||
    getElementByProtons(bottomMenuProtons);

  const isIsotope = baseElement.neutrons !== bottomMenuNeutrons;
  const charge = bottomMenuProtons - bottomMenuElectrons;
  const massNumber = bottomMenuProtons + bottomMenuNeutrons;

  const getStability = () => {
    return baseElement.stableNeutrons.includes(bottomMenuNeutrons);
  };

  return {
    ...baseElement,
    protons: bottomMenuProtons,
    neutrons: bottomMenuNeutrons,
    electrons: bottomMenuElectrons,
    atomicWeight: isIsotope ? massNumber : baseElement.atomicWeight,
    isIsotope,
    charge,
    isStable: getStability(),
    defaultNeutrons: baseElement.neutrons,
  };
};
