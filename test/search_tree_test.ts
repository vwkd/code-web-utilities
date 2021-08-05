import { searchTree } from "../src/search_tree.ts";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

Deno.test("search tree", () => {
  const t1 = {
    id: 1,
    children: [
      {
        id: 11,
        children: [
          {
            id: 111,
          },
          {
            id: 112,
          },
        ],
      },
      {
        id: 12,
        children: [],
      },
    ],
  };

  const o1 = searchTree(t1, "id", 112, "children");
  assertEquals(o1, {
    id: 112,
  });

  const o2 = searchTree(t1, "id", 12, "children");
  assertEquals(o2, {
    id: 12,
    children: []
  });
});