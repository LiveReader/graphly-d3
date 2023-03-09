---
title: Vue 3 Component
lang: en-US
---

# Vue 3 Component

Since verion `1.4.0` the Graphly D3 library merged the Vue 3 component into the main library which means that you can use the component without installing an additional package.

## How to use

Make sure you have `@livereader/graphly-d3` at least version `1.4.0` installed in your project and are using Vue 3.

```vue:line-numbers
<template>
	<GraphlyD3 ref="graphly" />
</template>

<script setup lang="ts">
import GraphlyD3 from "@livereader/graphly-d3/component/vue3";
import "@livereader/graphly-d3/style.css";
const graphly = ref(null);
</script>
```

With the `graphly` ref you can access the Graphly D3 ForceSimulation instance and use it to control the simulation in the same fashion as described in the rest of this documentation.  
We recommend using a `computed` property to access the `simulation` property of the `graphly` ref like this:

```vue:line-numbers
<template>
	<GraphlyD3 ref="graphly" />
</template>

<script setup lang="ts">
import { ForceSimulation, Graph } from "@livereader/graphly-d3"; // [!code ++]
import GraphlyD3 from "@livereader/graphly-d3/component/vue3";
import "@livereader/graphly-d3/style.css";
const graphly = ref(null);
const simulation = computed<ForceSimulation>(() => graphly.value.simulation); // [!code ++]
const graph: Graph = { nodes: [], links: [] }; // [!code ++]

onMounted(() => {								// [!code ++]
	const simulation = graphly.value.simulation;// [!code ++]
	simulation.render(graph);					// [!code ++]
});												// [!code ++]
</script>
```

::: tip
To learn more about the `simulation` take a look at the [Simulation API](/simulation-api/#setup) documentation.
:::
