import { ContentType } from "../types.js";

const contentInstructions: Record<ContentType, string> = {
  blog: "Write a structured blog section with a strong hook, useful subpoints, and a concise conclusion.",
  linkedin: "Write a professional LinkedIn post with a clear point of view, readable spacing, and a soft call to action.",
  twitter: "Write a concise X/Twitter post. Keep it sharp, specific, and under 280 characters unless the user asks for a thread.",
  instagram: "Write an Instagram caption with a strong opening line, natural tone, and relevant hashtag suggestions.",
  email: "Write a clear email campaign draft with a subject line, preview text, body copy, and one call to action.",
  ad: "Write paid social ad copy with primary text, headline options, and a concise call to action."
};

export const buildContentPrompt = ({
  contentType,
  tone,
  request,
  businessContext
}: {
  contentType: ContentType;
  tone: string;
  request: string;
  businessContext: {
    businessName: string;
    niche: string;
    audience: string;
    offer: string;
    brandVoice: string;
    website: string;
    socialHandles: {
      linkedin: string;
      twitter: string;
      instagram: string;
    };
    contentGoals: string[];
  };
}) => {
  const socialContext = Object.entries(businessContext.socialHandles)
    .filter(([, value]) => value)
    .map(([network, value]) => `${network}: ${value}`)
    .join(", ");

  return [
    {
      role: "system" as const,
      content: [
        "You are an expert SaaS content strategist and copywriter.",
        "Create polished, original marketing content using the saved business onboarding context as the source of truth.",
        "Do not invent statistics, customer names, or guarantees.",
        "Avoid generic filler and avoid saying you are an AI.",
        `Content format: ${contentType}.`,
        `Tone: ${tone}.`,
        `Business: ${businessContext.businessName}.`,
        `Niche: ${businessContext.niche}.`,
        `Audience: ${businessContext.audience}.`,
        `Offer: ${businessContext.offer}.`,
        `Brand voice: ${businessContext.brandVoice}.`,
        businessContext.website
          ? `Website: ${businessContext.website}.`
          : "Website: not provided.",
        socialContext ? `Social handles: ${socialContext}.` : "Social handles: not provided.",
        businessContext.contentGoals.length
          ? `Content goals: ${businessContext.contentGoals.join(", ")}.`
          : "Content goals: not provided.",
        contentInstructions[contentType]
      ].join(" ")
    },
    {
      role: "user" as const,
      content: `Generate this for the business: ${request}`
    }
  ];
};
