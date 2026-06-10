import HeaderAlt from "@/components/layout/HeaderAlt";
import Footer from "@/components/layout/Footer";
import StickyPageFooter from "@/components/layout/StickyPageFooter";
import { PortfolioProjectHeroSection, CtaSection } from "@/components/sections";
import FaqSection from '@/components/sections/common/FaqSection'
import { getProjectBySlug } from '@/lib/portfolio-server'
import { getFaqData } from '@/lib/faq-server'
import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import Breadcrumb from "@/components/ui/Breadcrumb";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const project = getProjectBySlug(slug);
    if (!project) return {};
    const title = project.metaTitle?.trim() || `${project.title} | תיק עבודות | Aiterra`;
    const description = project.metaDescription?.trim() || project.heroDescription;
    return { title, description, alternates: { canonical: `/portfolio/${slug}` } };
}

export default async function PortfolioProjectPage({ params }: Props) {
    const { slug } = await params;
    const project = getProjectBySlug(slug);
    if (!project) notFound();
    const faqData = getFaqData('/portfolio')

    if (project.hasPage === false) notFound();

    const externalOnly = project.externalUrl?.trim();
    if (externalOnly) {
        redirect(externalOnly);
    }

    const hasCaseStudy = Boolean(project.caseStudy && project.caseStudy.length > 0);

    const imageAlt = project.imageAlt?.trim() || project.title;
    const imageEl = (
        <Image
            src={project.image}
            alt={imageAlt}
            width={1200}
            height={800}
            className="w-full h-auto object-contain transition-opacity duration-300"
            priority
        />
    );

    const imageCol = project.liveSiteUrl ? (
        <a
            href={project.liveSiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group block rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#530FAD] focus-visible:ring-offset-2"
            aria-label={`${project.title} — מעבר לאתר הפרויקט`}
        >
            <span className="block group-hover:opacity-90">{imageEl}</span>
        </a>
    ) : (
        <div className="rounded-lg">{imageEl}</div>
    );

    return (
        <div className="relative flex flex-col min-h-screen bg-white">
            <HeaderAlt transparent />
            <div className="relative z-15 -mt-28 md:-mt-48" style={{ background: "#080112" }}>
                <PortfolioProjectHeroSection project={project} />
            </div>

            <div className="flex min-h-0 w-full flex-1 flex-col">
                <main className="relative z-20 flex-1 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
                    <div className="max-w-5xl mx-auto px-6 pt-6 pb-2">
                        <Breadcrumb items={[
                            { label: 'תיק עבודות', href: '/portfolio' },
                            { label: project.title },
                        ]} />
                    </div>
                    <section className="bg-white py-12 md:py-16">
                        <div
                            className={
                                hasCaseStudy ? "max-w-7xl mx-auto px-6" : "max-w-5xl mx-auto px-6"
                            }
                        >
                            {hasCaseStudy ? (
                                <div
                                    className="grid grid-cols-1 gap-10 md:gap-12 lg:grid-cols-2 lg:gap-14 items-start"
                                    dir="ltr"
                                >
                                    <div className="min-w-0">{imageCol}</div>
                                    <div
                                        className="min-w-0 space-y-6 text-[#1a1a1a] text-right"
                                        dir="rtl"
                                    >
                                        {project.caseStudy!.map((paragraph, i) => (
                                            <p
                                                key={i}
                                                className="text-base md:text-lg leading-relaxed font-medium"
                                            >
                                                {paragraph}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                imageCol
                            )}
                        </div>
                    </section>

                    {project.galleryImages && project.galleryImages.length > 0 ? (
                        <section className="bg-white border-t border-gray-100 py-12 md:py-16">
                            <div className="max-w-7xl mx-auto px-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                                    {project.galleryImages.map((src, i) => (
                                        <div key={`${src}-${i}`} className="relative w-full overflow-hidden rounded-lg bg-gray-50">
                                            <Image
                                                src={src}
                                                alt={`${imageAlt} — ${i + 1}`}
                                                width={900}
                                                height={600}
                                                className="h-auto w-full object-contain"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    ) : null}

                    <CtaSection />
                    <FaqSection data={faqData} />
                </main>

                <StickyPageFooter className="z-10">
                    <Footer />
                </StickyPageFooter>
            </div>
        </div>
    );
}
