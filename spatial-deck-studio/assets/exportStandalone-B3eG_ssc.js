import{W as le,I as de,J as ce,p as ue,Y as pe,U as me,R as he,V as xe}from"./index-CUFeAlDY.js";const fe={en:{document:"Spatial presentation",controls:"Presentation controls",navigation:"Camera navigation",play:"Play",pause:"Pause",playHint:"Play / pause (K)",overview:"Overview",overviewHint:"Overview (O / Esc)",fullscreen:"Fullscreen",exitFullscreen:"Exit fullscreen",fullscreenHint:"Fullscreen (F)",print:"Print / PDF",printHint:"Print pages (P)",first:"First stop",previous:"Previous stop",next:"Next stop",last:"Last stop",overviewCount:"Overview · Pages: {0}",page:"Page {0}",route:"Stop {0} / {1} · {2}",browse:"Browsing · Page {0}",resume:"Next: stop {0}. Home: first stop."},zh:{document:"空间演示文稿",controls:"演示控制",navigation:"镜头导航",play:"播放",pause:"暂停",playHint:"播放 / 暂停（K）",overview:"总览",overviewHint:"总览（O / Esc）",fullscreen:"全屏",exitFullscreen:"退出全屏",fullscreenHint:"全屏（F）",print:"打印 / PDF",printHint:"逐页打印（P）",first:"首个镜头",previous:"上一镜头",next:"下一镜头",last:"末个镜头",overviewCount:"总览 · {0} 页",page:"第 {0} 页",route:"镜头 {0} / {1} · {2}",browse:"临时查看 · 第 {0} 页",resume:"下一步返回镜头 {0}；Home 从路线开头开始"}};function ve(e,r){let o=1,s=1,p=0,m=0,z=0,M=0,h=!1,i={mode:"overview",index:-1,slideIndex:-1,playing:!1,animating:!1,camera:null};const q=()=>({...i,camera:i.camera?{...i.camera}:null}),L=()=>{h||r.onChange(q())},A=t=>{i.camera={...t},r.onRender({...t})},Y=()=>{M+=1,m&&r.clearTimer(m),m=0},k=()=>{Y(),i.playing&&(i.playing=!1,L())},U=()=>{z+=1,p&&r.cancelFrame(p),p=0,i.animating=!1},Q=t=>{let n=1/0,a=1/0,l=-1/0,c=-1/0;const d=-((t==null?void 0:t.view.rotation)??0),P=d*Math.PI/180,x=Math.cos(P),u=Math.sin(P);e.slides.forEach(w=>{const V=(w.rotation+d)*Math.PI/180,te=(w.scale??1)*(e.width*Math.abs(Math.cos(V))+e.height*Math.abs(Math.sin(V)))/2,ne=(w.scale??1)*(e.width*Math.abs(Math.sin(V))+e.height*Math.abs(Math.cos(V)))/2,ie=w.x*x-w.y*u,ae=w.x*u+w.y*x;n=Math.min(n,ie-te),l=Math.max(l,ie+te),a=Math.min(a,ae-ne),c=Math.max(c,ae+ne)});const j=(e.overviewLayout==="free"?0:o>=760?Math.min(o*.38,640):o*.34)+Math.max(34,o*.025),K=Math.max(34,o*.025),T=76,J=86,_=Math.max(240,o-j-K),N=Math.max(180,s-T-J),G=(n+l)/2,I=(a+c)/2;return{screenX:j+_/2,screenY:T+N/2,worldX:G*x+I*u,worldY:-G*u+I*x,scale:Math.min(_/Math.max(l-n,1),N/Math.max(c-a,1))*.92*((t==null?void 0:t.view.zoom)??1),rotation:d}},v=(t,n)=>{const a=e.slides[t],l=(((n==null?void 0:n.view.x)??e.width/2)-e.width/2)*(a.scale??1),c=(((n==null?void 0:n.view.y)??e.height/2)-e.height/2)*(a.scale??1),d=a.rotation*Math.PI/180;return{screenX:o/2,screenY:s/2,worldX:a.x+l*Math.cos(d)-c*Math.sin(d),worldY:a.y+l*Math.sin(d)+c*Math.cos(d),scale:Math.min(o/e.width,s/e.height)/(a.scale??1)*.94*((n==null?void 0:n.view.zoom)??1),rotation:-(a.rotation+((n==null?void 0:n.view.rotation)??0))}},g=()=>{const t=i.mode==="route"?e.stops[i.index]:void 0;return i.slideIndex>=0?v(i.slideIndex,t):Q(t)},D=(t,n,a,l,c)=>{if(t<=0||t>=1)return t;const d=(u,E,j)=>3*(1-u)*(1-u)*u*E+3*(1-u)*u*u*j+u*u*u;let P=0,x=1;for(let u=0;u<18;u+=1){const E=(P+x)/2;d(E,n,l)<t?P=E:x=E}return d((P+x)/2,a,c)},B=(t,n)=>n==="linear"?t:n==="ease-in-out"?D(t,.42,0,.58,1):D(t,.22,.82,.25,1),$=(t,n,a)=>({screenX:t.screenX+(n.screenX-t.screenX)*a,screenY:t.screenY+(n.screenY-t.screenY)*a,worldX:t.worldX+(n.worldX-t.worldX)*a,worldY:t.worldY+(n.worldY-t.worldY)*a,scale:t.scale+(n.scale-t.scale)*a,rotation:t.rotation+(n.rotation-t.rotation)*a}),X=()=>{if(Y(),!i.playing||i.animating||i.mode!=="route")return;const t=M;m=r.setTimer(()=>{if(h||t!==M||!i.playing)return;m=0;const n=O();n===i.index?k():b(n,!1)},e.stops[i.index].holdMs)},C=(t,n,a=!1)=>{Y(),U();const l=i.camera,c=z,d=n.durationMs;if(!l||a||n.type==="cut"||d<=0||r.reducedMotion()){A(t),L(),X();return}const P=l.rotation+((t.rotation-l.rotation+180)%360+360)%360-180,x={...t,rotation:P},u=Math.hypot(x.worldX-l.worldX,x.worldY-l.worldY),E=Math.min(l.scale,x.scale),j=u*E/Math.max(1,Math.hypot(o,s)),K=E*Math.max(.05,Math.min(1,n.zoomOut))/(1+j*.8),T={...l,scale:K},J={...x,scale:K},_=r.now();i.animating=!0,L();const N=G=>{if(h||c!==z)return;const I=Math.min(1,Math.max(0,(G-_)/d));let w;n.type!=="zoom"?w=$(l,x,B(I,n.easing)):I<.22?w=$(l,T,B(I/.22,n.easing)):I<.78?w=$(T,J,B((I-.22)/.56,n.easing)):w=$(J,x,B((I-.78)/.22,n.easing)),A(w),I<1?p=r.requestFrame(N):(p=0,i.animating=!1,L(),X())};p=r.requestFrame(N)};function b(t,n=!0,a=!1){if(h||!e.stops.length)return;n&&k();const l=Math.max(0,Math.min(e.stops.length-1,t));if(n&&!a&&i.mode==="route"&&i.index===l)return;i.index=l,i.mode="route";const c=e.stops[i.index];i.slideIndex=c.kind==="slide"?e.slides.findIndex(d=>d.id===c.slideId):-1,C(g(),{...e.transition,...c.transition},a)}const R=()=>{h||(k(),i.mode="overview",i.slideIndex=-1,C(g(),e.transition))},H=()=>e.links?Math.max(0,e.stops.findIndex(t=>e.links.some(n=>n.sourceId===t.id)&&!e.links.some(n=>n.targetId===t.id))):0,F=t=>{var c;if(i.index<0)return H();const n=(c=e.stops[i.index])==null?void 0:c.id,a=e.links.find(d=>(t?d.sourceId:d.targetId)===n),l=e.stops.findIndex(d=>d.id===(t?a==null?void 0:a.targetId:a==null?void 0:a.sourceId));return l<0?i.index:l},O=()=>e.links?F(!0):i.index<0?0:Math.min(e.stops.length-1,i.index+1),se=()=>e.links?F(!1):i.index<0?e.stops.length-1:Math.max(0,i.index-1),re=()=>{if(!e.links)return e.stops.length-1;let t=i.index<0?H():i.index;const n=new Set;for(;!n.has(t);){n.add(t);const a=e.links.find(c=>{var d;return c.sourceId===((d=e.stops[t])==null?void 0:d.id)}),l=e.stops.findIndex(c=>c.id===(a==null?void 0:a.targetId));if(l<0)break;t=l}return t},oe=t=>{if(h||!e.slides[t])return;const n=e.stops.findIndex(a=>a.kind==="slide"&&a.slideId===e.slides[t].id);n>=0?b(n):(k(),i.mode="temporary",i.slideIndex=t,C(g(),e.transition))},ee=()=>{h||i.playing||!e.stops.length||(i.playing=!0,i.mode!=="route"?b(O(),!1):!e.links&&i.index===e.stops.length-1&&!i.animating?b(0,!1):(L(),i.animating||X()))};return{start:(t,n)=>{o=Math.max(1,t),s=Math.max(1,n);const a=e.stops.findIndex(l=>l.id===e.startStopId);a>=0?b(a,!0,!0):C(g(),e.transition,!0)},resize:(t,n)=>{h||(o=Math.max(1,t),s=Math.max(1,n),C(g(),{...e.transition,type:"pan",durationMs:180}))},showOverview:R,focusSlide:oe,goToStop:b,play:ee,pause:k,dispose:()=>{k(),U(),h=!0},togglePlayback:()=>i.playing?k():ee(),next:()=>b(O()),previous:()=>b(se()),first:()=>b(H()),last:()=>b(re()),getState:q}}const ge={language:"en",frameUnit:"slide",requireEmbeddedImages:!0};function y(e,r=0){return Number.isFinite(e)?e:r}function we(e,r,o){return Math.min(o,Math.max(r,e))}function f(e){return String(e??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;")}function ye(e,r){return String(e??"").replace(/[<>{};]/g,"").trim()||r}function W(e,r){const o=String(e??"").trim();return/^(#[0-9a-f]{3,8}|rgba?\([\d\s.,%]+\)|hsla?\([\d\s.,%deg]+\)|[a-z]+)$/i.test(o)?o:r}function S(e,r=0){return`${y(e,r)}px`}function Z(e){return[`left:${S(e.x)}`,`top:${S(e.y)}`,`width:${S(Math.max(0,e.width))}`,`height:${S(Math.max(0,e.height))}`,`opacity:${we(y(e.opacity,1),0,1)}`,`z-index:${Math.round(y(e.zIndex))}`,`transform:rotate(${y(e.rotation)}deg)`].join(";")}function be(e){const r=Z(e)+";"+pe(me(e));return`<div class="deck-element deck-text" style="${f(r)}">${he(e)}</div>`}function ke(e){const r=[Z(e)].join(";"),o=[`object-fit:${e.objectFit}`,`object-position:${ye(e.objectPosition,"50% 50%")}`,`border-radius:${S(Math.max(0,e.borderRadius))}`,`transform:scale(${e.flipX?-1:1},${e.flipY?-1:1})`].join(";");return`<div class="deck-element deck-image" style="${f(r)}"><img style="${f(o)}" src="${f(e.src)}" alt="${f(e.alt)}" draggable="false"></div>`}function $e(e){const r=Z(e),o=W(e.stroke,"transparent"),s=W(e.fill,"transparent"),p=Math.max(0,y(e.strokeWidth)),m=xe(e),z=Object.entries(m.attributes).filter(([,M])=>M!==void 0).map(([M,h])=>`${M}="${f(h)}"`).join(" ");return`<svg class="deck-element deck-shape" viewBox="0 0 ${y(e.width,1)} ${y(e.height,1)}" aria-hidden="true" style="${f(r)}"><${m.tag} ${z} fill="${f(e.shape==="line"?"none":s)}" stroke="${f(o)}" stroke-width="${p}" stroke-linejoin="round" /></svg>`}function Ie(e){return e.hidden?"":e.type==="text"?be(e):e.type==="image"?ke(e):$e(e)}function Me(e,r,o){return o==="pixels"?{x:y(e.frame.x),y:y(e.frame.y)}:{x:y(e.frame.x)*r.width,y:y(e.frame.y)*r.height}}function Ee(e,r){if(!e.slides.length)throw new Error("演示文稿至少需要一页幻灯片。");if(!r.requireEmbeddedImages)return;const o=e.slides.flatMap(s=>s.elements.filter(p=>p.type==="image"&&!p.hidden).filter(p=>!p.src.trim().toLowerCase().startsWith("data:")).map(p=>`“${s.title}”中的“${p.name}”`));if(o.length)throw new Error(`以下图片尚未嵌入项目，无法生成独立 HTML：${o.join("、")}`)}function Be(e,r={}){const o={...ge,...r};Ee(e,o);const s=fe[o.language],p=s.overviewCount.replace("{0}",String(e.slides.length)),m=e.stage;e={...e,slides:le(e.slides)};const z=e.slides.map(v=>Me(v,m,o.frameUnit)),M=z.map((v,g)=>({id:e.slides[g].id,title:e.slides[g].title,x:v.x,y:v.y,rotation:y(e.slides[g].frame.rotation),scale:e.slides[g].frame.scale??1})),h=de(e),i={width:m.width,height:m.height,slides:M,stops:ce(e),transition:h.transition,links:h.mode==="custom"?h.links:void 0,startStopId:o.startStopId,overviewLayout:e.meta.overviewLayout},q=JSON.stringify(i).replaceAll("<","\\u003c").replaceAll("\u2028","\\u2028").replaceAll("\u2029","\\u2029"),L=e.slides.map((v,g)=>{var R;const D=z[g];let B=0,$=v.parentId;const X=new Set;for(;$&&!X.has($);)X.add($),B++,$=(R=e.slides.find(H=>H.id===$))==null?void 0:R.parentId;const C=[`z-index:${B}`,`left:${S(D.x)}`,`top:${S(D.y)}`,`width:${S(m.width)}`,`height:${S(m.height)}`,`background:${W(v.background,"#ffffff")}`,`transform:translate(-50%,-50%) rotate(${y(v.frame.rotation)}deg) scale(${v.frame.scale??1})`].join(";"),b=ue(v.elements).map(({element:H,style:F})=>{const O=Ie({...H,opacity:F.opacity,zIndex:F.zIndex});return F.clipPath?O.replace('style="',`style="clip-path:${f(F.clipPath)};`):O}).join("");return`<section class="deck-slide" data-index="${g}" aria-label="${f(v.title)}" tabindex="0" style="${f(C)}">${b}</section>`}).join(""),A=f(e.meta.title),Y=f(e.meta.subtitle),k=f(e.meta.author),U=W(e.meta.accent,"#356c5a"),Q=W(e.meta.overviewBackground,"#b9c6b1");return`<!doctype html>
<html lang="${o.language==="zh"?"zh-CN":"en"}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
  <meta name="color-scheme" content="light">
  <title>${A}</title>
  <style>
    :root{--accent:${U};--overview-bg:${Q};--ink:#17211d;--paper:#f5f4e9}
    *{box-sizing:border-box}
    html,body{width:100%;height:100%;margin:0;overflow:hidden;background:var(--overview-bg);color:var(--ink)}
    body{font-family:"Noto Serif SC","Songti SC","STSong",serif;user-select:none}
    button{font:600 14px/1 system-ui,-apple-system,"Segoe UI",sans-serif}
    #viewport{position:fixed;inset:0;overflow:hidden;background:var(--overview-bg)}
    #world{position:absolute;left:0;top:0;transform-origin:0 0;will-change:transform}
    .deck-slide{position:absolute;overflow:hidden;cursor:pointer;border:0;box-shadow:0 24px 64px rgba(25,45,35,.18);outline:1px solid rgba(35,57,48,.1);transition:box-shadow 220ms ease,outline-color 220ms ease}
    .deck-slide:hover,.deck-slide:focus-visible{box-shadow:0 30px 78px rgba(25,45,35,.25);outline:4px solid var(--accent)}
    .deck-slide.is-current{cursor:default;outline:0;box-shadow:0 26px 90px rgba(25,45,35,.28)}
    .deck-element{position:absolute;display:block;box-sizing:border-box;transform-origin:center center}
    .deck-text{display:flex;flex-direction:column;white-space:pre-wrap;overflow-wrap:anywhere;overflow:hidden;font-synthesis:weight style}
    .deck-image{pointer-events:none}
    .deck-image img{display:block;width:100%;height:100%}
    .deck-shape{overflow:visible}
    .title-panel{position:fixed;z-index:20;left:clamp(28px,5vw,88px);top:50%;width:min(34vw,560px);transform:translateY(-50%);opacity:1;transition:opacity 260ms ease,transform 360ms ease;pointer-events:none}
    .title-panel h1{margin:0;white-space:pre-line;font-size:clamp(42px,5.1vw,86px);font-weight:650;line-height:1.08;letter-spacing:-.035em;color:var(--accent)}
    .title-panel p{margin:30px 0 0;max-width:520px;font-size:clamp(18px,2vw,30px);line-height:1.55;color:rgba(23,33,29,.72);white-space:pre-line}
    .title-panel small{display:block;margin-top:26px;font:500 clamp(14px,1.35vw,20px)/1.4 system-ui,-apple-system,"Segoe UI",sans-serif;color:rgba(23,33,29,.6)}
    body.is-focused .title-panel{opacity:0;transform:translate(-30px,-50%);visibility:hidden}
    .toolbar{position:fixed;z-index:30;right:22px;top:20px;display:flex;gap:10px}
    .control{appearance:none;border:1px solid rgba(34,55,46,.17);border-radius:999px;padding:12px 17px;background:rgba(250,250,245,.94);color:#29483d;box-shadow:0 10px 30px rgba(23,44,34,.12);cursor:pointer}
    .control:hover,.control:focus-visible{background:#fff;outline:3px solid color-mix(in srgb,var(--accent) 32%,transparent)}
    .control:disabled{opacity:.4;cursor:default;outline:none}
    .pager{position:fixed;z-index:30;left:50%;bottom:max(18px,env(safe-area-inset-bottom));display:flex;align-items:center;gap:10px;transform:translateX(-50%)}
    .pager .control{width:44px;height:44px;padding:0;font-size:20px}
    #status{min-width:104px;max-width:min(50vw,480px);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;border-radius:999px;padding:13px 18px;background:#23352e;color:#fff;text-align:center;font:700 13px/1 system-ui,-apple-system,"Segoe UI",sans-serif;letter-spacing:.02em}
    #play[aria-pressed="true"]{background:var(--accent);color:#fff}
    body.is-overview .pager{opacity:.96}
    @media (max-width:760px){.title-panel{top:auto;bottom:76px;transform:none;width:64vw}.title-panel h1{font-size:34px}.title-panel p{display:none}.title-panel small{margin-top:12px}.toolbar{right:10px;left:10px;top:10px;justify-content:flex-end;gap:6px;flex-wrap:wrap}.control{padding:10px 11px}.pager{gap:6px}.pager .control{width:36px;height:40px}#status{padding:13px 11px;max-width:calc(100vw - 194px);font-size:11px}}
    @media (prefers-reduced-motion:reduce){#world,.title-panel{transition-duration:1ms!important}}
    @page{size:${m.width}px ${m.height}px;margin:0}
    @media print{
      html,body{width:${m.width}px;height:auto;overflow:visible;background:#fff;print-color-adjust:exact;-webkit-print-color-adjust:exact}
      .toolbar,.pager,.title-panel{display:none!important}
      #viewport,#world{position:static!important;inset:auto;overflow:visible;transform:none!important;transition:none!important}
      .deck-slide{position:relative!important;left:auto!important;top:auto!important;transform:none!important;margin:0;box-shadow:none!important;outline:none!important;break-inside:avoid;break-after:page;page-break-after:always}
      .deck-slide:last-child{break-after:auto;page-break-after:auto}
    }
  </style>
</head>
<body class="is-overview">
  <main id="viewport" aria-label="${s.document}">
    <div id="world">${L}</div>
  </main>
  ${e.meta.overviewLayout!=="free"?`<header class="title-panel">
    <h1>${A}</h1>
    ${Y?`<p>${Y}</p>`:""}
    ${k?`<small>${k}</small>`:""}
  </header>`:""}
  <nav class="toolbar" aria-label="${s.controls}">
    <button id="play" class="control" type="button" aria-pressed="false" title="${s.playHint}">${s.play}</button>
    <button id="overview" class="control" type="button" title="${s.overviewHint}">${s.overview}</button>
    <button id="fullscreen" class="control" type="button" title="${s.fullscreenHint}">${s.fullscreen}</button>
    <button id="print" class="control" type="button" title="${s.printHint}">${s.print}</button>
  </nav>
  <nav class="pager" aria-label="${s.navigation}">
    <button id="first" class="control" type="button" aria-label="${s.first}" title="${s.first}"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 5v14M17 5l-7 7 7 7" /></svg></button>
    <button id="previous" class="control" type="button" aria-label="${s.previous}" title="${s.previous}">←</button>
    <div id="status" aria-live="polite">${p}</div>
    <button id="next" class="control" type="button" aria-label="${s.next}" title="${s.next}">→</button>
    <button id="last" class="control" type="button" aria-label="${s.last}" title="${s.last}"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M19 5v14M7 5l7 7-7 7" /></svg></button>
  </nav>
  <script>
    (() => {
      'use strict';
      const config = ${q};
      const ui = ${JSON.stringify(s)};
      const message = (text, ...values) => text.replace(/\\{(\\d+)\\}/g, (_, index) => String(values[Number(index)]));
      const slides = config.slides;
      const stops = config.stops;
      const slideNodes = Array.from(document.querySelectorAll('.deck-slide'));
      const world = document.getElementById('world');
      const status = document.getElementById('status');
      const fullscreenButton = document.getElementById('fullscreen');
      const playButton = document.getElementById('play');
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
      const padded = (index) => String(index + 1).padStart(2, '0');
      const runtime = (${ve.toString()})(config, {
        now: () => performance.now(),
        requestFrame: (callback) => requestAnimationFrame(callback),
        cancelFrame: (id) => cancelAnimationFrame(id),
        setTimer: (callback, delay) => setTimeout(callback, delay),
        clearTimer: (id) => clearTimeout(id),
        reducedMotion: () => reducedMotion.matches,
        onRender: (camera) => {
          world.style.transform = 'translate(' + camera.screenX + 'px,' + camera.screenY + 'px) scale(' + camera.scale + ') rotate(' + camera.rotation + 'deg) translate(' + (-camera.worldX) + 'px,' + (-camera.worldY) + 'px)';
        },
        onChange: (state) => {
          const isOverview = state.slideIndex < 0;
          document.body.classList.toggle('is-overview', isOverview);
          document.body.classList.toggle('is-focused', !isOverview);
          slideNodes.forEach((node, index) => {
            node.classList.toggle('is-current', index === state.slideIndex);
            if (index === state.slideIndex) node.setAttribute('aria-current', 'step');
            else node.removeAttribute('aria-current');
          });
          const route = state.mode === 'route';
          document.getElementById('first').disabled = route && (config.links ? !config.links.some(link => link.targetId === stops[state.index]?.id) : state.index === 0);
          document.getElementById('previous').disabled = route && (config.links ? !config.links.some(link => link.targetId === stops[state.index]?.id) : state.index === 0);
          document.getElementById('last').disabled = route && (config.links ? !config.links.some(link => link.sourceId === stops[state.index]?.id) : state.index === stops.length - 1);
          document.getElementById('next').disabled = route && (config.links ? !config.links.some(link => link.sourceId === stops[state.index]?.id) : state.index === stops.length - 1);
          const resume = padded(state.index < 0 ? 0 : Math.min(stops.length - 1, state.index + 1));
          if (route) {
            const stop = stops[state.index];
            const place = isOverview ? ui.overview : message(ui.page, state.slideIndex + 1);
            status.textContent = message(ui.route, padded(state.index), stops.length, place);
            status.title = stop.label + (isOverview ? '' : ' · ' + slides[state.slideIndex].title);
          } else {
            status.textContent = (isOverview ? message(ui.overviewCount, slides.length) : message(ui.browse, state.slideIndex + 1));
            status.title = message(ui.resume, resume);
          }
          playButton.textContent = state.playing ? ui.pause : ui.play;
          playButton.setAttribute('aria-pressed', String(state.playing));
        },
      });
      const printDeck = () => { runtime.pause(); window.print(); };

      slideNodes.forEach((node, index) => {
        node.addEventListener('click', () => {
          const state = runtime.getState();
          if (state.slideIndex !== index) runtime.focusSlide(index);
        });
        node.addEventListener('keydown', (event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            event.stopPropagation();
            if (event.key === ' ' && runtime.getState().slideIndex === index) runtime.next();
            else runtime.focusSlide(index);
          }
        });
      });
      document.getElementById('overview').addEventListener('click', runtime.showOverview);
      document.getElementById('previous').addEventListener('click', runtime.previous);
      document.getElementById('next').addEventListener('click', runtime.next);
      document.getElementById('first').addEventListener('click', runtime.first);
      document.getElementById('last').addEventListener('click', runtime.last);
      document.getElementById('print').addEventListener('click', printDeck);
      playButton.addEventListener('click', runtime.togglePlayback);
      fullscreenButton.addEventListener('click', async () => {
        try {
          if (document.fullscreenElement) await document.exitFullscreen();
          else await document.documentElement.requestFullscreen();
        } catch (_) {}
      });
      document.addEventListener('fullscreenchange', () => {
        fullscreenButton.textContent = document.fullscreenElement ? ui.exitFullscreen : ui.fullscreen;
        runtime.resize(window.innerWidth, window.innerHeight);
      });
      document.addEventListener('keydown', (event) => {
        if (event.ctrlKey || event.metaKey || event.altKey) return;
        const key = event.key.toLowerCase();
        if ((key === ' ' || key === 'enter') && event.target instanceof Element && event.target.closest('button')) return;
        if (key === 'arrowright' || key === 'arrowdown' || key === 'pagedown' || key === ' ') {
          event.preventDefault(); runtime.next();
        } else if (key === 'arrowleft' || key === 'arrowup' || key === 'pageup') {
          event.preventDefault(); runtime.previous();
        } else if (key === 'o' || key === 'escape') {
          event.preventDefault(); runtime.showOverview();
        } else if (key === 'f') {
          event.preventDefault(); fullscreenButton.click();
        } else if (key === 'home') {
          event.preventDefault(); runtime.first();
        } else if (key === 'end') {
          event.preventDefault(); runtime.last();
        } else if (key === 'p') {
          event.preventDefault(); printDeck();
        } else if (key === 'k') {
          event.preventDefault(); runtime.togglePlayback();
        }
      });
      window.addEventListener('resize', () => {
        runtime.resize(window.innerWidth, window.innerHeight);
      });
      document.addEventListener('visibilitychange', () => { if (document.hidden) runtime.pause(); });
      window.addEventListener('beforeprint', runtime.pause);
      window.addEventListener('pagehide', runtime.dispose);
      reducedMotion.addEventListener('change', () => runtime.resize(window.innerWidth, window.innerHeight));
      runtime.start(window.innerWidth, window.innerHeight);
    })();
  <\/script>
</body>
</html>`}export{Be as exportStandaloneHtml};
