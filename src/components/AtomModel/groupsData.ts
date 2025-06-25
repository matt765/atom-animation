export type GroupData = {
  name: string;
  class: string;
  title: string;
  description: string;
};

export const groupsData: GroupData[] = [
  {
    name: "Alkali Metal",
    class: "alkali-metal",
    title: "Alkali Metals (Group 1)",
    description:
      "Alkali metals are highly reactive, soft, silvery metals with one valence electron. They are located in Group 1 of the periodic table (excluding Hydrogen).",
  },
  {
    name: "Alkaline Earth Metal",
    class: "alkaline-earth-metal",
    title: "Alkaline Earth Metals (Group 2)",
    description:
      "Alkaline earth metals are reactive, silvery-white metals with two valence electrons. They are less reactive than alkali metals and are found in Group 2.",
  },
  {
    name: "Transition Metal",
    class: "transition-metal",
    title: "Transition Metals (Groups 3-12)",
    description:
      "Transition metals are a large block of elements known for being hard, shiny, and having high melting points. They often form colored compounds.",
  },
  {
    name: "Lanthanide",
    class: "lanthanide",
    title: "Lanthanides",
    description:
      "The lanthanides are a series of 15 metallic elements, also known as rare-earth elements. They are chemically similar and have many uses in magnets and phosphors.",
  },
  {
    name: "Actinide",
    class: "actinide",
    title: "Actinides",
    description:
      "The actinides are a series of 15 radioactive metallic elements. The most well-known are uranium and plutonium, used in nuclear reactors and weapons.",
  },
  {
    name: "Other Metals",
    class: "other-metal",
    title: "Other Metals",
    description:
      "These metals are located to the right of the transition metals. They are typically softer and have lower melting points. This group includes elements like Aluminum, Tin, and Lead.",
  },
  {
    name: "Metalloid",
    class: "metalloid",
    title: "Metalloids",
    description:
      "Metalloids have properties intermediate between metals and nonmetals. They are typically semiconductors, making them crucial in the electronics industry.",
  },
  {
    name: "Non-metal",
    class: "nonmetal",
    title: "Non-metals",
    description:
      "Non-metals are a diverse group of elements that includes Hydrogen, Carbon, Nitrogen, Oxygen, and others. They are fundamental to life and organic chemistry.",
  },
  {
    name: "Halogen",
    class: "halogen",
    title: "Halogens (Group 17)",
    description:
      "Halogens are a group of highly reactive nonmetals in Group 17. They readily form salts by gaining an electron. This group includes Fluorine and Chlorine.",
  },
  {
    name: "Noble Gas",
    class: "noble-gas",
    title: "Noble Gases (Group 18)",
    description:
      "Noble gases are known for their chemical inertness due to a full valence electron shell. They are odorless, colorless, monatomic gases used in lighting and welding.",
  },
];
