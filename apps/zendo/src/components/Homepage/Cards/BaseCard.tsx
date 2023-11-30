import React, { PropsWithChildren } from "react";

type Props = {
  title: string;
  caption: string;
};

const BaseCard = (props: PropsWithChildren<Props>) => {
  return (
    <div className="flex flex-col rounded-2xl  border-[0.3px] border-slate-200 bg-gradient-to-b from-white to-slate-50 shadow-sm">
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
