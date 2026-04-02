"use client";

import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";

export function CustomRenderer({ html_content }: { html_content: string }) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html_content, "text/html");

  const renderElement = (element: Element, index?: number): React.ReactNode => {
    // Create a custom renderer for <pre> elements to highlight code
    if (element.tagName.toLowerCase() === "pre") {
      const code = element.querySelector("code");
      const language = code?.className.replace("language-", "") || "tsx";
      return (
        <SyntaxHighlighter language={language} style={dracula}>
          {code?.textContent || ""}
        </SyntaxHighlighter>
      );
    }

    // For other elements, create React elements
    const children = Array.from(element.childNodes).map((node, index) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        return renderElement(node as Element);
      }
      return node.textContent;
    });

    return React.createElement(
      element.tagName.toLowerCase(),
      { key: index },
      ...children
    );
  };

  return (
    <div className="mx-auto">
      {Array.from(doc.body.children).map((element, index) =>
        renderElement(element, index)
      )}
    </div>
  );
}
