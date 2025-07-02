import styled from "styled-components";

export const Region = styled.div`
  border-radius: 10px;
  padding: 10px;
  background-color: var(--surface-10);
  backdrop-filter: blur(2px);
  margin-bottom: 10px;
  box-shadow: 0px 0px 15px 5px rgba(0, 0, 0, 0.5);
`;

export const VerticalRegion = styled(Region)`
  flex-direction: column;
`;

export const CenteredRegion = styled(Region)`
  display: flex;
  justify-content: center;
  flex-grow: 0;
  & > * {
    flex: 1;
    margin: 0px 2px 2px;
    justify-content: center;
  }
`;
