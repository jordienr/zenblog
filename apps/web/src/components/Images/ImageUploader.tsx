/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { ImageIcon, Loader2 } from "lucide-react";
import { Input } from "../ui/input";
import { cn, formatBytes } from "@/lib/utils";
import { API } from "app/utils/api-client";
import { toast } from "sonner";
import { useSubscriptionQuery } from "@/queries/subscription";

type Props = {
  blogId: string;
  onSuccessfulUpload?: () => void;
  className?: string;
};

const MAX_FREE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB Hard limit for free plan
const MAX_IMAGE_WARNING_SIZE_BYTES = 2 * 1024 * 1024; // 2MB Image warning threshold
const MAX_VIDEO_WARNING_SIZE_BYTES = 5 * 1024 * 1024; // 5MB Video warning threshold

export const ImageUploader = ({
  blogId,
  onSuccessfulUpload,
  className,
}: Props) => {
  const [image, setImage] = useState(null as File | null);
  const [createObjectURL, setCreateObjectURL] = useState<string | null>(null);
  const [imageInfo, setImageInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [editableFileName, setEditableFileName] = useState<string>("");
  const subscription = useSubscriptionQuery();

  console.log("subscription", subscription);

  const isProPlan = subscription.data?.plan === "pro";
  const uploadsDisabled = subscription.isLoading;

  useEffect(() => {
    // on mount, listen for paste events
    // if the paste event has image data, add it to the input for upload
    const handlePaste = (e: ClipboardEvent) => {
      setLoading(true);
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of items) {
        if (item.type.indexOf("image") === 0) {
          const blob = item.getAsFile();
          if (blob) {
            uploadToClient({ target: { files: [blob] } } as any);
            // setImage(blob);
            // setCreateObjectURL(URL.createObjectURL(blob));
          }
        }
      }
    };

    window.addEventListener("paste", handlePaste);

    return () => {
      window.removeEventListener("paste", handlePaste);
    };
  }, []);

  async function uploadImageToBlogAndGetURL(file: File) {
    const file_size = file.size; // Use original file size

    const res = await API().v2.blogs[":blog_id"].media["upload-url"].$get({
      param: {
        blog_id: blogId,
      },
      query: {
        // Send original filename to backend for unique name generation
        original_file_name: file.name,
        size_in_bytes: file_size.toString(), // API expects string, convert number
        content_type: file.type,
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      // Assert the type for error handling
      throw new Error(
        (errorData as { error: string }).error || "Failed to get upload URL"
      );
    }

    const data = await res.json();
    // Expect signedUrl and uniqueFilename from backend
    return data as { signedUrl: string; uniqueFilename: string };
  }

  function getImageInfo(file: File) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = function (e) {
        const img = new Image();
        img.onload = function () {
          resolve({
            width: img.width,
            height: img.height,
            size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
          });
        };

        img.src = e.target?.result as string;
      };

      reader.readAsDataURL(file);
    });
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    if (!image || uploadsDisabled) {
      setLoading(false);
      return;
    }

    if (!isProPlan && image.size > MAX_FREE_SIZE_BYTES) {
      toast.error(
        `File size exceeds 5MB limit for free plan. Upgrade to Pro for larger uploads.`
      );
      setLoading(false);
      return;
    }

    try {
      // 1. Get the signed URL and unique filename from the backend
      const { signedUrl, uniqueFilename } = await uploadImageToBlogAndGetURL(
        image
      );

      if (!signedUrl || !uniqueFilename) {
        toast.error("Could not get upload URL or filename.");
        setLoading(false);
        return;
      }

      // 2. Upload the file directly to R2 using the signed URL
      const uploadResponse = await fetch(signedUrl, {
        method: "PUT",
        body: image,
        headers: {
          "Content-Type": image.type,
          // Add Content-Length if required by R2/S3, often it's inferred
          // 'Content-Length': image.size.toString(),
        },
      });

      if (!uploadResponse.ok) {
        // Attempt to get error details from R2/S3 response if available
        let errorBody = "Upload failed. Please try again.";
        try {
          const text = await uploadResponse.text();
          // R2/S3 often returns XML errors
          if (text.includes("<Error>")) {
            const codeMatch = text.match(/<Code>(.*?)<\/Code>/);
            const messageMatch = text.match(/<Message>(.*?)<\/Message>/);
            if (codeMatch && messageMatch) {
              errorBody = `Upload Error: ${codeMatch[1]} - ${messageMatch[1]}`;
            } else {
              errorBody = `Upload Error: ${text.substring(0, 100)}...`; // Truncate long errors
            }
          } else {
            errorBody = text || errorBody;
          }
        } catch (parseError) {
          console.error("Error parsing upload error response:", parseError);
        }
        throw new Error(errorBody);
      }

      // 3. Call backend to confirm upload and finalize
      const confirmRes = await API().v2.blogs[":blog_id"].media[
        "confirm-upload"
      ].$post({
        param: {
          blog_id: blogId,
        },
        json: {
          // Send the uniqueFilename received from /upload-url
          fileName: uniqueFilename,
          contentType: image.type,
          sizeInBytes: image.size,
        },
      });

      if (!confirmRes.ok) {
        const confirmError = await confirmRes.json();
        // Should we attempt to delete the R2 object if confirmation fails?
        toast.error(
          `Failed to confirm upload: ${
            (confirmError as { error: string }).error || "Unknown error"
          }`
        );
        // Don't clear state if confirmation failed?
        setLoading(false);
        return;
      }

      const confirmData = await confirmRes.json();
      console.log("Upload confirmed by backend:", confirmData);
      toast.success("Media uploaded and confirmed!");

      // Clear state and trigger callback
      setImage(null);
      setCreateObjectURL(null);
      setImageInfo(null);

      onSuccessfulUpload && onSuccessfulUpload();
    } catch (error) {
      console.error(error);
      toast.error("Error uploading image");
    } finally {
      setLoading(false);
    }
  }

  const uploadToClient = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const imageFile = e.target.files[0];
      const fileSizeFormatted = formatBytes(imageFile.size);
      const isVideo = imageFile.type.startsWith("video/");
      const isImage = imageFile.type.startsWith("image/");

      // --- Add Image Size Warning (> 2MB) ---
      if (isImage && imageFile.size > MAX_IMAGE_WARNING_SIZE_BYTES) {
        const proceed = window.confirm(
          `This image is larger than 2MB (${fileSizeFormatted}). Large images can impact performance. Consider compressing it before uploading.\n\nDo you want to proceed anyway?`
        );
        if (!proceed) {
          e.target.value = ""; // Clear the file input
          return; // Stop processing
        }
      }
      // --- End Image Size Warning ---

      // --- Add Video Size Warning (> 5MB) ---
      if (isVideo && imageFile.size > MAX_VIDEO_WARNING_SIZE_BYTES) {
        const proceed = window.confirm(
          `This video is larger than 5MB (${fileSizeFormatted}). Uploading large videos can take time.\n\nDo you want to proceed anyway?`
        );
        if (!proceed) {
          e.target.value = ""; // Clear the file input
          return; // Stop processing
        }
      }
      // --- End Video Size Warning ---

      // --- Free Plan Limit Check (> 5MB) ---
      // This check remains the same and applies to ALL file types
      if (!isProPlan && imageFile.size > MAX_FREE_SIZE_BYTES) {
        toast.error(
          `File size (${fileSizeFormatted}) exceeds 5MB limit for free plan. Upgrade to Pro for larger uploads.`
        );
        e.target.value = "";
        return;
      }
      // --- End Free Plan Limit Check ---

      setImage(imageFile);
      setEditableFileName(imageFile.name.replace(/\.[^/.]+$/, ""));
      const imageInfo = await getImageInfo(imageFile);
      setImageInfo(imageInfo);
      setCreateObjectURL(URL.createObjectURL(imageFile));
      setLoading(false);
    }
  };

  return (
    <div className={cn("max-w-xl", className)}>
      <h2 className="mb-2 flex gap-1.5 font-medium">
        <ImageIcon className="text-orange-500" size="22" /> Upload media
      </h2>
      <form onSubmit={onSubmit}>
        {image && (
          <div className="flex min-h-[300px] flex-col items-center justify-center overflow-auto rounded-lg border p-2">
            {loading ? (
              <div className="flex-x-center flex-y-center p-12">
                <Loader2 className="animate-spin" />
              </div>
            ) : (
              <img
                className="max-h-80 w-full rounded-lg border bg-white object-cover shadow-sm"
                src={createObjectURL || ""}
              />
            )}
            {imageInfo && (
              <div className="w-full px-1">
                <div className="mt-2 grid w-full gap-2 font-mono tracking-tight">
                  {/* <input
                    type="text"
                    name="filename"
                    id="filename"
                    value={editableFileName}
                    onChange={(e) => setEditableFileName(e.target.value)}
                    className="w-full border-b bg-white px-1 text-slate-600 shadow-sm outline-none hover:border-slate-300 focus:border-slate-400"
                  /> */}
                  <span className="text-xs text-slate-500">
                    Original resolution:{" "}
                    {`${imageInfo.height}x${imageInfo.width}px`}
                  </span>
                  <span className="text-xs text-slate-500">
                    Original size: {imageInfo.size}
                  </span>
                </div>
                <p className="mt-4 text-xs italic text-slate-500">
                  Note: Image will be compressed and converted to WebP format
                  for optimal performance
                </p>
              </div>
            )}
          </div>
        )}

        {!image && (
          <div>
            <div
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                document.getElementById("file")?.click();
              }}
              className={cn(
                "flex h-32 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-2 text-center font-medium",
                uploadsDisabled && "cursor-not-allowed opacity-50"
              )}
              onDragOver={(e) => {
                if (uploadsDisabled) return;
                e.preventDefault();
                e.currentTarget.classList.add("border-orange-500");
              }}
              onDragLeave={(e) => {
                e.currentTarget.classList.remove("border-orange-500");
              }}
              onDrop={(e) => {
                if (uploadsDisabled) return;
                e.preventDefault();
                e.currentTarget.classList.remove("border-orange-500");

                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  const droppedFile = e.dataTransfer.files[0];
                  const droppedFileSizeFormatted = formatBytes(
                    droppedFile.size
                  );
                  const isDroppedVideo = droppedFile.type.startsWith("video/");
                  const isDroppedImage = droppedFile.type.startsWith("image/");

                  // --- Add Image Size Warning on Drop (> 2MB) ---
                  if (
                    isDroppedImage &&
                    droppedFile.size > MAX_IMAGE_WARNING_SIZE_BYTES
                  ) {
                    const proceed = window.confirm(
                      `This image is larger than 2MB (${droppedFileSizeFormatted}). Large images can impact performance. Consider compressing it before uploading.\n\nDo you want to proceed anyway?`
                    );
                    if (!proceed) {
                      return; // Stop processing the drop
                    }
                  }
                  // --- End Image Size Warning on Drop ---

                  // --- Add Video Size Warning on Drop (> 5MB) ---
                  if (
                    isDroppedVideo &&
                    droppedFile.size > MAX_VIDEO_WARNING_SIZE_BYTES
                  ) {
                    const proceed = window.confirm(
                      `This video is larger than 5MB (${droppedFileSizeFormatted}). Uploading large videos can take time.\n\nDo you want to proceed anyway?`
                    );
                    if (!proceed) {
                      return; // Stop processing the drop
                    }
                  }
                  // --- End Video Size Warning on Drop ---

                  // --- Free Plan Limit Check on Drop (> 5MB) ---
                  // This check remains the same and applies to ALL file types
                  if (!isProPlan && droppedFile.size > MAX_FREE_SIZE_BYTES) {
                    toast.error(
                      `File size (${droppedFileSizeFormatted}) exceeds 5MB limit for free plan. Upgrade to Pro for larger uploads.`
                    );
                    return;
                  }
                  // --- End Free Plan Limit Check ---
                }

                uploadToClient({
                  target: { files: e.dataTransfer.files },
                } as any);
              }}
            >
              <ImageIcon className="text-slate-400" size="24" />
              <h3 className="text-slate-600">Drag and drop an image here</h3>
            </div>
            <Input
              className="mt-2"
              id="file"
              type="file"
              name="file"
              onChange={uploadToClient}
              multiple
              disabled={uploadsDisabled}
            />
          </div>
        )}

        <div className="actions mt-4">
          {!image && (
            <div className="mr-auto text-center text-sm text-slate-400">
              Cmd + V to paste an image
            </div>
          )}
          {image && (
            <>
              <Button
                variant={"ghost"}
                className="text-red-500"
                onClick={() => {
                  setImage(null);
                  setCreateObjectURL(null);
                  setImageInfo(null);
                }}
                disabled={loading || uploadsDisabled}
              >
                Remove
              </Button>
              <Button
                variant="default"
                type="submit"
                disabled={loading || uploadsDisabled}
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Upload
              </Button>
            </>
          )}
        </div>
      </form>
    </div>
  );
};
