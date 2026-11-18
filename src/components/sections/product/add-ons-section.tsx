import Image from "next/image";

import { formatAddOnUnit, formatRupiah } from "@/lib/format";
import type { AddOn, AddOnIcon } from "@/types/space";

const addOnIcons: Record<AddOnIcon, string> = {
  corkage: "/images/icons/product/addon-corkage.svg",
  lunch: "/images/icons/product/addon-lunch.svg",
  coffee: "/images/icons/product/addon-coffee.svg",
  "flip-chart": "/images/icons/product/addon-flip-chart.svg",
  projector: "/images/icons/product/addon-projector.svg",
};

type AddOnsSectionProps = { addOns: AddOn[] };

export function AddOnsSection({ addOns }: AddOnsSectionProps) {
  return (
    <section
      aria-labelledby="add-ons-heading"
      className="flex flex-col gap-6 py-4"
    >
      <div className="flex flex-col gap-6">
        <h2 id="add-ons-heading" className="text-heading-25-bold text-grey-950">
          Add Ons
        </h2>
        <p className="text-body-16-medium text-grey-400">
          Enhance your booking experience with a variety of add-ons, including
          catering, equipment rentals, and personalized services.
        </p>
      </div>

      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {addOns.map((addOn) => (
          <li
            key={addOn.id}
            className="flex flex-col gap-3 rounded-lg p-6 outline -outline-offset-1 outline-grey-100"
          >
            <Image
              src={addOnIcons[addOn.icon]}
              alt=""
              width={32}
              height={32}
              className="size-8"
            />
            <div className="flex flex-col gap-1">
              <p className="text-body-13-medium text-grey-500">{addOn.name}</p>
              <div className="flex flex-col gap-0.5">
                <p className="text-body-16-bold text-grey-950">
                  {formatRupiah(addOn.price)}
                </p>
                <p className="text-body-10-regular text-grey-500">
                  {formatAddOnUnit(addOn.unit)}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
