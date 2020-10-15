import { deepMerge } from "./deep_merge.ts";

import { assertEquals } from "https://deno.land/std@0.74.0/testing/asserts.ts";

Deno.test("arrays are concatenated", () => {
    const a = [1, 2];
    const b = [2, 3];
    const exp = [1, 2, 2, 3];
    assertEquals(deepMerge(a, b), exp);
});

Deno.test("objects are deep merged", () => {
    const a = { foo: 1, bar: 1 };
    const b = { bar: 2, baz: 2 };
    const exp = { foo: 1, bar: 2, baz: 2 };
    assertEquals(deepMerge(a, b), exp);
});

Deno.test("otherwise source replaces target", () => {
    const a = [1, 2, 3];
    const b = { foo: 1, bar: 2 };
    const exp = { foo: 1, bar: 2 };
    assertEquals(deepMerge(a, b), exp);
});

Deno.test("arrays are concatenated (in object)", () => {
    const a = { foo: [1, 2], bar: 1 };
    const b = { foo: [2, 3], baz: 2 };
    const exp = { foo: [1, 2, 2, 3], bar: 1, baz: 2 };
    assertEquals(deepMerge(a, b), exp);
});

Deno.test("objects are deep merged (in object)", () => {
    const a = {
        foo: {
            a: 1,
            b: 1
        },
        bar: 1
    };
    const b = {
        foo: {
            b: 2,
            c: 2
        },
        baz: 2
    };
    const exp = {
        foo: {
            a: 1,
            b: 2,
            c: 2
        },
        bar: 1,
        baz: 2
    };
    assertEquals(deepMerge(a, b), exp);
});

Deno.test("otherwise source replaces target (in object)", () => {
    const a = {
        foo: [1, 2, 3],
        bar: 1
    };
    const b = {
        foo: {
            a: 1,
            b: 2
        },
        baz: 2
    };
    const exp = {
        foo: {
            a: 1,
            b: 2
        },
        bar: 1,
        baz: 2
    };
    assertEquals(deepMerge(a, b), exp);
});
