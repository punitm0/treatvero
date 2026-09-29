import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requireAdmin } from "@/lib/admin/auth";
import { ADMIN_PATH } from "@/lib/admin/path";
import { getRequestDetail } from "@/lib/admin/requests";
import { listOptions } from "@/lib/admin/options";
import { ComparisonNotes, OptionsComparison } from "@/components/admin/options-comparison";
import { PrintButton } from "@/components/admin/print-button";
import { PrintHeader, PrintFooter } from "@/components/admin/print-frame";
import { formatDate, todayIST } from "@/components/admin/format";

export const metadata = { title: "Treatment options" };

/**
 * Patient-facing comparison of the options prepared for a request. Saved as
 * a PDF from the browser's print dialog (A4, styles in globals.css).
 */
export default async function ComparisonPage({ params }: { params: Promise<{ reference: string }> }) {
  await requireAdmin();
  const { reference } = await params;
  const r = await getRequestDetail(reference);
  if (!r) notFound();
  const options = await listOptions(reference);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link href={`${ADMIN_PATH}/requests/${r.reference}`} className="flex items-center gap-1 text-sm text-ink-muted no-underline">
          <ArrowLeft aria-hidden="true" className="size-4" />
          Back to {r.reference}
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-xs text-ink-subtle">In the print dialog choose “Save as PDF”, A4, and turn on background graphics.</span>
          <PrintButton />
        </div>
      </div>

      <article className="print-sheet rounded-2xl border border-line bg-surface p-8 print:rounded-none print:border-0 print:p-0">
        <PrintHeader title="Your treatment options" meta={[`Prepared for ${r.full_name}`, `Reference ${r.reference}`, formatDate(todayIST())]} />
        <dl className="mb-6 grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-4 print:mb-4 print:grid-cols-4">
          <div>
            <dt className="text-xs text-ink-subtle">Treatment</dt>
            <dd className="m-0">{r.treatment}</dd>
          </div>
          <div>
            <dt className="text-xs text-ink-subtle">Destination</dt>
            <dd className="m-0">{r.city && r.city !== "No preference" ? `${r.destination} · ${r.city}` : r.destination}</dd>
          </div>
          <div>
            <dt className="text-xs text-ink-subtle">Travel timing</dt>
            <dd className="m-0">{r.timing || "—"}</dd>
          </div>
          <div>
            <dt className="text-xs text-ink-subtle">Options</dt>
            <dd className="m-0">{options.length}</dd>
          </div>
        </dl>
        {options.length ? (
          <OptionsComparison options={options} />
        ) : (
          <p className="text-sm text-ink-subtle">No options yet — add them on the request page first.</p>
        )}
        <div className="mt-6 border-t border-line pt-4 print:mt-4 print:break-inside-avoid">
          <h2 className="mt-0 mb-2 text-sm font-semibold">Next steps</h2>
          <ol className="mt-0 mb-4 flex list-decimal flex-col gap-1 pl-5 text-sm text-ink-muted">
            <li>Tell your coordinator which option you&apos;d like, or any questions you have for the doctors.</li>
            <li>We confirm the treatment plan and dates with the hospital and share a medical visa invitation letter.</li>
            <li>We help with flights, accommodation and support on arrival, as agreed in your plan.</li>
          </ol>
          <ComparisonNotes />
        </div>
        <PrintFooter />
      </article>
    </div>
  );
}
