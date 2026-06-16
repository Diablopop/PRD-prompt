import "./Button.css";

/*
  Single button component with variants and sizes (DESIGN_GUIDELINES: variants
  via props, never duplicated components). Renders a real <button>.
*/
export default function Button({
  children,
  variant = "primary", // primary | secondary | ghost
  size = "md", // sm | md | lg
  type = "button",
  ...rest
}) {
  return (
    <button
      type={type}
      className={`btn btn--${variant} btn--${size}`}
      {...rest}
    >
      {children}
    </button>
  );
}
