import type { Metadata } from 'next'
import HeaderAlt from '@/components/layout/HeaderAlt'
import Footer from '@/components/layout/Footer'
import StickyPageFooter from '@/components/layout/StickyPageFooter'
import Breadcrumb from '@/components/ui/Breadcrumb'
import PrivacyBody, { LAST_UPDATED } from '@/components/legal/PrivacyBody'

export const metadata: Metadata = {
  title: 'מדיניות פרטיות',
  description:
    'מדיניות הפרטיות של AITERRA: איזה מידע נאסף באתר, שימוש בעוגיות וכלי מעקב שיווקיים, דיוור שיווקי, העברת מידע לצדדים שלישיים, אבטחת מידע וזכויותיכם לפי חוק הגנת הפרטיות.',
  alternates: { canonical: '/privacy-policy' },
}


export default function PrivacyPolicyPage() {
  return (
    <div className="relative flex flex-col min-h-screen bg-white">
      <HeaderAlt />
      <div className="flex min-h-0 w-full flex-1 flex-col">
        <main id="main-content" className="relative z-20 flex-1 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
          <div className="max-w-4xl mx-auto px-6 pt-8 pb-2" dir="rtl">
            <Breadcrumb items={[{ label: 'מדיניות פרטיות' }]} />
          </div>
          <article className="max-w-4xl mx-auto px-6 pt-4 pb-20 prose-blog" dir="rtl">
            <h1 className="text-[28px] md:text-[40px] font-bold text-[#111827] mb-2">מדיניות פרטיות</h1>
            <p className="text-[14px] text-[#6b7280] mb-8">עודכן לאחרונה: {LAST_UPDATED}</p>

            <PrivacyBody />
          </article>
        </main>
        <StickyPageFooter className="z-10">
          <Footer />
        </StickyPageFooter>
      </div>
    </div>
  )
}
