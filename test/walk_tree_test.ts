import { walkTreeCall, walkTreeLeafCall, walkTreeCompare } from "../src/walk_tree.ts";
import { assertEquals } from "https://deno.land/std@0.74.0/testing/asserts.ts";

Deno.test("walk tree", () => {
    /*
     *         a1
     *        /
     *      b1
     *     /  \
     *   c1   c2
     */

    const a1 = {
        b1: {
            c1: {},
            c2: {}
        }
    };

    const output = [];
    walkTreeCall(a1, (_, key) => {
        output.push(key);
    });
    assertEquals(output, ["b1", "c1", "c2"]);
});

Deno.test("walk tree leaf", () => {
    /*
     *         a1
     *        /
     *      b1
     *     /  \
     *   c1   c2
     */

    const a1 = {
        b1: {
            c1: {},
            c2: {}
        }
    };

    const output = [];
    walkTreeLeafCall(a1, (_, key) => {
        output.push(key);
    });
    assertEquals(output, ["c1", "c2"]);
});

Deno.test("compare trees", () => {
    /*
     *         a1    a2
     *        /        \
     *      b1    ->    b2
     *     /  \        /  \
     *   c1   c2      c1  c2
     */

    const a1 = {
        b1: {
            c1: {},
            c2: {}
        }
    };

    const a2 = {
        b2: { c1: {}, c2: {} }
    };

    const output = [];
    walkTreeCompare(a1, a2, (_, key) => {
        output.push(key);
    });
    assertEquals(output, ["b1", "c1", "c2"]);
});

Deno.test("compare trees leaf", () => {
    /*
     *         a1    a2
     *        /        \
     *      b1    ->    b2
     *     /  \        /  \
     *   c1   c2      c1  c2
     */

    const a1 = {
        b1: {
            c1: {},
            c2: {}
        }
    };

    const a2 = {
        b2: { c1: {}, c2: {} }
    };

    const output = [];
    walkTreeCompare(a1, a2, (_, key) => {
        output.push(key);
    }, true);
    assertEquals(output, ["c1", "c2"]);
});