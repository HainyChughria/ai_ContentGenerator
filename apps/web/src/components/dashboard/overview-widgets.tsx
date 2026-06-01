"use client";

import {
  BarChart3,
  BrainCircuit,
  FileBox,
  ImageIcon,
  MoreVertical,
  RefreshCcw,
  Sparkles,
  Upload
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const panelClass =
  "rounded-[5px] border border-[#2b2a31] bg-[#1c1b1f] shadow-[0_1px_0_rgba(255,255,255,0.02)_inset]";

export function BalanceCard() {
  return (
    <motion.article
      className={cn(panelClass, "flex h-[168px] items-center justify-between p-5")}
      whileHover={{ y: -2 }}
    >
      <div>
        <p className="font-mono text-[12px] uppercase tracking-[0.22em] text-[#d7cfe0]">
          Balance
        </p>
        <p className="mt-3 text-[26px] font-black tracking-[-0.05em] text-white drop-shadow-[2px_2px_0_rgba(0,0,0,0.9)]">
          14,280 <span className="text-[11px] font-medium text-[#817a86]">CR</span>
        </p>
        <p className="mt-3 font-mono text-[12px] text-[#46dcff]">↗ +12% REFILL</p>
      </div>
      <div className="grid h-[68px] w-[68px] place-items-center rounded-full bg-[conic-gradient(#d8a5ff_0_75%,#4b4253_75%_100%)]">
        <div className="grid h-[56px] w-[56px] place-items-center rounded-full bg-[#1c1b1f] text-[12px] font-semibold text-white">
          75%
        </div>
      </div>
    </motion.article>
  );
}

export function ThroughputCard() {
  return (
    <motion.article className={cn(panelClass, "h-[168px] p-5")} whileHover={{ y: -2 }}>
      <div className="flex items-start justify-between">
        <div>
          <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-[#d7cfe0]">
            Throughput
          </p>
          <p className="mt-2 text-[27px] font-black tracking-[-0.04em] text-white">
            3,842 <span className="text-[11px] font-medium text-[#817a86]">GENS</span>
          </p>
        </div>
        <BarChart3 className="h-5 w-5 text-[#42d9ff]" />
      </div>
      <div className="relative mx-auto mt-4 h-[52px] w-[210px] overflow-hidden">
        <div className="absolute left-0 top-7 h-px w-12 rotate-[-12deg] bg-[#226579]" />
        <div className="absolute left-10 top-5 h-px w-16 rotate-[-28deg] bg-[#2b7c92]" />
        <div className="absolute left-[88px] top-[23px] h-px w-[76px] rotate-[42deg] bg-[#2d7890]" />
        <div className="absolute left-[132px] top-[27px] h-px w-12 rotate-[-45deg] bg-[#2b7890]" />
        <div className="absolute left-[166px] top-[21px] h-px w-12 rotate-[64deg] bg-[#2b7890]" />
        <div className="absolute right-2 top-9 h-px w-8 rotate-[-75deg] bg-[#2b7890]" />
      </div>
    </motion.article>
  );
}

export function LatencyCard() {
  const bars = ["h-[20px]", "h-[30px]", "h-[42px]", "h-[25px]", "h-[35px]", "h-[30px]", "h-[35px]"];

  return (
    <motion.article className={cn(panelClass, "h-[168px] p-5")} whileHover={{ y: -2 }}>
      <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-[#d7a6ff]">
        Latency
      </p>
      <p className="mt-2 text-[27px] font-black tracking-[-0.04em] text-white">
        84.2 <span className="text-[11px] font-medium text-[#817a86]">MS</span>
      </p>
      <div className="mt-7 flex h-[42px] items-end gap-[6px]">
        {bars.map((height, index) => (
          <div
            key={`${height}-${index}`}
            className={cn(
              "w-full bg-[#52485e]",
              height,
              index === 2 || index === 6 ? "bg-[#d7a6ff]" : "",
              index === 5 ? "bg-[#8c789d]" : ""
            )}
          />
        ))}
      </div>
    </motion.article>
  );
}

const activityItems = [
  {
    title: "Neural Architecture Design Proposal",
    meta: "SDXL // 02:14 UTC",
    status: "IDLE",
    icon: "neural"
  },
  {
    title: "Marketing Strategy Q4 v2.docx",
    meta: "GPT-4T // 01:58 UTC",
    status: "IDLE",
    icon: "file"
  },
  {
    title: "Fine-tuning Custom Llama-3-70b",
    meta: "TRAINING // 84% COMPLETE",
    status: "ACTIVE",
    icon: "ring"
  }
];

export function StreamActivity() {
  return (
    <section>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-mono text-[16px] uppercase tracking-[0.16em] text-[#e2dce8]">
          Stream Activity
        </h2>
        <span className="font-mono text-[12px] uppercase text-[#d7a6ff]">Archive</span>
      </div>
      <div className={cn(panelClass, "overflow-hidden")}>
        {activityItems.map((item, index) => (
          <div
            key={item.title}
            className={cn(
              "grid min-h-[82px] grid-cols-[56px_1fr_auto_auto] items-center gap-4 border-[#25242a] px-4",
              index < activityItems.length - 1 && "border-b"
            )}
          >
            <div className="grid h-[50px] w-[50px] place-items-center bg-[#17161a] text-[#d7a6ff]">
              {item.icon === "neural" ? <BrainCircuit className="h-6 w-6" /> : null}
              {item.icon === "file" ? <FileBox className="h-5 w-5 text-[#77717c]" /> : null}
              {item.icon === "ring" ? (
                <div className="h-5 w-5 rounded-full border border-[#d7a6ff]" />
              ) : null}
            </div>
            <div>
              <p className="text-[17px] font-semibold text-[#f2eef5]">{item.title}</p>
              <p className="mt-1 font-mono text-[12px] uppercase tracking-[0.04em] text-[#827b89]">
                {item.meta}
              </p>
            </div>
            <div className="flex items-center gap-2 font-mono text-[12px] text-[#f0eaff]">
              <span
                className={cn(
                  "h-2 w-2 rounded-full",
                  item.status === "ACTIVE" ? "bg-[#d7a6ff]" : "bg-[#42d9ff]"
                )}
              />
              {item.status}
            </div>
            <MoreVertical className="h-5 w-5 text-[#6b6470]" />
          </div>
        ))}
      </div>
    </section>
  );
}

const functions = [
  { title: "Text Synthesizer", subtitle: "LLAMA-3 / GPT-4", icon: Sparkles, tone: "violet" },
  { title: "Vision Engine", subtitle: "SDXL / MIDJOURNEY", icon: ImageIcon, tone: "cyan" },
  { title: "Data Ingestion", subtitle: "JSON / CSV / PDF", icon: Upload, tone: "gray" }
];

export function FunctionsRail() {
  return (
    <aside className="space-y-5">
      <h2 className="font-mono text-[16px] uppercase tracking-[0.16em] text-[#e2dce8]">
        Functions
      </h2>
      <div className="space-y-3">
        {functions.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className={cn(panelClass, "flex h-[72px] items-center gap-4 px-4")}
            >
              <div
                className={cn(
                  "grid h-10 w-10 place-items-center rounded-[2px]",
                  item.tone === "violet" && "bg-[#34283f] text-[#d7a6ff]",
                  item.tone === "cyan" && "bg-[#18333b] text-[#42d9ff]",
                  item.tone === "gray" && "bg-[#34323a] text-[#d8d3dd]"
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[15px] font-bold text-[#f1edf4]">{item.title}</p>
                <p className="mt-1 font-mono text-[10px] uppercase text-[#7d7682]">
                  {item.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="bg-[#09090b] p-5">
        <div className="mb-5 flex items-center justify-between">
          <p className="font-mono text-[14px] uppercase tracking-[0.16em] text-[#e7e1eb]">
            Node Status
          </p>
          <span className="h-2 w-2 rounded-full bg-[#00d084]" />
        </div>
        <div className="mb-3 flex items-center justify-between font-mono text-[10px] uppercase text-[#8b8490]">
          <span>Primary Cluster</span>
          <span>99.98%</span>
        </div>
        <div className="h-[3px] bg-[#252229]">
          <div className="h-full w-[99%] bg-[#00d084]" />
        </div>
      </div>
    </aside>
  );
}

export function OverviewActions() {
  return (
    <div className="flex gap-3">
      <button
        className="flex h-[44px] items-center gap-3 rounded-[3px] border border-[#2b2a31] bg-[#28262b] px-5 font-mono text-[13px] font-bold uppercase tracking-[0.16em] text-[#f1edf4]"
        type="button"
      >
        <RefreshCcw className="h-4 w-4" />
        History
      </button>
      <button
        className="flex h-[44px] items-center gap-3 rounded-[3px] bg-[#d7a6ff] px-6 font-mono text-[13px] font-black uppercase tracking-[0.16em] text-[#1c1024]"
        type="button"
      >
        +
        New Project
      </button>
    </div>
  );
}
