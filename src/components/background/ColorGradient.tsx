import { BackgroundDiv } from "./containers";
import styled from "styled-components";
import type { VisualizerType, VisualizerDynamicColor } from "./Background";

interface Props {
  visualizerType: VisualizerType;
  visualizerDynamicColor: VisualizerDynamicColor;
}

type GradientDirection = "to top" | "vertical center join" | "to bottom";
type GradientType = "linear-gradient" | "radial-gradient";

interface GradientProps {
  $colorStops: string[];
  $direction?: GradientDirection;
  $type?: GradientType;
  $topPercentLimit?: string;
  $bottomPercentLimit?: string;
}

const createStops = (
  colorStops: string[],
  direction: GradientDirection,
  topPercentLimit: string,
  bottomPercentLimit: string
): string => {
  if (colorStops.length < 2) {
    return colorStops.join(", ");
  }
  const stopsCopy = [...colorStops];

  if (direction === "vertical center join") {
    const topHalf = colorStops.slice(1);
    stopsCopy.reverse();
    stopsCopy[0] += ` ${bottomPercentLimit}`;
    topHalf[topHalf.length - 1] += ` ${topPercentLimit}`;
    return stopsCopy.concat(...topHalf).join(", ");
  } else if (direction === "to bottom") {
    stopsCopy.reverse();
  }
  stopsCopy[0] += ` ${bottomPercentLimit}`;
  stopsCopy[stopsCopy.length - 1] += ` ${topPercentLimit}`;
  return stopsCopy.join(", ");
};

const GradientBackground = styled(BackgroundDiv)<GradientProps>`
  background: ${({
    $colorStops,
    $direction = "to top",
    $topPercentLimit = "100%",
    $bottomPercentLimit = "0%",
    $type = "linear-gradient"
  }) =>
    `${$type}(${$type === "linear-gradient" ? "to top" : "circle at center"}, ${createStops($colorStops, $direction, $topPercentLimit, $bottomPercentLimit)})`};
`;

const FULL_STOPS = [
  "hsl(300, 100%, 50%)",
  "hsl(270, 100%, 50%)",
  "hsl(240, 100%, 50%)",
  "hsl(210, 100%, 50%)",
  "hsl(180, 100%, 50%)",
  "hsl(150, 100%, 50%)",
  "hsl(120, 100%, 50%)",
  "hsl(90, 100%, 50%)",
  "hsl(70, 100%, 50%)",
  "hsl(30, 100%, 50%)",
  "hsl(0, 100%, 50%)",
];

const GRAYSCALE_STOPS = ["hsl(0, 0%, 4.3%)", "hsl(0, 0%, 99%)"];

const WARM_STOPS = [
  "hsl(0, 100%, 10%)",
  "hsl(10, 90%, 25%)",
  "hsl(20, 100%, 40%)",
  "hsl(30, 100%, 55%)",
  "hsl(40, 100%, 65%)",
  "hsl(50, 100%, 70%)",
  "hsl(60, 100%, 85%)",
  "hsl(60, 100%, 95%)",
];

const COOL_STOPS = [
  "hsl(220, 100%, 10%)",
  "hsl(210, 100%, 25%)",
  "hsl(195, 100%, 40%)",
  "hsl(185, 80%, 60%)",
  "hsl(175, 100%, 75%)",
  "hsl(160, 100%, 90%)",
];

const ColorGradient: React.FC<Props> = ({ visualizerType, visualizerDynamicColor }) => {
  return (
    <GradientBackground
      $topPercentLimit={visualizerType === "oscilloscope" ? "71%" : "80%"}
      $bottomPercentLimit={visualizerType === "oscilloscope" ? "29%" : undefined}
      $direction={visualizerType === "oscilloscope" ? "vertical center join" : visualizerType === "ripple" ? "to bottom" : "to top"}
      $type={visualizerType === "ripple" ? "radial-gradient" : "linear-gradient"}
      $colorStops={
        visualizerDynamicColor === "full"
          ? FULL_STOPS
          : visualizerDynamicColor === "grayscale"
            ? GRAYSCALE_STOPS
            : visualizerDynamicColor === "warm"
              ? WARM_STOPS
              : COOL_STOPS
      }
    />
  );
};

export default ColorGradient;
