import { test, expect } from "vitest";
import { slugify } from "./slugify";

test("slugify", () => {
  expect(slugify("John Doe")).toBe("john-doe");
  expect(slugify("John Doe 123")).toBe("john-doe-123");
  expect(slugify("John Doe 123!")).toBe("john-doe-123");
  expect(slugify("John Doe 123!@#$%^&*()")).toBe("john-doe-123");
  expect(slugify("jordi/hola/quepasa")).toBe("jordi-hola-quepasa");
});
