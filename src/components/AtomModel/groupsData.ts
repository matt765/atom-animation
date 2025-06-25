export type GroupData = {
  name: string;
  class: string;
  title: string;
  description: string[];
};

export const groupsData: GroupData[] = [
  {
    name: "Alkali Metal",
    class: "alkali-metal",
    title: "Alkali Metals (Group 1)",
    description: [
      "Alkali metals are highly reactive, soft, silvery metals with one valence electron. They are located in Group 1 of the periodic table (excluding Hydrogen).",
      "Due to their high reactivity, they are never found in their elemental form in nature, always in compounds. They react vigorously with water and halogens.",
    ],
  },
  {
    name: "Alkaline Earth Metal",
    class: "alkaline-earth-metal",
    title: "Alkaline Earth Metals (Group 2)",
    description: [
      "Alkaline earth metals are reactive, silvery-white metals with two valence electrons. They are less reactive than alkali metals and are found in Group 2.",
      "These elements are harder and denser than alkali metals. Their compounds are known for their basic (alkaline) nature, which contributes to their name.",
    ],
  },
  {
    name: "Transition Metal",
    class: "transition-metal",
    title: "Transition Metals (Groups 3-12)",
    description: [
      "Transition metals are a large block of elements known for being hard, shiny, and having high melting points. They often form colored compounds.",
      "Their ability to have multiple oxidation states makes them excellent catalysts in many industrial and biological processes. They are also great conductors of heat and electricity.",
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
    name: "Other Metals",
    class: "other-metal",
    title: "Other Metals",
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
    name: "Non-metal",
    class: "nonmetal",
    title: "Non-metals",
    description: [
      "Non-metals are a diverse group of elements that includes Hydrogen, Carbon, Nitrogen, and Oxygen. They are fundamental to life and organic chemistry.",
      "They can exist as gases or solids at room temperature, are poor conductors of heat and electricity, and typically form acidic oxides.",
    ],
  },
  {
    name: "Halogen",
    class: "halogen",
    title: "Halogens (Group 17)",
    description: [
      "Halogens are a group of highly reactive nonmetals in Group 17. They readily form salts by gaining an electron, which is why their name means 'salt-former'.",
      "They are the only periodic table group to contain elements in all three states of matter at standard temperature and pressure: solid (Iodine), liquid (Bromine), and gas (Fluorine, Chlorine).",
    ],
  },
  {
    name: "Noble Gas",
    class: "noble-gas",
    title: "Noble Gases (Group 18)",
    description: [
      "Noble gases are known for their chemical inertness due to a full valence electron shell. They are odorless, colorless, monatomic gases used in lighting and welding.",
      "Because of their low reactivity, they were once thought to be completely inert, but some compounds of xenon, krypton, and radon have since been synthesized.",
    ],
  },
];
