const map: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

export function escapeHtml(value: unknown): string {
  if (value === null || value === undefined) return "";
  const text = Array.isArray(value) ? value.join(", ") : String(value);
  return text.replace(/[&<>"']/g, (ch) => map[ch] ?? ch);
}
