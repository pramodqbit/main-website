"use client";

import { useState } from "react";

/** "Copy link" button using the Clipboard API, with a prompt() fallback. */
export function CopyLink({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy this link", url);
    }
  };
  return (
    <button type="button" onClick={copy} className="font-mono text-label uppercase text-muted hover:text-ink">
      {copied ? "Copied" : "Copy link"}
      <span role="status" className="sr-only">
        {copied ? "Link copied" : ""}
      </span>
    </button>
  );
}

export default CopyLink;
