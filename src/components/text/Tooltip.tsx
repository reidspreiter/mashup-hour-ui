import { useRef, useState } from "react";
import styled from "styled-components";

interface Props {
  children: React.ReactNode;
  text: string;
  disabled?: boolean;
}

const TooltipWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const TooltipText = styled.div`
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--bg-color);
  color: var(--white);
  border-radius: 4px;
  padding: 4px;
  opacity: 0;
  visibility: hidden;
  transition:
    opacity var(--transition-speed) ease,
    visibility var(--transition-speed) ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  white-space: nowrap;
  pointer-events: none;
  margin: 0px;

  ${TooltipWrapper}:hover & {
    opacity: 1;
    visibility: visible;
    transition-delay: 0.8s;
  }
`;

const Tooltip: React.FC<Props> = ({ children, text, disabled = false }: Props) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const onMouseEnter = () => {
    timeoutRef.current = window.setTimeout(() => {
      setShowTooltip(true);
    }, 800);
  };

  const onMouseLeave = () => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
    }
    setShowTooltip(false);
  };

  return (
    <TooltipWrapper onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onClick={onMouseLeave}>
      {children}
      {showTooltip && !disabled && <TooltipText>{text}</TooltipText>}
    </TooltipWrapper>
  );
};

export default Tooltip;
