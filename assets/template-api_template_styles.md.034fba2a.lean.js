import{o as l,c as o,e as n,n as d,t as p,d as a,F as h,j as m,k as C,a as k}from"./app.e5bb6d6c.js";const v={width:"100%",height:"100%",viewBox:"0 0 597 520",version:"1.1",xmlns:"http://www.w3.org/2000/svg","xmlns:xlink":"http://www.w3.org/1999/xlink","xml:space":"preserve","xmlns:serif":"http://www.serif.com/",style:{"fill-rule":"evenodd","clip-rule":"evenodd","stroke-linejoin":"round","stroke-miterlimit":"2"}},w={transform:"matrix(1,0,0,1,-101.915,-40.1924)"},D={transform:"matrix(8.33117e-17,-1.36058,1.36058,8.33117e-17,9.05891,870.52)"},T=n("rect",{x:"34%",y:"42%",width:"65%",height:"30%",rx:"80",ry:"80",style:{fill:"#101213"}},null,-1),S={x:"66%",y:"57%","text-anchor":"middle","dominant-baseline":"central",style:{"font-family":"roboto","font-size":"80px","font-weight":"bold",fill:"#eaeaea"}},F={__name:"Hexagon",props:{color:{type:String,default:"#000000"},title:{type:String,default:""}},setup(e){return(r,s)=>(l(),o("svg",v,[n("g",w,[n("g",D,[n("path",{d:"M384.617,88.155C406.11,75.826 432.531,75.826 454.023,88.155C488.394,107.873 540.748,137.906 575.236,157.69C596.908,170.123 610.273,193.199 610.273,218.184L610.273,356.483C610.273,381.468 596.908,404.544 575.236,416.977C540.748,436.761 488.394,466.794 454.023,486.512C432.531,498.841 406.11,498.841 384.617,486.512C350.246,466.794 297.892,436.761 263.405,416.977C241.733,404.544 228.367,381.468 228.367,356.483L228.367,218.184C228.367,193.199 241.733,170.123 263.405,157.69C297.892,137.906 350.246,107.873 384.617,88.155Z",style:d([{stroke:"#101213","stroke-width":"0.5"},{fill:e.color}])},null,4)]),T,n("text",S,p(e.title),1)])]))}},A={__name:"ColorTag",props:{bgcolor:{type:String,default:"#ffffff"},color:{type:String,default:"#101213"},text:{type:String,default:""}},setup(e){return(r,s)=>(l(),o("div",{style:d([{padding:"10px","border-radius":"16px","text-align":"center"},{backgroundColor:e.bgcolor,color:e.color}])},p(e.text),5))}};const P={class:"color-palette"},$={__name:"ColorPalette",props:{title:{type:String,default:""},primaryColor:{type:String,default:"#000000"},colors:{type:Array,default:()=>[],validator:e=>e.color&&e.name}},setup(e){return(r,s)=>(l(),o("div",P,[a(F,{color:e.primaryColor,title:e.title},null,8,["color","title"]),(l(!0),o(h,null,m(e.colors,(t,c)=>(l(),o("div",{key:c,style:{margin:"10px"}},[a(A,{bgcolor:t.color,color:t.textColor,text:t.name},null,8,["bgcolor","color","text"])]))),128))]))}};const B={class:"color-palettes"},i={__name:"ColorPaletteTable",props:{palettes:{type:Array,default:()=>[],validator:e=>e.title&&e.primaryColor&&e.colors}},setup(e){return(r,s)=>(l(),o("div",B,[(l(!0),o(h,null,m(e.palettes,(t,c)=>(l(),C($,{key:c,title:t.title,primaryColor:t.primaryColor,colors:t.colors},null,8,["title","primaryColor","colors"]))),128))]))}},E=k("",15),U=JSON.parse('{"title":"Template Styles","description":"","frontmatter":{"title":"Template Styles","lang":"en-US"},"headers":[{"level":2,"title":"Dark mode","slug":"dark-mode","link":"#dark-mode","children":[]},{"level":2,"title":"Utilities","slug":"utilities","link":"#utilities","children":[]},{"level":2,"title":"Texts","slug":"texts","link":"#texts","children":[]},{"level":2,"title":"Color Palette","slug":"color-palette","link":"#color-palette","children":[]}],"relativePath":"template-api/template_styles.md","lastUpdated":1678880844000}'),N={name:"template-api/template_styles.md"},j=Object.assign(N,{setup(e){const r={title:"teal",primaryColor:"#4db6ac",colors:[{color:"#b2dfdb",name:"#b2dfdb lighten"},{color:"#4db6ac",name:"#4db6ac gly-teal"},{color:"#00796b",textColor:"#eaeaea",name:"#00796b darken"}]},s={title:"lime",primaryColor:"#dce775",colors:[{color:"#f0f4c3",name:"#f0f4c3 lighten"},{color:"#dce775",name:"#dce775 gly-lime"},{color:"#afb42b",textColor:"#eaeaea",name:"#afb42b darken"}]},t={title:"green",primaryColor:"#81c784",colors:[{color:"#c8e6c9",name:"#c8e6c9 lighten"},{color:"#81c784",name:"#81c784 gly-green"},{color:"#388e3c",textColor:"#eaeaea",name:"#388e3c darken"}]},c={title:"red",primaryColor:"#e57373",colors:[{color:"#ffcdd2",name:"#ffcdd2 lighten"},{color:"#e57373",name:"#e57373 gly-red"},{color:"#d32f2f",textColor:"#eaeaea",name:"#d32f2f darken"}]},f={title:"magenta",primaryColor:"#f06292",colors:[{color:"#f8bbd0",name:"#f8bbd0 lighten"},{color:"#f06292",name:"#f06292 gly-magenta"},{color:"#c2185b",textColor:"#eaeaea",name:"#c2185b darken"}]},y={title:"orange",primaryColor:"#ffb74d",colors:[{color:"#ffe0b2",name:"#ffe0b2 lighten"},{color:"#ffb74d",name:"#ffb74d gly-orange"},{color:"#f57c00",textColor:"#eaeaea",name:"#f57c00 darken"}]},g={title:"blue",primaryColor:"#4fc3f7",colors:[{color:"#b3e5fc",name:"#b3e5fc lighten"},{color:"#4fc3f7",name:"#4fc3f7 gly-blue"},{color:"#1486c9",textColor:"#eaeaea",name:"#1486c9 darken"}]},u={title:"purple",primaryColor:"#9575cd",colors:[{color:"#d1c4e9",name:"#d1c4e9 lighten"},{color:"#9575cd",name:"#9575cd gly-purple"},{color:"#4c3b8f",textColor:"#eaeaea",name:"#4c3b8f darken"}]},_={title:"gray",primaryColor:"#a6a6a6",colors:[{color:"#e5e5e5",name:"#e5e5e5 lighten"},{color:"#a6a6a6",name:"#a6a6a6 gly-gray"},{color:"#595959",textColor:"#eaeaea",name:"#595959 darken"}]},b={title:"black",primaryColor:"#1a1a1a",colors:[{color:"#1a1a1a",textColor:"#eaeaea",name:"#1a1a1a gly-black"}]},x={title:"white",primaryColor:"#ffffff",colors:[{color:"#ffffff",name:"#ffffff gly-white"}]};return(V,G)=>(l(),o("div",null,[E,a(i,{palettes:[r,s,t]},null,8,["palettes"]),a(i,{palettes:[c,f,y]},null,8,["palettes"]),a(i,{palettes:[g,u,_]},null,8,["palettes"]),a(i,{palettes:[b,x]},null,8,["palettes"])]))}});export{U as __pageData,j as default};