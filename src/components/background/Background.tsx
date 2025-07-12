import { BackgroundDiv } from "./containers";
import ImageGradient from "./ImageGradient";
import ColorGradient from "./ColorGradient";
import * as Tone from "tone";
import SpectrumAnalyzer from "./SpectrumAnalyzer";
import Oscilloscope from "./Oscilloscope";
import Ripple from "./Ripple";
import { useVisualizerSettingsStore } from "../../stores/visualizer";
import { useShallow } from "zustand/shallow";

interface Props {
  analyzer: Tone.Analyser;
  leftImageUrl: string;
  rightImageUrl: string;
}

export const Background: React.FC<Props> = ({ analyzer, leftImageUrl, rightImageUrl }) => {
  const {
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
  } = useVisualizerSettingsStore(
    useShallow((state) => ({
      visualizerType: state.visualizerType,
      visualizerColorSource: state.visualizerColorSource,
      visualizerSolidColor: state.visualizerSolidColor,
      visualizerDynamicColor: state.visualizerDynamicColor,
      visualizerLineThickness: state.visualizerLineThickness,
      frequencyGateX: state.frequencyGateX,
      frequencyGateY: state.frequencyGateY,
      frequencyGateTolerance: state.frequencyGateTolerance,
      frequencyGateInverted: state.frequencyGateInverted,
      frequencyGateSustained: state.frequencyGateSustained,
      viewGateVisual: state.viewGateVisual,
      smoothVisualizer: state.smoothVisualizer,
      visualizerSpeed: state.visualizerSpeed,
    }))
  );

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
