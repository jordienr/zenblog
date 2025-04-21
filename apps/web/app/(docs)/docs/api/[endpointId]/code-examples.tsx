import { CodeBlock } from "@/components/CodeBlock";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EndpointCodeExamples } from "app/api/public/[...route]/public-api.types";

export function CodeExamples({ examples }: { examples: EndpointCodeExamples }) {
  const keys = Object.keys(examples) as (keyof EndpointCodeExamples)[];

  return (
    <div className="flex flex-col gap-4">
      <Tabs defaultValue={keys[0]}>
        <TabsList>
          {keys.map((key) => (
            <TabsTrigger key={key} value={key}>
              {key}
            </TabsTrigger>
          ))}
        </TabsList>
        {keys.map((key) => (
          <TabsContent key={key} value={key}>
            <div className="flex flex-col gap-4">
              {examples[key].map((example) => (
                <CodeBlock key={example.description} hideHeader>
                  {`// ${example.description}
${example.code.trim()}
`}
                </CodeBlock>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
