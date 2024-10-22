"use client";

import React, { useState } from "react";
import { Check, Copy } from "lucide-react";

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

  const lines = children.split("\n");

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
        <pre className="rounded-none bg-transparent p-0 text-white">
          <code className={`language-${language} block`}>
            {lines.map((line, index) => (
              <span
                key={index}
                className={`block rounded-none border-l-4 border-transparent ${
                  highlightedLines.includes(index + 1)
                    ? "border-green-500 bg-green-500/10 text-green-300"
                    : ""
                }`}
              >
                <span className="inline-block w-8 select-none pr-2 text-right text-slate-400">
                  {language === "bash" ? "$" : index + 1}
                </span>
                <span className="pl-2">{line}</span>
              </span>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}
