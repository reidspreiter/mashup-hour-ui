import { createPortal } from "react-dom";
import styled from "styled-components";
import { useEffect, useState, useRef } from "react";

interface Props {
  open: boolean;
  anchor: React.RefObject<HTMLElement | null>;
  alignment?: "left" | "center" | "right";
  children: React.ReactNode;
}

const PopperStyled = styled.div`
  position: fixed;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
  z-index: 9999;
`;

type Position = {
  top: number;
  left: number;
};

const Popper: React.FC<Props> = ({ open, anchor, children, alignment = "right" }: Props) => {
  const popperRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<Position>({ top: -9999, left: -9999 });

  useEffect(() => {
    if (!open) {
      return;
    }

    const updatePosition = () => {
      if (anchor?.current && popperRef?.current) {
        const rect = anchor.current.getBoundingClientRect();
        const popperWidth = popperRef.current.offsetWidth ?? 0;

        setPosition({
          top: rect.bottom + 5,
          left:
            alignment === "left"
              ? rect.left
              : alignment === "right"
                ? rect.right - popperWidth
                : rect.left + rect.width / 2 - popperWidth / 2,
        });
      }
    };
    updatePosition();

    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("resize", updatePosition);
    };
  }, [open, anchor, alignment]);

  if (!open) {
    return null;
  }

  return createPortal(
    <PopperStyled ref={popperRef} style={{ top: position.top, left: position.left }}>
      {children}
    </PopperStyled>,
    document.body
  );
};

export default Popper;
