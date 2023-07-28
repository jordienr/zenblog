import Image from "next/image";

const Logo = () => (
  <div className="ml-1 text-xl font-bold text-slate-800">
    zendo<span className="text-orange-500">blog</span>
  </div>
);

export default function ZendoLogo() {
  return (
    <Image
      src="/logo.svg"
      alt="An orange cut in half, or, the zendo.blog logo"
      width={32}
      height={32}
    />
  );
}
