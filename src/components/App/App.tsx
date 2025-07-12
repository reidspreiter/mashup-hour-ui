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
import { useVisualizerSettingsStore } from "../../stores/visualizer";
import { useShallow } from "zustand/shallow";

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

  const {saveAndLoadIndex: setVisualizerSettingsIndex, analyzerResolution, analyzerType} = useVisualizerSettingsStore(useShallow((state) => ({analyzerType: state.analyzerType, analyzerResolution: state.analyzerResolution, saveAndLoadIndex: state.saveAndLoadIndex})));

  const [hideMashupControls, setHideMashupControls] = useState(false);

  const analyzer = useMemo(() => new Tone.Analyser("fft", analyzerResolution), []);
  const mashupTitles = useMemo(() => mashups.map((mashup) => mashup.mashedTrack.title), [mashups]);

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

  useEffect(() => {
    setVisualizerSettingsIndex(mashupIndex);
  }, [mashupIndex]);

  

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
      />
      <Body>
        <NavBar
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
