import Link from 'next/link'
import styles from './RelatedServices.module.css'

const SERVICE_KEYWORDS: Record<string, string[]> = {
  'web-development': ['בניית אתר', 'בניית אתרים', 'אתר לעסק', 'next.js', 'react', 'מהירות', 'core web vitals', 'נגישות', 'wordpress', 'wix', 'קוד'],
  seo: ['seo', 'קידום', 'אורגני', 'מילות מפתח', 'מחקר מילות', 'דירוג', 'תוכן', 'בלוג', 'קישורים'],
  ecommerce: ['חנות', 'איקומרס', 'ecommerce', 'סליקה', 'עגלה', 'מוצרים', 'קטלוג', 'משלוח'],
  development: ['מערכת', 'מערכות', 'erp', 'api', 'פורטל', 'אפליקצי', 'אזור אישי', 'פיתוח'],
  automation: ['אוטומצי', 'automation', 'make', 'n8n', 'zapier', 'אינטגרצי', 'חשבונית', 'crm', 'לידים', 'תהליכ', 'זרימת'],
  brochure: ['תדמית', 'דף נחיתה', 'landing', 'לידים'],
  marketing: ['קמפיין', 'קמפיינ', 'ממומן', 'ppc', 'פרסום', 'google ads', 'גוגל אדס', 'פייסבוק', 'facebook', 'אינסטגרם', 'instagram', 'רימרקטינג'],
  branding: ['מיתוג', 'מותג', 'לוגו', 'זהות', 'עיצוב', 'ux', 'ui', 'חוויית משתמש'],
  maintenance: ['תחזוק', 'אחזק', 'אבטח', 'גיבוי', 'עדכונ', 'אחסון', 'דומיין', 'תמיכה', 'ssl', 'תקלה'],
  'ai-agents': ['בוט', 'סוכן', 'סוכני', 'וואטסאפ', 'whatsapp', 'צ׳אט', "צ'אט", 'chatbot', 'agent'],
  'ai-search': ['geo', 'aeo', 'chatgpt', 'gemini', 'perplexity', 'בינה מלאכותית', 'ai overview', 'תשובות ai'],
  'machine-learning': ['למידת מכונה', 'machine learning', 'data science', 'דאטה', 'נתונים', 'חיזוי', 'תחזית', 'דשבורד', 'נטישה'],
  'computer-vision': ['ראייה ממוחשבת', 'computer vision', 'ocr', 'זיהוי תמונה', 'זיהוי תמונות', 'מצלמ', 'סריקת מסמכים', 'בקרת איכות'],
  'mobile-app-development': ['פיתוח אפליקציות', 'אפליקציה לאייפון', 'אפליקציה לאנדרואיד', 'react native', 'flutter', 'פיתוח אפליקציה לעסק', 'mvp לאפליקציה', 'פרסום אפליקציה ב-app store'],
  'desktop-app-development': ['פיתוח תוכנה לדסקטופ', 'פיתוח אפליקציות דסקטופ', 'פיתוח תוכנה ל-Windows', 'תוכנה לעסק בהתאמה אישית', 'העברת תוכנת VB6', 'העברה מ-Access', 'חיבור תוכנה לקופה ולמשקל', 'אפליקציית Electron'],
  'devops-cloud': ['שירותי DevOps', 'DevOps לסטארטאפים', 'הגירה לענן', 'CI/CD', 'Kubernetes', 'הוזלת עלויות ענן', 'גיבוי והתאוששות מאסון', 'ניטור שרתים'],
  'voice-agents': ['סוכן קולי', 'בוט טלפוני', 'מענה טלפוני אוטומטי', 'voice ai', 'מענה קולי בעברית', 'קביעת תורים בטלפון', 'שיחות תזכורת', 'voice agent'],
  'generative-ai': ['בינה מלאכותית יוצרת', 'תוכן שיווקי עם ai', 'תמונות מוצר בבינה מלאכותית', 'סרטוני ai לעסקים', 'כתיבת תוכן בעברית עם ai', 'וריאציות למודעות', 'אווטאר והקראה בעברית', 'יצירת תוכן אוטומטית לקטלוג'],
  'ai-product-development': ['פיתוח מוצר ai', 'פיתוח saas', 'פיתוח mvp', 'פיתוח אפליקציית ai', 'פיתוח מוצר לסטארטאפ', 'בניית מוצר מבוסס בינה מלאכותית', 'פיתוח תוכנה עם llm', 'חברת פיתוח ai'],
  'llm-integration': ['llm', 'rag', 'gpt', 'claude', 'מודל שפה', 'מודלי שפה', 'מסמכים', 'בסיס ידע', 'עוזר ידע'],
  'data-analytics': ['דשבורד', 'דשבורדים', 'bi', 'power bi', 'looker', 'ניתוח נתונים', 'דוחות', 'kpi', 'אנליטיקס'],
  'ai-consulting': ['ייעוץ ai', 'הטמעת ai', 'הטמעה', 'הדרכה', 'מדיניות ai', 'chatgpt לעסק', 'copilot', 'מוכנות'],
}

export type RelatedServiceItem = { slug: string; label: string; blurb: string }

type Props = {
  tags?: string[]
  title?: string
  seed?: string
  heading: string
  basePath: string
  items: RelatedServiceItem[]
}

function offsetFrom(seed: string, span: number): number {
  if (!span) return 0
  let hash = 0
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) % 100000
  }
  return hash % span
}

function pick(items: RelatedServiceItem[], haystack: string, seed: string): RelatedServiceItem[] {
  const scored = items.map((item) => {
    const keywords = SERVICE_KEYWORDS[item.slug] ?? []
    const score = keywords.reduce((n, kw) => (haystack.includes(kw.toLowerCase()) ? n + 1 : n), 0)
    return { item, score }
  })

  const matched = scored
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.item)
    .slice(0, 3)

  const rest = items.filter((item) => !matched.includes(item))
  const start = offsetFrom(seed, rest.length)
  const filled = [...matched]
  for (let i = 0; filled.length < 3 && i < rest.length; i += 1) {
    filled.push(rest[(start + i) % rest.length])
  }
  return filled
}

export default function RelatedServices({
  tags = [],
  title = '',
  seed = '',
  heading,
  basePath,
  items,
}: Props) {
  const picks = pick(items, `${tags.join(' ')} ${title}`.toLowerCase(), seed || title)
  if (!picks.length) return null

  return (
    <section className={styles.related} aria-label={heading}>
      <h2 className={styles.heading}>{heading}</h2>
      <ul className={styles.list}>
        {picks.map((item) => (
          <li key={item.slug}>
            <Link href={`${basePath}/${item.slug}`} className={styles.card}>
              <span className={styles.label}>{item.label}</span>
              <span className={styles.blurb}>{item.blurb}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
