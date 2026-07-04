"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type { TocItem } from "../_lib/utils";

export function TableOfContents({ items }: { items: TocItem[] }) {
	const [activeId, setActiveId] = useState<string | null>(null);

	useEffect(() => {
		if (items.length === 0) return;
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						setActiveId(entry.target.id);
						break;
					}
				}
			},
			{ rootMargin: "-20% 0px -70% 0px" },
		);
		for (const item of items) {
			const el = document.getElementById(item.id);
			if (el) observer.observe(el);
		}
		return () => observer.disconnect();
	}, [items]);

	if (items.length === 0) return null;

	return (
		<nav className='rounded-2xl border border-border/60 bg-white p-5 shadow-sm'>
			<p className='text-[11px] font-bold uppercase tracking-wider text-muted-foreground'>
				On This Page
			</p>
			<ul className='mt-4 space-y-0.5'>
				{items.map((item) => {
					const active = item.id === activeId;
					return (
						<li key={item.id}>
							<a
								href={`#${item.id}`}
								className={cn(
									"flex items-start gap-2.5 rounded-md px-2 py-1.5 text-xs leading-snug transition-colors",
									active
										? "font-semibold text-primary"
										: "text-muted-foreground hover:text-foreground",
								)}>
								<span
									className={cn(
										"mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full transition-colors",
										active ? "bg-primary" : "bg-border",
									)}
								/>
								{item.text}
							</a>
						</li>
					);
				})}
			</ul>
		</nav>
	);
}

export default TableOfContents;
