"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { subscribeToNewsletter } from "@/lib/newsletter";
import { newsletterSchema, type NewsletterValues } from "@/lib/validation";

export function NewsletterForm() {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, isSubmitSuccessful },
  } = useForm<NewsletterValues>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(values: NewsletterValues) {
    await subscribeToNewsletter(values);
    reset();
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full flex-col gap-2 md:w-auto"
    >
      <div className="flex items-start gap-4">
        <Controller
          name="email"
          control={control}
          render={({ field, fieldState }) => (
            <Field
              data-invalid={fieldState.invalid}
              className="w-70 max-w-full"
            >
              <Label htmlFor="newsletter-email" className="sr-only">
                Email address
              </Label>
              <Input
                {...field}
                id="newsletter-email"
                type="email"
                autoComplete="email"
                placeholder="Enter your email"
                aria-invalid={fieldState.invalid}
                aria-describedby={
                  fieldState.invalid ? "newsletter-email-error" : undefined
                }
                className="h-11 border-slate-300 bg-white px-3.5 text-body-16-regular text-grey-950 placeholder:text-slate-500"
              />
              {fieldState.invalid && (
                <FieldError
                  id="newsletter-email-error"
                  errors={[fieldState.error]}
                />
              )}
            </Field>
          )}
        />
        <Button type="submit" size="md" disabled={isSubmitting}>
          Subscribe
        </Button>
      </div>
      <p role="status" className="text-body-13-regular text-slate-500">
        {isSubmitSuccessful ? "Thanks! You’re subscribed." : ""}
      </p>
    </form>
  );
}
