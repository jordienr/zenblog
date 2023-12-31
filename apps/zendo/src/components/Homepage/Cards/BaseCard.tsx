import React, { PropsWithChildren } from "react";

type Props = {
  title: string;
  caption: string;
};

const BaseCard = (props: PropsWithChildren<Props>) => {
  return (
    <div className="flex flex-grow flex-col rounded-2xl border bg-white shadow-sm">
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
