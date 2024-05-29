import { cn } from "@/lib/utils";
import Image from "next/image";
import { forwardRef } from "react";

type Props = {
  hideText?: boolean;
  size?: number;
  className?: string;
};
export default forwardRef(function ZendoLogo(props: Props) {
  return (
    <div
      className={cn(
        "flex items-center gap-1.5 text-lg font-semibold tracking-tight",
        props.className
      )}
    >
      <Image
        src="/static/logo.svg"
        width={props.size || 27}
        height={props.size || 27}
        alt="Zenblog logotype"
      />
      {!props.hideText && "zenblog"}
    </div>
  );
});
