import { Check, ChevronRight } from "lucide-react";
import Image from "next/image";

type VoucherFieldProps = {
  applied: string | null;
  onOpen: () => void;
};

export function VoucherField({ applied, onOpen }: VoucherFieldProps) {
  return (
    <section aria-labelledby="booking-voucher" className="flex flex-col gap-3">
      <div className="flex flex-col gap-3">
        <h2 id="booking-voucher" className="text-body-16-bold text-grey-800">
          Voucher
        </h2>
        <p className="text-body-13-medium text-grey-400">Add voucher code</p>
      </div>
      <button
        type="button"
        onClick={onOpen}
        aria-haspopup="dialog"
        className={
          applied
            ? "relative flex w-full cursor-pointer items-center justify-between gap-3 overflow-hidden rounded-lg bg-linear-to-br from-success-50 to-success-100 p-3 text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            : "flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg border border-grey-100 bg-white p-3 text-left transition-colors outline-none hover:border-grey-200 focus-visible:ring-3 focus-visible:ring-ring/50"
        }
      >
        {applied && (
          <span
            aria-hidden
            className="absolute -right-8 -bottom-16 h-32 w-64 rounded-full bg-success-400/15"
          />
        )}
        <span className="relative flex items-center gap-3">
          {applied ? (
            <>
              <span
                aria-hidden
                className="grid size-5 place-items-center rounded-sm bg-success-600 text-white"
              >
                <Check className="size-3.5" strokeWidth={3} />
              </span>
              <span className="text-body-13-bold text-grey-800">
                Promo Code Applied! <span aria-hidden>🎉</span>
                <span className="sr-only">{`Code ${applied}`}</span>
              </span>
            </>
          ) : (
            <>
              <Image
                src="/images/icons/booking-voucher.svg"
                alt=""
                width={24}
                height={24}
                className="size-6"
              />
              <span className="text-body-13-medium text-grey-700">
                Add Voucher Code
              </span>
            </>
          )}
        </span>
        <ChevronRight
          aria-hidden
          className="relative size-4 shrink-0 text-grey-800"
        />
      </button>
    </section>
  );
}
