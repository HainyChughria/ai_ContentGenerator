"use client";

import { Check, Clipboard, Image, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { useContentStore } from "@/store/content-store";
import { useImageStore } from "@/store/image-store";

export default function HistoryPage() {
  const { history, isLoading, error, fetchHistory, deleteContent } =
    useContentStore();
  const { generateFromContent, isGenerating } = useImageStore();
  const [copiedId, setCopiedId] = useState("");
  const [imageContentId, setImageContentId] = useState("");

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const copyContent = async (contentId: string, result: string) => {
    await navigator.clipboard.writeText(result);
    setCopiedId(contentId);
  };

  const createImage = async (contentId: string) => {
    setImageContentId(contentId);
    const image = await generateFromContent(contentId, "1:1");

    if (image) {
      setImageContentId("");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Generation History</h1>
        <p className="text-sm text-muted-foreground">
          Review, copy, and delete generated content.
        </p>
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      {isLoading ? (
        <Card>
          <p className="text-sm text-muted-foreground">Loading history...</p>
        </Card>
      ) : history.length ? (
        <div className="space-y-4">
          {history.map((content) => (
            <Card key={content.id}>
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-semibold capitalize">
                    {content.type}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(content.createdAt).toLocaleString()} ·{" "}
                    {content.tokensUsed} tokens
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    aria-label="Generate image from content"
                    className="rounded-md border p-2 hover:bg-muted disabled:opacity-50"
                    type="button"
                    disabled={isGenerating}
                    onClick={() => createImage(content.id)}
                  >
                    <Image className="h-4 w-4" />
                  </button>
                  <button
                    aria-label="Copy content"
                    className="rounded-md border p-2 hover:bg-muted"
                    type="button"
                    onClick={() => copyContent(content.id, content.result)}
                  >
                    {copiedId === content.id ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Clipboard className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    aria-label="Delete content"
                    className="rounded-md border p-2 text-destructive hover:bg-muted"
                    type="button"
                    onClick={() => deleteContent(content.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <p className="mb-3 text-sm text-muted-foreground">
                Prompt: {content.prompt}
              </p>
              <div className="whitespace-pre-wrap rounded-md border bg-muted p-4 text-sm leading-6">
                {content.result}
              </div>
              {imageContentId === content.id ? (
                <p className="mt-3 text-sm text-muted-foreground">
                  Creating image...
                </p>
              ) : null}
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <p className="text-sm text-muted-foreground">
            No generations yet. Create your first piece from the{" "}
            <Link className="font-medium underline" href="/dashboard/generate">
              AI Generator
            </Link>
            .
          </p>
        </Card>
      )}
    </div>
  );
}
