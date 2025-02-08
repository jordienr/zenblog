import { type EditorState, Plugin, PluginKey } from "@tiptap/pm/state";
import { Decoration, DecorationSet, type EditorView } from "@tiptap/pm/view";

const uploadKey = new PluginKey("upload-image");

export const UploadImagesPlugin = ({ imageClass }: { imageClass: string }) =>
  new Plugin({
    key: uploadKey,
    state: {
      init() {
        return DecorationSet.empty;
      },
      apply(tr, set) {
        set = set.map(tr.mapping, tr.doc);
        // See if the transaction adds or removes any placeholders
        const action = tr.getMeta(uploadKey);

        if (action?.add) {
          const { id, pos, src } = action.add;

          const placeholder = document.createElement("div");
          placeholder.setAttribute("class", "img-placeholder");
          const image = document.createElement("img");
          image.setAttribute("class", imageClass);
          image.src = src;
          placeholder.appendChild(image);
          const deco = Decoration.widget(pos + 1, placeholder, {
            id,
          });
          set = set.add(tr.doc, [deco]);
        } else if (action?.remove) {
          // biome-ignore lint/suspicious/noDoubleEquals: <explanation>
          set = set.remove(
            set.find(
              undefined,
              undefined,
              (spec) => spec.id == action.remove.id
            )
          );
        }
        return set;
      },
    },
    props: {
      decorations(state) {
        return this.getState(state);
      },
    },
  });

// biome-ignore lint/complexity/noBannedTypes: <explanation>
function findPlaceholder(state: EditorState, id: {}) {
  const decos = uploadKey.getState(state) as DecorationSet;
  // biome-ignore lint/suspicious/noDoubleEquals: <explanation>
  const found = decos.find(undefined, undefined, (spec) => spec.id == id);
  console.log("found", found);
  return found.length ? found[0]?.from : null;
}

export interface ImageUploadOptions {
  validateFn?: (file: File) => void;
  onUpload: (file: File, blogId: string) => Promise<string>;
}

export const createImageUpload =
  ({ validateFn, onUpload }: ImageUploadOptions): UploadFn =>
  (file, blogId) => {
    // check if the file is an image
    const validated = validateFn?.(file);
    if (!validated) return Promise.resolve("");

    // A fresh object to act as the ID for this upload
    const id = {};

    return new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve(onUpload(file, blogId));
      };
    });
  };

export type UploadFn = (file: File, blogId: string) => Promise<string>;

export const handleImagePaste = (
  view: EditorView,
  event: ClipboardEvent,
  uploadFn: UploadFn,
  blogId: string
) => {
  if (event.clipboardData?.files.length) {
    event.preventDefault();
    const [file] = Array.from(event.clipboardData.files);
    const pos = view.state.selection.from;

    if (file) {
      const tr = view.state.tr;
      if (!tr.selection.empty) tr.deleteSelection();

      // Create a fresh object to act as the ID for this upload
      const id = {};

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        tr.setMeta(uploadKey, {
          add: {
            id,
            pos,
            src: reader.result,
          },
        });
        view.dispatch(tr);

        uploadFn(file, blogId).then(
          (src) => {
            const { schema } = view.state;
            const pos = findPlaceholder(view.state, id);
            if (pos == null) return;

            const node = schema.nodes.image?.create({ src });
            if (!node) return;

            const transaction = view.state.tr
              .replaceWith(pos, pos, node)
              .setMeta(uploadKey, { remove: { id } });
            view.dispatch(transaction);
          },
          () => {
            const transaction = view.state.tr.setMeta(uploadKey, {
              remove: { id },
            });
            view.dispatch(transaction);
          }
        );
      };
    }
    return true;
  }
  return false;
};

export const handleImageDrop = (
  view: EditorView,
  event: DragEvent,
  moved: boolean,
  uploadFn: UploadFn,
  blogId: string
) => {
  if (!moved && event.dataTransfer?.files.length) {
    event.preventDefault();
    const [file] = Array.from(event.dataTransfer.files);
    const coordinates = view.posAtCoords({
      left: event.clientX,
      top: event.clientY,
    });
    // here we deduct 1 from the pos or else the image will create an extra node
    if (file) {
      const tr = view.state.tr;
      if (!tr.selection.empty) tr.deleteSelection();

      // Create a fresh object to act as the ID for this upload
      const id = {};

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        tr.setMeta(uploadKey, {
          add: {
            id,
            pos: coordinates?.pos ?? 0 - 1,
            src: reader.result,
          },
        });
        view.dispatch(tr);

        uploadFn(file, blogId).then(
          (src) => {
            const { schema } = view.state;
            const pos = findPlaceholder(view.state, id);
            if (pos == null) return;

            const node = schema.nodes.image?.create({ src });
            if (!node) return;

            const transaction = view.state.tr
              .replaceWith(pos, pos, node)
              .setMeta(uploadKey, { remove: { id } });
            view.dispatch(transaction);
          },
          () => {
            const transaction = view.state.tr.setMeta(uploadKey, {
              remove: { id },
            });
            view.dispatch(transaction);
          }
        );
      };
    }
    return true;
  }
  return false;
};
