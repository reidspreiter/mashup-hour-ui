import styled, { css } from "styled-components";

const backgroundStyles = css`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -5;
  pointer-events: none;
`;

export const BackgroundDiv = styled.div`
  ${backgroundStyles}
`;

export const BackgroundCanvas = styled.canvas`
  ${backgroundStyles}
`;
