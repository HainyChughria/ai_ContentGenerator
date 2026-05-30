import { api } from "./api";
import { normalizedApiBaseUrl } from "./api";
import { GeneratedContent, GenerateContentPayload } from "@/types/content";

export const contentApi = {
  history: async () => {
    const { data } = await api.get<{ contents: GeneratedContent[] }>(
      "/content/history"
    );
    return data.contents;
  },
  delete: async (contentId: string) => {
    await api.delete(`/content/${contentId}`);
  },
  streamGenerate: async (
    payload: GenerateContentPayload,
    onChunk: (text: string) => void
  ) => {
    const token = window.localStorage.getItem("access_token");
    const response = await fetch(`${normalizedApiBaseUrl}/content/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok || !response.body) {
      throw new Error("Could not start generation");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let finalContent: GeneratedContent | null = null;
    let creditsRemaining: number | null = null;

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      const messages = buffer.split("\n\n");
      buffer = messages.pop() ?? "";

      for (const message of messages) {
        const eventLine = message
          .split("\n")
          .find((line) => line.startsWith("event:"));
        const dataLine = message
          .split("\n")
          .find((line) => line.startsWith("data:"));

        if (!eventLine || !dataLine) {
          continue;
        }

        const event = eventLine.replace("event:", "").trim();
        const data = JSON.parse(dataLine.replace("data:", "").trim());

        if (event === "chunk") {
          onChunk(data.text);
        }

        if (event === "done") {
          finalContent = data.content;
          creditsRemaining = data.creditsRemaining;
        }

        if (event === "error") {
          throw new Error(data.message ?? "Generation failed");
        }
      }
    }

    return {
      content: finalContent,
      creditsRemaining
    };
  }
};
