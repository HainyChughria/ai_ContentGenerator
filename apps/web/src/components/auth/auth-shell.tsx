import Link from "next/link";
import { ForgeLogo } from "@/components/shared/forge-logo";

type AuthShellProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

export function AuthShell({ title, subtitle, children }: AuthShellProps) {
  return (
    <main className="grid min-h-screen bg-[#07080a] text-[#f1eef4] lg:grid-cols-[minmax(0,1fr)_520px]">
      <section className="relative hidden overflow-hidden border-r border-[#17171d] p-10 lg:flex lg:flex-col">
        <div className="absolute left-1/2 top-24 h-[360px] w-[520px] -translate-x-1/2 rounded-full bg-[#d7a6ff]/[0.07] blur-3xl" />
        <Link className="relative z-10" href="/">
          <ForgeLogo />
        </Link>
        <div className="relative z-10 mt-auto max-w-xl">
          <p className="font-mono text-[12px] uppercase tracking-[0.2em] text-[#d7a6ff]">
            AI content workspace
          </p>
          <h2 className="mt-5 text-[44px] font-black leading-[0.95] tracking-[-0.065em] text-white">
            Generate content from real business context.
          </h2>
          <p className="mt-6 max-w-md text-[15px] leading-7 text-[#9b95a0]">
            Onboard your business once, then create posts, campaigns, ads, blogs,
            and image assets without rebuilding the prompt every time.
          </p>
        </div>
      </section>

      <section className="flex items-center justify-center px-5 py-10">
        <div className="w-full max-w-md rounded-[8px] border border-[#24232a] bg-[#151419] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.4)]">
          <Link className="mb-8 flex lg:hidden" href="/">
            <ForgeLogo />
          </Link>
          <div className="mb-7 space-y-3">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#d7a6ff]">
              Secure workspace
            </p>
            <h1 className="text-[30px] font-black tracking-[-0.055em] text-[#f4f1f6]">
              {title}
            </h1>
            <p className="text-sm leading-6 text-[#9b95a0]">{subtitle}</p>
          </div>
          {children}
        </div>
      </section>
    </main>
  );
}
