import styled from "styled-components";
import { useIsMobile } from "../../hooks";

export const ColumnStyled = styled.div`
  flex: 1;
  box-sizing: border-box;
  border-radius: 10px;
  padding: 4px;
  height: 100%;
  flex-direction: column;
  justify-content: space-between;
  display: flex;
`;

interface Props {
  children?: React.ReactNode;
}

const Column: React.FC<Props> = ({ children }) => {
  const isMobile = useIsMobile();
  return <ColumnStyled style={{ width: isMobile ? "100%" : "30%" }}>{children}</ColumnStyled>;
};

export default Column;
