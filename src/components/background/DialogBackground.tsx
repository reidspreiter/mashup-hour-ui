import { BackgroundDiv } from "./containers";

interface Props {
  children: React.ReactNode;
  onClick?: () => void;
}

const DialogBackground: React.FC<Props> = ({ children, onClick = () => {} }) => {
  return (
    <BackgroundDiv
      style={{
        zIndex: 100,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        pointerEvents: "inherit",
      }}
      onClick={onClick}
    >
      {children}
    </BackgroundDiv>
  );
};

export default DialogBackground;
