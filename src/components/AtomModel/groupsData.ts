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
      "Alkali metals are highly reactive, soft, silvery metals. They have one valence electron, which they readily lose to form a +1 ion. They are found in Group 1 of the periodic table (excluding hydrogen). Their reactivity increases down the group.",
  },
  {
    name: "Alkaline Earth Metal",
    class: "alkaline-earth-metal",
    title: "Alkaline Earth Metals (Group 2)",
    description:
      "Alkaline earth metals are reactive, silvery-white metals, but less reactive than the alkali metals. They have two valence electrons and form +2 ions. They are found in Group 2 of the periodic table. They are harder and denser than alkali metals.",
  },
  {
    name: "Transition Metal",
    class: "transition-metal",
    title: "Transition Metals (Groups 3-12)",
    description:
      "Transition metals are a large group of elements that are typically hard, shiny, and have high melting and boiling points. They can form colored compounds and have variable oxidation states due to the involvement of d-electrons in bonding. They are excellent conductors of heat and electricity.",
  },
  {
    name: "Post-transition Metal",
    class: "post-transition-metal",
    title: "Post-transition Metals",
    description:
      "Post-transition metals are located to the right of the transition metals. They are softer and have lower melting points than the transition metals. They include elements like aluminum, tin, and lead. They tend to be more covalent in their bonding than the transition metals.",
  },
  {
    name: "Metalloid",
    class: "metalloid",
    title: "Metalloids",
    description:
      "Metalloids have properties intermediate between metals and nonmetals. They are found along the zigzag line separating metals and nonmetals on the periodic table. They are typically semiconductors, which makes them crucial in the electronics industry. Examples include silicon and germanium.",
  },
  {
    name: "Reactive Nonmetal",
    class: "reactive-nonmetal",
    title: "Reactive Nonmetals",
    description:
      "Reactive nonmetals are a diverse group of elements that readily gain electrons to form negative ions. This group includes the halogens, as well as elements like oxygen, sulfur, and carbon. They exist in various states at room temperature (gases, solids) and are poor conductors of heat and electricity.",
  },
  {
    name: "Noble Gas",
    class: "noble-gas",
    title: "Noble Gases (Group 18)",
    description:
      "Noble gases are located in Group 18 of the periodic table. They are known for their chemical inertness because they have a full valence electron shell. They are odorless, colorless, monatomic gases under standard conditions. They are used in lighting and welding.",
  },
  {
    name: "Lanthanide",
    class: "lanthanide",
    title: "Lanthanides",
    description:
      "The lanthanides are a series of 15 metallic elements with atomic numbers 57 through 71. They are also known as rare-earth elements. They are chemically similar to each other and are often found together in nature. They have many uses in magnets, phosphors, and catalysts.",
  },
  {
    name: "Actinide",
    class: "actinide",
    title: "Actinides",
    description:
      "The actinides are a series of 15 radioactive metallic elements with atomic numbers 89 through 103. They are all radioactive and many are synthetic. The most well-known actinides are uranium and plutonium, which are used as fuel in nuclear reactors and in nuclear weapons.",
  },
  {
    name: "Unknown",
    class: "unknown",
    title: "Unknown Properties",
    description:
      "Elements with unknown chemical properties are typically superheavy, synthetic elements that have only been created in laboratories one atom at a time. Their extreme instability and short half-lives make it incredibly difficult to study their chemical and physical characteristics.",
  },
];
