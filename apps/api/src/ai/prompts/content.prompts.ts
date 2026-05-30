import { ContentType } from "../types.js";

const contentInstructions: Record<ContentType, string> = {
  blog: "Write a structured blog section with a strong hook, useful subpoints, and a concise conclusion.",
  linkedin: "Write a professional LinkedIn post with a clear point of view, readable spacing, and a soft call to action.",
  twitter: "Write a concise X/Twitter post. Keep it sharp, specific, and under 280 characters unless the user asks for a thread.",
  instagram: "Write an Instagram caption with a strong opening line, natural tone, and relevant hashtag suggestions."
};

export const buildContentPrompt = ({
  contentType,
  tone,
  prompt
}: {
  contentType: ContentType;
  tone: string;
  prompt: string;
}) => {
  return [
    {
      role: "system" as const,
      content: [
        "You are an expert SaaS content strategist and copywriter.",
        "Create polished, original marketing content.",
        "Do not invent statistics, customer names, or guarantees.",
        "Avoid generic filler and avoid saying you are an AI.",
        `Content format: ${contentType}.`,
        `Tone: ${tone}.`,
        contentInstructions[contentType]
      ].join(" ")
    },
    {
      role: "user" as const,
      content: prompt
    }
  ];
};
