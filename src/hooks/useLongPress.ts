import { useCallback, useRef, useEffect } from "react";

/**
 * A reusable hook to handle continuous action on a long press.
 * It abstracts the complex logic of timers and event handlers
 * (`onMouseDown`, `onMouseUp`, etc.), providing a clean way to
 * implement 'press-and-hold' functionality and avoid code duplication.
 *
 * @param callback The function to be called repeatedly.
 * @param speed The interval (in ms) at which the callback fires during the hold.
 * @param delay The delay (in ms) after the initial press before continuous firing begins.
 */

export const useLongPress = (
  callback: () => void,
  speed: number = 100,
  delay: number = 400
) => {
  const callbackRef = useRef(callback);
  // Use ReturnType for correct typing in browser environments (where timers return a number).
  // Initialize refs with `null` to prevent initial value errors.
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Keep the callback ref up to date to avoid the "stale closure" problem.
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const stop = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(
    (event: React.MouseEvent | React.TouchEvent) => {
      // Prevent default browser actions (e.g., text selection).
      event.preventDefault();
      // Fire once immediately for instant feedback.
      callbackRef.current();

      timeoutRef.current = setTimeout(() => {
        intervalRef.current = setInterval(() => {
          callbackRef.current();
        }, speed);
      }, delay);
    },
    [delay, speed]
  );

  // Return an object of props to be spread onto the target element.
  return {
    onMouseDown: start,
    onMouseUp: stop,
    onMouseLeave: stop,
    onTouchStart: start,
    onTouchEnd: stop,
  };
};
