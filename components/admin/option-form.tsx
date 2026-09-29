import { hospitals } from "@/data/hospitals";
import { getCity } from "@/data/destinations";
import type { TreatmentSlug } from "@/types";
import { OPTION_CURRENCIES, type TreatmentOption } from "@/lib/admin/options";
import { buttonClasses } from "@/components/ui/button";
import { Label, inputClass, textareaClass } from "@/components/admin/ui";

/** Hospital picker: hospitals offering the treatment first, then the rest, plus an unlisted option. */
export function HospitalSelect({
  treatment,
  defaultValue,
  name = "hospital",
}: {
  treatment?: TreatmentSlug;
  defaultValue?: string | null;
  name?: string;
}) {
  const suggested = treatment ? hospitals.filter((h) => h.specialties.includes(treatment)) : [];
  const others = hospitals.filter((h) => !suggested.includes(h));
  const option = (h: (typeof hospitals)[number]) => (
    <option key={h.slug} value={h.slug}>
      {h.name} — {getCity(h.city).name}
    </option>
  );
  return (
    <select name={name} defaultValue={defaultValue ?? "__custom"} className={inputClass}>
      <option value="__custom">Unlisted hospital (type the name below)</option>
      {suggested.length ? <optgroup label="Offers this treatment">{suggested.map(option)}</optgroup> : null}
      <optgroup label={suggested.length ? "Other listed hospitals" : "Listed hospitals"}>{others.map(option)}</optgroup>
    </select>
  );
}

export function OptionForm({
  action,
  treatment,
  option,
}: {
  action: (formData: FormData) => Promise<void>;
  treatment?: TreatmentSlug;
  option?: TreatmentOption;
}) {
  const o = option;
  return (
    <form action={action} className="grid gap-3 sm:grid-cols-2">
      <Label text="Hospital" className="sm:col-span-2">
        <HospitalSelect treatment={treatment} defaultValue={o?.hospital_slug} />
      </Label>
      <Label text="Unlisted hospital name">
        <input name="hospital_name" defaultValue={o && !o.hospital_slug ? o.hospital_name : ""} maxLength={160} className={inputClass} />
      </Label>
      <Label text="Unlisted hospital city">
        <input name="city" defaultValue={o && !o.hospital_slug ? (o.city ?? "") : ""} maxLength={80} className={inputClass} />
      </Label>
      <Label text="Doctor">
        <input name="doctor" defaultValue={o?.doctor ?? ""} maxLength={200} placeholder="Dr … (Department)" className={inputClass} />
      </Label>
      <Label text="Procedure">
        <input name="procedure_name" defaultValue={o?.procedure_name ?? ""} maxLength={200} className={inputClass} />
      </Label>
      <div className="grid grid-cols-[90px_1fr_1fr] gap-2 sm:col-span-2">
        <Label text="Currency">
          <select name="currency" defaultValue={o?.currency ?? "USD"} className={inputClass}>
            {OPTION_CURRENCIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </Label>
        <Label text="Cost from">
          <input name="cost_min" inputMode="numeric" defaultValue={o?.cost_min ?? ""} placeholder="8000" className={inputClass} />
        </Label>
        <Label text="Cost to">
          <input name="cost_max" inputMode="numeric" defaultValue={o?.cost_max ?? ""} placeholder="10500" className={inputClass} />
        </Label>
      </div>
      <Label text="Hospital stay">
        <input name="hospital_days" defaultValue={o?.hospital_days ?? ""} maxLength={40} placeholder="5–7 days" className={inputClass} />
      </Label>
      <Label text="Time in India">
        <input name="total_days" defaultValue={o?.total_days ?? ""} maxLength={40} placeholder="About 3 weeks" className={inputClass} />
      </Label>
      <Label text="Included">
        <textarea name="inclusions" defaultValue={o?.inclusions ?? ""} rows={3} maxLength={2000} className={textareaClass} />
      </Label>
      <Label text="Not included">
        <textarea name="exclusions" defaultValue={o?.exclusions ?? ""} rows={3} maxLength={2000} className={textareaClass} />
      </Label>
      <Label text="Notes for the patient" className="sm:col-span-2">
        <textarea name="notes" defaultValue={o?.notes ?? ""} rows={2} maxLength={2000} className={textareaClass} />
      </Label>
      <Label text="Estimate valid until">
        <input type="date" name="valid_until" defaultValue={o?.valid_until ?? ""} className={inputClass} />
      </Label>
      <label className="flex items-center gap-2 self-end pb-2.5 text-sm">
        <input type="checkbox" name="recommended" defaultChecked={Boolean(o?.recommended)} className="size-4 accent-brand" />
        Mark as our suggestion
      </label>
      <div className="sm:col-span-2">
        <button type="submit" className={buttonClasses({ variant: "dark", size: "sm" })}>
          {o ? "Save option" : "Add option"}
        </button>
      </div>
    </form>
  );
}
