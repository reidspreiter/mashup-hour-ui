import styled from "styled-components";
import { Label } from "../text";
import { useThrotteCallback } from "../../hooks";

interface Props {
  value?: string;
  throttleDelay?: number;
  disabled?: boolean;
  name: string;
  label?: string;
  onChange: (value: string) => void;
}

const ColorStyled = styled.input<{ $disabled: boolean }>`
  appearance: none;
  -webkit-appearance: none;
  border: 2px solid ${({ $disabled }) => ($disabled ? "var(--surface-30)" : "var(--par-color)")};
  width: 38px;
  height: 18px;
  border-radius: 4px;
  overflow: hidden;
  cursor: ${({ $disabled }) => ($disabled ? "default" : "pointer")};
  padding: 0;
  transition: border-color var(--transition-speed);
  background-color: transparent;

  &:hover {
    border-color: ${({ $disabled }) => ($disabled ? "var(--surface-30)" : "var(--white)")};
  }

  &::-webkit-color-swatch-wrapper {
    padding: 0;
  }

  &::-webkit-color-swatch {
    border: none;
  }
`;

const Color: React.FC<Props> = ({
  name,
  label,
  disabled = false,
  onChange,
  value,
  throttleDelay = 0,
}) => {
  const handleChange =
    throttleDelay === 0
      ? (value: string) => onChange(value)
      : useThrotteCallback((value: string) => {
          onChange(value);
        }, throttleDelay);

  return (
    <>
      {label && (
        <Label disabled={disabled} htmlFor={name}>
          {label}
        </Label>
      )}
      <ColorStyled
        aria-disabled={disabled}
        $disabled={disabled}
        disabled={disabled}
        id={name}
        name={name}
        value={value}
        type="color"
        onChange={(e) => handleChange(e.target.value)}
      />
    </>
  );
};

export default Color;
