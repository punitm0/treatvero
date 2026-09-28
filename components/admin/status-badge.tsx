import { statusLabel } from "@/lib/admin/requests";
import { cn } from "@/lib/utils";

const tones: Record<string, string> = {
  new: "border-brand-line bg-brand-tint text-brand",
  contacted: "border-line-strong bg-sand text-ink",
  options_sent: "border-warn-line bg-warn-bg text-warn-ink",
  booked: "border-brand bg-brand text-white",
  closed: "border-line bg-surface text-ink-subtle",
  lost: "border-line bg-surface text-ink-subtle line-through",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={cn("inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap", tones[status] ?? tones.closed)}>
      {statusLabel(status)}
    </span>
  );
}
