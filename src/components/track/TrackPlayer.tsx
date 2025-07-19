import { Player } from "../../audio";
import * as Tone from "tone";
import { IconButton } from "../input";
import { Casing } from "../containers";
import { VerticalRegion } from "../containers";
import { Knob, Switch, HoldSwitch } from "../input";
import {
  PiArrowLeft,
  PiArrowCounterClockwise,
  PiCaretLineLeft,
  PiSpeakerSimpleHigh,
  PiSpeakerSimpleSlash,
  PiSpeakerSimpleX,
  PiLockSimple,
  PiLockSimpleOpen,
  PiSteps,
  PiMapPin,
} from "react-icons/pi";
import { IoPauseCircleSharp, IoPlayCircleSharp } from "react-icons/io5";
import type { TrackID } from "./common";
import type { RangeMode } from "../input";
import { usePlayerSettingsStoreA, usePlayerSettingsStoreB } from "../../stores";
import { useMemo, useState, useEffect } from "react";
import { useShallow } from "zustand/shallow";
import PlayBar from "./PlayBar";
import { BarLoader } from "../loader";

interface Props {
  loading: boolean;
  player: Player;
  title: string;
  trackID: TrackID;
}

const TrackPlayer: React.FC<Props> = ({ loading, player, title, trackID }: Props) => {
  const usePlayerSettingsStore = useMemo(
    () => (trackID === "A" ? usePlayerSettingsStoreA : usePlayerSettingsStoreB),
    [trackID]
  );
  const {
    reverse,
    setReverse,
    mute,
    setMute,
    restartOnPause,
    setRestartOnPause,
    rate,
    setRate,
    volume,
    setVolume,
    lockPlaybackPitch,
    setLockPlaybackPitch,
    stepBySemitone,
    setStepBySemitone,
    pitch,
    setPitch,
    reverseRelativeToStart,
    setReverseRelativeToStart,
    startBoundPercent,
    setStartBoundPercent,
    endBoundPercent,
    setEndBoundPercent,
  } = usePlayerSettingsStore(
    useShallow((state) => ({
      reverse: state.reverse,
      setReverse: state.setReverse,
      mute: state.mute,
      setMute: state.setMute,
      restartOnPause: state.restartOnPause,
      setRestartOnPause: state.setRestartOnPause,
      rate: state.rate,
      setRate: state.setRate,
      volume: state.volume,
      setVolume: state.setVolume,
      lockPlaybackPitch: state.lockPlaybackPitch,
      setLockPlaybackPitch: state.setLockPlaybackPitch,
      stepBySemitone: state.stepBySemitone,
      setStepBySemitone: state.setStepBySemitone,
      pitch: state.pitch,
      setPitch: state.setPitch,
      reverseRelativeToStart: state.reverseRelativeToStart,
      setReverseRelativeToStart: state.setReverseRelativeToStart,
      startBoundPercent: state.startBoundPercent,
      setStartBoundPercent: state.setStartBoundPercent,
      endBoundPercent: state.endBoundPercent,
      setEndBoundPercent: state.setEndBoundPercent,
    }))
  );
  const [muteOnHold, setMuteOnHold] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    setIsPlaying(false);
    player.onStop = () => setIsPlaying(false);
  }, [player, title]);

  useEffect(() => {
    player.setReverse(reverse);
  }, [player, reverse, loading]);

  useEffect(() => {
    player.setMute(muteOnHold || mute);
  }, [player, mute, muteOnHold, loading]);

  useEffect(() => {
    player.restartOnPause = restartOnPause;
  }, [player, restartOnPause, loading]);

  useEffect(() => {
    player.setPlaybackRate(rate);
  }, [player, rate, loading]);

  useEffect(() => {
    player.setVolume(volume);
  }, [player, volume, loading]);

  useEffect(() => {
    player.setLockPlaybackPitch(lockPlaybackPitch);
  }, [player, lockPlaybackPitch, loading]);

  useEffect(() => {
    player.setPitch(pitch);
  }, [player, pitch, loading]);

  useEffect(() => {
    player.reverseRelativeToStart = reverseRelativeToStart;
  }, [player, reverseRelativeToStart, loading]);

  useEffect(() => {
    player.setLoopBounds(startBoundPercent, endBoundPercent);
  }, [player, startBoundPercent, endBoundPercent, loading]);

  const playbackRateKnobConfig = useMemo<RangeMode>(
    () => ({
      type: "range",
      step: 0.01,
      min: 0.01,
      max: 3,
      default: { value: 1, min: 0.01, max: 10 },
      customPercentToValue: (percent, min, max) => {
        if (percent < 0.5) {
          const localPercent = percent / 0.5;
          return min + (1 - min) * localPercent;
        }
        const localPercent = (percent - 0.5) / 0.5;
        return 1 + (max - 1) * localPercent;
      },
      customValueToPercent: (value, min, max) => {
        if (value < 1) {
          const localPercent = (value - min) / (1 - min);
          return localPercent * 0.5;
        }
        const localPercent = (value - 1) / (max - 1);
        return 0.5 + localPercent * 0.5;
      },
    }),
    []
  );

  const volumeKnobConfig = useMemo<RangeMode>(() => {
    const exponent = 4;
    return {
      type: "range",
      step: 0.01,
      min: -100,
      max: 12,
      default: { value: 0, min: -100, max: 12 },
      customPercentToValue: (percent, min, max) =>
        min + (max - min) * Math.pow(percent, 1 / exponent),
      customValueToPercent: (value, min, max) => Math.pow((value - min) / (max - min), exponent),
    };
  }, []);

  const pitchKnobConfig = useMemo<RangeMode>(
    () => ({
      type: "range",
      step: stepBySemitone ? 1 : 0.01,
      min: -24,
      max: 24,
      default: { value: 0, min: -24, max: 24 },
    }),
    [stepBySemitone]
  );

  return (
    <VerticalRegion style={{ position: "relative" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          visibility: loading ? "hidden" : "inherit",
        }}
      >
        <PlayBar
          player={player}
          isPlaying={isPlaying}
          startBoundPercent={startBoundPercent}
          setStartBoundPercent={setStartBoundPercent}
          endBoundPercent={endBoundPercent}
          setEndBoundPercent={setEndBoundPercent}
        />
      </div>
      <div style={{ display: "flex", visibility: loading ? "hidden" : "inherit" }}>
        <Casing
          sub1={
            <Switch
              description="lock pitch"
              icon={PiLockSimpleOpen}
              enabledIcon={PiLockSimple}
              state={lockPlaybackPitch}
              setState={(state) => {
                setLockPlaybackPitch(state);
              }}
            />
          }
        >
          <Knob
            name={`rate${trackID}`}
            label="rate"
            labelUnit="x"
            onChange={(value) => {
              setRate(value);
            }}
            value={rate}
            config={playbackRateKnobConfig}
            onEndDrag={player.resetPitchCompensator}
          />
        </Casing>
        <Casing
          sub1={
            <Switch
              description="step by semitone"
              icon={PiSteps}
              state={stepBySemitone}
              setState={setStepBySemitone}
            />
          }
        >
          <Knob
            name={`transpose${trackID}`}
            label="transpose"
            labelUnit="semitones"
            onChange={(value) => {
              setPitch(value);
            }}
            value={pitch}
            config={pitchKnobConfig}
            onEndDrag={player.resetPitchShift}
          />
        </Casing>
        <Casing
          sub1={
            <IconButton
              icon={PiArrowCounterClockwise}
              description="restart"
              onClick={() => player.restart()}
            />
          }
          sub2={
            <Switch
              description="restart on pause"
              icon={PiCaretLineLeft}
              state={restartOnPause}
              setState={(state) => {
                setRestartOnPause(state);
              }}
            />
          }
        >
          <div
            style={{
              margin: "0px",
              padding: "0px",
              height: "45px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Switch
              description={isPlaying ? "pause" : "play"}
              icon={IoPlayCircleSharp}
              enabledIcon={IoPauseCircleSharp}
              enabledColor="var(--white)"
              state={isPlaying}
              style={{ height: "45px" }}
              setState={async (state) => {
                await Tone.start();
                player.togglePlayer(state);
                setIsPlaying(state);
              }}
            />
          </div>
        </Casing>
        <Casing
          sub1={
            <Switch
              description="reverse relative to start"
              icon={PiMapPin}
              state={reverseRelativeToStart}
              setState={(state) => {
                setReverseRelativeToStart(state);
              }}
            />
          }
        >
          <div
            style={{
              margin: "0px",
              padding: "0px",
              height: "45px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Switch
              description="reverse"
              icon={PiArrowLeft}
              state={reverse}
              setState={(state) => {
                setReverse(state);
              }}
            />
          </div>
        </Casing>
        <Casing
          sub1={
            <Switch
              description="mute"
              state={mute}
              setState={(state) => {
                setMute(state);
              }}
              icon={PiSpeakerSimpleHigh}
              enabledIcon={PiSpeakerSimpleSlash}
            />
          }
          sub2={
            <HoldSwitch
              description="mute on hold"
              state={muteOnHold}
              setState={(state) => {
                setMuteOnHold(state);
              }}
              icon={PiSpeakerSimpleX}
            />
          }
        >
          <Knob
            name={`volume${trackID}`}
            label="volume"
            labelUnit="dBFS"
            onChange={(value) => {
              setVolume(value);
            }}
            value={volume}
            config={volumeKnobConfig}
          />
        </Casing>
      </div>
      {loading && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <BarLoader $direction={trackID === "B" ? "left" : "right"} />
        </div>
      )}
    </VerticalRegion>
  );
};

export default TrackPlayer;
