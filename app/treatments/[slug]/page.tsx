import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTreatment, treatments } from "@/data/treatments";
import { pageMetadata } from "@/lib/seo";
import { TreatmentGuide } from "@/components/treatments/treatment-guide";

export const dynamicParams = false;

export function generateStaticParams() {
  return treatments.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: PageProps<"/treatments/[slug]">): Promise<Metadata> {
  const t = getTreatment((await params).slug);
  if (!t) return {};
  return pageMetadata({ title: t.seo.title, description: t.seo.description, path: `/treatments/${t.slug}` });
}

export default async function TreatmentPage({ params }: PageProps<"/treatments/[slug]">) {
  const t = getTreatment((await params).slug);
  if (!t) notFound();
  return (
    <TreatmentGuide
      treatment={t}
      crumbs={[
        { name: "Treatments", path: "/treatments" },
        { name: t.name, path: `/treatments/${t.slug}` },
      ]}
    />
  );
}
