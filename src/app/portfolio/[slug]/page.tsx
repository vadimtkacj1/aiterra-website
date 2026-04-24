import HeaderAlt from "@/components/layout/HeaderAlt";
import Footer from "@/components/layout/Footer";
import { PortfolioProjectHeroSection, CtaSection, FaqSection } from "@/components/sections";
import { getProjectBySlug, portfolioProjects } from "@/data/portfolio";
import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    return portfolioProjects.map((p) => ({ slug: p.slug }));
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

    return (
        <div className="relative flex flex-col min-h-screen bg-white">
            <HeaderAlt transparent />
            <div className="relative z-[15] -mt-28 md:-mt-48" style={{ background: "#080112" }}>
                <PortfolioProjectHeroSection project={project} />
            </div>

            <div className="flex min-h-0 w-full flex-1 flex-col">
                <main className="relative z-20 flex-1 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
                    <section className="bg-white py-20" dir="rtl">
                        <div className="max-w-5xl mx-auto px-6">
                            <Image
                                src={project.image}
                                alt={project.title}
                                width={1200}
                                height={800}
                                className="w-full h-auto object-contain"
                                priority
                            />
                        </div>
                    </section>

                    <CtaSection />
                    <FaqSection />
                </main>

                <div className="sticky bottom-0 z-10 mt-auto w-full">
                    <Footer />
                </div>
            </div>
        </div>
    );
}
