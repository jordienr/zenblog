import { describe, expect, it } from "vitest";

describe("db package", () => {
  it("exports a baseline public-api repo layer", async () => {
    const mod = await import("../src/index");

    expect(mod.listPublicPosts).toBeTypeOf("function");
    expect(mod.getPublicPostBySlug).toBeTypeOf("function");
  });
});
