import { Settings } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "../ui/dialog";
import { useSubscriptionQuery } from "@/queries/subscription";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { PRICING_PLANS } from "@/lib/pricing.constants";
import { useQueryClient } from "@tanstack/react-query";

export function ZenblogToolbar() {
  const sub = useSubscriptionQuery();
  const queryClient = useQueryClient();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="absolute left-2 top-2 h-8 w-8"
          size="icon"
        >
          <Settings size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <div className="flex max-w-xs flex-col gap-2">
          <h2 className="text-lg font-semibold">Set subscription</h2>
          <p className="text-sm text-zinc-500">Subscription query data</p>
          <div className="grid grid-cols-2 gap-2">
            <pre>{JSON.stringify(sub.data, null, 2)}</pre>
          </div>
          <Select
            onValueChange={(val) => {
              queryClient.setQueryData(["subscription"], {
                ...sub.data,
                plan: val,
              });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a plan" />
            </SelectTrigger>
            <SelectContent>
              {PRICING_PLANS.map((plan) => (
                <SelectItem key={plan.id} value={plan.id}>
                  {plan.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            onValueChange={(val) => {
              queryClient.setQueryData(["subscription"], {
                ...sub.data,
                status: val,
              });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an interval" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Monthly</SelectItem>
              <SelectItem value="year">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </DialogContent>
    </Dialog>
  );
}
