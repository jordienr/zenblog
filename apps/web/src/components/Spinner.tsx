import { Loader } from "lucide-react";

export default function Spinner() {
  return (
    <div className="flex animate-spin items-center justify-center py-4 text-3xl">
      <Loader className="text-orange-500" />
    </div>
  );
}
