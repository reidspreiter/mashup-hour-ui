import { Column } from "../containers";
import * as s from "../../schemas";
import { useMemo } from "react";
import { useUpdate } from "../../hooks";
import { Player } from "../../audio";
import TrackPlayer from "./TrackPlayer";
import { Title } from "../regions";
import * as Tone from "tone";

interface Props {
  track: s.Track;
  analyser: Tone.Analyser;
}

const TrackController: React.FC<Props> = ({ track, analyser }) => {
  const player = useMemo(() => new Player(track.title, track.preview, analyser), []);

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
