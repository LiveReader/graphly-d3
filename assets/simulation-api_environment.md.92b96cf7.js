import{_ as e,o as s,c as a,a as n}from"./app.da702cb0.js";const u=JSON.parse('{"title":"Environment","description":"","frontmatter":{"title":"Environment","lang":"en-US"},"headers":[{"level":2,"title":"SVG Element","slug":"svg-element","link":"#svg-element","children":[]},{"level":2,"title":"Render","slug":"render","link":"#render","children":[]},{"level":2,"title":"Template Store","slug":"template-store","link":"#template-store","children":[{"level":3,"title":"Remote Origin","slug":"remote-origin","link":"#remote-origin","children":[]},{"level":3,"title":"Add Template","slug":"add-template","link":"#add-template","children":[]}]},{"level":2,"title":"Export Graph","slug":"export-graph","link":"#export-graph","children":[]},{"level":2,"title":"Selected Nodes","slug":"selected-nodes","link":"#selected-nodes","children":[]},{"level":2,"title":"Env Gravity","slug":"env-gravity","link":"#env-gravity","children":[]},{"level":2,"title":"Link Distance","slug":"link-distance","link":"#link-distance","children":[]},{"level":2,"title":"Animation Duration","slug":"animation-duration","link":"#animation-duration","children":[]},{"level":2,"title":"Draggable Nodes","slug":"draggable-nodes","link":"#draggable-nodes","children":[]},{"level":2,"title":"Debug","slug":"debug","link":"#debug","children":[]}],"relativePath":"simulation-api/environment.md","lastUpdated":1665507026000}'),o={name:"simulation-api/environment.md"},t=n(`<h1 id="environment" tabindex="-1">Environment <a class="header-anchor" href="#environment" aria-hidden="true">#</a></h1><p>The <code>ForceSimulation</code> class provides a number of methods for setting up and manipulating the environment.</p><h2 id="svg-element" tabindex="-1">SVG Element <a class="header-anchor" href="#svg-element" aria-hidden="true">#</a></h2><p>The <code>ForceSimulation</code> class requires a <code>&lt;svg&gt;</code> element as constructor input to render the graph. But it also exposes the <code>svgElement</code> member which allows you to change the SVG element later which will automatically re-render the graph with the new SVG element.</p><div class="language-ts"><button class="copy"></button><span class="lang">ts</span><pre><code><span class="line"><span style="color:#A6ACCD;">simulation</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">svgElement </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> document</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">getElementById</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">myNewSVG</span><span style="color:#89DDFF;">&quot;</span><span style="color:#A6ACCD;">)</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span></code></pre></div><h2 id="render" tabindex="-1">Render <a class="header-anchor" href="#render" aria-hidden="true">#</a></h2><p>The <code>ForceSimulation</code>s <code>render()</code> method is called to render the given graph input in the SVG element. The render method also takes two optional arguments: the <code>alpha</code> value that represents the initial simulation alpha and the <code>forced</code> flag that can be set to <code>true</code> to force the whole graph to be re-rendered.</p><table><thead><tr><th>Property</th><th>Type</th><th>Description</th></tr></thead><tbody><tr><td>graph</td><td>Graph</td><td>the graph data to render (contains nodes and links)</td></tr><tr><td>alpha?</td><td>number</td><td>the alpha value to use for the simulation (<code>0.05</code> by default)</td></tr><tr><td>forced?</td><td>boolean</td><td>if set to <code>true</code> the whole graph will be re-rendered</td></tr></tbody></table><div class="language-ts"><button class="copy"></button><span class="lang">ts</span><pre><code><span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> graph </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#F07178;">nodes</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> [</span><span style="color:#89DDFF;">...</span><span style="color:#A6ACCD;">]</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#F07178;">links</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> [</span><span style="color:#89DDFF;">...</span><span style="color:#A6ACCD;">]</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#A6ACCD;">simulation</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">render</span><span style="color:#A6ACCD;">(graph)</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span></code></pre></div><div class="warning custom-block"><p class="custom-block-title">WARNING</p><div class="language-ts"><button class="copy"></button><span class="lang">ts</span><pre><code><span class="line"><span style="color:#A6ACCD;">simulation</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">render</span><span style="color:#A6ACCD;">(graph</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">0.05</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#FF9CAC;">true</span><span style="color:#A6ACCD;">)</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span></code></pre></div><p>The <code>forced</code> flag is only to be used if you have reason to believe that the automatic data-change detection did not work as intended. Besides that, it would harm the optimized performance of the simulation.</p></div><h2 id="template-store" tabindex="-1">Template Store <a class="header-anchor" href="#template-store" aria-hidden="true">#</a></h2><p>The <code>ForceSimulation</code> class contains and exposes the <code>templateStore</code> module which is used to store the shape templates that are used to render the nodes. This module contains two functionalities that are interesting for you.</p><h3 id="remote-origin" tabindex="-1">Remote Origin <a class="header-anchor" href="#remote-origin" aria-hidden="true">#</a></h3><p>The <code>remoteOrigin</code> member of the <code>templateStore</code> module can be used to set the url from which the templates will be imported dynamically during the rendering process.</p><div class="language-ts"><button class="copy"></button><span class="lang">ts</span><pre><code><span class="line"><span style="color:#A6ACCD;">simulation</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">templateStore</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">remoteOrigin </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">https://distributed-template-server/</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span></code></pre></div><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>This is handy if you want to provite a remote template server from where you can manage your templates. That&#39;s especially useful if you have a large scale application.</p></div><h3 id="add-template" tabindex="-1">Add Template <a class="header-anchor" href="#add-template" aria-hidden="true">#</a></h3><p>The <code>add()</code> method of the <code>templateStore</code> module is used to add a template to the store under a given <code>type</code>.</p><div class="language-ts"><button class="copy"></button><span class="lang">ts</span><pre><code><span class="line"><span style="color:#89DDFF;">import</span><span style="color:#A6ACCD;"> MyTemplate </span><span style="color:#89DDFF;">from</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">./templates/myTemplate</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#A6ACCD;">simulation</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">templateStore</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">add</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">myTemplate</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> MyTemplate)</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span></code></pre></div><div class="info custom-block"><p class="custom-block-title">INFO</p><p>More about how to develop your own templates can be found in the <a href="/template-api/">Template API</a>.</p></div><h2 id="export-graph" tabindex="-1">Export Graph <a class="header-anchor" href="#export-graph" aria-hidden="true">#</a></h2><p>The <code>ForceSimulation</code> class provides a <code>exportGraph()</code> method that is strongly recommended to be used to get a version of the graph data that can be used for further processing by you.</p><div class="language-ts"><button class="copy"></button><span class="lang">ts</span><pre><code><span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> graph </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> simulation</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">exportGraph</span><span style="color:#A6ACCD;">()</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span></code></pre></div><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>This data object contains a cleaned version of the graph data that is used to render and process the graph data internally. It&#39;s strongly recommended to use this method to get a version of the graph that can be used further by you (e.g. for persisting it).</p></div><h2 id="selected-nodes" tabindex="-1">Selected Nodes <a class="header-anchor" href="#selected-nodes" aria-hidden="true">#</a></h2><p>The <code>ForceSimulation</code> class exposes a <code>selectedNodes</code> member that holds an array of the <code>ids</code> of all nodes that are currently to be rendered as selected.</p><div class="language-ts"><button class="copy"></button><span class="lang">ts</span><pre><code><span class="line"><span style="color:#A6ACCD;">simulation</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">selectedNodes </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> [</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">node1</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">node2</span><span style="color:#89DDFF;">&quot;</span><span style="color:#A6ACCD;">]</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span></code></pre></div><h2 id="env-gravity" tabindex="-1">Env Gravity <a class="header-anchor" href="#env-gravity" aria-hidden="true">#</a></h2><p>The <code>ForceSimulation</code> class exposes a <code>envGravity</code> setter that can be used to set the default gravitational force of nodes to be applied to each other. It is set to <code>-10000</code> by default.</p><div class="language-ts"><button class="copy"></button><span class="lang">ts</span><pre><code><span class="line"><span style="color:#A6ACCD;">simulation</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">envGravity </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">-</span><span style="color:#F78C6C;">5000</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span></code></pre></div><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>Usually a negative value to counteract the pulling force of links.</p></div><h2 id="link-distance" tabindex="-1">Link Distance <a class="header-anchor" href="#link-distance" aria-hidden="true">#</a></h2><p>The <code>ForceSimulation</code> class exposes a <code>linkDistance</code> setter that can be used to set the minimum distance all links strive to. The default value is <code>400</code>. The distance is measured from the center point of either node, so the node size has to be considered.</p><div class="language-ts"><button class="copy"></button><span class="lang">ts</span><pre><code><span class="line"><span style="color:#A6ACCD;">simulation</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">linkDistance </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">250</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span></code></pre></div><h2 id="animation-duration" tabindex="-1">Animation Duration <a class="header-anchor" href="#animation-duration" aria-hidden="true">#</a></h2><p>The <code>ForceSimulation</code> class exposes a <code>animationDuration</code> member that can be used to set the duration of the animation in milliseconds. The default value is <code>300</code>.</p><div class="language-ts"><button class="copy"></button><span class="lang">ts</span><pre><code><span class="line"><span style="color:#A6ACCD;">simulation</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">animationDuration </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">500</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span></code></pre></div><h2 id="draggable-nodes" tabindex="-1">Draggable Nodes <a class="header-anchor" href="#draggable-nodes" aria-hidden="true">#</a></h2><p>The <code>ForceSimulation</code> class exposes a <code>draggableNodes</code> member that can be used to set whether or not nodes can be dragged by the user. The default value is <code>true</code>.</p><div class="language-ts"><button class="copy"></button><span class="lang">ts</span><pre><code><span class="line"><span style="color:#A6ACCD;">simulation</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">draggableNodes </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#FF9CAC;">false</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span></code></pre></div><h2 id="debug" tabindex="-1">Debug <a class="header-anchor" href="#debug" aria-hidden="true">#</a></h2><div class="warning custom-block"><p class="custom-block-title">available since version 1.1.0</p></div><p>The <code>ForceSimulation</code> debug object can be used to enable certain additional debug features. It supports displaying the calculated <a href="/template-api/index.html#graphly-body"><code>gly-body</code></a> points of the nodes.</p><p>Just enable debug mode with <code>simulation.debug.enabled = true;</code></p><div class="language-js"><button class="copy"></button><span class="lang">js</span><pre><code><span class="line"><span style="color:#A6ACCD;">simulation</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">debug </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#F07178;">enabled</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FF9CAC;">false</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#F07178;">bodyPoints</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">		</span><span style="color:#F07178;">enabled</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#FF9CAC;">true</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">		</span><span style="color:#F07178;">color</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">#00ffff</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#89DDFF;">},</span></span>
<span class="line"><span style="color:#89DDFF;">};</span></span>
<span class="line"></span></code></pre></div><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>This is useful if you want to check if the template is configured correctly to support the <a href="/template-api/index.html#graphly-body"><code>gly-body</code></a> feature.</p></div>`,46),l=[t];function p(c,r,d,i,h,D){return s(),a("div",null,l)}const F=e(o,[["render",p]]);export{u as __pageData,F as default};
