"use client";

import dynamic from "next/dynamic";

/**
 * `ContactForm` as its own chunk. `RenderBlocks` imports every block, so a static import would put the
 * form's JS on every CMS page; the dynamic import has to live in a client module to split it out.
 */
export const LazyContactForm = dynamic(() => import("./ContactForm").then((m) => m.ContactForm));

export default LazyContactForm;
