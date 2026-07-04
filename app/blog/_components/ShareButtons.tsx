"use client";

import { useState } from "react";
import { Linkedin, Twitter, Link2, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function ShareButtons({
	title,
	className,
}: {
	title: string;
	className?: string;
}) {
	const [copied, setCopied] = useState(false);

	const pageUrl = () =>
		typeof window !== "undefined" ? window.location.href : "";

	const openShare = (buildUrl: (url: string) => string) => {
		window.open(
			buildUrl(encodeURIComponent(pageUrl())),
			"_blank",
			"noopener,noreferrer,width=600,height=500",
		);
	};

	const copyLink = async () => {
		try {
			await navigator.clipboard.writeText(pageUrl());
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch {
			// clipboard unavailable — ignore
		}
	};

	return (
		<div className={cn("flex items-center gap-2.5", className)}>
			<button
				type='button'
				aria-label='Share on LinkedIn'
				onClick={() =>
					openShare(
						(u) => `https://www.linkedin.com/sharing/share-offsite/?url=${u}`,
					)
				}
				className='flex h-9 w-9 items-center justify-center rounded-full bg-[#0A66C2] text-white transition-transform hover:scale-110'>
				<Linkedin className='h-4 w-4' />
			</button>
			<button
				type='button'
				aria-label='Share on X'
				onClick={() =>
					openShare(
						(u) =>
							`https://twitter.com/intent/tweet?url=${u}&text=${encodeURIComponent(title)}`,
					)
				}
				className='flex h-9 w-9 items-center justify-center rounded-full bg-foreground text-background transition-transform hover:scale-110'>
				<Twitter className='h-4 w-4' />
			</button>
			<button
				type='button'
				aria-label='Copy link'
				onClick={copyLink}
				className='flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-white text-muted-foreground transition-all hover:scale-110 hover:text-primary'>
				{copied ? (
					<Check className='h-4 w-4 text-green-600' />
				) : (
					<Link2 className='h-4 w-4' />
				)}
			</button>
		</div>
	);
}

export default ShareButtons;
