import type { VoiceNiche } from "./types";

// Copy rules, same as the rest of the site: no invented numbers, no client
// claims, no compliance claims. Healthcare pages never promise HIPAA
// compliance; they say the setup is scoped around protected health
// information and a vendor that will sign a BAA, because that is the honest
// position until a stack is agreed with a specific practice.
export const healthcareNiches: VoiceNiche[] = [
  {
    slug: "dentists",
    plural: "Dentists",
    noun: "dental practice",
    group: "Healthcare",
    metaTitle: "AI Receptionist for Dentists | Voice Agent",
    metaDescription:
      "An AI receptionist for dental practices that answers every call, books new-patient and recall appointments, and handles emergency triage rules. Built end to end.",
    h1: "An AI receptionist for dental practices that answers while the front desk is with a patient",
    intro:
      "A dental front desk is usually checking patients in, verifying insurance, and answering the phone at the same moment. When the phone loses, a new patient who was one call away from booking a cleaning tries the next practice on the list.",
    why: "Dental calls are mostly predictable: new-patient requests, rescheduling, insurance questions, and the occasional toothache that cannot wait. That predictability is what makes them a good fit for an agent following your own rules, and the toothache call is the one worth getting right.",
    inbound: [
      "New-patient requests that end with a booked first visit",
      "Rescheduling and cancelling without tying up the front desk",
      "Questions about accepted insurance plans, hours, and location",
      "Emergency calls (broken tooth, swelling, severe pain) routed by your rules",
      "After-hours calls that would otherwise reach voicemail",
    ],
    outbound: [
      "Appointment reminders to patients who agreed to receive them",
      "Recall calls for patients overdue for a cleaning",
      "Confirming next-day schedules to cut no-shows",
    ],
    intake: [
      "Caller name and best callback number",
      "New or existing patient",
      "Reason for the visit and how urgent it is",
      "Insurance carrier, if the caller offers it",
      "Preferred days and times",
    ],
    handoff: [
      "Swelling, trauma, or severe pain goes to the on-call line right away",
      "A caller who asks for the dentist or the office manager by name",
      "Anything about billing disputes or clinical advice",
    ],
    tools:
      "Typically wired to your calendar or practice management system through its API, a webhook, or a shared booking page, depending on what your software exposes. Common systems in this space include Dentrix, Open Dental, and Eaglesoft; what can be connected directly is confirmed per system before a quote.",
    watch:
      "Dental calls involve protected health information. The setup is scoped around that, including the choice of a telephony and AI vendor that will sign a business associate agreement, and no HIPAA-compliance claim is made until that stack is agreed with you.",
    faqs: [
      {
        q: "Can an AI receptionist tell a dental emergency from a routine call?",
        a: "It follows the triage rules you write. You decide which words and situations (swelling, trauma, uncontrolled bleeding) mean the caller is transferred to an on-call number immediately, and which are booked for the next opening. It does not diagnose anything.",
      },
      {
        q: "Will it book directly into our schedule?",
        a: "Where your practice software exposes a booking API or calendar, yes. Where it does not, the agent writes the request into a shared calendar or sends your front desk a structured summary to confirm, and we tell you which of those applies before you commit.",
      },
      {
        q: "Can it call patients who are overdue for a cleaning?",
        a: "Only patients who have agreed to be contacted. Outbound AI calls to consumers fall under US consent rules, so recall campaigns are built around a consented list and an easy opt-out, not a cold list.",
      },
    ],
    related: ["medical-clinics", "med-spas", "chiropractors"],
  },
  {
    slug: "medical-clinics",
    plural: "Medical Clinics",
    noun: "clinic",
    group: "Healthcare",
    metaTitle: "AI Receptionist for Medical Clinics",
    metaDescription:
      "A voice agent for clinics and primary care offices that answers calls, books and reschedules visits, and escalates urgent symptoms by your rules.",
    h1: "A voice agent for clinics that handles the routine calls so staff can handle the patients in front of them",
    intro:
      "Clinic phone lines carry a mix that is hard to staff: refill questions, appointment changes, test-result calls, and now and then something that is actually urgent. The routine calls crowd out the one that is not.",
    why: "The value in a clinic is not replacing front desk judgment. It is taking the repetitive, rule-bound calls (hours, location, scheduling, which forms to bring) off the line so the people there can focus on patients and on the calls that need a human.",
    inbound: [
      "Booking, moving, and cancelling appointments",
      "Office hours, location, parking, and what to bring",
      "Refill and prescription requests captured and passed to staff",
      "Calls asking for a nurse or provider, routed by your rules",
      "After-hours messages sorted into urgent and not urgent",
    ],
    outbound: [
      "Appointment reminders to patients who opted in",
      "Follow-up calls that confirm a patient got an instruction or a form",
      "Rescheduling outreach after a provider is out",
    ],
    intake: [
      "Patient name and date of birth for matching, if you want it collected",
      "Callback number",
      "Reason for the call in the caller's own words",
      "New or established patient",
      "Whether the caller says it is urgent",
    ],
    handoff: [
      "Any caller describing chest pain, trouble breathing, or similar goes straight to the emergency instruction you set",
      "Requests for medical advice or test results",
      "A caller who asks for a person at any point",
    ],
    tools:
      "Wired to your scheduling system or calendar where an API is available, and to a call summary delivered to your inbox or chat. Which electronic records system you use decides how deep the connection goes, and that is confirmed before a quote.",
    watch:
      "The agent must never give medical advice. Its script is limited to scheduling, logistics, and message-taking, with a fixed instruction for emergencies. Protected health information is scoped into the vendor choice and no HIPAA-compliance claim is made until that stack is agreed.",
    faqs: [
      {
        q: "Can it give patients medical advice?",
        a: "No, and it is built not to. It handles scheduling, logistics, and taking messages, and it says plainly when something needs a nurse or provider.",
      },
      {
        q: "What does it say when someone describes an emergency?",
        a: "Whatever you set. The usual rule is a short, fixed instruction to hang up and call emergency services, plus an immediate flag to your on-call staff. That wording is yours to approve, not the agent's to improvise.",
      },
      {
        q: "Is it HIPAA compliant?",
        a: "No compliance claim is made up front. Healthcare setups are scoped around protected health information and a vendor willing to sign a business associate agreement, and what that stack looks like is agreed with you before a build starts.",
      },
    ],
    related: ["dentists", "physical-therapy", "mental-health-practices"],
  },
  {
    slug: "med-spas",
    plural: "Med Spas",
    noun: "med spa",
    group: "Healthcare",
    metaTitle: "AI Receptionist & Calling Agent for Med Spas",
    metaDescription:
      "An AI voice agent for med spas and aesthetic clinics that answers inquiries, books consultations, and follows up on leads while staff are with clients.",
    h1: "An AI receptionist for med spas that books the consultation before the lead goes cold",
    intro:
      "Med spa leads are expensive and impatient. Someone who fills out an ad form or calls about Botox is comparing three clinics at once, and the first one that answers a question and offers a time usually wins.",
    why: "Staff in a treatment room cannot also answer the phone. The calls that go unanswered are often the highest-value ones: a first-time client asking about a specific treatment and ready to book a consultation.",
    inbound: [
      "Treatment questions answered from the information you provide",
      "Consultation booking for new clients",
      "Rescheduling and cancelling existing appointments",
      "Questions about downtime, prep, and which treatment fits which concern",
      "Calls that follow an ad or a social post",
    ],
    outbound: [
      "Speed-to-lead calls to people who just submitted an inquiry form",
      "Reminder calls ahead of a booked consultation",
      "Follow-up to people who inquired but never booked, where they agreed to be contacted",
    ],
    intake: [
      "Name and callback number",
      "Which treatment or concern they are asking about",
      "First visit or returning client",
      "Preferred days and times",
      "How they heard about the clinic, for your reporting",
    ],
    handoff: [
      "Medical questions about a specific condition or medication",
      "A client reporting a reaction or complication after a treatment",
      "Pricing negotiations or package exceptions",
    ],
    tools:
      "Typically wired to your booking system or calendar and to a CRM or spreadsheet so each inquiry becomes a tracked lead. Which booking platform you use decides whether the agent books directly or hands your team a ready summary.",
    watch:
      "The agent must not recommend a treatment as medical advice or promise results. It answers from the material you approve and sends anything clinical to a licensed provider. Speed-to-lead calls only go to people who submitted their number to you.",
    faqs: [
      {
        q: "Can it call a lead right after they submit a form?",
        a: "Yes, for people who gave you their number and agreed to be contacted. A call within minutes of the inquiry is the main reason med spas ask for this, and it is built around a consented lead source.",
      },
      {
        q: "Will it quote prices?",
        a: "Only the prices you give it. If you prefer to discuss pricing in a consultation, it says so and books the consultation instead.",
      },
      {
        q: "What if a client calls about a bad reaction?",
        a: "It transfers immediately to the number you set and flags the call as urgent. It does not troubleshoot or reassure.",
      },
    ],
    related: ["dentists", "chiropractors", "salons"],
  },
  {
    slug: "chiropractors",
    plural: "Chiropractors",
    noun: "chiropractic office",
    group: "Healthcare",
    metaTitle: "AI Receptionist for Chiropractors",
    metaDescription:
      "A voice agent for chiropractic offices that books new patients, handles reschedules, and answers common questions so the adjusting table stays the priority.",
    h1: "An AI receptionist for chiropractic offices that fills the schedule without pulling you off the table",
    intro:
      "A chiropractor with a small team is adjusting a patient when the phone rings. A person with back pain who gets voicemail rarely leaves a message; they call the next office on the list.",
    why: "Chiropractic offices run on appointment volume and repeat visits. Calls are short and repetitive: book, move, and confirm. That is the part an agent does well and the part that burns front desk time.",
    inbound: [
      "New-patient bookings with the right first-visit length",
      "Reschedules and same-day changes",
      "Questions about accepted insurance, cash rates, and what a first visit involves",
      "Auto-accident and injury inquiries, captured with the right details",
      "After-hours calls that would have gone to voicemail",
    ],
    outbound: [
      "Reminder calls to reduce missed visits",
      "Re-engagement calls to patients who stopped coming, where they agreed to be contacted",
      "Confirming a care-plan schedule",
    ],
    intake: [
      "Name and callback number",
      "Reason for the visit and where it hurts",
      "Whether it followed an accident",
      "New or returning patient",
      "Insurance or self-pay",
    ],
    handoff: [
      "Anyone describing numbness, loss of movement, or severe injury goes to your urgent instruction",
      "Questions about a specific treatment plan",
      "Billing and claim disputes",
    ],
    tools:
      "Wired to your scheduling software or a shared calendar and to a summary sent to the front desk. Direct booking depends on whether your practice software offers an API.",
    watch:
      "The agent takes details and books time. It does not assess an injury or advise on treatment. Patient information is handled under the same protected-health-information scoping as any healthcare build.",
    faqs: [
      {
        q: "Can it handle auto-accident cases differently?",
        a: "Yes. You can set a separate path that collects the accident date, whether an attorney is involved, and insurance details, then books the right appointment type.",
      },
      {
        q: "Will it tell a patient what treatment they need?",
        a: "No. It books the visit and leaves the assessment to the chiropractor.",
      },
      {
        q: "Does it work for a one-doctor office?",
        a: "That is a common fit, since a solo practitioner has no front desk to cover the phone while they are with a patient.",
      },
    ],
    related: ["physical-therapy", "dentists", "medical-clinics"],
  },
  {
    slug: "physical-therapy",
    plural: "Physical Therapy Clinics",
    noun: "physical therapy clinic",
    group: "Healthcare",
    metaTitle: "AI Receptionist for Physical Therapy Clinics",
    metaDescription:
      "A voice agent for physical therapy clinics that books evaluations, handles referrals and reschedules, and chases cancelled visits. Built to your intake rules.",
    h1: "An AI receptionist for physical therapy clinics that keeps evaluations booked and plans of care on schedule",
    intro:
      "A physical therapy clinic earns across a full plan of care, not one visit. A missed first call costs the evaluation and the six to twelve visits that would have followed it.",
    why: "Phone traffic in this niche splits between new referrals and the steady churn of existing patients moving appointments. Both are rule-bound, and both pile up when therapists are hands-on with patients.",
    inbound: [
      "New-patient evaluation booking, with or without a physician referral",
      "Rescheduling inside an existing plan of care",
      "Questions about direct access, insurance, and visit length",
      "Referring offices calling to send a patient over",
      "Cancellations and late-arrival messages",
    ],
    outbound: [
      "Reminder calls ahead of each visit for patients who opted in",
      "Following up on a missed visit to rebook it",
      "Checking in with a referred patient who never scheduled",
    ],
    intake: [
      "Name and callback number",
      "Body area and a one-line reason",
      "Referral or self-referral",
      "Insurance carrier",
      "Preferred days and times",
    ],
    handoff: [
      "Referring physician offices that need to speak to staff",
      "Post-surgical or acute-injury callers per your rules",
      "Authorization and billing questions",
    ],
    tools:
      "Typically wired to your scheduling system or a shared calendar and to a summary for the front desk. Whether the agent books directly depends on what your software exposes.",
    watch:
      "Cancellation and no-show calls are where an agent earns its place, but outbound follow-up only goes to patients who agreed to be contacted. Clinical questions always go to a therapist.",
    faqs: [
      {
        q: "Can it take calls from referring doctors' offices?",
        a: "It can collect the patient's details and the referral information and flag it for staff, or transfer straight to someone if you prefer a person to speak to the referring office.",
      },
      {
        q: "Will it help reduce no-shows?",
        a: "Reminder and rebooking calls are the usual way. How much they help in your clinic depends on your patients, so no figure is promised.",
      },
      {
        q: "Does it understand insurance?",
        a: "It collects the carrier and plan details and passes them on. Verifying benefits stays with your team unless your software allows an automated check.",
      },
    ],
    related: ["chiropractors", "medical-clinics", "dentists"],
  },
  {
    slug: "veterinarians",
    plural: "Veterinary Clinics",
    noun: "veterinary clinic",
    group: "Healthcare",
    metaTitle: "AI Receptionist for Veterinary Clinics",
    metaDescription:
      "A voice agent for vet clinics that answers appointment and prescription calls, routes emergencies to your on-call rule, and handles after-hours callers.",
    h1: "An AI receptionist for veterinary clinics that sorts the emergency from the vaccine reminder",
    intro:
      "Vet clinics get a heavy phone load from worried owners, and the stakes of a missed call are different: the person on the line may have a sick animal and a short window to decide where to go.",
    why: "Calls come in bursts, often around opening time and after hours. Most are routine (vaccines, refills, boarding questions), but a small share is an emergency where the clinic's response in the first minute matters.",
    inbound: [
      "Appointment booking for exams, vaccines, and dental cleanings",
      "Prescription and food refill requests captured for staff",
      "Hours, boarding, and new-client questions",
      "After-hours calls with a clear emergency instruction",
      "Calls from owners asking whether a symptom needs a visit today",
    ],
    outbound: [
      "Vaccine and wellness reminder calls to clients who opted in",
      "Post-visit check-ins where the client agreed to them",
      "Rescheduling outreach after a schedule change",
    ],
    intake: [
      "Owner name and callback number",
      "Pet name, species, and age",
      "Reason for the call",
      "New or existing client",
      "Whether the owner says it is an emergency",
    ],
    handoff: [
      "Poisoning, trauma, trouble breathing, or seizures go to your emergency instruction immediately",
      "Euthanasia and end-of-life calls go to a person, not an agent",
      "Anything involving a controlled medication",
    ],
    tools:
      "Wired to your calendar or practice software where an API exists, with a call summary and recording sent to the front desk. Which practice management system you use decides how direct the booking can be.",
    watch:
      "Sensitive calls, especially end-of-life ones, should reach a human with no AI in the middle. The agent is configured to recognize and transfer them, not to handle them.",
    faqs: [
      {
        q: "What happens when an owner calls with an emergency?",
        a: "The agent gives the instruction you wrote (for example, the nearest emergency hospital's number) and transfers or alerts your on-call staff. It does not diagnose.",
      },
      {
        q: "Can it handle after-hours calls?",
        a: "Yes, that is one of the main uses. It can book the next available visit, take a message for the morning, or route emergencies according to your rule.",
      },
      {
        q: "Will it sound cold with an upset owner?",
        a: "The tone is part of the script and is tuned before launch. For the most sensitive calls the better answer is not to use the agent at all, which is why those go to a person.",
      },
    ],
    related: ["dentists", "medical-clinics", "salons"],
  },
  {
    slug: "mental-health-practices",
    plural: "Therapy & Mental Health Practices",
    noun: "therapy practice",
    group: "Healthcare",
    metaTitle: "AI Receptionist for Therapy Practices",
    metaDescription:
      "A careful voice agent for therapy and counseling practices that handles scheduling and intake logistics, and routes any crisis call to a human by rule.",
    h1: "An AI receptionist for therapy practices that handles scheduling and leaves the care to clinicians",
    intro:
      "Many therapists run a practice alone or with a small team and let calls go to voicemail during sessions. A person reaching out for help for the first time may not call back if the first attempt goes unanswered.",
    why: "The calls are mostly logistics: is anyone taking new clients, what does a session cost, can I book Thursday. The agent is useful for those. It is deliberately kept out of anything clinical or emotional.",
    inbound: [
      "New-client inquiries with the practice's availability and fees",
      "Booking, moving, and cancelling sessions",
      "Whether the practice accepts a given insurance",
      "Telehealth versus in-person questions",
      "A message left for the clinician, categorized by urgency",
    ],
    outbound: [
      "Session reminders for clients who opted in",
      "Rescheduling calls after a clinician is unavailable",
      "A short follow-up to someone who inquired and agreed to be contacted",
    ],
    intake: [
      "Name and a safe callback number or text preference",
      "Whether the person is looking for individual, couples, or family sessions",
      "Preferred days and times",
      "Insurance or self-pay",
      "Whether they have seen a therapist before, if they choose to say",
    ],
    handoff: [
      "Any mention of self-harm, suicide, or danger goes to a crisis instruction and a live alert",
      "A current client calling in distress",
      "Any request to talk to the clinician",
    ],
    tools:
      "Typically wired to a calendar or practice-management system and to a private message to the clinician. The set of systems is decided with you, and client information is handled under protected-health-information scoping.",
    watch:
      "This is the niche to be most conservative in. The agent never offers support, counsel, or reassurance. A crisis call gets a fixed, clinician-approved instruction and an immediate alert, and some practices reasonably decide a human should answer every call. That is a valid outcome of the conversation.",
    faqs: [
      {
        q: "Is an AI receptionist appropriate for a therapy practice?",
        a: "For scheduling and logistics, often yes. For anything emotional it is not, which is why the script is limited and crisis wording is approved by you. Some clinicians decide against it, and that is a fair call.",
      },
      {
        q: "What if someone in crisis calls the line?",
        a: "The agent gives the fixed crisis instruction you approved (such as 988 in the US) and alerts you right away. It does not try to talk the person through it.",
      },
      {
        q: "Can it keep client details private?",
        a: "Privacy is part of vendor selection and setup, and no compliance claim is made until the stack is agreed with you. Collecting less is also an option: some practices ask the agent for a name and number only.",
      },
    ],
    related: ["medical-clinics", "physical-therapy", "chiropractors"],
  },
  {
    slug: "home-care-agencies",
    plural: "Home Care Agencies",
    noun: "home care agency",
    group: "Healthcare",
    metaTitle: "AI Receptionist for Home Care Agencies",
    metaDescription:
      "A voice agent for home care and senior care agencies that answers family inquiries, takes caregiver call-outs, and routes urgent calls around the clock.",
    h1: "An AI receptionist for home care agencies that answers the family call and the caregiver call-out at 6 a.m.",
    intro:
      "A home care agency has two phone lines in one: families asking about care for a parent, and caregivers calling in sick or running late. Both come at odd hours, and both are time-sensitive.",
    why: "A family that finds an agency and reaches voicemail often keeps calling down the list, and a caregiver call-out that goes unanswered at dawn leaves a client without care. The phone has to work when the office is closed.",
    inbound: [
      "New-client inquiries from adult children and family members",
      "Caregiver call-outs, late notices, and shift-swap requests",
      "Questions about services, hours of care, and areas covered",
      "Existing-client families asking about a visit",
      "After-hours calls routed by your on-call rule",
    ],
    outbound: [
      "Confirming a visit time with a client or family who agreed to calls",
      "Calling caregivers on a coverage list when a shift opens",
      "Following up on an inquiry that never became a consultation, where consent was given",
    ],
    intake: [
      "Caller name, relationship to the person needing care, and callback number",
      "Location and the kind of help needed",
      "How soon care should start",
      "Whether the person is coming home from a hospital stay",
      "Who is paying (private pay, insurance, or long-term care policy), if offered",
    ],
    handoff: [
      "A caregiver reporting a client fall, injury, or an emergency during a shift",
      "A family member upset about a missed visit",
      "Any request for the care coordinator or director",
    ],
    tools:
      "Wired to your scheduling or caregiver-coordination software through its API where one exists, and to a call summary and alert sent to your coordinator by text or email.",
    watch:
      "Caregiver coverage calls are time-critical, so the agent needs a firm escalation path and a human reachable at all times. It reads back anything it records about a call-out so there is no silent misunderstanding.",
    faqs: [
      {
        q: "Can it handle caregiver call-outs?",
        a: "Yes. It records who is calling, which shift, and the reason, then alerts the coordinator immediately so coverage can be arranged. Making the staffing decision stays with a person.",
      },
      {
        q: "Will it talk to elderly clients directly?",
        a: "It can, if you want it to, but pace and clarity are tuned for that listener and many agencies keep it to family and caregiver calls. That is decided at design time.",
      },
      {
        q: "What does it do if a caregiver reports an emergency?",
        a: "It follows the rule you set: tell the caregiver to call emergency services if needed and notify your on-call person right away, in the same moment.",
      },
    ],
    related: ["medical-clinics", "physical-therapy", "mental-health-practices"],
  },
];
