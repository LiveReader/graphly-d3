---
title: Template Styling
lang: en-US
---

# Styling

## Shape Style

The `ShapeStyle` method is meant to apply certain styles to any shape.
It can be passed as a modifier within shape definitions.
The parameters get restructured and passed on.  
The method requires three parameters.

| Parameter | Type    | Description                       |
| --------- | ------- | --------------------------------- |
| key       | string  | the key of the style to apply     |
| value     | any     | the value of the style to apply   |
| condition | boolean | whether to apply the style or not |

It sets the fiven value to the style key attribute if the condition is truthy.

```js
// adds the css class "warning" to the shape if the data.warning property is truthy
ShapeStyle("class", "warning", data.warning);

// always sets the font weight to 600
ShapeStyle("font-weight", "600", true);
```

::: tip
`ShapeStyle` also supports class chaining. This means if the key is "class" and it should modify the applied css classes, it can apply multiple classes (with the same condition) by chaining them with a ".".

```js
ShapeStyle("class", "warning.important.dark_text", true);
```

This would always apply the css classes "warning", "important" and "dark_text"
:::

## Tag Style

The `TagStyle` is a wrapper method to pass the strucutred parameters to the [TagShape](/template-api/_shapes#tag-shape) module.
It takes several parameters to style the tag it is used on.

| Parameter        | Type                                               | Description                                           |
| ---------------- | -------------------------------------------------- | ----------------------------------------------------- |
| padding          | Number[]                                           | padding of tags along the x and y axis                |
| textStypes       | [ShapeStyle](/template-api/_styling#shape-style)[] | array of shape styles to be applied to the text       |
| backgroundStyles | [ShapeStyle](/template-api/_styling#shape-style)[] | array of shape styles to be applied to the background |
| cornerRadius     | Number                                             | corner radius of the tag                              |

```js
// Tag with a x-padding of 20px and y-padding of 30px
// applied text style from the "tag-text" css class and a font-size of 24px
// applied background style to be red
// and 15px rounded corners
TagStyle(
	[20, 30],
	[ShapeStyle("class", "tag-text", true), ShapeStyle("font-size", "24px", true)],
	[ShapeStyle("fill", "red", true)],
	15
);
```

## Collection Style

The `CollectionStyle` method is a wrapper to structure and pass the parameters to a [ShapeCollection](/template-api/collections#shape-collection) module.
It takes numerous parameters to style any collection of shapes.

| Parameter  | Type                                             | Description                                              |
| ---------- | ------------------------------------------------ | -------------------------------------------------------- |
| height     | Number                                           | height of the collection                                 |
| width      | Number                                           | width of the collection                                  |
| x          | Number                                           | x position of the collection (relative to the container) |
| y          | Number                                           | y position of the collection (relative to the container) |
| dx         | Number                                           | x spacing between subshapes                              |
| dy         | Number                                           | y spacing between subshapes                              |
| rowCount   | Number                                           | number of rows in the collection                         |
| align      | [Alignment](/template-api/collections#alignment) | item alignment (left, center, right)                     |
| rowMargins | Number[]                                         | optional horizontal margins for each row                 |

```js
CollectionStyle(
	100, // 100px heigh
	300, // 300px wide
	0, // 0px from the left
	30, // 30px from the top
	10, // 10px horizontal space between each item
	10, // 10px vertical space between each item
	2, // 2 rows of items are possible
	Alignment.Center, // items are centered
	[30, 60] // the first row has 30px horizontal margin and the second 60px
);
```
