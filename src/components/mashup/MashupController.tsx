import { Column } from "../containers";
import { Title } from "../regions";
import * as s from "../../schemas";
import MashupSelector from "./MashupSelector";

interface Props {
  mashup: s.MashedTrack;
  numMashups: number;
  mashupIndex: number;
  setMashupIndex: React.Dispatch<React.SetStateAction<number>>;
}

const MashupController: React.FC<Props> = ({
  mashup,
  numMashups,
  mashupIndex,
  setMashupIndex,
}: Props) => {
  return (
    <Column>
      <Title
        title={mashup.title}
        fullTitle=""
        artist={mashup.artist}
        albumTitle={mashup.albumTitle}
        coverUrl=""
      />
      <MashupSelector
        numMashups={numMashups}
        mashupIndex={mashupIndex}
        setMashupIndex={setMashupIndex}
      />
    </Column>
  );
};

export default MashupController;
