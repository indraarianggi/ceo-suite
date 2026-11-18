import { MessageCircleIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { buttonVariants } from "@/components/ui/button";
import { faqHeading } from "@/data/faqs";
import { getFaqs } from "@/lib/content";
import { cn } from "@/lib/utils";

export async function FaqSection() {
  const faqs = await getFaqs();

  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className="scroll-mt-28 py-12 xl:pt-20 xl:pb-25"
    >
      <div className="page-container grid gap-10 xl:grid-cols-[500fr_981fr] xl:gap-x-30">
        <div className="flex flex-col justify-between gap-10 xl:gap-15">
          <div className="flex flex-col gap-5">
            <h2
              id="faq-title"
              className="text-heading-31-bold text-grey-950 md:text-heading-39-bold xl:text-heading-49-bold"
            >
              {faqHeading.title}
            </h2>
            <p className="text-body-16-regular text-grey-400">
              {faqHeading.description}
            </p>
          </div>

          <div className="relative flex flex-col items-start gap-9 overflow-hidden rounded-3xl bg-product-50 px-6 py-10">
            <Image
              src="/images/icons/chat-outline.svg"
              alt=""
              width={164}
              height={164}
              className="pointer-events-none absolute -top-1 -right-3 size-41 max-w-none"
            />
            <p className="relative text-heading-20-medium text-product-700 md:text-heading-25-medium">
              Haven&apos;t answered your question?
            </p>
            <Link
              href="/contact"
              className={cn(
                buttonVariants({ variant: "accent", size: "cta" }),
                "relative",
              )}
            >
              <MessageCircleIcon aria-hidden />
              Contact Us
            </Link>
          </div>
        </div>

        <Accordion defaultValue={[faqs[0].id]}>
          {faqs.map((faq) => (
            <AccordionItem
              key={faq.id}
              value={faq.id}
              className="border-b border-grey-200"
            >
              <AccordionTrigger className="items-center gap-6 rounded-sm py-6 text-heading-20-medium text-grey-950 hover:no-underline aria-expanded:pb-4 **:data-[slot=accordion-trigger-icon]:size-8 **:data-[slot=accordion-trigger-icon]:text-grey-950 md:py-10 md:text-heading-25-medium md:aria-expanded:pb-7">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="pr-9 pb-6 text-body-16-regular leading-7 text-grey-700 md:pb-10">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
