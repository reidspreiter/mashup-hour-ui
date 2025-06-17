import { SimpleButton } from "../buttons";
import { useState } from "react";

interface Props {
  description: string;
  onClick: (isEnabled: boolean) => void | boolean;
  enabledDescription?: string;
}

const SimpleSwitch: React.FC<Props> = ({ description, enabledDescription, onClick }: Props) => {
  const [isEnabled, setIsEnabled] = useState(false);
  enabledDescription = enabledDescription ?? description;

  return (
    <SimpleButton
      style={isEnabled ? { backgroundColor: "var(--white)" } : undefined}
      description={isEnabled ? enabledDescription : description}
      onClick={() => {
        const result = onClick(!isEnabled);
        if (result) {
          setIsEnabled(!isEnabled);
        }
      }}
    />
  );
};

export default SimpleSwitch;
