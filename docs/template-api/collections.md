---
title: Collections
lang: en-US
---

# Collections

The `TemplateAPI` contains a number of useful modules to create collections of SVG shapes.

## Alignment

`Alignment` is an enum that defines alignments to easily pass as parameters.

```ts
enum Alignment {
	Left = "left",
	Center = "center",
	Right = "right",
}
```

## Break Line

The `BreakLine` type is a simple way to create a break line in a collection.  
It may get added using the `BreakLine()` function.

## Shape Collection

The `ShapeCollection` builds, places and styles a collection of shapes and returns the d3 selection of the created svg group.
It takes an array of d3 selection that represent the `shapes` to be displayed, requires a [CollectionStyle](/template-api/styling#collection-style) `style` object and takes an optional `ellipsis` parameter that defines a shape that should be displayed if there are more items than the collection cann't display.

This module tries to place the items according to the given `style` and stops if it exceeds the collection's boundaries.
If set it will render the ellipsis shape at the end of the collection to indicate that there are more items.

::: info
This module is primarily used within the [TagCollection](#tag-collection) and [TextCollection](#text-collection) modules and should only be directly used for special cases.
:::

```js
const ellipsis = TextShape("...", [ShapeStyle(...), ShapeStyle(...)]);
const collection = ShapeCollection(
	[shape1, shape2, shape3],
	CollectionStyle(...),
	ellipsis
)
```

## Tag Collection

The `TagCollection` builds ontop of the [ShapeCollection](#shape-collection) module to display a collection of tags.
It takes an string array `tags` as well as a [CollectionStyle](/template-api/styling#collection-style) and [TagStyle](/template-api/styling#tag-style) objects.
It returns the d3 selection of the created collection.

```js
const tags = TagCollection(["tag1", "tag2", "tag3"], CollectionStyle(...), TagStyle(...));
```

## Text Collection

The `TextCollection` builds ontop of the [ShapeCollection](#shape-collection) module to display a collection of text.
It takes a `text` string which gets split into each word to wrap it into each line if the end of line is reached.
Besides that it also requires a [CollectionStyle](/template-api/styling#collection-style) and an array of [ShapeStyle](/template-api/styling#shape-style) objects to style the text elements.
It returns the d3 selection of the created collection.

```js
const text = TextCollection("Hello World", CollectionStyle(...), [ShapeStyle(...), ShapeStyle(...)]);
```
