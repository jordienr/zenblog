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
    <div className="rounded-lg bg-black font-mono text-white">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-xs">{title || language}</h2>
        <button onClick={copy} className="p-2">
          {isCopied ? <Check size="20" /> : <Clipboard size="20" />}
        </button>
      </div>
      <SyntaxHighlighter
        customStyle={{
          padding: "1rem",
          fontSize: "0.9rem",
          borderRadius: "0.5rem",
          backgroundColor: "#1e1e1e",
        }}
        language={language}
        style={atomOneDark}
      >
        {children}
      </SyntaxHighlighter>
    </div>
  );
};
