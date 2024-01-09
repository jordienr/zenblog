import Image from "next/image";

const Logo = () => (
  <div className="ml-1 text-xl font-bold text-slate-800">
    zendo<span className="text-orange-500">blog</span>
  </div>
);

export default function ZendoLogo() {
  return (
    <div className="font-bold text-lg bg-gradient-to-br from-black to-slate-600 text-transparent bg-clip-text tracking-tight">
      zen<span className="bg-gradient-to-br from-orange-600 to-orange-400 text-transparent bg-clip-text">blog</span>
    </div>
  );
}
