import styled from "styled-components";
import { Par } from "../text";

export interface InputGroupProps {
  disabled?: boolean;
  children?: React.ReactNode;
  label?: string;
  role?: React.AriaRole;
  direction?: "column" | "row";
  alignment?: "left" | "center" | "right";
}

const Fieldset = styled.fieldset`
  border: 0;
  margin: 0;
  padding: 0;
  min-inline-size: 0;
  margin-top: 6px;
  padding-top: 6px;
  margin-bottom: 2px;
`;

const Legend = styled.legend`
  margin: 0;
  padding: 0;
  display: block;
  width: 100%;
`;

const InputGroupStyled = styled.div`
  display: flex;
  gap: 8px;
`;

const InputGroup: React.FC<InputGroupProps> = ({
  children,
  label,
  role,
  disabled = false,
  direction = "row",
  alignment = "left",
}) => {
  return (
    <Fieldset disabled={disabled} aria-disabled={disabled}>
      {label && (
        <Legend>
          <Par style={{ color: disabled ? "var(--par-color)" : undefined }}>{label}</Par>
        </Legend>
      )}
      <InputGroupStyled role={role} style={{ flexDirection: direction, alignItems: alignment }}>
        {children}
      </InputGroupStyled>
    </Fieldset>
  );
};

export default InputGroup;
