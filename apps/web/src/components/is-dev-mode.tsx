import React, { PropsWithChildren } from "react";

export const IsDevMode = ({ children }: PropsWithChildren) => {
  const isDev = process.env.NODE_ENV === "development";

  if (!isDev) {
    return null;
  }

  return (
    <div className="w-full rounded-md border-2 border-dashed border-yellow-300 p-2">
      {children}
    </div>
  );
};
