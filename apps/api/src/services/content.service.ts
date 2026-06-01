import { Types } from "mongoose";
import { ContentModel } from "../models/content.model.js";
import { UserModel } from "../models/user.model.js";
import { AppError } from "../utils/app-error.js";
import { createActivity } from "./activity.service.js";
import { buildContentPrompt } from "../ai/prompts/content.prompts.js";
import { createTextProvider } from "../ai/providers/index.js";
import { GenerateTextInput } from "../ai/types.js";

const GENERATION_CREDIT_COST = 1;

const estimateTokens = (text: string) => {
  return Math.ceil(text.trim().split(/\s+/).filter(Boolean).length * 1.35);
};

export const getContentHistory = async (userId: string) => {
  const contents = await ContentModel.find({ userId })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  return contents.map((content) => ({
    id: content._id.toString(),
    type: content.type,
    prompt: content.prompt,
    result: content.result,
    tokensUsed: content.tokensUsed,
    createdAt: content.createdAt
  }));
};

export const deleteContent = async (userId: string, contentId: string) => {
  if (!Types.ObjectId.isValid(contentId)) {
    throw new AppError("Invalid content id", 400);
  }

  const deleted = await ContentModel.findOneAndDelete({
    _id: contentId,
    userId
  });

  if (!deleted) {
    throw new AppError("Content not found", 404);
  }
};

export const streamGeneratedContent = async function* (
  userId: string,
  input: GenerateTextInput
) {
  const user = await UserModel.findById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (user.credits < GENERATION_CREDIT_COST) {
    throw new AppError("Not enough credits to generate content", 402);
  }

  if (!user.onboarding?.completedAt) {
    throw new AppError("Complete onboarding before generating content", 409);
  }

  const provider = createTextProvider();
  const messages = buildContentPrompt({
    ...input,
    businessContext: {
      businessName: user.onboarding.businessName ?? "",
      niche: user.onboarding.niche ?? "",
      audience: user.onboarding.audience ?? "",
      offer: user.onboarding.offer ?? "",
      brandVoice: user.onboarding.brandVoice ?? "",
      website: user.onboarding.website ?? "",
      socialHandles: {
        linkedin: user.onboarding.socialHandles?.linkedin ?? "",
        twitter: user.onboarding.socialHandles?.twitter ?? "",
        instagram: user.onboarding.socialHandles?.instagram ?? ""
      },
      contentGoals: user.onboarding.contentGoals ?? []
    }
  });
  let result = "";

  for await (const chunk of provider.streamText({
    messages,
    temperature: 0.75,
    maxTokens: 900
  })) {
    result += chunk.text;
    yield {
      event: "chunk" as const,
      data: {
        text: chunk.text
      }
    };
  }

  const tokensUsed = estimateTokens(`${input.request} ${result}`);

  const content = await ContentModel.create({
    userId,
    type: input.contentType,
    prompt: input.request,
    result,
    tokensUsed
  });

  user.credits = Math.max(user.credits - GENERATION_CREDIT_COST, 0);
  await user.save();

  await createActivity({
    userId,
    type: "generation",
    title: `Generated ${input.contentType} content`,
    metadata: {
      contentId: content._id.toString(),
      tokensUsed
    }
  });

  yield {
    event: "done" as const,
    data: {
      content: {
        id: content._id.toString(),
        type: content.type,
        prompt: content.prompt,
        result: content.result,
        tokensUsed,
        createdAt: content.createdAt
      },
      creditsRemaining: user.credits
    }
  };
};
