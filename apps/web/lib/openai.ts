import { createOpenAI } from "@ai-sdk/openai";

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const models = {
  "4o": openai("gpt-4o"),
  "4turbo": openai("gpt-4-turbo"),
  "35": openai("gpt-3.5-turbo"),
} as const;
