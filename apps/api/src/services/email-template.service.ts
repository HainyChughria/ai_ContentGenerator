export const buildEmailShell = ({
  title,
  preview,
  body,
  actionLabel,
  actionUrl
}: {
  title: string;
  preview: string;
  body: string;
  actionLabel?: string;
  actionUrl?: string;
}) => {
  return `
    <div style="display:none;max-height:0;overflow:hidden;">${preview}</div>
    <div style="font-family:Arial,sans-serif;background:#f6f7f9;padding:32px;">
      <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:8px;padding:28px;">
        <h1 style="font-size:22px;line-height:1.3;margin:0 0 16px;color:#111827;">${title}</h1>
        <div style="font-size:15px;line-height:1.6;color:#374151;">${body}</div>
        ${
          actionLabel && actionUrl
            ? `<p style="margin:24px 0;"><a href="${actionUrl}" style="background:#111827;color:#ffffff;text-decoration:none;padding:12px 16px;border-radius:6px;display:inline-block;font-weight:600;">${actionLabel}</a></p>`
            : ""
        }
        <p style="font-size:12px;line-height:1.5;color:#6b7280;margin-top:24px;">
          If you did not request this email, you can safely ignore it.
        </p>
      </div>
    </div>
  `;
};
