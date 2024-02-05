import React, { useCallback, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Plus, Trash } from "lucide-react";
import { set } from "zod";

type MetadataItem = {
  key: string;
  value: string;
};
type Props = {
  metadata?: MetadataItem[];
  onSave: (metadata: MetadataItem[]) => void;
};

const EditorSettings = (props: Props) => {
  const defaultMetadata = props.metadata?.length
    ? props.metadata
    : [{ key: "", value: "" }];

  const [metadata, setMetadata] = useState<MetadataItem[]>(defaultMetadata);

  function addMetadata() {
    setMetadata([...metadata, { key: "", value: "" }]);
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();

        const formData = new FormData(e.target as HTMLFormElement);
        const data = formData.values();
        const newMetadata = [];

        for (let i = 0; i < metadata.length; i++) {
          const key = data.next().value;
          const value = data.next().value;
          if (key && value) {
            newMetadata.push({ key, value });
          }
        }

        console.log("DEBUG", newMetadata);

        // setMetadata(newMetadata);
        // props.onSave(metadata);
      }}
      className="prose-sm prose-h2:font-bold prose-h2:text-sm"
    >
      <section>
        <h2 className="m-0 border-b pb-2">Custom metadata</h2>

        <div className="text-sm font-medium text-slate-700">
          <div className="grid grid-cols-2 text-xs text-slate-500 *:p-1">
            <div>Key</div>
            <div>Value</div>
          </div>
          <div className="flex flex-col gap-1">
            {metadata.map((item, index) => (
              <div className="flex gap-1" key={item.key}>
                <div className="grid flex-grow grid-cols-2 gap-1 *:rounded-md *:border *:p-1">
                  <Input
                    placeholder="key"
                    id={index + "-metadata-key"}
                    name={index + "-metadata-key"}
                    className="outline-none"
                    defaultValue={item.value}
                  />
                  <Input
                    placeholder="value"
                    id={index + "-metadata-value"}
                    name={index + "-metadata-value"}
                    className="outline-none"
                    defaultValue={item.value}
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
                      setMetadata(metadata.filter((_, i) => i !== index));
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
          <Button>Save</Button>
        </div>
        <pre>{JSON.stringify(metadata, null, 2)}</pre>
      </section>
    </form>
  );
};

export default EditorSettings;
