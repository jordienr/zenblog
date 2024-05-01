import { cn } from "@/lib/utils";
import React, { PropsWithChildren } from "react";

type Props = {
  title: string;
  caption: string;
  className?: string;
};

const BaseCard = (props: PropsWithChildren<Props>) => {
  return (
    <div
      className={cn(
        "flex flex-grow flex-col rounded-2xl border bg-white shadow-sm",
        props.className
      )}
    >
      <div className="space-y-1 px-6 py-4">
        <h2 className="text-xl font-medium">{props.title}</h2>
        <p className="text-slate-500">{props.caption}</p>
      </div>
      <div className="flex w-full flex-grow items-center justify-center overflow-hidden">
        {props.children}
      </div>
    </div>
  );
};

export default BaseCard;
