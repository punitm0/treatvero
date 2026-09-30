import type { IconName } from "@/components/ui/icon";

/* ------------------------------- Navigation ------------------------------- */

export const mainNav: { label: string; href: string }[] = [
  { label: "Treatments", href: "/treatments" },
  { label: "Destinations", href: "/india" },
  { label: "Hospitals", href: "/hospitals" },
  { label: "Doctors", href: "/doctors" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Concierge", href: "/concierge" },
  { label: "Pricing", href: "/pricing" },
];

/* ------------------------------ How it works ------------------------------ */

export const howItWorksSteps: { title: string; text: string; tag: string }[] = [
  {
    title: "Tell us what you need",
    text: "Share your treatment requirement and, if you have them, your medical reports.",
    tag: "A few minutes",
  },
  {
    title: "Receive treatment options",
    text: "TreatVero coordinates with suitable hospitals and helps obtain treatment estimates.",
    tag: "From hospitals",
  },
  {
    title: "Choose your provider",
    text: "You choose the hospital and doctor you are comfortable with.",
    tag: "Your decision",
  },
  {
    title: "Plan your journey",
    text: "We help with medical visa documentation, accommodation, airport pickup and local transport.",
    tag: "Visa · stay · transfers",
  },
  {
    title: "Get support throughout your stay",
    text: "A patient coordinator can assist through appointments, treatment, discharge and return travel.",
    tag: "On the ground",
  },
];

/** Index of the highlighted step in the design (filled circle). */
export const HOW_IT_WORKS_HIGHLIGHT = 2;

/* ----------------------------- Why TreatVero ------------------------------ */

export const whyTreatVero: { icon: IconName; title: string; text: string }[] = [
  {
    icon: "compass",
    title: "Independent guidance",
    text: "We are not a hospital. Our role is to help you navigate your options — not to steer you toward one.",
  },
  {
    icon: "compare",
    title: "Multiple treatment options",
    text: "Get estimates from suitable hospitals without contacting each provider yourself.",
  },
  {
    icon: "receipt",
    title: "Transparent process",
    text: "Costs and services are explained clearly before you travel, including what is and isn't covered.",
  },
  {
    icon: "luggage",
    title: "Travel assistance",
    text: "Help with medical visa documentation, accommodation, airport pickup and transport.",
  },
  {
    icon: "headset",
    title: "Dedicated coordinator",
    text: "One point of contact who knows your case, throughout the journey.",
  },
  {
    icon: "route",
    title: "End-to-end support",
    text: "From your first enquiry until you are home again — and follow-ups after.",
  },
];

/* -------------------------------- Concierge ------------------------------- */

export type ConciergeService = { icon: IconName; title: string; text: string };

export const conciergeGroups: { title: string; items: ConciergeService[] }[] = [
  {
    title: "Before you travel",
    items: [
      { icon: "hospital", title: "Hospital coordination", text: "Your case shared with suitable hospitals, with your consent." },
      { icon: "headset", title: "Patient coordinator", text: "One person who knows your case from the first conversation." },
      { icon: "id-card", title: "Medical visa assistance", text: "Help preparing your visa documents and invitation letter." },
      { icon: "hotel", title: "Accommodation coordination", text: "Stays near your hospital, sized to your recovery." },
    ],
  },
  {
    title: "In destination",
    items: [
      { icon: "taxi", title: "Airport pickup", text: "Met on arrival and taken to your stay." },
      { icon: "car", title: "Local transportation", text: "Rides to appointments and back." },
      { icon: "clipboard-check", title: "Admission coordination", text: "Paperwork and timings handled with the hospital." },
      { icon: "handshake", title: "Hospital accompaniment", text: "Someone beside you at admission and key visits." },
      { icon: "languages", title: "Translation support", text: "Interpreters for consultations when needed." },
      { icon: "users", title: "Family/companion assistance", text: "Support for the people travelling with you." },
    ],
  },
  {
    title: "Going home",
    items: [
      { icon: "file", title: "Discharge assistance", text: "Records, prescriptions and fit-to-fly paperwork." },
      { icon: "calendar-clock", title: "Follow-up coordination", text: "In person or remote, with your treating team." },
      { icon: "plane-takeoff", title: "Return travel assistance", text: "A comfortable, well-timed journey home." },
    ],
  },
];

/* ----------------------------- Patient journey ---------------------------- */

export const patientJourney: { phase?: string; stage: string; role: string }[] = [
  { phase: "Before you travel", stage: "Home", role: "A first conversation, on WhatsApp or by email, whenever suits you." },
  { stage: "Medical enquiry", role: "We review what you share and tell you what hospitals will need." },
  { stage: "Treatment options", role: "We request estimates from suitable hospitals and explain them clearly." },
  { stage: "Hospital selection", role: "You choose. We answer questions and confirm next steps." },
  { stage: "Medical visa", role: "We coordinate the invitation letter and help with your documents." },
  { stage: "Travel", role: "We help plan travel and arrange accommodation near your hospital." },
  { phase: "In destination", stage: "Arrival", role: "Airport pickup and transfer to your accommodation." },
  { stage: "Hospital & treatment", role: "Your coordinator helps with admission, appointments and language." },
  { stage: "Recovery", role: "Transport, companion support and regular check-ins." },
  { stage: "Follow-up", role: "Follow-up appointments scheduled; records and reports collected." },
  { phase: "After", stage: "Return home", role: "Return travel coordinated, with remote follow-ups arranged if needed." },
];

/* ---------------------------------- Trust --------------------------------- */

export const trustPoints: { icon: IconName; lead: string; text: string }[] = [
  { icon: "network", lead: "Independent facilitator.", text: "TreatVero is an independent medical travel facilitator." },
  { icon: "building", lead: "Not a hospital.", text: "We are not a hospital or medical provider." },
  { icon: "stethoscope", lead: "No diagnosis or prescriptions.", text: "TreatVero does not diagnose patients or prescribe treatment." },
  { icon: "badge-check", lead: "Licensed professionals advise.", text: "Medical recommendations come from licensed healthcare professionals." },
  { icon: "user-check", lead: "You choose.", text: "Patients choose their own hospital and doctor." },
  { icon: "shield-check", lead: "Consent first.", text: "Medical reports are only shared when necessary, and only with your consent." },
  { icon: "scale", lead: "No outcome guarantees.", text: "We do not guarantee treatment outcomes — and no one should promise you one." },
];

/* -------------------------- Comparison (sample) --------------------------- */

/**
 * ILLUSTRATIVE EXAMPLE — shows the format patients receive, with realistic-
 * looking figures so the layout reads naturally. The hospitals are unnamed and
 * the figures are invented: always shown with the "Illustrative" label and
 * never presented as quotes, price guidance or real estimates.
 */
export const comparisonSample = {
  scenario: "Example: total knee replacement, one knee",
  options: [
    { label: "Option A", hospital: "Multi-specialty hospital", city: "Delhi NCR" },
    { label: "Option B", hospital: "Orthopaedic centre", city: "Chennai" },
    { label: "Option C", hospital: "Multi-specialty hospital", city: "Mumbai" },
  ],
  rows: [
    { key: "hospital", label: "Hospital" },
    { key: "city", label: "City" },
    {
      key: "doctor",
      label: "Doctor",
      values: ["Senior orthopaedic surgeon · 22 yrs", "Joint replacement surgeon · 17 yrs", "Senior orthopaedic surgeon · 26 yrs"],
    },
    { key: "cost", label: "Estimated treatment cost", values: ["$5,400 – $6,200", "$4,600 – $5,300", "$5,900 – $6,800"], mono: true },
    {
      key: "includes",
      label: "Estimate includes",
      values: ["Surgery, implant, 4 nights, in-hospital physio", "Surgery, implant, 5 nights", "Surgery, implant, 4 nights, 6 physio sessions"],
    },
    { key: "stay", label: "Expected stay", values: ["4 days in hospital · 3 weeks in India", "5 days in hospital · 3 weeks in India", "4 days in hospital · 2–3 weeks in India"] },
    { key: "accreditation", label: "Accreditation", values: ["JCI · NABH", "NABH", "JCI · NABH"] },
    { key: "reply", label: "Hospital replied in", values: ["2 working days", "3 working days", "1 working day"] },
    { key: "next", label: "Next step", values: ["Video consultation with the surgeon", "Surgeon reviews recent X-rays", "Video consultation with the surgeon"] },
  ],
} as const;
