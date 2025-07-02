import { Tooltip } from "../text";
import styled from "styled-components";

interface Props {
  description: string;
  onClick: () => void;
  style?: React.CSSProperties;
}

const StyledButton = styled.button`
  border: none;
  border-radius: 50%;
  width: 8px;
  height: 8px;
  padding: 0px;
  background-color: var(--par-color);

  &:hover {
    background-color: var(--white);
  }
`;

const SimpleButton: React.FC<Props> = ({ description, onClick, style }: Props) => {
  return (
    <Tooltip text={description}>
      <StyledButton style={style} onClick={() => onClick()} />
    </Tooltip>
  );
};

export default SimpleButton;
