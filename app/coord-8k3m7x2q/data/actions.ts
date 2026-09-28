"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/auth";
import { ADMIN_PATH } from "@/lib/admin/path";
import { purgeReports } from "@/lib/admin/data";
import { RETENTION_MONTHS } from "./options";

type Result = { ok: boolean; message: string } | null;

export async function runPurge(_prev: Result, formData: FormData): Promise<Result> {
  const user = await requireAdmin();
  const months = Number(formData.get("months"));
  if (!(RETENTION_MONTHS as readonly number[]).includes(months)) return { ok: false, message: "Choose a retention period." };
  if (formData.get("confirm") !== "on") return { ok: false, message: "Tick the box to confirm." };
  const { requests, reports } = await purgeReports(months, user.email);
  revalidatePath(`${ADMIN_PATH}/data`);
  return { ok: true, message: requests ? `Deleted ${reports} report(s) from ${requests} request(s).` : "Nothing to delete." };
}
