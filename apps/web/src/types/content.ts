export type ContentType =
  | "blog"
  | "linkedin"
  | "twitter"
  | "instagram"
  | "email"
  | "ad";

export type GeneratedContent = {
  id: string;
  type: ContentType;
  prompt: string;
  result: string;
  tokensUsed: number;
  createdAt: string;
};

export type GenerateContentPayload = {
  contentType: ContentType;
  tone: string;
  request: string;
};
