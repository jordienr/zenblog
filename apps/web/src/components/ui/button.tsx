import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";
import { Loader2 } from "lucide-react";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold ring-offset-white transition-colors  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:opacity-90 focus-visible  disabled:opacity-70 dark:ring-offset-slate-950 ring-1 ring-transparent antialiased dark:focus-visible:ring-slate-300 gap-1.5 [&>svg]:w-4 leading-none [&>svg]:opacity-60 active:scale-95 border border-transparent hover:scale-[103%] transition-transform",
  {
    variants: {
      variant: {
        default:
          "border-slate-500/20 border-b-slate-800/70 border-t-slate-500/70 bg-slate-800 text-white shadow-md ring-slate-800 flex items-center hover:brightness-125",
        destructive:
          "border-red-400/20 border-b-red-700/70 border-t-red-400/70 bg-gradient-to-b from-red-500 to-red-500 text-white shadow-md ring-red-600 flex items-center hover:brightness-110",

        outline:
          "border-transparent ring-slate-200 bg-white text-slate-700 hover:text-slate-900 shadow-sm",
        secondary:
          "bg-slate-100 hover:bg-slate-100/70 text-slate-700 hover:text-slate-800",
        ghost: "hover:text-slate-900 text-slate-600",
        link: "text-slate-800 underline-offset-4 hover:underline dark:text-slate-50",
        white: "bg-white text-slate-900 hover:text-slate-900",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-[30px] px-3 text-xs",
        xs: "h-6 px-3 text-xs",
        lg: "h-11 px-8",
        icon: "h-8 w-8 text-slate-500 dark:text-slate-50 [&>svg]:w-[18px]",
        "icon-xs": "h-7 w-7 [&>svg]:w-[14px] text-slate-500",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "sm",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  tooltip?: {
    delay?: number;
    content: string;
    side?: "top" | "bottom" | "left" | "right";
  };
  isLoading?: boolean;
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { tooltip, isLoading, className, variant, size, asChild = false, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    if (tooltip) {
      return (
        <TooltipProvider>
          <Tooltip delayDuration={tooltip.delay || 0}>
            <TooltipTrigger asChild>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin cursor-not-allowed" />
              ) : (
                <Comp
                  disabled={isLoading || props.disabled}
                  className={cn(buttonVariants({ variant, size, className }))}
                  ref={ref}
                  {...props}
                />
              )}
            </TooltipTrigger>
            <TooltipContent side={tooltip.side}>
              {tooltip.content}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return (
      <Comp
        disabled={isLoading || props.disabled}
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
