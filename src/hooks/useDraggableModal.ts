import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

export const useDraggableModal = (id: string) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id,
    });

  const style = {
    transform: transform ? CSS.Translate.toString(transform) : undefined,
  };

  return {
    setNodeRef,
    listeners,
    attributes,
    style,
    isDragging, 
  };
};
