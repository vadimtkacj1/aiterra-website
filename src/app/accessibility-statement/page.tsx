import type { Metadata } from 'next'
import HeaderAlt from '@/components/layout/HeaderAlt'
import Footer from '@/components/layout/Footer'
import StickyPageFooter from '@/components/layout/StickyPageFooter'
import Breadcrumb from '@/components/ui/Breadcrumb'
import AccessibilityBody, { LAST_UPDATED } from '@/components/legal/AccessibilityBody'

export const metadata: Metadata = {
  title: 'הצהרת נגישות',
  description:
    'הצהרת הנגישות של אתר AITERRA: התאמות הנגישות שבוצעו באתר בהתאם לתקן הישראלי 5568 ולהנחיות WCAG 2.1 ברמה AA, ודרכי פנייה לרכז הנגישות.',
  alternates: { canonical: '/accessibility-statement' },
}


export default function AccessibilityStatementPage() {
  return (
    <div className="relative flex flex-col min-h-screen bg-white">
      <HeaderAlt />
      <div className="flex min-h-0 w-full flex-1 flex-col">
        <main id="main-content" className="relative z-20 flex-1 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
          <div className="max-w-4xl mx-auto px-6 pt-8 pb-2" dir="rtl">
            <Breadcrumb items={[{ label: 'הצהרת נגישות' }]} />
          </div>
          <article className="max-w-4xl mx-auto px-6 pt-4 pb-20 prose-blog" dir="rtl">
            <h1 className="text-[28px] md:text-[40px] font-bold text-[#111827] mb-2">הצהרת נגישות</h1>
            <p className="text-[14px] text-[#6b7280] mb-8">עודכן לאחרונה: {LAST_UPDATED}</p>

            <AccessibilityBody />
          </article>
        </main>
        <StickyPageFooter className="z-10">
          <Footer />
        </StickyPageFooter>
      </div>
    </div>
  )
}
