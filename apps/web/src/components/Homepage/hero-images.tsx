import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useEffect, useRef, useState } from "react";
import { BrowserWrapper } from "./browser-wrapper";
import { TsApiExample } from "./ts-api-example";
import { HttpApiExample } from "./http-api-example";
import { LaptopMinimal, PencilLine } from "lucide-react";
import { TbBrandTypescript } from "react-icons/tb";
import { TbHttpGet } from "react-icons/tb";

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
      <TabsList className="mb-4 w-full space-x-4">
        {FEATURES.map((f, index) => (
          <TabsTrigger
            key={`${f.id}-trigger`}
            value={f.id}
            onClick={() => setCurrentIndex(index)}
            className="relative flex cursor-pointer items-center overflow-hidden rounded-full border px-4 py-2 text-lg font-semibold opacity-70 data-[state=active]:border data-[state=active]:border-b data-[state=active]:border-slate-800 data-[state=active]:bg-slate-900 data-[state=active]:text-slate-100 data-[state=active]:opacity-100"
          >
            {f.icon}
            {f.title}
          </TabsTrigger>
        ))}
      </TabsList>
      {FEATURES.map((f) => (
        <TabsContent key={`${f.id}-content`} value={f.id}>
          {f.content}
        </TabsContent>
      ))}
    </Tabs>
  );
};
