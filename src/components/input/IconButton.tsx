import React from "react";
import { forwardRef } from "react";
import type { IconType } from "react-icons";
import { Tooltip } from "../text";
import styled from "styled-components";
import { Icon } from "../text";

interface Props {
  description: string;
  icon: IconType;
  onClick: () => void;
  style?: React.CSSProperties;
}

export const BaseIconButton = styled.button`
  padding: 0px;
  height: 100%;
  background: transparent;
  border: none;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const IconButton = forwardRef<HTMLButtonElement, Props>(
  ({ description, icon, onClick, style }, ref) => {
    return (
      <BaseIconButton ref={ref} onClick={() => onClick()}>
        <Tooltip text={description}>
          <Icon as={icon} style={style} />
        </Tooltip>
      </BaseIconButton>
    );
  }
);

export default IconButton;
