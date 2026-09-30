import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin } from "lucide-react";
import type { Doctor, FAQ } from "@/types";
import { doctors, getDoctor, getRelatedDoctors } from "@/data/doctors";
import { getHospital, hospitalPlace } from "@/data/hospitals";
import { getTreatmentOrThrow } from "@/data/treatments";
import { doctorJsonLd, pageMetadata } from "@/lib/seo";
import { enquiryHref } from "@/lib/enquiry-link";
import { PageHero } from "@/components/ui/page-hero";
import { Chip, Container, Eyebrow } from "@/components/ui/primitives";
import { Icon } from "@/components/ui/icon";
import { JsonLd } from "@/components/ui/json-ld";
import { DoctorAvatar, DoctorCard } from "@/components/doctors/doctor-card";
import { HospitalCardCompact } from "@/components/hospitals/hospital-card";
import { FaqSection } from "@/components/home/faq-section";
import { FinalCta } from "@/components/home/final-cta";

export const dynamicParams = false;

function doctorFaqs(d: Doctor): FAQ[] {
  const h = getHospital(d.hospital)!;
  const faqs: FAQ[] = [
    {
      question: `Where does ${d.name} practise?`,
      answer: `${d.name} is listed by ${h.name}, ${hospitalPlace(h)}, as ${d.designation}${d.department && !d.designation.includes(d.department) ? ` in ${d.department}` : ""}.`,
    },
  ];
  if (d.qualifications.length) {
    faqs.push({
      question: `What are ${d.name}'s qualifications?`,
      answer: `${h.name} lists ${d.qualifications.join(", ")}${d.experience ? `, and ${d.experience} of experience` : ""}.`,
    });
  }
  faqs.push(
    {
      question: `How do I get an opinion from ${d.name}?`,
      answer: `Send your requirement and medical reports through TreatVero and name ${d.name}. With your consent, we share your case with ${h.name} and ask for the doctor's opinion, a treatment plan and an estimate. The hospital confirms whether the doctor can take your case.`,
    },
    {
      question: `Can I have a video consultation with ${d.name} before travelling?`,
      answer: `Often, yes. We can ask ${h.name} whether ${d.name} can review your case by video before you travel, and what it costs; the hospital sets the schedule and fee, and TreatVero arranges it with you.`,
    },
  );
  if (!h.isConfirmedPartner) {
    faqs.push({
      question: `Does ${d.name} work with TreatVero?`,
      answer: `No. TreatVero is an independent medical travel facilitator. This profile uses information ${h.name} publishes; we request opinions from the hospital on your behalf.`,
    });
  }
  return faqs;
}

export function generateStaticParams() {
  return doctors.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps<"/doctors/[slug]">): Promise<Metadata> {
  const d = getDoctor((await params).slug);
  if (!d) return {};
  const h = getHospital(d.hospital)!;
  return pageMetadata({
    title: `${d.name}, ${d.department} · ${h.name}`,
    description: [
      `${d.name} is ${d.designation} at ${h.name}, ${hospitalPlace(h)}.`,
      d.qualifications.length ? `${d.qualifications.slice(0, 3).join(", ")}.` : null,
      d.experience ? `${d.experience} of experience.` : null,
      "Request an opinion through TreatVero.",
    ]
      .filter(Boolean)
      .join(" "),
    path: `/doctors/${d.slug}`,
    image: d.photo ? { path: d.photo, alt: d.name } : undefined,
  });
}

export default async function DoctorPage({ params }: PageProps<"/doctors/[slug]">) {
  const d = getDoctor((await params).slug);
  if (!d) notFound();
  const h = getHospital(d.hospital)!;
  const related = getRelatedDoctors(d, 3);
  const faqs = doctorFaqs(d);
  const facts = [
    { label: "Department", value: d.department },
    d.experience ? { label: "Experience", value: `${d.experience}` } : null,
    d.languages?.length ? { label: "Languages", value: d.languages.join(", ") } : null,
  ].filter((f) => f !== null);

  return (
    <>
      <JsonLd data={doctorJsonLd(d)} />
      <PageHero
        crumbs={[
          { name: "Doctors", path: "/doctors" },
          { name: d.name, path: `/doctors/${d.slug}` },
        ]}
        eyebrow={
          <p className="mb-5 flex items-center gap-1 text-sm text-ink-muted">
            <MapPin aria-hidden="true" className="size-4" strokeWidth={1.75} />
            <Link href={`/hospitals/${h.slug}`} className="text-ink-muted hover:text-brand">
              {h.name}
            </Link>
            <span>, {hospitalPlace(h)}</span>
          </p>
        }
        title={d.name}
        lede={d.designation}
        ctaHref={enquiryHref({ hospital: h.slug, doctor: d.slug })}
        ctaLabel="Request an Opinion"
        aside={
          <div className="flex flex-col gap-6 rounded-3xl border border-line bg-surface p-[clamp(22px,3vw,32px)] sm:flex-row sm:items-center">
            <DoctorAvatar doctor={d} size={168} className="rounded-[24px]" />
            <dl className="m-0 flex flex-col gap-3">
              {facts.map((f) => (
                <div key={f.label}>
                  <dt className="text-xs text-ink-subtle">{f.label}</dt>
                  <dd className="m-0 text-[15px]">{f.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        }
      />

      <section aria-labelledby="doctor-about" className="pb-[clamp(56px,7vw,96px)]">
        <Container className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,360px),1fr))] items-start gap-x-20 gap-y-8">
          <div>
            <h2 id="doctor-about" className="text-h2-sm mt-0 mb-5">
              About {d.name}
            </h2>
            {d.about ? <p className="mt-0 mb-5 text-base text-pretty text-ink-muted">{d.about}</p> : null}
            {d.qualifications.length ? (
              <>
                <h3 className="label-mono mt-6 mb-3 font-normal text-ink-subtle">Qualifications</h3>
                <ul className="m-0 flex flex-col gap-1.5 pl-5 text-[15px]">
                  {d.qualifications.map((q) => (
                    <li key={q}>{q}</li>
                  ))}
                </ul>
              </>
            ) : null}
          </div>
          <div className="flex flex-col gap-4">
            {d.expertise?.length ? (
              <div className="rounded-[20px] border border-line bg-surface p-[22px]">
                <h3 className="label-mono mt-0 mb-4 font-normal text-ink-subtle">Areas of practice</h3>
                <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
                  {d.expertise.map((e) => (
                    <li key={e}>
                      <Chip>{e}</Chip>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            <div className="rounded-[20px] border border-line bg-surface p-[22px]">
              <h3 className="label-mono mt-0 mb-4 font-normal text-ink-subtle">Treatment guides</h3>
              <ul className="m-0 flex list-none flex-col gap-3 p-0">
                {d.specialties.map((s) => {
                  const t = getTreatmentOrThrow(s);
                  return (
                    <li key={s}>
                      <Link href={`/treatments/${t.slug}`} className="flex items-center gap-2 text-[15px] font-medium text-ink no-underline hover:text-brand">
                        <Icon name={t.icon} className="size-5 shrink-0 text-brand" />
                        {t.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
            <p className="m-0 text-[13px] text-ink-subtle">
              From {h.name}&apos;s published profile of the doctor, checked{" "}
              {new Date(`${d.verifiedOn}T00:00:00Z`).toLocaleDateString("en-GB", { month: "long", year: "numeric", timeZone: "UTC" })}.
              Roles can change; the hospital confirms availability.
            </p>
          </div>
        </Container>
      </section>

      <section aria-labelledby="doctor-hospital" className="pb-[clamp(56px,7vw,96px)]">
        <Container>
          <Eyebrow>Hospital</Eyebrow>
          <h2 id="doctor-hospital" className="text-h2-sm mt-0 mb-7">
            Where {d.name} practises
          </h2>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,340px),1fr))] gap-4">
            <HospitalCardCompact hospital={h} />
          </div>
        </Container>
      </section>

      <FaqSection faqs={faqs} eyebrow="Doctor FAQ" title={`${d.name}: common questions`} />

      {related.length > 0 ? (
        <section aria-labelledby="related-doctors" className="section-y-sm">
          <Container>
            <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
              <div>
                <Eyebrow>Colleagues</Eyebrow>
                <h2 id="related-doctors" className="text-h2-sm m-0">
                  More doctors at {h.name}
                </h2>
              </div>
              <Link href="/doctors" className="text-[15px] font-medium no-underline">
                All doctors
              </Link>
            </div>
            <ul className="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(min(100%,300px),1fr))] gap-4 p-0">
              {related.map((r) => (
                <li key={r.slug} className="grid">
                  <DoctorCard doctor={r} showHospital={false} />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}

      <FinalCta title={`Ask for ${d.name}'s opinion on your case.`} />
    </>
  );
}
