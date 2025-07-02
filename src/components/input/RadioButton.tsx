import { useRadioGroup } from "./RadioGroup";
import { Label } from "../text";
import styled from "styled-components";

interface Props {
  label?: string;
  name: string;
  disabled?: boolean;
  value: string;
  children?: React.ReactNode;
}

const RealRadioButton = styled.input.attrs({ type: "radio" })`
  opacity: 0;
  position: absolute;
  pointer-events: none;
  display: hidden;
`;

const ImposterRadioButton = styled.span<{ $checked: boolean; $disabled: boolean }>`
  display: inline-block;
  pointer-events: ${({ $disabled }) => ($disabled ? "none" : "auto")};
  position: relative;
  height: 12px;
  width: 12px;
  transition:
    background,
    border-color var(--transition-speed);
  border: 2px solid ${({ $checked }) => ($checked ? "var(--pink)" : "var(--par-color)")};
  border-radius: 50%;
  cursor: ${({ $disabled }) => ($disabled ? "default" : "pointer")};
  margin-right: 8px;

  &::after {
    content: "";
    display: ${({ $checked }) => ($checked ? "block" : "none")};
    width: 6px;
    height: 6px;
    background: var(--pink);
    border-radius: 50%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  &:hover {
    border-color: ${({ $checked }) => ($checked ? "var(--pink)" : "var(--white)")};
  }
`;

const RadioButton: React.FC<Props> = ({ label, name, value, children, disabled = false }) => {
  const { selectedValue, onChange } = useRadioGroup();
  const isChecked = selectedValue === value;

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", marginTop: "6px", marginBottom: "2px" }}>
        <RealRadioButton
          aria-disabled={disabled}
          disabled={disabled}
          type="radio"
          name={name}
          id={name}
          value={value}
          checked={isChecked}
          onChange={() => {}}
        />
        <ImposterRadioButton
          $checked={isChecked}
          $disabled={disabled}
          onClick={() => onChange(value)}
        />
        {label && (
          <Label disabled={disabled} htmlFor={name} style={{ margin: "0px" }}>
            {label}
          </Label>
        )}
      </div>
      {children && <div style={{ marginLeft: "20px", marginTop: "4px" }}>{children}</div>}
    </>
  );
};

export default RadioButton;
