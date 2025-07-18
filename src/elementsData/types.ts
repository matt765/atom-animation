/**
 * Represents a single data point for a physical property.
 */
export type PhysicalPropertyPoint = {
  value: number | null;
  state?: "solid" | "liquid" | "gas";
  allotrope?: string;
  temperature_K?: number; // Kelvin
  pressure_Pa?: number; // Pascals
  comment?: string;
};

/**
 * Represents a phase transition point, including its type and conditions.
 */
export type PhaseTransitionPoint = {
  type: "melting" | "boiling" | "sublimation";
  temperature_K: number; // Kelvin
  pressure_Pa?: number; // Pascals
  comment?: string;
};

/**
 * Defines the complete configuration for a single chemical element.
 */
export type ElementConfig = {
  // --- Primary Identifiers ---
  name: string;
  symbol: string;
  appearance: string | null; // A descriptive, human-readable string, e.g., "silvery-white metal"
  color: string | string[] | null; // HEX color code

  // --- Core Atomic Properties ---
  protons: number; // Atomic number (unitless)
  neutrons: number; // Default neutron count for the most common isotope (unitless)
  electrons: number; // Number of electrons in a neutral atom (unitless)
  atomicWeight: number; // Atomic weight (u)
  stability: "stable" | "radioactive";
  occurrence: "primordial" | "from_decay" | "synthetic";
  stableNeutrons: number[]; // List of stable neutron counts (unitless)

  // --- Electron & Chemical Properties ---
  electronConfiguration: string; // Condensed, e.g., [Ar] 3d³ 4s²
  electronConfigurationFull: string; // Full, e.g., 1s² 2s²...
  shells: number[]; // Electron shell configuration, e.g., [2, 8, 11, 2]
  oxidationStates: string | null; // e.g., "+5, +4, +3, +2"
  electronegativity: number | null; // Pauling scale, unitless
  electronAffinity: number | null; // kJ/mol
  ionizationEnergies: (number | null)[]; // List of ionization energies (kJ/mol)
  atomicRadius: {
    covalent: number | null; // pm
    empirical: number | null; // atomic empirical, pm
    vanDerWaals: number | null; // pm
    ionic: number | null; // pm
  };

  // --- Periodic Table Classification ---
  group: number;
  period: number;
  block: "s" | "p" | "d" | "f";
  chemicalSeries:
    | "Alkali metals"
    | "Alkaline earth metals"
    | "Lanthanoids"
    | "Actinoids"
    | "Transition metals"
    | "Post-transition metals"
    | "Metalloids"
    | "Halogens"
    | "Other nonmetals"
    | "Noble gases";

  // --- Physical Properties ---
  stateAtSTP: "gas" | "liquid" | "solid" | null;
  crystalStructure:
    | "bcc"
    | "fcc"
    | "hcp"
    | "simple cubic"
    | "diamond cubic"
    | "rhombohedral"
    | "tetragonal"
    | "orthorhombic"
    | "monoclinic"
    | "triclinic"
    | "amorphous"
    | "hexagonal"
    | null;
  magneticOrdering:
    | "diamagnetic"
    | "paramagnetic"
    | "ferromagnetic"
    | "antiferromagnetic"
    | null;
  thermalExpansion: number | null; // at 20 °C (1/K)
  speedOfSound: number | null; // For thin rod, at r.t. (m/s)
  poissonRatio: number | null; // unitless

  triplePoint: {
    temperature_K: number | null; // Kelvin
    pressure_Pa: number | null; // Pascals
  } | null;

  density: PhysicalPropertyPoint[]; // List of density values (g/cm³)

  phaseTransitions: PhaseTransitionPoint[]; // List of phase transitions

  hardness: {
    mohs: PhysicalPropertyPoint[] | null; // Mohs scale (unitless)
    vickers: PhysicalPropertyPoint[] | null; // Vickers hardness (MPa)
    brinell: PhysicalPropertyPoint[] | null; // Brinell hardness (MPa)
  } | null;

  modulus: {
    youngs: PhysicalPropertyPoint[] | null; // Young's modulus (GPa)
    shear: PhysicalPropertyPoint[] | null; // Shear modulus (GPa)
    bulk: PhysicalPropertyPoint[] | null; // Bulk modulus (GPa)
  } | null;

  conductivity: {
    thermal: PhysicalPropertyPoint[] | null; // Thermal conductivity (W/(m·K))
    electrical: PhysicalPropertyPoint[] | null; // Electrical conductivity (S/m)
  } | null;

  heat: {
    specific: number | null; // J/(g·K)
    molar: number | null; // J/(mol·K)
    fusion: number | null; // kJ/mol
    vaporization: number | null; // kJ/mol
  };

  // --- History & External Identifiers ---
  discoveryYear: number | string | null;
  discoverer: string | null;
  abundance: {
    crust: number | null; // ppm
    ocean: number | null; // ppm
    solar: number | null; // ppm
    human: number | null; // ppm
    universe: number | null; // ppm
  };
  casNumber: string | null;

  // --- App-Specific Content ---
  title: string;
  description: string;
};
