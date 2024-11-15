import { Editor, Range } from "@tiptap/core";
import { create } from "zustand";

export type EditorStore = {
  editor: Editor | null;
  setEditor: (editor: Editor) => void;
  range: Range | null;
  setRange: (range: Range) => void;
  linkDialogOpen: boolean;
  setLinkDialogOpen: (linkDialogOpen: boolean) => void;
};

export const useEditorState = create<EditorStore>((set) => ({
  editor: null,
  setEditor: (editor: Editor) => set({ editor }),
  range: null,
  setRange: (range: Range) => set({ range }),
  linkDialogOpen: false,
  setLinkDialogOpen: (linkDialogOpen: boolean) => set({ linkDialogOpen }),
}));
