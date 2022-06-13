---
title: Template API
lang: en-US
---

# Introduction

Graphly D3 works by developing templates that are used to render the data for each node. Templates can be imported from any source.
Those imports are dynamically done on demand to allow high flexibility combined with minimal load times.

The template API exposes a number of methods and modules to help creating the SVG shape templates for Graphly D3.
They are following a functional paradigm and can be used as a building block to create complex and highly performant svg representations.  
More detailed information can be found on the next pages.

## Setup

To use templates the corosponding origin needs to be set. This can be done by calling the `.setTemplateOrigin()` method on the `ForceSimulation` instance.
By doing so, all shape types refered in the input data will be tried to be imported from the given origin.

::: tip
The easiest location for the templates to begin with is within the project itself. E.g. in a vue project a templates folder within the public directory could be refered to.
:::

## Template File

Each template should be a dedicated `.js` file that exports a function.
This function will be called in the render process of Graphly to create the proper SVG element.
The file needs to be called the same as the shape type which is used to refer to it.

Lets take a look at a fundamental file structure needed to create a template. There are a few requirements to be met:

```js
someShape.shapeSize = 300;
function someShape(data, initialShape, changes, Template) {
	// data 			delivers the data from the input graph data regarding the current node.
	// initialShape 	the initial shape of the node if it is already rendered.
	// changes 			the changes that occured on the node data since the last render.
	// Template 		the template API injection to draw all the modules and modifiers from.
	const shape = Template.Shape.create("g");
	return shape;
}
export default someShape;
```

## Properties

Any template has to have the `shapeSize` property which defined the default render size of the shape.
The function itself takes 4 parameters and returns a d3 selection of the shape.
This file gets handled as a module and has to default export the shape function accordingly.

| Property     | Description                                                                                                                                                                     |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| data         | passes the data from the input graph data regarding the current node. This grants access to the properties of the node which define the content it is supposed to display       |
| initialShape | is the initial shape of the node if it is already rendered. This gives the opportunity to reuse the shape and only re-render those parts effected by data changes               |
| changes      | is a subset of the data object that contains only the changed properties. This in conjunction with the initial shape provides a powerful way to get the most out of a template  |
| Template     | passes the template API module from which all methods, modules and modifiers can be drawn from. Which components are available gets described in the next section               |

::: info IMPORTANT
The template should have at least one element (often some body element that defines the outer shape) classed with `selectable`.
This way Graphly D3 cares about the proper highlighting of the nodes.

```js
const body = shape.select("#body");
body.classed("selectable", true);
```

More about how to tell graphly which nodes are selected can be found [here]()
:::
