import { cn } from "cn";
import { Check, ChevronRight } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { authLinks } from "@/data/navigation";

type ResetSuccessDialogProps = {
  open: boolean;
};

export function ResetSuccessDialog({ open }: ResetSuccessDialogProps) {
  return (
    <Dialog open={open} onOpenChange={() => {}} disablePointerDismissal>
      <DialogContent
        showCloseButton={false}
        className="w-[min(var(--container-auth-success),calc(100%-2rem))] max-w-none justify-items-center gap-9 rounded-card bg-white px-8 py-16 text-center ring-0"
      >
        <div
          aria-hidden
          className="flex size-18 items-center justify-center rounded-full bg-linear-to-b from-success-400 to-success-500 text-white ring-12 ring-success-50"
        >
          <Check className="size-12" strokeWidth={2.5} />
        </div>
        <div className="flex w-full flex-col items-center gap-8">
          <DialogTitle className="max-w-62.5 text-heading-20-bold text-grey-900">
            Successfully reset your password!
          </DialogTitle>
          <Link
            href={authLinks.signIn.href}
            className={cn(
              buttonVariants({ variant: "secondary" }),
              "h-9 w-full gap-2 rounded-lg px-4 text-body-13-medium",
            )}
          >
            Go to Login
            <ChevronRight aria-hidden className="size-4" />
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}
