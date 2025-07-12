import type { AnalyserType } from "tone";
import { NUM_INITIAL_MASHUPS } from "../constants";
import { create } from "zustand";
import { generateUrlSnippet, applyUrlSnippet } from "./common";
import type { SetterMethods, IndexDependentSettings, UrlAble } from "./common";

export const VISUALIZER_TYPES = ["none", "spectrum analyzer", "oscilloscope", "ripple"] as const;
export type VisualizerType = (typeof VISUALIZER_TYPES)[number];

export const VISUALIZER_COLOR_SOURCES = ["solid", "spectrum", "album"] as const;
export type VisualizerColorSource = (typeof VISUALIZER_COLOR_SOURCES)[number];

export const VISUALIZER_DYNAMIC_COLORS = ["full", "warm", "cool", "grayscale"] as const;
export type VisualizerDynamicColor = (typeof VISUALIZER_DYNAMIC_COLORS)[number];

export const ANALYZER_RESOLUTIONS = [16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192] as const;
export type AnalyzerResolution = (typeof ANALYZER_RESOLUTIONS)[number];

export interface VisualizerSettings {
  visualizerType: VisualizerType;
  visualizerColorSource: VisualizerColorSource;
  visualizerSolidColor: string;
  visualizerDynamicColor: VisualizerDynamicColor;
  visualizerLineThickness: number;
  smoothVisualizer: boolean;
  analyzerType: AnalyserType;
  analyzerResolution: AnalyzerResolution;
  frequencyGateX: number;
  frequencyGateY: number;
  frequencyGateTolerance: number;
  frequencyGateInverted: boolean;
  frequencyGateSustained: boolean;
  viewGateVisual: boolean;
  visualizerSpeed: number;
}

export const VISUALIZER_DEFAULTS: VisualizerSettings = {
  visualizerType: "spectrum analyzer",
  visualizerColorSource: "solid",
  visualizerSolidColor: "#f16eb0",
  visualizerDynamicColor: "full",
  visualizerLineThickness: 1,
  smoothVisualizer: true,
  analyzerType: "fft",
  analyzerResolution: 2048,
  frequencyGateX: 400,
  frequencyGateY: -30,
  frequencyGateTolerance: 367,
  frequencyGateInverted: false,
  frequencyGateSustained: true,
  viewGateVisual: false,
  visualizerSpeed: 6,
};

const includedKeys = Object.keys(VISUALIZER_DEFAULTS) as (keyof VisualizerSettings)[];

const stringConverters = {
  visualizerType: {
    "spectrum analyzer": "s",
    none: "n",
    oscilloscope: "o",
    ripple: "r",
  },
  visualizerColorSource: {
    solid: "s",
    spectrum: "p",
    album: "a",
  },
  visualizerDynamicColor: {
    full: "f",
    warm: "w",
    cool: "c",
    grayscale: "g",
  },
  analyzerType: {
    fft: "f",
    waveform: "w",
  },
};

export const VISUALIZER_SETTINGS_SNIPPET_ID = "V";

interface VisualizerSettingsStore
  extends VisualizerSettings,
    IndexDependentSettings,
    SetterMethods<VisualizerSettings>,
    UrlAble {}

const items = Array.from({ length: NUM_INITIAL_MASHUPS }, () => ({ ...VISUALIZER_DEFAULTS }));
let selectedIndex = 0;

export const useVisualizerSettingsStore = create<VisualizerSettingsStore>((set, get) => ({
  visualizerType: VISUALIZER_DEFAULTS.visualizerType,
  setVisualizerType: (value) => set({ visualizerType: value }),
  visualizerColorSource: VISUALIZER_DEFAULTS.visualizerColorSource,
  setVisualizerColorSource: (value) => set({ visualizerColorSource: value }),
  visualizerSolidColor: VISUALIZER_DEFAULTS.visualizerSolidColor,
  setVisualizerSolidColor: (value) => set({ visualizerSolidColor: value }),
  visualizerDynamicColor: VISUALIZER_DEFAULTS.visualizerDynamicColor,
  setVisualizerDynamicColor: (value) => set({ visualizerDynamicColor: value }),
  visualizerLineThickness: VISUALIZER_DEFAULTS.visualizerLineThickness,
  setVisualizerLineThickness: (value) => set({ visualizerLineThickness: value }),
  smoothVisualizer: VISUALIZER_DEFAULTS.smoothVisualizer,
  setSmoothVisualizer: (value) => set({ smoothVisualizer: value }),
  analyzerType: VISUALIZER_DEFAULTS.analyzerType,
  setAnalyzerType: (value) => set({ analyzerType: value }),
  analyzerResolution: VISUALIZER_DEFAULTS.analyzerResolution,
  setAnalyzerResolution: (value) => set({ analyzerResolution: value }),
  frequencyGateX: VISUALIZER_DEFAULTS.frequencyGateX,
  setFrequencyGateX: (value) => set({ frequencyGateX: value }),
  frequencyGateY: VISUALIZER_DEFAULTS.frequencyGateY,
  setFrequencyGateY: (value) => set({ frequencyGateY: value }),
  frequencyGateTolerance: VISUALIZER_DEFAULTS.frequencyGateTolerance,
  setFrequencyGateTolerance: (value) => set({ frequencyGateTolerance: value }),
  frequencyGateInverted: VISUALIZER_DEFAULTS.frequencyGateInverted,
  setFrequencyGateInverted: (value) => set({ frequencyGateInverted: value }),
  frequencyGateSustained: VISUALIZER_DEFAULTS.frequencyGateSustained,
  setFrequencyGateSustained: (value) => set({ frequencyGateSustained: value }),
  viewGateVisual: VISUALIZER_DEFAULTS.viewGateVisual,
  setViewGateVisual: (value) => set({ viewGateVisual: value }),
  visualizerSpeed: VISUALIZER_DEFAULTS.visualizerSpeed,
  setVisualizerSpeed: (value) => set({ visualizerSpeed: value }),
  saveAndLoadIndex: (newIndex) => {
    const state = get();
    items[selectedIndex] = {
      visualizerType: state.visualizerType,
      visualizerColorSource: state.visualizerColorSource,
      visualizerSolidColor: state.visualizerSolidColor,
      visualizerDynamicColor: state.visualizerDynamicColor,
      visualizerLineThickness: state.visualizerLineThickness,
      smoothVisualizer: state.smoothVisualizer,
      analyzerType: state.analyzerType,
      analyzerResolution: state.analyzerResolution,
      frequencyGateX: state.frequencyGateX,
      frequencyGateY: state.frequencyGateY,
      frequencyGateTolerance: state.frequencyGateTolerance,
      frequencyGateInverted: state.frequencyGateInverted,
      frequencyGateSustained: state.frequencyGateSustained,
      viewGateVisual: state.viewGateVisual,
      visualizerSpeed: state.visualizerSpeed,
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
    return generateUrlSnippet(item, VISUALIZER_SETTINGS_SNIPPET_ID, includedKeys, stringConverters);
  },
  setFromUrlSnippet: (urlSnippet) => {
    const item = items[selectedIndex];
    const newItem = applyUrlSnippet(
      urlSnippet,
      item,
      VISUALIZER_SETTINGS_SNIPPET_ID,
      includedKeys,
      stringConverters
    );
    console.log(newItem);
    items[selectedIndex] = newItem;
    set({ ...newItem });
  },
}));
