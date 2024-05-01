import { Check, Clipboard } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";

type Props = {
  text: string;
};

export const CopyCell = (props: Props) => {
  const [isCopied, setIsCopied] = React.useState(false);

  return (
    <div className="flex items-center justify-between rounded-md border bg-zinc-100 px-2 py-1 font-mono text-sm text-zinc-600">
      <div className="truncate px-2">{props.text}</div>
      <Button
        onClick={() => {
          navigator.clipboard.writeText(props.text);
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000);
        }}
        size="sm"
        variant="ghost"
      >
        {isCopied ? <Check size={16} /> : <Clipboard size={16} />}
        {isCopied ? "Copied" : "Copy"}
      </Button>
    </div>
  );
};
