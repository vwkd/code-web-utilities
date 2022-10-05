import { deepFilter } from "../src/deep_filter.ts";
import { assertEquals } from "https://deno.land/std@0.103.0/testing/asserts.ts";

Deno.test("deep filter object", () => {
  const obj = {
    "a": "lorem",
    "b": "amet"
  };
  
  const key = "a";
  const value = "lorem";
  
  const result = deepFilter(obj, key.split("."), e => e === value);
  
  assertEquals(result, obj);
});

Deno.test("deep filter array", () => {
  const obj = [
    "lorem",
    "amet"
  ];
  
  const key = "";
  const value = "lorem";
  
  // beware: `"".split(".")` returns unexpected `[""]`!
  const result = deepFilter(obj, [], e => e === value);
  
  assertEquals(result, obj);
});

Deno.test("deep filter object array", () => {
  const obj = {
    "a": ["lorem", "ipsum"],
    "b": "amet"
  };
  
  const expectedResult = {
    "a": ["lorem"],
    "b": "amet"
  };
  
  const key = "a";
  const value = "lorem";
  
  const result = deepFilter(obj, key.split("."), e => e === value);
  
  assertEquals(result, expectedResult);
});

Deno.test("deep filter array object", () => {
  const obj = [
    {
      "a": "lorem",
      "b": "ipsum"
    },
    {
      "a": "dolor",
      "b": "sit"
    }
  ];
  
  const expectedResult = [
    {
      "a": "lorem",
      "b": "ipsum"
    }
  ];
  
  const key = "a";
  const value = "lorem";
  
  const result = deepFilter(obj, key.split("."), e => e === value);
  
  assertEquals(result, expectedResult);
});

Deno.test("deep filter object array object", () => {
  const obj = {
    "a": [
      {
        "b": "lorem",
        "c": "ipsum"
      },
      {
        "b": "dolor",
        "c": "sit"
      }
    ],
    "d": "amet"
  };
  
  const expectedResult = {
    "a": [
      {
        "b": "lorem",
        "c": "ipsum"
      }
    ],
    "d": "amet"
  };
  
  const key = "a.b";
  const value = "lorem";
  
  const result = deepFilter(obj, key.split("."), e => e === value);
  
  assertEquals(result, expectedResult);
});

Deno.test("deep filter object array object array", () => {
  const obj = {
    "a": [
      {
        "b": ["lorem", "ipsum"],
        "c": "amet"
      },
      {
        "b": ["dolor", "sit"],
        "c": "consectetur"
      }
    ],
    "d": "adipiscing"
  };
  
  const expectedResult = {
    "a": [
      {
        "b": ["lorem"],
        "c": "amet"
      }
    ],
    "d": "adipiscing"
  };
  
  const key = "a.b";
  const value = "lorem";
  
  const result = deepFilter(obj, key.split("."), e => e === value);
  
  assertEquals(result, expectedResult);
});