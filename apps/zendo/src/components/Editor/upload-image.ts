import { toast } from "sonner";
import { EditorState, Plugin, PluginKey } from "@tiptap/pm/state";
import { Decoration, DecorationSet, EditorView } from "@tiptap/pm/view";
import { getSupabaseClient } from "../../lib/supabase";

const uploadKey = new PluginKey("upload-image");

const UploadImagesPlugin = () =>
  new Plugin({
    key: uploadKey,
    state: {
      init() {
        console.log("init");
        return DecorationSet.empty;
      },
      apply(tr, set) {
        set = set.map(tr.mapping, tr.doc);
        // See if the transaction adds or removes any placeholders
        // @ts-ignore
        const action = tr.getMeta(this);
        if (action && action.add) {
          const { id, pos, src } = action.add;

          const placeholder = document.createElement("div");
          placeholder.setAttribute("class", "img-placeholder");
          const image = document.createElement("img");
          image.setAttribute(
            "class",
            "opacity-40 rounded-lg border border-stone-200"
          );
          image.src = src;
          placeholder.appendChild(image);
          const deco = Decoration.widget(pos + 1, placeholder, {
            id,
          });
          set = set.add(tr.doc, [deco]);
        } else if (action && action.remove) {
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

export default UploadImagesPlugin;

function findPlaceholder(state: EditorState, id: {}) {
  const decos = uploadKey.getState(state);
  const found = decos.find(null, null, (spec: any) => spec.id == id);
  const pos = found.length ? found[0].from : null;
  console.log(pos);
  return pos;
}

export function startImageUpload(
  file: File,
  view: EditorView,
  pos: number,
  blogId: string
) {
  console.log("startImageUpload");
  // check if the file is an image
  if (!file.type.includes("image/")) {
    toast.error("File type not supported.");
    return;

    // check if the file size is less than 20MB
  } else if (file.size / 1024 / 1024 > 20) {
    toast.error("File size too big (max 20MB).");
    return;
  }

  // A fresh object to act as the ID for this upload
  const id = {};

  // Replace the selection with a placeholder
  const tr = view.state.tr;
  if (!tr.selection.empty) tr.deleteSelection();

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
  };

  handleImageUpload(file, blogId).then((src) => {
    console.log("handleImageUpload", src);
    let pos = findPlaceholder(view.state, id);
    if (!pos) {
      console.log("Pos is null");
      return;
    }

    if (!src) {
      console.error("Error uploading image. Removing image...");
      toast.error("Error uploading image.");
      const transaction = view.state.tr.delete(pos, pos);
      view.dispatch(transaction);
      return;
    }
    const { schema } = view.state;

    // Otherwise, insert it at the placeholder's position, and remove
    // the placeholder

    // When BLOB_READ_WRITE_TOKEN is not valid or unavailable, read
    // the image locally
    const imageSrc = typeof src === "object" ? reader.result : src;

    const node = schema.nodes.image?.create({ src: imageSrc });
    if (!node) return;
    const transaction = view.state.tr
      .replaceWith(pos, pos, node)
      .setMeta(uploadKey, { remove: { id } });
    view.dispatch(transaction);
  });
}

const supa = getSupabaseClient();

export const handleImageUpload = async (file: File, blogId: string) => {
  console.log("Uploading image to Supabase storage...");
  const randomIdFromDate = new Date().getTime();
  const imageName = randomIdFromDate + file.name;

  const { data, error } = await supa.storage
    .from(`images/${blogId}`)
    .upload(imageName, file);

  console.log(data, error);

  if (error) {
    console.log("Error uploading image to Supabase storage: ", error.message);
    return null;
  }

  if (data) {
    const {
      data: { publicUrl },
    } = supa.storage.from(`images/${blogId}`).getPublicUrl(imageName);
    return publicUrl;
  }
};
