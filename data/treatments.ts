import type { Treatment, TreatmentSlug } from "@/types";

/**
 * Treatment guides. Content is general information for international
 * patients — never individual medical advice. Stay durations are broad,
 * commonly-cited ranges and are always confirmed in the treating
 * hospital's plan. No prices are published here by design.
 */

const commonCostFactors = [
  "The hospital and city you choose",
  "Your surgeon's or consultant's fees",
  "Room category during your hospital stay",
  "Your medical condition, test results and any other health conditions",
  "Length of hospital stay and time needed in the country",
  "Implants, devices or medicines required",
];

export const treatments: Treatment[] = [
  {
    slug: "cardiac-care",
    name: "Cardiac Care",
    shortName: "Cardiac",
    icon: "heart-pulse",
    summary: "Bypass, valve repair, angioplasty and cardiac diagnostics.",
    overview: [
      "Cardiac care covers the diagnosis and treatment of conditions affecting the heart and blood vessels — from diagnostic tests and interventional procedures to open-heart surgery and cardiac rehabilitation.",
      "International patients often look abroad when they have received a recommendation from their own cardiologist and want to understand the options, timelines and costs available elsewhere. TreatVero helps you gather treatment options from suitable hospitals and coordinates the journey around your care.",
    ],
    commonReasons: [
      "A recommendation for coronary bypass surgery (CABG) or angioplasty",
      "Heart valve repair or replacement",
      "Congenital heart conditions in children or adults",
      "Heart rhythm disorders that may need ablation or a device",
      "A second opinion on a proposed cardiac procedure",
      "Comprehensive cardiac evaluation and diagnostics",
    ],
    approaches: [
      { name: "Diagnostics", description: "ECG, echocardiography, stress testing, CT or invasive angiography to understand the heart's condition." },
      { name: "Interventional cardiology", description: "Catheter-based procedures such as angioplasty and stenting, performed through a blood vessel." },
      { name: "Cardiac surgery", description: "Open or minimally invasive surgery, including bypass grafting and valve procedures." },
      { name: "Electrophysiology", description: "Assessment and treatment of rhythm disorders, including ablation and pacemaker or defibrillator implantation." },
      { name: "Cardiac rehabilitation", description: "Supervised recovery, exercise and lifestyle guidance after treatment." },
    ],
    typicalStay: {
      hospital: "From a few days for catheter procedures to a week or more after open-heart surgery",
      inCountry: "Often 1–3 weeks, depending on the procedure and recovery",
      note: "Your treating team decides when you are fit to fly.",
    },
    costFactors: [...commonCostFactors, "Type of procedure (e.g. catheter-based vs open surgery)", "Number of stents, grafts or valves required"],
    questionsForDoctor: [
      "What are all my treatment options, including non-surgical ones?",
      "What are the benefits and risks of the recommended procedure in my case?",
      "How many of these procedures does your team perform?",
      "How long will I be in hospital, and when can I fly home?",
      "What follow-up will I need, and can it be done in my home country?",
      "Which medicines will I need to take afterwards, and for how long?",
    ],
    usefulReports: ["Recent ECG and echocardiogram", "Angiography report and images/CD if available", "Blood test results", "Current medication list", "Your cardiologist's letter or referral"],
    faqs: [
      {
        question: "Can hospitals review my case before I travel?",
        answer: "Usually, yes. With your consent, we share your reports with suitable hospitals so their specialists can review them and suggest a treatment plan and estimate. Final decisions are made after in-person assessment.",
      },
      {
        question: "Can a family member travel with me?",
        answer: "Most cardiac patients travel with a companion, and we recommend it. We can help with their visa documentation, accommodation and local support.",
      },
      {
        question: "What happens if my plan changes after I arrive?",
        answer: "Doctors may adjust a plan after examining you. Your coordinator helps you understand what has changed, any cost implications, and your options.",
      },
    ],
    seo: {
      title: "Cardiac Care Abroad — Heart Treatment Options",
      description: "Explore cardiac treatment options abroad, including bypass, valve procedures and angioplasty. Understand typical stays, cost factors and questions to ask.",
    },
  },
  {
    slug: "cancer-treatment",
    name: "Cancer Treatment",
    shortName: "Cancer",
    icon: "ribbon",
    summary: "Surgical, medical and radiation oncology, second opinions.",
    overview: [
      "Cancer care is usually delivered by a multidisciplinary team — surgical, medical and radiation oncologists, pathologists and radiologists — who review your case together to recommend a plan.",
      "Many international patients start by seeking a second opinion or an independent review of a proposed plan. TreatVero coordinates your records with suitable hospitals so you can understand your options and make an informed decision with your doctors.",
    ],
    commonReasons: [
      "A second opinion on diagnosis or treatment plan",
      "Access to specific surgical or radiation techniques",
      "Chemotherapy, targeted therapy or immunotherapy planning",
      "Bone marrow transplant evaluation",
      "Shorter waiting times for treatment to begin",
    ],
    approaches: [
      { name: "Tumour board review", description: "A multidisciplinary team reviews your reports, scans and pathology to recommend a plan." },
      { name: "Surgical oncology", description: "Surgery to remove tumours, sometimes using minimally invasive or robotic techniques." },
      { name: "Medical oncology", description: "Chemotherapy, targeted therapy, hormone therapy or immunotherapy, often given in cycles." },
      { name: "Radiation oncology", description: "Radiotherapy delivered over a course of sessions, planned precisely for your case." },
      { name: "Supportive care", description: "Nutrition, pain management and psychological support alongside treatment." },
    ],
    typicalStay: {
      hospital: "Varies widely — from day-care sessions to a longer admission after major surgery",
      inCountry: "From a few days for a review to several weeks or months for a full course of treatment",
      note: "Many plans combine treatment abroad with follow-up at home; ask your oncologist what is possible.",
    },
    costFactors: [...commonCostFactors, "Cancer type, stage and the treatment modalities recommended", "Number of chemotherapy cycles or radiotherapy sessions", "Specialised drugs or diagnostics such as PET-CT or genetic testing"],
    questionsForDoctor: [
      "What is the stage and type of my cancer, and how certain is the diagnosis?",
      "What treatment do you recommend, and what are the alternatives?",
      "What is the goal of treatment in my case?",
      "How long will the full course take, and which parts must happen in person?",
      "What side effects should I expect, and how are they managed?",
      "Can part of my treatment or follow-up continue in my home country?",
    ],
    usefulReports: ["Biopsy and histopathology reports", "Recent PET-CT, CT or MRI reports and images", "Blood tests and tumour markers", "Details of previous treatment", "Your oncologist's summary"],
    faqs: [
      {
        question: "Can I get a second opinion without travelling?",
        answer: "Often, yes. Many hospitals can review reports and images remotely. Some cases need slides or blocks re-examined, which we can help you arrange.",
      },
      {
        question: "Will the hospital's plan be the same as my current doctor's?",
        answer: "Not necessarily. Specialists may recommend different approaches. We present the responses clearly so you can discuss them with the doctors you trust.",
      },
      {
        question: "Does TreatVero recommend a specific cancer centre?",
        answer: "No. We help you obtain options from suitable hospitals and explain what each includes. You choose, with advice from licensed healthcare professionals.",
      },
    ],
    seo: {
      title: "Cancer Treatment Abroad — Oncology Options & Second Opinions",
      description: "Get help obtaining oncology treatment options and second opinions abroad. Learn about typical approaches, stays, cost factors and questions to ask.",
    },
  },
  {
    slug: "orthopaedics",
    name: "Orthopaedics",
    shortName: "Orthopaedics",
    icon: "bone",
    summary: "Knee and hip replacement, sports injuries, trauma.",
    overview: [
      "Orthopaedic care treats conditions of the bones, joints, ligaments and muscles — from joint replacement to arthroscopy and fracture care.",
      "Joint replacement is one of the most common reasons patients travel for treatment. TreatVero helps you obtain options and estimates, and coordinates accommodation suited to recovery and physiotherapy.",
    ],
    commonReasons: [
      "Knee replacement (total or partial)",
      "Hip replacement or revision surgery",
      "Arthroscopy for ligament or cartilage injuries",
      "Shoulder surgery, including rotator cuff repair",
      "Correction of deformities or complex fracture care",
    ],
    approaches: [
      { name: "Conservative management", description: "Physiotherapy, medication or injections, where appropriate." },
      { name: "Arthroscopy", description: "Keyhole surgery to repair ligaments, cartilage or other joint structures." },
      { name: "Joint replacement", description: "Replacing a damaged joint with an implant, including computer-assisted or robotic techniques at some hospitals." },
      { name: "Rehabilitation", description: "Structured physiotherapy to restore movement and strength after treatment." },
    ],
    typicalStay: {
      hospital: "Commonly a few days after a single joint replacement",
      inCountry: "Often 2–3 weeks, including early physiotherapy and a follow-up check",
      note: "Bilateral or revision surgery usually needs longer.",
    },
    costFactors: [...commonCostFactors, "Implant brand and type", "Single or bilateral (both sides) surgery", "Length of the physiotherapy programme"],
    questionsForDoctor: [
      "Am I a suitable candidate for surgery, and are there alternatives?",
      "Which implant do you recommend, and why?",
      "What will rehabilitation involve, and how long before I can walk unaided?",
      "When will it be safe for me to fly home?",
      "What physiotherapy should I continue at home?",
    ],
    usefulReports: ["Recent X-rays or MRI of the affected joint", "Orthopaedic consultation notes", "Blood tests", "Current medications", "Details of other health conditions"],
    faqs: [
      {
        question: "Should I stay near the hospital after discharge?",
        answer: "Usually, yes, for early physiotherapy and a follow-up visit. We can coordinate accessible accommodation close to your hospital.",
      },
      {
        question: "Do I need a companion?",
        answer: "It's strongly recommended, especially in the first days after surgery when mobility is limited.",
      },
    ],
    seo: {
      title: "Orthopaedic Treatment Abroad — Knee & Hip Replacement Options",
      description: "Explore orthopaedic treatment options abroad, including knee and hip replacement. Understand recovery, typical stays, cost factors and questions to ask.",
    },
  },
  {
    slug: "spine-surgery",
    name: "Spine Surgery",
    shortName: "Spine",
    icon: "activity",
    summary: "Disc surgery, spinal fusion, minimally invasive procedures.",
    overview: [
      "Spine care addresses conditions such as disc herniation, spinal stenosis, deformity and instability. Many spine conditions are managed without surgery; when surgery is recommended, techniques range from minimally invasive to complex reconstruction.",
      "Because spine decisions are nuanced, a careful review of your imaging by specialist spine surgeons is an important first step. TreatVero helps you obtain those reviews and options.",
    ],
    commonReasons: [
      "Persistent back or neck pain with nerve symptoms",
      "Disc herniation (slipped disc)",
      "Spinal stenosis",
      "Scoliosis or other spinal deformity",
      "A second opinion on recommended spine surgery",
    ],
    approaches: [
      { name: "Non-surgical care", description: "Physiotherapy, medication and pain-management procedures such as injections." },
      { name: "Minimally invasive surgery", description: "Smaller incisions for procedures such as microdiscectomy, where suitable." },
      { name: "Decompression", description: "Relieving pressure on nerves or the spinal cord." },
      { name: "Spinal fusion", description: "Joining vertebrae to provide stability, sometimes with implants." },
    ],
    typicalStay: {
      hospital: "From one or two days for some minimally invasive procedures to a week or more after fusion",
      inCountry: "Often 1–4 weeks, depending on the procedure",
    },
    costFactors: [...commonCostFactors, "Number of spinal levels treated", "Use of implants or navigation technology"],
    questionsForDoctor: [
      "Is surgery necessary, or should I try other treatments first?",
      "What does my imaging show, and how does it explain my symptoms?",
      "Which procedure do you recommend, and what are its risks?",
      "What recovery and restrictions should I expect?",
      "When can I travel, and how should I sit during the flight?",
    ],
    usefulReports: ["Recent MRI of the spine (report and images)", "X-rays, including standing films if taken", "Nerve conduction studies if done", "Treatment history", "Current medications"],
    faqs: [
      {
        question: "Can a surgeon review my MRI before I travel?",
        answer: "Yes. With your consent we share your imaging with suitable hospitals. Please include the images themselves where possible, not only the report.",
      },
    ],
    seo: {
      title: "Spine Surgery Abroad — Treatment Options & Second Opinions",
      description: "Explore spine surgery options abroad, from minimally invasive procedures to spinal fusion. Learn about typical stays, cost factors and questions to ask.",
    },
  },
  {
    slug: "ivf-fertility",
    name: "IVF & Fertility",
    shortName: "IVF",
    icon: "baby",
    summary: "IVF, ICSI, fertility assessment and preservation.",
    overview: [
      "Fertility care includes assessment of both partners, and treatments such as ovulation induction, IUI, IVF and ICSI. Fertility preservation, such as egg freezing, may also be available.",
      "Fertility treatment involves several steps over a number of weeks and is subject to local laws and regulations, which differ by country. TreatVero helps you obtain options from suitable clinics and plan the time you'll need.",
    ],
    commonReasons: [
      "Difficulty conceiving after trying for some time",
      "Previous unsuccessful fertility treatment",
      "Known conditions affecting fertility",
      "Fertility preservation before medical treatment",
    ],
    approaches: [
      { name: "Fertility assessment", description: "Tests for both partners to understand possible causes." },
      { name: "IUI", description: "Placing prepared sperm directly into the uterus around ovulation." },
      { name: "IVF", description: "Eggs are collected and fertilised in a laboratory; an embryo is transferred to the uterus." },
      { name: "ICSI", description: "A single sperm is injected into each egg, often used for male-factor infertility." },
      { name: "Fertility preservation", description: "Freezing eggs, sperm or embryos for future use." },
    ],
    typicalStay: {
      hospital: "Procedures are usually day-care",
      inCountry: "A single IVF cycle commonly needs around 2–4 weeks in the country",
      note: "Some monitoring may be possible at home before you travel; ask the clinic.",
    },
    costFactors: [...commonCostFactors, "Medicines and stimulation protocol", "Additional laboratory techniques", "Embryo freezing and storage"],
    questionsForDoctor: [
      "Which tests do we need before starting treatment?",
      "Which treatment do you recommend for us, and why?",
      "How long will we need to stay, and which steps can happen at home?",
      "What are the legal requirements for treatment here?",
      "What happens to any unused embryos?",
    ],
    usefulReports: ["Hormone test results", "Semen analysis", "Ultrasound reports", "Details of previous fertility treatment", "Relevant medical history"],
    faqs: [
      {
        question: "Are there legal restrictions on fertility treatment in India?",
        answer: "Yes. Assisted reproduction in India is regulated, and eligibility rules apply. Clinics will explain the requirements that apply to you, and we'll help you understand them before you plan travel.",
      },
      {
        question: "Can TreatVero tell us our chances of success?",
        answer: "No. Only your fertility specialist can discuss what may be realistic for you, and no one should guarantee an outcome.",
      },
    ],
    seo: {
      title: "IVF & Fertility Treatment Abroad — Options and Planning",
      description: "Explore IVF and fertility treatment options abroad. Understand approaches, time needed in country, cost factors and questions to ask your clinic.",
    },
  },
  {
    slug: "eye-care",
    name: "Eye Care",
    shortName: "Eye Care",
    icon: "eye",
    summary: "Cataract, LASIK, retina and corneal procedures.",
    overview: [
      "Eye care covers procedures from cataract surgery and vision correction to treatment of retinal and corneal conditions. Many eye procedures are performed as day-care surgery.",
      "TreatVero helps you obtain options from suitable eye hospitals and plans a short, well-timed stay around your procedure and follow-up checks.",
    ],
    commonReasons: [
      "Cataract surgery",
      "Refractive surgery such as LASIK",
      "Retinal conditions, including detachment or diabetic eye disease",
      "Corneal conditions and transplants",
      "Glaucoma management",
    ],
    approaches: [
      { name: "Comprehensive eye examination", description: "Detailed tests to confirm diagnosis and suitability for a procedure." },
      { name: "Cataract surgery", description: "Replacing the clouded lens with an artificial lens." },
      { name: "Refractive surgery", description: "Laser procedures to reduce dependence on glasses, for suitable candidates." },
      { name: "Retina and cornea procedures", description: "Specialised surgery or injections for retinal and corneal conditions." },
    ],
    typicalStay: {
      hospital: "Often day-care",
      inCountry: "Commonly a few days to about a week, allowing for follow-up checks",
    },
    costFactors: [...commonCostFactors, "Type of lens or laser technology", "One or both eyes treated"],
    questionsForDoctor: [
      "Am I a suitable candidate for this procedure?",
      "Which lens or technique do you recommend, and why?",
      "How many follow-up checks will I need before flying?",
      "What restrictions apply after the procedure?",
    ],
    usefulReports: ["Recent eye examination reports", "Prescription details", "Retinal scans or OCT reports if available", "Details of other health conditions such as diabetes"],
    faqs: [
      {
        question: "Can I fly soon after eye surgery?",
        answer: "It depends on the procedure. Some retinal procedures carry specific flying restrictions. Your surgeon will advise when it is safe to travel.",
      },
    ],
    seo: {
      title: "Eye Care Abroad — Cataract, LASIK & Retina Treatment Options",
      description: "Explore eye care options abroad, including cataract surgery, LASIK and retina procedures. Learn about typical stays and cost factors.",
    },
  },
  {
    slug: "neurology-neurosurgery",
    name: "Neurology & Neurosurgery",
    shortName: "Neurology",
    icon: "brain",
    summary: "Brain and nerve conditions, epilepsy, tumour surgery.",
    overview: [
      "Neurology and neurosurgery cover conditions of the brain, spinal cord and nerves — including tumours, epilepsy, movement disorders and vascular conditions.",
      "These are complex specialties where a detailed review of imaging and history matters. TreatVero helps you obtain specialist opinions and options, and coordinates the practical side of a potentially longer stay.",
    ],
    commonReasons: [
      "Brain or spinal tumours",
      "Epilepsy that is difficult to control with medication",
      "Movement disorders such as Parkinson's disease",
      "Cerebrovascular conditions such as aneurysms",
      "A second opinion on a neurological diagnosis",
    ],
    approaches: [
      { name: "Neurological evaluation", description: "Clinical assessment with imaging and tests such as EEG or nerve studies." },
      { name: "Medical management", description: "Medication and therapy plans overseen by a neurologist." },
      { name: "Neurosurgery", description: "Surgical treatment of tumours, vascular conditions or other structural problems." },
      { name: "Functional procedures", description: "Specialised procedures for epilepsy or movement disorders at selected centres." },
      { name: "Neuro-rehabilitation", description: "Physiotherapy, speech and occupational therapy during recovery." },
    ],
    typicalStay: {
      hospital: "Varies significantly by condition and procedure",
      inCountry: "Often 2–4 weeks for surgical cases; longer if rehabilitation is needed",
    },
    costFactors: [...commonCostFactors, "Complexity of the procedure", "Intensive care requirements", "Length of rehabilitation"],
    questionsForDoctor: [
      "What is causing my symptoms, and how confident are you in the diagnosis?",
      "What are the options, including non-surgical ones?",
      "What are the risks of the recommended treatment?",
      "What rehabilitation will I need, and where can it happen?",
      "When will it be safe for me to fly?",
    ],
    usefulReports: ["MRI or CT reports and images", "EEG or nerve study reports", "Neurologist's notes", "Current medications", "Previous treatment details"],
    faqs: [
      {
        question: "Can I travel for treatment if my condition is urgent?",
        answer: "Please speak with your local doctor first. Urgent or emergency situations should be handled locally. We can help once your doctor confirms travel is appropriate.",
      },
    ],
    seo: {
      title: "Neurology & Neurosurgery Abroad — Specialist Treatment Options",
      description: "Explore neurology and neurosurgery options abroad, including tumour surgery and epilepsy care. Learn about typical stays and questions to ask.",
    },
  },
  {
    slug: "organ-transplant",
    name: "Organ Transplant",
    shortName: "Transplant",
    icon: "hand-heart",
    summary: "Kidney, liver and bone marrow transplant programmes.",
    overview: [
      "Transplant programmes include kidney, liver and bone marrow transplantation. Living-donor organ transplants are strictly regulated, and international patients must meet legal and ethical requirements, including approval by authorised committees.",
      "TreatVero helps you understand the documentation involved and coordinate with hospitals' transplant teams. We never arrange donors, and we only work with lawful, hospital-led transplant processes.",
    ],
    commonReasons: [
      "End-stage kidney disease",
      "End-stage liver disease",
      "Blood cancers or disorders where a bone marrow transplant is recommended",
    ],
    approaches: [
      { name: "Transplant evaluation", description: "Detailed assessment of the patient and, where relevant, the donor." },
      { name: "Legal & ethics approval", description: "Documentation and committee approvals required by law, led by the hospital." },
      { name: "Transplant surgery", description: "Performed by the hospital's transplant team." },
      { name: "Post-transplant care", description: "Close monitoring and lifelong follow-up, including medication management." },
    ],
    typicalStay: {
      hospital: "Typically a few weeks, depending on the transplant",
      inCountry: "Often 1–3 months, including evaluation, approvals and early follow-up",
      note: "Bone marrow transplants commonly require longer stays.",
    },
    costFactors: [...commonCostFactors, "Evaluation of the patient and donor", "Legal documentation and approvals", "Post-transplant medicines and monitoring"],
    questionsForDoctor: [
      "Am I a suitable candidate for transplant?",
      "What evaluation will the donor and I need?",
      "What legal documentation and approvals apply to international patients?",
      "How long must we stay after the transplant?",
      "What lifelong follow-up and medication will I need at home?",
    ],
    usefulReports: ["Nephrology or hepatology reports", "Recent blood tests", "Imaging reports", "Dialysis details if applicable", "Documents the hospital requests for the donor"],
    faqs: [
      {
        question: "Can TreatVero find a donor?",
        answer: "No. We never arrange or source donors. Transplants involving living donors must follow the law, and all approvals are handled through the hospital and authorised committees.",
      },
      {
        question: "What documents will we need?",
        answer: "Hospitals provide a specific list, which usually includes proof of relationship between patient and donor and documents from your country. We help you prepare and organise them.",
      },
    ],
    seo: {
      title: "Organ Transplant Abroad — Kidney, Liver & Bone Marrow Programmes",
      description: "Understand transplant programmes abroad, including evaluation, legal requirements, typical stays and cost factors. TreatVero never arranges donors.",
    },
  },
  {
    slug: "dental-treatment",
    name: "Dental Treatment",
    shortName: "Dental",
    icon: "smile",
    summary: "Implants, full-mouth rehabilitation, cosmetic dentistry.",
    overview: [
      "Dental treatment ranges from implants and crowns to full-mouth rehabilitation and cosmetic procedures. Some treatments need more than one visit, spaced weeks or months apart.",
      "TreatVero helps you obtain treatment plans from suitable dental clinics and plan your trips around them.",
    ],
    commonReasons: [
      "Dental implants",
      "Full-mouth rehabilitation",
      "Crowns, bridges and veneers",
      "Root canal treatment",
      "Cosmetic dentistry",
    ],
    approaches: [
      { name: "Assessment", description: "Examination and imaging such as an OPG or CBCT scan." },
      { name: "Restorative dentistry", description: "Fillings, crowns, bridges and root canal treatment." },
      { name: "Implant dentistry", description: "Placing implants, often followed by a healing period before final teeth are fitted." },
      { name: "Cosmetic dentistry", description: "Veneers, whitening and smile design." },
    ],
    typicalStay: {
      hospital: "Usually outpatient",
      inCountry: "From a few days to around two weeks per visit; implants may need a second visit",
    },
    costFactors: [...commonCostFactors, "Number of teeth or implants", "Materials and implant systems used", "Whether bone grafting is required"],
    questionsForDoctor: [
      "What treatment do you recommend, and are there alternatives?",
      "How many visits will I need, and how far apart?",
      "What materials or implant system will you use?",
      "What aftercare will I need at home?",
    ],
    usefulReports: ["Recent dental X-rays or OPG", "CBCT scan if available", "Your dentist's treatment notes", "Relevant medical history"],
    faqs: [
      {
        question: "Can implants be completed in one trip?",
        answer: "Sometimes, but many implant treatments need a healing period between stages. The clinic will explain the timeline for your case.",
      },
    ],
    seo: {
      title: "Dental Treatment Abroad — Implants & Full-Mouth Rehabilitation",
      description: "Explore dental treatment options abroad, including implants and full-mouth rehabilitation. Understand visits needed, cost factors and questions to ask.",
    },
  },
  {
    slug: "bariatric-surgery",
    name: "Bariatric Surgery",
    shortName: "Bariatric",
    icon: "weight",
    summary: "Sleeve gastrectomy, gastric bypass, metabolic surgery.",
    overview: [
      "Bariatric and metabolic surgery can be considered for people living with obesity, sometimes alongside related conditions such as type 2 diabetes, after careful assessment by a specialist team.",
      "Surgery is one part of a longer programme that includes nutrition, lifestyle changes and follow-up. TreatVero helps you obtain options and plans your stay, and helps arrange follow-up coordination after you return home.",
    ],
    commonReasons: [
      "Obesity where other approaches have not been effective",
      "Obesity with related conditions such as type 2 diabetes",
      "Revision of previous bariatric surgery",
    ],
    approaches: [
      { name: "Pre-operative assessment", description: "Medical, nutritional and psychological evaluation to confirm suitability." },
      { name: "Sleeve gastrectomy", description: "Reducing the size of the stomach, usually by keyhole surgery." },
      { name: "Gastric bypass", description: "Creating a small stomach pouch connected to the small intestine." },
      { name: "Follow-up programme", description: "Dietary guidance, supplements and regular reviews after surgery." },
    ],
    typicalStay: {
      hospital: "Commonly a few days",
      inCountry: "Often 1–2 weeks, including post-operative review",
    },
    costFactors: [...commonCostFactors, "Type of procedure", "Pre-operative tests required", "Follow-up programme and supplements"],
    questionsForDoctor: [
      "Am I a suitable candidate, and which procedure do you recommend?",
      "What are the risks and possible long-term effects?",
      "What diet will I need to follow before and after surgery?",
      "What follow-up will I need at home, and for how long?",
    ],
    usefulReports: ["Recent blood tests", "Records of weight-management attempts", "Details of related conditions and medicines", "Any previous surgical reports"],
    faqs: [
      {
        question: "Can follow-up happen remotely?",
        answer: "Many hospitals offer remote follow-up consultations, and local follow-up with your own doctor is also important. We help coordinate follow-up appointments.",
      },
    ],
    seo: {
      title: "Bariatric Surgery Abroad — Sleeve Gastrectomy & Gastric Bypass",
      description: "Explore bariatric surgery options abroad, including sleeve gastrectomy and gastric bypass. Learn about assessment, typical stays and cost factors.",
    },
  },
];

export const treatmentSlugs = treatments.map((t) => t.slug);

export function getTreatment(slug: string): Treatment | undefined {
  return treatments.find((t) => t.slug === slug);
}

export function getTreatmentOrThrow(slug: TreatmentSlug): Treatment {
  const t = getTreatment(slug);
  if (!t) throw new Error(`Unknown treatment: ${slug}`);
  return t;
}

/** Shared international-patient journey shown on every treatment guide. */
export const internationalPatientJourney: { title: string; text: string }[] = [
  { title: "Share your reports", text: "Send your requirement and any reports through our form or WhatsApp." },
  { title: "Hospital review", text: "With your consent, suitable hospitals review your case and suggest a plan and estimate." },
  { title: "Compare and decide", text: "We lay options out side by side. You choose the hospital and doctor." },
  { title: "Visa and travel", text: "We coordinate the invitation letter, visa documents, flights and accommodation." },
  { title: "Treatment and recovery", text: "Your coordinator helps with admission, appointments and discharge." },
  { title: "Return and follow-up", text: "We help plan your return and coordinate follow-up with your treating team." },
];
