import { createContext } from "react";

export interface Preferences {
  disableTooltips: boolean;
}

export const defaultPreferences: Preferences = {
  disableTooltips: false,
};

interface PreferencesContextType {
  preferences: Preferences;
  setPreferences: React.Dispatch<React.SetStateAction<Preferences>>;
}

const PreferencesContext = createContext<PreferencesContextType>({
  preferences: defaultPreferences,
  setPreferences: () => {},
});

export default PreferencesContext;
