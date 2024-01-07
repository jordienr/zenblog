import {
  useEditor,
  EditorContent,
  JSONContent,
  ReactNodeViewRenderer,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import lowlight from "lowlight";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { CodeBlockComponent } from "./CodeBlockComponent";

export const ContentRenderer = ({ content }: { content: JSONContent }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      CodeBlockLowlight.extend({
        addNodeView() {
          return ReactNodeViewRenderer(CodeBlockComponent);
        },
      }).configure({ lowlight }),
    ],
    content,
    editable: false,
  });

  return (
    <>
      <EditorContent editor={editor} />
    </>
  );
};
