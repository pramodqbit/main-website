import { Career } from "../__types";
import { slugify } from "../__utils";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import {
    Briefcase,
    MapPin,
    Banknote,
    ChevronRight,
    CheckCircle2,
} from "lucide-react";

export default function JobsCard({ career }: { career: Career }) {
    const slug = slugify(career.title);

    return (
        <Link href={`/careers/${slug}`} className="group block h-full">
            <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30 border-border bg-card flex flex-col p-0 gap-0">
                {/* Accent bar */}
                <div className="h-1 w-full bg-gradient-to-r from-primary to-secondary shrink-0" />

                <CardContent className="p-6 flex flex-col flex-1 gap-0">
                    {/* Role icon + title */}
                    <div className="flex items-center gap-4 mb-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <Briefcase className="h-6 w-6" />
                        </div>

                        <h3 className="text-lg font-semibold leading-tight text-card-foreground group-hover:text-primary transition-colors">
                            {career.title}
                        </h3>


                    </div>

                    {/* Meta: location & salary */}
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-4">
                        <span className="inline-flex items-center gap-1.5">
                            <MapPin className="h-4 w-4 text-primary/80" aria-hidden />
                            {career.location}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                            <Banknote className="h-4 w-4 text-primary/80" aria-hidden />
                            {career.salary}
                        </span>
                    </div>

                    {/* Requirements preview */}
                    {career.requirements.length > 0 && (
                        <div className="space-y-2 mb-5">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Key requirements
                            </p>
                            <ul className="space-y-1.5">
                                {career.requirements.slice(0, 3).map((req) => (
                                    <li
                                        key={req}
                                        className="flex items-start gap-2 text-sm text-card-foreground"
                                    >
                                        <CheckCircle2
                                            className="h-4 w-4 shrink-0 text-primary mt-0.5"
                                            aria-hidden
                                        />
                                        <span className="line-clamp-2">{req}</span>
                                    </li>
                                ))}
                                {career.requirements.length > 3 && (
                                    <li className="text-xs text-muted-foreground pl-6">
                                        +{career.requirements.length - 3} more
                                    </li>
                                )}
                            </ul>
                        </div>
                    )}

                    {/* CTA */}
                    <div className="mt-auto pt-4 border-t border-border">
                        <span className="inline-flex items-center gap-2 text-sm font-medium text-primary group-hover:gap-3 transition-all">
                            View role
                            <ChevronRight className="h-4 w-4" aria-hidden />
                        </span>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
