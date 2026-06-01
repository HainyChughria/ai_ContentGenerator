"use client";

import { Check, Clipboard, ImageIcon, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
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
    <div className="min-h-[calc(100vh-70px)] px-5 py-8 xl:px-[42px]">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-[#d7a6ff]">
            Generation History
          </p>
          <h1 className="mt-3 text-[34px] font-black tracking-[-0.055em] text-[#f4f1f6]">
            Saved content drafts
          </h1>
          <p className="mt-3 text-sm leading-6 text-[#9b95a0]">
            Review, copy, delete, or turn approved text into image assets.
          </p>
        </div>
        <Link
          className="flex h-11 items-center justify-center rounded-[3px] bg-[#d7a6ff] px-5 font-mono text-[13px] font-black uppercase tracking-[0.12em] text-[#1c1024]"
          href="/dashboard/generate"
        >
          New generation
        </Link>
      </div>

      {error ? (
        <div className="mb-5 rounded-[4px] border border-red-900/50 bg-red-950/30 p-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      {isLoading ? (
        <div className="rounded-[5px] border border-[#2b2a31] bg-[#1c1b1f] p-5 text-sm text-[#8e8793]">
          Loading history...
        </div>
      ) : history.length ? (
        <div className="space-y-5">
          {history.map((content) => (
            <article
              key={content.id}
              className="rounded-[5px] border border-[#2b2a31] bg-[#1c1b1f]"
            >
              <div className="flex flex-col gap-3 border-b border-[#25242a] p-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="font-mono text-[12px] uppercase tracking-[0.16em] text-[#d7a6ff]">
                    {content.type}
                  </p>
                  <p className="mt-2 text-[18px] font-black text-[#f0edf2]">
                    {content.prompt}
                  </p>
                  <p className="mt-1 font-mono text-[11px] uppercase text-[#817b86]">
                    {new Date(content.createdAt).toLocaleString()} -{" "}
                    {content.tokensUsed} tokens
                  </p>
                </div>
                <div className="flex gap-2">
                  <IconButton
                    label="Generate image from content"
                    disabled={isGenerating}
                    onClick={() => createImage(content.id)}
                  >
                    <ImageIcon className="h-4 w-4" />
                  </IconButton>
                  <IconButton
                    label="Copy content"
                    onClick={() => copyContent(content.id, content.result)}
                  >
                    {copiedId === content.id ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Clipboard className="h-4 w-4" />
                    )}
                  </IconButton>
                  <IconButton
                    label="Delete content"
                    danger
                    onClick={() => deleteContent(content.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </IconButton>
                </div>
              </div>
              <div className="whitespace-pre-wrap p-5 text-[15px] leading-7 text-[#ded8e2]">
                {content.result}
              </div>
              {imageContentId === content.id ? (
                <p className="border-t border-[#25242a] p-5 text-sm text-[#8e8793]">
                  Creating image from this content...
                </p>
              ) : null}
            </article>
          ))}
        </div>
      ) : (
        <div className="grid min-h-[420px] place-items-center rounded-[5px] border border-[#2b2a31] bg-[#1c1b1f] text-center">
          <div>
            <Clipboard className="mx-auto h-8 w-8 text-[#5f5964]" />
            <p className="mt-4 text-sm text-[#8e8793]">
              No generations yet. Create your first content draft.
            </p>
            <Link
              className="mt-5 inline-flex h-10 items-center rounded-[3px] bg-[#d7a6ff] px-4 text-sm font-black text-[#1c1024]"
              href="/dashboard/generate"
            >
              Open content sandbox
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function IconButton({
  label,
  children,
  danger,
  disabled,
  onClick
}: {
  label: string;
  children: React.ReactNode;
  danger?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      aria-label={label}
      className={`rounded-[3px] border border-[#2b2a31] p-2 hover:bg-[#25242a] disabled:opacity-50 ${
        danger ? "text-red-300" : "text-[#e6e0ea]"
      }`}
      disabled={disabled}
      type="button"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
