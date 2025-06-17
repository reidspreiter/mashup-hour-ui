import React from "react";
import type { IconType } from "react-icons";
import { Tooltip } from "../../text";
import styled from "styled-components";
import { Icon } from "../../text";

interface Props {
  description: string;
  icon: IconType;
  onClick: () => void;
}

export const BaseIconButton = styled.button`
  height: 100%;
  background: transparent;
  border: none;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const IconButton: React.FC<Props> = ({ description, icon, onClick }: Props) => {
  return (
    <BaseIconButton onClick={() => onClick()}>
      <Tooltip text={description}>
        <Icon as={icon} />
      </Tooltip>
    </BaseIconButton>
  );
};

export default IconButton;
