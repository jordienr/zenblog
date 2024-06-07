"use client";

import { highlight } from "sugar-high";

type Props = {
  content: string;
};
export const ContentRenderer = ({ content }: Props) => {
  const domParser = new DOMParser();

  const parsed = domParser.parseFromString(content, "text/html");

  const images = parsed.querySelectorAll("img");

  images.forEach((img) => {
    img.setAttribute("loading", "lazy");
    img.setAttribute("decoding", "async");
  });

  const links = parsed.querySelectorAll("a");

  links.forEach((link) => {
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
  });

  const codeBlocks = parsed.querySelectorAll("pre");

  codeBlocks.forEach((codeBlock) => {
    const text = codeBlock.textContent;
    if (!text) return;
    const highlighted = highlight(text);
    codeBlock.innerHTML = highlighted;
  });

  return (
    <div className="prose prose-img:rounded-lg prose-img:shadow-lg prose-code:reset prose-headings:font-medium prose-headings:tracking-tight prose-headings:text-xl">
      <div
        dangerouslySetInnerHTML={{
          __html: parsed.body.innerHTML,
        }}
      ></div>
    </div>
  );
};
