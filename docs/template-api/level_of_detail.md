---
title: Template Level of Detail
lang: en-US
---

# Level of Detail

## On Zoom

The `OnZoom` method registers a callback function within the force simulation's `zoom event`.
It fires when the given threshold is passed and applies the [level of detail styles](#lod-style) accordingly.

::: info
The threshold is internally tuned to match the relative scale between the global zoom factor and the schape's scale factor.
:::

```js
OnZoom(data, 0.6, [
	LODStyle(...),
	LODStyle(...),
])
```

## LOD Style

The `LODStyle` (level of detail style) is a wrapper method to strucutre the parameters and pass them to be called by the [OnZoom](#on-zoom) event.
It takes similar parameters as the [ShapeStyle](/template-api/_styling#shape-style) method.
Required are `shape`, `key` and `condition`. It applies the fiven value to the shape's key attribute if the condition is met.
The condition receives the current zoom factor as parameter and expects a boolean whether to apply the style or not.

```js
// applies the css class hidden to the shape if the scale factor is below 0.6
LODStyle(shape, "class", "hidden", (k) => k < 0.6);
```

::: tip
Similar to [ShapeStyle](/template-api/_styling#shape-style) `LODStyle` supports class chaining.
This allows to apply multiple css classes to a shape at once with the same condition.

```js
LODStyle(shape, "class", "title.xl.dark_text", (k) => k < 0.6);
```

This applies the css classes "title", "xl" and "dark_text" to the shape if the zoom factor is below 0.6.
:::
