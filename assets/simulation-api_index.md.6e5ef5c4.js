import{_ as s,o as a,c as n,a as e}from"./app.da702cb0.js";const h=JSON.parse('{"title":"Simulation API","description":"","frontmatter":{"title":"Simulation API","lang":"en-US"},"headers":[{"level":2,"title":"Setup","slug":"setup","link":"#setup","children":[]}],"relativePath":"simulation-api/index.md","lastUpdated":1665507026000}'),o={name:"simulation-api/index.md"},l=e(`<h1 id="introduction" tabindex="-1">Introduction <a class="header-anchor" href="#introduction" aria-hidden="true">#</a></h1><p>The <code>ForceSimulation</code> class is the heart of the force-directed graph simulation. It is responsible for rendering and updated the visualization of nodes and links. To achieve this, it uses d3&#39;s force-simulation under the hood and appends further features and an enhanced API.</p><p>More detailed infromation about the specific features are available on the following pages.</p><h2 id="setup" tabindex="-1">Setup <a class="header-anchor" href="#setup" aria-hidden="true">#</a></h2><p>To use the force simulation within a project you need to import the <code>ForceSimulation</code> class from <code>graphly-d3</code>. Instantiate a new <code>ForceSimulation</code> and pass it the <code>&lt;svg&gt;</code> DOM element you want to render the graph in.</p><p>You will also want to import the <code>style.css</code> from the <code>graphly-d3</code> package. This provides the necessary styles for the graph visualization.</p><p>To render a graph you need to call the <code>render()</code> method of the <code>ForceSimulation</code> instance and pass the graph object as an argument. The graph needs to meed the <a href="/data-structure/">required format</a> with nodes and links.</p><div class="language-js"><button class="copy"></button><span class="lang">js</span><pre><code><span class="line"><span style="color:#89DDFF;">import</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">ForceSimulation</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">from</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">@livereader/graphly-d3</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#89DDFF;">import</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">@livereader/graphly-d3/style.css</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> graph </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#F07178;">nodes</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> [</span><span style="color:#89DDFF;">...</span><span style="color:#A6ACCD;">]</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">	</span><span style="color:#F07178;">links</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> [</span><span style="color:#89DDFF;">...</span><span style="color:#A6ACCD;">]</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#89DDFF;">};</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> svg </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> document</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">getElementById</span><span style="color:#A6ACCD;">(</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">mySVG</span><span style="color:#89DDFF;">&quot;</span><span style="color:#A6ACCD;">)</span><span style="color:#89DDFF;">;</span></span>
<span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> simulation </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">new</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">ForceSimulation</span><span style="color:#A6ACCD;">(svg)</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">simulation</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">render</span><span style="color:#A6ACCD;">(graph)</span><span style="color:#89DDFF;">;</span></span>
<span class="line"></span></code></pre></div>`,8),p=[l];function t(r,c,i,d,D,y){return a(),n("div",null,p)}const A=s(o,[["render",t]]);export{h as __pageData,A as default};
