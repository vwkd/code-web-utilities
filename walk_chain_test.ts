import { walkChainCall, walkChainMerge, walkChainIdCall, walkChainIdMerge } from "./walk_chain.ts";
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

Deno.test("walk chain by link", () => {
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

    assertEquals(walkChainCall({ startNode: a1, linkName: "parent", callback: arrows }), "a1");
    assertEquals(walkChainCall({ startNode: b1, linkName: "parent", callback: arrows }), "a1 <- b1");
    assertEquals(walkChainCall({ startNode: b2, linkName: "parent", callback: arrows }), "a1 <- b2");
    assertEquals(walkChainCall({ startNode: c1, linkName: "parent", callback: arrows }), "a1 <- b1 <- c1");
    assertEquals(walkChainCall({ startNode: c2, linkName: "parent", callback: arrows }), "a1 <- b1 <- c2");
});

Deno.test("walk chain by link cyclic", () => {
    const a1 = {
        name: "a1"
    };

    const b1 = {
        name: "b1"
    };

    a1.parent = b1;
    b1.parent = a1;

    const arrows = (node, lastValue) => `${node.name}${lastValue ? ` <- ${lastValue}` : ""}`;

    assertEquals(walkChainCall({ startNode: b1, linkName: "parent", callback: arrows }), "a1 <- b1");
});

Deno.test("merge properties by link", () => {
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

    assertEquals(
        walkChainMerge({
            startNode: c1,
            linkName: "parent",
            mergeProperty: "data",
            mergeFunction: shallowMerge
        }),
        {
            foo: { b: "c1", c: "c1", c1: "c1" },
            bar: "a1",
            baz: "b1",
            buz: "c1"
        }
    );
    assertEquals(
        walkChainMerge({
            startNode: c1,
            linkName: "parent",
            mergeProperty: "data",
            mergeFunction: deepMerge
        }),
        {
            foo: { a: "b1", a1: "a1", b: "c1", b1: "b1", c: "c1", c1: "c1" },
            bar: "a1",
            baz: "b1",
            buz: "c1"
        }
    );
});

Deno.test("merge properties by link cyclic", () => {
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
        data: {
            foo: {
                a: "b1",
                b: "b1",
                b1: "b1"
            },
            baz: "b1"
        }
    };

    a1.parent = b1;
    b1.parent = a1;

    assertEquals(
        walkChainMerge({
            startNode: b1,
            linkName: "parent",
            mergeProperty: "data",
            mergeFunction: shallowMerge
        }),
        {
            foo: { a: "b1", b: "b1", b1: "b1" },
            bar: "a1",
            baz: "b1"
        }
    );
    assertEquals(
        walkChainMerge({
            startNode: b1,
            linkName: "parent",
            mergeProperty: "data",
            mergeFunction: deepMerge
        }),
        {
            foo: { a: "b1", a1: "a1", b: "b1", b1: "b1" },
            bar: "a1",
            baz: "b1"
        }
    );
});

Deno.test("walk chain by id", () => {
    const a1 = {
        name: "a1"
    };

    const b1 = {
        name: "b1",
        parent: "a1"
    };

    const b2 = {
        name: "b2",
        parent: "a1"
    };

    const c1 = {
        name: "c1",
        parent: "b1"
    };

    const c2 = {
        name: "c2",
        parent: "b1"
    };

    const arrows = (node, lastValue) => `${node.name}${lastValue ? ` <- ${lastValue}` : ""}`;

    assertEquals(
        walkChainIdCall({
            startNode: a1,
            nodeList: [a1, b1, b2, c1, c2],
            linkName: "parent",
            idName: "name",
            callback: arrows
        }),
        "a1"
    );
    assertEquals(
        walkChainIdCall({
            startNode: b1,
            nodeList: [a1, b1, b2, c1, c2],
            linkName: "parent",
            idName: "name",
            callback: arrows
        }),
        "a1 <- b1"
    );
    assertEquals(
        walkChainIdCall({
            startNode: b2,
            nodeList: [a1, b1, b2, c1, c2],
            linkName: "parent",
            idName: "name",
            callback: arrows
        }),
        "a1 <- b2"
    );
    assertEquals(
        walkChainIdCall({
            startNode: c1,
            nodeList: [a1, b1, b2, c1, c2],
            linkName: "parent",
            idName: "name",
            callback: arrows
        }),
        "a1 <- b1 <- c1"
    );
    assertEquals(
        walkChainIdCall({
            startNode: c2,
            nodeList: [a1, b1, b2, c1, c2],
            linkName: "parent",
            idName: "name",
            callback: arrows
        }),
        "a1 <- b1 <- c2"
    );
});

Deno.test("walk chain by id cyclic", () => {
    const a1 = {
        name: "a1",
        parent: "b1"
    };

    const b1 = {
        name: "b1",
        parent: "a1"
    };

    const arrows = (node, lastValue) => `${node.name}${lastValue ? ` <- ${lastValue}` : ""}`;

    assertEquals(
        walkChainIdCall({
            startNode: b1,
            nodeList: [a1, b1],
            linkName: "parent",
            idName: "name",
            callback: arrows
        }),
        "a1 <- b1"
    );
});

Deno.test("merge properties by id", () => {
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
        parent: "a1",
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
        parent: "b1",
        data: {
            foo: {
                b: "c1",
                c: "c1",
                c1: "c1"
            },
            buz: "c1"
        }
    };

    assertEquals(
        walkChainIdMerge({
            startNode: c1,
            nodeList: [a1, b1, c1],
            linkName: "parent",
            idName: "name",
            mergeProperty: "data",
            mergeFunction: shallowMerge
        }),
        {
            foo: { b: "c1", c: "c1", c1: "c1" },
            bar: "a1",
            baz: "b1",
            buz: "c1"
        }
    );
    assertEquals(
        walkChainIdMerge({
            startNode: c1,
            nodeList: [a1, b1, c1],
            linkName: "parent",
            idName: "name",
            mergeProperty: "data",
            mergeFunction: deepMerge
        }),
        {
            foo: { a: "b1", a1: "a1", b: "c1", b1: "b1", c: "c1", c1: "c1" },
            bar: "a1",
            baz: "b1",
            buz: "c1"
        }
    );
});

Deno.test("merge properties by id cyclic", () => {
    const a1 = {
        name: "a1",
        parent: "b1",
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
        parent: "a1",
        data: {
            foo: {
                a: "b1",
                b: "b1",
                b1: "b1"
            },
            baz: "b1"
        }
    };

    assertEquals(
        walkChainIdMerge({
            startNode: b1,
            nodeList: [a1, b1],
            linkName: "parent",
            idName: "name",
            mergeProperty: "data",
            mergeFunction: shallowMerge
        }),
        {
            foo: { a: "b1", b: "b1", b1: "b1" },
            bar: "a1",
            baz: "b1"
        }
    );
    assertEquals(
        walkChainIdMerge({
            startNode: b1,
            nodeList: [a1, b1],
            linkName: "parent",
            idName: "name",
            mergeProperty: "data",
            mergeFunction: deepMerge
        }),
        {
            foo: { a: "b1", a1: "a1", b: "b1", b1: "b1" },
            bar: "a1",
            baz: "b1"
        }
    );
});
