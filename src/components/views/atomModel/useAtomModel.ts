import { useState } from "react";

import { elements } from "@/elementsData/elementsData";

export const useAtomModel = () => {
  const [sliderValue, setSliderValue] = useState(50);
  const [selectedName, setSelectedElement] = useState("Oxygen");

  const element = elements.find((el) => el.name === selectedName)!;

  return {
    elements,
    element,
    sliderValue,
    setSliderValue,
    setSelectedElement,
  };
};
