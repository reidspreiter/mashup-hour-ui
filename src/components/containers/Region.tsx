import styled from "styled-components";

export const Region = styled.div`
  border-radius: 10px;
  padding: 10px;
  background-color: var(--bg-color-light);
  margin-bottom: 10px;
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
