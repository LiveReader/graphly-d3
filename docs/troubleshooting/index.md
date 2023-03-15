---
title: Troubleshooting
lang: en-US
---

# Troubleshooting

Here are some common issues you may encounter when using Graphly D3 and how to address them.

## Template not found

::: warning ERROR

When a template is not found, Graphly D3 should render a default error shape instead of the template that looks like this:
![Template not found](/assets/troubleshooting/not-found-node.png)

Alongside the error shape, Graphly D3 will also log the error to the console.
![Template not found](/assets/troubleshooting/not-found.png)

:::

::: tip SOLUTION

The most common cause of this error is that the template was not added to the `templateStore` before the graph was rendered. To fix this, make sure that your templates are added like this:

```js
import { ForceSimulation } from "@livereader/graphly-d3";
import "@livereader/graphly-d3/style.css";
import DemoTemplate from "./templates/demo_template"; // [!code ++]

const simulation = new ForceSimulation();
simulation.value.templateStore.add("demo_template", DemoTemplate); // [!code ++]
simulation.render({
	nodes: [...],
	links: [...],
})
```

You might also check for typos in the template name and make sure the `shape` `type` in your graph data is spelled correctly.

#### Remote templates

When using remote templates, the error can occur if the template is not found at the specified URL.
Make sure that the URL is correct and that the template is accessible.
:::

## Template failed rendering

::: warning ERROR

When a template fails to render, Graphly D3 should render a default error shape instead of the template that looks like this:
![Template failed rendering](/assets/troubleshooting/failed-rendering-node.png)

Alongside the error shape, Graphly D3 will also log the error to the console.
![Template failed rendering](/assets/troubleshooting/failed-rendering.png)

:::

::: tip SOLUTION

Most of the time, this error is caused by a bug in the template code itself.

#### For template authors

When you are the author of the template, it is strongly recommended to tackle this issue and make sure that the template you are creating is robust and can manage falsey payloads.

#### For template users

If you are not the author and the template is working under normal circumstances, it is most commonly caused by a poor handling of the payload. You can try to figure out what payload is causing the error (sometimes by analyzing the error message) and try to avoid it in your graph data.

You can also try to get in touch with the template author and let them know about the issue.

:::

## Invalid payload

::: warning ERROR

When a template receives an invalid payload, Graphly D3 should render a default error shape instead of the template that looks like this:
![Invalid payload](/assets/troubleshooting/invalid-payload-node.png)

Alongside the error shape, Graphly D3 will also log the error to the console.
![Invalid payload](/assets/troubleshooting/invalid-payload.png)

:::

::: tip SOLUTION

This error is caused by the schema check that is performed on the payload before it is passed to the template
(assuming that the template has a [shape payload](/template-api/shape_payload) defined).

This is indicating that the payload you are passing to the template is not valid and does not meet the template's expectations.
You should make sure that your payload is matching the schema definition.

The error message should list all expected properties and their types.
For longer lists it is useful to check the error log in the console but you can get a first glance at the error by just taking a look at the rendered error shape.

:::
