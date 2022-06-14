---
title: Template Styles
lang: en-US
---

# Template Styles

Graphly D3 brings a number of css styles out of the box to style the templates and shapes.
This does also work well with the native light and dark mode.

## Dark mode

The dark mode of Graphly D3 is applied if the containing `<svg>` element has the class `dark`.

```html
<svg class="dark">...</svg>
```

## Utilities

Graphly D3 also provides a few utility classes that can be handy when styling the template.

-   `.gly_animated` gives the element an transition proeprty to animate the style changes
-   `.noselect` prevents the element from being selected
-   `.hidden` sets the element opacity to 0

## Texts

The `.gly_text` class applies a consistent style to all text elements.
It can also be paired with the classes:

-   `.light` for light text
-   `.dark` for dark text
-   `.white` for white text
-   `.black` for black text

The special behavior of `.light` and `.dark` is that they are swapped if the dark mode is applied while `.white` and `.black` stay consistent.

## Color Palette

Graphly D3 also provides ten different colors in multiple shades to use in your templates.
Each base color also has corrosponding classes for `fill` and `stroke` – `.gly_<color>_fill` and `.gly_<color>_stroke`.
Those classes can be paired with `.lighten` and `.darken` to access the light and dark shades of the color.

<ColorPaletteTable :palettes="[teal, lime, green]" />
<ColorPaletteTable :palettes="[red, magenta, orange]" />
<ColorPaletteTable :palettes="[blue, purple, gray]" />
<ColorPaletteTable :palettes="[black, white]" />

<script setup>
import ColorPaletteTable from "../components/ColorPaletteTable.vue";
const teal = {
	title: "teal",
	primaryColor: "#4db6ac",
	colors: [
		{
			color: "#b2dfdb",
			name: "#b2dfdb lighten",
		},
		{
			color: "#4db6ac",
			name: "#4db6ac gly-teal",
		},
		{
			color: "#00796b",
			textColor: "#eaeaea",
			name: "#00796b darken",
		},
	]
}

const lime = {
	title: "lime",
	primaryColor: "#dce775",
	colors: [
		{
			color: "#f0f4c3",
			name: "#f0f4c3 lighten",
		},
		{
			color: "#dce775",
			name: "#dce775 gly-lime",
		},
		{
			color: "#afb42b",
			textColor: "#eaeaea",
			name: "#afb42b darken",
		},
	]
}

const green = {
	title: "green",
	primaryColor: "#81c784",
	colors: [
		{
			color: "#c8e6c9",
			name: "#c8e6c9 lighten",
		},
		{
			color: "#81c784",
			name: "#81c784 gly-green",
		},
		{
			color: "#388e3c",
			textColor: "#eaeaea",
			name: "#388e3c darken",
		},
	]
}

const red = {
	title: "red",
	primaryColor: "#e57373",
	colors: [
		{
			color: "#ffcdd2",
			name: "#ffcdd2 lighten",
		},
		{
			color: "#e57373",
			name: "#e57373 gly-red",
		},
		{
			color: "#d32f2f",
			textColor: "#eaeaea",
			name: "#d32f2f darken",
		},
	]
}

const magenta = {
	title: "magenta",
	primaryColor: "#f06292",
	colors: [
		{
			color: "#f8bbd0",
			name: "#f8bbd0 lighten",
		},
		{
			color: "#f06292",
			name: "#f06292 gly-magenta",
		},
		{
			color: "#c2185b",
			textColor: "#eaeaea",
			name: "#c2185b darken",
		},
	]
}

const orange = {
	title: "orange",
	primaryColor: "#ffb74d",
	colors: [
		{
			color: "#ffe0b2",
			name: "#ffe0b2 lighten",
		},
		{
			color: "#ffb74d",
			name: "#ffb74d gly-orange",
		},
		{
			color: "#f57c00",
			textColor: "#eaeaea",
			name: "#f57c00 darken",
		},
	]
}

const blue = {
	title: "blue",
	primaryColor: "#4fc3f7",
	colors: [
		{
			color: "#b3e5fc",
			name: "#b3e5fc lighten",
		},
		{
			color: "#4fc3f7",
			name: "#4fc3f7 gly-blue",
		},
		{
			color: "#1486c9",
			textColor: "#eaeaea",
			name: "#1486c9 darken",
		},
	]
}

const purple = {
	title: "purple",
	primaryColor: "#9575cd",
	colors: [
		{
			color: "#d1c4e9",
			name: "#d1c4e9 lighten",
		},
		{
			color: "#9575cd",
			name: "#9575cd gly-purple",
		},
		{
			color: "#4c3b8f",
			textColor: "#eaeaea",
			name: "#4c3b8f darken",
		},
	]
}

const gray = {
	title: "gray",
	primaryColor: "#a6a6a6",
	colors: [
		{
			color: "#e5e5e5",
			name: "#e5e5e5 lighten",
		},
		{
			color: "#a6a6a6",
			name: "#a6a6a6 gly-gray",
		},
		{
			color: "#595959",
			textColor: "#eaeaea",
			name: "#595959 darken",
		},
	]
}

const black = {
	title: "black",
	primaryColor: "#1a1a1a",
	colors: [
		{
			color: "#1a1a1a",
			textColor: "#eaeaea",
			name: "#1a1a1a gly-black",
		}
	]
}

const white = {
	title: "white",
	primaryColor: "#ffffff",
	colors: [
		{
			color: "#ffffff",
			name: "#ffffff gly-white",
		}
	]
}
</script>
