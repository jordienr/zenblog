import { CodeBlock } from "@/components/CodeBlock";
import { endpoints } from "app/api/public/[...route]/public-api.constants";
import { DocsPageLayout } from "app/ui/docs-page-layout";

export default function AiRules() {
  return (
    <DocsPageLayout
      title="AI Rules"
      description="Paste this into your AI builder or IDE to help it write the integration for zenblog."
      tocItems={[]}
    >
      <div className="mt-8 max-w-2xl overflow-x-auto">
        <CodeBlock language="text">
          {`This is the documentation to integrate zenblog into your website.
Zenblog is a headless CMS that allows you to create and manage your blog. It will host images and videos for you.
You can install the zenblog package with npm i zenblog to use the typed http client for the API. Make sure the package version is 1.2.0 or higher.
To integrate zenblog into your website, you just need to make an HTTP request to the API with the Blog ID which you can find in the Zenblog dashboard. The content is returned as an html string. You have to render it to the dom. You can parse it however you want and change the styles and dom elements for your website as you need.

Here is the schema for the API and typescript/javascript client:
        
${JSON.stringify(endpoints, null, 2)
  .trim()
  .replace(/^```text\n/, "")
  .replace(/\n```$/, "")
  // replace escaped quotes with actual quotes
  .replace(/\\"/g, '"')
  .replace(/\\'/g, "'")
  .replace(/\\`/g, "`")
  .replace(/\\n/g, "\n")
  .replace(/\\t/g, "\t")
  .replace(/\\r/g, "\r")
  .replace(/\\f/g, "\f")}
        `}
        </CodeBlock>
      </div>
    </DocsPageLayout>
  );
}
