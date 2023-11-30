import React from "react";
import BaseCard from "./BaseCard";
import { ZendoEditor } from "@/components/Editor/ZendoEditor";

type Props = {};

const Demo = (props: Props) => {
  return (
    <BaseCard title="Try it" caption="For writers and developers.">
      <div className="m-2 w-full rounded-lg border">
        <div className="max-h-[700px] overflow-hidden rounded-b-md bg-white">
          <ZendoEditor
            onSave={() => {
              console.log("saved");
            }}
          />
        </div>
      </div>
    </BaseCard>
  );
};

export default Demo;
