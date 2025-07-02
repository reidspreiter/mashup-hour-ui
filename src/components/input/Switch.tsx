import type { IconType } from "react-icons";
import { useState } from "react";
import { forwardRef } from "react";
import IconButton from "./IconButton";

interface Props {
  description: string;
  enabledDescription?: string;
  icon: IconType;
  enabledIcon?: IconType;
  enabledColor?: string;
  onClick: (isEnabled: boolean) => void;
  startEnabled?: boolean;
}

const Switch = forwardRef<HTMLButtonElement, Props>(
  (
    {
      description,
      enabledDescription = description,
      icon,
      enabledIcon = icon,
      enabledColor = "var(--pink)",
      onClick,
      startEnabled = false,
    },
    ref
  ) => {
    const [isEnabled, setIsEnabled] = useState(startEnabled);

    return (
      <IconButton
        ref={ref}
        description={isEnabled ? enabledDescription : description}
        icon={isEnabled ? enabledIcon : icon}
        onClick={() => {
          setIsEnabled(!isEnabled);
          onClick(!isEnabled);
        }}
        style={isEnabled ? { color: enabledColor } : undefined}
      />
    );
  }
);

export default Switch;
