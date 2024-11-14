import { Editor, Range } from "@tiptap/core";
import { create } from "zustand";

type EditorState = {
  editor: Editor | null;
  setEditor: (editor: Editor) => void;
  range: Range | null;
  setRange: (range: Range) => void;
  newLinkDialogOpen: boolean;
  setNewLinkDialogOpen: (newLinkDialogOpen: boolean) => void;
  onNewLinkSubmit: (url: string) => void;
  newImageDialogOpen: boolean;
  setNewImageDialogOpen: (newImageDialogOpen: boolean) => void;
  onNewImageSubmit: (url: string) => void;
};

export const useEditorState = create<EditorState>((set) => ({
  editor: null,
  setEditor: (editor: Editor) => set({ editor }),
  range: null,
  setRange: (range: Range) => set({ range }),
  newLinkDialogOpen: false,
  setNewLinkDialogOpen: (newLinkDialogOpen: boolean) =>
    set({ newLinkDialogOpen }),
  onNewLinkSubmit: (url: string) => set({ newLinkDialogOpen: false }),
  newImageDialogOpen: false,
  setNewImageDialogOpen: (newImageDialogOpen: boolean) =>
    set({ newImageDialogOpen }),
  onNewImageSubmit: (url: string) => set({ newImageDialogOpen: false }),
}));
