import styled from "styled-components";
import { Player } from "../../audio";
import { clamp } from "../../util";
import { useRef, useState, useEffect, useCallback } from "react";

const PlayBarStyled = styled.div`
  position: relative;
  width: 92%;
  height: 8px;
  border: 1px solid var(--surface-30);
  border-radius: 6px;
  margin: 10px 0px;
  cursor: pointer;
`;

const Pos = styled.div`
  position: absolute;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  cursor: pointer;
  transform: translateY(-4px) translateX(-50%);
  background-color: var(--par-color);
  transition: background var(--transition-speed) ease;

  &:hover {
    background-color: var(--white);
  }
`;

const Bound = styled.div`
  position: absolute;
  border-radius: 2px;
  height: 16px;
  width: 8px;
  cursor: pointer;
  transform: translateY(-4px) translateX(-50%);
`;

interface Props {
  isPlaying: boolean;
  player: Player;
  startBoundPercent: number;
  setStartBoundPercent: (value: number) => void;
  endBoundPercent: number;
  setEndBoundPercent: (value: number) => void;
}

type Draggable = "pos" | "start" | "end";

const PlayBar: React.FC<Props> = ({
  player,
  isPlaying,
  startBoundPercent,
  setStartBoundPercent,
  endBoundPercent,
  setEndBoundPercent,
}) => {
  const [dragging, setDragging] = useState<Draggable | null>(null);
  const [seekPercent, setSeekPercent] = useState(0);
  const internalSeekPercentRef = useRef(0);
  const [internalStartBoundPercent, setInternalStartBoundPercent] = useState(0);
  const internalStartBoundPercentRef = useRef(0);
  const [internalEndBoundPercent, setInternalEndBoundPercent] = useState(1);
  const internalEndBoundPercentRef = useRef(1);
  const animRef = useRef<number | undefined>(undefined);
  const sliderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setInternalStartBoundPercent(startBoundPercent);
    internalStartBoundPercentRef.current = startBoundPercent;
    setInternalEndBoundPercent(endBoundPercent);
    internalEndBoundPercentRef.current = endBoundPercent;
  }, []);

  const seek = useCallback(
    (e: React.MouseEvent) => {
      if (dragging === null && sliderRef.current) {
        const sliderRect = sliderRef.current.getBoundingClientRect();
        const mousePos = clamp(0, e.clientX - sliderRect.left, sliderRect.width);
        const newPerc = mousePos / sliderRect.width;
        setSeekPercent(newPerc);
        player.seekFromPercentage(newPerc);
      }
    },
    [player, dragging, setSeekPercent]
  );

  const startDrag = useCallback(
    (draggable: Draggable) => {
      setDragging(draggable);
    },
    [setDragging]
  );

  const stopDrag = useCallback(() => {
    if (dragging === "pos") {
      player.seekFromPercentage(internalSeekPercentRef.current);
    } else {
      setStartBoundPercent(internalStartBoundPercentRef.current);
      setEndBoundPercent(internalEndBoundPercentRef.current);
    }
    setDragging(null);
  }, [player, setStartBoundPercent, setEndBoundPercent, dragging]);

  const onDrag = useCallback(
    (e: MouseEvent) => {
      if (dragging && sliderRef.current) {
        const sliderRect = sliderRef.current.getBoundingClientRect();
        const mousePos = clamp(0, e.clientX - sliderRect.left, sliderRect.width);
        const newPerc = mousePos / sliderRect.width;

        switch (dragging) {
          case "pos":
            setSeekPercent(newPerc);
            internalSeekPercentRef.current = newPerc;
            break;
          case "start":
            const clampedStart = clamp(0, newPerc, endBoundPercent - 0.01);
            setInternalStartBoundPercent(clampedStart);
            internalStartBoundPercentRef.current = clampedStart;
            break;
          case "end":
            const clampedEnd = clamp(startBoundPercent + 0.01, newPerc, 1);
            setInternalEndBoundPercent(clampedEnd);
            internalEndBoundPercentRef.current = clampedEnd;
            break;
        }
      }
    },
    [dragging, endBoundPercent, startBoundPercent]
  );

  useEffect(() => {
    if (dragging) {
      document.addEventListener("mousemove", onDrag);
      document.addEventListener("mouseup", stopDrag);
    }

    return () => {
      document.removeEventListener("mousemove", onDrag);
      document.removeEventListener("mouseup", stopDrag);
    };
  }, [dragging, onDrag]);

  useEffect(() => {
    if (isPlaying && dragging !== "pos") {
      if (animRef.current) {
        cancelAnimationFrame(animRef.current);
      }
      const updatePos = () => {
        setSeekPercent(player.getPositionPercentage());
        animRef.current = requestAnimationFrame(updatePos);
      };
      updatePos();
    } else {
      if (animRef.current) {
        cancelAnimationFrame(animRef.current);
      }
    }
  }, [isPlaying, dragging]);

  return (
    <PlayBarStyled ref={sliderRef} onMouseUp={seek}>
      <Pos style={{ left: `${seekPercent * 100}%` }} onMouseDown={() => startDrag("pos")} />
      <Bound
        style={{ backgroundColor: "var(--green)", left: `${internalStartBoundPercent * 100}%` }}
        onMouseDown={() => startDrag("start")}
      />
      <Bound
        style={{ backgroundColor: "var(--red)", left: `${internalEndBoundPercent * 100}%` }}
        onMouseDown={() => startDrag("end")}
      />
    </PlayBarStyled>
  );
};

export default PlayBar;
