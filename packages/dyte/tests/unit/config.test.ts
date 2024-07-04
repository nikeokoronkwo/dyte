import {
  assert,
  assertEquals,
  assertExists,
  assertStrictEquals,
} from "https://deno.land/std@0.224.0/assert/mod.ts";
import { generateConfig } from "../../src/config/config.ts";

Deno.test("Dev Config Tests", {}, async (t) => {
  await t.step("Case I", () => {
    const config = generateConfig("development", ".", "foo");

    assertStrictEquals(config.root, "foo");
    assertEquals(config.mode, "development");
    assertStrictEquals(config.base, "/");
    assert(config.npm === undefined);
    assertEquals(config.server, { port: 8000, host: "localhost" });
  });
});

Deno.test("Production Config Tests", {}, (t) => {
});
