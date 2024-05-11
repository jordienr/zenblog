import { Editor, Range } from "@tiptap/react";

type CommandParams = {
  editor: Editor;
  range: Range;
};
const getSuggestionItems = (query: string = "") => {
  return [
    {
      title: "H1",
      command: ({ editor, range }: CommandParams) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setNode("heading", { level: 1 })
          .run();
      },
    },
    {
      title: "H2",
      command: ({ editor, range }: CommandParams) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setNode("heading", { level: 2 })
          .run();
      },
    },
    {
      title: "bold",
      command: ({ editor, range }: CommandParams) => {
        editor.chain().focus().deleteRange(range).setMark("bold").run();
      },
    },
    {
      title: "italic",
      command: ({ editor, range }: CommandParams) => {
        editor.chain().focus().deleteRange(range).setMark("italic").run();
      },
    },
    {
      title: "image",
      command: ({ editor, range }: CommandParams) => {
        console.log("call some function from parent");
        editor.chain().focus().deleteRange(range).setNode("paragraph").run();
      },
    },
  ]
    .filter((item) => item.title.toLowerCase().startsWith(""))
    .slice(0, 10);
};

export default getSuggestionItems;
