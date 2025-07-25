import { useEffect, RefObject } from "react";

type Event = MouseEvent | TouchEvent;

export const useClickOutside = <T extends HTMLElement = HTMLElement>(
  ref: RefObject<T | null>,
  handler: (event: Event) => void,
  ignoredRefs: RefObject<HTMLElement | null>[] = []
) => {
  useEffect(() => {
    const listener = (event: Event) => {
      const targetElement = event.target as Node;

      // Ignore clicks on the periodic table to allow selecting other elements without closing the modal.
      if (
        (targetElement as HTMLElement).closest('[data-is-periodic-grid="true"]')
      ) {
        return;
      }

      // Ignore clicks within the modal itself, as they are not "outside" clicks.
      const mainEl = ref?.current;
      if (!mainEl || mainEl.contains(targetElement)) {
        return;
      }

      // Ignore clicks on other designated elements (e.g., menus) to prevent them from closing the modal.
      for (const ignoredRef of ignoredRefs) {
        const ignoredEl = ignoredRef.current;
        if (ignoredEl && ignoredEl.contains(targetElement)) {
          return;
        }
      }

      // Jeśli żaden z powyższych warunków nie jest spełniony, wywołaj handler
      handler(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler, ignoredRefs]);
};
