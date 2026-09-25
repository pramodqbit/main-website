import { APIError } from "payload";
import { expect, test } from "@playwright/test";
import {
  PROTOTYPE_SOURCE,
  PROTOTYPE_SOURCE_MESSAGE,
  requirePrototypeSourceLabels,
} from "../cms/hooks/requirePrototypeSourceLabels";

type HookArgs = Parameters<typeof requirePrototypeSourceLabels>[0];

function run(data: Record<string, unknown>, originalDoc: Record<string, unknown> = {}) {
  return requirePrototypeSourceLabels({ data, originalDoc } as HookArgs);
}

/** Mirrors `visibleIndexSections` in RenderSections (kept here so Playwright doesn't load server-only modules). */
function visibleIndexSections<T extends { enabled?: boolean | null }>(sections: T[] | null | undefined, draft: boolean): T[] {
  return (sections ?? []).filter((s) => s.enabled || draft);
}

test.describe("index section enabled flag", () => {
  const sections = [
    { blockType: "engagementModels", enabled: false, id: "a" },
    { blockType: "capabilityMatrix", enabled: true, id: "b" },
  ];

  test("live site only shows enabled sections", () => {
    expect(visibleIndexSections(sections, false).map((s) => s.id)).toEqual(["b"]);
  });

  test("draft/preview shows disabled sections too", () => {
    expect(visibleIndexSections(sections, true).map((s) => s.id)).toEqual(["a", "b"]);
  });
});

test.describe("prototype metric source validation", () => {
  test("accepts prototype|demo|synthetic in the source", () => {
    expect(PROTOTYPE_SOURCE.test("Qbitlog prototype testing")).toBe(true);
    expect(PROTOTYPE_SOURCE.test("demo environment")).toBe(true);
    expect(PROTOTYPE_SOURCE.test("synthetic data")).toBe(true);
    expect(PROTOTYPE_SOURCE.test("client report 2024")).toBe(false);
  });

  test("allows publishing a prototype when every metric source is labelled", () => {
    expect(() =>
      run({
        status: "prototype",
        _status: "published",
        metrics: [
          { value: "99", label: "Accuracy", source: "Qbitlog prototype testing on synthetic data" },
          { value: "8.5", label: "Seconds", source: "demo environment timings" },
        ],
      }),
    ).not.toThrow();
  });

  test("blocks publishing a prototype whose metric source omits prototype/demo/synthetic", () => {
    expect(() =>
      run({
        status: "prototype",
        _status: "published",
        metrics: [{ value: "80", label: "Less manual entry", source: "Batra Hospital, 2024" }],
      }),
    ).toThrow(APIError);

    try {
      run({
        status: "prototype",
        _status: "published",
        metrics: [{ value: "80", label: "Less manual entry", source: "Batra Hospital, 2024" }],
      });
    } catch (err) {
      expect(err).toBeInstanceOf(APIError);
      expect((err as APIError).message).toBe(PROTOTYPE_SOURCE_MESSAGE);
    }
  });

  test("does not block draft saves or live case studies", () => {
    expect(() =>
      run({
        status: "prototype",
        _status: "draft",
        metrics: [{ value: "80", label: "x", source: "client report" }],
      }),
    ).not.toThrow();
    expect(() =>
      run({
        status: "live",
        _status: "published",
        metrics: [{ value: "80", label: "x", source: "client report" }],
      }),
    ).not.toThrow();
  });
});
