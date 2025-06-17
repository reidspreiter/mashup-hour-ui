import { CenteredRegion } from "../containers";
import { IconButton } from "../controls/buttons";
import { Carousel } from "../controls/buttons";
import { CountdownTimer } from "../text";
import { IoIosSkipBackward, IoIosSkipForward } from "react-icons/io";

interface Props {
  mashupTitles: string[];
  mashupIndex: number;
  setMashupIndex: React.Dispatch<React.SetStateAction<number>>;
}

const MashupSelector: React.FC<Props> = ({ mashupTitles, mashupIndex, setMashupIndex }: Props) => {
  const numMashups = mashupTitles.length;

  return (
    <CenteredRegion style={{ height: "40px" }}>
      <IconButton
        description={"previous tracks"}
        icon={IoIosSkipBackward}
        onClick={() => setMashupIndex((numMashups + mashupIndex - 1) % numMashups)}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "4px",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "8px",
        }}
      >
        <Carousel
          setCarouselIndex={setMashupIndex}
          carouselIndex={mashupIndex}
          descriptions={mashupTitles}
        />
        <CountdownTimer
          targetHoursInFuture={mashupIndex + 1}
          description="time until mashup disappears"
        />
      </div>
      <IconButton
        description={"next tracks"}
        icon={IoIosSkipForward}
        onClick={() => setMashupIndex((mashupIndex + 1) % numMashups)}
      />
    </CenteredRegion>
  );
};

export default MashupSelector;
