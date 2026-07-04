export interface TocItem {
	id: string;
	text: string;
}

/** Estimated reading time in minutes (~200 wpm). */
export function readTime(html: string): number {
	const words = html
		.replace(/<[^>]+>/g, " ")
		.trim()
		.split(/\s+/).length;
	return Math.max(2, Math.ceil(words / 200));
}

export function formatDate(date: string): string {
	return new Date(date).toLocaleDateString("en-US", {
		month: "long",
		day: "numeric",
		year: "numeric",
	});
}

export function formatMonthYear(date: string): string {
	return new Date(date).toLocaleDateString("en-US", {
		month: "long",
		year: "numeric",
	});
}

/** Add ids to <h2> headings and collect them as a table of contents. */
export function extractToc(html: string): { html: string; toc: TocItem[] } {
	const toc: TocItem[] = [];
	const out = html.replace(/<h2>([\s\S]*?)<\/h2>/g, (_match, inner: string) => {
		const text = inner.replace(/<[^>]+>/g, "").trim();
		let id = text
			.toLowerCase()
			.replace(/[^a-z0-9\s-]/g, "")
			.trim()
			.replace(/\s+/g, "-");
		if (toc.some((t) => t.id === id)) id = `${id}-${toc.length}`;
		toc.push({ id, text });
		return `<h2 id="${id}">${inner}</h2>`;
	});
	return { html: out, toc };
}
