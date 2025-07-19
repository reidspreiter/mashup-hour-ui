import type { IconType } from "react-icons";
import { forwardRef } from "react";
import type { Dispatch, SetStateAction } from "react";
import { BaseIconButton } from "./IconButton";
import { Tooltip, Icon } from "../text";

interface Props {
  description: string;
  enabledDescription?: string;
  icon: IconType;
  enabledIcon?: IconType;
  enabledColor?: string;
  setState: Dispatch<SetStateAction<boolean>>;
  state: boolean;
}

const HoldSwitch = forwardRef<HTMLButtonElement, Props>(
  (
    {
      description,
      enabledDescription = description,
      icon,
      enabledIcon = icon,
      enabledColor = "var(--pink)",
      state,
      setState,
    },
    ref
  ) => {
    return (
      <BaseIconButton ref={ref}>
        <Tooltip text={state ? enabledDescription : description}>
          <Icon
            as={state ? enabledIcon : icon}
            style={state ? { color: enabledColor } : undefined}
            onMouseDown={() => setState(true)}
            onMouseUp={() => setState(false)}
          />
        </Tooltip>
      </BaseIconButton>
    );
  }
);

export default HoldSwitch;
