"use client";

import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

type BookingDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
};

export function BookingDialog({
  open,
  onOpenChange,
  children,
}: BookingDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="flex max-h-[calc(100dvh-2rem)] w-[min(var(--container-booking-dialog),calc(100%-2rem))] max-w-none flex-col gap-2 rounded-xl bg-white p-0 shadow-panel ring-0 sm:max-w-none"
      >
        {children}
      </DialogContent>
    </Dialog>
  );
}

type BookingDialogFrameProps = {
  title: string;
  onSave: () => void;
  children: React.ReactNode;
};

export function BookingDialogFrame({
  title,
  onSave,
  children,
}: BookingDialogFrameProps) {
  return (
    <>
      <div className="flex items-center justify-between gap-6 p-6">
        <DialogTitle className="text-heading-20-bold text-grey-800">
          {title}
        </DialogTitle>
        <DialogClose
          aria-label="Close"
          className="grid size-6 shrink-0 cursor-pointer place-items-center rounded-full text-grey-600 transition-colors outline-none hover:text-grey-950 focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <X aria-hidden className="size-5" strokeWidth={2.5} />
        </DialogClose>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-4">{children}</div>
      <div className="flex justify-center p-4">
        <Button
          type="button"
          onClick={onSave}
          className="h-10.75 w-full rounded-lg bg-product-100 text-body-16-medium text-product-800 hover:bg-product-200 md:w-64"
        >
          Save
        </Button>
      </div>
    </>
  );
}
