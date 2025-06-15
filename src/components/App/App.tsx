import { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import { useIsMobile } from "../../hooks";
import * as s from "../../schemas";
import MashupController from "../mashup";
import TrackController from "../track";
import { data } from "../../../sampleData";

const MASHUP_LIMIT = 3;

const Container = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: stretch;
  height: 100vh;

  ${(props) =>
    props.$isMobile &&
    css`
      flex-direction: column;
    `}
`;

function App() {
  const [mashups, setMashups] = useState<s.Mashup[]>(data);
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

  return isLoading ? (
    <>Loading...</>
  ) : (
    <>
      <Container $isMobile={isMobile}>
        <TrackController track={mashups[mashupIndex].track1} />
        <MashupController
          mashup={mashups[mashupIndex].mashedTrack}
          numMashups={mashups.length}
          mashupIndex={mashupIndex}
          setMashupIndex={setMashupIndex}
        />
        <TrackController track={mashups[mashupIndex].track2} />
      </Container>
    </>
  );
}

export default App;
