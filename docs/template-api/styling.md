---
title: Styling
lang: en-US
---

# Styling

The `TemplateAPI` contains a number of useful modules to style the SVG shapes within the template.

## Shape Style

The `ShapeStyle` object is meant to apply certain styles to any shape.

```ts
interface ShapeStyle {
	key: string;
	value: string;
	condition: (() => boolean) | boolean;
}
```

The `ShapeStyle()` method can be passed as a modifier within shape definitions.

<!-- prettier-ignore -->
```ts
function ShapeStyle(
	key: string, 
	value: string, 
	condition?: (() => boolean) | boolean
): ShapeStyle;
```

| Parameter | Description                       |
| --------- | --------------------------------- |
| key       | the key of the style to apply     |
| value     | the value of the style to apply   |
| condition | whether to apply the style or not |

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

The `TagStyle` object contains the styling data to be applied on a [TagShape](/template-api/_shapes#tag-shape).

```ts
interface TagStyle {
	padding: {
		top: number;
		right: number;
		bottom: number;
		left: number;
	};
	textStyles: ShapeStyle[];
	backgroundStyles: ShapeStyle[];
	cornerRadius: number;
}
```

The `TagStyle()` method can be passed as a modifier within tag definitions and takes parameters to restrucutre them into a `TagStyle` object.

```ts
function TagStyle(
	padding: number | [number, number] | [number, number, number, number],
	textStyles: ShapeStyle[] = [],
	backgroundStyles: ShapeStyle[] = [],
	cornerRadius: number = 0
): TagStyle;
```

| Parameter        | Description                                                                |
| ---------------- | -------------------------------------------------------------------------- |
| padding          | padding of tags along all sides, height and width or all sides differently |
| textStypes       | array of [shape styles](#shape-style) to be applied to the text            |
| backgroundStyles | array of [shape styles](#shape-style) to be applied to the background      |
| cornerRadius     | corner radius of the tag                                                   |

```js
// Tag with a height-padding of 20px and width-padding of 30px
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

The `CollectionStyle` object contains the styling data to be applied on a [CollectionShape](/template-api/collections#shape-collection).

```ts
interface CollectionStyle {
	height: number;
	width: number;
	x: number;
	y: number;
	dx: number;
	dy: number;
	rowCount: number;
	align: Alignment;
	rowMargins: number[];
}
```

The `CollectionStyle()` method can be passed as a modifier within collection definitions and takes parameters directly.

```ts
function CollectionStyle(
	height: number,
	width: number,
	x: number,
	y: number,
	dx: number,
	dy: number,
	rowCount: number,
	align: Alignment = Alignment.Center,
	rowMargins: number[] = []
): CollectionStyle;
```

| Parameter  | Description                                              |
| ---------- | -------------------------------------------------------- |
| height     | height of the collection                                 |
| width      | width of the collection                                  |
| x          | x position of the collection (relative to the container) |
| y          | y position of the collection (relative to the container) |
| dx         | x spacing between subshapes                              |
| dy         | y spacing between subshapes                              |
| rowCount   | number of rows in the collection                         |
| align      | item alignment (left, center, right)                     |
| rowMargins | optional horizontal margins for each row                 |

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

## LOD Style

The `LODStyle`(Level of Detail) object contains the styling data to be applied by the [OnZoom](/template-api/events#on-zoom) event.

```ts
interface LODStyle {
	shape: d3.Selection<SVGElement, any, any, any>;
	key: string;
	value: string;
	condition: ((k: number) => boolean) | boolean;
}
```

The `LODStyle()` method can be passed as a modifier within LOD definitions and takes parameters directly.

```ts
function LODStyle(
	shape: d3.Selection<SVGElement, any, any, any>,
	key: string,
	value: string,
	condition?: ((k: number) => boolean) | boolean
): LODStyle;
```

| Parameter | Description                                                              |
| --------- | ------------------------------------------------------------------------ |
| shape     | the d3 selection of the shape the LOD is applied to                      |
| key       | the key of the style to apply                                            |
| value     | the value of the style to apply                                          |
| condition | whether to apply the style or not – It gets the scale (k) as a parameter |

```js
// applies the css class hidden to the shape if the scale factor is below 0.6
LODStyle(shape, "class", "hidden", (k) => k < 0.6);
```

::: tip
Similar to [ShapeStyle](#shape-style) `LODStyle` supports class chaining.
This allows to apply multiple css classes to a shape at once with the same condition.

```js
LODStyle(shape, "class", "title.xl.dark_text", (k) => k < 0.6);
```

This applies the css classes "title", "xl" and "dark_text" to the shape if the zoom factor is below 0.6.
:::

## Theme Style

::: warning available since version 1.4.0
:::

The `ThemeStyle` object is meant to by used in conjunction with the [`ShapeStyle`](#shape-style) object to apply certain styles to any shape based on the current theme.

```ts
export interface ThemeStyle {
	data: Node;
	lightValue: string;
	darkValue: string;
}
```

The `ThemeStyle()` method can be passed as a parameter to the `ShapeStyle()` `value` parameter and defines the values to be applied wheather the theme is `light` or `dark`.

<!-- prettier-ignore -->
```ts
function ThemeStyle(
	data: Node,
	lightValue: string,
	darkValue: string
): ThemeStyle;
```

| Parameter  | Description                       |
| ---------- | --------------------------------- |
| data       | the node data object of the shape |
| lightValue | the value to apply in light mode  |
| darkValue  | the value to apply in dark mode   |

```js
ShapeStyle("fill", ThemeStyle("white", "black"));
```

::: tip

For a more generic access to the current theme take a look at the [`OnThemeChange`](/template-api/events#on-theme-change) event hook.

:::

::: info EXAMPLE

This example shows a use case where custom colors are applied to the [`TextCollection`](/template-api/collections#text-collection) based on the current theme.

```js{3}
const someText = TextCollection("Hello World", CollectionStyle(0, 0, 200, 200, 20, 20, 1), [
	ShapeStyle("class", "gly_text", true),
	ShapeStyle("fill", ThemeStyle(data, "#00796b", "#b2dfdb")),
]);
```

:::

## Coloring Utilities

::: warning available since version 1.4.0
:::

Besides theme controlled coloring there are some use cases where certain coloring is dictated by some custom logic (e.g. the `payload` of a node).
Since elements like text should be easily readable the coloring should be determined by the background color.

The `TemplateAPI` now provides a few utility functions to help with this.

### Brightness

`brightness()` takes a color string and returns the brightness of the color as a number between 0 and 1.
The function expects a color string in the format `#rrggbb` or `rgb(r, g, b)`.

```js
const { brightness } = TemplateAPI;
brightness("#4db6ac"); // 0.5861372549019608
brightness("rgb(77, 182, 172)"); // 0.5861372549019608
```

### Is Light

`isLight()` is a wrapper around `brightness()` and returns `true` if the color is determined to be light and `false` if it is dark.

```js
const { isLight } = TemplateAPI;
isLight("#4db6ac"); // true
isLight("rgb(77, 182, 172)"); // true
```

### Is Dark

`isDark()` is a wrapper around `brightness()` and returns `true` if the color is determined to be dark and `false` if it is light.

```js
const { isDark } = TemplateAPI;
isDark("#4db6ac"); // false
isDark("rgb(77, 182, 172)"); // false
```

::: tip

Using these functions to determine what color to apply to a text element for instance can be done fairly easily and improves the template accessibility a lot.

:::
