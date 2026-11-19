"use client";

import { Tabs } from "@base-ui/react/tabs";

type BookingsTabsProps = {
  active: React.ReactNode;
  history: React.ReactNode;
};

const tab =
  "flex-1 border-b-3 border-transparent px-2 pt-4 pb-3.25 text-center text-body-16-medium text-grey-400 outline-none transition-colors hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/50 data-active:border-primary data-active:text-body-16-bold data-active:text-primary";
const panel =
  "rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/50";

/** Panels are server-rendered nodes passed in; only the tab switching is client. */
export function BookingsTabs({ active, history }: BookingsTabsProps) {
  return (
    <Tabs.Root defaultValue="active" className="flex flex-col gap-8">
      <Tabs.List
        aria-label="Booking status"
        className="flex w-full max-w-102 gap-8 border-b border-grey-100"
      >
        <Tabs.Tab value="active" className={tab}>
          Active
        </Tabs.Tab>
        <Tabs.Tab value="history" className={tab}>
          History
        </Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="active" className={panel}>
        {active}
      </Tabs.Panel>
      <Tabs.Panel value="history" className={panel}>
        {history}
      </Tabs.Panel>
    </Tabs.Root>
  );
}
