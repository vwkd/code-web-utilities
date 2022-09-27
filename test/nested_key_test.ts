import { deepGet, deepSet } from "../src/nested_key.ts";
import { assertEquals } from "https://deno.land/std@0.103.0/testing/asserts.ts";

Deno.test("get nested object", () => {

  const obj = { a: { ab: { abc: 42 } } };

  const val = deepGet(obj, ["a", "ab", "abc"]);

  assertEquals(val, 42)
});

Deno.test("set nested object", () => {

  const obj = { a: { ab: {} } };

  deepSet(obj, ["a", "ab", "abc"], 42);

  assertEquals(obj, { a: { ab: { abc: 42 } } })
});

Deno.test("set nested object force", () => {

  const obj = {};

  deepSet(obj, ["a", "ab", "abc"], 42, true);

  assertEquals(obj, { a: { ab: { abc: 42 } } })
});