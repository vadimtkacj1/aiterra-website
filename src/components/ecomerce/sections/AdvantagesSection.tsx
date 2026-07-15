import type { LucideIcon } from 'lucide-react'
import { Code2, Plug, Clock, Rocket } from 'lucide-react'
import Reveal from '@/components/ecomerce/ui/Reveal'
import SectionHead from '@/components/ecomerce/ui/section-head'
import RoofBox3D from '@/components/ecomerce/ui/roof-box-3d'

type Service = {
  label: string
  title: string
  desc: string
  bullets: string[]
  tags: string[]
  Icon: LucideIcon
}

const SERVICES: Service[] = [
  {
    label: 'Custom Build',
    title: 'פיתוח מערכת עצמאית',
    desc: 'שכחו מוורדפרס או שופיפיי. אנחנו מספקים מערכת אישית, מנוהלת 100% אצלנו, שמתחייבת למהירות הגבוהה ביותר ולנוחות ניהול מקסימלית עבורכם.',
    bullets: [
      'ניהול 100% אצלנו: שליטה מלאה בקוד ובתשתית, ללא תלות בתוספים חיצוניים.',
      'מהירות מקסימלית: ארכיטקטורה רזה שנבנתה לביצועים ולזמני טעינה נמוכים.',
      'גמישות מוחלטת: כל פיצ׳ר נבנה סביב הצרכים שלכם, לא סביב מגבלות התבנית.',
    ],
    tags: ['No WordPress', 'No Shopify', 'Full Ownership'],
    Icon: Code2,
  },
  {
    label: 'Integrations',
    title: 'אינטגרציה מושלמת מקצה לקצה',
    desc: 'החנות שלכם תעלה לאוויר כשהיא מוכנה לעבודה. סליקה, חברות שילוח, מועדון לקוחות, מערכות דיוור (SMS ומייל), חיבור פיקסלים ו-Clarity – הכל כבר בפנים.',
    bullets: [
      'סליקה ותשלומים: חיבור מלא לספקי הסליקה המובילים בישראל.',
      'שילוח ומלאי: אינטגרציה לחברות השילוח וניהול מלאי חכם.',
      'שיווק ושימור: מועדון לקוחות, דיוור SMS ומייל ואוטומציות.',
      'מדידה ומעקב: פיקסלים של Meta ו-Google ו-Clarity מחוברים מראש.',
    ],
    tags: ['Payments', 'Shipping', 'CRM', 'Pixels'],
    Icon: Plug,
  },
  {
    label: 'Ongoing Support',
    title: 'ליווי צמוד לשנה שלמה',
    desc: 'אנחנו לא נעלמים אחרי ההשקה. השירות שלנו כולל תמיכה ועדכונים שוטפים בהתאם לצרכים המשתנים של העסק שלכם למשך שנה שלמה.',
    bullets: [
      'תמיכה שוטפת: מענה מהיר לכל שאלה, תקלה או בקשת שינוי.',
      'עדכונים והתאמות: המערכת גדלה ומשתדרגת יחד עם העסק שלכם.',
      'אופטימיזציה מתמשכת: שיפור ביצועים והמרות לאורך כל השנה.',
    ],
    tags: ['12 Months', 'Proactive', 'Peace of Mind'],
    Icon: Clock,
  },
  {
    label: 'Fast Delivery',
    title: 'זמן פיתוח מהיר ויעיל',
    desc: 'החלון להצלחה שלכם נפתח תוך 2-8 שבועות בלבד (תלוי במורכבות הפרויקט), תוך שקיפות מלאה על כל שלב בתהליך.',
    bullets: [
      'לו״ז מחייב: השקה תוך 2–8 שבועות, בהתאם למורכבות הפרויקט.',
      'שקיפות מלאה: עדכון שוטף על כל שלב בתהליך.',
      'תהליך מסודר: אפיון, עיצוב, פיתוח, בדיקות והשקה.',
    ],
    tags: ['2–8 Weeks', 'Transparent', 'Agile'],
    Icon: Rocket,
  },
]

/**
 * Ink band. Every card here is a paper surface — it declares `band-paper`, so
 * its own text, rules and accent resolve against white while the section
 * around it stays black. That inversion is the elevation: no shadow, no blur,
 * no border glow. The card is lifted because it is the opposite of its field.
 */
export default function AdvantagesSection() {
  return (
    <section
      id="advantages"
      dir="rtl"
      aria-labelledby="advantages-heading"
      className="band-ink"
    >
      <div className="col-rules mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
        <div className="relative z-10">
          <div className="grid items-center gap-10 lg:grid-cols-12">
            <SectionHead
              className="lg:col-span-6"
              index="03"
              label="היתרונות"
              title={<span id="advantages-heading">הסטנדרד החדש של האיקומרס: הכל קורה תחת קורת גג אחת.</span>}
              lede="מערכת אחת, צוות אחד, אחריות מלאה. במקום לרדוף אחרי ספקים שונים – אנחנו בונים, מחברים ומלווים את החנות שלכם מקצה לקצה."
            />

            {/* The claim, drawn: the integrations fly home into one volume. */}
            <RoofBox3D className="lg:col-span-6" />
          </div>

          <div className="mt-16 grid gap-px md:mt-20 md:grid-cols-2">
            {SERVICES.map(({ label, title, desc, bullets, tags, Icon }, i) => (
              <Reveal key={title} delay={i * 90} className="h-full">
                <article className="group band-paper flex h-full flex-col p-6 md:p-11">
                  <div className="rule-b flex items-center gap-4 pb-4">
                    <Icon className="icon-nudge h-5 w-5" strokeWidth={1.8} aria-hidden />
                    <span className="label t-dim" dir="ltr">
                      {label}
                    </span>
                    <span className="mark t-accent ms-auto text-[12px] font-bold">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <h3 className="sweep mt-7 text-[24px] leading-tight md:text-[28px]">
                    {title}
                  </h3>
                  <p className="t-muted mt-4 text-[15px] leading-relaxed">{desc}</p>

                  {/* Sub-points as a ruled list: each claim gets its own line in
                      the register rather than a checkmark chip.

                      These are full sentences, not micro-labels, so on a phone they
                      sit at the body floor rather than at the register's 14px: the
                      single-column card is the narrowest measure on the page, and it
                      is where the densest reading text on it lands. The 14px is a
                      two-column setting — it only returns once md gives the card a
                      column of its own to breathe in. */}
                  <ul className="mt-8 flex flex-col">
                    {bullets.map((point) => (
                      <li
                        key={point}
                        className="rule-t t-muted flex gap-3 py-3.5 text-[15px] leading-relaxed md:gap-4 md:text-[14px]"
                      >
                        <span aria-hidden className="t-accent mt-[0.45em] h-1 w-1 shrink-0 bg-current" />
                        {point}
                      </li>
                    ))}
                  </ul>

                  <ul className="mt-auto flex flex-wrap gap-x-5 gap-y-2 pt-8" dir="ltr">
                    {tags.map((tag) => (
                      <li key={tag} className="label t-dim">
                        {tag}
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
