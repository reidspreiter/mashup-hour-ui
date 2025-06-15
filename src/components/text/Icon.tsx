import styled from "styled-components";

export const Icon = styled.div`
  height: 80%;
  width: 80%;
  cursor: pointer;
  transition: color var(--transition-speed) ease;
  color: var(--par-color);

  &:hover {
    color: var(--white);
  }
`;
