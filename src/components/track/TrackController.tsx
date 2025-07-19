import { Column } from "../containers";
import * as s from "../../schemas";
import { useState, useEffect } from "react";
import { useUpdate } from "../../hooks";
import { Player } from "../../audio";
import TrackPlayer from "./TrackPlayer";
import { Title } from "../regions";
import * as Tone from "tone";
import type { TrackID } from "./common";

interface Props {
  track: s.Track;
  gainProxy: Tone.Gain;
  trackID: TrackID;
}

const TrackController: React.FC<Props> = ({ track, gainProxy, trackID }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [player, setPlayer] = useState<Player | null>(null);

  const initPlayer = async () => {
    const newPlayer = await Player.init(trackID, track.preview, gainProxy);
    setPlayer(newPlayer);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  const loadTrack = async () => {
    await player?.loadTrack(track.preview);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };
  // const player = useMemo(async () => await Player.init(trackID, track.preview, gainProxy), []);

  useEffect(() => {
    setLoading(true);
    initPlayer();
  }, []);

  useUpdate(() => {
    setLoading(true);
    loadTrack();
  }, [track]);

  return (
    player && (
      <Column>
        <Title
          title={track.title}
          fullTitle={track.fullTitle}
          artist={track.artist}
          albumTitle={track.albumTitle}
          coverUrl={track.coverUrl}
        />
        <TrackPlayer loading={loading} player={player} title={track.title} trackID={trackID} />
      </Column>
    )
  );
};

export default TrackController;
