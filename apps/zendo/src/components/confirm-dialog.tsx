import { PropsWithChildren, useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "./ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Button } from "./ui/button";

type Props = {
  label?: string;
  trigger?: JSX.Element;
  title?: string;
  description?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  dialogBody?: JSX.Element;
};
export function ConfirmDialog({
  trigger,
  title,
  onConfirm,
  onCancel,
  label,
  description,
  dialogBody,
}: PropsWithChildren<Props>) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {trigger ? (
            trigger
          ) : (
            <Button>{label ? label : "Missing label"}</Button>
          )}
        </DialogTrigger>
        <DialogContent className="max-w-xs md:w-[400px]">
          <DialogHeader>
            <h2 className="font-medium">{title ? title : "Are you sure?"}</h2>
            <p className="text-zinc-600">
              {description ? description : "Are you sure you want to continue?"}
            </p>
          </DialogHeader>
          {dialogBody}
          <div className="flex items-center justify-end gap-2">
            <Button
              onClick={() => {
                onCancel && onCancel();
                setOpen(false);
              }}
              type="button"
              variant={"ghost"}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => {
                onConfirm();
                setOpen(false);
              }}
            >
              Confirm
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
