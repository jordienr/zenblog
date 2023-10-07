import { ContentRenderer } from "./ContentRenderer";
import { PencilIcon } from "lucide-react";
import { useState } from "react";

type Props = {
  post: any;
};
export function ContentEditor({ post }: Props) {
  const [editable, setEditable] = useState(false);

  function toggleEditable() {
    if (!post) return;
    setEditable(!editable);
  }

  return (
    <div className="rounded-md bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between">
          <div>
            <span className="p-2 font-mono text-sm text-slate-500">
              {post?.slug}
            </span>
            <h1 className="px-2 text-3xl font-semibold">{post?.title}</h1>
          </div>
          <div>
            <button onClick={toggleEditable} className="btn btn-primary">
              <PencilIcon color="white" className="h-6 w-6" />
              Edit
            </button>
          </div>
        </div>

        <ContentRenderer content={post.content} />
      </div>
    </div>
  );
}
