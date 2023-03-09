---
title: Vue 3 Component
lang: en-US
---

# Emitters

To make the component easier to work with there are a few `emitters` that wrap the `simulation` [Event API](/simulation-api/event_api.html#event-api).

## Available Emitters

| Emit                     | Description                                  | Reference                                                       |
| ------------------------ | -------------------------------------------- | --------------------------------------------------------------- |
| node-click               | user click on node shape                     | [Docs](/simulation-api/event_api.html#node-click)               |
| node-double-click        | user double click on node shape              | [Docs](/simulation-api/event_api.html#node-double-click)        |
| node-context-menu        | user right click on node shape               | [Docs](/simulation-api/event_api.html#node-context-menu)        |
| node-drag-start          | user started dragging a node shape           | [Docs](/simulation-api/event_api.html#node-drag-start)          |
| node-drag-move           | user dragging a node shape                   | [Docs](/simulation-api/event_api.html#node-drag-move)           |
| node-drag-end            | user released dragging a node shape          | [Docs](/simulation-api/event_api.html#node-drag-end)            |
|                          |                                              |                                                                 |
| link-click               | user click on link shape                     | [Docs](/simulation-api/event_api.html#link-click)               |
| link-double-click        | user double click on link shape              | [Docs](/simulation-api/event_api.html#link-double-click)        |
| link-context-menu        | user right click on link shape               | [Docs](/simulation-api/event_api.html#link-context-menu)        |
| link-drag-start          | user started dragging a link shape           | [Docs](/simulation-api/event_api.html#link-drag-start)          |
| link-drag-move           | user dragging a link shape                   | [Docs](/simulation-api/event_api.html#link-drag-move)           |
| link-drag-end            | user released dragging a link shape          | [Docs](/simulation-api/event_api.html#link-drag-end)            |
|                          |                                              |                                                                 |
| environment-click        | user click on svg background                 | [Docs](/simulation-api/event_api.html#environment-click)        |
| environment-double-click | user double click on svg background          | [Docs](/simulation-api/event_api.html#environment-double-click) |
| environment-context-menu | user right click on svg background           | [Docs](/simulation-api/event_api.html#environment-context-menu) |
| environment-move         | svg world moved by user or moveTo method     | [Docs](/simulation-api/event_api.html#environment-move)         |
|                          |                                              |                                                                 |
| simulation-tick          | simulation ticked one simulation step        | [Docs](/simulation-api/event_api.html#simulation-tick)          |
| simulation-tick-end      | simulation finished ticking simulation steps | [Docs](/simulation-api/event_api.html#simulation-tick-end)      |
| theme-change             | theme changed                                | [Docs](/simulation-api/event_api.html#theme-change)             |

## Example

```vue
<template>
	<GraphlyD3
		ref="graphly"
		@node-click="(e, d) => console.log(d.id)"
		@link-click="(e, d) => console.log(d.id)"
		@environment-click="(e, pos) => console.log(pos)"
		@theme-change="(theme) => console.log(theme)"
	/>
</template>
```
