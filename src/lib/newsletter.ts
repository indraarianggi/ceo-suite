import type { NewsletterValues } from "@/lib/validation";

export async function subscribeToNewsletter(
  values: NewsletterValues,
): Promise<{ ok: true }> {
  void values;
  await new Promise((resolve) => setTimeout(resolve, 600));
  return { ok: true };
}
