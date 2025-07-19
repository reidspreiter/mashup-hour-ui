import * as Tone from "tone";
import type { TrackID } from "../components/track/common";

type BlobAndPreviewUrl = {
  blob: Blob;
  previewUrl: string;
};

const getBlobAndPreviewUrl = (preview: string): BlobAndPreviewUrl => {
  const binaryPreview = atob(preview);
  const arrayBuffer = new ArrayBuffer(binaryPreview.length);
  const uint8Array = new Uint8Array(arrayBuffer);

  for (let i = 0; i < binaryPreview.length; i++) {
    uint8Array[i] = binaryPreview.charCodeAt(i);
  }

  const blob = new Blob([arrayBuffer], { type: "audio/mp3" });
  const previewUrl = URL.createObjectURL(blob);
  return { blob, previewUrl };
};

export class Player {
  private trackID: TrackID;
  // private previewUrl: string;
  // private blob: Blob;
  private buffer: Tone.ToneAudioBuffer;
  private player: Tone.Player;

  private gainProxy: Tone.Gain;
  private playbackRatePitchCompensator: Tone.PitchShift;
  private pitchShift: Tone.PitchShift;

  public restartOnPause: boolean = false;
  private lockPlaybackPitch: boolean = true;
  public reverseRelativeToStart: boolean = false;

  private startTime: number = 0;
  private offset: number = 0;
  private preventOnStopPropagationCounter: number = 0;

  public static async init(
    trackID: TrackID,
    preview: string,
    gainProxy: Tone.Gain
  ): Promise<Player> {
    const { blob, previewUrl } = getBlobAndPreviewUrl(preview);
    const buffer = new Tone.ToneAudioBuffer();
    await buffer.load(previewUrl);
    URL.revokeObjectURL(previewUrl);
    return new Player(trackID, buffer, gainProxy);
  }

  private constructor(trackID: TrackID, buffer: Tone.ToneAudioBuffer, gainProxy: Tone.Gain) {
    this.buffer = buffer;
    this.player = new Tone.Player(buffer).set({ loop: true });
    this.trackID = trackID;
    this.gainProxy = gainProxy;
    this.playbackRatePitchCompensator = new Tone.PitchShift();
    this.pitchShift = new Tone.PitchShift();
    Tone.connectSeries(
      this.player,
      this.pitchShift,
      this.playbackRatePitchCompensator,
      this.gainProxy
    );
    this.player.setLoopPoints(0, this.player.buffer.duration);
  }

  private unload = () => {
    this.togglePlayer(false);
    this.player.dispose();
  };

  public loadTrack = async (preview: string): Promise<void> => {
    this.unload();

    const { blob, previewUrl } = getBlobAndPreviewUrl(preview);
    await this.buffer.load(previewUrl);
    URL.revokeObjectURL(previewUrl);
    this.player = new Tone.Player(this.buffer)
      .set({ loop: true })
      .connect(this.pitchShift)
      .setLoopPoints(0, this.buffer.duration);
  };

  public connect = (destination: Tone.InputNode, outputNum?: number, inputNum?: number) => {
    this.player.connect(destination, outputNum, inputNum);
  };

  private setOffset = () => {
    const now = Tone.now();
    const loopStart = Tone.Time(this.player.loopStart).toSeconds();
    const loopEnd = Tone.Time(this.player.loopEnd).toSeconds();

    const elapsed = now - this.startTime;
    const loopDuration = loopEnd - loopStart;
    const offset =
      (((this.offset + elapsed * this.player.playbackRate - loopStart) % loopDuration) +
        loopDuration) %
      loopDuration;
    this.offset = isNaN(offset) ? loopStart : loopStart + offset;
    this.startTime = now;
  };

  public togglePlayer = (isPlaying: boolean) => {
    if (isPlaying) {
      this.startTime = Tone.now();
      this.player.start(Tone.now(), this.offset);
    } else if (this.restartOnPause) {
      this.player.stop();
      this.offset = Tone.Time(this.player.loopStart).toSeconds();
    } else {
      this.setOffset();
      this.player.stop();
    }
  };

  public setReverse = (reverse: boolean) => {
    if (this.player.reverse === reverse) {
      return;
    }
    this.setOffset();
    this.player.reverse = reverse;
    if (!this.reverseRelativeToStart) {
      this.offset = this.player.buffer.duration - this.offset;
      this.seek(this.offset);
    }
  };

  public setMute = (mute: boolean) => {
    this.player.mute = mute;
  };

  public setVolume = (volume: number) => {
    this.player.volume.value = volume;
  };

  public setPlaybackRate = (playbackRate: number) => {
    if (this.lockPlaybackPitch) {
      this.playbackRatePitchCompensator.pitch = -12 * Math.log2(playbackRate);
    }
    this.setOffset();
    this.player.playbackRate = playbackRate;
  };

  public setLockPlaybackPitch = (lockPlaybackPitch: boolean) => {
    this.lockPlaybackPitch = lockPlaybackPitch;
    this.setPlaybackRate(this.player.playbackRate);
  };

  public setPitch = (semitones: number) => {
    this.pitchShift.pitch = semitones;
  };

  // adjusting the pitch extremely aggressively can cause the internal state of the
  // pitch shift to become corrupted, producing a delay effect
  public resetPitchCompensator = () => {
    const newPitcher = new Tone.PitchShift();

    newPitcher.connect(this.gainProxy);
    this.pitchShift.disconnect();

    // pitch must be set after node creation to avoid pops from differing buffer times between previous and new nodes
    newPitcher.pitch = this.playbackRatePitchCompensator.pitch;
    this.pitchShift.connect(newPitcher);

    this.playbackRatePitchCompensator.dispose();
    this.playbackRatePitchCompensator = newPitcher;
  };

  public resetPitchShift = () => {
    const newPitcher = new Tone.PitchShift();

    newPitcher.connect(this.playbackRatePitchCompensator);
    this.player.disconnect();
    newPitcher.pitch = this.pitchShift.pitch;
    this.player.connect(newPitcher);

    this.pitchShift.dispose();
    this.pitchShift = newPitcher;
  };

  public restart = () => {
    if (this.player.state === "started") {
      this.preventOnStopPropagationCounter++;
    }
    this.player.restart();
  };

  public setLoopBounds = (startPercentage: number, endPercentage: number) => {
    this.setOffset();
    this.player.setLoopPoints(
      this.buffer.duration * startPercentage,
      this.buffer.duration * endPercentage
    );
    const offset = this.getPositionPercentage();
    if (this.player.reverse && offset > startPercentage) {
      this.seekFromPercentage(endPercentage);
    } else if (!this.player.reverse && offset > endPercentage) {
      this.seekFromPercentage(startPercentage);
    }
  };

  private seek = (offset: number) => {
    this.preventOnStopPropagationCounter++;
    this.player.seek(this.player.reverse ? this.buffer.duration - offset : offset);
    this.startTime = Tone.now();
    this.offset = this.player.reverse ? this.buffer.duration - offset : offset;
  };

  public seekFromPercentage = (percentage: number) => {
    this.seek(this.buffer.duration * percentage);
  };

  public getPositionPercentage = () => {
    const now = Tone.now();
    const loopStart = Tone.Time(this.player.loopStart).toSeconds();
    const loopEnd = Tone.Time(this.player.loopEnd).toSeconds();

    const elapsed = now - this.startTime;
    const loopDuration = loopEnd - loopStart;
    let offset;

    if (this.player.reverse) {
      offset = this.buffer.duration - this.offset - elapsed * this.player.playbackRate + loopEnd;
    } else {
      offset = this.offset + elapsed * this.player.playbackRate - loopStart;
    }

    // wrap to ensure non-negative
    const currentPosition = (((offset % loopDuration) + loopDuration) % loopDuration) + loopStart;
    return currentPosition / this.buffer.duration;
  };

  set onStop(onStop: () => void) {
    this.player.onstop = () => {
      if (this.preventOnStopPropagationCounter > 0) {
        this.preventOnStopPropagationCounter--;
      } else {
        onStop();
      }
    };
  }
}
