type Props = {
  loading?: boolean;
  variant: "primary" | "secondary" | "icon" | "red";
  children: React.ReactNode;
  onClick?: () => void;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;
export function Button(
  props: Props & React.ButtonHTMLAttributes<HTMLButtonElement>
) {
  const classMapping = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    icon: "btn-icon",
    red: "btn-red",
  };

  const className = `btn ${classMapping[props.variant]}`;

  if (props.loading) {
    return (
      <button
        disabled
        onClick={props.onClick}
        {...props}
        className={className + " cursor-wait"}
      >
        <span className="flex items-center gap-2">
          <span className="h-4 w-4 animate-spin rounded-full border-r-2 border-white" />
          {props.children}
        </span>
      </button>
    );
  }

  return (
    <button className={className} onClick={props.onClick} {...props}>
      {props.children}
    </button>
  );
}
