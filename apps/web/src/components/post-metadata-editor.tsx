import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { GET } from "app/api/public/[...route]/route";
import { PlusIcon, XIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";

const fieldsSchema = z
  .array(
    z.object({
      id: z.string(),
      key: z.string().regex(/^[a-zA-Z]*$/, {
        message: "Key must only contain letters (a-z, A-Z)",
      }),
      value: z.string(),
    })
  )
  .superRefine((fields, ctx) => {
    const keyMap = new Map<string, number[]>();
    fields.forEach((field, index) => {
      if (field.key) {
        const lowerCaseKey = field.key.toLowerCase();
        if (!keyMap.has(lowerCaseKey)) {
          keyMap.set(lowerCaseKey, []);
        }
        keyMap.get(lowerCaseKey)!.push(index);
      }
    });

    for (const [key, indices] of keyMap.entries()) {
      if (indices.length > 1) {
        indices.forEach((index) => {
          ctx.addIssue({
            code: "custom",
            path: [index, "key"],
            message: `Duplicate key "${key}"`,
          });
        });
      }
    }
  });

export function PostMetadataEditor({
  metadata,
  onSubmit,
}: {
  metadata: Record<string, string> | null;
  onSubmit: (metadata: Record<string, string>) => void;
}) {
  const [fields, setFields] = useState<
    { id: string; key: string; value: string }[]
  >([]);

  const [errors, setErrors] = useState<z.ZodFormattedError<
    { id: string; key: string; value: string }[],
    string
  > | null>(null);

  const keyInputRef = useRef<HTMLInputElement>(null);

  // initial fields
  useEffect(() => {
    console.log("metadata", metadata);
    if (metadata && Object.keys(metadata).length > 0) {
      setFields(
        Object.entries(metadata).map(([key, value]) => ({
          id: `id_${Math.random().toString(36).substr(2, 9)}`,
          key,
          value,
        }))
      );
    } else {
      setFields([{ id: "1", key: "", value: "" }]);
    }
  }, [metadata]);

  const handleAddField = () => {
    setFields([
      ...fields,
      {
        id: `id_${Math.random().toString(36).substr(2, 9)}`,
        key: "",
        value: "",
      },
    ]);
    // Focus the new key input after state update
    setTimeout(() => {
      keyInputRef.current?.focus();
    }, 0);
  };

  const handleRemoveField = (id: string) => {
    setFields(fields.filter((field) => field.id !== id));
  };

  const handleFieldChange = (
    id: string,
    part: "key" | "value",
    value: string
  ) => {
    setFields(
      fields.map((field) =>
        field.id === id ? { ...field, [part]: value } : field
      )
    );
  };

  function fieldsToMetadata(
    fields: { id: string; key: string; value: string }[]
  ) {
    let metadata: Record<string, string> = {};

    fields.forEach((field) => {
      if (field.key) {
        metadata[field.key] = field.value;
      }
    });

    return metadata;
  }

  function getLastField() {
    if (fields.length === 0) return null;
    return fields[fields.length - 1];
  }
  const LAST_FIELD_KEY = getLastField()?.key || "";
  const LAST_FIELD_VALUE = getLastField()?.value || "";

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <h3 className="w-full max-w-44 text-sm font-medium">Key</h3>
        <h3 className="w-full text-sm font-medium">Value</h3>
      </div>
      {fields.map((field, index) => (
        <div key={field.id} className="flex items-start space-x-2">
          <div className="w-full max-w-44">
            <Input
              ref={index === fields.length - 1 ? keyInputRef : undefined}
              placeholder="Key"
              value={field.key}
              onChange={(e) =>
                handleFieldChange(field.id, "key", e.target.value)
              }
              className="font-mono"
            />
            {errors?.[index]?.key?._errors[0] && (
              <p className="mt-1 text-xs text-red-500">
                {errors[index]?.key?._errors[0]}
              </p>
            )}
          </div>

          <div className="flex-1">
            <Input
              placeholder="Value"
              value={field.value}
              onChange={(e) =>
                handleFieldChange(field.id, "value", e.target.value)
              }
            />
            {errors?.[index]?.value?._errors[0] && (
              <p className="mt-1 text-xs text-red-500">
                {errors[index]?.value?._errors[0]}
              </p>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="size-6 shrink-0 px-1.5"
            onClick={() => handleRemoveField(field.id)}
          >
            <XIcon />
          </Button>
        </div>
      ))}
      <div className="space-y-1">
        <div className="flex items-center">
          <Button
            variant="outline"
            onClick={handleAddField}
            disabled={!LAST_FIELD_KEY || !LAST_FIELD_VALUE}
          >
            <PlusIcon size={14} />
            Add Metadata
          </Button>
        </div>

        <p
          className={cn("text-xs text-gray-500", {
            "opacity-0": LAST_FIELD_KEY && LAST_FIELD_VALUE,
          })}
        >
          Fill in the existing fields before adding more
        </p>
      </div>
      {fields.length > 0 ? (
        <div>
          <h3 className="text-sm font-medium">Preview</h3>
          <pre className="mt-2 min-h-[120px] rounded-md bg-slate-100 p-4 font-mono text-xs dark:bg-slate-800">
            <code>{JSON.stringify(fieldsToMetadata(fields), null, 2)}</code>
          </pre>
        </div>
      ) : null}
      <div className="flex items-center justify-end space-x-2 p-2">
        <Button
          onClick={() => {
            const result = fieldsSchema.safeParse(fields);
            if (!result.success) {
              setErrors(result.error.format());
              return;
            }

            setErrors(null);
            onSubmit(fieldsToMetadata(fields));
          }}
        >
          Save Metadata
        </Button>
      </div>
    </div>
  );
}
