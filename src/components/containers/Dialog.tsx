import { DialogBackground } from "../background";
import { createPortal } from "react-dom";
import { Region } from "./Region";
import { IconButton } from "../input";
import { RiCloseCircleLine } from "react-icons/ri";
import { Header } from "../text";
import { useContext, useEffect } from "react";
import { AudioEventTriggerContext } from "../../contexts";
import type { ReactNode, Dispatch, SetStateAction } from "react";

interface Props {
  open: boolean;
  children: ReactNode;
  title?: string;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const Dialog: React.FC<Props> = ({ open, children, title = "", setOpen }) => {
  const { setApplyLowPass } = useContext(AudioEventTriggerContext);

  const handleClose = () => {
    setApplyLowPass(false);
    setOpen(false);
  };

  useEffect(() => {
    if (open) {
      setApplyLowPass(true);
    }
  }, [open]);

  if (!open) {
    return null;
  }

  return createPortal(
    <DialogBackground onClick={handleClose}>
      <Region style={{ maxWidth: "80%" }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Header>{title}</Header>
          <IconButton
            icon={RiCloseCircleLine}
            description="close"
            onClick={handleClose}
            style={{ height: "20px" }}
          />
        </div>
        <div>{children}</div>
      </Region>
    </DialogBackground>,
    document.body
  );
};

export default Dialog;
