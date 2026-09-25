export type FormState = {
  ok: boolean;
  id?: string;
  errors?: Record<string, string>;
  message?: string;
  /** Submitted text values, echoed back so a failed submit keeps the user's input. */
  values?: Record<string, string>;
};

export const initialFormState: FormState = { ok: false };

export const BUDGET_OPTIONS = [
  { value: "<25k", label: "Under $25k" },
  { value: "25-50k", label: "$25k – $50k" },
  { value: "50-100k", label: "$50k – $100k" },
  { value: "100k+", label: "$100k+" },
  { value: "unsure", label: "Not sure yet" },
];

export const SERVICE_OPTIONS = [
  { value: "ai", label: "AI & automation" },
  { value: "web", label: "Web platform" },
  { value: "mobile", label: "Mobile app" },
  { value: "design", label: "Product design" },
  { value: "cloud", label: "Cloud & DevOps" },
  { value: "other", label: "Something else" },
] as const;

export const TIMELINE_OPTIONS = [
  { value: "asap", label: "As soon as possible" },
  { value: "1-3m", label: "In 1–3 months" },
  { value: "3-6m", label: "In 3–6 months" },
  { value: "exploring", label: "Just exploring" },
];
