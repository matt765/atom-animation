import { useEffect, RefObject, useRef } from "react";

type Event = MouseEvent | TouchEvent;

export const useClickOutside = <T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: (event: Event) => void,
  ignoredRefs: RefObject<HTMLElement | null>[] = []
) => {
  const clickStartPos = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const handleMouseDown = (event: Event) => {
      if ("button" in event && event.button !== 0) {
        return; // Ignoruj wszystko oprócz lewego przycisku myszy
      }

      const targetElement = event.target as Node;
      const mainEl = ref?.current;

      // Sprawdź, czy kliknięto wewnątrz głównego elementu
      if (!mainEl || mainEl.contains(targetElement)) {
        return;
      }

      // Sprawdź, czy kliknięto wewnątrz któregokolwiek z ignorowanych elementów
      for (const ignoredRef of ignoredRefs) {
        const ignoredEl = ignoredRef.current;
        if (ignoredEl && ignoredEl.contains(targetElement)) {
          return;
        }
      }

      const point = "touches" in event ? event.touches[0] : event;
      clickStartPos.current = { x: point.clientX, y: point.clientY };
    };

    const handleMouseUp = (event: Event) => {
      if (!clickStartPos.current) {
        return;
      }

      const point = "changedTouches" in event ? event.changedTouches[0] : event;
      const dist = Math.hypot(
        point.clientX - clickStartPos.current.x,
        point.clientY - clickStartPos.current.y
      );

      if (dist < 10) {
        // Tylko jeśli to było kliknięcie, a nie przeciągnięcie
        handler(event);
      }

      clickStartPos.current = null;
    };

    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("touchstart", handleMouseDown);
    document.addEventListener("touchend", handleMouseUp);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchstart", handleMouseDown);
      document.removeEventListener("touchend", handleMouseUp);
    };
  }, [ref, handler, ignoredRefs]);
};
