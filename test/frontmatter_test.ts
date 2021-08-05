import { parse } from "../src/frontmatter.ts";
import { parse as yaml } from "https://deno.land/std@0.74.0/encoding/yaml.ts";
import { assertEquals } from "https://deno.land/std@0.74.0/testing/asserts.ts";

Deno.test("yaml frontmatter", () => {
    const options = { delimiter: "---", parser: yaml };

    const y1 = `---
x: YAML
y: true
---
<h1>Hello world!</h1>`;

    const y1exp = { data: { x: "YAML", y: true }, content: "\n<h1>Hello world!</h1>" };
    assertEquals(parse(y1, options), y1exp);

    const y2 = `X---
x: YAML
y: true
---
<h1>Hello world!</h1>`;

    const y2exp = { data: {}, content: "" };
    assertEquals(parse(y2, options), y2exp);

    const y3 = `---X
x: YAML
y: true
---
<h1>Hello world!</h1>`;

    const y3exp = { data: {}, content: "" };
    assertEquals(parse(y3, options), y3exp);

    const y4 = `---
x: YAML
y: true
X---
<h1>Hello world!</h1>`;

    const y4exp = { data: {}, content: "" };
    assertEquals(parse(y4, options), y4exp);

    const y5 = `---
x: YAML
y: true
---X
<h1>Hello world!</h1>`;

    const y5exp = { data: {}, content: "" };
    assertEquals(parse(y5, options), y5exp);

    const y6 = `---
x: YAML
y: true
---
X<h1>Hello world!</h1>`;

    const y6exp = { data: { x: "YAML", y: true }, content: "\nX<h1>Hello world!</h1>" };
    assertEquals(parse(y6, options), y6exp);
});

Deno.test("json frontmatter", () => {
    const options = { delimiter: "---", parser: JSON.parse };

    const y1 = `---
{
    "x": "JSON",
    "y": true
}
---
<h1>Hello world!</h1>`;

    const y1exp = { data: { x: "JSON", y: true }, content: "\n<h1>Hello world!</h1>" };
    assertEquals(parse(y1, options), y1exp);
 
    const y2 = `X---
{
    "x": "JSON",
    "y": true
}
---
<h1>Hello world!</h1>`;

    const y2exp = { data: {}, content: "" };
    assertEquals(parse(y2, options), y2exp);

    const y3 = `---X
{
    "x": "JSON",
    "y": true
}
---
<h1>Hello world!</h1>`;

    const y3exp = { data: {}, content: "" };
    assertEquals(parse(y3, options), y3exp);

    const y4 = `---
{
    "x": "JSON",
    "y": true
}
X---
<h1>Hello world!</h1>`;

    const y4exp = { data: {}, content: "" };
    assertEquals(parse(y4, options), y4exp);

    const y5 = `---
{
    "x": "JSON",
    "y": true
}
---X
<h1>Hello world!</h1>`;

    const y5exp = { data: {}, content: "" };
    assertEquals(parse(y5, options), y5exp);

    const y6 = `---
{
    "x": "JSON",
    "y": true
}
---
X<h1>Hello world!</h1>`;

    const y6exp = { data: { x: "JSON", y: true }, content: "\nX<h1>Hello world!</h1>" };
    assertEquals(parse(y6, options), y6exp);
});
