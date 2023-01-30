import { test, expect } from "vitest";
import compress from "@astro.hrry.dev/compress";

test("attributes", () => {
  const c = compress({});
  expect(c).haveOwnProperty("name");
  expect(c).haveOwnProperty("hooks");
  expect(c.hooks).haveOwnProperty("astro:config:setup");
  expect(c.hooks).haveOwnProperty("astro:build:done");
});
