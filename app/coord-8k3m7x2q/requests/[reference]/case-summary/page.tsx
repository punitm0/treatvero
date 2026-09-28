import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { requireAdmin } from "@/lib/admin/auth";
import { ADMIN_PATH } from "@/lib/admin/path";
import { getRequestDetail, listReports } from "@/lib/admin/requests";
import { PrintButton } from "@/components/admin/print-button";
import { PrintFooter, PrintHeader } from "@/components/admin/print-frame";
import { formatDate, todayIST } from "@/components/admin/format";
import { siteConfig } from "@/lib/config";

export const metadata = { title: "Case summary" };

/**
 * Anonymised case summary for hospitals' international desks. It leaves out
 * the patient's name, email and phone; the coordinator checks the free-text
 * description for identifying details before sending.
 */
export default async function CaseSummaryPage({ params }: { params: Promise<{ reference: string }> }) {
  const user = await requireAdmin();
  const { reference } = await params;
  const r = await getRequestDetail(reference);
  if (!r) notFound();
  const reports = await listReports(reference);

  const rows: [string, string][] = [
    ["Case reference", r.reference],
    ["Patient age", `${r.age} years`],
    ["Country of residence", r.country],
    ["Treatment enquiry", r.treatment],
    ["Preferred city", r.city && r.city !== "No preference" ? r.city : "No preference"],
    ["Travel timing", r.timing || "Not given"],
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 print:hidden">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link href={`${ADMIN_PATH}/requests/${r.reference}`} className="flex items-center gap-1 text-sm text-ink-muted no-underline">
            <ArrowLeft aria-hidden="true" className="size-4" />
            Back to {r.reference}
          </Link>
          <PrintButton />
        </div>
        <p className="m-0 flex items-start gap-2 rounded-xl border border-warn-line bg-warn-bg px-3.5 py-2.5 text-sm text-warn-ink">
          <AlertTriangle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          Name, email and phone are left out. Check the patient&apos;s description below for names or other identifying details
          before sending, and remove any from the report files too. Share only with hospitals reviewing this case.
        </p>
      </div>

      <article className="rounded-2xl border border-line bg-surface p-8 print:rounded-none print:border-0 print:p-0">
        <PrintHeader title="Case summary for review" meta={[`Reference ${r.reference}`, formatDate(todayIST()), "Confidential"]} />

        <table className="mb-6 w-full border-collapse text-sm">
          <tbody>
            {rows.map(([k, v]) => (
              <tr key={k} className="border-b border-line-soft">
                <th scope="row" className="w-[200px] py-2 pr-4 text-left align-top font-normal text-ink-subtle">
                  {k}
                </th>
                <td className="py-2">{v}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 className="mt-0 mb-2 text-sm font-semibold">Condition, as described by the patient</h2>
        <p className="mt-0 mb-6 text-sm leading-relaxed whitespace-pre-wrap">{r.description}</p>

        <h2 className="mt-0 mb-2 text-sm font-semibold">Reports shared with this summary</h2>
        {reports.length ? (
          <ul className="mt-0 mb-6 list-disc pl-5 text-sm">
            {reports.map((f) => (
              <li key={f.report_id}>{f.file_name}</li>
            ))}
          </ul>
        ) : (
          <p className="mt-0 mb-6 text-sm text-ink-muted">None yet — please tell us which reports you need.</p>
        )}

        <div className="rounded-xl bg-sand-2 p-4 text-sm print:break-inside-avoid">
          <h2 className="mt-0 mb-2 text-sm font-semibold">What we&apos;d like from your team</h2>
          <ol className="mt-0 mb-3 flex list-decimal flex-col gap-1 pl-5">
            <li>Your doctor&apos;s opinion and the recommended treatment plan</li>
            <li>The treating doctor and department</li>
            <li>An estimated cost range, with what it includes and excludes</li>
            <li>Expected length of hospital stay and total time in India</li>
            <li>Any further reports or tests needed before travel</li>
            <li>How long the estimate is valid</li>
          </ol>
          <p className="m-0 text-ink-muted">
            Please quote reference <strong>{r.reference}</strong> in your reply to {user.email}
            {siteConfig.contactEmail && siteConfig.contactEmail !== user.email ? ` or ${siteConfig.contactEmail}` : ""}.
          </p>
        </div>

        <p className="mt-4 mb-0 text-xs text-ink-subtle">
          Shared with the patient&apos;s consent for obtaining treatment options. Please keep it confidential and use it only to
          assess this case.
        </p>
        <PrintFooter />
      </article>
    </div>
  );
}
