import React, { PropsWithChildren } from "react";

export const IsDevMode = ({ children }: PropsWithChildren) => {
  const isDev = process.env.NODE_ENV === "development";

  if (!isDev) {
    return null;
  }

  return (
    <div className="rounded-md border-2 border-dashed border-yellow-300 p-2">
      <span className="text-xs font-medium text-yellow-600">
        Development Tip:
      </span>
      {children}
    </div>
  );
};
