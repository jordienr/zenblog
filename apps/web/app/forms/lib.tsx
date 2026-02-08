import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import React from "react";
import { z } from "zod";

/**
 * todo:
 * - support defaultValue
 * - textarea
 * - radio
 * - createFormRenderer so ppl can use their own components
 * - support input text types (email, number, tel, url)
 * - start giving a fuck about using any
 */

declare module "zod" {
  interface ZodType<
    Output = any,
    Def extends z.ZodTypeDef = z.ZodTypeDef,
    Input = Output
  > {
    label(label: string | React.ReactNode): this;
    password(): this;
    placeholder(placeholder: string): this;
    select<T extends z.ZodEnum<[string, ...string[]]>>(
      this: T,
      values: { label: string; value: z.infer<T> }[]
    ): this;
    defaultValue(defaultValue: any): this;
  }
}

// Label extension
z.ZodType.prototype.label = function (label: string | React.ReactNode) {
  (this as any)._def.label = label;
  return this;
};

// Password extension
z.ZodType.prototype.password = function () {
  (this as any)._def.typeName = "ZodPassword";
  return this;
};

// placeholder extension
z.ZodType.prototype.placeholder = function (placeholder: string) {
  (this as any)._def.placeholder = placeholder;
  return this;
};

// select extension
z.ZodType.prototype.select = function <
  T extends z.ZodEnum<[string, ...string[]]>
>(this: T, values: { label: string; value: z.infer<T> }[]) {
  (this as any)._def.values = values;
  return this;
};

// defaultValue extension
z.ZodType.prototype.defaultValue = function (defaultValue: any) {
  (this as any)._def.defaultValue = defaultValue;
  return this;
};

const InputGroup = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("zf-input-group flex flex-col space-y-2", className)}>
    {children}
  </div>
);

// Renderer
export function createForm(schema: z.ZodObject<any>) {
  const schemaProperties = Object.entries(schema.shape);
  const noProperties = schemaProperties.length === 0;

  const formNodes = schemaProperties.map(([key, value]: [string, any]) => {
    const { typeName, label, placeholder } = value._def;

    const isOptional = typeName === "ZodOptional";
    const finalTypeName = isOptional
      ? value._def.innerType._def.typeName
      : typeName;

    // console.log({ isOptional, finalTypeName, value });

    const sharedProps = {
      required: !isOptional,
      name: key,
      id: key,
      defaultValue: value._def.defaultValue,
    };

    if (finalTypeName === "ZodString") {
      const isEmail = value._def.checks?.some(
        (check: any) => check.kind === "email"
      );

      const inputType = isEmail ? "email" : "text";

      return (
        <InputGroup key={key}>
          <Label htmlFor={key}>{label}</Label>
          <Input {...sharedProps} type={inputType} placeholder={placeholder} />
        </InputGroup>
      );
    }

    if (finalTypeName === "ZodBoolean") {
      return (
        <InputGroup key={key} className="flex items-center gap-2">
          <Checkbox {...sharedProps} />
          <Label htmlFor={key}>{label}</Label>
        </InputGroup>
      );
    }

    if (finalTypeName === "ZodDate") {
      return (
        <InputGroup key={key}>
          <Label htmlFor={key}>{label}</Label>
          <Input {...sharedProps} placeholder={placeholder} type="date" />
        </InputGroup>
      );
    }

    if (finalTypeName === "ZodPassword") {
      return (
        <InputGroup key={key}>
          <Label htmlFor={key}>{label}</Label>
          <Input {...sharedProps} placeholder={placeholder} type="password" />
        </InputGroup>
      );
    }

    if (finalTypeName === "ZodEnum") {
      return (
        <InputGroup key={key}>
          {/* <Debugger value={value} /> */}
          <Label htmlFor={key}>{label}</Label>
          <Select {...sharedProps}>
            <SelectTrigger>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {(value as any)._def.values.map((option: any) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </InputGroup>
      );
    }

    if (finalTypeName === "ZodNumber") {
      return (
        <InputGroup key={key}>
          <Label htmlFor={key}>{label}</Label>
          <Input {...sharedProps} placeholder={placeholder} type="number" />
        </InputGroup>
      );
    } else return <pre key={key}>{JSON.stringify(value, null, 2)}</pre>;
  });

  const Component = (props: React.FormHTMLAttributes<HTMLFormElement>) => (
    <form {...props}>
      <div className="input-groups">{formNodes}</div>
      {!noProperties && (
        <div className="flex  py-4">
          <Button className="w-full">Submit</Button>
        </div>
      )}
    </form>
  );

  return Component;
}

function Debugger({ value }: { value: any }) {
  return <pre>{JSON.stringify(value, null, 2)}</pre>;
}
