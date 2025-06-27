import { ElementConfig, elements } from "../../elementsData/elementsData";

export type ElementCategory =
  | "alkali-metal"
  | "alkaline-earth-metal"
  | "lanthanide"
  | "actinide"
  | "transition-metal"
  | "other-metal"
  | "metalloid"
  | "nonmetal"
  | "halogen"
  | "noble-gas"
  | "unknown";

export const getElementCategory = (element: ElementConfig): ElementCategory => {
  const { protons, group } = element;

  if (protons >= 57 && protons <= 71) return "lanthanide";
  if (protons >= 89 && protons <= 103) return "actinide";

  if (group === 1) return protons === 1 ? "nonmetal" : "alkali-metal";
  if (group === 2) return "alkaline-earth-metal";
  if (group >= 3 && group <= 12) return "transition-metal";

  const halogens: number[] = [9, 17, 35, 53, 85, 117];
  if (halogens.includes(protons)) return "halogen";

  if (group === 18) return "noble-gas";

  const metalloids: number[] = [5, 14, 32, 33, 51, 52, 84];
  if (metalloids.includes(protons)) return "metalloid";

  const otherMetals: number[] = [
    13, 31, 49, 50, 81, 82, 83, 113, 114, 115, 116,
  ];
  if (otherMetals.includes(protons)) return "other-metal";

  const nonmetals: number[] = [1, 6, 7, 8, 15, 16, 34];
  if (nonmetals.includes(protons)) return "nonmetal";

  return "unknown";
};

export const getElementByProtons = (protons: number): ElementConfig => {
  const element = elements.find((el) => el.protons === protons);
  if (element) {
    return element;
  }

  return {
    name: "Unknown",
    symbol: "X",
    title: "Custom Particle",
    description: "A custom particle with a specified number of protons.",
    protons: protons,
    neutrons: 0,
    atomicWeight: protons.toString(),
    electronConfiguration: "Custom",
    stateAtSTP: "Unknown",
    group: -1,
    period: -1,
    stableNeutrons: [],
    shells: [],
    meltingPointK: null,
    boilingPointK: null,
  };
};
