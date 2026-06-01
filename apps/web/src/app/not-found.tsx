import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#07080a] px-5 text-center text-[#f1eef4]">
      <section className="max-w-md rounded-[8px] border border-[#24232a] bg-[#151419] p-8">
        <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-[#d7a6ff]">
          404
        </p>
        <h1 className="mt-3 text-[32px] font-black tracking-[-0.055em]">
          Page not found
        </h1>
        <p className="mt-3 text-sm leading-6 text-[#9b95a0]">
          This workspace route does not exist or has moved.
        </p>
        <Link
          className="mt-6 inline-flex h-10 items-center rounded-[3px] bg-[#d7a6ff] px-4 text-sm font-black text-[#1c1024]"
          href="/dashboard"
        >
          Back to dashboard
        </Link>
      </section>
    </main>
  );
}
