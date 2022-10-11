import{_ as s,o as e,c as a,a as n}from"./app.da702cb0.js";const A=JSON.parse('{"title":"Events","description":"","frontmatter":{"title":"Events","lang":"en-US"},"headers":[{"level":2,"title":"On Zoom","slug":"on-zoom","link":"#on-zoom","children":[]},{"level":2,"title":"Emit Event","slug":"emit-event","link":"#emit-event","children":[]}],"relativePath":"template-api/events.md","lastUpdated":1665507026000}'),o={name:"template-api/events.md"},t=n(`<h1 id="events" tabindex="-1">Events <a class="header-anchor" href="#events" aria-hidden="true">#</a></h1><p>The <code>TemplateAPI</code> even contains a few methods to handle events.</p><h2 id="on-zoom" tabindex="-1">On Zoom <a class="header-anchor" href="#on-zoom" aria-hidden="true">#</a></h2><p>The <code>OnZoom</code> method registers a callback function within the force simulation&#39;s <code>zoom event</code>. It fires when the given threshold is passed and applies the <a href="/template-api/styling.html#lod-style">level of detail styles</a> accordingly.</p><div class="info custom-block"><p class="custom-block-title">INFO</p><p>The threshold is internally tuned to match the relative scale between the global zoom factor and the schape&#39;s scale factor.</p></div><div class="language-js"><button class="copy"></button><span class="lang">js</span><pre><code><span class="line"><span style="color:#82AAFF;">OnZoom</span><span style="color:#A6ACCD;">(data</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">0.6</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> [</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#82AAFF;">LODStyle</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">...</span><span style="color:#A6ACCD;">)</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#82AAFF;">LODStyle</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">...</span><span style="color:#A6ACCD;">)</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">])</span></span>
<span class="line"></span></code></pre></div><h2 id="emit-event" tabindex="-1">Emit Event <a class="header-anchor" href="#emit-event" aria-hidden="true">#</a></h2><p>The <code>EmitEvent</code> method emits an event with the given name and data. It can be listened to by the <code>ForceSimulation</code> <code>on()</code> method as described in the <a href="/simulation-api/event_api.html#custom-template-events">Event API</a>. It requires the events <code>identifier</code>, the node <code>data</code> object and the <code>event</code> data. Any further data can be added by the template author.</p><div class="language-js"><button class="copy"></button><span class="lang">js</span><pre><code><span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> btn </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> d3</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">select</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">#btn</span><span style="color:#89DDFF;">&quot;</span><span style="color:#A6ACCD;">)</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#A6ACCD;">btn</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">on</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">click</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;">e</span><span style="color:#89DDFF;">)</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">	</span><span style="color:#82AAFF;">EmitEvent</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">btn-click</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">data</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">e</span><span style="color:#F07178;">)</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;">)</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span></code></pre></div>`,9),l=[t];function p(c,r,i,d,D,y){return e(),a("div",null,l)}const h=s(o,[["render",p]]);export{A as __pageData,h as default};
