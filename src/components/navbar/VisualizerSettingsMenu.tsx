import { VerticalRegion, Scroll } from "../containers";
import { Header } from "../text";
import {
  InputBox,
  Select,
  Checkbox,
  RadioButton,
  RadioGroup,
  Slider,
  InputGroup,
  Knob,
  Color,
  IconButton,
} from "../input";
import type { RangeMode } from "../input";
import { useCallback, useState, useMemo } from "react";
import {
  useVisualizerSettingsStore,
  VISUALIZER_DEFAULTS,
  VISUALIZER_TYPES,
  VISUALIZER_DYNAMIC_COLORS,
  ANALYZER_RESOLUTIONS,
} from "../../stores/visualizer";
import { PiCopy, PiClipboard } from "react-icons/pi";
import type {
  VisualizerType,
  VisualizerColorSource,
  VisualizerDynamicColor,
  AnalyzerResolution,
} from "../../stores/visualizer";
import { useShallow } from "zustand/shallow";

const VisualizerSettingsMenu = () => {
  const {
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
    getUrlSnippet,
    setFromUrlSnippet,
  } = useVisualizerSettingsStore(
    useShallow((state) => ({
      visualizerType: state.visualizerType,
      setVisualizerType: state.setVisualizerType,
      visualizerColorSource: state.visualizerColorSource,
      setVisualizerColorSource: state.setVisualizerColorSource,
      visualizerSolidColor: state.visualizerSolidColor,
      setVisualizerSolidColor: state.setVisualizerSolidColor,
      visualizerDynamicColor: state.visualizerDynamicColor,
      setVisualizerDynamicColor: state.setVisualizerDynamicColor,
      visualizerLineThickness: state.visualizerLineThickness,
      setVisualizerLineThickness: state.setVisualizerLineThickness,
      analyzerType: state.analyzerType,
      setAnalyzerType: state.setAnalyzerType,
      analyzerResolution: state.analyzerResolution,
      setAnalyzerResolution: state.setAnalyzerResolution,
      frequencyGateX: state.frequencyGateX,
      setFrequencyGateX: state.setFrequencyGateX,
      frequencyGateY: state.frequencyGateY,
      setFrequencyGateY: state.setFrequencyGateY,
      frequencyGateTolerance: state.frequencyGateTolerance,
      setFrequencyGateTolerance: state.setFrequencyGateTolerance,
      frequencyGateInverted: state.frequencyGateInverted,
      setFrequencyGateInverted: state.setFrequencyGateInverted,
      frequencyGateSustained: state.frequencyGateSustained,
      setFrequencyGateSustained: state.setFrequencyGateSustained,
      viewGateVisual: state.viewGateVisual,
      setViewGateVisual: state.setViewGateVisual,
      smoothVisualizer: state.smoothVisualizer,
      setSmoothVisualizer: state.setSmoothVisualizer,
      visualizerSpeed: state.visualizerSpeed,
      setVisualizerSpeed: state.setVisualizerSpeed,
      getUrlSnippet: state.getUrlSnippet,
      setFromUrlSnippet: state.setFromUrlSnippet,
    }))
  );
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
    <VerticalRegion>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Header>Visualizer</Header>
        <div style={{ display: "flex", marginBottom: "auto", gap: "4px" }}>
          <IconButton
            icon={PiCopy}
            description="copy visualizer settings"
            onClick={async () => {
              const snippet = getUrlSnippet();
              await navigator.clipboard.writeText(snippet);
            }}
          />
          <IconButton
            icon={PiClipboard}
            description="paste visualizer settings"
            onClick={async () => {
              const snippet = await navigator.clipboard.readText();
              setFromUrlSnippet(snippet);
            }}
          />
        </div>
      </div>
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
  );
};

export default VisualizerSettingsMenu;
