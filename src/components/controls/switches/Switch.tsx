import type { IconType } from "react-icons";
import { useState } from "react";
import { IconButton } from "../buttons";

interface Props {
  description: string;
  enabledDescription: string;
  icon: IconType;
  enabledIcon: IconType;
  onClick: (isEnabled: boolean) => void;
}

const Switch: React.FC<Props> = ({
  description,
  enabledDescription,
  icon,
  enabledIcon,
  onClick,
}: Props) => {
  const [isEnabled, setIsEnabled] = useState(false);

  return (
    <IconButton
      description={isEnabled ? enabledDescription : description}
      icon={isEnabled ? enabledIcon : icon}
      onClick={() => {
        setIsEnabled(!isEnabled);
        onClick(!isEnabled);
      }}
    />
  );
};

export default Switch;
