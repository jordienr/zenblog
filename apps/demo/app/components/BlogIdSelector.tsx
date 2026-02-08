"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const DEFAULT_BLOG_ID = "53a970ef-cc74-40ac-ac53-c322cd4848cb";

export function BlogIdSelector() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [blogId, setBlogId] = useState(
    searchParams.get("blogId") || DEFAULT_BLOG_ID
  );
  const [isEditing, setIsEditing] = useState(false);
  const [tempBlogId, setTempBlogId] = useState(blogId);

  useEffect(() => {
    const urlBlogId = searchParams.get("blogId");
    if (urlBlogId && urlBlogId !== blogId) {
      setBlogId(urlBlogId);
      setTempBlogId(urlBlogId);
    }
  }, [searchParams]);

  const handleSave = () => {
    if (tempBlogId.trim()) {
      setBlogId(tempBlogId.trim());
      // Update URL with new blogId
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set("blogId", tempBlogId.trim());
      router.push(newUrl.pathname + newUrl.search);
      setIsEditing(false);
    }
  };

  const handleReset = () => {
    setTempBlogId(DEFAULT_BLOG_ID);
    setBlogId(DEFAULT_BLOG_ID);
    // Remove blogId from URL
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.delete("blogId");
    router.push(newUrl.pathname + newUrl.search);
    setIsEditing(false);
  };

  return (
    <div className="flex items-center gap-2">
      {!isEditing ? (
        <>
          <span className="text-xs text-gray-500">
            Blog: {blogId.slice(0, 8)}...
          </span>
          <button
            onClick={() => setIsEditing(true)}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
          >
            Change
          </button>
        </>
      ) : (
        <div className="flex items-center gap-2 p-2 bg-white border rounded-lg shadow-lg absolute top-12 right-4 z-50">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-gray-700">
              Blog ID:
            </label>
            <input
              type="text"
              value={tempBlogId}
              onChange={(e) => setTempBlogId(e.target.value)}
              className="px-2 py-1 text-xs border rounded w-64"
              placeholder="Enter blog ID"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Apply
              </button>
              <button
                onClick={handleReset}
                className="px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Reset
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setTempBlogId(blogId);
                }}
                className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
