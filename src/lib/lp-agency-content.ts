import { Service, Pillar } from '@/lib/lp-agency-types';
import {
  CONTACT_EMAIL,
  CONTACT_PHONE,
  CONTACT_PHONE_HREF,
  OFFICE_ADDRESS_HE,
  SOCIAL_PROFILES,
} from '@/lib/contact';

export const SERVICES: Service[] = [
  {
    id: 1,
    title: "בניית אתרים שממירים",
    description: [
      "אתרים מותאמים אישית עם חוויית משתמש חכמה, מהירות גבוהה ואופטימיזציה מלאה להמרות.",
      "כל אתר נבנה עם אסטרטגיית Funnel ברורה מהכניסה ועד יצירת ליד.",
      "עיצוב יוקרתי, קוד נקי ותשתית לצמיחה ארוכת טווח."
    ],
    icon: ""
  },
  {
    id: 2,
    title: "קידום אורגני מבוסס תוצאות",
    description: [
      "מחקר מילות מפתח עמוק, אופטימיזציה טכנית ובניית סמכות בגוגל.",
      "אנחנו לא רודפים אחרי טראפיק — אנחנו מביאים תנועה שמייצרת עסקאות.",
      "תהליך ארוך טווח עם מדידה שקופה וברורה."
    ],
    icon: ""
  },
  {
    id: 3,
    title: "קמפיינים ממומנים שמייצרים ROI",
    description: [
      "ניהול קמפיינים בגוגל, פייסבוק ואינסטגרם עם אופטימיזציה יומית.",
      "בניית מסרים, קריאייטיב ופאנל המרות מלא.",
      "כל שקל בפרסום עובד בשבילכם."
    ],
    icon: ""
  },
  {
    id: 4,
    title: "פאנלים ואוטומציות שמגדילים מכירות",
    description: [
      "בניית מסעות לקוח חכמים שמלווים את המשתמש מהקליק הראשון ועד הסגירה.",
      "אוטומציות לידים, CRM והתראות חכמות לצוות המכירות.",
      "תהליך מדויק שמגדיל אחוזי סגירה."
    ],
    icon: ""
  }
];

export const WHY_US_PILLARS: Pillar[] = [
  {
    id: 1,
    title: "חשיבה עסקית לפני עיצוב",
    description: "אנחנו מבינים מספרים, לא רק פיקסלים.",
    icon: "/images/lp/icon5.svg"
  },
  {
    id: 2,
    title: "שקיפות מלאה בדאטה",
    description: "דוחות ברורים, יעדים ברורים ותוצאות מדידות.",
    icon: "/images/lp/icon6.svg"
  },
  {
    id: 3,
    title: "ליווי אמיתי ולא פרויקט חד פעמי",
    description: "אנחנו שותפים לצמיחה שלכם.",
    icon: "/images/lp/icon7.svg"
  }
];

export const NAVIGATION_LINKS = [
  { href: "#services", label: "שירותים" },
  { href: "#portfolio", label: "עבודות" },
  { href: "#why-us", label: "למה אנחנו" },
  { href: "#contact", label: "צור קשר" }
];

export const FOOTER_LINKS = [
  { href: "/about", label: "אודות" },
  { href: "#services", label: "שירותים" },
  { href: "/projects", label: "עבודות" },
  { href: "/blog", label: "בלוג" },
  { href: "#contact", label: "צור קשר" }
];

export const SOCIAL_LINKS = [
  { platform: "instagram", icon: "", url: SOCIAL_PROFILES.instagram, label: "Instagram" },
  { platform: "facebook", icon: "", url: SOCIAL_PROFILES.facebook, label: "Facebook" },
  { platform: "linkedin", icon: "", url: SOCIAL_PROFILES.linkedin, label: "LinkedIn" },
].filter((link) => Boolean(link.url));

export const CONTACT_INFO = {
  phone: CONTACT_PHONE,
  phoneHref: CONTACT_PHONE_HREF,
  email: CONTACT_EMAIL,
  address: OFFICE_ADDRESS_HE
};
