import { JSONContent, useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

const extensions = [StarterKit];

type Props = {
  content: JSONContent;
};

export const ZenblogRenderer = (props: Props) => {
  const editor = useEditor({
    extensions,
    content: props.content,
    editable: false,
  });

  return <EditorContent editor={editor} />;
};
