import { Loader } from "lucide-react";
import React, { PropsWithChildren, useEffect } from "react";

type Props = {};

export const GlobalAppLoading = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-zinc-50">
      <Loader className="animate-spin text-orange-500" size={32} />
    </div>
  );
};

const LoggedInUserChecks = (props: PropsWithChildren<Props>) => {
  // Check notifications and other user related stuff here

  return <>{props.children}</>;
};

export default LoggedInUserChecks;
