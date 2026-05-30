type LogMetadata = Record<string, unknown>;

const redactKeys = ["token", "secret", "password", "apiKey", "authorization"];

const sanitizeMetadata = (metadata: LogMetadata = {}) => {
  return Object.fromEntries(
    Object.entries(metadata).map(([key, value]) => {
      const shouldRedact = redactKeys.some((redactKey) =>
        key.toLowerCase().includes(redactKey.toLowerCase())
      );

      return [key, shouldRedact ? "[REDACTED]" : value];
    })
  );
};

const writeLog = (
  level: "info" | "warn" | "error",
  message: string,
  metadata?: LogMetadata
) => {
  const payload = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...sanitizeMetadata(metadata)
  };

  if (level === "error") {
    console.error(payload);
    return;
  }

  if (level === "warn") {
    console.warn(payload);
    return;
  }

  console.log(payload);
};

export const logger = {
  info: (message: string, metadata?: LogMetadata) =>
    writeLog("info", message, metadata),
  warn: (message: string, metadata?: LogMetadata) =>
    writeLog("warn", message, metadata),
  error: (message: string, metadata?: LogMetadata) =>
    writeLog("error", message, metadata)
};
