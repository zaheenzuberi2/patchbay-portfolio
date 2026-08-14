export const siteConfig = {
  name: "Patchbay",
  ownerName: "Zaheen Zuberi",
  title: "Zaheen Zuberi | Patchbay: AI Automation, Chatbots & Full-Stack Websites",
  description:
    "Zaheen Zuberi leads Patchbay in Islamabad: voice and calling agents, chatbots, automation, full-stack website development, and every service a marketing agency provides, from one accountable team.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  locale: "en_US",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "zaheenzuberi2@gmail.com",
  contactPhoneDisplay: process.env.NEXT_PUBLIC_CONTACT_PHONE_DISPLAY || "+92 346 1223692",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "923461223692",
  location: "Islamabad, Pakistan",
  keywords: [
    "Zaheen Zuberi",
    "Patchbay",
    "AI automation agency Islamabad",
    "AI chatbot developer Pakistan",
    "voice agent developer",
    "calling agent developer",
    "full-stack web developer Islamabad",
    "website development Pakistan",
    "full-stack websites",
    "marketing agency Islamabad",
    "social media management Pakistan",
    "n8n automation developer",
    "Next.js developer Pakistan",
  ],
};

export const whatsappUrl = `https://wa.me/${siteConfig.whatsappNumber}`;
