"use client";

import React, { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Prism as ReactSyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";

interface CodeBlockProps {
  language: string;
  filename?: string;
  highlightedLines?: number[];
  children: string;
}

export function CodeBlockComponent({
  language,
  filename,
  highlightedLines = [],
  children,
}: CodeBlockProps) {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(children);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const languagesWithoutLineNumbers = ["bash", "sh"];

  const showLineNumbers = !languagesWithoutLineNumbers.includes(language);

  return (
    <div className="relative rounded-lg border border-slate-700 bg-slate-800">
      {filename && (
        <div className="flex items-center justify-between border-b border-slate-700 px-4 py-2">
          <span className="text-sm font-medium text-slate-100">{filename}</span>
          <button
            onClick={copyToClipboard}
            className="text-slate-300 hover:text-slate-50"
          >
            {isCopied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            <span className="sr-only">Copy code</span>
          </button>
        </div>
      )}
      <div className="overflow-x-auto">
        <ReactSyntaxHighlighter
          language={language}
          showLineNumbers
          wrapLines
          codeTagProps={{
            style: {
              display: "block",
            },
          }}
          lineNumberStyle={{
            paddingRight: "0.5rem",
            opacity: showLineNumbers ? 1 : 0,
          }}
          lineProps={(lineNumber) => ({
            style: {
              display: "block",
              width: "100%",
              backgroundColor: highlightedLines.includes(lineNumber)
                ? "#4ade8030"
                : "transparent",
              borderLeft: highlightedLines.includes(lineNumber)
                ? "4px solid #4ade80"
                : "4px solid transparent",
            },
          })}
          style={dracula}
          customStyle={{
            backgroundColor: "transparent",
            padding: "1rem 0",
          }}
        >
          {children}
        </ReactSyntaxHighlighter>
      </div>
    </div>
  );
}
