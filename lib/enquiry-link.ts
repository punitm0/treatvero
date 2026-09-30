import { ENQUIRY_PATH } from "@/lib/config";

/**
 * Link to the enquiry form with a hospital and/or doctor pre-selected, so
 * the request records who the patient asked about.
 */
export function enquiryHref({ hospital, doctor }: { hospital?: string; doctor?: string } = {}): string {
  const params = new URLSearchParams();
  if (hospital) params.set("hospital", hospital);
  if (doctor) params.set("doctor", doctor);
  const query = params.toString();
  return query ? `${ENQUIRY_PATH}?${query}` : ENQUIRY_PATH;
}
