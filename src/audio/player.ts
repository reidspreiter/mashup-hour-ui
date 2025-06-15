import * as Tone from "tone";

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
  private title: string;
  private previewUrl: string;
  private blob: Blob;
  private player: Tone.Player;

  constructor(title: string, preview: string) {
    const { blob, previewUrl } = getBlobAndPreviewUrl(preview);
    this.blob = blob;
    this.previewUrl = previewUrl;
    this.title = title;
    this.player = new Tone.Player(previewUrl).toDestination();
    this.player.loop = true;
  }

  private unload = () => {
    this.togglePlayer(false);
    this.player.dispose();
    URL.revokeObjectURL(this.previewUrl);
  };

  public loadTrack = (title: string, preview: string) => {
    this.unload();

    const { blob, previewUrl } = getBlobAndPreviewUrl(preview);
    this.blob = blob;
    this.previewUrl = previewUrl;
    this.title = title;
    this.player = new Tone.Player(previewUrl).toDestination();
    this.player.loop = true;
  };

  public togglePlayer = (isPlaying: boolean) => {
    if (isPlaying) {
      this.player.start(undefined);
    } else {
      this.player.stop();
    }
  };

  set onStop(onStop: () => void) {
    this.player.onstop = onStop;
  }
}
