"use client";

import { AuthButton } from "@/components/shared/auth-button";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

type ConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContinue: () => void;
};

export function ConfirmDialog({
  open,
  onOpenChange,
  onContinue,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-[min(var(--container-booking-confirm),calc(100%-2rem))] max-w-none gap-12 rounded-lg bg-white px-6 py-10 ring-0 sm:max-w-none sm:px-8 sm:py-16"
      >
        <div className="flex flex-col gap-4">
          <DialogTitle className="text-heading-20-bold text-grey-800">
            Are your booking details correct?
          </DialogTitle>
          <DialogDescription className="text-body-16-medium text-grey-500">
            You will not be able to change your booking details once you proceed
            to payment. Do you want to proceed?
          </DialogDescription>
        </div>
        <div className="flex flex-col gap-3">
          <AuthButton type="button" onClick={onContinue}>
            Continue
          </AuthButton>
          <Button
            type="button"
            onClick={() => onOpenChange(false)}
            className="h-10.75 w-full rounded-lg bg-product-100 text-body-16-medium text-product-800 hover:bg-product-200"
          >
            Check Again
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
