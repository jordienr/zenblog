import React, { PropsWithChildren } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { Check, CheckCheck, Clipboard } from "lucide-react";
import useClipboard from "react-use-clipboard";

type Props = {
  children: string;
  language?: string;
  title?: string;
};

export const CodeBlock = ({
  children,
  language = "typescript",
  title,
}: Props) => {
  const [isCopied, copy] = useClipboard(children, {
    successDuration: 1000,
  });

  return (
    <div className="rounded-lg bg-slate-900 font-mono text-white">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-xs text-slate-300">{title || language}</h2>
        <button onClick={copy} className="p-2 text-slate-300">
          {isCopied ? <Check size="18" /> : <Clipboard size="18" />}
        </button>
      </div>
      <SyntaxHighlighter
        customStyle={{
          padding: "1rem",
          borderRadius: "0.5rem",
          backgroundColor: "#0f172a",
        }}
        language={language}
        style={atomOneDark}
      >
        {children}
      </SyntaxHighlighter>
    </div>
  );
};
