import { useEffect, useState, useMemo } from "react";
import { useUpdate } from "../../hooks";
import styled, { css } from "styled-components";
import { useIsMobile } from "../../hooks";
import * as s from "../../schemas";
import MashupController from "../mashup";
import TrackController from "../track";
import { data } from "../../../sampleData";
import * as Tone from "tone";
import { Switch } from "../controls/switches";
import { Spectrogram, ScrollingImages, Oscilloscope } from "../backgrounds";
import { PiWaveform, PiWaveSine } from "react-icons/pi";

const Body = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const NavBar = styled.div`
  width: 100%;
  height: 55px;
  background-color: transparent;
  display: flex;
  align-items: center;
  justify-content: right;
  padding: 10px;
  z-index: 5;
  position: relative;
  box-sizing: border-box;
  margin: 0px;
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
  const [mashups, setMashups] = useState<s.Mashup[]>(data);
  const [analyserType, setAnalyserType] = useState<Tone.AnalyserType>("waveform");
  const [mashupIndex, setMashupIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();

  const fetchMashups = async () => {
    try {
      // await fetch(`${import.meta.env.VITE_BACKEND_URL}/refresh-assets`)
      // const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/retrieve-assets`);
      // const data = await response.json();
      // const _mashups = s.MashupSchema.array().parse(data);
      // setMashups(_mashups);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  useEffect(() => {
    fetchMashups();
  }, []);

  const analyser = useMemo(() => new Tone.Analyser("waveform", 256), []);
  const mashupTitles = useMemo(() => mashups.map((mashup) => mashup.mashedTrack.title), [mashups]);

  useUpdate(() => {
    analyser.type = analyserType;
  }, [analyserType]);

  return isLoading ? (
    <>Loading...</>
  ) : (
    <>
      <ScrollingImages
        leftUrl={mashups[mashupIndex].track1.coverUrl}
        rightUrl={mashups[mashupIndex].track2.coverUrl}
      />
      {analyserType === "fft" ? (
        <Spectrogram analyser={analyser} />
      ) : (
        <Oscilloscope analyser={analyser} />
      )}
      <Body>
        <NavBar>
          <Switch
            description="visualize waveform"
            enabledDescription="visualize frequencies"
            icon={PiWaveform}
            enabledIcon={PiWaveSine}
            onClick={(isEnabled) => setAnalyserType(!isEnabled ? "waveform" : "fft")}
          />
        </NavBar>
        <Container $isMobile={isMobile}>
          <TrackController track={mashups[mashupIndex].track1} analyser={analyser} />
          <MashupController
            mashupTitles={mashupTitles}
            mashup={mashups[mashupIndex].mashedTrack}
            mashupIndex={mashupIndex}
            setMashupIndex={setMashupIndex}
          />
          <TrackController track={mashups[mashupIndex].track2} analyser={analyser} />
        </Container>
      </Body>
    </>
  );
}

export default App;
