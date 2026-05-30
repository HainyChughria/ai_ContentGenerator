export type AspectRatio = "1:1" | "16:9" | "9:16" | "4:5";

export type GeneratedImage = {
  id: string;
  prompt: string;
  sourceText: string;
  aspectRatio: AspectRatio;
  imageUrl: string;
  cloudinaryPublicId: string;
  width: number | null;
  height: number | null;
  format: string;
  bytes: number;
  provider: string;
  model: string;
  createdAt: string;
};

export type GenerateImagePayload = {
  prompt: string;
  aspectRatio: AspectRatio;
  sourceText?: string;
};
