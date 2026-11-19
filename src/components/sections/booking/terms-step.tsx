"use client";

import { AuthButton } from "@/components/shared/auth-button";
import { Checkbox } from "@/components/ui/checkbox";
import { termsAndConditions } from "@/data/terms";

type TermsStepProps = {
  accepted: boolean;
  onAcceptedChange: (accepted: boolean) => void;
  onContinue: () => void;
  loading: boolean;
};

export function TermsStep({
  accepted,
  onAcceptedChange,
  onContinue,
  loading,
}: TermsStepProps) {
  return (
    <div className="flex flex-col items-center gap-9">
      <section
        aria-label="Terms and conditions"
        className="flex w-full flex-col gap-4 rounded-lg border border-grey-100 bg-white p-4 text-body-13-regular text-grey-800"
      >
        {termsAndConditions.map((section) => (
          <div key={section.heading} className="flex flex-col gap-2">
            <h2 className="text-body-13-bold">{section.heading}</h2>
            {section.groups.map((group, index) => (
              <div key={group.title ?? index} className="flex flex-col gap-1">
                {group.title && (
                  <h3 className="text-body-13-medium">{group.title}</h3>
                )}
                <ul className="flex list-disc flex-col gap-1 pl-5">
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))}
      </section>

      <label className="flex w-full cursor-pointer items-center gap-2 text-body-16-medium text-grey-500">
        <Checkbox
          checked={accepted}
          onCheckedChange={onAcceptedChange}
          className="border-primary"
        />
        I have read and agree to the terms and conditions.
      </label>

      <AuthButton
        type="button"
        disabled={!accepted}
        loading={loading}
        onClick={onContinue}
        className="max-w-128"
      >
        Continue to Payment
      </AuthButton>
    </div>
  );
}
