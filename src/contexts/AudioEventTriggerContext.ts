import { createContext } from "react";
import type { Dispatch, SetStateAction } from "react";

interface AudioEventTriggerContextType {
  applyLowPass: boolean;
  setApplyLowPass: Dispatch<SetStateAction<boolean>>;
  applyMute: boolean;
  setApplyMute: Dispatch<SetStateAction<boolean>>;
};

const AudioEventTriggerContext = createContext<AudioEventTriggerContextType>({
  applyLowPass: false,
  setApplyLowPass: () => {},
  applyMute: false,
  setApplyMute: () => {},
});

export default AudioEventTriggerContext;
