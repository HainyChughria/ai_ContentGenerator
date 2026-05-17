type AuthShellProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

export function AuthShell({ title, subtitle, children }: AuthShellProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted px-4 py-10">
      <section className="w-full max-w-md rounded-lg border bg-background p-6 shadow-sm">
        <div className="mb-6 space-y-2">
          <h1 className="text-2xl font-semibold tracking-normal">{title}</h1>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
        {children}
      </section>
    </main>
  );
}
