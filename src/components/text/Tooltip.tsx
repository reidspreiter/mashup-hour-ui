import { useRef, useState, useLayoutEffect, useContext } from "react";
import { PreferencesContext } from "../../contexts";
import styled from "styled-components";

interface Props {
  children: React.ReactNode;
  text?: string;
  disabled?: boolean;
}

const TooltipWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const TooltipText = styled.div<{ $orientation: string }>`
  position: absolute;
  ${({ $orientation }) => ($orientation === "bottom" ? `top: 100%;` : `bottom: 100%;`)}
  left: 50%;
  transform: translateX(-50%);
  z-index: 0;
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
  const [orientation, setOrientation] = useState<"top" | "bottom">("top");
  const timeoutRef = useRef<number | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const { preferences } = useContext(PreferencesContext);
  const translateMargin = 24;

  const onMouseEnter = () => {
    timeoutRef.current = window.setTimeout(() => {
      setShowTooltip(true && !preferences.disableTooltips);
    }, 800);
  };

  const onMouseLeave = () => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
    }
    setShowTooltip(false);
  };

  useLayoutEffect(() => {
    if (showTooltip && tooltipRef.current && wrapperRef.current) {
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const wrapperRect = tooltipRef.current.getBoundingClientRect();

      setOrientation(
        orientation === "bottom"
          ? "bottom"
          : wrapperRect.top - tooltipRect.height < 0
            ? "bottom"
            : "top"
      );

      if (tooltipRect.left < 0) {
        tooltipRef.current.style.transform = `translateX(${tooltipRect.left + translateMargin}px)`;
      } else if (tooltipRect.right > window.innerWidth) {
        tooltipRef.current.style.transform = `translateX(calc(-50% + -${tooltipRect.right + translateMargin - window.innerWidth}px)`;
      } else {
        tooltipRef.current.style.transform = "translateX(-50%)";
      }
    }
  }, [showTooltip]);

  return (
    <TooltipWrapper
      ref={wrapperRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onMouseLeave}
    >
      {children}
      {showTooltip && !disabled && text && (
        <TooltipText ref={tooltipRef} $orientation={orientation}>
          {text}
        </TooltipText>
      )}
    </TooltipWrapper>
  );
};

export default Tooltip;
