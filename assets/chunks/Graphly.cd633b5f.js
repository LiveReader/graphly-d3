import{h as _,r,b as u,g,w as v,o as l,c as n,e as i,p as m,i as y,_ as f}from"../app.a4372555.js";import"./style.4ed993c7.js";const c=e=>(m("data-v-86418902"),e=e(),y(),e),k={class:"graphlyContainer"},w=c(()=>i("span",null,"Show Nodes",-1)),H={style:{width:"24px",height:"24px"},viewBox:"0 0 24 24"},V=c(()=>i("path",{fill:"currentColor",d:"M19,3H15V5H19V9H21V5C21,3.89 20.1,3 19,3M19,19H15V21H19A2,2 0 0,0 21,19V15H19M5,15H3V19A2,2 0 0,0 5,21H9V19H5M3,5V9H5V5H9V3H5A2,2 0 0,0 3,5Z"},null,-1)),E=[V],M=_({__name:"Graphly",props:{graph:{type:Object,default:()=>({nodes:[],links:[],hasUpdate:!1}),validator(e){return e.nodes&&e.links}}},setup(e){const a=e;let o=r("dark"),s=r({}),d=r({}),t;return u(async()=>{g(()=>import("./main.es.13872ea2.js"),["assets/chunks/main.es.13872ea2.js","assets/chunks/forceSimulation-0370b6e0.f319bc15.js","assets/app.a4372555.js"]).then(({ForceSimulation:p})=>{o.value=document.getElementsByTagName("html")[0].classList.contains("dark")?"dark":"light",t=new p(s.value),t.templateStore.remoteOrigin=window.location.protocol+"//"+window.location.host+"/templates/",t.envGravity=-5e3,t.linkDistance=250,t.render(a.graph),new MutationObserver(()=>{o.value=document.getElementsByTagName("html")[0].classList.contains("dark")?"dark":"light",s.value&&s.value.classList.toggle("dark",o.value==="dark")}).observe(document.getElementsByTagName("html")[0],{attributes:!0}),s.value&&(s.value.classList.toggle("dark",o.value==="dark"),d.value.addEventListener("click",()=>{t.moveTo({nodes:a.graph.nodes,padding:50})}))})}),v(()=>a.graph,()=>{t&&a.graph.hasUpdate&&(t.render(a.graph),a.graph.hasUpdate=!1)},{deep:!0}),(p,h)=>(l(),n("div",k,[(l(),n("svg",{ref_key:"graphlyElement",ref:s,class:"graphly",height:"100%",width:"100%"},null,512)),i("button",{ref_key:"graphlyMoveTo",ref:d,class:"graphlyMoveTo"},[w,(l(),n("svg",H,E))],512)]))}});const x=f(M,[["__scopeId","data-v-86418902"]]);export{x as G};
