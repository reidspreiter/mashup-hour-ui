import { BackgroundDiv } from "./containers";
import ImageGradient from "./ImageGradient";
import ColorGradient from "./ColorGradient";
import * as Tone from "tone";
import SpectrumAnalyzer from "./SpectrumAnalyzer";
import Oscilloscope from "./Oscilloscope";
import Ripple from "./Ripple";

export const VISUALIZER_TYPES = ["none", "spectrum analyzer", "oscilloscope", "ripple"] as const;
export type VisualizerType = (typeof VISUALIZER_TYPES)[number];

export const VISUALIZER_COLOR_SOURCES = ["solid", "spectrum", "album"] as const;
export type VisualizerColorSource = (typeof VISUALIZER_COLOR_SOURCES)[number];

export const VISUALIZER_DYNAMIC_COLORS = ["full", "warm", "cool", "grayscale"] as const;
export type VisualizerDynamicColor = (typeof VISUALIZER_DYNAMIC_COLORS)[number];

export const ANALYZER_RESOLUTIONS = [16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192] as const;
export type AnalyzerResolution = (typeof ANALYZER_RESOLUTIONS)[number];

export const VISUALIZER_DEFAULTS = {
  visualizerType: "spectrum analyzer" as VisualizerType,
  visualizerColorSource: "solid" as VisualizerColorSource,
  visualizerSolidColor: "#f16eb0",
  visualizerDynamicColor: "full" as VisualizerDynamicColor,
  visualizerLineThickness: 1,
  smoothVisualizer: true,
  analyzerType: "fft" as Tone.AnalyserType,
  analyzerResolution: 2048 as AnalyzerResolution,
  frequencyGateX: 400,
  frequencyGateY: -30,
  frequencyGateTolerance: 367,
  frequencyGateInverted: false,
  frequencyGateSustained: true,
  viewGateVisual: false,
  visualizerSpeed: 6,
  hideMashupControls: false,
};

interface Props {
  analyzer: Tone.Analyser;
  leftImageUrl: string;
  rightImageUrl: string;
  visualizerType: VisualizerType;
  visualizerColorSource: VisualizerColorSource;
  visualizerSolidColor: string;
  visualizerDynamicColor: VisualizerDynamicColor;
  visualizerLineThickness: number;
  frequencyGateX: number;
  frequencyGateY: number;
  frequencyGateTolerance: number;
  frequencyGateInverted: boolean;
  frequencyGateSustained: boolean;
  viewGateVisual: boolean;
  smoothVisualizer: boolean;
  visualizerSpeed: number;
}

export const Background: React.FC<Props> = ({
  analyzer,
  leftImageUrl,
  rightImageUrl,
  visualizerType,
  visualizerColorSource,
  visualizerSolidColor,
  visualizerDynamicColor,
  visualizerLineThickness,
  frequencyGateX,
  frequencyGateY,
  frequencyGateTolerance,
  frequencyGateInverted,
  frequencyGateSustained,
  viewGateVisual,
  smoothVisualizer,
  visualizerSpeed,
}) => {
  const getVisualizer = () => {
    switch (visualizerType) {
      case "spectrum analyzer":
        return (
          <SpectrumAnalyzer
            colorSource={visualizerColorSource}
            solidColor={visualizerSolidColor}
            lineThickness={visualizerLineThickness}
            analyzer={analyzer}
            smoothVisualizer={smoothVisualizer}
          />
        );
      case "oscilloscope":
        return (
          <Oscilloscope
            colorSource={visualizerColorSource}
            solidColor={visualizerSolidColor}
            lineThickness={visualizerLineThickness}
            analyzer={analyzer}
          />
        );
      case "ripple":
        return (
          <Ripple
            colorSource={visualizerColorSource}
            solidColor={visualizerSolidColor}
            lineThickness={visualizerLineThickness}
            analyzer={analyzer}
            frequencyGateX={frequencyGateX}
            frequencyGateY={frequencyGateY}
            frequencyGateInverted={frequencyGateInverted}
            frequencyGateTolerance={frequencyGateTolerance}
            frequencyGateSustained={frequencyGateSustained}
            viewGateVisual={viewGateVisual}
            smoothVisualizer={smoothVisualizer}
            visualizerSpeed={visualizerSpeed}
          />
        );
      default:
        return undefined;
    }
  };

  return (
    <>
      {visualizerColorSource === "album" && visualizerType !== "none" ? (
        <ImageGradient leftUrl={leftImageUrl} rightUrl={rightImageUrl} />
      ) : visualizerColorSource === "spectrum" && visualizerType !== "none" ? (
        <ColorGradient
          visualizerDynamicColor={visualizerDynamicColor}
          visualizerType={visualizerType}
        />
      ) : (
        <BackgroundDiv style={{ backgroundColor: "black" }} />
      )}
      {getVisualizer()}
    </>
  );
};

export default Background;
