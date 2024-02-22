import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "border-input bg-background placeholder:text-muted-foreground flex h-8 w-full rounded-xl border px-2 py-1.5 text-sm shadow-sm transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium hover:border-orange-300 focus-visible:border-orange-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-200 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
