import * as Tone from "tone";
import { useEffect, useRef } from "react";
import { BackgroundCanvas } from "./containers";
import type { VisualizerColorSource } from "../../stores";

interface Props {
  analyzer: Tone.Analyser;
  colorSource: VisualizerColorSource;
  solidColor: string;
  lineThickness: number;
}

const Oscilloscope: React.FC<Props> = ({
  analyzer,
  colorSource,
  solidColor,
  lineThickness,
}: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const configRef = useRef({
    solidColor,
    colorSource,
    lineThickness,
  });

  useEffect(() => {
    configRef.current = {
      solidColor,
      colorSource,
      lineThickness,
    };
  }, [solidColor, colorSource, lineThickness]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d")!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);
      const values = analyzer.getValue() as Float32Array;
      const { height, width } = canvas;

      context.globalCompositeOperation = "source-over";
      context.fillStyle = "black";
      context.fillRect(0, 0, width, height);

      if (configRef.current.colorSource !== "solid") {
        context.globalCompositeOperation = "destination-out";
      }

      context.beginPath();
      context.lineWidth = configRef.current.lineThickness;
      context.strokeStyle = configRef.current.solidColor;

      for (let i = 0; i < values.length; i++) {
        const x = (i / values.length) * width;
        const y = ((1 - (values[i] + 1) / 2) * height) / 2 + height / 4;
        if (i === 0) {
          context.moveTo(x, y);
        } else {
          context.lineTo(x, y);
        }
      }
      context.stroke();
    };

    draw();
  }, [analyzer]);

  return <BackgroundCanvas style={{ zIndex: "-4" }} ref={canvasRef} />;
};

export default Oscilloscope;
