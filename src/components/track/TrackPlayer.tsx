import { Player } from "../../audio";
import { PlayButton } from "../controls/buttons";
import { Casing } from "../containers";
import * as s from "../../schemas";
import { CenteredRegion } from "../containers";

interface Props {
  player: Player;
  title: string;
}

const TrackPlayer: React.FC<Props> = ({ player, title }: Props) => {
  return (
    <CenteredRegion>
      <Casing>
        <PlayButton player={player} title={title} onClick={player.togglePlayer} />
      </Casing>
    </CenteredRegion>
  );
};

export default TrackPlayer;
