---
title: Template API
lang: en-US
---

# Introduction

Graphly D3 works by developing templates that are used to render the data for each node.

The template API exposes a number of methods and modules to help creating the SVG shape templates for Graphly D3.
They are following a functional paradigm and can be used as a building block to create complex and highly performant svg representations.  
More detailed information about the different modules can be found on the next pages.

## Setup

To use a template you need to add it to the [templateStore](/simulation-api/environment#template-store) with the corrosponding `type` name.
Alternatively you can also set a `remoteOrigin` to load the templates from dynamically. More about this in the [Simulation API](/simulation-api/environment#template-store)

```ts
import MyTemplate from "./templates/myTemplate";
simulation.templateStore.add("myTemplate", MyTemplate);
```

## Template File

Each template file needs to `default export` a object with the `Template` scema.

-   `shapeSize` is the size of the shape on a scale of 1.
-   `shapeBuilder` is a function that returns a `SVGShape` selection that will be used to render the shape.

```ts
interface Template {
	shapeSize: number;
	shapeBuilder: (data: Node, TemplateAPI: any) => d3.Selection<SVGElement, any, any, any>;
}
```

The `shapeBuilder` function will be called in the render process of Graphly to create the proper SVG element.

## Example Template

::: tip
If you use `typescript` we recommend to import the desired Template API modules from `@livereader/graphly-d3` and ignoring the `TemplateAPI` parameter.
This leads to a better developer experience and type safety.
:::

```js
// javascript
const myTemplate = {
	shapeSize: 300,
	shapeBuilder: shapeBuilder,
};
function shapeBuilder(data, TemplateAPI) {
	const shape = TemplateAPI.Shape.Circle(150);
	shape.classed("gly_teal_fill", true);
	shape.classed("gly-selectable", true);
	return shape;
}
export default myTemplate;
```

```ts
// typescript
import { TemplateAPI } from "@livereader/graphly-d3";
const myTemplate = {
	shapeSize: 300,
	shapeBuilder: shapeBuilder,
};
function shapeBuilder(data: Node) {
	const shape = TemplateAPI.Shape.Circle(150);
	shape.classed("gly_teal_fill", true);
	shape.classed("gly-selectable", true);
	return shape;
}
export default myTemplate;
```

::: tip IMPORTANT
The template should have at least one element (often some body element that defines the outer shape) classed with `gly-selectable`.
This way Graphly D3 cares about the proper highlighting of the nodes.

```js
const body = shape.select("#body");
body.classed("gly-selectable", true);
```

More about how to tell graphly which nodes are selected can be found [here](/simulation-api/environment#selected-nodes)
:::
