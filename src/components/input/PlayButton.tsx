import { BaseIconButton } from "./IconButton";
import { useEffect, useState } from "react";
import { Player } from "../../audio";
import { Tooltip } from "../text";
import { Icon } from "../text";
import styled from "styled-components";
import * as Tone from "tone";
import { IoPauseCircleSharp, IoPlayCircleSharp } from "react-icons/io5";

interface Props {
  player: Player;
  title: string;
  onClick: (isPlaying: boolean) => void;
}

const PlayButtonIcon = styled(Icon)`
  height: 40px;
  width: 40px;
  color: var(--white);
  transition: transform var(--transition-speed) ease;

  &:hover {
    transform: scale(var(--scale-increase));
  }
`;

const PlayButton: React.FC<Props> = ({ player, title, onClick }: Props) => {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    setIsPlaying(false);
    player.onStop = () => setIsPlaying(false);
  }, [player, title]);

  return (
    <Tooltip text={isPlaying ? "pause" : "play"}>
      <BaseIconButton
        onClick={async () => {
          await Tone.start();
          setIsPlaying(!isPlaying);
          onClick(!isPlaying);
        }}
      >
        <PlayButtonIcon as={isPlaying ? IoPauseCircleSharp : IoPlayCircleSharp} />
      </BaseIconButton>
    </Tooltip>
  );
};

export default PlayButton;
