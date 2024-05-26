import Image from "next/image";

const Logo = () => (
  <div className="ml-1 text-xl font-bold text-slate-800">
    zendo<span className="text-orange-500">blog</span>
  </div>
);

export default function ZendoLogo() {
  return (
    <div className="flex items-center gap-1.5 text-lg font-medium tracking-tight">
      <span className="mb-2 text-3xl">🗻</span>
      zenblog
    </div>
  );
}
