import { randomBytes } from "crypto";

export function generateConfirmationNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const raw = randomBytes(3).toString("hex");
  const randomPart = parseInt(raw, 16)
    .toString(36)
    .toUpperCase()
    .padStart(6, "0");

  return `LL-${timestamp}-${randomPart}`;
}
