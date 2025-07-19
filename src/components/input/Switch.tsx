import type { IconType } from "react-icons";
import { forwardRef } from "react";
import IconButton from "./IconButton";

interface Props {
  description: string;
  enabledDescription?: string;
  icon: IconType;
  enabledIcon?: IconType;
  enabledColor?: string;
  setState: (state: boolean) => void | Promise<void>;
  state: boolean;
  style?: React.CSSProperties;
}

const Switch = forwardRef<HTMLButtonElement, Props>(
  (
    {
      description,
      enabledDescription = description,
      icon,
      enabledIcon = icon,
      enabledColor = "var(--pink)",
      state,
      setState,
      style,
    },
    ref
  ) => {
    return (
      <IconButton
        ref={ref}
        description={state ? enabledDescription : description}
        icon={state ? enabledIcon : icon}
        onClick={async () => setState(!state)}
        style={state ? { ...style, color: enabledColor } : style}
      />
    );
  }
);

export default Switch;
