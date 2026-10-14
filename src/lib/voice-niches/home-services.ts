import type { VoiceNiche } from "./types";

// Home-service buyers call, then call the next company if nobody answers.
// Every page here is about the missed-call and speed-to-lead problem as it
// shows up in that specific trade, not a swapped trade name.
export const homeServiceNiches: VoiceNiche[] = [
  {
    slug: "plumbers",
    plural: "Plumbers",
    noun: "plumbing company",
    group: "Home services",
    metaTitle: "AI Receptionist for Plumbers | Calling Agent",
    metaDescription:
      "An AI voice agent for plumbing companies that answers every call, tells emergencies from quotes, books jobs, and dispatches after hours. Built to your rules.",
    h1: "An AI receptionist for plumbers that picks up when you are under a sink",
    intro:
      "A plumber is under a sink or on a roof when the phone rings. A homeowner with water coming through the ceiling does not leave a voicemail and wait; they call the next plumber until one picks up.",
    why: "Plumbing has the sharpest urgency split of any trade: a burst pipe at midnight and a leaky faucet next month are both calls, but only one is worth waking someone for. An agent that sorts them by your rules is the difference between a booked emergency job and a missed one.",
    inbound: [
      "Emergency calls (burst pipe, sewage backup, no water) flagged and dispatched",
      "Quote and estimate requests for non-urgent work",
      "Booking a visit window and confirming the address",
      "Water heater, drain, and fixture questions answered from your own notes",
      "Calls from existing customers about a job in progress",
    ],
    outbound: [
      "Calling a new web or ad lead back within minutes, where they gave you their number",
      "Appointment-window confirmation calls the day before",
      "Reminder calls for seasonal checks, to customers who opted in",
    ],
    intake: [
      "Name, callback number, and service address",
      "What is happening and whether water is still flowing",
      "Homeowner or tenant",
      "Preferred window for a visit",
      "Photos by text, if you want them requested",
    ],
    handoff: [
      "Active flooding or a gas smell goes to your on-call tech and the agent tells the caller to shut off the water or call the gas company",
      "Commercial or property-manager accounts you want handled personally",
      "A customer disputing a charge",
    ],
    tools:
      "Typically wired to field-service software such as ServiceTitan, Jobber, or Housecall Pro where its API allows, or to a shared calendar and a text alert to the on-call tech when it does not.",
    watch:
      "Dispatch is the risky part. The agent should never promise an arrival time you cannot keep, so promises are limited to the windows your own schedule shows. Pricing is quoted only from numbers you provide.",
    faqs: [
      {
        q: "Can it tell an emergency from a normal call?",
        a: "Yes, by your rules. You decide what counts (active leak, sewage backup, no water) and what happens when it does, usually an immediate text or call to the on-call tech.",
      },
      {
        q: "Will it quote prices?",
        a: "Only prices you give it, such as a diagnostic fee or a service-call minimum. For anything that needs a look first, it books the visit.",
      },
      {
        q: "Can it dispatch a tech?",
        a: "It can alert the on-call person and, where your field-service software has an API, create the job. The dispatch decision stays with you.",
      },
    ],
    related: ["hvac", "electricians", "roofers"],
  },
  {
    slug: "hvac",
    plural: "HVAC Companies",
    noun: "HVAC company",
    group: "Home services",
    metaTitle: "AI Receptionist for HVAC Companies",
    metaDescription:
      "A voice agent for HVAC companies that answers heating and cooling calls during peak season, books service, and qualifies install leads. Built to your rules.",
    h1: "An AI receptionist for HVAC companies that does not drown in the first heat wave",
    intro:
      "HVAC phones fall over twice a year: the first cold snap and the first heat wave. In both, every call is urgent to the caller, and the office is already behind.",
    why: "Demand is seasonal and spiky, which makes hiring more office staff a poor fit. An agent scales to a surge of calls without a queue, so the repair calls and the high-value replacement calls both get answered.",
    inbound: [
      "No-heat and no-cooling calls triaged by urgency and weather",
      "Repair visit booking with the address and system type",
      "Replacement and new-install quote requests, captured separately from repairs",
      "Maintenance-plan questions and renewals",
      "After-hours calls in extreme weather",
    ],
    outbound: [
      "Speed-to-lead calls on new install inquiries, where the person gave you their number",
      "Seasonal tune-up reminders to customers who agreed to be contacted",
      "Confirming a service window the day before",
    ],
    intake: [
      "Name, callback number, and service address",
      "Heating, cooling, or both, and the symptom",
      "System age and brand, if the caller knows",
      "Whether anyone vulnerable is at home (infant, elderly), if you want it asked",
      "Repair or replacement interest",
    ],
    handoff: [
      "Gas smell, carbon monoxide alarm, or burning smell gets an immediate safety instruction and your on-call alert",
      "Large commercial or multi-unit requests",
      "Warranty and billing disputes",
    ],
    tools:
      "Typically connected to ServiceTitan, Jobber, Housecall Pro, or a shared calendar where an API or webhook allows, plus a lead summary to your sales team for install inquiries.",
    watch:
      "Safety calls (gas, carbon monoxide) need a fixed instruction written by you or your safety lead. The agent reads it exactly and alerts a person, and never tries to troubleshoot a hazard.",
    faqs: [
      {
        q: "Can it separate repair calls from replacement leads?",
        a: "Yes. Replacement and new-install calls are worth more, so they can go to a separate path with a faster human follow-up while repairs book straight onto the schedule.",
      },
      {
        q: "What about peak-season volume?",
        a: "An agent can take many calls at once, so the waiting-on-hold problem in a heat wave goes away. How many jobs you can actually run still depends on your technicians.",
      },
      {
        q: "Can it handle a carbon monoxide call?",
        a: "It reads your fixed safety instruction (leave the home, call emergency services) and alerts your on-call person. It does not diagnose.",
      },
    ],
    related: ["plumbers", "electricians", "roofers"],
  },
  {
    slug: "electricians",
    plural: "Electricians",
    noun: "electrical contractor",
    group: "Home services",
    metaTitle: "AI Receptionist for Electricians",
    metaDescription:
      "An AI receptionist for electrical contractors that answers calls on the job, flags safety emergencies, and books estimates and service visits.",
    h1: "An AI receptionist for electricians that answers while your hands are in a panel",
    intro:
      "Electricians cannot take a call from inside a panel, and a homeowner who reaches voicemail about a dead outlet moves on to the next listing.",
    why: "Electrical work mixes small service calls with large jobs such as panel upgrades, EV chargers, and rewires. The agent's job is to tell them apart on the first call so the larger job reaches an estimator quickly.",
    inbound: [
      "Service calls (outage, tripped breaker, dead outlet) booked by urgency",
      "Estimate requests for panel upgrades, EV charger installs, and remodels",
      "Safety calls (sparks, burning smell) flagged and escalated",
      "Questions about permits, licensing, and service area",
      "Calls from builders and property managers",
    ],
    outbound: [
      "Calling back estimate leads quickly, where the person gave you their number",
      "Confirming service windows",
      "Following up on sent quotes with people who agreed to be contacted",
    ],
    intake: [
      "Name, callback number, and address",
      "The problem or project in a sentence",
      "Residential or commercial",
      "How urgent it is",
      "Whether there is any sign of fire or burning",
    ],
    handoff: [
      "Any sign of fire or burning goes to an emergency-services instruction and your on-call line",
      "Large commercial bids",
      "Disputes over a previous job",
    ],
    tools:
      "Typically wired to Jobber, Housecall Pro, ServiceTitan, or a shared calendar, with lead details delivered to your estimator by text or email.",
    watch:
      "The agent never gives electrical advice or tells a caller a hazard is safe. Anything about burning, sparks, or shock gets the fixed safety instruction and a live alert.",
    faqs: [
      {
        q: "Will it give homeowners DIY electrical advice?",
        a: "No. It books the visit and, where there is any sign of danger, reads your fixed safety instruction.",
      },
      {
        q: "Can it separate estimates from service calls?",
        a: "Yes, so the panel-upgrade lead reaches your estimator quickly instead of sitting in the same queue as a dead outlet.",
      },
      {
        q: "Does it work for a one-van shop?",
        a: "A solo or small operator is a common fit, since no one is available to cover the phone while on a job.",
      },
    ],
    related: ["plumbers", "hvac", "solar-installers"],
  },
  {
    slug: "roofers",
    plural: "Roofing Contractors",
    noun: "roofing company",
    group: "Home services",
    metaTitle: "AI Receptionist & Calling Agent for Roofers",
    metaDescription:
      "An AI voice agent for roofing contractors that answers storm-season calls, qualifies inspection and replacement leads, and books estimates.",
    h1: "An AI receptionist for roofers that survives the week after a storm",
    intro:
      "After a hailstorm every roofer in the area gets flooded with calls on the same two days. The company that answers the phone first, and books the inspection, gets the job.",
    why: "Roofing leads are high-ticket and often come with an insurance claim attached. The first company to talk to a homeowner usually shapes the whole process, and storm-driven volume is exactly when a small office cannot answer everyone.",
    inbound: [
      "Inspection requests after hail or wind damage",
      "Leak calls triaged by urgency, including tarp requests",
      "Replacement and repair estimate requests",
      "Insurance-claim questions answered from your own process notes",
      "Calls from adjusters and property managers",
    ],
    outbound: [
      "Speed-to-lead calls on web and ad leads, where the person gave you their number",
      "Scheduling the inspection and confirming it the day before",
      "Following up on delivered estimates with people who agreed to be contacted",
    ],
    intake: [
      "Name, callback number, and property address",
      "What happened and when (storm date, leak location)",
      "Whether an insurance claim is open",
      "Roof age, if known",
      "Preferred inspection window",
    ],
    handoff: [
      "An active leak with water inside the home goes to your emergency crew line",
      "Insurance adjusters, who usually need a person",
      "Disputes over a past job",
    ],
    tools:
      "Typically wired to a CRM or job-management tool such as JobNimbus, AccuLynx, or a spreadsheet, and to a shared calendar for inspections.",
    watch:
      "The agent must not make claims about what insurance will cover or promise outcomes on a claim. Door-to-door-style pressure is a bad fit for this tool, so its script is informational and booking-focused. Outbound calls only go to people who gave you their number.",
    faqs: [
      {
        q: "Can it handle a flood of calls after a storm?",
        a: "Yes, since it can take many calls at once. What it cannot do is add crews, so it books inspections in the windows your schedule shows.",
      },
      {
        q: "Will it talk about insurance?",
        a: "It explains your process and collects claim details. It does not promise what an insurer will pay.",
      },
      {
        q: "Can it call back leads from my ads?",
        a: "Yes, for people who submitted their number to you. Speed to the first call is the point of that setup.",
      },
    ],
    related: ["solar-installers", "hvac", "landscaping"],
  },
  {
    slug: "pest-control",
    plural: "Pest Control Companies",
    noun: "pest control company",
    group: "Home services",
    metaTitle: "AI Receptionist for Pest Control Companies",
    metaDescription:
      "A voice agent for pest control companies that answers infestation calls, identifies the pest, books treatments, and manages recurring-service renewals.",
    h1: "An AI receptionist for pest control that books the treatment while the caller is still looking at the problem",
    intro:
      "A person finding wasps or termites usually wants someone out the same day and calls several companies at once. The one that answers and gives a time tends to win a recurring customer.",
    why: "Pest control is a subscription business wrapped in emergency calls. The first call is urgent, but the lasting value is the quarterly plan, so the agent needs to book the visit and also set up the right follow-on.",
    inbound: [
      "Infestation calls identified by pest and severity",
      "Same-day and next-day service booking",
      "Recurring-plan questions and signups",
      "Questions about pet and child safety from your own approved answers",
      "Existing-customer reschedules and re-service requests",
    ],
    outbound: [
      "Confirming a treatment window and prep instructions",
      "Renewal and seasonal-service reminders to customers who agreed to be contacted",
      "Following up on estimate requests, where the person gave you their number",
    ],
    intake: [
      "Name, callback number, and address",
      "The pest and where it was seen",
      "House, apartment, or business",
      "First treatment or existing customer",
      "Pets or children at home, if you want it asked",
    ],
    handoff: [
      "Stinging-insect nests near entrances or someone with an allergy",
      "Commercial accounts such as restaurants or property managers",
      "Billing or warranty disputes",
    ],
    tools:
      "Typically wired to PestPac, FieldRoutes, Jobber, or a shared calendar where those allow, with a summary to the dispatcher.",
    watch:
      "Safety answers about chemicals, pets, and children come only from text you approve, never from the agent's own guesses.",
    faqs: [
      {
        q: "Can it identify the pest from a description?",
        a: "It asks the questions you give it and classifies the pest for routing. It is not a guarantee of identification, so the technician confirms on site.",
      },
      {
        q: "Will it sell recurring plans?",
        a: "It can explain your plans and book the first visit under one, using your wording. It does not pressure the caller.",
      },
      {
        q: "What about pet safety questions?",
        a: "It answers only from the safety text you approved, and passes anything unusual to a technician.",
      },
    ],
    related: ["cleaning-services", "landscaping", "plumbers"],
  },
  {
    slug: "cleaning-services",
    plural: "Cleaning Companies",
    noun: "cleaning company",
    group: "Home services",
    metaTitle: "AI Receptionist for Cleaning Companies",
    metaDescription:
      "A voice agent for residential and commercial cleaning companies that quotes from your price list, books recurring cleans, and handles reschedules.",
    h1: "An AI receptionist for cleaning companies that turns quote calls into booked recurring clients",
    intro:
      "Cleaning companies live on recurring customers, but the first call is a quote request, and the person calling is usually comparing a few companies at once.",
    why: "Quoting is the bottleneck. Most callers ask the same things: how much for a three-bedroom, do you bring supplies, can you start this week. An agent can answer from your own price list and book the first clean without a callback.",
    inbound: [
      "Quote requests answered from your own price rules by size and type",
      "Booking one-time and recurring cleans",
      "Move-in, move-out, and deep-clean requests",
      "Reschedules and skip requests",
      "Commercial-cleaning inquiries routed to a person",
    ],
    outbound: [
      "Calling back web quote requests, where the person gave you their number",
      "Day-before confirmations to cut missed visits",
      "Re-engaging past one-time customers who agreed to be contacted",
    ],
    intake: [
      "Name, callback number, and address",
      "Size of the home or space and number of bathrooms",
      "One-time or recurring, and how often",
      "Pets and access instructions",
      "Preferred start date",
    ],
    handoff: [
      "Commercial and office-cleaning contracts",
      "Complaints about a past clean",
      "Special requests outside your price list",
    ],
    tools:
      "Typically connected to Jobber, Housecall Pro, Booking Koala, or a shared calendar where those allow, with a summary to the scheduler.",
    watch:
      "Quotes must come from your published rules only. If the agent cannot price a job from them, it books a walkthrough or hands off, rather than guessing a number.",
    faqs: [
      {
        q: "Can it give an instant quote?",
        a: "Yes, if your pricing follows rules such as size, bedrooms, and type of clean. If a job falls outside those rules, it says so and books a walkthrough.",
      },
      {
        q: "Can it book recurring cleans?",
        a: "Yes, writing the schedule into your calendar or field-service tool, where one is connected.",
      },
      {
        q: "Does it handle complaints?",
        a: "It records them and passes them to a person right away. It does not try to resolve a complaint.",
      },
    ],
    related: ["pest-control", "landscaping", "movers"],
  },
  {
    slug: "landscaping",
    plural: "Landscaping & Lawn Care Companies",
    noun: "landscaping company",
    group: "Home services",
    metaTitle: "AI Receptionist for Landscaping Companies",
    metaDescription:
      "A voice agent for lawn care and landscaping companies that answers spring-rush calls, books estimates, and sets up recurring service.",
    h1: "An AI receptionist for landscaping companies that handles the spring rush without a second office hire",
    intro:
      "Landscapers are outside all day, and in spring the calls arrive faster than anyone can return them. A homeowner who wants a quote this week will not wait for a Monday callback.",
    why: "Lawn care is recurring revenue, so each lead is worth a season of visits. The agent's job is to get the property address, service type, and a time for an estimate on the first call.",
    inbound: [
      "Weekly mowing and recurring lawn-care signups",
      "Estimate requests for design, hardscape, and cleanup jobs",
      "Questions about service area and seasons",
      "Reschedules after rain",
      "Existing-customer questions about the next visit",
    ],
    outbound: [
      "Speed-to-lead calls to web inquiries, where the person gave you their number",
      "Rain-delay notices to customers who agreed to calls",
      "Seasonal service reminders to past customers who opted in",
    ],
    intake: [
      "Name, callback number, and property address",
      "Service wanted (mowing, cleanup, install, design)",
      "Approximate lot size",
      "Recurring or one-time",
      "Preferred estimate window",
    ],
    handoff: [
      "Commercial properties and HOA contracts",
      "Large design or hardscape projects that need a site visit and a person",
      "Complaints about a missed or poor visit",
    ],
    tools:
      "Typically connected to Jobber, LMN, Service Autopilot, or a calendar where those allow, with the estimate request sent to your estimator.",
    watch:
      "Weather changes the schedule, so promises are kept to windows, not exact times, and rain-delay calls only go to customers who agreed to them.",
    faqs: [
      {
        q: "Can it quote a mowing price?",
        a: "If you price by lot size or tier, yes. Otherwise it books an estimate visit.",
      },
      {
        q: "Will it handle rain delays?",
        a: "It can call or text consented customers with a new window you approve, and take rescheduling requests from callers.",
      },
      {
        q: "Does it work for a small crew?",
        a: "It is a common fit for owner-operators who are on a mower when the phone rings.",
      },
    ],
    related: ["cleaning-services", "roofers", "pest-control"],
  },
  {
    slug: "solar-installers",
    plural: "Solar Installers",
    noun: "solar installer",
    group: "Home services",
    metaTitle: "AI Calling Agent for Solar Installers",
    metaDescription:
      "An AI voice agent for solar installers that qualifies inbound and consented leads by ownership, roof, and bill, and books site assessments.",
    h1: "An AI calling agent for solar installers that qualifies the lead before a closer spends time on it",
    intro:
      "Solar leads are costly and most of them do not qualify. Renters, shaded roofs, and low electric bills all end the conversation, and sales time gets wasted finding that out.",
    why: "The economics reward fast, accurate qualification. A calling agent that asks the same screening questions on every lead, immediately, hands the closers only people who can actually buy.",
    inbound: [
      "Quote and information requests from ads and referrals",
      "Qualifying by ownership, roof, and monthly electric bill",
      "Booking a site assessment or a consultation call",
      "Questions about the process, timelines, and incentives from your approved text",
      "Existing-customer questions about an install in progress",
    ],
    outbound: [
      "Calling leads who submitted a form and gave consent to be contacted",
      "Confirming a booked assessment",
      "Following up on proposals sent, to people who agreed to contact",
    ],
    intake: [
      "Name, callback number, and address",
      "Whether they own the home",
      "Roof type and rough age",
      "Average monthly electric bill",
      "Utility provider, if known",
    ],
    handoff: [
      "Qualified leads that want to talk to a person now",
      "Questions about financing terms or contracts",
      "Anyone upset about a past install",
    ],
    tools:
      "Typically connected to a CRM such as HubSpot, Salesforce, or a spreadsheet, plus a calendar for assessments.",
    watch:
      "Outbound solar calling is a regulated area in the US. Calls to consumers need prior consent for AI voices and the do-not-call rules apply. We build around consented leads and an easy opt-out, and the agent must not overstate savings or incentives.",
    faqs: [
      {
        q: "Can an AI agent cold-call solar leads?",
        a: "Not responsibly. US rules treat AI voices as artificial for consent purposes, so outbound calls should go only to people who gave you their number and agreed to be contacted. The agent is built for that, not for cold lists.",
      },
      {
        q: "Will it quote savings?",
        a: "Only figures you supply, and it avoids promising a specific saving. Detailed proposals come from your team.",
      },
      {
        q: "What does it hand to the closer?",
        a: "A written summary: ownership, roof, bill, utility, and the time booked, so the closer starts informed.",
      },
    ],
    related: ["roofers", "electricians", "hvac"],
  },
  {
    slug: "movers",
    plural: "Moving Companies",
    noun: "moving company",
    group: "Home services",
    metaTitle: "AI Receptionist for Moving Companies",
    metaDescription:
      "A voice agent for moving companies that collects move details, gives estimate ranges from your rules, and books in-home surveys and move dates.",
    h1: "An AI receptionist for moving companies that captures the whole move on the first call",
    intro:
      "A person planning a move calls several movers and compares the first responses. The mover that collects the details and offers a survey time on that first call is the one that gets the booking.",
    why: "Move calls are information-heavy: origin, destination, size, stairs, date. An agent never forgets a question and writes the details in a form your estimator can use right away.",
    inbound: [
      "Move-quote requests for local and long-distance moves",
      "Collecting origin, destination, size, access, and date",
      "Booking in-home or video surveys",
      "Packing and storage add-on questions",
      "Existing-customer questions about their move date",
    ],
    outbound: [
      "Calling back quote requests, where the person gave you their number",
      "Confirming move dates and crew arrival windows",
      "Following up on a sent estimate with people who agreed to contact",
    ],
    intake: [
      "Name and callback number",
      "Pickup and delivery addresses",
      "Size of the home or number of rooms",
      "Stairs, elevators, and long carries",
      "Target move date and flexibility",
    ],
    handoff: [
      "Commercial and corporate relocations",
      "Claims for damage on a past move",
      "Anything involving special items such as pianos or safes, per your rules",
    ],
    tools:
      "Typically connected to a moving CRM such as SmartMoving, or a spreadsheet and shared calendar, with the move details sent to your estimator.",
    watch:
      "Estimate ranges come only from your own rules. The agent never promises a binding price, and any mention of a damage claim goes straight to a person.",
    faqs: [
      {
        q: "Can it give a price on the phone?",
        a: "It can give a range if you provide rules for one. A binding quote usually needs a survey, so it books one.",
      },
      {
        q: "Does it handle peak summer volume?",
        a: "It can take many calls at once. Crew capacity is still yours to manage, so it books only the dates your schedule shows open.",
      },
      {
        q: "Will it deal with damage claims?",
        a: "No. It records the details and passes the caller to a person immediately.",
      },
    ],
    related: ["cleaning-services", "property-management", "landscaping"],
  },
  {
    slug: "auto-repair",
    plural: "Auto Repair Shops",
    noun: "auto repair shop",
    group: "Home services",
    metaTitle: "AI Receptionist for Auto Repair Shops",
    metaDescription:
      "A voice agent for auto repair shops that answers service calls, books drop-offs, and handles status questions so service writers stay on the floor.",
    h1: "An AI receptionist for auto repair shops that handles the status calls so the service writer can handle the customers",
    intro:
      "A shop phone rings all day with the same questions: is my car done, how much for a brake job, can you fit me in today. Each call interrupts a service writer who is already with a customer.",
    why: "Status and booking calls make up much of a shop's phone traffic, and they are the ones an agent can take cleanly. The calls it should not take, such as diagnostics and approval of extra work, go straight to a person.",
    inbound: [
      "Booking drop-off appointments for service and repairs",
      "Where is my vehicle: status calls answered from your shop system",
      "Price questions answered from your published rates",
      "Tire, oil change, and inspection scheduling",
      "After-hours calls, including towing questions",
    ],
    outbound: [
      "Service-complete and pickup-ready calls",
      "Reminder calls for maintenance due, to customers who agreed to them",
      "Following up on declined work for customers who agreed to contact",
    ],
    intake: [
      "Name and callback number",
      "Vehicle year, make, and model",
      "Symptom or service wanted",
      "Whether the car is drivable",
      "Preferred drop-off day and time",
    ],
    handoff: [
      "Diagnosis questions and approval of additional repairs",
      "Warranty and comeback complaints",
      "Fleet and commercial accounts",
    ],
    tools:
      "Typically connected to a shop-management system such as Tekmetric, Shop-Ware, or a calendar where those allow, so status calls can be answered from live data.",
    watch:
      "The agent never approves extra work or states a diagnosis. Price answers come from your published labor and service rates only.",
    faqs: [
      {
        q: "Can it tell a customer if their car is ready?",
        a: "If your shop software exposes job status, yes. Otherwise it takes a message and flags the call for the service writer.",
      },
      {
        q: "Will it quote repairs?",
        a: "Only standard services you have priced, like an oil change. Anything that needs diagnosis is booked, not quoted.",
      },
      {
        q: "What about towing calls?",
        a: "It follows your rule: give a towing partner's number, or flag the call to your on-call person.",
      },
    ],
    related: ["car-dealerships", "plumbers", "movers"],
  },
];
