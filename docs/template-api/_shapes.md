---
title: Template Shapes
lang: en-US
---

# Shapes

## Shape

The `Shape` module provides numerous methods to create, modify and manage svg elements.
But for templates they are broken down to three methods of interest:

| Method                                       | Description                                                                      |
| -------------------------------------------- | -------------------------------------------------------------------------------- |
| `Shape.create(type)`                         | takes a string of the `type` and returns a new d3 selection of the given type    |
| `Shape.getBBox(selection)`                   | takes a d3 `selection` and returns the bounding box of the selection             |
| `Shape.transform(selection, centered, size)` | transforms the given `selection` to the given `size` and `centers` it if desired |

```js
const shape = Shape.create("g"); // returns a new svg g element
const bbox = Shape.getBBox(shape); // returns the bounding box of the shape
let centered = true;
Shape.transform(shape, centered, 300); // centers the shape and scales it to 300px
```

## Path Shape

The `PathShape` method takes a svg path code and returns a newly created d3 selection of a svg path element.
It gets especially useful to create more complex paths.

```js
// siluette of a house
const shape = PathShape("M 100 0 L 200 100 L 200 200 L 0 200 L 0 100 Z");
```

## SVG Shape

The `SVGShape` behaves similar to the [PathShape](#path-shape) method but it accepts a whole svg code as parameter and returns a d3 selection of the created svg element.

::: tip
It is most useful to create complex svg shapes – especially if it is an export from a vector graphic tool.
:::

```js
// siluette of a house with a check ♢ symbol in the middle
const shape = SVGShape(`
	<g>
		<path d="M 100 0 L 200 100 L 200 200 L 0 200 L 0 100 Z" />
		<path d="M 100 0 L 200 100 L 200 200 L 0 200 L 0 100 Z" />
	</g>
`);
```

## Tag Shape

The `TagShape` method builds a tag and returns a d3 selection of the created svg element.
It takes 2 parameters to output tag shape.

| Parameter  | Type                                         | Description                       |
| ---------- | -------------------------------------------- | --------------------------------- |
| `text`     | string                                       | text to be display as tag         |
| `TagStyle` | [TagStyle](/template-api/_styling#tag-style) | determines the styling of the tag |

::: info
This method is primarily used within the [TagCollection](/template-api/collections#tag-collection) module.
:::

```js
const tag = TagShape("Hello World", TagStyle(...));
```

## Text Shape

The `TextShape` method builds a text and returns a d3 selection of the created svg element.
It works similar to the [TagShape](#tag-shape) and takes 2 parameters to output text shape.

| Parameter      | Type                                             | Description                           |
| -------------- | ------------------------------------------------ | ------------------------------------- |
| `text`         | string                                           | text to be display as text element    |
| `ShapeStyle[]` | [ShapeStyle](/template-api/_styling#shape-style) | determines the styling of the element |

::: info
This method is primarily used within the [TextCollection](/template-api/collections#text-collection) module.
:::

```js
const text = TextShape("Hello World", [ShapeStyle(...), ShapeStyle(...)]);
```
