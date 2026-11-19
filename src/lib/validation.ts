import { z } from "zod";

const emailField = z
  .string()
  .trim()
  .min(1, "Please enter your email address.")
  .pipe(z.email("Please enter a valid email address."));

export const newsletterSchema = z.object({ email: emailField });
export type NewsletterValues = z.infer<typeof newsletterSchema>;

/* ---------- Password policy (shared by Sign Up and Reset) ---------- */

export const PASSWORD_RULES = [
  {
    id: "length",
    label: "At least 8 character",
    message: "Use at least 8 characters.",
    test: (p: string) => p.length >= 8,
  },
  {
    id: "number",
    label: "At least 1 number",
    message: "Include at least 1 number.",
    test: (p: string) => /\d/.test(p),
  },
  {
    id: "case",
    label: "Both upper and lower case",
    message: "Mix upper and lower case letters.",
    test: (p: string) => /\p{Ll}/u.test(p) && /\p{Lu}/u.test(p),
  },
] as const;

export const PASSWORD_MATCH_LABEL = "Password is match";

export type PasswordCheck = { id: string; label: string; met: boolean };

export function getPasswordChecks(
  password: string,
  confirm?: string,
): PasswordCheck[] {
  const checks: PasswordCheck[] = PASSWORD_RULES.map(({ id, label, test }) => ({
    id,
    label,
    met: test(password),
  }));
  if (confirm === undefined) return checks;
  return [
    ...checks,
    {
      id: "match",
      label: PASSWORD_MATCH_LABEL,
      met: password.length > 0 && password === confirm,
    },
  ];
}

const passwordField = z
  .string()
  .min(1, "Please enter a password.")
  .superRefine((value, ctx) => {
    for (const rule of PASSWORD_RULES) {
      if (!rule.test(value)) {
        ctx.addIssue({ code: "custom", message: rule.message });
      }
    }
  });

/* ---------- Dates ---------- */

/** Parses DD/MM/YYYY. Null for malformed, impossible, pre-1900 or future dates. */
export function parseBirthDate(value: string, now = new Date()): Date | null {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value.trim());
  if (!match) return null;
  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  const isReal =
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day;
  if (!isReal || year < 1900 || date.getTime() > now.getTime()) return null;
  return date;
}

/** Formats a local calendar date (what a date picker returns) as DD/MM/YYYY. */
export function formatBirthDate(date: Date): string {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}/${date.getFullYear()}`;
}

/**
 * Turns a stored DD/MM/YYYY value back into a local-time Date for the picker,
 * or undefined when it is empty or not a valid birth date. (parseBirthDate
 * returns UTC midnight, which would shift the day in some timezones.)
 */
export function birthDateToLocalDate(
  value: string,
  now?: Date,
): Date | undefined {
  const parsed = parseBirthDate(value, now);
  if (!parsed) return undefined;
  return new Date(
    parsed.getUTCFullYear(),
    parsed.getUTCMonth(),
    parsed.getUTCDate(),
  );
}

/* ---------- Schemas ---------- */

export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1, "Please enter your password."),
  remember: z.boolean(),
});
export type LoginValues = z.infer<typeof loginSchema>;

export const signUpSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name."),
  email: emailField,
  phone: z
    .string()
    .trim()
    .min(1, "Please enter your phone number.")
    .refine((v) => /^\+?\d{8,15}$/.test(v.replace(/[\s()-]/g, "")), {
      message: "Please enter a valid phone number.",
    }),
  password: passwordField,
});
export type SignUpValues = z.infer<typeof signUpSchema>;

export const identitySchema = z.object({
  dateOfBirth: z
    .string()
    .trim()
    .refine((v) => parseBirthDate(v) !== null, {
      message: "Please select your date of birth.",
    }),
  companyName: z.string().trim().min(1, "Please enter your company name."),
});
export type IdentityValues = z.infer<typeof identitySchema>;

export const otpSchema = z.object({
  code: z.string().regex(/^\d{6}$/, "Enter the 6-digit code."),
});
export type OtpValues = z.infer<typeof otpSchema>;

export const forgotPasswordSchema = z.object({ email: emailField });
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    password: passwordField,
    confirmPassword: z.string().min(1, "Please retype your new password."),
  })
  .refine((v) => v.password === v.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;
