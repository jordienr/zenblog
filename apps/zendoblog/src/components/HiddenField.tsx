import { useState } from "react";
import { CgEye } from "react-icons/cg";

type Props = {
  value: string;
};
export function HiddenField({ value }: Props) {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);

  return (
    <div className="flex w-full gap-1 rounded-md border bg-white">
      <input
        className="border-none font-mono text-black !shadow-none"
        type={show ? "text" : "password"}
        value={value}
        disabled
      />
      <button onClick={handleClick} className="btn btn-icon m-1">
        <CgEye className="text-slate-600" size="20" />
      </button>
    </div>
  );
}
