import type React from "react";
import { booleanGate } from "../../audio";
import { getLogData, smoothLowFrequencies } from "../../audio";
import type { VisualizerColorSource } from "./Background";
import { Analyser } from "tone";
import { useEffect, useRef } from "react";
import { BackgroundCanvas } from "./containers";
import { drawSpectrumAnalyzer, drawFrequencyGateBar } from "./common";

interface Props {
  analyzer: Analyser;
  colorSource: VisualizerColorSource;
  solidColor: string;
  lineThickness: number;
  frequencyGateX: number;
  frequencyGateY: number;
  frequencyGateTolerance: number;
  frequencyGateInverted: boolean;
  frequencyGateSustained: boolean;
  viewGateVisual: boolean;
  smoothVisualizer: boolean;
  visualizerSpeed: number;
}

const Ripple: React.FC<Props> = ({
  analyzer,
  colorSource,
  solidColor,
  lineThickness,
  frequencyGateX,
  frequencyGateY,
  frequencyGateTolerance,
  frequencyGateInverted,
  frequencyGateSustained,
  viewGateVisual,
  smoothVisualizer,
  visualizerSpeed,
}: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const pulseRingRadiusesRef = useRef<number[]>([]);
  const gateRawStateRef = useRef(false);
  const configRef = useRef({
    frequencyGateX,
    frequencyGateY,
    frequencyGateTolerance,
    frequencyGateInverted,
    frequencyGateSustained,
    solidColor,
    colorSource,
    lineThickness,
    viewGateVisual,
    smoothVisualizer,
    visualizerSpeed,
  });

  useEffect(() => {
    configRef.current = {
      frequencyGateX,
      frequencyGateY,
      frequencyGateTolerance,
      frequencyGateInverted,
      frequencyGateSustained,
      solidColor,
      colorSource,
      lineThickness,
      viewGateVisual,
      smoothVisualizer,
      visualizerSpeed,
    };
  }, [
    frequencyGateX,
    frequencyGateY,
    frequencyGateTolerance,
    frequencyGateInverted,
    frequencyGateSustained,
    solidColor,
    colorSource,
    lineThickness,
    viewGateVisual,
    smoothVisualizer,
    visualizerSpeed,
  ]);

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
      const hypot = Math.hypot(width, height);
      const {
        frequencyGateX,
        frequencyGateY,
        frequencyGateTolerance,
        frequencyGateSustained,
        frequencyGateInverted,
      } = configRef.current;

      const [newRawState, newState] = booleanGate(
        values,
        frequencyGateX,
        frequencyGateY,
        frequencyGateTolerance,
        frequencyGateSustained,
        frequencyGateInverted,
        gateRawStateRef.current
      );

      if (newState) {
        pulseRingRadiusesRef.current.push(0);
      }

      gateRawStateRef.current = newRawState;

      context.globalCompositeOperation = "source-over";
      context.fillStyle = "black";
      context.fillRect(0, 0, width, height);

      if (configRef.current.viewGateVisual) {
        drawSpectrumAnalyzer(
          context,
          configRef.current.lineThickness,
          "white",
          values,
          height,
          width
        );
        drawFrequencyGateBar(
          context,
          newState,
          frequencyGateX,
          frequencyGateY,
          frequencyGateTolerance,
          values.length,
          width,
          height
        );
      }

      if (configRef.current.colorSource !== "solid") {
        context.globalCompositeOperation = "destination-out";
      }

      context.strokeStyle = configRef.current.solidColor;
      context.lineWidth = configRef.current.lineThickness;

      for (let i = pulseRingRadiusesRef.current.length - 1; i >= 0; i--) {
        const newRadius = pulseRingRadiusesRef.current[i] + configRef.current.visualizerSpeed;
        pulseRingRadiusesRef.current[i] = newRadius;

        if (newRadius > hypot) {
          pulseRingRadiusesRef.current.splice(0, i + 1);
          break;
        }

        context.beginPath();
        context.arc(width / 2, height / 2, newRadius, 0, Math.PI * 2);
        context.stroke();
      }
    };

    draw();

    return () => {
      animationRef.current ? cancelAnimationFrame(animationRef.current) : undefined;
    };
  }, [analyzer]);

  return <BackgroundCanvas style={{ zIndex: "-4" }} ref={canvasRef} />;
};

export default Ripple;
