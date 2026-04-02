export function ObjectRenderer({ object }: { object: any }) {
  const keys = Object.keys(object);

  return (
    <div className="divide-y rounded-md border">
      {keys.map((key) => (
        <div key={key} className="flex gap-2 p-2 text-sm hover:bg-slate-50">
          <p className="w-full max-w-[160px] font-medium">{key}</p>
          <p className="w-full font-mono">{object[key]}</p>
        </div>
      ))}
    </div>
  );
}
