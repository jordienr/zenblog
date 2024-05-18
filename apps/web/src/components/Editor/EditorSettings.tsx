/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Code, Info, Plus, Trash } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { TagManagement } from "./TagManagement";
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
  onChange: ({
    metadata,
    tags,
    published_at,
  }: {
    metadata: MetadataItem[];
    tags: Tag[];
    published_at?: string;
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

  function formatDate(date: string) {
    try {
      return new Date(date).toISOString().split(".")[0];
    } catch (error) {
      toast.error("Invalid date");
      // do nothing
    }
  }

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

  useEffect(() => {
    try {
      const date = publishedAtToDate();

      props.onChange({
        tags: selectedTags,
        metadata,
        published_at: date,
      });
    } catch (error) {
      toast.error("Invalid date");
    }
  }, [publishedAt]);

  const publishedAtValue = formatDate(publishedAtToDate());

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
    props.onChange({ tags: selectedTags, metadata: newMetadata });
  };

  const handleCategoryChange = (tags: Tag[]) => {
    setSelectedTags(tags);
    props.onChange({ metadata, tags });
  };

  const ogImageUrl = `/api/og?title=${props.title}&emoji=${props.blogEmoji}&url=${props.blogTitle}`;

  return (
    <div className="overflow-y-auto px-1 [&_h2]:font-mono [&_h2]:text-sm [&_h2]:font-medium">
      <section className="mt-2">
        <h2 className="mt-2 pb-2 font-mono">Published date</h2>
        <div className="flex gap-4">
          <div>
            <label className="text-xs text-zinc-500" htmlFor="date">
              Date
            </label>
            <div className="flex gap-1">
              <Input
                type="number"
                name="day"
                placeholder="Day"
                className="w-14 rounded-r-sm"
                min="1"
                max="31"
                value={publishedAt.day}
                onChange={(e) => {
                  setPublishedAt({
                    ...publishedAt,
                    day: parseInt(e.target.value),
                  });
                }}
              />
              <Select
                value={publishedAt.month.toString()}
                onValueChange={(e) => {
                  setPublishedAt({
                    ...publishedAt,
                    month: parseInt(e),
                  });
                }}
              >
                <SelectTrigger className="w-[120px] rounded-sm">
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">January</SelectItem>
                  <SelectItem value="1">February</SelectItem>
                  <SelectItem value="2">March</SelectItem>
                  <SelectItem value="3">April</SelectItem>
                  <SelectItem value="4">May</SelectItem>
                  <SelectItem value="5">June</SelectItem>
                  <SelectItem value="6">July</SelectItem>
                  <SelectItem value="7">August</SelectItem>
                  <SelectItem value="8">September</SelectItem>
                  <SelectItem value="9">October</SelectItem>
                  <SelectItem value="10">November</SelectItem>
                  <SelectItem value="11">December</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="number"
                name="year"
                placeholder="Year"
                className="w-20 rounded-l-sm"
                value={publishedAt.year}
                onChange={(e) => {
                  setPublishedAt({
                    ...publishedAt,
                    year: parseInt(e.target.value),
                  });
                }}
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-zinc-500" htmlFor="time">
              Time
            </label>
            <div className="flex gap-1">
              <Input
                type="number"
                name="hour"
                placeholder="Hour"
                className="w-14 rounded-r-sm"
                min="0"
                max="23"
                value={publishedAt.hour}
                onChange={(e) => {
                  setPublishedAt({
                    ...publishedAt,
                    hour: parseInt(e.target.value),
                  });
                }}
              />
              <Input
                type="number"
                name="minute"
                placeholder="Minute"
                className="w-14 rounded-l-sm"
                min="0"
                max="59"
                value={publishedAt.minute}
                onChange={(e) => {
                  setPublishedAt({
                    ...publishedAt,
                    minute: parseInt(e.target.value),
                  });
                }}
              />
            </div>
          </div>
        </div>
        {/* <Input
          type="datetime-local"
          name="published_at"
          value={publishedAtValue}
          onChange={(e) => {
            setPublishedAt(e.target.value);
            props.onChange({
              tags: selectedTags,
              metadata,
              published_at: e.target.value,
            });
          }}
        /> */}
      </section>
      <section>
        <h2 className="m-0 mt-8 border-b pb-2 font-mono">Custom metadata</h2>

        <div className="text-sm font-medium text-slate-700">
          <div className="flex items-center py-2 text-xs text-slate-500 *:p-1">
            <div className="w-48">Key</div>
            <div>Value</div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="ml-auto" variant={"ghost"}>
                  <Code size={16} />
                  <div>Preview</div>
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
                      });
                    }}
                  >
                    <Trash size={16} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <Button
            className="mt-2 w-full"
            variant={"secondary"}
            type="button"
            onClick={addMetadata}
          >
            <Plus size={16} />
            Add metadata
          </Button>
        </div>
        {/* <div className="mt-4">
          <TagManagement
            selectedTags={selectedTags}
            onChange={handleCategoryChange}
          />
        </div> */}
      </section>

      <section className="mt-8">
        <h2>Open graph image</h2>
        <Image
          className="mt-4 max-w-full rounded-md border"
          src={ogImageUrl}
          alt=""
          width={600}
          height={300}
        />
        <div className="mt-2 flex justify-end">
          <Button
            variant="ghost"
            onClick={() => {
              navigator.clipboard.writeText(
                process.env.NEXT_PUBLIC_BASE_URL + ogImageUrl
              );
              toast("Copied image URL to clipboard");
            }}
          >
            Copy image URL
          </Button>
          {/* <CopyCell text={process.env.NEXT_PUBLIC_BASE_URL + ogImageUrl} /> */}
        </div>
      </section>
    </div>
  );
};

export default EditorSettings;
