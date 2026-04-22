/**
 * InfoItem Component
 * Shared component for displaying label-value pairs using shadcn
 */

import { cn } from "@/lib/utils";

interface InfoItemProps {
  label: string;
  value: string | null | undefined;
  mono?: boolean;
  className?: string;
}

export function InfoItem({ label, value, mono, className }: InfoItemProps) {
  if (!value || value === "—") return null;

  return (
    <div className={cn("flex flex-col gap-0.5", className)}>
      <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <span
        className={cn(
          "text-sm font-medium text-foreground",
          mono && "font-mono"
        )}
      >
        {value}
      </span>
    </div>
  );
}

export default InfoItem;
