export type ContentType = "blog" | "linkedin" | "twitter" | "instagram";

export type GenerateTextInput = {
  contentType: ContentType;
  tone: string;
  prompt: string;
};

export type AiMessage = {
  role: "system" | "user";
  content: string;
};

export type StreamTextInput = {
  messages: AiMessage[];
  temperature?: number;
  maxTokens?: number;
};

export type StreamChunk = {
  text: string;
  tokensUsed?: number;
};

export interface AiTextProvider {
  name: string;
  streamText(input: StreamTextInput): AsyncIterable<StreamChunk>;
}
