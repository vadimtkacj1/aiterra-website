import JsonLd from '@/components/seo/JsonLd'
import { faqPage, webPage } from '@/lib/schema'
import { getV2Content } from '@/lib/v2-content-server'

export const HOME_TITLE = 'אייטרה AITERRA | בניית אתרים, אפליקציות, אוטומציה ו-AI לעסקים'
export const HOME_DESCRIPTION =
  'חברת תוכנה ודיגיטל: בניית אתרים וחנויות, פיתוח אפליקציות ותוכנה בכל שפה, אוטומציה, סוכני AI ולמידת מכונה, DevOps, קידום בגוגל וב-AI ופרסום ממומן. ספק אחד לכל הדיגיטל.'

export default function HomeJsonLd() {
  const { faqEntries } = getV2Content()

  const page = {
    ...webPage({
      path: '/',
      name: HOME_TITLE,
      description: HOME_DESCRIPTION,
      image: '/images/og/og-aiterra-v2.png',
    }),
    speakable: { '@type': 'SpeakableSpecification', cssSelector: ['h1', 'p'] },
  }

  const faq = faqPage({ path: '/', entries: faqEntries })

  return (
    <>
      <JsonLd data={page} />
      {faq ? <JsonLd data={faq} /> : null}
    </>
  )
}
