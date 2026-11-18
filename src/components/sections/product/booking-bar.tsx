"use client";

import { useId } from "react";

import { BookingField } from "@/components/sections/product/booking-field";
import { useBooking } from "@/components/sections/product/booking-provider";
import { DatePickerField } from "@/components/sections/product/date-picker-field";
import { TimePickerField } from "@/components/sections/product/time-picker-field";

/** Red band under the header: pick a date, then (for a single day) a time. */
export function BookingBar() {
  const uid = useId();
  const { span, isMultiDay } = useBooking();
  const showTime = span !== undefined && !isMultiDay;

  return (
    <section
      aria-label="Choose your date and time"
      className="bg-product-800 py-8"
    >
      <div className="page-container flex flex-col gap-4 xl:flex-row">
        <BookingField
          label="Select Date"
          htmlFor={`${uid}-date`}
          className="xl:w-196 xl:shrink-0"
        >
          <DatePickerField id={`${uid}-date`} />
        </BookingField>
        {showTime && (
          <BookingField
            label="Select Time"
            htmlFor={`${uid}-time`}
            className="xl:flex-1"
          >
            <TimePickerField id={`${uid}-time`} />
          </BookingField>
        )}
      </div>
    </section>
  );
}
