import HeaderAlt from "@/components/layout/HeaderAlt";
import Footer from "@/components/layout/Footer";
import StickyPageFooter from "@/components/layout/StickyPageFooter";
import { PortfolioProjectHeroSection, CtaSection, FaqSection } from "@/components/sections";
import { getProjectBySlug } from "@/data/portfolio";
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
    return {
        title: `${project.title} | תיק עבודות | Aiterra`,
        description: project.heroDescription,
    };
}

export default async function PortfolioProjectPage({ params }: Props) {
    const { slug } = await params;
    const project = getProjectBySlug(slug);
    if (!project) notFound();

    const externalOnly = project.externalUrl?.trim();
    if (externalOnly) {
        redirect(externalOnly);
    }

    const hasCaseStudy = Boolean(project.caseStudy && project.caseStudy.length > 0);

    const imageEl = (
        <Image
            src={project.image}
            alt={project.title}
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

                    <CtaSection />
                    <FaqSection />
                </main>

                <StickyPageFooter className="z-10">
                    <Footer />
                </StickyPageFooter>
            </div>
        </div>
    );
}
