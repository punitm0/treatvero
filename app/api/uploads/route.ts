import { NextResponse } from "next/server";
import { clientKey, getRateLimiter } from "@/lib/rate-limit";
import { isSameOrigin } from "@/lib/request-guard";
import { getReportStorage } from "@/lib/uploads/storage";
import { MAX_UPLOAD_BYTES, precheckFile, safeFileName, sniffMime } from "@/lib/uploads/validate";

/**
 * Receives one medical report per request. Contents and file names are never
 * logged. The response contains only an opaque id and display metadata.
 */
export async function POST(request: Request) {
  const noStore = { "Cache-Control": "no-store" };
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403, headers: noStore });
  }

  const storage = getReportStorage();

  const limited = await getRateLimiter("upload").limit(clientKey(request.headers));
  if (!limited.success) {
    return NextResponse.json(
      { error: "Too many uploads. Please wait a few minutes and try again." },
      { status: 429, headers: { ...noStore, "Retry-After": "60" } },
    );
  }

  // Reject oversized bodies before buffering them (multipart overhead allowance).
  const declared = Number(request.headers.get("content-length") || 0);
  if (declared > MAX_UPLOAD_BYTES + 64 * 1024) {
    return NextResponse.json({ error: "This file is too large." }, { status: 413, headers: noStore });
  }

  let file: FormDataEntryValue | null;
  try {
    file = (await request.formData()).get("file");
  } catch {
    return NextResponse.json({ error: "Invalid upload." }, { status: 400, headers: noStore });
  }
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file received." }, { status: 400, headers: noStore });
  }

  const precheck = precheckFile(file);
  if (precheck) return NextResponse.json({ error: precheck }, { status: 422, headers: noStore });

  const bytes = new Uint8Array(await file.arrayBuffer());
  const mimeType = sniffMime(bytes);
  if (!mimeType) {
    return NextResponse.json(
      { error: "This file doesn't look like a valid PDF, JPG or PNG." },
      { status: 422, headers: noStore },
    );
  }

  try {
    const stored = await storage.save({ bytes, fileName: safeFileName(file.name), mimeType });
    return NextResponse.json(
      { id: stored.id, fileName: stored.fileName, size: stored.size, mimeType: stored.mimeType },
      { status: 201, headers: noStore },
    );
  } catch {
    console.error("[uploads] failed to store a report"); // no file details logged
    return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 500, headers: noStore });
  }
}
