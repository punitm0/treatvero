import { cities } from "@/data/destinations";
import { doctors } from "@/data/doctors";
import { getHospital } from "@/data/hospitals";
import { treatments } from "@/data/treatments";
import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/ui/page-hero";
import { Container } from "@/components/ui/primitives";
import { DoctorCard } from "@/components/doctors/doctor-card";
import { DoctorsBrowser } from "@/components/doctors/doctors-browser";
import { FinalCta } from "@/components/home/final-cta";

export const metadata = pageMetadata({
  title: "Doctors at Accredited Hospitals in India",
  description:
    "Specialists at JCI- and NABH-accredited hospitals in India, with their roles, qualifications and experience as the hospitals publish them. Request an opinion through TreatVero.",
  path: "/doctors",
});

const notes = [
  {
    title: "From the hospitals",
    text: "Roles, qualifications and experience come from each hospital's own doctor profile, checked on the date we list.",
  },
  {
    title: "Not a ranking",
    text: "We don't rate or rank doctors. Listings help you see who practises where; the right specialist depends on your case.",
  },
  {
    title: "Ask for a doctor",
    text: "Name a doctor in your request and we'll ask the hospital for their opinion. Availability is confirmed by the hospital.",
  },
];

export default function DoctorsPage() {
  const cityOptions = cities
    .filter((c) => doctors.some((d) => getHospital(d.hospital)!.city === c.slug))
    .map((c) => ({ slug: c.slug, name: c.name }));
  const treatmentOptions = treatments
    .filter((t) => doctors.some((d) => d.specialties.includes(t.slug)))
    .map((t) => ({ slug: t.slug, name: t.name }));
  return (
    <>
      <PageHero
        crumbs={[{ name: "Doctors", path: "/doctors" }]}
        eyebrow="Specialists"
        title={
          <>
            Doctors at accredited hospitals, <em className="text-brand">in their own words.</em>
          </>
        }
        lede="Browse specialists by treatment and city. When you're ready, ask for an opinion: we share your reports with the doctor's hospital and bring back a treatment plan and estimate."
      />
      <section aria-label="About these listings" className="pb-[clamp(56px,7vw,88px)]">
        <Container>
          <ul className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-x-10 gap-y-6 p-0">
            {notes.map((n, i) => (
              <li key={n.title} className="border-t border-line-strong pt-5">
                <span className="font-mono text-xs text-brand">0{i + 1}</span>
                <h2 className="mt-2 mb-1.5 text-[17px] font-medium">{n.title}</h2>
                <p className="m-0 text-[15px] text-ink-muted">{n.text}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>
      <section aria-labelledby="doctor-listings" className="section-y-sm bg-sand">
        <Container>
          <h2 id="doctor-listings" className="text-h2-sm mt-0 mb-7">
            Browse doctors
          </h2>
          <DoctorsBrowser
            treatments={treatmentOptions}
            cities={cityOptions}
            cards={doctors.map((d) => ({
              key: d.slug,
              city: getHospital(d.hospital)!.city,
              treatments: d.specialties,
              node: <DoctorCard doctor={d} />,
            }))}
          />
        </Container>
      </section>
      <FinalCta
        title="Not sure which specialist you need?"
        text="Share your reports and we'll request opinions from suitable doctors and hospitals for your case."
      />
    </>
  );
}
