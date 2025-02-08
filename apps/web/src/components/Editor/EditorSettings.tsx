/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Code, Copy, Cross, Info, Plus, Trash, XIcon } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { toast } from "sonner";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useCategories, useCreateCategory } from "@/queries/categories";
import { useRouter } from "next/router";
import { Label } from "../ui/label";
import Spinner from "../Spinner";
import { IS_DEV } from "@/lib/constants";
import { EditorDateInput } from "../ui/editor-date-input";

type Tag = {
  id: string;
  name: string;
  slug: string;
};

type MetadataItem = {
  key: string;
  value: string;
};
type Props = {
  title: string;
  metadata?: MetadataItem[];
  selectedTags: Tag[];
  published_at?: string;
  blogEmoji?: string;
  blogTitle?: string;
  category_id: number | null;
  onChange: ({
    metadata,
    tags,
    published_at,
    category_id,
  }: {
    metadata: MetadataItem[];
    tags: Tag[];
    published_at?: string;
    category_id: number | null;
  }) => void;
};

const EditorSettings = (props: Props) => {
  const defaultMetadata = props.metadata?.length
    ? props.metadata
    : [{ key: "", value: "" }];

  const [metadata, setMetadata] = useState<MetadataItem[]>(defaultMetadata);
  const [selectedTags, setSelectedTags] = useState<Tag[]>(
    props.selectedTags || []
  );
  const today = new Date().toISOString().split("T")[0] || "";
  const router = useRouter();
  const blogId = router.query.blogId as string;

  const [publishedAt, setPublishedAt] = useState<{
    day: number;
    month: number;
    year: number;
    hour: number;
    minute: number;
  }>({
    day: new Date(props.published_at || today).getDate(),
    month: new Date(props.published_at || today).getMonth(),
    year: new Date(props.published_at || today).getFullYear(),
    hour: new Date(props.published_at || today).getHours(),
    minute: new Date(props.published_at || today).getMinutes(),
  });

  function publishedAtToDate() {
    return new Date(
      publishedAt.year,
      publishedAt.month,
      publishedAt.day,
      publishedAt.hour,
      publishedAt.minute
    ).toISOString();
  }

  // useEffect(() => {
  //   try {
  //     const date = publishedAtToDate();

  //     props.onChange({
  //       tags: selectedTags,
  //       metadata,
  //       category_id: props.category_id || null,
  //       published_at: date,
  //     });
  //   } catch (error) {
  //     toast.error("Invalid date");
  //   }
  // }, [publishedAt]);

  function addMetadata() {
    setMetadata([...metadata, { key: "", value: "" }]);
  }

  const handleMetadataChange = (
    type: "key" | "value",
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    let newMetadata = [...metadata];

    if (!newMetadata[index]) {
      return;
    }

    newMetadata[index]![type] = event.target.value;
    setMetadata(newMetadata);
    props.onChange({
      tags: selectedTags,
      metadata: newMetadata,
      category_id: props.category_id || null,
    });
  };

  const ogImageUrl = `/api/public/og?title=${props.title}&emoji=${props.blogEmoji}&url=${props.blogTitle}`;

  const { data: categories, isLoading: isCategoriesLoading } =
    useCategories(blogId);
  const { mutate: createCategory } = useCreateCategory();

  function EditorSettingsSection({ children }: { children: React.ReactNode }) {
    return (
      <section className="mb-4 rounded-xl border bg-white p-3 pt-1.5 shadow-sm shadow-zinc-100">
        {children}
      </section>
    );
  }

  return (
    <div className="overflow-y-auto [&_h2]:p-1 [&_h2]:font-mono [&_h2]:text-sm [&_h2]:font-medium [&_h2]:text-zinc-800">
      <h2 className="mb-3">Post Settings</h2>
      <EditorSettingsSection>
        <div className="flex items-center justify-between">
          <h2>Category</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant={"ghost"} size="icon">
                <Plus size={16} />
              </Button>
            </DialogTrigger>
            <DialogContent className="p-4 md:max-w-sm">
              <form
                className="[&_input]:mb-3 [&_input]:mt-1"
                onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const formData = new FormData(e.target as HTMLFormElement);
                  const name = formData.get("name");
                  const slug = formData.get("slug");
                  createCategory({
                    name: name as string,
                    slug: slug as string,
                    blog_id: blogId,
                  });
                  toast.success("Category created");
                }}
              >
                <h2 className="text-lg font-medium">Create category</h2>
                <p className="mb-4 text-sm text-zinc-500">
                  Posts can have 1 category, but multiple tags.
                </p>
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" placeholder="Category name" />
                <Label htmlFor="slug">Slug</Label>
                <Input id="slug" name="slug" placeholder="Category slug" />
                <div className="flex justify-end">
                  <Button type="submit">Create</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <div>
          {isCategoriesLoading ? (
            <div>
              <Spinner />
            </div>
          ) : (
            <Select
              value={props.category_id?.toString()}
              onValueChange={(e) => {
                props.onChange({
                  tags: selectedTags,
                  metadata: metadata,
                  category_id: parseInt(e),
                });
              }}
            >
              <div className="flex items-center gap-2">
                <SelectTrigger>
                  <SelectValue
                    className="text-xs font-semibold"
                    placeholder="Select a category"
                  />
                </SelectTrigger>
                <div>
                  <Button
                    variant={"ghost"}
                    size="icon"
                    onClick={() => {
                      props.onChange({
                        tags: selectedTags,
                        metadata: metadata,
                        category_id: null,
                      });
                    }}
                  >
                    <XIcon size={16} />
                  </Button>
                </div>
              </div>
              <SelectContent>
                {categories?.map((category) => (
                  <SelectItem
                    key={category.id + "-category"}
                    value={category.id.toString()}
                  >
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </EditorSettingsSection>

      <EditorSettingsSection>
        <h2>Published date</h2>
        <EditorDateInput value={publishedAt} onChange={setPublishedAt} />
      </EditorSettingsSection>

      {IS_DEV && (
        <EditorSettingsSection>
          <div className="flex items-center justify-between">
            <h2>Custom metadata</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="xs" className="ml-auto" variant={"ghost"}>
                  <Code size={16} />
                  Preview
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <div>
                  <h2 className="flex items-center gap-1 text-lg font-medium">
                    <Info size={16} />
                    Metadata preview
                  </h2>
                  <p className="text-sm text-zinc-500">
                    This is the object that you will receive when you fetch the
                    post from your website.
                  </p>
                </div>
                <pre className="rounded-lg border p-2 font-mono text-zinc-600">
                  {JSON.stringify(metadata, null, 2)}
                </pre>
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex items-center py-2 text-xs text-slate-500 *:p-1">
            <div className="w-48">Key</div>
            <div>Value</div>
          </div>

          <div className="flex flex-col gap-1">
            {metadata.map((item, index) => (
              <div className="flex gap-1" key={`metadata-${index}`}>
                <div className="grid flex-grow grid-cols-2 gap-1 *:rounded-md *:border *:p-1">
                  <Input
                    autoComplete="off"
                    placeholder="key"
                    id={index + "-metadata-key"}
                    name={"key"}
                    className="outline-none"
                    value={item.key}
                    required
                    onChange={(e) => handleMetadataChange("key", index, e)}
                  />
                  <Input
                    autoComplete="off"
                    placeholder="value"
                    id={index + "-metadata-value"}
                    name={"value"}
                    className="outline-none"
                    value={item.value}
                    required
                    onChange={(e) => handleMetadataChange("value", index, e)}
                  />
                </div>
                <div className="shrink">
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const newMetadata = [...metadata];
                      newMetadata.splice(index, 1);
                      setMetadata(newMetadata);
                      props.onChange({
                        tags: selectedTags,
                        metadata: newMetadata,
                        category_id: props.category_id || null,
                      });
                    }}
                  >
                    <Trash size={16} />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <Button
            className="mt-4 w-full"
            variant={"outline"}
            type="button"
            onClick={addMetadata}
          >
            <Plus size={16} />
            Add metadata
          </Button>
        </EditorSettingsSection>
      )}

      <EditorSettingsSection>
        <div className="flex items-center justify-between">
          <h2>Open graph image</h2>
          <Button
            size="xs"
            variant="ghost"
            onClick={() => {
              navigator.clipboard.writeText(
                process.env.NEXT_PUBLIC_BASE_URL + ogImageUrl
              );
              toast("Copied image URL to clipboard");
            }}
          >
            <Copy size={16} />
            Copy URL
          </Button>
        </div>

        <Image
          className="mt-4 max-w-full rounded-md border"
          src={ogImageUrl}
          loading="lazy"
          blurDataURL="/api/public/og?title=Loading...&emoji=🚀&url=Loading..."
          alt=""
          width={600}
          height={300}
        />
      </EditorSettingsSection>
    </div>
  );
};

export default EditorSettings;
