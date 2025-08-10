import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useEffect, useRef, useState } from "react";
import { BrowserWrapper } from "./browser-wrapper";
import { TsApiExample } from "./ts-api-example";
import { HttpApiExample } from "./http-api-example";
import { LaptopMinimal, PencilLine } from "lucide-react";
import { TbBrandTypescript } from "react-icons/tb";
import { TbHttpGet } from "react-icons/tb";
import { cn } from "@/lib/utils";

export const HeroImages = () => {
  const FEATURES = [
    {
      id: "editor",
      title: "Editor",
      icon: <PencilLine className="mr-2 size-5 opacity-80" />,
      content: (
        <BrowserWrapper>
          <img
            src="/static/hero/editor.png"
            alt="Editor"
            className="h-full w-full rounded-lg border-blue-300 object-cover shadow-xl"
          />
        </BrowserWrapper>
      ),
    },
    {
      id: "dashboard",
      title: "Dashboard",
      icon: <LaptopMinimal className="mr-2 size-5 opacity-80" />,
      content: (
        <BrowserWrapper>
          <img
            src="/static/hero/dashboard.png"
            alt="Dashboard"
            className="h-full w-full rounded-lg border-orange-300 object-cover shadow-xl"
          />
        </BrowserWrapper>
      ),
    },
    {
      id: "tsapi",
      title: "TypeScript",
      content: <TsApiExample />,
      icon: <TbBrandTypescript className="mr-2 size-5 opacity-80" />,
    },
    {
      id: "httpapi",
      title: "HTTP",
      content: <HttpApiExample />,
      icon: <TbHttpGet className="mr-2 size-5 opacity-80" />,
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentFeature = FEATURES[currentIndex];

  return (
    <Tabs value={currentFeature?.id} className="w-full">
      <TabsList className="flex h-16 w-full justify-start space-x-2 overflow-x-auto md:justify-center md:space-x-4">
        {FEATURES.map((f, index) => (
          <TabsTrigger
            key={`${f.id}-trigger`}
            value={f.id}
            onClick={() => setCurrentIndex(index)}
            className={cn(
              "relative flex min-w-fit cursor-pointer items-center overflow-hidden rounded-full border px-4 py-2 font-semibold opacity-70 data-[state=active]:border-b data-[state=active]:border-slate-300 data-[state=active]:bg-slate-100 data-[state=active]:text-slate-800 data-[state=active]:opacity-100"
            )}
          >
            <span className="opacity-70">{f.icon}</span>
            {f.title}
          </TabsTrigger>
        ))}
      </TabsList>
      {FEATURES.map((f) => (
        <TabsContent
          key={`${f.id}-content`}
          value={f.id}
          className="mx-auto max-w-6xl rounded-2xl border border-orange-400 bg-gradient-to-b from-orange-300 to-orange-500 px-20 pb-4 pt-20"
        >
          {f.content}
        </TabsContent>
      ))}
    </Tabs>
  );
};
