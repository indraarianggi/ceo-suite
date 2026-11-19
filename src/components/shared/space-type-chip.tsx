import {
  Building2,
  Clapperboard,
  DoorOpen,
  GraduationCap,
  Laptop,
  Presentation,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import type { SpaceType } from "@/types/space";

type SpaceTypeStyle = {
  Icon: LucideIcon;
  text: string;
  bg: string;
};

export const spaceTypeStyles: Record<SpaceType, SpaceTypeStyle> = {
  "private-office": {
    Icon: Building2,
    text: "text-space-office",
    bg: "bg-space-office-bg",
  },
  coworking: {
    Icon: Laptop,
    text: "text-space-coworking",
    bg: "bg-space-coworking-bg",
  },
  "meeting-room": {
    Icon: DoorOpen,
    text: "text-space-meeting",
    bg: "bg-space-meeting-bg",
  },
  "event-space": {
    Icon: Presentation,
    text: "text-space-seminar",
    bg: "bg-space-seminar-bg",
  },
};

const labelStyles: Record<string, SpaceTypeStyle> = {
  "Class Room": {
    Icon: GraduationCap,
    text: "text-space-class",
    bg: "bg-space-class-bg",
  },
  "Theatre Room": {
    Icon: Clapperboard,
    text: "text-space-theatre",
    bg: "bg-space-theatre-bg",
  },
  "Co-Working Space (Non-Dedicated)": {
    Icon: Laptop,
    text: "text-space-coworking-open",
    bg: "bg-space-coworking-open-bg",
  },
};

type SpaceTypeIconProps = { type: SpaceType; className?: string };

export function SpaceTypeIcon({ type, className }: SpaceTypeIconProps) {
  const { Icon, text } = spaceTypeStyles[type];
  return <Icon aria-hidden className={cn(text, className)} />;
}

type SpaceTypeChipProps = {
  type: SpaceType;
  label: string;
  className?: string;
};

export function SpaceTypeChip({ type, label, className }: SpaceTypeChipProps) {
  const { Icon, text, bg } = labelStyles[label] ?? spaceTypeStyles[type];
  return (
    <span
      className={cn(
        "inline-flex w-fit max-w-full items-center gap-2 rounded-4xl px-2 py-1 text-body-13-medium xl:whitespace-nowrap",
        text,
        bg,
        className,
      )}
    >
      <Icon aria-hidden className="size-3.5" />
      {label}
    </span>
  );
}
