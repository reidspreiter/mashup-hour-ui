import styled from "styled-components";
import { Label, Par } from "../text";
import { useState, useRef, useEffect } from "react";
import { PiCaretDown } from "react-icons/pi";
import { GoDash } from "react-icons/go";

interface Props {
  disabled?: boolean;
  name: string;
  options: ReadonlyArray<string> | string[];
  value: string;
  labels?: string[];
  label?: string;
  onChange: (value: string) => void;
}

const SelectContainer = styled.div`
  position: relative;
`;

const SelectStyled = styled.div<{ $disabled: boolean; $open: boolean }>`
  padding: 4px;
  border: 1px solid
    ${({ $disabled, $open }) =>
      $disabled ? "var(--surface-30)" : $open ? "var(--white)" : "var(--par-color)"};
  background: var(--surface-20);
  cursor: ${({ $disabled }) => ($disabled ? "default" : "pointer")};
  border-radius: 4px;

  &:hover {
    border-color: ${({ $disabled }) => ($disabled ? "var(--surface-30)" : "var(--white)")};
  }
`;

const OptionsList = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin: 0;
  padding: 0;
  list-style: none;
  border: 1px solid var(--par-color);
  background: var(--surface-20);
  max-height: 200px;
  overflow-y: auto;
  border-radius: 4px;
  z-index: 999;
`;

const OptionItem = styled.li<{ $selected: boolean }>`
  padding: 4px;
  background: ${({ $selected }) => ($selected ? "var(--pink)" : "var(--surface-20)")};
  cursor: pointer;

  &:hover {
    background: ${({ $selected }) => ($selected ? "var(--pink)" : "var(--surface-30)")};
  }
`;

const Select: React.FC<Props> = ({
  name,
  options,
  value,
  labels,
  label,
  onChange,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSelect = (val: string) => {
    setIsOpen(false);
    onChange(val);
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLabel = labels ? labels[options.indexOf(value)] : value;

  return (
    <>
      {label && (
        <Label disabled={disabled} htmlFor={name}>
          {label}
        </Label>
      )}
      <SelectContainer ref={containerRef}>
        <SelectStyled
          $open={isOpen}
          $disabled={disabled}
          aria-disabled={disabled}
          onClick={() => {
            if (!disabled) {
              setIsOpen((prev) => !prev);
            }
          }}
        >
          <div
            style={{
              display: "flex",
              padding: 0,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Par
              style={{
                color: disabled ? "var(--par-color)" : "var(--white)",
                whiteSpace: "nowrap",
              }}
            >
              {selectedLabel}
            </Par>
            {disabled ? (
              <GoDash style={{ color: disabled ? "var(--par-color)" : "var(--white)" }} />
            ) : (
              <PiCaretDown style={{ color: disabled ? "var(--par-color)" : "var(--white)" }} />
            )}
          </div>
        </SelectStyled>
        {isOpen && (
          <OptionsList>
            {options.map((option) => (
              <OptionItem
                key={option}
                $selected={option === value}
                onClick={() => handleSelect(option)}
              >
                <Par>{option}</Par>
              </OptionItem>
            ))}
          </OptionsList>
        )}
      </SelectContainer>
    </>
  );
};

export default Select;
