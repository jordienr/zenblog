import { cn } from "@/lib/utils";
import Image from "next/image";
import { forwardRef } from "react";

type Props = {
  hideText?: boolean;
  size?: number;
  className?: string;
};
export function ZendoLogo(props: Props) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 text-lg font-semibold tracking-tight",
        props.className
      )}
    >
      <Image
        src="/static/logo.svg"
        width={props.size || 23}
        height={props.size || 23}
        alt="Zenblog logotype"
      />
      {!props.hideText && "Zenblog"}
    </div>
  );
}
