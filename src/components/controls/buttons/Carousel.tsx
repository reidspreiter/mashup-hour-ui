import styled from "styled-components";
import SimpleButton from "./SimpleButton";

interface Props {
  descriptions: string[];
  carouselIndex: number;
  setCarouselIndex: React.Dispatch<React.SetStateAction<number>>;
}

const Container = styled.div`
  display: flex;
  gap: 8px;
`;

const Carousel: React.FC<Props> = ({ descriptions, carouselIndex, setCarouselIndex }: Props) => {
  return (
    <Container>
      {descriptions.map((description, i) => {
        const enabled = i === carouselIndex;
        return (
          <SimpleButton
            style={enabled ? { backgroundColor: "var(--white)" } : undefined}
            key={i}
            description={description}
            onClick={
              enabled
                ? () => {}
                : () => {
                    setCarouselIndex(i);
                  }
            }
          />
        );
      })}
    </Container>
  );
};

export default Carousel;
