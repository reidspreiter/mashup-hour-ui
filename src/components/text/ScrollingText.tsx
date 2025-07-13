import { useRef, useState } from "react";
import styled from "styled-components";

interface Props {
  children: React.ReactNode;
}

const ScrollContainer = styled.div`
  margin: 0px;
  overflow: hidden;
  white-space: nowrap;
`;

const ScrollingText: React.FC<Props> = ({ children }) => {
  const [translateTime, setTranslateTime] = useState(0);
  const [translateVal, setTranslateVal] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const transitionTimePerPixel = 0.01;

  const scrollForward = () => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
    }
    if (containerRef.current) {
      setTransitioning(true);
      const boxWidth = containerRef.current.clientWidth;
      const textWidth = containerRef.current.children[0].scrollWidth;
      const translateVal = Math.min(boxWidth - textWidth, 0);
      setTranslateVal(translateVal);
      setTranslateTime(-transitionTimePerPixel * translateVal);
    }
  };

  const scrollBackward = () => {
    setTranslateTime(0.6);
    setTranslateVal(0);
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = window.setTimeout(() => {
      setTransitioning(false);
    }, 700);
  };

  return (
    <ScrollContainer
      ref={containerRef}
      onMouseEnter={() => scrollForward()}
      onMouseLeave={() => scrollBackward()}
    >
      <div
        style={{
          display: "inline-block",
          transition: transitioning ? `transform ${translateTime}s ease-in-out` : "none",
          transform: `translateX(${translateVal}px)`,
        }}
      >
        {children}
      </div>
    </ScrollContainer>
  );
};

export default ScrollingText;
