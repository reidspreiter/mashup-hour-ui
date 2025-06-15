import { Column } from "../containers";
import * as s from "../../schemas";
import { useMemo } from "react";
import { useUpdate } from "../../hooks";
import { Player } from "../../audio";
import TrackPlayer from "./TrackPlayer";
import { Title } from "../regions";

interface Props {
  track: s.Track;
}

const TrackController: React.FC<Props> = ({ track }) => {
  const player = useMemo(() => new Player(track.title, track.preview), []);

  useUpdate(() => {
    player.loadTrack(track.title, track.preview);
  }, [track]);

  return (
    <Column>
      <Title
        title={track.title}
        fullTitle={track.fullTitle}
        artist={track.artist}
        albumTitle={track.albumTitle}
        coverUrl={track.coverUrl}
      />
      <TrackPlayer player={player} title={track.title} />
    </Column>
  );
};

export default TrackController;
