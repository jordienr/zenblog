import React, { PropsWithChildren } from "react";

type Props = {};

const Debugger = (props: PropsWithChildren<Props>) => {
  const isDev = process.env.NODE_ENV === "development";

  if (!isDev) return null;
  return <div className="border border-red-400">{props.children}</div>;
};

export default Debugger;
