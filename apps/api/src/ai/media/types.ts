export type AspectRatio = "1:1" | "16:9" | "9:16" | "4:5";

export type GenerateImageInput = {
  prompt: string;
  aspectRatio: AspectRatio;
  sourceText?: string;
};

export type ImageDimensions = {
  width: number;
  height: number;
};

export type GeneratedImageBinary = {
  buffer: Buffer;
  mimeType: string;
  provider: string;
  model: string;
};

export interface AiImageProvider {
  name: string;
  generateImage(input: GenerateImageInput): Promise<GeneratedImageBinary>;
}
