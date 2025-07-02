import { Par } from "./Text";

interface Props {
  disabled?: boolean;
  htmlFor?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

const Label: React.FC<Props> = ({ htmlFor, children, disabled = false, style = {} }) => {
  return (
    <label aria-disabled={disabled} htmlFor={htmlFor}>
      <Par
        style={{
          marginTop: "6px",
          marginBottom: "2px",
          color: disabled ? "var(--par-color)" : undefined,
          ...style,
        }}
      >
        {children}
      </Par>
    </label>
  );
};

export default Label;
