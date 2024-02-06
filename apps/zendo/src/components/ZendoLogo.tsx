import Image from "next/image";

const Logo = () => (
  <div className="ml-1 text-xl font-bold text-slate-800">
    zendo<span className="text-orange-500">blog</span>
  </div>
);

export default function ZendoLogo() {
  return (
    <div className="bg-gradient-to-br from-slate-700 to-slate-400 bg-clip-text text-lg font-bold tracking-tight text-transparent">
      zen
      <span className="bg-gradient-to-br from-orange-600 to-orange-400 bg-clip-text text-transparent">
        blog
      </span>
    </div>
  );
}
