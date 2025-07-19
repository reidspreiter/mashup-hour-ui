import styled, { keyframes } from "styled-components";

const roll = keyframes`
  0% { background-size: 10px 3px; }
  16% { background-size: 10px 50px, 10px 3px, 10px 3px, 10px 3px, 10px 3px, 10px 3px; }
  33% { background-size: 10px 30px, 10px 50px, 10px 3px, 10px 3px, 10px 3px, 10px 3px; }
  50% { background-size: 10px 10px, 10px 30px, 10px 50px, 10px 3px, 10px 3px, 10px 3px; }
  66% { background-size: 10px 3px, 10px 10px, 10px 30px, 10px 50px, 10px 3px, 10px 3px; }
  83% { background-size: 10px 3px, 10px 3px, 10px 10px, 10px 30px, 10px 50px, 10px 3px; }
  100% { background-size: 10px 3px, 10px 3px, 10px 3px, 10px 10px, 10px 30px, 10px 50px; }
`;

const rollReverse = keyframes`
  0% { background-size: 10px 3px; }
  16% { background-size: 10px 3px, 10px 3px, 10px 3px, 10px 3px, 10px 3px, 10px 50px; }
  33% { background-size: 10px 3px, 10px 3px, 10px 3px, 10px 3px, 10px 50px, 10px 30px; }
  50% { background-size: 10px 3px, 10px 3px, 10px 3px, 10px 50px, 10px 30px, 10px 10px; }
  66% { background-size: 10px 3px, 10px 3px, 10px 50px, 10px 30px, 10px 10px, 10px 3px; }
  83% { background-size: 10px 3px, 10px 50px, 10px 30px, 10px 10px, 10px 3px, 10px 3px; }
  100% { background-size: 10px 50px, 10px 30px, 10px 10px, 10px 3px, 10px 3px, 10px 3px; }
`;

export const BarLoader = styled.div<{ $direction?: "left" | "right" }>`
  position: relative;
  width: 85px;
  height: 50px;
  background-repeat: no-repeat;
  background-image:
    linear-gradient(var(--pink) 50px, transparent 0),
    linear-gradient(var(--pink) 50px, transparent 0),
    linear-gradient(var(--pink) 50px, transparent 0),
    linear-gradient(var(--pink) 50px, transparent 0),
    linear-gradient(var(--pink) 50px, transparent 0),
    linear-gradient(var(--pink) 50px, transparent 0);
  background-position:
    0px center,
    15px center,
    30px center,
    45px center,
    60px center,
    75px center;
  animation: ${({ $direction }) => ($direction === "left" ? rollReverse : roll)} 0.8s linear
    infinite alternate;
`;
