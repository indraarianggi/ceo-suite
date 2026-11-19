"use client";

import { useMemo, useState } from "react";

import { AuthHeader } from "@/components/layout/auth-header";
import { AddOnsDialog } from "@/components/sections/booking/add-ons-dialog";
import { BookingDetailsStep } from "@/components/sections/booking/booking-details-step";
import { ConfirmDialog } from "@/components/sections/booking/confirm-dialog";
import { ConfirmationStep } from "@/components/sections/booking/confirmation-step";
import { CodeVerificationForm } from "@/components/sections/auth/code-verification-form";
import { GuestStep } from "@/components/sections/booking/guest-step";
import { PriceSummary } from "@/components/sections/booking/price-summary";
import { StepTitle } from "@/components/sections/booking/step-title";
import { TermsStep } from "@/components/sections/booking/terms-step";
import { VoucherDialog } from "@/components/sections/booking/voucher-dialog";
import { AuthColumn } from "@/components/shared/auth-column";
import { AuthHeading } from "@/components/shared/auth-heading";
import { resendCode, verifyCode } from "@/lib/auth";
import { submitBooking } from "@/lib/booking-actions";
import {
  SUBMIT_BOOKING_ERROR_MESSAGES,
  type SubmitBookingError,
} from "@/lib/booking-errors";
import { selectionToDuration } from "@/lib/booking-params";
import { buildQuote, checkVoucher, resolveAddOns } from "@/lib/booking-quote";
import type {
  AddOnChoice,
  BookingSelection,
  BookingSpace,
  GuestDetails,
  Voucher,
} from "@/types/booking";
import type { SessionUser } from "@/types/user";

type Step = "details" | "terms" | "guest" | "verify" | "confirmed";

const TITLES = {
  details: "Fill Booking Details",
  terms: "Terms and Conditions",
  guest: "Fill Personal Data",
} as const;

type BookingFlowProps = {
  header: React.ReactNode;
  space: BookingSpace;
  selection: BookingSelection;
  vouchers: Voucher[];
  /** Null for guests. */
  user: SessionUser | null;
};

/**
 * One route, in-memory steps: details -> terms -> (guest -> verify) -> confirmed.
 * Contact details and the OTP never enter the URL (same approach as sign-up).
 * Prices are derived with `buildQuote`; the Server Action recomputes them.
 */
export function BookingFlow({
  header,
  space,
  selection,
  vouchers,
  user,
}: BookingFlowProps) {
  const [step, setStep] = useState<Step>("details");
  const [navigated, setNavigated] = useState(false);
  const [note, setNote] = useState("");
  const [addOnChoices, setAddOnChoices] = useState<AddOnChoice[]>([]);
  const [voucherCode, setVoucherCode] = useState<string | null>(null);
  const [guest, setGuest] = useState<GuestDetails | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [addOnsOpen, setAddOnsOpen] = useState(false);
  const [voucherOpen, setVoucherOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [today] = useState(() => new Date());

  const selectedAddOns = useMemo(
    () => resolveAddOns(addOnChoices, space.addOns, space.capacity),
    [addOnChoices, space.addOns, space.capacity],
  );
  const availableVouchers = useMemo(
    () =>
      vouchers.filter(
        (v) =>
          checkVoucher(v, { spaceType: space.type, subtotal: 0, today }).ok,
      ),
    [vouchers, space.type, today],
  );
  const voucher = availableVouchers.find((v) => v.code === voucherCode) ?? null;

  const { quote } = useMemo(
    () =>
      buildQuote({
        spaceName: space.name,
        spaceType: space.type,
        tiers: space.prices,
        duration: selectionToDuration(selection),
        addOns: selectedAddOns,
        voucher,
        today,
      }),
    [space, selection, selectedAddOns, voucher, today],
  );

  function goTo(next: Step) {
    setNavigated(true);
    setStep(next);
  }

  async function placeBooking(guestDetails: GuestDetails | null) {
    setSubmitting(true);
    setError(null);
    let failure: SubmitBookingError | "network" | null = null;
    try {
      const result = await submitBooking({
        selection,
        note: note.trim(),
        addOns: selectedAddOns.map(({ addOn, quantity }) => ({
          addOnId: addOn.id,
          quantity,
        })),
        voucherCode: voucher?.code ?? null,
        guest: user ? null : guestDetails,
      });
      if (result.ok) {
        goTo("confirmed");
        return;
      }
      failure = result.error;
    } catch {
      failure = "network";
    } finally {
      setSubmitting(false);
    }

    if (failure === null) return;
    setError(
      failure === "network"
        ? "Something went wrong while placing your booking. Please try again."
        : SUBMIT_BOOKING_ERROR_MESSAGES[failure],
    );
    if (failure === "guest-details") return goTo("guest");
    if (failure.startsWith("voucher")) setVoucherCode(null);
    if (failure !== "network") goTo("details");
  }

  async function submitGuest(details: GuestDetails) {
    setGuest(details);
    await resendCode({ email: details.email }); // mock "send the code"
    goTo("verify");
  }

  const shell = "flex min-h-dvh flex-col overflow-x-clip bg-grey-25";

  if (step === "verify" && guest) {
    return (
      <div className={shell}>
        <AuthHeader />
        <main className="flex flex-1 flex-col items-center px-4 pt-10 pb-16 xs:px-6">
          <AuthColumn centered>
            <AuthHeading
              title="Email Verification"
              description={`We have sent a verification code to ${guest.email}`}
              descriptionId="booking-verify-description"
              focusOnMount
            />
            <CodeVerificationForm
              describedBy="booking-verify-description"
              verify={(code) => verifyCode({ email: guest.email, code })}
              resend={() => resendCode({ email: guest.email })}
              onVerified={() => void placeBooking(guest)}
            />
          </AuthColumn>
        </main>
      </div>
    );
  }

  const alert = error && (
    <p
      role="alert"
      className="rounded-lg bg-error-50 px-4 py-3 text-body-13-medium text-error-700"
    >
      {error}
    </p>
  );

  return (
    <div className={shell}>
      {header}
      <main className="flex-1">
        <div className="page-container flex flex-col gap-6 py-6 xl:gap-9 xl:py-8">
          {step === "confirmed" ? (
            <ConfirmationStep space={space} selection={selection} />
          ) : (
            <>
              <StepTitle
                title={TITLES[step === "verify" ? "guest" : step]}
                back={
                  step === "details"
                    ? { href: `/spaces/${space.slug}` }
                    : {
                        onClick: () => {
                          setError(null);
                          goTo(step === "terms" ? "details" : "terms");
                        },
                      }
                }
                focusOnMount={navigated}
              />
              {alert}

              {step === "details" && (
                <div className="flex flex-col gap-9 xl:flex-row xl:items-start">
                  <BookingDetailsStep
                    space={space}
                    selection={selection}
                    note={note}
                    onNoteChange={setNote}
                    selectedAddOns={selectedAddOns}
                    onOpenAddOns={() => setAddOnsOpen(true)}
                    appliedVoucher={voucher?.code ?? null}
                    onOpenVoucher={() => setVoucherOpen(true)}
                  />
                  <div className="xl:sticky xl:top-8 xl:w-120 xl:shrink-0 2xl:w-161.25">
                    <PriceSummary
                      quote={quote}
                      onContinue={() => setConfirmOpen(true)}
                    />
                  </div>
                </div>
              )}

              {step === "terms" && (
                <TermsStep
                  accepted={termsAccepted}
                  onAcceptedChange={setTermsAccepted}
                  loading={submitting}
                  onContinue={() =>
                    user ? void placeBooking(null) : goTo("guest")
                  }
                />
              )}

              {step === "guest" && (
                <GuestStep
                  defaultValues={
                    guest
                      ? {
                          name: guest.name,
                          email: guest.email,
                          phone: guest.phone.replace(/^\+62/, ""),
                        }
                      : undefined
                  }
                  onSubmit={submitGuest}
                />
              )}
            </>
          )}
        </div>
      </main>

      <AddOnsDialog
        open={addOnsOpen}
        onOpenChange={setAddOnsOpen}
        addOns={space.addOns}
        capacity={space.capacity}
        value={addOnChoices}
        onSave={setAddOnChoices}
      />
      <VoucherDialog
        open={voucherOpen}
        onOpenChange={setVoucherOpen}
        available={availableVouchers}
        catalog={vouchers}
        spaceType={space.type}
        today={today}
        value={voucher?.code ?? null}
        onSave={setVoucherCode}
      />
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onContinue={() => {
          setConfirmOpen(false);
          goTo("terms");
        }}
      />
    </div>
  );
}
