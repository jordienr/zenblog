import Heading from "@tiptap/extension-heading";
import { EditorContent, useEditor, Content } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export function ContentRenderer({ content }: { content: Content }) {
    const editor = useEditor({
        extensions: [StarterKit, Heading.configure({ levels: [2, 3, 4, 5, 6] })],
        content: content,
        editable: false,
    });
    
    return (
        <div className="prose prose-sm">
        <EditorContent editor={editor} />
        </div>
    );
}
