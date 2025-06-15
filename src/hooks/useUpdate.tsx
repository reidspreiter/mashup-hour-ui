import { useRef, useEffect } from "react";

export const useUpdate = (effect: React.EffectCallback, deps: React.DependencyList) => {
  const isFirst = useRef(true);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    return effect();
  }, deps);
};
