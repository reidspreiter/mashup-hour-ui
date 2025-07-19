import styled from "styled-components";
import type { Dispatch, SetStateAction } from "react";
import { useContext, useState, useRef } from "react";
import { AudioEventTriggerContext, PreferencesContext } from "../../contexts";
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
  PiSpeakerSimpleSlash,
  PiSpeakerSimpleHigh,
} from "react-icons/pi";
import { openLinkInNewTab } from "../../util";

interface Props {
  hideMashupControls: boolean;
  setHideMashupControls: Dispatch<SetStateAction<boolean>>;
}

const NavBarStyled = styled.div`
  width: 100%;
  min-height: 50px;
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

const NavBar: React.FC<Props> = ({ hideMashupControls, setHideMashupControls }) => {
  const { preferences, setPreferences } = useContext(PreferencesContext);
  const { applyMute, setApplyMute } = useContext(AudioEventTriggerContext);
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
          description="mute audio"
          icon={PiSpeakerSimpleHigh}
          enabledIcon={PiSpeakerSimpleSlash}
          state={applyMute}
          setState={setApplyMute}
        />
        <Switch
          description="hide tooltips"
          icon={PiChatCenteredDots}
          enabledIcon={PiChatCentered}
          state={preferences.disableTooltips}
          setState={(isEnabled) => {
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
          state={hideMashupControls}
          setState={setHideMashupControls}
        />
        <Switch
          ref={visualizerCustomizationButtonRef}
          description="customize visualizer"
          icon={PiWaveform}
          state={showVisualizerCustomization}
          setState={setShowVisualizerCustomization}
        />
      </div>
      <Popper open={showVisualizerCustomization} anchor={visualizerCustomizationButtonRef}>
        <VisualizerSettingsMenu />
      </Popper>
    </NavBarStyled>
  );
};

export default NavBar;
