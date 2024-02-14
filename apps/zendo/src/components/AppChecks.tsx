import { useUser } from "@supabase/auth-helpers-react";
import React, { PropsWithChildren } from "react";

type Props = {};

const AppChecks = (props: PropsWithChildren<Props>) => {
  // Global checks here

  return <>{props.children}</>;
};

export default AppChecks;
