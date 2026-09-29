import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requireAdmin } from "@/lib/admin/auth";
import { ADMIN_PATH } from "@/lib/admin/path";
import { getRequestDetail } from "@/lib/admin/requests";
import { currentAgreement, listAgreements } from "@/lib/agreements";
import { PrintButton } from "@/components/admin/print-button";
import { PrintFooter, PrintHeader } from "@/components/admin/print-frame";
import { AgreementBody, SignatureBlock } from "@/components/agreements/agreement-document";
import { formatDateTime } from "@/components/admin/format";

export const metadata = { title: "Service agreement" };

/**
 * The signed service agreement with its signature record, for the case file
 * or to send the patient a copy. Shows the stored snapshot, not the current
 * template.
 */
export default async function AgreementPrintPage({ params }: { params: Promise<{ reference: string }> }) {
  await requireAdmin();
  const { reference } = await params;
  const r = await getRequestDetail(reference);
  if (!r) notFound();
  const agreement = currentAgreement(await listAgreements(reference));
  if (!agreement?.signed_at || !agreement.signer_name) notFound();

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link href={`${ADMIN_PATH}/requests/${r.reference}`} className="flex items-center gap-1 text-sm text-ink-muted no-underline">
          <ArrowLeft aria-hidden="true" className="size-4" />
          Back to {r.reference}
        </Link>
        <PrintButton />
      </div>

      <article className="rounded-2xl border border-line bg-surface p-8 print:rounded-none print:border-0 print:p-0">
        <PrintHeader title={agreement.document.title} meta={[`Reference ${r.reference}`, `Version ${agreement.version}`]} />
        <AgreementBody document={agreement.document} />
        <div className="mt-6">
          <SignatureBlock
            signerName={agreement.signer_name}
            relationship={agreement.signer_relationship}
            signedAt={agreement.signed_at}
            version={agreement.version}
          />
        </div>
        <p className="mt-3 mb-0 text-xs text-ink-subtle">
          Prepared {formatDateTime(agreement.created_at)} by {agreement.created_by}. Signed through the patient&apos;s private link
          (link id {agreement.signed_link_id}). Agreement id {agreement.id}.
        </p>
        <PrintFooter />
      </article>
    </div>
  );
}
