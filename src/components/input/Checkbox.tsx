import styled from "styled-components";
import { useState } from "react";
import { PiCheckBold } from "react-icons/pi";
import { Label } from "../text";

interface Props {
  state: boolean;
  onChange: (state: boolean) => void;
  label?: string;
  name: string;
  disabled?: boolean;
}

const RealCheckbox = styled.input.attrs({ type: "checkbox" })`
  opacity: 0;
  position: absolute;
  pointer-events: none;
  display: hidden;
`;

const ImposterCheckbox = styled.span<{ $disabled: boolean; $hovering: boolean; $state: boolean }>`
  width: 13px;
  height: 13px;
  pointer-events: ${({ $disabled }) => ($disabled ? "none" : "auto")};
  border: 2px solid
    ${({ $hovering, $state, $disabled }) =>
      $disabled
        ? "var(--surface-30)"
        : $state
          ? "var(--pink)"
          : $hovering
            ? "var(--white)"
            : "var(--par-color)"};
  border-radius: 4px;
  margin-right: 8px;
  padding: 1px;
  background-color: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Checkbox: React.FC<Props> = ({ state, onChange, label, name, disabled = false }) => {
  const [hovering, setHovering] = useState(false);
  return (
    <div style={{ display: "flex", alignItems: "center", marginTop: "6px", marginBottom: "2px" }}>
      <RealCheckbox
        id={name}
        name={name}
        defaultChecked={state}
        disabled={disabled}
        aria-disabled={disabled}
      />
      <ImposterCheckbox
        $state={state}
        $hovering={hovering}
        $disabled={disabled}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        onClick={() => onChange(!state)}
      >
        {state && <PiCheckBold color={disabled ? "var(--surface-30)" : "var(--pink)"} />}
      </ImposterCheckbox>
      {label && (
        <Label disabled={disabled} htmlFor={name} style={{ margin: "0px" }}>
          {label}
        </Label>
      )}
    </div>
  );
};

export default Checkbox;
