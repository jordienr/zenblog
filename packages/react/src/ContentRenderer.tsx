"use client";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React from "react";
import Image from "@tiptap/extension-image";

type Props = {
  content: any;
};

const extensions = [StarterKit, Image];
const ContentRenderer = ({ content }: Props) => {
  const editor = useEditor({
    extensions,
    content,
    editable: false,
  });
  return <EditorContent editor={editor}></EditorContent>;
};

export default ContentRenderer;
