import { Region } from "../containers";
import { ScrollingText, Header, SubHeader, Par } from "../text";
import { IconButton } from "../input";
import { PiInfo } from "react-icons/pi";
import { useState } from "react";
import { Dialog } from "../containers";

interface Props {
  title: string;
  fullTitle: string;
  artist: string;
  albumTitle: string;
  coverUrl: string;
}

const Title: React.FC<Props> = ({ title, fullTitle, artist, albumTitle, coverUrl }: Props) => {
  const [openInfoDialog, setOpenInfoDialog] = useState(false);

  return (
    <Region>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <ScrollingText>
          <Header>{title}</Header>
        </ScrollingText>
        <div style={{ marginBottom: "auto" }}>
          <IconButton
            description="view track info"
            icon={PiInfo}
            onClick={() => setOpenInfoDialog(true)}
            style={{ marginLeft: "4px", minWidth: "15px" }}
          />
          <Dialog open={openInfoDialog} setOpen={setOpenInfoDialog}>
            <div style={{ display: "flex", gap: "40px", padding: "30px", paddingTop: "10px" }}>
              <img
                src={coverUrl}
                alt={`${albumTitle} cover image`}
                style={{ maxHeight: "300px", borderRadius: "8px" }}
              />
              <div style={{ display: "flex", flexDirection: "column" }}>
                <Par style={{ marginTop: "40px" }}>Album</Par>
                <Header>{albumTitle}</Header>
                <SubHeader>{artist}</SubHeader>
                <Par style={{ marginTop: "40px" }}>Track</Par>
                <Header>{fullTitle}</Header>
              </div>
            </div>
          </Dialog>
        </div>
      </div>
      <ScrollingText>
        <SubHeader>{artist}</SubHeader>
      </ScrollingText>
    </Region>
  );
};

export default Title;
