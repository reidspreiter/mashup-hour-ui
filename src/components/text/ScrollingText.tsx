import { useRef, useState } from "react";
import styled from "styled-components";

interface Props {
  children: React.ReactNode;
}

const ScrollContainer = styled.div`
  margin: 0px;
  overflow: hidden;
  max-width: 28vw;
  white-space: nowrap;
`;

const ScrollingText: React.FC<Props> = ({ children }) => {
  const [translateTime, setTranslateTime] = useState(0);
  const [translateVal, setTranslateVal] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const transitionTimePerPixel = 0.01;

  const scrollForward = () => {
    if (containerRef.current) {
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
  };

  return (
    <ScrollContainer
      ref={containerRef}
      onMouseEnter={() => scrollForward()}
      onMouseLeave={() => scrollBackward()}
    >
      <span
        style={{
          display: "inline-block",
          transitionTimingFunction: "ease-in-out",
          transitionDuration: `${translateTime}s`,
          transform: `translateX(${translateVal}px)`,
        }}
      >
        {children}
      </span>
    </ScrollContainer>
  );
};

export default ScrollingText;
