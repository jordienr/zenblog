import OpenAI from "openai";
import { z } from "zod";

export const TextTypes = {
  academic_paper: {
    description:
      "This could involve a more formal and structured writing style with an emphasis on clarity and citation.",
    emoji: "📚",
    title: "Academic Paper",
  },
  email: {
    description:
      "Users may want specific feedback on the tone and clarity of their emails, especially in professional contexts.",
    emoji: "📧",
    title: "Email/Correspondence",
  },
  creative_writing: {
    description:
      "Providing insights on creativity, imagery, and emotional impact could be valuable for writers of fiction or poetry.",
    emoji: "🐉",
    title: "Creative Writing",
  },
  technical_report: {
    description:
      "Useful for individuals working on scientific or technical documents, with a focus on precision and clarity.",
    emoji: "📝",
    title: "Technical Report",
  },
  blog_post: {
    description:
      "Blogging often involves a more conversational tone, and feedback could include elements of engagement and relatability.",
    emoji: "📝",
    title: "Blog Post",
  },
  business_proposal: {
    description:
      "For users working on proposals, feedback could include persuasiveness, professionalism, and clarity.",
    emoji: "💼",
    title: "Business Proposal",
  },
  news_article: {
    description:
      "Analyzing for journalistic elements like objectivity, clarity, and conciseness could be beneficial.",
    emoji: "📰",
    title: "News Article",
  },
  social_media_post: {
    description:
      "Users crafting content for platforms like Twitter or Instagram might appreciate feedback on brevity, engagement, and hashtags.",
    emoji: "📝",
    title: "Social Media Post",
  },
  review: {
    description:
      "Product, Movie, Book, etc. Analyzing for critical elements, persuasiveness, and clarity in expressing opinions.",
    emoji: "📝",
    title: "Review",
  },
};

export const TextType = z.enum([
  "academic_paper",
  "email",
  "creative_writing",
  "technical_report",
  "blog_post",
  "business_proposal",
  "news_article",
  "social_media_post",
  "review",
]);
export const ToneAnalysis = z.enum([
  "formal",
  "informal",
  "neutral",
  "friendly",
  "persuasive",
  "authoritative",
]);
export const InsightRes = z.object({
  readability_score: z.number(),
  tone_analysis: ToneAnalysis,
  grammar_insights: z.array(z.string()),
});

export type ToneAnalysis = z.infer<typeof ToneAnalysis>;
export type InsightRes = z.infer<typeof InsightRes>;
export type TextType = z.infer<typeof TextType>;

export const getAIClient = (apiKey: string) =>
  new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true,
  });

type GenerateInsightsRes =
  | {
      insights: InsightRes;
      error: null;
    }
  | {
      insights: null;
      error: string;
    };

export async function generateInsights({
  content,
  apiKey,
}: {
  content: string;
  apiKey: string;
}): Promise<GenerateInsightsRes> {
  const ai = getAIClient(apiKey);

  const res = await ai.chat.completions.create({
    model: "gpt-3.5-turbo-0613",
    temperature: 0,
    messages: [
      {
        role: "system",
        content:
          "You are EditorAI, an AI trained to help writers improve their writing.",
      },
      {
        role: "user",
        content: `Provide me insights on this piece of writing: ${content}`,
      },
    ],
    functions: [
      {
        name: "generate_insights",
        parameters: {
          type: "object",
          properties: {
            readability_score: {
              type: "number",
              minimum: 0,
              maximum: 10,
            },
            tone_analysis: {
              type: "string",
              enum: [
                "formal",
                "informal",
                "neutral",
                "friendly",
                "persuasive",
                "authoritative",
              ],
            },
            grammar_insights: {
              type: "array",
              items: { type: "string" },
              description:
                "Tips to improve grammar. Each item is a sentence. Example: ",
            },
          },
          required: ["readability_score", "tone_analysis", "grammar_insights"],
        },
      },
    ],
  });

  const functionWasCalled = res.choices[0]?.finish_reason === "function_call";
  if (functionWasCalled) {
    const resJson = JSON.parse(
      res.choices[0]?.message.function_call?.arguments || "no response"
    );
    const parsedRes = InsightRes.safeParse(resJson);

    if (parsedRes.success) {
      return { insights: parsedRes.data, error: null };
    } else {
      console.error(parsedRes.error);
      return {
        error:
          "Error parsing OpenAI response. Check the console for more details.",
        insights: null,
      };
    }
  } else {
    console.error("Function was not called");
    return { error: "Function was not called", insights: null };
  }
}
