import * as Tone from "tone";
import { useEffect, useRef } from "react";
import { BackgroundCanvas } from "./containers";
import { getLogData, smoothLowFrequencies } from "../../audio";
import type { VisualizerColorSource } from "../../stores";
import { drawSpectrumAnalyzer } from "./common";

interface Props {
  analyzer: Tone.Analyser;
  colorSource: VisualizerColorSource;
  solidColor: string;
  smoothVisualizer: boolean;
  lineThickness: number;
}

const SpectrumAnalyzer: React.FC<Props> = ({
  analyzer,
  colorSource,
  solidColor,
  smoothVisualizer,
  lineThickness,
}: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const configRef = useRef({
    solidColor,
    colorSource,
    smoothVisualizer,
    lineThickness,
  });

  useEffect(() => {
    configRef.current = {
      solidColor,
      colorSource,
      smoothVisualizer,
      lineThickness,
    };
  }, [solidColor, colorSource, smoothVisualizer, lineThickness]);

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
      let values = getLogData(analyzer.getValue() as Float32Array);
      if (configRef.current.smoothVisualizer) {
        values = smoothLowFrequencies(values);
      }
      const { height, width } = canvas;

      context.globalCompositeOperation = "source-over";
      context.fillStyle = "black";
      context.fillRect(0, 0, width, height);

      if (configRef.current.colorSource !== "solid") {
        context.globalCompositeOperation = "destination-out";
      }

      drawSpectrumAnalyzer(
        context,
        configRef.current.lineThickness,
        configRef.current.solidColor,
        values,
        height,
        width
      );
    };

    draw();
  }, [analyzer]);

  return <BackgroundCanvas style={{ zIndex: "-4" }} ref={canvasRef} />;
};

export default SpectrumAnalyzer;
