---
title: Events
lang: en-US
---

# Events

The `TemplateAPI` even contains a few methods to handle events.

## On Zoom

The `OnZoom` method registers a callback function within the force simulation's `zoom event`.
It fires when the given threshold is passed and applies the [level of detail styles](/template-api/styling#lod-style) accordingly.

::: info
The threshold is internally tuned to match the relative scale between the global zoom factor and the schape's scale factor.
:::

```js
OnZoom(data, 0.6, [
	LODStyle(...),
	LODStyle(...),
])
```

::: tip
It is also possible to pass and array of thresholds to the `OnZoom` method to easily create multiple LOD steps.


```js
OnZoom(data, [0.6, 0.8], [
	LODStyle(...),
	LODStyle(...),
	LODStyle(...),
])
```

::: warning
this feature is only available in verion 1.2.0 and above
:::

## Emit Event

The `EmitEvent` method emits an event with the given name and data. It can be listened to by the `ForceSimulation` `on()` method as described in the [Event API](/simulation-api/event_api#custom-template-events).
It requires the events `identifier`, the node `data` object and the `event` data. Any further data can be added by the template author.

```js
const btn = d3.select("#btn");
btn.on("click", (e) => {
	EmitEvent("btn-click", data, e);
});
```
