"use client";

import { useActionState } from "react";
import { cn } from "@/lib/utils";

type Result = { ok: boolean; message: string } | null;

/**
 * A form whose server action returns a short result message, shown under
 * the fields (e.g. "Email sent", "Type the reference to confirm").
 */
export function ActionForm({
  action,
  children,
  className,
}: {
  action: (prev: Result, formData: FormData) => Promise<Result>;
  children: React.ReactNode;
  className?: string;
}) {
  const [state, formAction, pending] = useActionState(action, null);
  return (
    <form action={formAction} className={className} aria-busy={pending}>
      <fieldset disabled={pending} className="m-0 contents border-0 p-0">
        {children}
      </fieldset>
      {state ? (
        <p role="status" className={cn("mt-2 mb-0 text-[13px]", state.ok ? "text-brand" : "text-error")}>
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
