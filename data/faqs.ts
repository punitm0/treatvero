import type { FAQ } from "@/types";
import { formatPlanPrice, plans } from "@/data/pricing";

const basic = `${plans.basic.name} (${formatPlanPrice(plans.basic)})`;
const concierge = `${plans.concierge.name} (${formatPlanPrice(plans.concierge)})`;

export const generalFaqs: FAQ[] = [
  {
    question: "What is TreatVero?",
    answer:
      "TreatVero is an independent medical travel facilitator and patient concierge. We help international patients obtain treatment options from hospitals abroad and coordinate the non-medical parts of the journey — hospital communication, appointments, medical visas, accommodation, airport pickup and on-ground support.",
  },
  {
    question: "Is TreatVero a hospital?",
    answer:
      "No. TreatVero is not a hospital or medical provider. We don't diagnose, prescribe or give medical advice. Medical decisions are made by you together with licensed healthcare professionals.",
  },
  {
    question: "How does TreatVero work?",
    answer:
      "Tell us what you need and share any medical reports. With your consent, we contact suitable hospitals and help obtain treatment options and estimates. You choose your provider, and we help plan your journey and support you during your stay.",
  },
  {
    question: "How much does TreatVero cost?",
    answer: `TreatVero is a paid service with two plans, priced in USD and agreed before any work starts: ${basic} and ${concierge}. There is no free plan. Medical treatment and other third-party costs are paid separately.`,
  },
  {
    question: "What does the Basic plan include?",
    answer:
      "Basic covers initial case coordination, treatment requirement intake, collection of your medical reports, suitable hospital options, treatment estimate coordination, appointment coordination, hospital communication, visa invitation coordination, WhatsApp/email support and a primary TreatVero coordinator.",
  },
  {
    question: "What does Concierge include?",
    answer:
      "Everything in Basic, plus a dedicated coordinator, medical visa guidance, accommodation coordination, airport pickup, local transportation, hospital accompaniment, translation assistance, family/companion support, admission and discharge coordination, follow-up coordination, return travel assistance, priority WhatsApp support and on-ground assistance.",
  },
  {
    question: "Are treatment costs included?",
    answer:
      "No. Medical treatment, visa fees, flights, hotels, transportation and other third-party expenses are paid separately. Our plan fees cover TreatVero's coordination services only.",
  },
  {
    question: "Can TreatVero help with medical visas?",
    answer:
      "Yes. We coordinate the hospital's visa invitation letter on both plans, and Concierge adds guidance with your visa documentation. Visa decisions are made by the relevant government authorities, so approval can't be guaranteed.",
  },
  {
    question: "Can you coordinate accommodation?",
    answer:
      "Yes, as part of the Concierge plan. We suggest options near your hospital that suit your length of stay, mobility and companions. You pay the accommodation provider directly.",
  },
  {
    question: "Can family travel with me?",
    answer:
      "Yes — most patients travel with a companion. With Concierge, we can help with your companion's visa documentation, accommodation and local support.",
  },
  {
    question: "Do I pay TreatVero or the hospital?",
    answer:
      "Both, for different things. You pay TreatVero only for your chosen plan. Treatment is generally paid directly to the hospital, and third-party services such as hotels and flights are paid to those providers.",
  },
  {
    question: "How are hospitals selected?",
    answer:
      "Based on your medical requirement, the relevant specialties and accreditations, your preferred city and practical factors such as availability. We'll always be clear about how an option was sourced, and we don't rank doctors.",
  },
  {
    question: "Can I choose my own doctor?",
    answer:
      "Always. You choose your hospital and doctor. If you already have one in mind, we can request an estimate from them directly.",
  },
  {
    question: "Is my medical information secure?",
    answer:
      "We treat medical information as sensitive. Reports are shared with healthcare providers only when necessary to obtain treatment options, and only with your consent. You can ask us to delete your information at any time.",
  },
  {
    question: "Which destinations are available?",
    answer:
      "We currently coordinate treatment in India. Turkey, Thailand, the UAE and Singapore are coming soon, with South Korea and Malaysia planned. We welcome patients from any country of residence.",
  },
];

export const indiaFaqs: FAQ[] = [
  {
    question: "Do I need a medical visa for India?",
    answer:
      "Most international patients travel on India's Medical visa; many nationalities can apply online for an e-Medical visa. Requirements depend on your nationality, so always check the official Indian visa portal. We'll help you prepare the documents.",
  },
  {
    question: "Can my family come with me?",
    answer:
      "Yes. Companions typically apply for a Medical Attendant visa linked to the patient's visa. Limits and conditions apply; we'll walk you through them.",
  },
  {
    question: "Which city should I choose?",
    answer:
      "It depends on the hospitals suited to your treatment, flight connections from your country and your preferences. We'll explain the trade-offs — the choice is yours.",
  },
  {
    question: "Is English spoken in hospitals?",
    answer:
      "English is widely used in major hospitals for consultations and documentation. If you prefer another language, we can arrange language assistance.",
  },
  {
    question: "How long will I need to stay?",
    answer:
      "It depends on your treatment and recovery. Each hospital's plan includes an expected hospital stay and time in India, so you can plan accommodation and leave.",
  },
  {
    question: "How do I pay the hospital?",
    answer:
      "Treatment is generally paid directly to the hospital. Accepted payment methods vary — we'll help you confirm them before you travel.",
  },
];

export const pricingFaqs: FAQ[] = generalFaqs.filter((f) =>
  [
    "How much does TreatVero cost?",
    "What does the Basic plan include?",
    "What does Concierge include?",
    "Are treatment costs included?",
    "Do I pay TreatVero or the hospital?",
  ].includes(f.question),
);
