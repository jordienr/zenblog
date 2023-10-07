import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

type Props = {
  loading?: boolean;
  variant: "primary" | "secondary" | "icon" | "red";
} & DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

export function ZenButton(props: Props) {
  const { loading = false, children, variant, onClick, ...rest } = props;

  const classMapping = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    icon: "btn-icon",
    red: "btn-red",
    loading: "cursor-wait",
  };

  const className = `btn relative ${classMapping[props.variant]} ${
    props.loading ? classMapping.loading : ""
  }`;

  return (
    <button
      onClick={onClick}
      disabled={rest.disabled || loading}
      className={className}
      {...rest}
    >
      <span className="flex items-center gap-2">
        <span
          className={`absolute inset-0 flex items-center justify-center ${
            loading ? "opacity-100" : "opacity-0"
          }`}
        >
          <span className="h-4 w-4 animate-spin rounded-full border-r-2 border-white" />
        </span>
        <span className={loading ? "opacity-0" : ""}>{children}</span>
      </span>
    </button>
  );
}
