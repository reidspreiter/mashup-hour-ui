import * as Tone from "tone";
import { useEffect, useRef } from "react";
import { BackgroundCanvas } from "./Background";

interface Props {
  analyser: Tone.Analyser;
}

const Oscilloscope: React.FC<Props> = ({ analyser }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

      context.globalCompositeOperation = "source-over";
      context.fillStyle = "black";
      context.fillRect(0, 0, canvas.width, canvas.height);

      context.globalCompositeOperation = "destination-out";
      context.beginPath();
      context.lineWidth = 2;
      context.strokeStyle = "black";

      for (let i = 0; i < values.length; i++) {
        const x = (i / values.length) * canvas.width;
        const y = ((1 - (values[i] + 1) / 2) * canvas.height) / 2 + canvas.height / 4;
        if (i === 0) {
          context.moveTo(x, y);
        } else {
          context.lineTo(x, y);
        }
      }
      context.stroke();
    };

    draw();
  }, []);

  return <BackgroundCanvas ref={canvasRef} />;
};

export default Oscilloscope;
