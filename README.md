# LR Graphly-D3

Library ontop of D3.js for creating interactive graphs.
It uses a shape templating system to dynamically define and use differend SVG shapes.

### ForceSimulation

To interact with the library, it provides a highlevel API of the force simulation.

```js
import { ForceSimulation } from "lr-graphly-d3";

const graphData = {
	nodes: [],
	links: [],
};
const svg = d3.select("svg");
simulation = new ForceSimulation(svg);
simulation.render(graphData);
```

### Events

This interface also provides several event handler.

#### On New Edge

```js
simulation.onNewEdge((source, target) => {
	// source and target provide the reguarding node data objects
	// they can be used to create a new edge
	// and render the simulation
});
```

#### On Node Click

```js
simulation.onClick((e, d) => {
	// e carries the event data
	// d provides the data object of the clicked node
});
```

#### On Node Context Menu

```js
simulation.onContextClick((e, d) => {
	// e carries the event data
	// d provides the data object of the clicked node
});
```

#### On Node Mouse Over / Out

```js
simulation.onMouseOver((e, d) => {
	// e carries the event data
	// d provides the data object of the clicked node
});
simulation.onMouseOut((e, d) => {
	// e carries the event data
	// d provides the data object of the clicked node
});
```

#### On Background Click

```js
simulation.onBackground((e, d) => {
	// e carries the event data
	// d provides the data object of the clicked node
});
```
