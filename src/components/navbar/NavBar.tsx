import styled from "styled-components";
import type { AnalyserType } from "tone";
import type { Dispatch, SetStateAction } from "react";
import { useContext, useState, useRef, useCallback, useMemo } from "react";
import { PreferencesContext } from "../../contexts";
import { Popper } from "../containers";
import { VerticalRegion, Scroll } from "../containers";
import { Header } from "../text";
import {
  Select,
  RadioGroup,
  RadioButton,
  Color,
  Slider,
  InputBox,
  Knob,
  Switch,
  InputGroup,
  Checkbox,
  IconButton,
} from "../input";
import type { RangeMode } from "../input";
import { PiChatCenteredDots, PiChatCentered, PiWaveform, PiEye, PiEyeClosed, PiCodeSimple, PiBug, PiLightbulbFilament } from "react-icons/pi";
import {
  VISUALIZER_DYNAMIC_COLORS,
  VISUALIZER_TYPES,
  ANALYZER_RESOLUTIONS,
  VISUALIZER_DEFAULTS,
} from "../background";
import type {
  VisualizerType,
  VisualizerColorSource,
  VisualizerDynamicColor,
  AnalyzerResolution,
} from "../background";
import { openLinkInNewTab } from "../../util";

interface Props {
  visualizerType: VisualizerType;
  setVisualizerType: Dispatch<SetStateAction<VisualizerType>>;
  visualizerColorSource: VisualizerColorSource;
  setVisualizerColorSource: Dispatch<SetStateAction<VisualizerColorSource>>;
  visualizerSolidColor: string;
  setVisualizerSolidColor: Dispatch<SetStateAction<string>>;
  visualizerDynamicColor: VisualizerDynamicColor;
  setVisualizerDynamicColor: Dispatch<SetStateAction<VisualizerDynamicColor>>;
  visualizerLineThickness: number;
  setVisualizerLineThickness: Dispatch<SetStateAction<number>>;
  analyzerType: AnalyserType;
  setAnalyzerType: Dispatch<SetStateAction<AnalyserType>>;
  analyzerResolution: AnalyzerResolution;
  setAnalyzerResolution: Dispatch<SetStateAction<AnalyzerResolution>>;
  frequencyGateX: number;
  setFrequencyGateX: Dispatch<SetStateAction<number>>;
  frequencyGateY: number;
  setFrequencyGateY: Dispatch<SetStateAction<number>>;
  frequencyGateTolerance: number;
  setFrequencyGateTolerance: Dispatch<SetStateAction<number>>;
  frequencyGateInverted: boolean;
  setFrequencyGateInverted: Dispatch<SetStateAction<boolean>>;
  frequencyGateSustained: boolean;
  setFrequencyGateSustained: Dispatch<SetStateAction<boolean>>;
  viewGateVisual: boolean;
  setViewGateVisual: Dispatch<SetStateAction<boolean>>;
  smoothVisualizer: boolean;
  setSmoothVisualizer: Dispatch<SetStateAction<boolean>>;
  visualizerSpeed: number;
  setVisualizerSpeed: Dispatch<SetStateAction<number>>;
  setHideMashupControls: Dispatch<SetStateAction<boolean>>;
}

const NavBarStyled = styled.div`
  width: 100%;
  height: 55px;
  background-color: transparent;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  z-index: 5;
  position: relative;
  box-sizing: border-box;
  margin: 0px;
`;

const NavBar: React.FC<Props> = ({
  visualizerType,
  setVisualizerType,
  visualizerColorSource,
  setVisualizerColorSource,
  visualizerSolidColor,
  setVisualizerSolidColor,
  visualizerDynamicColor,
  setVisualizerDynamicColor,
  visualizerLineThickness,
  setVisualizerLineThickness,
  analyzerType,
  setAnalyzerType,
  analyzerResolution,
  setAnalyzerResolution,
  frequencyGateX,
  setFrequencyGateX,
  frequencyGateY,
  setFrequencyGateY,
  frequencyGateTolerance,
  setFrequencyGateTolerance,
  frequencyGateInverted,
  setFrequencyGateInverted,
  frequencyGateSustained,
  setFrequencyGateSustained,
  viewGateVisual,
  setViewGateVisual,
  smoothVisualizer,
  setSmoothVisualizer,
  visualizerSpeed,
  setVisualizerSpeed,
  setHideMashupControls,
}) => {
  const { preferences, setPreferences } = useContext(PreferencesContext);
  const [showVisualizerCustomization, setShowVisualizerCustomization] = useState(false);
  const visualizerCustomizationButtonRef = useRef<HTMLButtonElement>(null);
  const [prevViewVisual, setPrevViewVisual] = useState<boolean | null>(false);

  const handleTemporaryViewVisual = useCallback(
    (showVisual: boolean) => {
      if (showVisual) {
        setPrevViewVisual(viewGateVisual);
        setViewGateVisual(true);
      } else {
        setViewGateVisual(prevViewVisual ?? false);
        setPrevViewVisual(null);
      }
    },
    [prevViewVisual, viewGateVisual]
  );

  const handleVisualizerChange = (value: VisualizerType) => {
    setVisualizerType(value);
    setAnalyzerType(value === "spectrum analyzer" || value === "ripple" ? "fft" : "waveform");
  };

  const frequencyGateXKnobConfig = useMemo<RangeMode>(
    () => ({
      type: "range",
      step: 1,
      min: 0,
      max: analyzerResolution - 1,
      default: {
        value: VISUALIZER_DEFAULTS.frequencyGateX,
        min: 0,
        max: VISUALIZER_DEFAULTS.analyzerResolution,
      },
    }),
    [analyzerResolution]
  );

  const frequencyGateYKnobConfig = useMemo<RangeMode>(
    () => ({
      type: "range",
      step: 1,
      min: -100,
      max: 0,
      default: { value: VISUALIZER_DEFAULTS.frequencyGateY, min: -100, max: 0 },
    }),
    []
  );

  const frequencyGateToleranceKnobConfig = useMemo<RangeMode>(
    () => ({
      type: "range",
      step: 1,
      min: 1,
      max: analyzerResolution - 1,
      default: {
        value: VISUALIZER_DEFAULTS.frequencyGateTolerance,
        min: 1,
        max: VISUALIZER_DEFAULTS.analyzerResolution,
      },
    }),
    [analyzerResolution]
  );

  return (
    <NavBarStyled>
      <div style={{display: "flex", margin: "0px", padding: "0px", height: "100%"}}>
        <IconButton description="visit GitHub repo" icon={PiCodeSimple} onClick={() => openLinkInNewTab("https://github.com/reidspreiter/mashup-hour-ui")}/>
        <IconButton description="report a bug" icon={PiBug} onClick={() => openLinkInNewTab("https://github.com/reidspreiter/mashup-hour-ui/issues/new?template=bug_report.md")}/>
        <IconButton description="request a feature" icon={PiLightbulbFilament} onClick={() => openLinkInNewTab("https://github.com/reidspreiter/mashup-hour-ui/issues/new?template=feature_request.md")}/>
      </div>
      <div style={{display: "flex", margin: "0px", padding: "0px", height: "100%"}}>
        <Switch
          description="hide tooltips"
          icon={PiChatCenteredDots}
          enabledIcon={PiChatCentered}
          startEnabled={preferences.disableTooltips}
          onClick={(isEnabled) => {
            setPreferences((prev) => ({
              ...prev,
              disableTooltips: isEnabled,
            }));
          }}
        />
        <Switch
          description="hide mashup controls"
          icon={PiEye}
          enabledIcon={PiEyeClosed}
          startEnabled={false}
          onClick={setHideMashupControls}
        />
        <Switch
          ref={visualizerCustomizationButtonRef}
          description="customize visualizer"
          icon={PiWaveform}
          onClick={(isEnabled) => setShowVisualizerCustomization(isEnabled)}
        />
      </div>
      <Popper open={showVisualizerCustomization} anchor={visualizerCustomizationButtonRef}>
        <VerticalRegion>
          <Header>Visualizer</Header>
          <Scroll
            style={{
              maxHeight: "80vh",
              overflowY: "auto",
              overflowX: "hidden",
              paddingRight: "16px",
            }}
          >
            <InputBox>
              <Select
                label="type:"
                name="visualizer-type-select"
                options={VISUALIZER_TYPES}
                value={visualizerType}
                onChange={(value) => handleVisualizerChange(value as VisualizerType)}
              />
            </InputBox>
            <InputBox>
              <Checkbox
                name="visualizer-smoothing"
                state={smoothVisualizer}
                onChange={(state: boolean) => setSmoothVisualizer(state)}
                disabled={analyzerType !== "fft"}
                label="apply smoothing"
              />
            </InputBox>
            <InputBox>
              <RadioGroup
                disabled={visualizerType === "none"}
                label="color source:"
                groupName="visualizer-color-source-select"
                direction="column"
                onChange={(value) => setVisualizerColorSource(value as VisualizerColorSource)}
                value={visualizerColorSource}
              >
                <RadioButton
                  name="visualizer-color-source-solid"
                  disabled={visualizerType === "none"}
                  value="solid"
                  label="solid"
                >
                  <Color
                    disabled={visualizerColorSource !== "solid" || visualizerType === "none"}
                    name="visualizer-solid-color-select"
                    onChange={(value) => setVisualizerSolidColor(value)}
                    value={visualizerSolidColor}
                  />
                </RadioButton>
                <RadioButton
                  name="visualizer-color-source-spectrum"
                  disabled={visualizerType === "none"}
                  value="spectrum"
                  label="spectrum"
                >
                  <Select
                    disabled={visualizerColorSource !== "spectrum" || visualizerType === "none"}
                    name="visualizer-dynamic-color-select"
                    options={VISUALIZER_DYNAMIC_COLORS}
                    value={visualizerDynamicColor}
                    onChange={(value) => setVisualizerDynamicColor(value as VisualizerDynamicColor)}
                  />
                </RadioButton>
                <RadioButton
                  name="visualizer-color-source-album"
                  disabled={visualizerType === "none"}
                  value="album"
                  label="album"
                />
              </RadioGroup>
            </InputBox>
            <InputBox>
              <Slider
                disabled={visualizerType === "none"}
                label="resolution:"
                name="visualizer-analyzer-resolution-select"
                labelUnit={analyzerType === "fft" ? "bins" : "samples"}
                config={{ type: "steps", steps: ANALYZER_RESOLUTIONS }}
                value={analyzerResolution}
                onChange={(value) => setAnalyzerResolution(value as AnalyzerResolution)}
              />
            </InputBox>
            <InputBox>
              <Slider
                disabled={visualizerType === "none"}
                label="thickness:"
                name="visualizer-line-thickness-select"
                labelUnit="px"
                config={{ type: "steps", steps: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }}
                value={visualizerLineThickness}
                onChange={(value) => setVisualizerLineThickness(value)}
              />
            </InputBox>
            <InputBox>
              <Slider
                disabled={visualizerType !== "ripple"}
                label="speed:"
                name="visualizer-speed-select"
                labelUnit={"px/frame"}
                config={{ type: "range", step: 1, min: 1, max: 10 }}
                value={visualizerSpeed}
                onChange={(value) => setVisualizerSpeed(value)}
              />
            </InputBox>
            <InputBox>
              <InputGroup
                alignment="center"
                disabled={visualizerType !== "ripple"}
                label="gate position:"
              >
                <Knob
                  label="frequency"
                  disabled={visualizerType !== "ripple"}
                  config={frequencyGateXKnobConfig}
                  onChange={(value) => {
                    setFrequencyGateX(value);
                  }}
                  value={frequencyGateX}
                  name="frequency-gate-frequency"
                  onStartDrag={() => handleTemporaryViewVisual(true)}
                  onEndDrag={() => handleTemporaryViewVisual(false)}
                />
                <Knob
                  label="amplitude"
                  disabled={visualizerType !== "ripple"}
                  config={frequencyGateYKnobConfig}
                  onChange={(value) => {
                    setFrequencyGateY(value);
                  }}
                  value={frequencyGateY}
                  labelUnit="dBFS"
                  name="frequency-gate-amplitude"
                  onStartDrag={() => handleTemporaryViewVisual(true)}
                  onEndDrag={() => handleTemporaryViewVisual(false)}
                />
                <Knob
                  label="tolerance"
                  disabled={visualizerType !== "ripple"}
                  config={frequencyGateToleranceKnobConfig}
                  onChange={(value) => {
                    setFrequencyGateTolerance(value);
                  }}
                  value={frequencyGateTolerance}
                  labelUnit={frequencyGateTolerance === 1 ? "band" : "bands"}
                  name="frequency-gate-tolerance"
                  onStartDrag={() => handleTemporaryViewVisual(true)}
                  onEndDrag={() => handleTemporaryViewVisual(false)}
                />
              </InputGroup>
            </InputBox>
            <InputBox>
              <InputGroup
                label="gate behavior:"
                disabled={visualizerType !== "ripple"}
                direction="column"
              >
                <Checkbox
                  name="frequency-gate-inverted"
                  state={frequencyGateInverted}
                  onChange={(state: boolean) => setFrequencyGateInverted(state)}
                  disabled={visualizerType !== "ripple"}
                  label="inverted"
                />
                <Checkbox
                  name="frequency-gate-sustained"
                  state={frequencyGateSustained}
                  onChange={(state: boolean) => setFrequencyGateSustained(state)}
                  disabled={visualizerType !== "ripple"}
                  label="sustained"
                />
                <Checkbox
                  name="frequency-gate-show-visual"
                  state={prevViewVisual ?? viewGateVisual}
                  onChange={(state: boolean) => setViewGateVisual(state)}
                  disabled={visualizerType !== "ripple"}
                  label="show visual"
                />
              </InputGroup>
            </InputBox>
          </Scroll>
        </VerticalRegion>
      </Popper>
    </NavBarStyled>
  );
};

export default NavBar;
