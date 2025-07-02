import { useRef, useCallback, useEffect } from "react";

export const useThrotteCallback = (callback: (...args: any[]) => void, delay: number) => {
  const lastCallTime = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastArgs = useRef<any[] | null>(null);

  const throttled = useCallback(
    (...args: any[]) => {
      const now = Date.now();
      const remainingTime = delay - (now - lastCallTime.current);

      lastArgs.current = args;

      if (remainingTime <= 0) {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        lastCallTime.current = now;
        callback(...args);
      } else if (!timeoutRef.current) {
        timeoutRef.current = setTimeout(() => {
          lastCallTime.current = Date.now();
          timeoutRef.current = null;
          if (lastArgs.current) {
            callback(...lastArgs.current);
          }
        }, remainingTime);
      }
    },
    [callback, delay]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return throttled;
};
