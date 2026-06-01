"use client";

import { ArrowRight, BrainCircuit, Check, ChevronDown, CirclePlay, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ForgeLogo } from "@/components/shared/forge-logo";

const partners = ["VOLTRIX", "NEURALIS", "CORE_AI", "SYNTHOS", "DATAFORGE"];

const pricing = [
  {
    tier: "Developer",
    price: "$0",
    items: ["10 starter credits", "Business onboarding", "Content history"],
    action: "Create Account"
  },
  {
    tier: "Professional",
    price: "$79",
    items: ["More monthly credits", "Content + image sandboxes", "Cloud asset gallery"],
    action: "Start Trial",
    featured: true
  },
  {
    tier: "Business",
    price: "Custom",
    items: ["Team workflows", "Custom brand rules", "Priority support"],
    action: "Contact Sales"
  }
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#07080a] text-[#f1eef4]">
      <header className="mx-auto flex h-12 max-w-[1480px] items-center px-5">
        <Link className="text-[13px] font-black tracking-[-0.05em]" href="/">
          ContentForge
        </Link>
        <nav className="ml-8 hidden gap-7 text-[11px] font-medium text-[#d5ceda] md:flex">
          <Link href="#">Product</Link>
          <Link href="#">Solutions</Link>
          <Link href="#">Pricing</Link>
          <Link href="#">Docs</Link>
        </nav>
        <div className="ml-auto flex items-center gap-3 text-[11px]">
          <Link className="text-[#d5ceda]" href="/login">
            Sign in
          </Link>
          <Link
            className="rounded-full bg-[#f5f0f7] px-4 py-2 font-bold text-[#09090b]"
            href="/dashboard"
          >
            Get Started
          </Link>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-[#111216] px-5 pb-28 pt-28 text-center">
        <div className="absolute left-1/2 top-0 h-[460px] w-[640px] -translate-x-1/2 rounded-full bg-[#d7a6ff]/[0.06] blur-3xl" />
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="relative mx-auto max-w-[850px]"
          initial={{ opacity: 0, y: 14 }}
          transition={{ duration: 0.45 }}
        >
          <div className="mx-auto mb-6 w-fit rounded-full border border-[#443449] bg-[#141018] px-4 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#d7a6ff]">
            Business-ready AI content
          </div>
          <h1 className="text-[28px] font-black tracking-[-0.06em] md:text-[34px]">
            The AI workspace for brand-aware content generation
          </h1>
          <p className="mx-auto mt-5 max-w-[620px] text-[14px] leading-relaxed text-[#c6c0ca]">
            ContentForge helps businesses onboard their brand once, then generate
            posts, emails, ads, blogs, and campaign visuals with context already attached.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link
              className="rounded-[6px] bg-[#d7a6ff] px-6 py-3 text-[13px] font-bold text-[#160d1d] shadow-[0_0_35px_rgba(215,166,255,0.25)]"
              href="/dashboard"
            >
              Start Forging Free
            </Link>
            <button
              className="flex items-center gap-2 rounded-[6px] border border-[#2a2930] bg-[#0b0c0f] px-5 py-3 text-[13px] font-bold text-[#f0edf3]"
              type="button"
            >
              <CirclePlay className="h-4 w-4" />
              View Demo
            </button>
          </div>
        </motion.div>

        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="relative mx-auto mt-16 max-w-[820px] rounded-[10px] border border-[#222229] bg-[#1b1b20] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.55)]"
          initial={{ opacity: 0, y: 18 }}
          transition={{ delay: 0.12, duration: 0.45 }}
        >
          <div className="grid h-[330px] gap-3 md:grid-cols-[260px_1fr]">
            <div className="rounded-[4px] border border-[#292830] bg-[#202026] p-4 text-left">
              <div className="mb-3 h-[2px] w-8 bg-[#6c6671]" />
              <div className="mb-8 h-[2px] w-32 bg-[#34333a]" />
              <div className="grid grid-cols-2 gap-3">
                <div className="grid h-16 place-items-center rounded-[2px] bg-[#28282e] shadow-lg">
                  <span className="h-2 w-2 rounded-full bg-[#42d9ff]" />
                </div>
                <div className="grid h-16 place-items-center rounded-[2px] bg-[#28282e] shadow-lg">
                  <span className="h-2 w-2 rounded-full bg-[#d7a6ff]" />
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-[4px] border border-[#292830] bg-[linear-gradient(145deg,#25242a,#19191e)]">
              <div className="absolute left-5 top-5 h-[2px] w-16 bg-[#55505a]" />
              <div className="absolute right-4 top-4 h-4 w-4 rounded-full border border-[#3b3941]" />
              <div className="absolute left-0 top-[155px] h-px w-full rotate-[-12deg] bg-[#6d5b7b]" />
              <div className="absolute left-0 top-[188px] h-px w-full rotate-[-6deg] bg-[#26697a]" />
              <div className="absolute bottom-6 right-5 flex items-end gap-[3px]">
                <span className="h-3 w-[2px] bg-[#42d9ff]" />
                <span className="h-4 w-[2px] bg-[#d7a6ff]" />
                <span className="h-5 w-[2px] bg-[#42d9ff]" />
                <span className="h-4 w-[2px] bg-[#d7a6ff]" />
                <span className="h-3 w-[2px] bg-[#42d9ff]" />
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="mx-auto max-w-[900px] px-5 py-24 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#9b95a0]">
          Built for business content teams
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-12 font-mono text-[11px] uppercase text-[#69636d]">
          {partners.map((partner) => (
            <span key={partner}>{partner}</span>
          ))}
        </div>
      </section>

      <section className="border-t border-[#101115] px-5 py-28">
        <div className="mx-auto max-w-[960px]">
          <div className="mb-16 flex items-end justify-between gap-6">
            <div>
              <h2 className="text-[17px] font-bold">Precision tools for the modern stack</h2>
              <p className="mt-3 max-w-[440px] text-[12px] leading-relaxed text-[#9a949f]">
                Every module is engineered for zero-latency inference and surgical
                data control.
              </p>
            </div>
            <Link
              className="flex items-center gap-2 text-[12px] font-bold text-[#d7a6ff]"
              href="/dashboard"
            >
              Explore documentation
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="grid gap-7 md:grid-cols-[2fr_1fr]">
            <div className="rounded-[8px] border border-[#1d1e23] bg-[#121316] p-8 shadow-[0_24px_70px_rgba(0,0,0,0.32)]">
              <Sparkles className="h-6 w-6 text-[#d7a6ff]" />
              <h3 className="mt-8 text-[16px] font-bold">Context-Aware Content Sandbox</h3>
              <p className="mt-4 max-w-[560px] text-[12px] leading-relaxed text-[#a49da8]">
                Generate blogs, LinkedIn posts, X posts, Instagram captions, email
                campaigns, and ad copy from your saved business context.
              </p>
              <div className="mt-8 h-[210px] rounded-[3px] bg-[repeating-linear-gradient(170deg,#25262a_0_2px,#111216_2px_9px)] shadow-inner" />
            </div>

            <div className="rounded-[8px] border border-[#1d1e23] bg-[#121316] p-8 shadow-[0_24px_70px_rgba(0,0,0,0.32)]">
              <BrainCircuit className="h-6 w-6 text-[#42d9ff]" />
              <h3 className="mt-8 text-[16px] font-bold">Image Sandbox</h3>
              <p className="mt-4 text-[12px] leading-relaxed text-[#a49da8]">
                Turn campaign ideas and approved text into Cloudinary-hosted visual
                assets for social, stories, ads, and launch pages.
              </p>
              <div className="mt-8 h-[156px] rounded-[3px] bg-[radial-gradient(circle_at_58%_40%,#d7a6ff_0_4%,#42d9ff_5%_10%,#111216_35%)]" />
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-28 text-center">
        <p className="text-[13px] font-bold">Scaled to your needs</p>
        <p className="mt-3 text-[12px] text-[#9b95a0]">
          Simple plans for solo builders, growing brands, and content teams.
        </p>
        <div className="mx-auto mt-14 grid max-w-[920px] gap-7 md:grid-cols-3">
          {pricing.map((plan) => (
            <div
              key={plan.tier}
              className={`rounded-[8px] border p-8 text-left ${
                plan.featured
                  ? "border-[#574160] bg-[#16131b] shadow-[0_0_55px_rgba(215,166,255,0.18)]"
                  : "border-[#1d1e23] bg-[#121316]"
              }`}
            >
              {plan.featured ? (
                <div className="mx-auto mb-4 w-fit rounded-full bg-[#d7a6ff] px-4 py-1 font-mono text-[9px] font-bold uppercase text-[#1b1022]">
                  Preferred
                </div>
              ) : null}
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#8f8995]">
                {plan.tier}
              </p>
              <p className="mt-4 text-[30px] font-black tracking-[-0.06em]">
                {plan.price}
                {plan.price.startsWith("$") ? (
                  <span className="text-[11px] font-medium text-[#9b95a0]"> /month</span>
                ) : null}
              </p>
              <div className="mt-7 space-y-4 text-[12px] text-[#d9d3de]">
                {plan.items.map((item) => (
                  <p key={item} className="flex items-center gap-2">
                    <Check className="h-3 w-3 text-[#42d9ff]" />
                    {item}
                  </p>
                ))}
              </div>
              <Link
                className={`mt-9 flex h-10 items-center justify-center rounded-[3px] border text-[12px] font-bold ${
                  plan.featured
                    ? "border-[#d7a6ff] bg-[#d7a6ff] text-[#170d1d]"
                    : "border-[#2b2b31] text-[#f1eef4]"
                }`}
                href="/dashboard"
              >
                {plan.action}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="px-5 py-24">
        <div className="mx-auto grid max-w-[920px] gap-8 md:grid-cols-2">
          {[
            "ContentForge helped us stop rewriting the same brand brief for every post. The output finally sounds like our business.",
            "The content and image sandboxes make campaign production feel like one connected workflow instead of scattered prompt experiments."
          ].map((quote, index) => (
            <div
              key={quote}
              className="rounded-[7px] border border-[#1d1e23] bg-[#121316] p-6 text-left"
            >
              <p className="text-[13px] leading-relaxed text-[#ddd8e1]">"{quote}"</p>
              <div className="mt-5 flex items-center gap-3">
                <div
                  className={`h-8 w-8 rounded-full ${
                    index === 0 ? "bg-[#5b5262]" : "bg-[#18343b]"
                  }`}
                />
                <div>
                  <p className="text-[11px] font-bold uppercase">Research Lead</p>
                  <p className="font-mono text-[9px] uppercase text-[#827b86]">
                    Core AI Foundry
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-5 py-28">
        <h2 className="text-center text-[13px] font-bold">Frequently Asked Questions</h2>
        <div className="mx-auto mt-10 max-w-[550px] space-y-3">
          <div className="rounded-[5px] border border-[#1d1e23] bg-[#121316] p-5">
            <div className="flex items-center justify-between text-[13px] font-bold">
              Does onboarding affect every generation?
              <ChevronDown className="h-4 w-4" />
            </div>
            <p className="mt-4 text-[12px] leading-relaxed text-[#9d96a2]">
              Yes. The content sandbox uses your saved business, audience, offer,
              brand voice, website, social handles, and goals whenever it generates.
            </p>
          </div>
          <div className="rounded-[5px] border border-[#1d1e23] bg-[#121316] p-5">
            <div className="flex items-center justify-between text-[13px] font-bold">
              Security & VPC isolation
              <ChevronDown className="h-4 w-4" />
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#101115] px-5 py-16">
        <div className="mx-auto grid max-w-[960px] gap-12 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <ForgeLogo compact />
            <p className="mt-5 max-w-[210px] text-[11px] leading-relaxed text-[#8e8793]">
              Brand-aware AI content generation for business owners and marketing
              teams.
            </p>
          </div>
          <FooterLinks title="Platform" links={["Features", "Models", "Pricing"]} />
          <FooterLinks title="Resources" links={["Docs", "API", "Security"]} />
          <FooterLinks title="Connect" links={["X", "Git"]} />
        </div>
        <div className="mx-auto mt-16 flex max-w-[960px] justify-between font-mono text-[9px] uppercase text-[#77717c]">
          <span>© 2024 ContentForge AI. Built for business content teams.</span>
          <span>Privacy &nbsp;&nbsp; Terms</span>
        </div>
      </footer>
    </main>
  );
}

function FooterLinks({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h3 className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#f0edf4]">
        {title}
      </h3>
      <div className="mt-5 space-y-3 text-[11px] text-[#908995]">
        {links.map((link) => (
          <p key={link}>{link}</p>
        ))}
      </div>
    </div>
  );
}
