import { walkChainCall, walkChainMerge } from "./walk_chain.ts";
import { shallowMerge } from "./shallow_merge.ts";
import { deepMerge } from "./deep_merge.ts";
import { assertEquals } from "https://deno.land/std@0.74.0/testing/asserts.ts";

/* linked nodes
 *
 *         a1
 *        /  \
 *      b1    b2
 *     /  \
 *   c1   c2
 */

Deno.test("walk chain", () => {
    const a1 = {
        name: "a1"
    };

    const b1 = {
        name: "b1",
        parent: a1
    };

    const b2 = {
        name: "b2",
        parent: a1
    };

    const c1 = {
        name: "c1",
        parent: b1
    };

    const c2 = {
        name: "c2",
        parent: b1
    };

    const arrows = (node, lastValue) => `${node.name}${lastValue ? ` <- ${lastValue}` : ""}`;

    assertEquals(walkChainCall(a1, "parent", arrows), "a1");
    assertEquals(walkChainCall(b1, "parent", arrows), "a1 <- b1");
    assertEquals(walkChainCall(b2, "parent", arrows), "a1 <- b2");
    assertEquals(walkChainCall(c1, "parent", arrows), "a1 <- b1 <- c1");
    assertEquals(walkChainCall(c2, "parent", arrows), "a1 <- b1 <- c2");
});

Deno.test("merge properties", () => {
    const a1 = {
        name: "a1",
        data: {
            foo: {
                a: "a1",
                a1: "a1"
            },
            bar: "a1"
        }
    };

    const b1 = {
        name: "b1",
        parent: a1,
        data: {
            foo: {
                a: "b1",
                b: "b1",
                b1: "b1"
            },
            baz: "b1"
        }
    };

    const c1 = {
        name: "c1",
        parent: b1,
        data: {
            foo: {
                b: "c1",
                c: "c1",
                c1: "c1"
            },
            buz: "c1"
        }
    };

    assertEquals(walkChainMerge(c1, "parent", "data", shallowMerge), {
        foo: { b: "c1", c: "c1", c1: "c1" },
        bar: "a1",
        baz: "b1",
        buz: "c1"
    });
    assertEquals(walkChainMerge(c1, "parent", "data", deepMerge), {
        foo: { a: "b1", a1: "a1", b: "c1", b1: "b1", c: "c1", c1: "c1" },
        bar: "a1",
        baz: "b1",
        buz: "c1"
    });
});
