import { ElementConfig } from "@/elementsData/types";
import { elements } from "../../elementsData/elementsData";

export const getElementByProtons = (protons: number): ElementConfig => {
  const element = elements.find((el) => el.protons === protons);
  if (element) {
    return element;
  }

  return {
    name: "Unknown",
    symbol: "X",
    appearance: null,
    color: null,
    protons: protons,
    neutrons: 0,
    electrons: protons,
    atomicWeight: protons,
    stability: "radioactive",
    occurrence: "synthetic",
    stableNeutrons: [],
    electronConfiguration: "Custom",
    electronConfigurationFull: "Custom",
    shells: [],
    oxidationStates: null,
    electronegativity: null,
    electronAffinity: null,
    ionizationEnergies: [],
    atomicRadius: {
      covalent: null,
      empirical: null,
      vanDerWaals: null,
      ionic: null,
    },
    group: -1,
    period: -1,
    block: "d",
    chemicalSeries: "Transition metals",
    stateAtSTP: null,
    crystalStructure: null,
    magneticOrdering: null,
    thermalExpansion: null,
    speedOfSound: null,
    poissonRatio: null,
    triplePoint: null,
    density: [],
    phaseTransitions: [],
    hardness: null,
    modulus: null,
    conductivity: {
      thermal: null,
      electrical: null,
    },
    heat: {
      specific: null,
      molar: null,
      fusion: null,
      vaporization: null,
    },
    discoveryYear: null,
    discoverer: null,
    abundance: {
      crust: null,
      ocean: null,
      solar: null,
      human: null,
      universe: null,
    },
    casNumber: null,
    title: "Custom Particle",
    description: "A custom particle with a specified number of protons.",
  };
};
