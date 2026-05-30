import Groq from "groq-sdk";
import { env } from "../../config/env.js";
import { AiTextProvider, StreamTextInput } from "../types.js";

export class GroqTextProvider implements AiTextProvider {
  name = "groq";
  private client: Groq;

  constructor() {
    this.client = new Groq({
      apiKey: env.groqApiKey
    });
  }

  async *streamText(input: StreamTextInput) {
    const stream = await this.client.chat.completions.create({
      model: env.groqModel,
      messages: input.messages,
      temperature: input.temperature ?? 0.7,
      max_tokens: input.maxTokens ?? 900,
      stream: true
    });

    for await (const chunk of stream) {
      const text = chunk.choices[0]?.delta?.content ?? "";

      if (text) {
        yield { text };
      }
    }
  }
}
