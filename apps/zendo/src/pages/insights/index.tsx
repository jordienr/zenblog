import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Loader, Loader2, Save, Stars, Trash } from "lucide-react";
import Link from "next/link";
import React, { PropsWithChildren } from "react";
import { InsightRes, ToneAnalysis, generateInsights } from "@/lib/ai/insights";
import TextTypePicker from "@/components/Insights/TextTypePicker";

type Props = {};

function InsightBlock({
  title,
  children,
}: PropsWithChildren<{ title: string }>) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border bg-white px-2 py-2 shadow-sm">
      <h2 className="text-sm font-medium text-slate-600">{title}</h2>
      {children}
    </div>
  );
}

function ToneAnalysisResult({ tone }: { tone: ToneAnalysis }) {
  const toneMap = {
    formal: "🎩",
    informal: "🤘",
    neutral: "🫱",
    friendly: "🫶",
    persuasive: "🤝",
    authoritative: "✊",
  };

  return (
    <div className="flex items-center gap-1">
      <span className="text-2xl">{toneMap[tone]}</span>
      <span className="capitalize">{tone}</span>
    </div>
  );
}

const Insights = (props: Props) => {
  const [key, setKey] = React.useState<string>("");
  const [res, setRes] = React.useState<InsightRes | null>({
    readability_score: 80,
    tone_analysis: "friendly",
    grammar_insights: [
      "The word 'pizza' is mentioned too many times. Consider using synonyms or rephrasing to avoid repetition.",
      "The phrase 'test of time' is used metaphorically. Consider providing a clearer explanation to enhance understanding.",
      "The phrase 'each element plays a crucial role' can be strengthened by providing specific examples of how each ingredient contributes to the overall flavor.",
      "The word 'craftsmanship' can be replaced with a more engaging term to evoke a stronger emotional response.",
      "The phrase 'slice of happiness' can be expanded upon to provide a vivid description of the joyful experience of eating Margherita pizza.",
    ],
  });
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const lsKey = window.localStorage.getItem("insights-openai-key");
    if (lsKey) {
      setKey(lsKey);
    }
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
    ],
    content: ` <h1>The Timeless Elegance of Margherita Pizza</h1>

    <p>In the vast realm of pizza creations, one classic has stood the test of time, delighting taste buds and capturing
        hearts—the Margherita pizza. Its simplicity is its strength, and its flavors, a symphony of the finest
        ingredients.</p>

    <h2>A History of Royalty</h2>
    <p>Named after Queen Margherita of Italy in the late 19th century, this pizza is a true royal affair. Legend has it
        that a Neapolitan pizzaiolo crafted this masterpiece to honor the queen, using the colors of the Italian flag:
        red tomatoes, white mozzarella, and green basil.</p>

    <h2>The Perfect Trio</h2>
    <p>At first glance, the Margherita might seem unassuming, but each element plays a crucial role. The vibrant red
        tomato sauce, made from ripe, sun-kissed tomatoes, adds a burst of freshness. The creamy, milky mozzarella
        blankets the crust, providing a rich and smooth texture. Finally, the fragrant green basil leaves offer a herbal
        note that elevates the entire experience.</p>

    <h2>Simplicity, the Ultimate Sophistication</h2>
    <p>What makes the Margherita endure through culinary trends and fads? Its simplicity is its secret weapon. In a
        world that constantly craves novelty, this pizza remains a timeless icon, reminding us that sometimes, less
        truly is more.</p>

    <h2>Craftsmanship in Every Bite</h2>
    <p>Beyond its historical roots, the Margherita pizza is a testament to craftsmanship. From the perfectly kneaded
        dough to the precise layering of ingredients, each pizza is a work of art. It's not just a meal; it's an
        experience.</p>

    <h2>A Slice of Happiness</h2>
    <p>Whether enjoyed in the bustling streets of Naples, the heart of Rome, or your local pizzeria, the Margherita
        pizza transcends borders. It's a slice of happiness that brings people together, celebrating the simplicity
        and beauty of good food.</p>

    <p>In a world filled with pizza variations, the Margherita remains a culinary sovereign—a delicious reminder that
        sometimes, the classics are classic for a reason. So, the next time you savor a slice of Margherita pizza,
        know that you're indulging in a dish that has been cherished for generations—a true masterpiece in the world
        of pizza.</p>`,
    onUpdate(d) {},
  });

  function keySubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const key = e.currentTarget.key.value;
    console.log(key);
    window.localStorage.setItem("insights-openai-key", key);
    setKey(key);
  }

  async function handleGenerateClick() {
    setLoading(true);
    const content = editor?.getHTML();

    if (!content) {
      window.alert("Please write something");
      return;
    } else if (!key) {
      window.alert("Please enter your OpenAI key");
      return;
    }

    const { insights, error } = await generateInsights({
      content,
      apiKey: key,
    });

    if (error) {
      window.alert("Something went wrong, please try again");
      return;
    }

    setRes(insights);

    setLoading(false);
  }

  return (
    <div className="flex h-screen w-full justify-center gap-4 bg-slate-100/50  px-2">
      <div className="flex flex-grow flex-col pb-2 font-mono">
        <nav className="p-2">
          <Link href="/">⛩️</Link>
        </nav>
        <div className=" flex flex-grow justify-center overflow-auto rounded-xl border bg-white px-2 py-4 pb-24">
          <div className="prose-sm prose prose-h1:font-medium mb-24">
            <EditorContent
              width={"100%"}
              className="h-full max-h-[90vh]"
              editor={editor}
            />
          </div>
        </div>
      </div>
      <div className="flex w-[400px] flex-col gap-3">
        <div className="flex items-center justify-between py-2">
          <h2 className="text-lg font-medium">Insights</h2>
          <button
            onClick={handleGenerateClick}
            disabled={loading}
            className="group rounded-xl border border-blue-600 bg-gradient-to-b from-blue-500 to-blue-600 px-3 py-1.5 font-medium text-slate-50 shadow-sm transition-all hover:text-white"
          >
            {loading ? (
              <Loader2 size="20" className="animate-spin" />
            ) : (
              <div className="flex items-center gap-2 ">
                <Stars
                  size="20"
                  className="text-blue-200 group-hover:text-blue-50"
                />
                Generate
              </div>
            )}
          </button>
        </div>
        {key ? (
          <div className="flex items-center justify-between rounded-xl border bg-white p-2 shadow-sm">
            <div className="flex flex-col">
              <div className="text-xs font-medium">KEY</div>
              <div className="font-mono text-sm">{key.slice(0, 7)}...</div>
            </div>
            <button
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
              onClick={() => {
                window.localStorage.removeItem("insights-openai-key");
                setKey("");
              }}
            >
              <Trash size="18" />
            </button>
          </div>
        ) : (
          <form onSubmit={keySubmit}>
            <div>
              <label htmlFor="key">OpenAI Key</label>
              <input type="text" name="key" id="key" />
              <span className="font-mono text-xs">
                It will be stored in your browser
              </span>
            </div>
            <div className="actions">
              <button type="submit" className="btn btn-primary">
                <Save size="20" /> Save
              </button>
            </div>
          </form>
        )}
        {res ? (
          <div className="space-y-3">
            <TextTypePicker onTextTypeChange={(c) => console.log(c)} />
            <InsightBlock title="Grammar tips">
              <ul className="ml-4 list-disc space-y-3 text-sm">
                {res.grammar_insights.map((val) => (
                  <li key={val}>{val}</li>
                ))}
              </ul>
            </InsightBlock>
            <InsightBlock title="Readability score">
              <p className="font-mono text-2xl">{res.readability_score}</p>
            </InsightBlock>
            <InsightBlock title="Tone analysis">
              {/* <p>{res.tone_analysis}</p> */}
              <ToneAnalysisResult tone={res.tone_analysis} />
            </InsightBlock>
            <InsightBlock title="Words"></InsightBlock>
          </div>
        ) : null}
        {/* <pre className="overflow-auto rounded-xl border bg-white p-2 text-xs shadow-sm">
          {JSON.stringify(res, null, 2)}
        </pre> */}
      </div>
    </div>
  );
};

export default Insights;
