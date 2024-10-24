import Navigation from "@/components/marketing/Navigation";
import React, { PropsWithChildren } from "react";

type Props = {};

const layout = (props: PropsWithChildren<Props>) => {
  return (
    <div className="mx-auto min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-5xl ">
        <Navigation />
        {props.children}
      </div>
    </div>
  );
};

export default layout;
