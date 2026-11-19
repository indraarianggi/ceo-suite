export const OTP_LENGTH = 6;
export const RESEND_SECONDS = 119;

export function sanitizeOtp(raw: string, length = OTP_LENGTH): string {
  return raw.replace(/\D/g, "").slice(0, length);
}

export function formatCountdown(totalSeconds: number): string {
  const s = Math.max(0, Math.ceil(totalSeconds));
  const mm = String(Math.floor(s / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}
