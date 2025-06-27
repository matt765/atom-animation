import { elements } from "./elementsData";
import type { ElementConfig } from "./elementsData";

export type GroupData = {
  name: string;
  class: string;
  title: string;
  description: string[];
};

export type FullGroupData = GroupData & {
  elements: { name: string; symbol: string }[];
};

const getElementsByGroup = (groupNumber: number) => {
  return elements
    .filter((el) => el.group === groupNumber)
    .map((el) => ({ name: el.name, symbol: el.symbol }));
};

const getElementsByPeriod = (periodNumber: number) => {
  return elements
    .filter((el) => el.period === periodNumber)
    .map((el) => ({ name: el.name, symbol: el.symbol }));
};

const getElementCategoryClass = (element: ElementConfig): string => {
  const { protons, group } = element;
  if (protons >= 57 && protons <= 71) return "lanthanide";
  if (protons >= 89 && protons <= 103) return "actinide";
  if (group >= 3 && group <= 12) return "transition-metal";
  if (group === 1 && protons !== 1) return "alkali-metal";
  if (group === 2) return "alkaline-earth-metal";
  if (
    [
      "Boron",
      "Silicon",
      "Germanium",
      "Arsenic",
      "Antimony",
      "Tellurium",
      "Astatine",
    ].includes(element.name)
  )
    return "metalloid";
  if (
    [
      "Aluminum",
      "Gallium",
      "Indium",
      "Tin",
      "Thallium",
      "Lead",
      "Bismuth",
      "Nihonium",
      "Flerovium",
      "Moscovium",
      "Livermorium",
    ].includes(element.name)
  )
    return "other-metal";
  if (group === 17) return "halogen";
  if (group === 18) return "noble-gas";
  if (
    [
      "Hydrogen",
      "Carbon",
      "Nitrogen",
      "Oxygen",
      "Phosphorus",
      "Sulfur",
      "Selenium",
    ].includes(element.name)
  )
    return "nonmetal";
  return "unknown";
};

const getElementsByCategory = (categoryClass: string) => {
  return elements
    .filter((el) => getElementCategoryClass(el) === categoryClass)
    .map((el) => ({ name: el.name, symbol: el.symbol }));
};

const legendGroups: GroupData[] = [
  {
    name: "Alkali Metal",
    class: "alkali-metal",
    title: "Alkali Metals",
    description: [
      "Alkali metals are highly reactive, soft, silvery metals with one valence electron. They are located in Group 1 of the periodic table (excluding Hydrogen).",
      "Due to their high reactivity, they are never found in their elemental form in nature, always in compounds. They react vigorously with water and halogens.",
    ],
  },
  {
    name: "Alkaline Earth Metal",
    class: "alkaline-earth-metal",
    title: "Alkaline Earth Metals",
    description: [
      "Alkaline earth metals are reactive, silvery-white metals with two valence electrons. They are less reactive than alkali metals and are found in Group 2.",
      "These elements are harder and denser than alkali metals. Their compounds are known for their basic (alkaline) nature, which contributes to their name.",
    ],
  },
  {
    name: "Lanthanide",
    class: "lanthanide",
    title: "Lanthanides",
    description: [
      "The lanthanides are a series of 15 metallic elements, also known as rare-earth elements. They are chemically similar and have many uses in magnets and phosphors.",
      "These elements are typically soft, silvery-white metals that tarnish when exposed to air. Their magnetic and optical properties make them valuable in modern technology.",
    ],
  },
  {
    name: "Actinide",
    class: "actinide",
    title: "Actinides",
    description: [
      "The actinides are a series of 15 radioactive metallic elements. The most well-known are uranium and plutonium, used in nuclear reactors and weapons.",
      "All actinides are radioactive and release energy upon decay. Elements beyond uranium are generally synthetic, created in laboratories.",
    ],
  },
  {
    name: "Transition Metal",
    class: "transition-metal",
    title: "Transition Metals",
    description: [
      "Transition metals are a large block of elements known for being hard, shiny, and having high melting points. They often form colored compounds.",
      "Their ability to have multiple oxidation states makes them excellent catalysts in many industrial and biological processes. They are also great conductors of heat and electricity.",
    ],
  },
  {
    name: "Other Metals",
    class: "other-metal",
    title: "Post-transition Metals",
    description: [
      "These metals are located to the right of the transition metals. They are typically softer and have lower melting points. This group includes elements like Aluminum, Tin, and Lead.",
      "Unlike transition metals, they are considered post-transition metals. They are solid, opaque, and generally display more covalent bonding characteristics.",
    ],
  },
  {
    name: "Metalloid",
    class: "metalloid",
    title: "Metalloids",
    description: [
      "Metalloids have properties intermediate between metals and nonmetals. They are typically semiconductors, making them crucial in the electronics industry.",
      "Found along the 'stair-step' line of the periodic table, they are often brittle and can have a metallic luster, but are chemically more like non-metals.",
    ],
  },
  {
    name: "Other Nonmetals",
    class: "nonmetal",
    title: "Other Nonmetals",
    description: [
      "This diverse group of elements includes some of the most fundamental building blocks of life, like Hydrogen, Carbon, Nitrogen, and Oxygen.",
      "They can exist as gases or solids at room temperature, are poor conductors of heat and electricity, and typically form acidic oxides.",
    ],
  },
  {
    name: "Halogen",
    class: "halogen",
    title: "Halogens",
    description: [
      "Halogens are a group of highly reactive nonmetals in Group 17. They readily form salts by gaining an electron, which is why their name means 'salt-former'.",
      "They are the only periodic table group to contain elements in all three states of matter at standard temperature and pressure: solid (Iodine), liquid (Bromine), and gas (Fluorine, Chlorine).",
    ],
  },
  {
    name: "Noble Gas",
    class: "noble-gas",
    title: "Noble Gases",
    description: [
      "Noble gases are known for their chemical inertness due to a full valence electron shell. They are odorless, colorless, monatomic gases used in lighting and welding.",
      "Because of their low reactivity, they were once thought to be completely inert, but some compounds of xenon, krypton, and radon have since been synthesized.",
    ],
  },
];

const periodAndGroupDetails: Omit<FullGroupData, "elements">[] = [
  // Periods
  {
    name: "Period 1",
    class: "period-1",
    title: "Period 1: The First Shell",
    description: [
      "Period 1 is the shortest period, containing only two elements: Hydrogen (H) and Helium (He). The defining characteristic of these elements is that their valence electrons occupy the first electron shell (n=1), which can hold a maximum of two electrons.",
      "Hydrogen's unique position allows it to exhibit properties of both a metal and a nonmetal, while Helium is the first and lightest noble gas, marking the completion of the first electron shell.",
    ],
  },
  {
    name: "Period 2",
    class: "period-2",
    title: "Period 2: Building Blocks of Life",
    description: [
      "Elements in Period 2 have their valence electrons in the second electron shell (n=2). This period is fundamental to organic chemistry and life, containing key elements like Carbon (C), Nitrogen (N), and Oxygen (O).",
      "Moving across the period from Lithium (Li) to Neon (Ne), we see a clear transition from reactive metals, through the foundational nonmetals, to a stable noble gas. Atomic radius decreases across the period as the increasing nuclear charge pulls the electron shells closer.",
    ],
  },
  {
    name: "Period 3",
    class: "period-3",
    title: "Period 3: Silicon and Beyond",
    description: [
      "Period 3 elements fill the third electron shell (n=3). This period mirrors the trends of Period 2 and includes Sodium (Na) and Magnesium (Mg), essential electrolytes, as well as Silicon (Si), the cornerstone of modern electronics.",
      "The period continues with Phosphorus (P) and Sulfur (S), vital for biological processes, and ends with the reactive halogen Chlorine (Cl) and the inert noble gas Argon (Ar). These elements play significant roles in industry, agriculture, and technology.",
    ],
  },
  {
    name: "Period 4",
    class: "period-4",
    title: "Period 4: The First Transition Metals",
    description: [
      "Period 4 is the first period to include the d-block, introducing the transition metals from Scandium (Sc) to Zinc (Zn). These elements have valence electrons in the fourth shell (n=4) and begin filling the 3d orbital.",
      "The transition metals in this period, such as Iron (Fe), Copper (Cu), and Titanium (Ti), are known for their structural strength, conductivity, and catalytic abilities, forming the backbone of modern industry. The period encompasses a wide range of properties, from the highly reactive Potassium (K) to the inert Krypton (Kr).",
    ],
  },
  {
    name: "Period 5",
    class: "period-5",
    title: "Period 5: Heavier Metals and Technetium",
    description: [
      "Elements of Period 5 continue the trends of Period 4, filling the fifth electron shell (n=5) and the 4d orbital. This period contains heavier and often more valuable transition metals like Silver (Ag), Palladium (Pd), and Rhodium (Rh), which are crucial as catalysts and precious metals.",
      "A notable element is Technetium (Tc), the lightest element with no stable isotopes. This period also includes essential elements for electronics like Tin (Sn) and Indium (In), used in solder and touchscreens, respectively.",
    ],
  },
  {
    name: "Period 6",
    class: "period-6",
    title: "Period 6: Lanthanides and Heavy Metals",
    description: [
      "Period 6 is significantly longer, as it is the first to include the f-block elements—the Lanthanides. Elements in this period fill the sixth electron shell (n=6) and involve the 4f and 5d orbitals. It starts with Cesium (Cs), the most reactive stable metal.",
      "This period contains some of the densest and most durable metals like Tungsten (W), Platinum (Pt), and Gold (Au). The lanthanide series, often shown separately, consists of elements with unique magnetic and optical properties vital for modern electronics and green technologies.",
    ],
  },
  {
    name: "Period 7",
    class: "period-7",
    title: "Period 7: The Radioactive Frontier",
    description: [
      "All elements in Period 7 are radioactive. This period includes the Actinide series, which are all radioactive f-block elements. It begins with Francium (Fr), the most unstable naturally occurring element, and includes the famous nuclear fuels Uranium (U) and Plutonium (Pu).",
      "Elements beyond uranium are known as transuranic elements and are synthesized artificially in laboratories. These superheavy elements, from Rutherfordium (Rf) to Oganesson (Og), push the boundaries of nuclear physics and our understanding of matter, existing for only fractions of a second.",
    ],
  },
  // Groups
  {
    name: "Group 1",
    class: "group-1",
    title: "Group 1: The Alkali Metals",
    description: [
      "Group 1 elements (excluding Hydrogen) are known as the Alkali Metals. They are defined by having a single valence electron in their outermost s-orbital, which they readily donate to form a +1 ion. This makes them the most reactive group of metals.",
      "They are soft, silvery metals with low densities and melting points. Due to their extreme reactivity with air and water, they are stored under oil. Their compounds are common in daily life, such as sodium chloride (table salt) and potassium in fertilizers.",
    ],
  },
  {
    name: "Group 2",
    class: "group-2",
    title: "Group 2: The Alkaline Earth Metals",
    description: [
      "The Alkaline Earth Metals comprise Group 2. These elements possess two valence electrons, which they tend to lose to form +2 ions. They are reactive, but less so than the alkali metals.",
      "They are harder, denser, and have higher melting points than their Group 1 counterparts. Calcium (Ca) is a vital component of bones and teeth, while Magnesium (Mg) is essential for producing lightweight alloys and for biological functions.",
    ],
  },
  {
    name: "Group 3",
    class: "group-3",
    title: "Group 3: The Scandium Group",
    description: [
      "Group 3 is the first group of transition metals. It includes Scandium (Sc) and Yttrium (Y). Lanthanum (La) and Actinium (Ac), the first elements of their respective f-block series, are often included here due to similar properties.",
      "These elements are silvery-white metals that are moderately reactive. Their primary use is in creating high-performance alloys. For instance, scandium-aluminum alloys are used in the aerospace industry and for high-end sports equipment.",
    ],
  },
  {
    name: "Group 4",
    class: "group-4",
    title: "Group 4: The Titanium Group",
    description: [
      "Group 4 contains Titanium (Ti), Zirconium (Zr), Hafnium (Hf), and Rutherfordium (Rf). These are hard, high-melting point transition metals known for their exceptional corrosion resistance.",
      "Titanium is famous for its high strength-to-weight ratio, making it crucial for aerospace and medical implants. Zirconium is used in nuclear reactors because it doesn't easily absorb neutrons, and its synthetic form, cubic zirconia, is a popular diamond simulant.",
    ],
  },
  {
    name: "Group 5",
    class: "group-5",
    title: "Group 5: The Vanadium Group",
    description: [
      "Group 5 includes Vanadium (V), Niobium (Nb), Tantalum (Ta), and the synthetic Dubnium (Db). These are dense, hard metals with very high melting points.",
      "Vanadium is a critical additive for strengthening steel. Niobium and Tantalum are used in high-temperature superalloys and superconducting magnets (for MRI machines). Tantalum's excellent biocompatibility and use in compact capacitors make it vital for electronics and medical devices.",
    ],
  },
  {
    name: "Group 6",
    class: "group-6",
    title: "Group 6: The Chromium Group",
    description: [
      "Group 6 consists of Chromium (Cr), Molybdenum (Mo), Tungsten (W), and Seaborgium (Sg). This group is notable for containing Tungsten, the metal with the highest melting point.",
      "Chromium is used for creating stainless steel and for shiny chrome plating. Molybdenum and Tungsten are key components in steel alloys that must withstand extreme temperatures and pressures, such as in cutting tools and engine parts.",
    ],
  },
  {
    name: "Group 7",
    class: "group-7",
    title: "Group 7: The Manganese Group",
    description: [
      "Group 7 is home to Manganese (Mn), Technetium (Tc), Rhenium (Re), and Bohrium (Bh). These metals are hard and have multiple oxidation states.",
      "Manganese is an essential alloying agent in the production of steel, improving its strength and durability. Rhenium is an extremely rare metal added to superalloys for jet engine turbine blades. Technetium is notable for being the lightest element with no stable isotopes, and its use as a medical tracer.",
    ],
  },
  {
    name: "Group 8",
    class: "group-8",
    title: "Group 8: The Iron Group",
    description: [
      "Group 8 contains Iron (Fe), Ruthenium (Ru), Osmium (Os), and Hassium (Hs). This group marks the start of the later, less reactive transition metals.",
      "Iron is the cornerstone of modern civilization, forming the basis of steel. Ruthenium and Osmium are rare, hard, and corrosion-resistant metals belonging to the platinum group. Osmium is the densest naturally occurring element and is used to create extremely durable alloys.",
    ],
  },
  {
    name: "Group 9",
    class: "group-9",
    title: "Group 9: The Cobalt Group",
    description: [
      "Group 9 includes Cobalt (Co), Rhodium (Rh), Iridium (Ir), and Meitnerium (Mt). These are hard, silvery-white transition metals.",
      "Cobalt is used in high-strength alloys, magnets, and as a critical component in lithium-ion batteries. Rhodium and Iridium are extremely rare and valuable precious metals. Rhodium is the primary catalyst in automotive catalytic converters, while Iridium is the most corrosion-resistant metal known.",
    ],
  },
  {
    name: "Group 10",
    class: "group-10",
    title: "Group 10: The Nickel Group",
    description: [
      "Group 10 contains Nickel (Ni), Palladium (Pd), Platinum (Pt), and Darmstadtium (Ds). This group is known for its excellent catalytic properties and resistance to corrosion.",
      "Nickel is a key component of stainless steel and rechargeable batteries. Palladium and Platinum are precious metals vital for catalytic converters in cars. Platinum is also highly prized in jewelry and used for laboratory equipment due to its inertness.",
    ],
  },
  {
    name: "Group 11",
    class: "group-11",
    title: "Group 11: The Coinage Metals",
    description: [
      "Group 11, known as the Coinage Metals, includes Copper (Cu), Silver (Ag), and Gold (Au), along with the synthetic Roentgenium (Rg). These were among the first metals discovered by humankind.",
      "They are excellent conductors of electricity and heat, are highly malleable, and are resistant to corrosion. While traditionally used for currency and jewelry, Copper is now essential for electrical wiring, and Gold is a critical component in high-end electronics.",
    ],
  },
  {
    name: "Group 12",
    class: "group-12",
    title: "Group 12: The Volatile Metals",
    description: [
      "Group 12 contains Zinc (Zn), Cadmium (Cd), Mercury (Hg), and Copernicium (Cn). These metals are more volatile than other transition metals, with lower melting and boiling points.",
      "Zinc is primarily used to galvanize steel to protect it from rust. Cadmium was used in batteries but is being phased out due to toxicity. Mercury is the only metal that is liquid at room temperature. Copernicium is a synthetic element that may be even more volatile.",
    ],
  },
  {
    name: "Group 13",
    class: "group-13",
    title: "Group 13: The Boron Group",
    description: [
      "Group 13 elements have three valence electrons. This group marks a transition, containing the metalloid Boron (B) at the top, followed by the post-transition metals Aluminum (Al), Gallium (Ga), Indium (In), and Thallium (Tl).",
      "Boron is used in fiberglass and borosilicate glass. Aluminum is a lightweight, strong, and corrosion-resistant metal with countless uses. Gallium and Indium are critical for modern semiconductors, LEDs, and touchscreens.",
    ],
  },
  {
    name: "Group 14",
    class: "group-14",
    title: "Group 14: The Carbon Group",
    description: [
      "Group 14 elements, with four valence electrons, show a remarkable range of properties. The group includes the nonmetal Carbon (C), the metalloids Silicon (Si) and Germanium (Ge), and the metals Tin (Sn) and Lead (Pb).",
      "Carbon is the basis of all organic life. Silicon is the foundation of the digital age, used to make computer chips. Tin and Lead are soft metals used in solder and, historically, in many applications now restricted due to toxicity.",
    ],
  },
  {
    name: "Group 15",
    class: "group-15",
    title: "Group 15: The Pnictogens",
    description: [
      "Group 15 elements, or Pnictogens, have five valence electrons. This group includes the nonmetals Nitrogen (N) and Phosphorus (P), the metalloids Arsenic (As) and Antimony (Sb), and the metal Bismuth (Bi).",
      "Nitrogen and Phosphorus are essential to life and are key components of fertilizers. Arsenic, though toxic, is used in semiconductors. Antimony is used as a flame retardant, and Bismuth is a non-toxic heavy metal used in medicines and lead-free solder.",
    ],
  },
  {
    name: "Group 16",
    class: "group-16",
    title: "Group 16: The Chalcogens",
    description: [
      "Group 16 elements, the Chalcogens, have six valence electrons. The group is primarily composed of nonmetals: Oxygen (O), Sulfur (S), and Selenium (Se), followed by the metalloid Tellurium (Te) and the radioactive metal Polonium (Po).",
      "Oxygen is essential for respiration and combustion. Sulfur is a key industrial chemical used to make sulfuric acid. Selenium and Tellurium have important applications in electronics and photovoltaics due to their semiconductor properties.",
    ],
  },
  {
    name: "Group 17",
    class: "group-17",
    title: "Group 17: The Halogens",
    description: [
      "The Halogens in Group 17 are highly reactive nonmetals with seven valence electrons. They are just one electron short of a full outer shell, making them eager to react and form salts ('halogen' means 'salt-former').",
      "This group includes Fluorine (F), the most reactive of all elements, Chlorine (Cl), used for disinfection, Bromine (Br), a liquid at room temperature, and Iodine (I), an essential nutrient. They are diatomic in their elemental form and are powerful oxidizing agents.",
    ],
  },
  {
    name: "Group 18",
    class: "group-18",
    title: "Group 18: The Noble Gases",
    description: [
      "Group 18 is comprised of the Noble Gases, which have a full outer shell of valence electrons. This stable configuration makes them chemically inert and reluctant to form compounds.",
      "They are all colorless, odorless, monatomic gases at standard conditions. They are used in applications that require an inert atmosphere, such as in welding (Argon), lighting (Neon, Krypton, Xenon), and cryogenics (Helium).",
    ],
  },
];

export const allGroupsAndPeriodsData: FullGroupData[] = [
  ...legendGroups.map((group) => ({
    ...group,
    elements: getElementsByCategory(group.class),
  })),
  ...periodAndGroupDetails.map((item) => {
    const identifier = item.class.split("-");
    const type = identifier[0];
    const num = parseInt(identifier[1], 10);
    return {
      ...item,
      elements:
        type === "period" ? getElementsByPeriod(num) : getElementsByGroup(num),
    };
  }),
];

export const legendData: FullGroupData[] = legendGroups.map((group) => ({
  ...group,
  elements: getElementsByCategory(group.class),
}));
