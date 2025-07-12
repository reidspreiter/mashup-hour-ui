import styled from "styled-components";
import type { Dispatch, SetStateAction } from "react";
import { useContext, useState, useRef } from "react";
import { PreferencesContext } from "../../contexts";
import { Popper } from "../containers";
import VisualizerSettingsMenu from "./VisualizerSettingsMenu";
import { Switch, IconButton } from "../input";
import {
  PiChatCenteredDots,
  PiChatCentered,
  PiWaveform,
  PiEye,
  PiEyeClosed,
  PiCodeSimple,
  PiBug,
  PiLightbulbFilament,
} from "react-icons/pi";
import { openLinkInNewTab } from "../../util";

interface Props {
  setHideMashupControls: Dispatch<SetStateAction<boolean>>;
}

const NavBarStyled = styled.div`
  width: 100%;
  height: 55px;
  background-color: transparent;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  z-index: 5;
  position: relative;
  box-sizing: border-box;
  margin: 0px;
`;

const NavBar: React.FC<Props> = ({ setHideMashupControls }) => {
  const { preferences, setPreferences } = useContext(PreferencesContext);
  const [showVisualizerCustomization, setShowVisualizerCustomization] = useState(false);
  const visualizerCustomizationButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <NavBarStyled>
      <div style={{ display: "flex", margin: "0px", padding: "0px", height: "100%", gap: "4px" }}>
        <IconButton
          description="visit GitHub repo"
          icon={PiCodeSimple}
          onClick={() => openLinkInNewTab("https://github.com/reidspreiter/mashup-hour-ui")}
        />
        <IconButton
          description="report a bug"
          icon={PiBug}
          onClick={() =>
            openLinkInNewTab(
              "https://github.com/reidspreiter/mashup-hour-ui/issues/new?template=bug_report.md"
            )
          }
        />
        <IconButton
          description="request a feature"
          icon={PiLightbulbFilament}
          onClick={() =>
            openLinkInNewTab(
              "https://github.com/reidspreiter/mashup-hour-ui/issues/new?template=feature_request.md"
            )
          }
        />
      </div>
      <div style={{ display: "flex", margin: "0px", padding: "0px", height: "100%", gap: "4px" }}>
        <Switch
          description="hide tooltips"
          icon={PiChatCenteredDots}
          enabledIcon={PiChatCentered}
          startEnabled={preferences.disableTooltips}
          onClick={(isEnabled) => {
            setPreferences((prev) => ({
              ...prev,
              disableTooltips: isEnabled,
            }));
          }}
        />
        <Switch
          description="hide mashup controls"
          icon={PiEye}
          enabledIcon={PiEyeClosed}
          startEnabled={false}
          onClick={setHideMashupControls}
        />
        <Switch
          ref={visualizerCustomizationButtonRef}
          description="customize visualizer"
          icon={PiWaveform}
          onClick={(isEnabled) => setShowVisualizerCustomization(isEnabled)}
        />
      </div>
      <Popper open={showVisualizerCustomization} anchor={visualizerCustomizationButtonRef}>
        <VisualizerSettingsMenu />
      </Popper>
    </NavBarStyled>
  );
};

export default NavBar;
