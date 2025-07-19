import type { IndexDependentSettings, SetterMethods, UrlAble } from "./common";
import { generateUrlSnippet, applyUrlSnippet } from "./common";
import { NUM_INITIAL_MASHUPS } from "../constants";
import { create } from "zustand";

export interface PlayerSettings {
  restartOnPause: boolean;
  mute: boolean;
  reverse: boolean;
  rate: number;
  volume: number;
  lockPlaybackPitch: boolean;
  stepBySemitone: boolean;
  pitch: number;
  reverseRelativeToStart: boolean;
  startBoundPercent: number;
  endBoundPercent: number;
}

export const PLAYER_DEFAULTS: PlayerSettings = {
  restartOnPause: false,
  mute: false,
  reverse: false,
  rate: 1,
  volume: 0,
  lockPlaybackPitch: true,
  stepBySemitone: false,
  pitch: 0,
  reverseRelativeToStart: false,
  startBoundPercent: 0,
  endBoundPercent: 1,
};

const includedKeys = Object.keys(PLAYER_DEFAULTS) as (keyof PlayerSettings)[];

export const PLAYER_SETTINGS_A_SNIPPET_ID = "PA";
export const PLAYER_SETTINGS_B_SNIPPET_ID = "PB";

interface PlayerSettingsStore
  extends PlayerSettings,
    UrlAble,
    IndexDependentSettings,
    SetterMethods<PlayerSettings> {}

const createPlayerSettingsStore = (snippetID: string) => {
  const items = Array.from({ length: NUM_INITIAL_MASHUPS }, () => ({ ...PLAYER_DEFAULTS }));
  let selectedIndex = 0;

  return create<PlayerSettingsStore>((set, get) => ({
    restartOnPause: PLAYER_DEFAULTS.restartOnPause,
    setRestartOnPause: (value) => set({ restartOnPause: value }),
    mute: PLAYER_DEFAULTS.mute,
    setMute: (value) => set({ mute: value }),
    reverse: PLAYER_DEFAULTS.reverse,
    setReverse: (value) => set({ reverse: value }),
    rate: PLAYER_DEFAULTS.rate,
    setRate: (value) => set({ rate: value }),
    volume: PLAYER_DEFAULTS.volume,
    setVolume: (value) => set({ volume: value }),
    lockPlaybackPitch: PLAYER_DEFAULTS.lockPlaybackPitch,
    setLockPlaybackPitch: (value) => set({ lockPlaybackPitch: value }),
    stepBySemitone: PLAYER_DEFAULTS.stepBySemitone,
    setStepBySemitone: (value) => set({ stepBySemitone: value }),
    pitch: PLAYER_DEFAULTS.pitch,
    setPitch: (value) => set({ pitch: value }),
    reverseRelativeToStart: PLAYER_DEFAULTS.reverseRelativeToStart,
    setReverseRelativeToStart: (value) => set({ reverseRelativeToStart: value }),
    startBoundPercent: PLAYER_DEFAULTS.startBoundPercent,
    setStartBoundPercent: (value) => set({ startBoundPercent: value }),
    endBoundPercent: PLAYER_DEFAULTS.endBoundPercent,
    setEndBoundPercent: (value) => set({ endBoundPercent: value }),
    saveAndLoadIndex: (newIndex) => {
      const state = get();
      items[selectedIndex] = {
        restartOnPause: state.restartOnPause,
        mute: state.mute,
        reverse: state.reverse,
        rate: state.rate,
        volume: state.volume,
        lockPlaybackPitch: state.lockPlaybackPitch,
        stepBySemitone: state.stepBySemitone,
        pitch: state.pitch,
        reverseRelativeToStart: state.reverseRelativeToStart,
        startBoundPercent: state.startBoundPercent,
        endBoundPercent: state.endBoundPercent,
      };

      if (newIndex + 1 > items.length || newIndex === selectedIndex) {
        return;
      }

      const newItem = items[newIndex];
      selectedIndex = newIndex;

      set({ ...newItem });
    },
    getUrlSnippet: () => {
      const { saveAndLoadIndex } = get();
      saveAndLoadIndex(selectedIndex);
      const item = items[selectedIndex];
      return generateUrlSnippet(item, snippetID, includedKeys);
    },
    setFromUrlSnippet: (urlSnippet) => {
      const item = items[selectedIndex];
      const newItem = applyUrlSnippet(urlSnippet, item, snippetID, includedKeys);
      items[selectedIndex] = newItem;
      set({ ...newItem });
    },
  }));
};

export const usePlayerSettingsStoreA = createPlayerSettingsStore(PLAYER_SETTINGS_A_SNIPPET_ID);
export const usePlayerSettingsStoreB = createPlayerSettingsStore(PLAYER_SETTINGS_B_SNIPPET_ID);
