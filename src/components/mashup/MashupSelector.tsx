import { CenteredRegion } from "../containers";
import { IconButton } from "../controls/buttons";
import { IoIosSkipBackward, IoIosSkipForward } from "react-icons/io";

interface Props {
  numMashups: number;
  mashupIndex: number;
  setMashupIndex: React.Dispatch<React.SetStateAction<number>>;
}

const MashupSelector: React.FC<Props> = ({ numMashups, mashupIndex, setMashupIndex }: Props) => {
  return (
    <CenteredRegion style={{ height: "40px" }}>
      <IconButton
        description={"previous tracks"}
        icon={IoIosSkipBackward}
        onClick={() => setMashupIndex((numMashups + mashupIndex - 1) % numMashups)}
      />
      <IconButton
        description={"next tracks"}
        icon={IoIosSkipForward}
        onClick={() => setMashupIndex((mashupIndex + 1) % numMashups)}
      />
    </CenteredRegion>
  );
};

export default MashupSelector;
