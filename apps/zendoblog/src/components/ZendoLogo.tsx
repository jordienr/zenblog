import { useAppStore } from "@/store/app";

const Logo = () => (
  <div className="ml-1 text-xl font-bold text-slate-800">
    zendo<span className="text-orange-500">blog</span>
  </div>
);

export default function ZendoLogo() {
  const { loading } = useAppStore();

  if (loading) {
    return <>Loading</>;
  }
  return <Logo />;
}
