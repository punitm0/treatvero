import type { AgreementDocument } from "@/data/legal";
import { formatDateTime } from "@/components/admin/format";

/** The stored text of a service agreement, as the patient sees and signs it. */
export function AgreementBody({ document }: { document: AgreementDocument }) {
  return (
    <ol className="m-0 flex list-none flex-col gap-5 p-0">
      {document.sections.map((s, i) => (
        <li key={s.heading} className="break-inside-avoid">
          <h3 className="mt-0 mb-1.5 flex gap-2.5 text-[15px] font-semibold">
            <span className="font-mono text-xs font-normal text-brand">{String(i + 1).padStart(2, "0")}</span>
            {s.heading}
          </h3>
          {s.paragraphs.length > 1 ? (
            <ul className="m-0 flex list-disc flex-col gap-1.5 pl-5 text-sm leading-relaxed text-ink-muted">
              {s.paragraphs.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          ) : (
            <p className="m-0 text-sm leading-relaxed text-ink-muted">{s.paragraphs[0]}</p>
          )}
        </li>
      ))}
    </ol>
  );
}

/** Signature record shown under a signed agreement. */
export function SignatureBlock({
  signerName,
  relationship,
  signedAt,
  version,
}: {
  signerName: string;
  relationship: string | null;
  signedAt: string;
  version: string;
}) {
  return (
    <dl className="m-0 grid gap-x-6 gap-y-2 rounded-xl border border-line bg-sand-2 px-4 py-3 text-sm sm:grid-cols-2 print:bg-white">
      <div>
        <dt className="text-xs text-ink-subtle">Signed electronically by</dt>
        <dd className="m-0 font-serif text-lg italic">{signerName}</dd>
      </div>
      <div>
        <dt className="text-xs text-ink-subtle">Capacity</dt>
        <dd className="m-0">{relationship ? `For the patient, as ${relationship}` : "Patient"}</dd>
      </div>
      <div>
        <dt className="text-xs text-ink-subtle">Date and time</dt>
        <dd className="m-0">{formatDateTime(signedAt)}</dd>
      </div>
      <div>
        <dt className="text-xs text-ink-subtle">Agreement version</dt>
        <dd className="m-0 font-mono text-xs">{version}</dd>
      </div>
    </dl>
  );
}
