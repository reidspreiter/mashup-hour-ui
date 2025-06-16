import styled, { keyframes } from "styled-components";
import { Background } from "./Background";

interface Props {
  leftUrl: string;
  rightUrl: string;
}

const scrollDown = keyframes`
	0% {
    transform: translateY(0%);
  }
  100% {
    transform: translateY(-50%);
  }
`;

const Wrapper = styled(Background)`
  z-index: -5;
  display: flex;
  height: 200vh;
  animation: ${scrollDown} 60s linear infinite;
`;

const Image = styled.div<{ $url: string }>`
  width: 50vw;
  height: 100%;
  background-image: url(${(props) => props.$url});
  background-size: cover;
  background-repeat: repeat-y;
`;

const ImageContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const ImageGradient: React.FC<Props> = ({ leftUrl, rightUrl }: Props) => {
  return (
    <Wrapper>
      <ImageContainer>
        <Image $url={leftUrl} />
        <Image $url={leftUrl} />
      </ImageContainer>
      <ImageContainer>
        <Image $url={rightUrl} />
        <Image $url={rightUrl} />
      </ImageContainer>
    </Wrapper>
  );
};

export default ImageGradient;
