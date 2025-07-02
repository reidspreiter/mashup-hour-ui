import styled from "styled-components";
import { useState, useRef, useLayoutEffect } from "react";
import { useThrotteCallback } from "../../hooks";
import { Label } from "../text";
import { Par } from "../text";

interface StepMode {
  type: "steps";
  steps: number[] | readonly number[];
}

interface RangeMode {
  type: "range";
  min: number;
  max: number;
  step: number;
}

interface Props {
  value: number;
  labelUnit?: string;
  label?: string;
  name: string;
  config: RangeMode | StepMode;
  onChange: (value: number) => void;
  throttleDelay?: number;
  disabled?: boolean;
}

const Wrapper = styled.div`
  position: relative;
  width: 100%;
`;

const SliderStyled = styled.input<{ $disabled: boolean; $percent: number }>`
  width: 100%;
  appearance: none;
  height: 4px;
  border-radius: 3px;
  background: linear-gradient(
    to right,
    ${({ $disabled }) => ($disabled ? "var(--surface-20)" : "var(--pink)")} 0%,
    ${({ $disabled }) => ($disabled ? "var(--surface-20)" : "var(--pink)")}
      ${(props) => props.$percent}%,
    var(--surface-20) ${(props) => props.$percent}%,
    var(--surface-20) 100%
  );
  outline: none;

  &::-webkit-slider-thumb {
    appearance: none;
    width: 14px;
    height: 14px;
    background: ${({ $disabled }) => ($disabled ? "var(--surface-30)" : "var(--par-color)")};
    border-radius: 50%;
    cursor: ${({ $disabled }) => ($disabled ? "default" : "pointer")};
    position: relative;
    filter: drop-shadow(0 0 1px #333);
    z-index: 4;
    margin-top: -2px;
    transition: background var(--transition-speed) ease;

    &:hover {
      background: ${({ $disabled }) => ($disabled ? "var(--surface-30)" : "var(--white)")};
    }
  }
`;

const SliderLabel = styled.div`
  position: absolute;
  top: -1.7rem;
  transform: translateX(-50%);
  background: var(--surface-20);
  padding: 0.3rem 0.5rem;
  border-radius: 4px;
  pointer-events: none;
  z-index: 999;
  text-wrap: nowrap;
`;

const Slider: React.FC<Props> = ({
  config,
  value,
  onChange,
  throttleDelay = 0,
  label,
  labelUnit,
  name,
  disabled = false,
}) => {
  const [dragging, setDragging] = useState(false);
  const [labelLeft, setLabelLeft] = useState(0);
  const trackRef = useRef<HTMLInputElement>(null);

  const handleChange =
    throttleDelay === 0
      ? (value: number) => onChange(value)
      : useThrotteCallback((value: number) => {
          onChange(value);
        }, throttleDelay);

  let min: number,
    max: number,
    index: number = 0,
    percent: number = 0;
  let handleInput: (e: React.ChangeEvent<HTMLInputElement>) => void;

  useLayoutEffect(() => {
    if (trackRef.current) {
      const { width } = trackRef.current.getBoundingClientRect();
      const thumbPxOffset = 8;
      const correctedLeft = (percent / 100) * (width - 2 * thumbPxOffset) + thumbPxOffset;
      setLabelLeft(correctedLeft);
    }
  }, [value, percent]);

  if (config.type === "steps") {
    const steps = config.steps;
    min = 0;
    max = steps.length - 1;
    index = steps.indexOf(value);
    percent = (index / max) * 100;

    handleInput = (e) => {
      const newValue = steps[parseInt(e.target.value, 10)];
      handleChange(newValue);
    };
  } else {
    const { min: rangeMin, max: rangeMax } = config;
    min = rangeMin;
    max = rangeMax;
    percent = ((value - min) / (max - min)) * 100;

    handleInput = (e) => {
      handleChange(Number(e.target.value));
    };
  }

  return (
    <>
      {label && (
        <Label disabled={disabled} htmlFor={name}>
          {label}
        </Label>
      )}
      <Wrapper>
        <SliderStyled
          ref={trackRef}
          $percent={percent}
          $disabled={disabled}
          disabled={disabled}
          onMouseDown={() => setDragging(true)}
          onMouseUp={() => setDragging(false)}
          type="range"
          id={name}
          name={name}
          min={min}
          max={max}
          step={1}
          value={config.type === "steps" ? index : value}
          onChange={handleInput}
          aria-disabled={disabled}
        />
        {dragging && (
          <SliderLabel style={{ left: `${labelLeft}px` }}>
            <Par>{`${value}${labelUnit ? ` ${labelUnit}` : ""}`}</Par>
          </SliderLabel>
        )}
      </Wrapper>
    </>
  );
};

export default Slider;
