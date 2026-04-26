import HeaderAlt from '@/components/layout/HeaderAlt'
import Footer from '@/components/layout/Footer'
import StickyPageFooter from '@/components/layout/StickyPageFooter'
import { BlogHeroSection, BlogPostsSection, CtaSection } from '@/components/sections'
import Breadcrumb from '@/components/ui/Breadcrumb'

export default function BlogPage() {
  return (
    <div className="relative flex flex-col min-h-screen bg-white">
      <HeaderAlt transparent />
      <div className="relative z-15 -mt-28 md:-mt-48" style={{ background: '#080112' }}>
        <BlogHeroSection />
      </div>
      <div className="flex min-h-0 w-full flex-1 flex-col">
        <main id="blog-posts" className="relative z-20 flex-1 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
          <div className="max-w-7xl mx-auto px-6 pt-8 pb-1" dir="rtl">
            <Breadcrumb items={[{ label: 'בלוג' }]} />
          </div>
          <BlogPostsSection />
          <CtaSection />
        </main>
        <StickyPageFooter className="z-10">
          <Footer />
        </StickyPageFooter>
      </div>
    </div>
  )
}
