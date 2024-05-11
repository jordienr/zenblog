import { Extension } from "@tiptap/core";
import { Editor } from "@tiptap/react";
import Suggestion from "@tiptap/suggestion";

const Commands = Extension.create({
  name: "mention",

  defaultOptions: {
    suggestion: {
      char: "/",
      startOfLine: false,
      command: ({
        editor,
        range,
        props,
      }: {
        editor: Editor;
        range: Range;
        props: any;
      }) => {
        props.command({ editor, range, props });
      },
    },
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ];
  },
});

export default Commands;
