"use client";

import { format, parse } from "date-fns";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import {
  BookingDialog,
  BookingDialogFrame,
} from "@/components/sections/booking/booking-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { SUBMIT_BOOKING_ERROR_MESSAGES } from "@/lib/booking-errors";
import { checkVoucher, findVoucher } from "@/lib/booking-quote";
import { formatRupiah } from "@/lib/format";
import type { Voucher } from "@/types/booking";
import type { SpaceType } from "@/types/space";

const SPACE_TYPE_PLURALS: Record<SpaceType, string> = {
  "meeting-room": "meeting rooms",
  "private-office": "private offices",
  coworking: "coworking spaces",
  "event-space": "event spaces",
};

function formatValidUntil(voucher: Voucher): string {
  return format(
    parse(voucher.validUntil, "yyyy-MM-dd", new Date()),
    "d MMM yyyy",
  );
}

type VoucherDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  available: Voucher[];
  catalog: Voucher[];
  spaceType: SpaceType;
  today: Date;
  value: string | null;
  onSave: (code: string | null) => void;
};

export function VoucherDialog({
  open,
  onOpenChange,
  ...panel
}: VoucherDialogProps) {
  return (
    <BookingDialog open={open} onOpenChange={onOpenChange}>
      <VoucherPanel
        {...panel}
        onSave={(code) => {
          panel.onSave(code);
          onOpenChange(false);
        }}
      />
    </BookingDialog>
  );
}

type VoucherPanelProps = Omit<VoucherDialogProps, "open" | "onOpenChange">;

function VoucherPanel({
  available,
  catalog,
  spaceType,
  today,
  value,
  onSave,
}: VoucherPanelProps) {
  const [selected, setSelected] = useState<string | null>(value);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  function applyTypedCode(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const voucher = findVoucher(catalog, code);
    if (!voucher) {
      setError(SUBMIT_BOOKING_ERROR_MESSAGES["voucher-invalid"]);
      return;
    }
    const check = checkVoucher(voucher, { spaceType, subtotal: 0, today });
    if (!check.ok) {
      setError(
        SUBMIT_BOOKING_ERROR_MESSAGES[
          check.reason === "expired"
            ? "voucher-expired"
            : "voucher-not-applicable"
        ],
      );
      return;
    }
    setError(null);
    setSelected(voucher.code);
    setCode("");
  }

  return (
    <BookingDialogFrame title="Add Voucher" onSave={() => onSave(selected)}>
      <div className="flex flex-col gap-8 py-4">
        <form
          noValidate
          onSubmit={applyTypedCode}
          className="flex flex-col gap-2"
        >
          <div className="flex gap-2">
            <Input
              value={code}
              onChange={(event) => {
                setCode(event.target.value);
                if (error) setError(null);
              }}
              aria-label="Voucher code"
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? "voucher-code-error" : undefined}
              placeholder="Apply Voucher Code"
              autoCapitalize="characters"
              autoComplete="off"
              className="h-9 rounded-lg border-grey-100 bg-white px-3 text-body-13-regular text-grey-800 placeholder:text-grey-300 md:text-body-13-regular"
            />
            <Button
              type="submit"
              className="h-9 rounded-lg px-4 text-body-13-medium"
            >
              Apply
            </Button>
          </div>
          {error && (
            <p
              id="voucher-code-error"
              role="alert"
              className="text-body-13-regular text-destructive"
            >
              {error}
            </p>
          )}
        </form>

        <section
          aria-labelledby="available-vouchers"
          className="flex flex-col gap-6"
        >
          <h3
            id="available-vouchers"
            className="text-body-16-bold text-grey-700"
          >
            Available Vouchers
          </h3>
          {available.length === 0 ? (
            <p className="text-body-13-regular text-grey-500">
              There are no vouchers for this space right now.
            </p>
          ) : (
            <ul className="grid gap-4 md:grid-cols-2">
              {available.map((voucher) => {
                const isSelected = selected === voucher.code;
                const isOpen = expanded === voucher.code;
                return (
                  <li
                    key={voucher.code}
                    className={
                      isSelected
                        ? "relative flex flex-col gap-3 overflow-hidden rounded-lg border border-product-800 bg-white px-3 py-4 shadow-sm"
                        : "relative flex flex-col gap-3 overflow-hidden rounded-lg border border-transparent bg-white px-3 py-4 shadow-sm"
                    }
                  >
                    <span
                      aria-hidden
                      className="absolute -bottom-12 -left-6 size-28 rounded-full bg-success-50"
                    />
                    <label className="relative flex cursor-pointer items-center justify-between gap-3">
                      <span className="flex min-w-0 items-center gap-3">
                        <Image
                          src="/images/icons/booking-discount-badge.svg"
                          alt=""
                          width={24}
                          height={24}
                          className="size-6 shrink-0"
                        />
                        <span className="flex min-w-0 flex-col gap-1">
                          <span className="text-body-10-bold text-grey-800">
                            {voucher.title}
                          </span>
                          <span className="text-body-10-regular text-grey-300">
                            Until {formatValidUntil(voucher)}
                          </span>
                        </span>
                      </span>
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) =>
                          setSelected(checked ? voucher.code : null)
                        }
                        aria-label={`Use voucher ${voucher.code}`}
                        className="border-primary"
                      />
                    </label>
                    <hr className="relative border-t border-dashed border-grey-100" />
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => setExpanded(isOpen ? null : voucher.code)}
                      className="relative flex cursor-pointer items-center gap-1 self-end rounded-sm text-body-10-bold text-primary outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                    >
                      Detail
                      <ChevronRight
                        aria-hidden
                        className={
                          isOpen
                            ? "size-4 rotate-90 transition-transform"
                            : "size-4 transition-transform"
                        }
                      />
                    </button>
                    {isOpen && (
                      <p className="relative text-body-10-regular text-grey-600">
                        Code {voucher.code}: {voucher.percentOff}% off, up to{" "}
                        {formatRupiah(voucher.maxDiscount)}. Valid for{" "}
                        {SPACE_TYPE_PLURALS[spaceType]} until{" "}
                        {formatValidUntil(voucher)}.
                      </p>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </BookingDialogFrame>
  );
}
