import Image from "next/image";

export default function ZendoLogo() {
  return (
    <div className="flex items-center gap-1.5 text-lg font-medium tracking-tight">
      <Image
        src="/static/logo.svg"
        width={24}
        height={24}
        alt="Zenblog logotype"
      />
      zenblog
    </div>
  );
}
