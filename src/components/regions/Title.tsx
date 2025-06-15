import { Region } from "../containers";
import { ScrollingText, Header, SubHeader } from "../text";

interface Props {
  title: string;
  fullTitle: string;
  artist: string;
  albumTitle: string;
  coverUrl: string;
}

const Title: React.FC<Props> = ({ title, fullTitle, artist, albumTitle, coverUrl }: Props) => {
  return (
    <Region>
      <ScrollingText>
        <Header>{title}</Header>
      </ScrollingText>
      <ScrollingText>
        <SubHeader>{artist}</SubHeader>
      </ScrollingText>
    </Region>
  );
};

export default Title;
