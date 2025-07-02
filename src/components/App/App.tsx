import { useEffect, useState, useMemo } from "react";
import { useUpdate } from "../../hooks";
import styled, { css } from "styled-components";
import { useIsMobile } from "../../hooks";
import * as s from "../../schemas";
import MashupController from "../mashup";
import TrackController from "../track";
import { data } from "../../../sampleData";
import * as Tone from "tone";
import { PreferencesContext, defaultPreferences } from "../../contexts";
import { NavBar } from "../navbar";
import { Background } from "../background";
import {
  type VisualizerType,
  type VisualizerColorSource,
  type VisualizerDynamicColor,
  type AnalyzerResolution,
  VISUALIZER_DEFAULTS,
} from "../background";

const Body = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const Container = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: stretch;
  height: 100vh;
  background-color: transparent;

  ${(props) =>
    props.$isMobile &&
    css`
      flex-direction: column;
    `}
`;

function App() {
  const [mashups, setMashups] = useState<s.Mashup[]>([]);
  const [mashupIndex, setMashupIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [preferences, setPreferences] = useState(defaultPreferences);
  const isMobile = useIsMobile();

  // visualizer
  const [visualizerType, setVisualizerType] = useState<VisualizerType>(
    VISUALIZER_DEFAULTS.visualizerType
  );
  const [visualizerColorSource, setVisualizerColorSource] = useState<VisualizerColorSource>(
    VISUALIZER_DEFAULTS.visualizerColorSource
  );
  const [visualizerSolidColor, setVisualizerSolidColor] = useState(
    VISUALIZER_DEFAULTS.visualizerSolidColor
  );
  const [visualizerDynamicColor, setVisualizerDynamicColor] = useState<VisualizerDynamicColor>(
    VISUALIZER_DEFAULTS.visualizerDynamicColor
  );
  const [visualizerLineThickness, setVisualizerLineThickness] = useState(
    VISUALIZER_DEFAULTS.visualizerLineThickness
  );
  const [smoothVisualizer, setSmoothVisualizer] = useState(VISUALIZER_DEFAULTS.smoothVisualizer);
  const [analyzerType, setAnalyzerType] = useState<Tone.AnalyserType>(
    VISUALIZER_DEFAULTS.analyzerType
  );
  const [analyzerResolution, setAnalyzerResolution] = useState<AnalyzerResolution>(
    VISUALIZER_DEFAULTS.analyzerResolution
  );
  const [frequencyGateX, setFrequencyGateX] = useState(VISUALIZER_DEFAULTS.frequencyGateX);
  const [frequencyGateY, setFrequencyGateY] = useState(VISUALIZER_DEFAULTS.frequencyGateY);
  const [frequencyGateTolerance, setFrequencyGateTolerance] = useState(
    VISUALIZER_DEFAULTS.frequencyGateTolerance
  );
  const [frequencyGateInverted, setFrequencyGateInverted] = useState(
    VISUALIZER_DEFAULTS.frequencyGateInverted
  );
  const [frequencyGateSustained, setFrequencyGateSustained] = useState(
    VISUALIZER_DEFAULTS.frequencyGateSustained
  );
  const [viewGateVisual, setViewGateVisual] = useState(VISUALIZER_DEFAULTS.viewGateVisual);
  const [visualizerSpeed, setVisualizerSpeed] = useState(VISUALIZER_DEFAULTS.visualizerSpeed);
  const [hideMashupControls, setHideMashupControls] = useState(
    VISUALIZER_DEFAULTS.hideMashupControls
  );

  const fetchMashups = async () => {
    try {
      // await fetch(`${import.meta.env.VITE_BACKEND_URL}/refresh-assets`)
      // const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/retrieve-assets`);
      // const data = await response.json();
      // const _mashups = s.MashupSchema.array().parse(data);
      setMashups(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  useEffect(() => {
    fetchMashups();
  }, []);

  const analyzer = useMemo(() => new Tone.Analyser("fft", analyzerResolution), []);
  const mashupTitles = useMemo(() => mashups.map((mashup) => mashup.mashedTrack.title), [mashups]);

  useUpdate(() => {
    analyzer.type = analyzerType;
  }, [analyzerType]);

  useUpdate(() => {
    analyzer.size = analyzerResolution;
  }, [analyzerResolution]);

  return isLoading ? (
    <>Loading...</>
  ) : (
    <PreferencesContext.Provider value={{ preferences, setPreferences }}>
      <Background
        analyzer={analyzer}
        leftImageUrl={mashups[mashupIndex].track1.coverUrl}
        rightImageUrl={mashups[mashupIndex].track2.coverUrl}
        visualizerType={visualizerType}
        visualizerColorSource={visualizerColorSource}
        visualizerSolidColor={visualizerSolidColor}
        visualizerDynamicColor={visualizerDynamicColor}
        visualizerLineThickness={visualizerLineThickness}
        frequencyGateX={frequencyGateX}
        frequencyGateY={frequencyGateY}
        frequencyGateTolerance={frequencyGateTolerance}
        frequencyGateInverted={frequencyGateInverted}
        frequencyGateSustained={frequencyGateSustained}
        viewGateVisual={viewGateVisual}
        smoothVisualizer={smoothVisualizer}
        visualizerSpeed={visualizerSpeed}
      />
      <Body>
        <NavBar
          visualizerType={visualizerType}
          setVisualizerType={setVisualizerType}
          visualizerColorSource={visualizerColorSource}
          setVisualizerColorSource={setVisualizerColorSource}
          visualizerSolidColor={visualizerSolidColor}
          setVisualizerSolidColor={setVisualizerSolidColor}
          visualizerDynamicColor={visualizerDynamicColor}
          setVisualizerDynamicColor={setVisualizerDynamicColor}
          visualizerLineThickness={visualizerLineThickness}
          setVisualizerLineThickness={setVisualizerLineThickness}
          analyzerType={analyzerType}
          setAnalyzerType={setAnalyzerType}
          analyzerResolution={analyzerResolution}
          setAnalyzerResolution={setAnalyzerResolution}
          frequencyGateX={frequencyGateX}
          setFrequencyGateX={setFrequencyGateX}
          frequencyGateY={frequencyGateY}
          setFrequencyGateY={setFrequencyGateY}
          frequencyGateTolerance={frequencyGateTolerance}
          setFrequencyGateTolerance={setFrequencyGateTolerance}
          frequencyGateInverted={frequencyGateInverted}
          setFrequencyGateInverted={setFrequencyGateInverted}
          frequencyGateSustained={frequencyGateSustained}
          setFrequencyGateSustained={setFrequencyGateSustained}
          viewGateVisual={viewGateVisual}
          setViewGateVisual={setViewGateVisual}
          smoothVisualizer={smoothVisualizer}
          setSmoothVisualizer={setSmoothVisualizer}
          visualizerSpeed={visualizerSpeed}
          setVisualizerSpeed={setVisualizerSpeed}
          setHideMashupControls={setHideMashupControls}
        />
        <Container $isMobile={isMobile} style={{visibility: hideMashupControls ? "hidden" : "visible"}}>
          <TrackController track={mashups[mashupIndex].track1} analyser={analyzer} />
          <MashupController
            mashupTitles={mashupTitles}
            mashup={mashups[mashupIndex].mashedTrack}
            mashupIndex={mashupIndex}
            setMashupIndex={setMashupIndex}
          />
          <TrackController track={mashups[mashupIndex].track2} analyser={analyzer} />
        </Container>
      </Body>
    </PreferencesContext.Provider>
  );
}

export default App;
