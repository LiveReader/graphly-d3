# Graphly D3

<p align="center">
  <img src="./assets/graphly-d3-icon-dark-round.svg#gh-dark-mode-only" width="30%">
  <img src="./assets/graphly-d3-icon-light-round.svg#gh-light-mode-only" width="30%">
</p>

## A Graph Visualization Library

Graphly D3 is an open source frontend library for creating conplex and interactive graph visualizations.
It is built on top of [D3.js](https://d3js.org/) and empowers developers to use svg to display any data in a simple and intuitive way.

This is accomplished by providing a shape template system that allows to develop any required node visualization and simply using it by refering to it in the input graph data.

Check out the full [documentation](https://graphly-d3.livereader.com) for more information and examples.

## Getting Started

To use Graphly D3 in your project, you need to install the package.

```shell
npm install @livereader/graphly-d3
```

To use the `ForceSimulation` your DOM needs to have a `<svg>` element you can pass as `d3 selection` to the constructor.

The `ForceSimulation` needs to know where to load the templates from. This can be specified with the `setTemplateOrigin()` method.

To render a graph you need to pass a `graph` object to the `render()` method.

```html
<!-- index.html -->
<html>
    <head></head>
    <body>
        <svg id="mySVG"></svg>
        <style>
            #mySVG {
                width: 100%;
                height: 100%;
            }
        </style>
        <script src="./app.js"></script>
    </body>
</html>
```

```js
// app.js
import { ForceSimulation } from "@livereader/graphly-d3";
import * as d3 from "d3";

const svg = d3.select("#mySVG");
const simulation = new ForceSimulation(svg);
simulation.setTemplateOrigin("http://" + document.location.host + "/templates/");

const graph = {
    nodes: [
        {
            id: "node1",
            shape: {
                type: "myShape",
                scale: 1,
            },
            x: -150,
            y: 30,
        },
        {
            id: "node2",
            shape: {
                type: "myShape",
                scale: 1,
            },
            x: 150,
            y: -30,
        },
    ],
    links: [
        {
            source: "node1",
            target: "node2",
            type: "solid",
            directed: true,
            label: "",
            strength: "weak",
        },
    ],
};
simulation.render(graph);
```

```js
// templates/myShape.js
hexagon.shapeSize = 120;
function hexagon(data, initialShape, changes, Template) {
    const { Shape, SVGShape } = Template;

    const shape = initialShape
                    ? initialShape
                    : SVGShape(`
        <g transform="matrix(1,0,0,1,-101.915,-40.1924)">
            <g transform="matrix(8.33117e-17,-1.36058,1.36058,8.33117e-17,9.05891,870.52)">
                <path d="M384.617,88.155C406.11,75.826 432.531,75.826 454.023,88.155C488.394,107.873 540.748,137.906 575.236,157.69C596.908,170.123 610.273,193.199 610.273,218.184L610.273,356.483C610.273,381.468 596.908,404.544 575.236,416.977C540.748,436.761 488.394,466.794 454.023,486.512C432.531,498.841 406.11,498.841 384.617,486.512C350.246,466.794 297.892,436.761 263.405,416.977C241.733,404.544 228.367,381.468 228.367,356.483L228.367,218.184C228.367,193.199 241.733,170.123 263.405,157.69C297.892,137.906 350.246,107.873 384.617,88.155Z" style="fill: #9575CD;" />
            </g>
        </g>
    `);

    Shape.transform(shape, true, data.shape.scale * hexagon.shapeSize);
    return shape;
}
export default hexagon;
```

This setup should be enough to get you started and embed Graphly D3 into your project.

## Preview

This should result in something like this:

![](./assets/graphly-d3-preview-dark.png#gh-dark-mode-only)
![](./assets/graphly-d3-preview-light.png#gh-light-mode-only)

## Tooling

The Graphly D3 library is built with JavaScript (typing is comming soon) and [Vite](https://vitejs.dev).  
The library is available as [npm package](https://www.npmjs.com/package/@livereader/graphly-d3).
