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

Each template file needs to `default export` a object with the `Template` definition.

-   `shapeSize` is the size of the shape on a scale of 1.
-   [`shapePayload`](/template-api/shape_payload) is a optional [ajv schema](https://ajv.js.org/) that can be used to define what the payload of the node should look like.
-   `shapeBuilder` is a function that returns a `SVGShape` selection that will be used to render the shape.

```ts
interface Template {
	shapeSize: number;
	shapePayload?: AJVSchema;
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
import { TemplateAPI, Node } from "@livereader/graphly-d3";
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

## Graphly Body

::: warning available since version 1.1.0
:::

By adding the class `gly-body` to an svg path element you can tell graphly that this element is the body of the node.
This element will be used to calculate a less accurate polygon shape for the node and uses it to calculate shape approaching
collisions and link positioning.

By default collision and link positioning is calculated by d3 as a circular shape with the diameter of the template `shapeSize` property.
(This continues to be the fallback method if the body points can not be calculated).

::: tip
Using the [bodyResolution](/data-structure/node_data#shape) property you can change how many points are calculated on the body path.
:::

![Gly Body](/assets/img/gly-body.png)

::: info
On the left side the `gly-body` class is set and on the right side the `gly-body` class is not set.
:::
