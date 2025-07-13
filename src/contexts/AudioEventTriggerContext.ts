import { createContext } from "react";
import type { Dispatch, SetStateAction } from "react";

interface AudioEventTriggerContextType {
  applyLowPass: boolean;
  setApplyLowPass: Dispatch<SetStateAction<boolean>>;
}

const AudioEventTriggerContext = createContext<AudioEventTriggerContextType>({
  applyLowPass: false,
  setApplyLowPass: () => {},
});

export default AudioEventTriggerContext;
