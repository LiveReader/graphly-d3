---
title: Link Data
lang: en-US
---

# Link Data

The original `link` properties are only required by d3 to calculate the respective forces that are applied to the nodes.
Graphly D3 extends this data structure with properties to further describe appearance and force behavior of any link.

::: info
Links are rendered as a clockwise curved line from the `source` and `target` node.
If there are multiple links between two nodes, the curvature of the line is incremented for each additional link.
:::

::: details Example
A simple example for a link object with all possible properties. Check the sub-sections for more details.

```js
const link = {
	source: "node1",
	target: "node2",
	type: "solid",
	directed: true,
	label: "links to",
	strength: "strong",
	padding: 10,
};
```

:::

---

**Table of Contents**

[[toc]]

---

## Source & Target

The `source` and `target` properties are strings containing the `id` of the respective node this link connects.

::: info
Both properties are from the vanilla d3 data structure and get transformed to references to the respective node objects.
:::

```js
const link = {
	source: "node1",
	target: "node2",
};
```

## Type

The link `type` property defines the appearance of the link. It takes a string value and can be one of the following:

-   `solid`: A solid path with rounded ends.
-   `dashed`: A dashed path.
-   `dotted`: A dotted path.
-   `hidden`: The entire link is invisible. (including the label and arrow)

::: info
If not set or specified with a falsy value, the `solid` type is used as fallback.
:::

```js
const link = {
	type: "solid",
};
```

## Directed

The link `directed` property takes a boolean value and defines whether the link represents a directed relationship.
Default is `false`. If `true`, an arrow gets drawn at the tail of the line, directed towards the `target` node.

```js
const link = {
	directed: true,
};
```

## Label

The link `label` property is optional and takes a string value that can be used to display a label at the center of the link.
The text position takes the curvature of the line into account to be placed at the correct position.

```js
const link = {
	label: "links to",
};
```

## Strength

The link `strength` property is used to control the force that the link applies to its nodes.
It can be a numeric value to define the strength or one of the following predefinitions as string value:

-   `strong`: Predefinition for the strength `0.5`.
-   `weak`: Predefinition for the strength `0.3`.
-   `loose`: Predefinition for the strength `0`.

::: info
If not set or specified with a falsy value, the `weak` strength is used as default.  
Negative values drive the nodes apart and positive values pull the nodes towards each other.
`loose` or `0` will not apply any force to the nodes.
:::

```js
const link = {
	strength: "strong",
};
```

## Padding

The link `padding` property is an optional number value that defines the space between the link and the nodes it connects.
The default value is `10`.

::: tip
This can be handy to fine-tune the appearance of your graph.
Otherwise, the default value will suffice and you can just ignore it.
:::

```js
const link = {
	padding: 10,
};
```
