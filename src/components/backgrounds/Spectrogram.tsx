import * as Tone from "tone";
import { useEffect, useRef } from "react";
import { BackgroundCanvas } from "./Background";

interface Props {
  analyser: Tone.Analyser;
}

const Spectrogram: React.FC<Props> = ({ analyser }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Cut off top frequencies or the bars will rarely ever move on the right side
  const numBars = Math.round(analyser.size * 0.7);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d")!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const draw = () => {
      requestAnimationFrame(draw);
      const values = analyser.getValue() as Float32Array;
      const barWidth = canvas.width / numBars;
      const maxHeight = canvas.height;
      const capHeight = 20;

      context.globalCompositeOperation = "source-over";
      context.fillStyle = "black";
      context.fillRect(0, 0, canvas.width, canvas.height);

      context.globalCompositeOperation = "destination-out";

      for (let i = 0; i < numBars; i++) {
        const value = values[i];
        const normalizedMagnitude = Math.max(0, (value + 100) / 100);
        const barHeight = normalizedMagnitude * maxHeight;

        const x = i * barWidth;
        const y = maxHeight - barHeight - capHeight;

        context.fillRect(x, y, barWidth - 2, capHeight);
      }
    };

    draw();
  }, []);

  return <BackgroundCanvas ref={canvasRef} />;
};

export default Spectrogram;
