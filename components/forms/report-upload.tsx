"use client";

import { useId, useRef, useState } from "react";
import { FileText, Image as ImageIcon, Loader2, Lock, ShieldCheck, Trash2, Upload } from "lucide-react";
import { ACCEPT_ATTR, MAX_UPLOAD_BYTES, MAX_UPLOAD_FILES, precheckFile } from "@/lib/uploads/validate";
import { cn, formatBytes } from "@/lib/utils";

export type UploadItem = {
  key: string;
  name: string;
  size: number;
  isPdf: boolean;
  status: "uploading" | "done" | "error";
  id?: string;
  error?: string;
};

export function ReportUpload({
  items,
  onChange,
  ready,
  verifyError,
}: {
  items: UploadItem[];
  onChange: (updater: (prev: UploadItem[]) => UploadItem[]) => void;
  /** Settles once the bot check has issued a session; uploads wait for it. */
  ready: Promise<boolean>;
  verifyError: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [notice, setNotice] = useState("");
  const hintId = useId();

  async function upload(file: File, key: string) {
    if (!(await ready)) {
      onChange((prev) => prev.map((it) => (it.key === key ? { ...it, status: "error", error: verifyError } : it)));
      return;
    }
    const body = new FormData();
    body.append("file", file);
    try {
      const res = await fetch("/api/uploads", { method: "POST", body });
      const json = (await res.json().catch(() => ({}))) as { id?: string; error?: string };
      onChange((prev) =>
        prev.map((it) =>
          it.key !== key
            ? it
            : res.ok && json.id
              ? { ...it, status: "done", id: json.id }
              : { ...it, status: "error", error: json.error || "Upload failed. Please try again." },
        ),
      );
    } catch {
      onChange((prev) => prev.map((it) => (it.key === key ? { ...it, status: "error", error: "Network error. Please try again." } : it)));
    }
  }

  function addFiles(list: FileList | null) {
    if (!list?.length) return;
    const room = MAX_UPLOAD_FILES - items.length;
    const files = Array.from(list).slice(0, Math.max(room, 0));
    const rejected: string[] = [];
    const accepted: { file: File; item: UploadItem }[] = [];
    for (const file of files) {
      const problem = precheckFile(file);
      if (problem) {
        rejected.push(`${file.name}: ${problem}`);
        continue;
      }
      accepted.push({
        file,
        item: {
          key: crypto.randomUUID(),
          name: file.name,
          size: file.size,
          isPdf: /\.pdf$/i.test(file.name),
          status: "uploading",
        },
      });
    }
    if (list.length > files.length) rejected.push(`You can attach up to ${MAX_UPLOAD_FILES} files.`);
    setNotice(rejected.join(" "));
    if (accepted.length) {
      onChange((prev) => [...prev, ...accepted.map((a) => a.item)]);
      accepted.forEach((a) => void upload(a.file, a.item.key));
    }
  }

  function remove(item: UploadItem) {
    onChange((prev) => prev.filter((it) => it.key !== item.key));
    if (item.id) void fetch(`/api/uploads/${item.id}`, { method: "DELETE" }).catch(() => {});
  }

  return (
    <div className="flex flex-col gap-5">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          addFiles(e.dataTransfer.files);
        }}
        className={cn(
          "flex flex-col items-center gap-2.5 rounded-[14px] border-[1.5px] border-dashed px-5 py-8 text-center transition-colors",
          dragging ? "border-brand bg-brand-tint" : "border-line-dash bg-dropzone",
        )}
      >
        <span className="flex size-12 items-center justify-center rounded-full bg-brand-tint text-brand">
          <Upload aria-hidden="true" className="size-6" strokeWidth={1.75} />
        </span>
        <p className="m-0 text-[15px] font-medium">
          Drag files here, or{" "}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            aria-describedby={hintId}
            className="text-brand underline underline-offset-[3px]"
          >
            browse
          </button>
        </p>
        <p id={hintId} className="m-0 text-[13px] text-ink-subtle">
          PDF, JPG, JPEG or PNG · up to {MAX_UPLOAD_BYTES / (1024 * 1024)} MB each
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPT_ATTR}
          className="hidden"
          onChange={(e) => {
            addFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      <p role="status" aria-live="polite" className={cn("m-0 text-[13px] text-error", !notice && "sr-only")}>
        {notice}
      </p>

      {items.length > 0 ? (
        <ul aria-label="Attached reports" className="m-0 flex list-none flex-col rounded-xl border border-line p-0">
          {items.map((it, i) => (
            <li key={it.key} className={cn("flex items-center gap-3 px-3.5 py-3", i > 0 && "border-t border-line-soft")}>
              {it.isPdf ? (
                <FileText aria-hidden="true" className="size-[22px] shrink-0 text-brand" strokeWidth={1.75} />
              ) : (
                <ImageIcon aria-hidden="true" className="size-[22px] shrink-0 text-brand" strokeWidth={1.75} />
              )}
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">{it.name}</div>
                <div className={cn("flex items-center gap-1.5 text-xs", it.status === "error" ? "text-error" : "text-ink-subtle")}>
                  {it.status === "uploading" ? (
                    <>
                      <Loader2 aria-hidden="true" className="size-3.5 animate-spin" /> Uploading…
                    </>
                  ) : it.status === "error" ? (
                    it.error
                  ) : (
                    <>
                      {it.isPdf ? "PDF" : "Image"} · {formatBytes(it.size)} ·
                      <Lock aria-hidden="true" className="size-3.5" /> Stored privately
                    </>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => remove(it)}
                aria-label={`Remove ${it.name}`}
                className="flex size-10 items-center justify-center rounded-full text-ink-muted hover:bg-sand"
              >
                <Trash2 aria-hidden="true" className="size-5" strokeWidth={1.75} />
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="flex flex-col gap-1.5 text-sm text-ink-muted">
        <p className="m-0 font-medium text-ink">Useful to include</p>
        <p className="m-0">
          Recent scans (MRI, CT, X-ray) and their reports · lab results · your doctor&apos;s letter or referral ·
          previous discharge summaries
        </p>
      </div>
      <div className="flex items-start gap-3 rounded-xl bg-sand-2 px-4 py-3.5 text-[13px] leading-normal text-ink-muted">
        <ShieldCheck aria-hidden="true" className="mt-px size-[18px] shrink-0 text-brand" strokeWidth={1.75} />
        <span>
          Reports are stored privately and shared only with hospitals reviewing your case, with your consent — and you
          can ask us to delete them at any time.
        </span>
      </div>
    </div>
  );
}
