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
  justify-content: flex-end;
  border-radius: 10px;
`;

const SubCasing = styled.div`
  width: 100%;
  min-height: 25px;
  display: flex;
  gap: 4px;
  justify-content: center;
  align-items: center;
`;

const Casing: React.FC<Props> = ({ children, sub1, sub2, sub3 }: Props) => {
  return (
    <CasingContainer>
      {children}
      <SubCasing>
        {sub1}
        {sub2}
        {sub3}
      </SubCasing>
    </CasingContainer>
  );
};

export default Casing;
