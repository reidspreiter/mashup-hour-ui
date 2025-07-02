import type { ReactNode } from "react";
import styled from "styled-components";

interface Props {
  children: ReactNode;
  sub1?: ReactNode;
  sub2?: ReactNode;
  sub3?: ReactNode;
}

const CasingContainer = styled.div`
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 4px 0px;
  border-radius: 10px;
`;

const SubCasing = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 6px;
`;

const Casing: React.FC<Props> = ({ children, sub1, sub2, sub3 }: Props) => {
  return (
    <CasingContainer>
      <SubCasing>
        {sub1}
        {sub2}
        {sub3}
      </SubCasing>
      {children}
    </CasingContainer>
  );
};

export default Casing;
