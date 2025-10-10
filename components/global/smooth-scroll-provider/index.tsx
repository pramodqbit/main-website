"use client";

import { useEffect } from "react";

export default function SmoothScrollProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	useEffect(() => {
		// Enable smooth scrolling for the entire page
		document.documentElement.style.scrollBehavior = "smooth";

		return () => {
			document.documentElement.style.scrollBehavior = "auto";
		};
	}, []);

	return <>{children}</>;
}

