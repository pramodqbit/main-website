import type { Payload } from "payload";
import type { Faq } from "@/payload-types";
import { readLegacy } from "../lib/context";
import type { LegacyFaq } from "../lib/legacy-types";
import { report } from "../lib/report";
import { upsert } from "../lib/upsert";

type Topic = NonNullable<Faq["topic"]>;

/** New FAQs from the prototype. FAQs have no drafts, so they carry a [REVIEW] prefix until marketing approves them. */
export const REVIEW_FAQS: { question: string; answer: string; topic: Topic }[] = [
  {
    question: "[REVIEW] How do you work across US and European time zones?",
    answer:
      "We keep at least four hours of overlap with your working day, send a written update every Friday, and record every sprint demo so nobody waits on a meeting.",
    topic: "engagement",
  },
  {
    question: "[REVIEW] Can you take over an existing codebase?",
    answer: "Yes. We start with a two-week audit and hand you a written log of what we found and what we\u2019d fix first.",
    topic: "engagement",
  },
];

const TOPICS: Topic[] = ["general", "process", "pricing", "engagement", "technical"];

export async function seedFaqs(payload: Payload) {
  report.step("10 faqs");
  const legacy = readLegacy<LegacyFaq[]>("faqs.json");
  let order = 0;
  for (const f of legacy) {
    const topic = (TOPICS.includes(f.topic as Topic) ? f.topic : "general") as Topic;
    await upsert(payload, "faqs", f.question, { question: { equals: f.question } }, { question: f.question, answer: f.answer, topic, order: order++ });
  }
  for (const f of REVIEW_FAQS) {
    const bare = f.question.replace(/^\[REVIEW\]\s*/, "");
    const existing = await payload.find({
      collection: "faqs",
      where: { or: [{ question: { equals: f.question } }, { question: { equals: bare } }] },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    });
    if (existing.docs[0] && existing.docs[0].question === bare) {
      report.log("faqs", bare, "skipped", "already approved by marketing");
      continue;
    }
    await upsert(payload, "faqs", f.question, { question: { equals: f.question } }, { ...f, order: order++ });
  }
}
