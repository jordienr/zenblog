import React, { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Code, Info, Plus, Trash } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import CategorySelect from "./TagSelect";
import { toast } from "sonner";
import DateTimePicker from "react-datetime-picker";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";

type MetadataItem = {
  key: string;
  value: string;
};
type Props = {
  title: string;
  metadata?: MetadataItem[];
  selectedTags: string[];
  published_at?: string;
  onChange: ({
    metadata,
    tags,
    published_at,
  }: {
    metadata: MetadataItem[];
    tags: string[];
    published_at?: string;
  }) => void;
};

const EditorSettings = (props: Props) => {
  const defaultMetadata = props.metadata?.length
    ? props.metadata
    : [{ key: "", value: "" }];

  const [metadata, setMetadata] = useState<MetadataItem[]>(defaultMetadata);
  const [selectedTags, setSelectedTags] = useState<string[]>(
    props.selectedTags || []
  );
  const today = new Date().toISOString().split("T")[0] || "";
  const [publishedAt, setPublishedAt] = useState<string>(
    props.published_at || today
  );

  function formatPublishedDate() {
    try {
      const date = new Date(publishedAt).toISOString().split(".")[0];
      return date;
    } catch (error) {
      // do nothing
    }
  }
  const publishedAtValue = formatPublishedDate();

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

  const handleCategoryChange = (tags: string[]) => {
    setSelectedTags(tags);
    props.onChange({ metadata, tags });
  };

  return (
    <div className="[&_h2]:font-mono [&_h2]:text-sm [&_h2]:font-medium">
      <section className="mt-2">
        <h2 className="mt-2 pb-2 font-mono">Published date</h2>
        <DateTimePicker
          autoFocus={false}
          calendarIcon={null}
          clearIcon={null}
          shouldOpenWidgets={() => false}
          value={new Date(publishedAt)}
          onChange={(date) => {
            if (!date) return;
            setPublishedAt(date.toISOString());
            props.onChange({
              tags: selectedTags,
              metadata,
              published_at: date.toISOString(),
            });
          }}
        />
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
        <div className="mt-4">
          <CategorySelect
            selectedTags={selectedTags}
            onChange={handleCategoryChange}
          />
        </div>
      </section>

      <section className="mt-8">
        <h2>Open graph image</h2>
        <img
          className="mt-4 max-w-full rounded-md border"
          src={`/api/og?title=${props.title}`}
          alt=""
          width={600}
          height={300}
        />
        <p className="mt-2 rounded-md border bg-zinc-100 p-1 font-mono text-xs text-zinc-700">
          {process.env.NEXT_PUBLIC_BASE_URL}/api/og?title={props.title}
        </p>
      </section>
    </div>
  );
};

export default EditorSettings;
