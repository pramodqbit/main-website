import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/global/navbar";
import Footer from "@/components/global/footer";
import {
    Briefcase,
    MapPin,
    Banknote,
    CheckCircle2,
    ArrowRight,
} from "lucide-react";
import { getCareerBySlug, getCareers, slugify } from "../__utils";
import ApplyForm from "./_components/ApplyForm";
import SectionLayout from "@/components/global/section-layout";

export async function generateStaticParams() {
    const careers = getCareers();
    return careers.map((c) => ({ name: slugify(c.title) }));
}

const ICON_SIZE = 32;
export async function generateMetadata({
    params,
}: {
    params: Promise<{ name: string }>;
}) {
    const { name } = await params;
    const career = getCareerBySlug(name);
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://qbitlog.com";
    if (!career)
        return {
            title: "Job Not Found",
            description: "The requested job could not be found.",
        };
    return {
        title: `${career.title} - Careers | QBITLOG`,
        description: career.description,
        openGraph: {
            title: `${career.title} - Careers`,
            description: career.description,
            url: `${siteUrl}/careers/${name}`,
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: `${career.title} - Careers`,
            description: career.description,
        },
        alternates: {
            canonical: `${siteUrl}/careers/${name}`,
        },
    };
}

export default async function CareerPage({
    params,
}: {
    params: Promise<{ name: string }>;
}) {
    const { name } = await params;
    const career = getCareerBySlug(name);
    if (!career) notFound();

    return (
        <div className="">
            <main >
                <Navbar />


                <SectionLayout
                    id="careers"
                    badgeIcon={<Briefcase size={ICON_SIZE} className="text-primary" />}
                    badgeLabel="Careers"
                    title={career.title}

                >
                    <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 -mt-5 text-muted-foreground">
                        <span className="inline-flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-primary/80" />
                            {career.location}
                        </span>
                        <span className="inline-flex items-center gap-2">
                            <Banknote className="h-4 w-4 text-primary/80" />
                            {career.salary}
                        </span>
                    </div>
                </SectionLayout>
                {/* Job header */}


                <div className="mx-4 md:mx-8 lg:mx-10 2xl:mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12 pb-16">
                    {/* Job content */}
                    <div className="lg:col-span-2 space-y-8 ">
                        <section>
                            <h2 className="text-lg font-semibold text-foreground mb-3">
                                About the role
                            </h2>
                            <p className="text-muted-foreground leading-relaxed">
                                {career.description}
                            </p>
                        </section>

                        {career.positionoverView && career.positionoverView.length > 0 && (
                            <section>
                                <h2 className="text-lg font-semibold text-foreground mb-4">
                                    Position overview
                                </h2>
                                <ul className="space-y-3">
                                    {career.positionoverView.map((item) => (
                                        <li
                                            key={item}
                                            className="flex items-start gap-3 text-muted-foreground"
                                        >
                                            <CheckCircle2 className="h-5 w-5 shrink-0 text-primary mt-0.5" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        {career.keyResponsibilities && career.keyResponsibilities.length > 0 && (
                            <section>
                                <h2 className="text-lg font-semibold text-foreground mb-4">
                                    Key responsibilities
                                </h2>
                                <ul className="space-y-3">
                                    {career.keyResponsibilities.map((item) => (
                                        <li
                                            key={item}
                                            className="flex items-start gap-3 text-muted-foreground"
                                        >
                                            <CheckCircle2 className="h-5 w-5 shrink-0 text-primary mt-0.5" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        <section>
                            <h2 className="text-lg font-semibold text-foreground mb-4">
                                Requirements
                            </h2>
                            <ul className="space-y-3">
                                {career.requirements.map((req) => (
                                    <li
                                        key={req}
                                        className="flex items-start gap-3 text-muted-foreground"
                                    >
                                        <CheckCircle2 className="h-5 w-5 shrink-0 text-primary mt-0.5" />
                                        <span>{req}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        {career.benefits && career.benefits.length > 0 && (
                            <section>
                                <h2 className="text-lg font-semibold text-foreground mb-4">
                                    What&apos;s in it for you?
                                </h2>
                                <ul className="space-y-3">
                                    {career.benefits.map((item) => (
                                        <li
                                            key={item}
                                            className="flex items-start gap-3 text-muted-foreground"
                                        >
                                            <CheckCircle2 className="h-5 w-5 shrink-0 text-primary mt-0.5" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}

                        <section className="pt-4">
                            <Link
                                href="/careers"
                                className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
                            >
                                <ArrowRight className="h-4 w-4 rotate-180" />
                                Back to all openings
                            </Link>
                        </section>
                    </div>

                    {/* Apply card */}
                    <aside className="lg:col-span-1">
                        <div className="sticky top-24 rounded-xl border border-border bg-card p-6 shadow-sm">
                            <ApplyForm jobTitle={career.title} />
                        </div>
                    </aside>
                </div>
            </main>
            <Footer />
        </div>
    );
}
