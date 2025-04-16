import { type EditorState, Plugin, PluginKey } from "@tiptap/pm/state";
import { Decoration, DecorationSet, type EditorView } from "@tiptap/pm/view";
import { toast } from "sonner";
import { formatBytes } from "@/lib/utils";

const uploadKey = new PluginKey("upload-image");

// Define size constants
const MAX_FREE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const MAX_IMAGE_WARNING_SIZE_BYTES = 2 * 1024 * 1024; // 2MB Warning threshold
const MAX_VIDEO_WARNING_SIZE_BYTES = 5 * 1024 * 1024; // 5MB Video warning threshold

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

          // Create a generic loading placeholder div
          const placeholder = document.createElement("div");
          placeholder.setAttribute(
            "class",
            // Add some basic styling for the placeholder
            "zb-media-upload-placeholder motion-safe:animate-pulse flex items-center justify-center border border-dashed rounded-lg bg-zinc-100 text-zinc-500 text-sm min-h-[100px] min-w-[100px]"
          );
          placeholder.textContent = "Uploading..."; // Simple text indicator
          // Optional: Add a spinner SVG or use CSS for a visual spinner

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
  blogId: string,
  isProPlan: boolean
) => {
  if (event.clipboardData?.files.length) {
    event.preventDefault();
    const [file] = Array.from(event.clipboardData.files);
    const pos = view.state.selection.from;

    if (file) {
      const fileSizeFormatted = formatBytes(file.size);
      const isVideo = file.type.startsWith("video/");
      const isImage = file.type.startsWith("image/");

      // --- Perform Checks BEFORE Upload ---

      // 1. Image Size Warning (> 2MB)
      if (isImage && file.size > MAX_IMAGE_WARNING_SIZE_BYTES) {
        const proceed = window.confirm(
          `This image is larger than 2MB (${fileSizeFormatted}). Large images can impact performance. Consider compressing it before uploading.\n\nDo you want to proceed anyway?`
        );
        if (!proceed) {
          return false; // Stop processing
        }
      }

      // 2. Video Size Warning (> 5MB)
      if (isVideo && file.size > MAX_VIDEO_WARNING_SIZE_BYTES) {
        const proceed = window.confirm(
          `This video is larger than 5MB (${fileSizeFormatted}). Uploading large videos can take time.\n\nDo you want to proceed anyway?`
        );
        if (!proceed) {
          return false; // Stop processing
        }
      }

      // 3. Free Plan Limit (> 5MB)
      if (!isProPlan && file.size > MAX_FREE_SIZE_BYTES) {
        toast.error(
          `File size (${fileSizeFormatted}) exceeds 5MB limit for free plan. Upgrade to Pro for larger uploads.`
        );
        return false; // Stop processing
      }

      // --- Checks Passed - Proceed with Upload ---

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

            // Check if the uploaded file is a video
            const isVideo = file.type.startsWith("video/");

            // Create node with correct attributes (including isVideo)
            const node = schema.nodes.image?.create({
              src,
              isVideo: isVideo.toString(),
            });
            if (!node) return;

            const transaction = view.state.tr
              .replaceWith(pos, pos, node)
              .setMeta(uploadKey, { remove: { id } });
            view.dispatch(transaction);
          },
          (error) => {
            console.error("Upload failed:", error);
            toast.error(`Upload failed: ${error.message || "Unknown error"}`);
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
  blogId: string,
  isProPlan: boolean
) => {
  if (!moved && event.dataTransfer?.files.length) {
    event.preventDefault();
    const [file] = Array.from(event.dataTransfer.files);
    const coordinates = view.posAtCoords({
      left: event.clientX,
      top: event.clientY,
    });

    if (file) {
      const fileSizeFormatted = formatBytes(file.size);
      const isVideo = file.type.startsWith("video/");
      const isImage = file.type.startsWith("image/");

      // --- Perform Checks BEFORE Upload ---

      // 1. Image Size Warning (> 2MB)
      if (isImage && file.size > MAX_IMAGE_WARNING_SIZE_BYTES) {
        const proceed = window.confirm(
          `This image is larger than 2MB (${fileSizeFormatted}). Large images can impact performance. Consider compressing it before uploading.\n\nDo you want to proceed anyway?`
        );
        if (!proceed) {
          return false; // Stop processing
        }
      }

      // 2. Video Size Warning (> 5MB)
      if (isVideo && file.size > MAX_VIDEO_WARNING_SIZE_BYTES) {
        const proceed = window.confirm(
          `This video is larger than 5MB (${fileSizeFormatted}). Uploading large videos can take time.\n\nDo you want to proceed anyway?`
        );
        if (!proceed) {
          return false; // Stop processing
        }
      }

      // 3. Free Plan Limit (> 5MB)
      if (!isProPlan && file.size > MAX_FREE_SIZE_BYTES) {
        toast.error(
          `File size (${fileSizeFormatted}) exceeds 5MB limit for free plan. Upgrade to Pro for larger uploads.`
        );
        return false; // Stop processing
      }

      // --- Checks Passed - Proceed with Upload ---

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

            // Check if the uploaded file is a video
            const isVideo = file.type.startsWith("video/");

            // Create node with correct attributes (including isVideo)
            const node = schema.nodes.image?.create({
              src,
              isVideo: isVideo.toString(),
            });
            if (!node) return;

            const transaction = view.state.tr
              .replaceWith(pos, pos, node)
              .setMeta(uploadKey, { remove: { id } });
            view.dispatch(transaction);
          },
          (error) => {
            console.error("Upload failed:", error);
            toast.error(`Upload failed: ${error.message || "Unknown error"}`);
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
