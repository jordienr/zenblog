import { Extension } from "@tiptap/core";
import { Plugin } from "@tiptap/pm/state";

export const TrailingNode = Extension.create({
  name: "trailingNode",
  addProseMirrorPlugins() {
    return [
      new Plugin({
        appendTransaction: (transactions, oldState, newState) => {
          const shouldAdd =
            transactions.some((tr) => tr.docChanged) &&
            newState.doc.content.lastChild?.type.name !== "paragraph";

          if (!shouldAdd) return null;

          const { doc, tr, schema } = newState;
          if (!schema.nodes.paragraph) return null;
          return tr.insert(doc.content.size, schema.nodes.paragraph.create());
        },
      }),
    ];
  },
});
