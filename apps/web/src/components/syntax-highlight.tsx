import { Prism as ReactSyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";

export const SyntaxHighlight = ({
  code,
  language,
  showLineNumbers = false,
}: {
  code: string;
  language: string;
  showLineNumbers?: boolean;
}) => {
  return (
    <ReactSyntaxHighlighter
      language={language}
      style={dracula}
      showLineNumbers={showLineNumbers}
      customStyle={{
        backgroundColor: "transparent",
        padding: 0,
      }}
    >
      {code}
    </ReactSyntaxHighlighter>
  );
};
