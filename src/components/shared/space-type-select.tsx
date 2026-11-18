"use client";

import { Select as SelectPrimitive } from "@base-ui/react/select";

import { Select, SelectContent } from "@/components/ui/select";
import { cn } from "@/lib/utils";

export const ALL_SPACE_TYPES = "all";

export type SpaceTypeOption = {
  readonly value: string;
  readonly label: string;
};

/**
 * Applies the "all is exclusive" rule to a raw change from the list:
 * - ticking "all" clears the specific types;
 * - ticking a specific type unticks "all";
 * - clearing the last type (or ticking every one) falls back to "all".
 */
export function resolveSpaceTypes(
  previous: readonly string[],
  next: readonly string[],
  options: readonly SpaceTypeOption[],
): string[] {
  if (next.includes(ALL_SPACE_TYPES) && !previous.includes(ALL_SPACE_TYPES)) {
    return [ALL_SPACE_TYPES];
  }
  const specific = next.filter((value) => value !== ALL_SPACE_TYPES);
  const specificOptions = options.filter(
    (option) => option.value !== ALL_SPACE_TYPES,
  );
  if (specific.length === 0 || specific.length === specificOptions.length) {
    return [ALL_SPACE_TYPES];
  }
  return specific;
}

type SpaceTypeSelectProps = {
  id: string;
  options: readonly SpaceTypeOption[];
  value: readonly string[];
  onValueChange: (value: string[]) => void;
  allLabel: string;
  className?: string;
};

export function SpaceTypeSelect({
  id,
  options,
  value,
  onValueChange,
  allLabel,
  className,
}: SpaceTypeSelectProps) {
  const triggerLabel = value.includes(ALL_SPACE_TYPES)
    ? allLabel
    : options
        .filter((option) => value.includes(option.value))
        .map((option) => option.label)
        .join(", ");

  return (
    <Select
      multiple
      value={[...value]}
      onValueChange={(next) =>
        onValueChange(resolveSpaceTypes(value, next, options))
      }
    >
      <SelectPrimitive.Trigger
        id={id}
        className={cn(
          "flex h-14 w-full items-center gap-4 rounded-lg border border-border bg-white px-3 text-left text-body-16-medium text-grey-700 outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
          className,
        )}
      >
        <ConferenceRoomIcon className="size-6 text-primary" />
        <SelectPrimitive.Value className="min-w-0 flex-1 truncate">
          {() => triggerLabel}
        </SelectPrimitive.Value>
        <SelectPrimitive.Icon
          render={<ChevronDownIcon className="size-6 text-black" />}
        />
      </SelectPrimitive.Trigger>

      <SelectContent
        alignItemWithTrigger={false}
        align="start"
        sideOffset={12}
        className="rounded-lg border border-slate-100 bg-white py-0.75 shadow-menu ring-0"
      >
        {options.map((option) => (
          <SelectPrimitive.Item
            key={option.value}
            value={option.value}
            className="group/item flex h-9 w-full cursor-default items-center gap-2 px-3.5 text-body-13-medium text-grey-800 outline-hidden select-none data-highlighted:bg-accent"
          >
            <span
              aria-hidden
              className="grid size-4 shrink-0 place-items-center rounded-sm border border-primary bg-white text-white group-data-[selected]/item:bg-primary"
            >
              <CheckIcon className="size-3 opacity-0 group-data-[selected]/item:opacity-100" />
            </span>
            <SelectPrimitive.ItemText className="flex-1">
              {option.label}
            </SelectPrimitive.ItemText>
          </SelectPrimitive.Item>
        ))}
      </SelectContent>
    </Select>
  );
}

type IconProps = { className?: string };

function ConferenceRoomIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <path d="M10.821 2.003L10.921 2.02L19.421 4.02C19.5685 4.05451 19.7021 4.13289 19.8042 4.24481C19.9063 4.35673 19.9721 4.49695 19.993 4.647L20 4.75V19.25C20.0001 19.4015 19.9542 19.5495 19.8685 19.6744C19.7829 19.7994 19.6613 19.8955 19.52 19.95L19.422 19.98L10.922 21.98C10.8203 22.004 10.7147 22.0064 10.612 21.9872C10.5093 21.9679 10.4118 21.9275 10.3256 21.8683C10.2395 21.8092 10.1666 21.7328 10.1118 21.6438C10.0569 21.5549 10.0212 21.4555 10.007 21.352L10 21.25V2.75C9.99987 2.55568 10.0752 2.36889 10.21 2.22899C10.3449 2.08909 10.5288 2.007 10.723 2L10.821 2.003ZM11.5 3.697V20.303L18.5 18.656V5.344L11.5 3.697ZM9 4V5.5H5.5V18.5H9V20H4.75C4.56876 20 4.39366 19.9344 4.25707 19.8152C4.12048 19.6961 4.03165 19.5316 4.007 19.352L4 19.25V4.75C4.00001 4.56876 4.06564 4.39366 4.18477 4.25707C4.30389 4.12048 4.46845 4.03165 4.648 4.007L4.75 4H9ZM14 11C14.2652 11 14.5196 11.1054 14.7071 11.2929C14.8946 11.4804 15 11.7348 15 12C15 12.2652 14.8946 12.5196 14.7071 12.7071C14.5196 12.8946 14.2652 13 14 13C13.7348 13 13.4804 12.8946 13.2929 12.7071C13.1054 12.5196 13 12.2652 13 12C13 11.7348 13.1054 11.4804 13.2929 11.2929C13.4804 11.1054 13.7348 11 14 11Z" />
    </svg>
  );
}

function ChevronDownIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.7069 15.7073C12.5193 15.8948 12.265 16.0001 11.9999 16.0001C11.7347 16.0001 11.4804 15.8948 11.2929 15.7073L5.63585 10.0503C5.54034 9.9581 5.46416 9.84775 5.41175 9.72575C5.35934 9.60374 5.33176 9.47252 5.3306 9.33974C5.32945 9.20696 5.35475 9.07529 5.40503 8.95239C5.45531 8.82949 5.52957 8.71784 5.62346 8.62395C5.71735 8.53006 5.829 8.4558 5.9519 8.40552C6.0748 8.35524 6.20648 8.32994 6.33926 8.33109C6.47204 8.33225 6.60325 8.35983 6.72526 8.41224C6.84726 8.46465 6.95761 8.54083 7.04985 8.63634L11.9999 13.5863L16.9499 8.63634C17.1385 8.45418 17.3911 8.35339 17.6533 8.35567C17.9155 8.35795 18.1663 8.46312 18.3517 8.64852C18.5371 8.83393 18.6423 9.08474 18.6445 9.34694C18.6468 9.60914 18.546 9.86174 18.3639 10.0503L12.7069 15.7073Z"
      />
    </svg>
  );
}

function CheckIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <path d="M9 16.17L5.53 12.7a.996.996 0 1 0-1.41 1.41l4.18 4.18c.39.39 1.02.39 1.41 0L20.29 7.71a.996.996 0 1 0-1.41-1.41L9 16.17z" />
    </svg>
  );
}
