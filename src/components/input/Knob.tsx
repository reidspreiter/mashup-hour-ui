import styled from "styled-components";
import { useState, useRef, useEffect, useCallback } from "react";
import { useThrotteCallback } from "../../hooks";
import { Label } from "../text";
import { Par } from "../text";
import { objsEqual, getDecimalPlaces } from "../../util";

export interface StepMode {
  type: "steps";
  steps: number[] | readonly number[];
  default?: { value: number; steps: number[] | readonly number[] };
}

export interface RangeMode {
  type: "range";
  min: number;
  max: number;
  step: number;
  default?: { value: number; min: number; max: number };
  customValueToPercent?: (value: number, min: number, max: number) => number;
  customPercentToValue?: (percent: number, min: number, max: number) => number;
}

interface Props {
  value: number;
  labelUnit?: string;
  sensitivity?: number;
  label?: string;
  name: string;
  config: RangeMode | StepMode;
  onChange: (value: number) => void;
  onStartDrag?: () => void;
  onEndDrag?: () => void;
  throttleDelay?: number;
  disabled?: boolean;
}

const Wrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const KnobStyled = styled.svg`
  width: 40px;
  cursor: default;
`;

const Circle = styled.circle<{ $disabled: boolean; $outline: boolean }>`
  fill: ${({ $disabled }) => ($disabled ? "var(--surface-20)" : "var(--surface-30)")};
  stroke: ${({ $disabled, $outline }) =>
    $disabled ? "var(--surface-30)" : $outline ? "var(--white)" : "var(--par-color)"};
  stroke-width: 3;
`;

const KnobLabel = styled.div`
  position: absolute;
  top: -2px;
  background: var(--surface-20);
  padding: 0.3rem 0.5rem;
  border-radius: 4px;
  pointer-events: none;
  z-index: 10;
  text-wrap: nowrap;
`;

const Knob: React.FC<Props> = ({
  config,
  value,
  onChange,
  onStartDrag = () => {},
  onEndDrag = () => {},
  throttleDelay = 0,
  label,
  labelUnit,
  sensitivity = 0.01,
  name,
  disabled = false,
}) => {
  const [hovering, setHovering] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [visualizedPercent, setVisualizedPercent] = useState(0);
  const startYRef = useRef(0);
  const knobRef = useRef<SVGSVGElement | null>(null);
  const percentRef = useRef(0);
  const prevConfigRef = useRef(config);

  const setPercentFromValue = (currValue: number) => {
    let initialPercent = 0;
    if (config.type === "range") {
      initialPercent = config.customValueToPercent
        ? config.customValueToPercent(currValue, config.min, config.max)
        : (currValue - config.min) / (config.max - config.min);
    } else {
      const index = config.steps.indexOf(currValue);
      if (index === -1) {
        console.warn("Default value for knob with 'steps' configuration is not a valid step");
      } else {
        initialPercent = index / (config.steps.length - 1);
      }
    }
    percentRef.current = initialPercent;
    setVisualizedPercent(initialPercent);
    onChange(currValue);
  };

  useEffect(() => {
    setPercentFromValue(value);
  }, [value]);

  const setValueFromPercent = (newPercent: number) => {
    let newValue;
    let newVisualizedPercent = newPercent;

    if (config.type === "steps") {
      const maxIndex = config.steps.length - 1;
      const index = Math.floor(maxIndex * newPercent);
      newValue = config.steps[index];
      newVisualizedPercent = index / maxIndex;
    } else {
      const rawValue = config.customPercentToValue
        ? config.customPercentToValue(newPercent, config.min, config.max)
        : config.min + (config.max - config.min) * newPercent;
      const steppedValue = Math.round(rawValue / config.step) * config.step;
      newValue = parseFloat(steppedValue.toFixed(getDecimalPlaces(config.step)));
    }
    percentRef.current = newPercent;
    setVisualizedPercent(newVisualizedPercent);
    handleChange(newValue);
  };

  useEffect(() => {
    if (!objsEqual(config, prevConfigRef.current)) {
      setValueFromPercent(percentRef.current);
      prevConfigRef.current = config;
    }
  }, [config]);

  const setDefaultValue = () => {
    if (config.default) {
      let defaultPercent = 0;
      if (config.type === "range") {
        defaultPercent = config.customValueToPercent
          ? config.customValueToPercent(
              config.default.value,
              config.default.min,
              config.default.max
            )
          : (config.default.value - config.default.min) / (config.default.max - config.default.min);
      } else {
        const index = config.default.steps.indexOf(config.default.value);
        if (index === -1) {
          console.warn("Default value for knob with 'steps' configuration is not a valid step");
        } else {
          defaultPercent = index / (config.default.steps.length - 1);
        }
      }
      setValueFromPercent(defaultPercent);
    }
  };

  const handleChange =
    throttleDelay === 0
      ? (value: number) => onChange(value)
      : useThrotteCallback((value: number) => {
          onChange(value);
        }, throttleDelay);

  const startDrag = (e: React.MouseEvent) => {
    if (!disabled) {
      setDragging(true);
      startYRef.current = e.clientY;
      onStartDrag();
      e.preventDefault();
    }
  };

  const stopDrag = () => {
    setDragging(false);
    onEndDrag();
  };

  const onDrag = useCallback(
    (e: MouseEvent) => {
      if (dragging && knobRef.current) {
        const y = e.clientY;

        // turn right when mouse moves up
        const deltaY = -(y - startYRef.current);
        const newPercent = Math.min(Math.max(deltaY * sensitivity + percentRef.current, 0), 1);
        startYRef.current = y;
        setValueFromPercent(newPercent);
      }
    },
    [dragging, sensitivity]
  );

  useEffect(() => {
    if (dragging) {
      document.addEventListener("mousemove", onDrag);
      document.addEventListener("mouseup", stopDrag);
    }

    return () => {
      document.removeEventListener("mousemove", onDrag);
      document.removeEventListener("mouseup", stopDrag);
    };
  }, [dragging, onDrag]);

  return (
    <>
      <Wrapper>
        {label && (
          <Label disabled={disabled} htmlFor={name}>
            {label}
          </Label>
        )}
        <KnobStyled
          onMouseDown={startDrag}
          onDoubleClick={setDefaultValue}
          onMouseEnter={() => setHovering(!disabled)}
          onMouseLeave={() => setHovering(false)}
          ref={knobRef}
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <Circle cx="50" cy="50" r="45" $outline={hovering || dragging} $disabled={disabled} />
          <rect
            x="47"
            y="50"
            rx="4"
            ry="4"
            width="10"
            height="20"
            fill={disabled ? "var(--surface-30)" : "var(--pink)"}
            transform={`rotate(${-120 + 240 * visualizedPercent}, 50, 50) translate(-2, -32)`}
          />
        </KnobStyled>
        {dragging && (
          <KnobLabel>
            <Par>{`${value}${labelUnit ? ` ${labelUnit}` : ""}`}</Par>
          </KnobLabel>
        )}
      </Wrapper>
    </>
  );
};

export default Knob;
