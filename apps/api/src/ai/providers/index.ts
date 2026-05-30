import { AiTextProvider } from "../types.js";
import { GroqTextProvider } from "./groq.provider.js";

export const createTextProvider = (): AiTextProvider => {
  return new GroqTextProvider();
};
