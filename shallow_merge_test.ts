import { shallowMerge, shallowMergeArr } from "./shallow_merge.ts";
import { assertEquals } from "https://deno.land/std@0.74.0/testing/asserts.ts";

// unlike deepMerge
Deno.test("arrays aren't merged", () => {
    const a = [1, 2];
    const b = [2, 3];
    const exp = [2, 3];
    assertEquals(shallowMerge(a, b), exp);
});

Deno.test("arrays aren't merged (multiple)", () => {
    const a = [1, 2];
    const b = [2, 3];
    const c = [3, 4];
    const exp = [3, 4];
    assertEquals(shallowMergeArr(a, b, c), exp);
});

// like deepMerge
Deno.test("objects are shallow merged", () => {
    const a = { foo: 1, bar: 1 };
    const b = { bar: 2, baz: 2 };
    const exp = { foo: 1, bar: 2, baz: 2 };
    assertEquals(shallowMerge(a, b), exp);
});

Deno.test("objects are shallow merged (multiple)", () => {
    const a = { foo: 1, bar: 1 };
    const b = { bar: 2, baz: 2 };
    const c = { baz: 3, buz: 3 };
    const exp = { foo: 1, bar: 2, baz: 3, buz: 3 };
    assertEquals(shallowMergeArr(a, b, c), exp);
});

// like deepMerge
Deno.test("otherwise source replaces target", () => {
    const a = [1, 2, 3];
    const b = { foo: 1, bar: 2 };
    const exp = { foo: 1, bar: 2 };
    assertEquals(shallowMerge(a, b), exp);
});

Deno.test("otherwise source replaces target (multiple)", () => {
    const a = [1, 2, 3];
    const b = { foo: 1, bar: 2 };
    const c = [4];
    const exp = [4];
    assertEquals(shallowMergeArr(a, b, c), exp);
});

// unlike deepMerge
Deno.test("arrays aren't merged (in object)", () => {
    const a = { foo: [1, 2], bar: 1 };
    const b = { foo: [2, 3], baz: 2 };
    const exp = { foo: [2, 3], bar: 1, baz: 2 };
    assertEquals(shallowMerge(a, b), exp);
});

Deno.test("arrays aren't merged (in object) (multiple)", () => {
    const a = { foo: [1, 2], bar: 1 };
    const b = { foo: [2, 3], baz: 2 };
    const c = { foo: [3, 4], buz: 3 };
    const exp = { foo: [3, 4], bar: 1, baz: 2, buz: 3 };
    assertEquals(shallowMergeArr(a, b, c), exp);
});

// unlike deepMerge
Deno.test("objects are shallow merged (in object)", () => {
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
            b: 2,
            c: 2
        },
        bar: 1,
        baz: 2
    };
    assertEquals(shallowMerge(a, b), exp);
});

Deno.test("objects are shallow merged (in object) (multiple)", () => {
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
    const c = {
        foo: {
            c: 3,
            d: 3
        },
        buz: 3
    };
    const exp = {
        foo: {
            c: 3,
            d: 3
        },
        bar: 1,
        baz: 2,
        buz: 3
    };
    assertEquals(shallowMergeArr(a, b, c), exp);
});

// like deepMerge
Deno.test("otherwise aren't merged (in object)", () => {
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
    assertEquals(shallowMerge(a, b), exp);
});

Deno.test("otherwise aren't merged (in object) (multiple)", () => {
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
    const c = {
        foo: [4],
        buz: 3
    };
    const exp = {
        foo: [4],
        bar: 1,
        baz: 2,
        buz: 3
    };
    assertEquals(shallowMergeArr(a, b, c), exp);
});
