import { useContext, createContext } from "react";
import InputGroup from "./InputGroup";
import type { InputGroupProps } from "./InputGroup";

interface Props extends InputGroupProps {
  groupName: string;
  onChange: (value: string) => void;
  value: string;
}

interface RadioContextType {
  groupName: string;
  onChange: (value: string) => void;
  selectedValue: string;
}

const RadioContext = createContext<RadioContextType>({
  groupName: "none",
  onChange: () => {},
  selectedValue: "none",
});

const RadioGroup: React.FC<Props> = ({
  alignment,
  direction,
  groupName,
  onChange,
  value,
  children,
  label,
  disabled = false,
}) => {
  const handleChange = (value: string) => {
    onChange(value);
  };

  return (
    <InputGroup
      role="radiogroup"
      label={label}
      alignment={alignment}
      direction={direction}
      disabled={disabled}
    >
      <RadioContext.Provider value={{ groupName, onChange: handleChange, selectedValue: value }}>
        {children}
      </RadioContext.Provider>
    </InputGroup>
  );
};

export default RadioGroup;

export const useRadioGroup = () => {
  const context = useContext(RadioContext);
  if (!context) {
    throw new Error("RadioButton used outside of RadioGroup");
  }
  return context;
};
