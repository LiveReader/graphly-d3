---
title: Render Template
lang: en-US
---

# Render Template

::: warning available since version 1.5.0
:::

The `renderTemplate` method is a low level method that renders a template and returns `SVGElement` DOM nodes.
It is used internally by the [render](/simulation-api/environment#render) method but can also be used directly to render a template without a simulation.

## API

The `renderTemplate` method takes 3 arguments:

-   `template` - the template to render
-   `data` - the node data to populate the template with
-   `config` - the configuration to use for rendering

::: info

The [`template`](/template-api/) and [`data`](/data-structure/node_data) types are the same as known from the simulation API.
The `config` type defines the context the template is to be rendered in and looks like this:

```ts
type RenderConfig = {
	theme: "light" | "dark";
	scale: number;
};
```

:::

## Usage

```html
<svg style="width: 100%; height: 100%"></svg>
```

```ts
import { renderTemplate } from "@livereader/graphly-d3";
import "@livereader/graphly-d3/style.css";
import MyTemplate from "./templates/myTemplate";
const render = await renderTemplate(
	MyTemplate,
	{
		id: "node1",
		shape: {
			type: "my-template",
			scale: 1,
		},
		payload: {
			title: "Hexagon",
			color: "#9575cd",
		},
	},
	{ theme: "light", scale: 1 }
);
document.getElementsByTagName("svg")[0]!.appendChild(render);
document.getElementsByTagName("svg")[0]!.setAttribute("transform", "translate(300, 300)");
```

## Showcase

<svg style="width: 100%; height: 100%"><g id="tpl-render"></g></svg>

::: info

This is the result of such a renderTemplate call used on the hexagon template.
It does not use any simulation.

:::

<script setup lang="ts">
import { onMounted } from "vue";
import { renderTemplate } from "@livereader/graphly-d3";
import "@livereader/graphly-d3/style.css";

onMounted(async () => {
	await import("https://cdn.graphly.dev/@jason-rietzke/demo-hexagon/1.0.0").then(async (template) => {
		const render = await renderTemplate(
			template.default,
			{
				id: "node1",
				shape: {
					type: "my-template",
					scale: 1,
				},
				payload: {
					title: "Hexagon",
					color: "#9575cd",
				},
			},
			{ theme: "light", scale: 1 }
		);
		const g = document.getElementById("tpl-render");
		document.getElementById("tpl-render")!.appendChild(render);
		document.getElementById("tpl-render")!.setAttribute("transform", "translate(60, 60)");
	})
})

</script>
