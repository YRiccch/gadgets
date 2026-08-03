import{_ as e,a as t,f as n,g as r,i,l as a,n as o,r as s,s as c,u as l}from"./index-Dsw79GrM.js";import{s as u}from"./city-zoom-layout-Bas5nOso.js";function d(e){return e.replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`).replaceAll(`"`,`&quot;`).replaceAll(`'`,`&#39;`)}function f(e){return e.replace(/[<>&\u2028\u2029]/g,e=>{switch(e){case`<`:return`\\u003c`;case`>`:return`\\u003e`;case`&`:return`\\u0026`;case`\u2028`:return`\\u2028`;case`\u2029`:return`\\u2029`;default:return e}})}function p(e,t=`#4f8c7c`){return/^#[0-9a-f]{6}$/i.test(e.trim())?e.trim():t}var m=1e5,h=85.05112878;function g([e,t]){let n=Math.max(-85.05112878,Math.min(h,t)),r=e*Math.PI/180,i=n*Math.PI/180,a=Math.log(Math.tan(Math.PI/4+i/2));return[r*m,-a*m]}function _(t){let r=n(t.document),i=t.document.transfers.flatMap(e=>{let t=r.stopCoordinates.get(e.fromStopId),n=r.stopCoordinates.get(e.toStopId);return!t||!n?[]:[{label:e.label,from:g(t),to:g(n)}]});return{days:r.days.map(t=>({id:t.day.id,path:t.path.map(g),hull:t.hull.map(g),labelPosition:g(t.labelPosition),stops:t.stops.map(({stop:t,coordinate:n})=>({id:t.id,point:g(n),navigationUrl:e(t)}))})),transfers:i,unplannedStops:(t.document.unplannedStops??[]).map(t=>({id:t.id,navigationUrl:e(t)}))}}function v(e){if(e.provider!==`amap`)return null;let t=e.url.trim();if(!t)return null;try{let n=new URL(t);if(n.protocol!==`https:`&&n.protocol!==`http:`)return null;n.protocol=`https:`;let r=e.title?.trim();return{provider:`amap`,url:n.toString(),...r?{title:r}:{}}}catch{return null}}function y(e,t){let n=new Set([...e.document.days.flatMap(e=>e.stops.map(e=>e.id)),...(e.document.unplannedStops??[]).map(e=>e.id)]),r=[];for(let e of n){let n=[],i=new Set;for(let r of t.get(e)??[]){let e=v(r);if(!(!e||i.has(e.url))&&(i.add(e.url),n.push(e),n.length===6))break}n.length&&r.push({stopId:e,photos:n})}return{resolvedPhotos:r}}function b(e){return new Map(e.resolvedPhotos.map(e=>[e.stopId,e.photos]))}var x=String.raw`
(()=>{'use strict';
const projectNode=document.getElementById('tms-project');
const geometryNode=document.getElementById('tms-geometry');
const displayMediaNode=document.getElementById('tms-display-media');
const sceneNode=document.getElementById('tms-scene');
const projectFile=JSON.parse(projectNode.textContent||'{}');
const geometry=JSON.parse(geometryNode.textContent||'{}');
const displayMedia=JSON.parse(displayMediaNode.textContent||'{"resolvedPhotos":[]}');
const scene=JSON.parse(sceneNode.textContent||'{}');
const project=projectFile.project||{};
const trip=project.document||{days:[]};
const days=Array.isArray(trip.days)?trip.days:[];
const resolvedPhotosByStop=new Map((displayMedia.resolvedPhotos||[]).map((entry)=>[entry.stopId,entry.photos||[]]));
const guide=document.getElementById('guide');
const svg=document.getElementById('atlas');
const stage=document.getElementById('atlas-stage');
const title=document.getElementById('guide-title');
const modeStatus=document.getElementById('mode-status');
const details=document.getElementById('place-card');
const detailConnector=document.getElementById('detail-connector');
const detailConnectorPath=document.getElementById('detail-connector-path');
const detailCover=document.getElementById('place-cover');
const detailMeta=document.getElementById('place-meta');
const detailTitle=document.getElementById('place-title');
const detailShort=document.getElementById('place-short');
const detailSummary=document.getElementById('place-summary');
const detailNavigation=document.getElementById('place-navigation');
const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
const sceneStopsByKey=new Map((scene.stops||[]).map((stop)=>[stop.key,stop]));
const sharedById=new Map((scene.sharedPlaces||[]).map((shared)=>[shared.id,shared]));
const transferById=new Map((scene.transfers||[]).map((transfer)=>[transfer.id,transfer]));

function indexElements(attribute){
  const indexed=new Map();
  document.querySelectorAll('['+attribute+']').forEach((element)=>{
    const key=element.getAttribute(attribute);
    const values=indexed.get(key);
    if(values)values.push(element);else indexed.set(key,[element]);
  });
  return indexed;
}

const markerByKey=new Map(Array.from(document.querySelectorAll('[data-stop-key]')).map((marker)=>[marker.dataset.stopKey,marker]));
const cityOutlineElements=indexElements('data-city-outline');
const cityLabelElements=indexElements('data-city-label');
const dayPlaneElements=indexElements('data-day-plane');
const dayRouteElements=indexElements('data-day-route');
const dayLabelElements=indexElements('data-day-label');
const sharedStemElements=indexElements('data-shared-stem');
const transferPathElements=indexElements('data-transfer-path');
const transferLabelElements=indexElements('data-transfer-label');
const metroSegmentElements=indexElements('data-metro-segment');
const metroStationElements=indexElements('data-metro-station');
const metroLabelElements=indexElements('data-metro-label');
const dayLayerElements=indexElements('data-day-id');
let activeDayIndex=null;
let selectedMarker=null;
let currentLayout=cloneLayout(scene.modes.relative);
let layoutFrame=0;
let viewBoxFrame=0;
let currentViewBox={x:0,y:0,width:scene.viewBox.width,height:scene.viewBox.height};

title.textContent=trip.title||'旅行攻略';

function clonePoint(source){return{x:source.x,y:source.y};}
function cloneLayout(source){
  const places={};
  Object.keys(source.places||{}).forEach((key)=>{places[key]=clonePoint(source.places[key]);});
  const cities={};
  Object.keys(source.cities||{}).forEach((key)=>{cities[key]={label:clonePoint(source.cities[key].label),outline:source.cities[key].outline.map(clonePoint)};});
  const dayLayouts={};
  Object.keys(source.days||{}).forEach((key)=>{dayLayouts[key]={label:clonePoint(source.days[key].label),plane:source.days[key].plane.map(clonePoint)};});
  const metroStations={};
  Object.keys(source.metroStations||{}).forEach((key)=>{metroStations[key]=clonePoint(source.metroStations[key]);});
  const metroSegments={};
  Object.keys(source.metroSegments||{}).forEach((key)=>{metroSegments[key]=source.metroSegments[key].map(clonePoint);});
  return{places,cities,days:dayLayouts,metroStations,metroSegments};
}

function lerp(left,right,amount){return left+(right-left)*amount;}
function interpolatePoint(from,to,amount){return{x:lerp(from.x,to.x,amount),y:lerp(from.y,to.y,amount)};}
function interpolateLayout(from,to,amount){
  const places={};
  Object.keys(to.places||{}).forEach((key)=>{places[key]=interpolatePoint(from.places[key],to.places[key],amount);});
  const cities={};
  Object.keys(to.cities||{}).forEach((key)=>{cities[key]={
    label:interpolatePoint(from.cities[key].label,to.cities[key].label,amount),
    outline:to.cities[key].outline.map((point,index)=>interpolatePoint(from.cities[key].outline[index],point,amount)),
  };});
  const dayLayouts={};
  Object.keys(to.days||{}).forEach((key)=>{dayLayouts[key]={
    label:interpolatePoint(from.days[key].label,to.days[key].label,amount),
    plane:to.days[key].plane.map((point,index)=>interpolatePoint(from.days[key].plane[index],point,amount)),
  };});
  const metroStations={};
  Object.keys(to.metroStations||{}).forEach((key)=>{metroStations[key]=interpolatePoint(from.metroStations[key],to.metroStations[key],amount);});
  const metroSegments={};
  Object.keys(to.metroSegments||{}).forEach((key)=>{metroSegments[key]=to.metroSegments[key].map((point,index)=>interpolatePoint(from.metroSegments[key][index],point,amount));});
  return{places,cities,days:dayLayouts,metroStations,metroSegments};
}

function format(value){return Number(value.toFixed(2)).toString();}
function iso(source,height){
  const projection=scene.projection;
  const dx=source.x-projection.centerX;
  const dy=source.y-projection.centerY;
  return{
    x:projection.originX+dx*projection.xAxisX+dy*projection.yAxisX,
    y:projection.originY+dx*projection.xAxisY+dy*projection.yAxisY-height,
  };
}
function dayHeight(dayIndex){return scene.projection.firstLayerHeight+dayIndex*scene.projection.layerGap;}
function pointText(source){return format(source.x)+','+format(source.y);}
function pointsText(points){return points.map(pointText).join(' ');}
function screenUnit(){
  const viewBox=svg.viewBox.baseVal;
  return Math.max(0.35,Math.min(4.5,Math.max(viewBox.width/Math.max(svg.clientWidth,1),viewBox.height/Math.max(svg.clientHeight,1))));
}

function writeViewBox(box){
  currentViewBox=box;
  svg.setAttribute('viewBox',[box.x,box.y,box.width,box.height].map(format).join(' '));
}

function focusedViewBox(dayIndex){
  if(dayIndex===null||window.innerWidth>768)return{x:0,y:0,width:scene.viewBox.width,height:scene.viewBox.height};
  const day=scene.days[dayIndex];
  const layout=day&&currentLayout.days[day.id];
  if(!day||!layout)return{x:0,y:0,width:scene.viewBox.width,height:scene.viewBox.height};
  const height=dayHeight(dayIndex);
  const points=layout.plane.map((source)=>iso(source,height));
  day.routePlaceKeys.forEach((key)=>points.push(iso(currentLayout.places[key],height)));
  const xs=points.map((point)=>point.x);
  const ys=points.map((point)=>point.y);
  const minX=Math.min(...xs);
  const maxX=Math.max(...xs);
  const minY=Math.min(...ys);
  const maxY=Math.max(...ys);
  const ratio=Math.max(svg.clientWidth,1)/Math.max(svg.clientHeight,1);
  const width=Math.max(430,Math.min(680,maxX-minX+140));
  const heightForView=width/Math.max(ratio,0.3);
  return{x:(minX+maxX-width)/2,y:(minY+maxY-heightForView)/2,width,height:heightForView};
}

function animateViewBox(dayIndex,immediate){
  cancelAnimationFrame(viewBoxFrame);
  const target=focusedViewBox(dayIndex);
  if(immediate||reducedMotion.matches){writeViewBox(target);renderScene();return;}
  const from={...currentViewBox};
  const started=performance.now();
  const step=(now)=>{
    const progress=Math.min((now-started)/420,1);
    const eased=1-Math.pow(1-progress,4);
    writeViewBox({
      x:lerp(from.x,target.x,eased),
      y:lerp(from.y,target.y,eased),
      width:lerp(from.width,target.width,eased),
      height:lerp(from.height,target.height,eased),
    });
    renderScene();
    if(progress<1)viewBoxFrame=requestAnimationFrame(step);
    else{writeViewBox(target);renderScene();}
  };
  viewBoxFrame=requestAnimationFrame(step);
}

function routePath(points){
  if(points.length<2)return'';
  if(points.length===2){
    const first=points[0];
    const second=points[1];
    const dx=second.x-first.x;
    const dy=second.y-first.y;
    const length=Math.hypot(dx,dy)||1;
    const bend=Math.min(34,length*0.1);
    const nx=-dy/length*bend;
    const ny=dx/length*bend;
    const c1={x:first.x+dx/3+nx,y:first.y+dy/3+ny};
    const c2={x:first.x+dx*2/3+nx,y:first.y+dy*2/3+ny};
    return'M '+pointText(first)+' C '+pointText(c1)+' '+pointText(c2)+' '+pointText(second);
  }
  let path='M '+pointText(points[0]);
  for(let index=0;index<points.length-1;index+=1){
    const p0=points[Math.max(0,index-1)];
    const p1=points[index];
    const p2=points[index+1];
    const p3=points[Math.min(points.length-1,index+2)];
    const c1={x:p1.x+(p2.x-p0.x)/6,y:p1.y+(p2.y-p0.y)/6};
    const c2={x:p2.x-(p3.x-p1.x)/6,y:p2.y-(p3.y-p1.y)/6};
    path+=' C '+pointText(c1)+' '+pointText(c2)+' '+pointText(p2);
  }
  return path;
}

function renderScene(){
  const unit=screenUnit();
  (scene.cities||[]).forEach((city)=>{
    const layout=currentLayout.cities[city.id];
    if(!layout)return;
    const outline=layout.outline.map((source)=>iso(source,0));
    (cityOutlineElements.get(city.id)||[]).forEach((element)=>element.setAttribute('points',pointsText(outline)));
    const label=iso(layout.label,0);
    const labelElement=(cityLabelElements.get(city.id)||[])[0];
    if(labelElement)labelElement.setAttribute('transform','translate('+format(label.x)+' '+format(label.y)+') scale('+format(unit)+')');
  });

  (scene.metroSegments||[]).forEach((segment)=>{
    const source=currentLayout.metroSegments[segment.id]||[];
    const path=routePath(source.map((point)=>iso(point,0)));
    (metroSegmentElements.get(segment.id)||[]).forEach((element)=>element.setAttribute('d',path));
  });
  (scene.metroStations||[]).forEach((station)=>{
    const source=currentLayout.metroStations[station.id];
    const element=(metroStationElements.get(station.id)||[])[0];
    if(!source||!element)return;
    const location=iso(source,0);
    element.setAttribute('transform','translate('+format(location.x)+' '+format(location.y)+') scale('+format(unit)+')');
  });
  document.querySelectorAll('[data-metro-label-segment]').forEach((element)=>{
    const source=currentLayout.metroSegments[element.dataset.metroLabelSegment]||[];
    const middle=source[Math.floor(source.length/2)];
    if(!middle)return;
    const location=iso(middle,0);
    element.setAttribute('transform','translate('+format(location.x)+' '+format(location.y-12*unit)+') scale('+format(unit)+')');
  });

  (scene.days||[]).forEach((day,dayIndex)=>{
    const layout=currentLayout.days[day.id];
    if(!layout)return;
    const height=dayHeight(dayIndex);
    const plane=layout.plane.map((source)=>iso(source,height));
    (dayPlaneElements.get(day.id)||[]).forEach((element)=>element.setAttribute('points',pointsText(plane)));
    const route=day.routePlaceKeys.map((key)=>iso(currentLayout.places[key],height));
    const path=routePath(route);
    (dayRouteElements.get(day.id)||[]).forEach((element)=>element.setAttribute('d',path));
    const label=iso(layout.label,height);
    const labelElement=(dayLabelElements.get(day.id)||[])[0];
    if(labelElement)labelElement.setAttribute('transform','translate('+format(label.x)+' '+format(label.y)+') scale('+format(unit)+')');
  });

  (scene.stops||[]).forEach((sceneStop)=>{
    const source=currentLayout.places[sceneStop.placeKey];
    const marker=markerByKey.get(sceneStop.key);
    if(!source||!marker)return;
    const location=iso(source,dayHeight(sceneStop.dayIndex));
    marker.setAttribute('transform','translate('+format(location.x)+' '+format(location.y)+') scale('+format(unit)+')');
  });

  (scene.sharedPlaces||[]).forEach((shared)=>{
    const location=currentLayout.places[shared.placeKey];
    if(!location)return;
    const start=iso(location,dayHeight(shared.dayIndexes[0]));
    const end=iso(location,dayHeight(shared.dayIndexes[shared.dayIndexes.length-1]));
    const path='M '+pointText(start)+' L '+pointText(end);
    (sharedStemElements.get(shared.id)||[]).forEach((element)=>element.setAttribute('d',path));
  });

  (scene.transfers||[]).forEach((transfer)=>{
    const fromStop=sceneStopsByKey.get(transfer.fromStopKey);
    const toStop=sceneStopsByKey.get(transfer.toStopKey);
    if(!fromStop||!toStop)return;
    const from=iso(currentLayout.places[fromStop.placeKey],dayHeight(fromStop.dayIndex));
    const to=iso(currentLayout.places[toStop.placeKey],dayHeight(toStop.dayIndex));
    const path=routePath([from,to]);
    (transferPathElements.get(transfer.id)||[]).forEach((element)=>element.setAttribute('d',path));
    const label={x:(from.x+to.x)/2,y:(from.y+to.y)/2-12};
    const labelElement=(transferLabelElements.get(transfer.id)||[])[0];
    if(labelElement)labelElement.setAttribute('transform','translate('+format(label.x)+' '+format(label.y)+') scale('+format(unit)+')');
  });

  if(selectedMarker&&!details.hidden)positionDetails(selectedMarker);
}

const modeCopy={relative:'当前为示意布局',geographic:'当前为实景布局'};
function setMode(nextMode){
  if(!scene.modes[nextMode])return;
  guide.dataset.layoutMode=nextMode;
  document.querySelectorAll('[data-layout-mode]').forEach((button)=>{
    button.setAttribute('aria-pressed',String(button.dataset.layoutMode===nextMode));
  });
  modeStatus.textContent=modeCopy[nextMode]||'地图布局已切换';
  cancelAnimationFrame(layoutFrame);
  const from=cloneLayout(currentLayout);
  const target=scene.modes[nextMode];
  if(reducedMotion.matches){
    currentLayout=cloneLayout(target);
    renderScene();
    animateViewBox(activeDayIndex,true);
    return;
  }
  const started=performance.now();
  guide.classList.add('is-morphing');
  const step=(now)=>{
    const progress=Math.min((now-started)/520,1);
    const eased=1-Math.pow(1-progress,4);
    currentLayout=interpolateLayout(from,target,eased);
    renderScene();
    if(progress<1)layoutFrame=requestAnimationFrame(step);
    else{
      currentLayout=cloneLayout(target);
      guide.classList.remove('is-morphing');
      renderScene();
      animateViewBox(activeDayIndex);
    }
  };
  layoutFrame=requestAnimationFrame(step);
}

document.querySelectorAll('[data-layout-mode]').forEach((button)=>{
  button.addEventListener('click',()=>setMode(button.dataset.layoutMode));
});

function setActiveDay(dayIndex){
  activeDayIndex=dayIndex;
  document.querySelectorAll('.atlas-day').forEach((layer)=>{
    const matches=dayIndex===null||Number(layer.dataset.dayIndex)===dayIndex;
    layer.classList.toggle('is-muted',!matches);
    layer.classList.toggle('is-focused',dayIndex!==null&&matches);
  });
  document.querySelectorAll('.atlas-day-label').forEach((label)=>{
    const matches=dayIndex===null||Number(label.dataset.dayTrigger)===dayIndex;
    label.classList.toggle('is-muted',!matches);
    label.classList.toggle('is-focused',dayIndex!==null&&matches);
  });
  document.querySelectorAll('.shared-place').forEach((layer)=>{
    const shared=sharedById.get(layer.dataset.sharedPlace);
    layer.classList.toggle('is-muted',dayIndex!==null&&shared&&!shared.dayIndexes.includes(dayIndex));
  });
  document.querySelectorAll('.atlas-transfer').forEach((layer)=>{
    const transfer=transferById.get(layer.dataset.transferId);
    const from=transfer&&sceneStopsByKey.get(transfer.fromStopKey);
    const to=transfer&&sceneStopsByKey.get(transfer.toStopKey);
    layer.classList.toggle('is-muted',dayIndex!==null&&from&&to&&from.dayIndex!==dayIndex&&to.dayIndex!==dayIndex);
  });
  document.querySelectorAll('.atlas-metro-segment').forEach((layer)=>{
    layer.classList.toggle('is-muted',dayIndex!==null&&Number(layer.dataset.metroDayIndex)!==dayIndex);
  });
  const metroStationDays=new Map();
  const metroLineDays=new Map();
  (scene.metroSegments||[]).forEach((segment)=>{
    segment.stationIds.forEach((stationId)=>{
      const stationDays=metroStationDays.get(stationId)||new Set();
      stationDays.add(segment.dayIndex);
      metroStationDays.set(stationId,stationDays);
    });
    const lineDays=metroLineDays.get(segment.lineId)||new Set();
    lineDays.add(segment.dayIndex);
    metroLineDays.set(segment.lineId,lineDays);
  });
  document.querySelectorAll('.atlas-metro-station').forEach((element)=>{
    const stationDays=metroStationDays.get(element.dataset.metroStation);
    element.classList.toggle('is-muted',dayIndex!==null&&stationDays&&!stationDays.has(dayIndex));
  });
  document.querySelectorAll('.atlas-metro-label').forEach((element)=>{
    const lineDays=metroLineDays.get(element.dataset.metroLabel);
    element.classList.toggle('is-muted',dayIndex!==null&&lineDays&&!lineDays.has(dayIndex));
  });
  animateViewBox(dayIndex);
}

document.querySelectorAll('[data-day-trigger]').forEach((trigger)=>{
  const activate=()=>{
    const nextDay=Number(trigger.dataset.dayTrigger);
    setActiveDay(activeDayIndex===nextDay?null:nextDay);
  };
  trigger.addEventListener('click',(event)=>{event.stopPropagation();activate();});
  trigger.addEventListener('keydown',(event)=>{
    if(event.key==='Enter'||event.key===' '){
      event.preventDefault();
      event.stopPropagation();
      activate();
    }
  });
});

function displayPhotoForStop(stop){
  const local=(stop.photos||[]).find((photo)=>String(photo.dataUrl||'').trim());
  if(local)return{src:local.dataUrl,alt:local.caption||local.name||stop.name};
  const provider=((stop.placeProvider&&stop.placeProvider.photos)||[]).find((photo)=>String(photo.url||'').trim());
  if(provider)return{src:provider.url,alt:provider.title||stop.name};
  const resolved=(resolvedPhotosByStop.get(stop.id)||[]).find((photo)=>String(photo.url||'').trim());
  return resolved?{src:resolved.url,alt:resolved.title||stop.name}:null;
}

function positionDetails(marker){
  if(!marker||details.hidden||window.innerWidth<=768)return;
  const guideRect=guide.getBoundingClientRect();
  const markerRect=marker.getBoundingClientRect();
  const cardRect=details.getBoundingClientRect();
  const anchorX=markerRect.left-guideRect.left+markerRect.width/2;
  const anchorY=markerRect.top-guideRect.top+markerRect.height/2;
  const placeLeft=anchorX>guideRect.width*0.58;
  const proposedLeft=placeLeft?anchorX-cardRect.width-52:anchorX+52;
  const left=Math.max(16,Math.min(guideRect.width-cardRect.width-16,proposedLeft));
  const top=Math.max(16,Math.min(guideRect.height-cardRect.height-16,anchorY-cardRect.height/2));
  details.style.left=left+'px';
  details.style.top=top+'px';
  details.style.right='auto';
  details.style.bottom='auto';
  detailConnector.hidden=false;
  detailConnector.setAttribute('viewBox','0 0 '+guideRect.width+' '+guideRect.height);
  const cardAnchorX=placeLeft?left+cardRect.width:left;
  const cardAnchorY=Math.max(top+28,Math.min(top+cardRect.height-28,anchorY));
  const direction=placeLeft?-1:1;
  const c1=anchorX+direction*22;
  const c2=cardAnchorX-direction*22;
  detailConnectorPath.setAttribute('d','M '+anchorX+' '+anchorY+' C '+c1+' '+anchorY+' '+c2+' '+cardAnchorY+' '+cardAnchorX+' '+cardAnchorY);
}

function closeDetails(){
  details.hidden=true;
  details.setAttribute('aria-hidden','true');
  detailConnector.hidden=true;
  if(selectedMarker)selectedMarker.classList.remove('is-selected');
  selectedMarker=null;
}

function showPlace(stop,context,navigationUrl,marker){
  if(!stop)return;
  if(selectedMarker)selectedMarker.classList.remove('is-selected');
  selectedMarker=marker||null;
  if(selectedMarker)selectedMarker.classList.add('is-selected');
  detailMeta.textContent=[context,stop.city,stop.time].filter(Boolean).join(' · ');
  detailTitle.textContent=stop.name;
  detailShort.textContent=stop.short||'';
  detailSummary.textContent=stop.summary||'';
  const cover=displayPhotoForStop(stop);
  detailCover.hidden=!cover;
  if(cover){
    const image=document.createElement('img');
    image.src=cover.src;
    image.alt=cover.alt;
    image.onerror=()=>{detailCover.hidden=true;};
    detailCover.replaceChildren(image);
  }else{
    detailCover.replaceChildren();
  }
  detailNavigation.hidden=!navigationUrl;
  if(navigationUrl)detailNavigation.href=navigationUrl;
  details.hidden=false;
  details.setAttribute('aria-hidden','false');
  details.classList.remove('is-opening');
  void details.offsetWidth;
  details.classList.add('is-opening');
  requestAnimationFrame(()=>positionDetails(selectedMarker));
}

function showStop(dayIndex,stopIndex,marker){
  const day=days[dayIndex];
  const stop=day&&day.stops[stopIndex];
  if(!stop)return;
  const portable=geometry.days&&geometry.days[dayIndex]&&geometry.days[dayIndex].stops[stopIndex];
  showPlace(stop,'D'+day.index,portable&&portable.navigationUrl,marker);
}

document.querySelectorAll('[data-stop-key]').forEach((marker)=>{
  const activate=()=>{
    const parts=marker.dataset.stopKey.split(':').map(Number);
    showStop(parts[0],parts[1],marker);
  };
  marker.addEventListener('click',(event)=>{event.stopPropagation();activate();});
  marker.addEventListener('keydown',(event)=>{
    if(event.key==='Enter'||event.key===' '){
      event.preventDefault();
      event.stopPropagation();
      activate();
    }
  });
});

document.querySelectorAll('.atlas-stop__image').forEach((image)=>{
  image.addEventListener('error',()=>image.closest('.atlas-stop')?.classList.add('is-photo-error'));
});

document.getElementById('place-close').addEventListener('click',closeDetails);
stage.addEventListener('click',(event)=>{
  if(event.target.closest('[data-stop-key],[data-day-trigger]'))return;
  closeDetails();
  if(activeDayIndex!==null)setActiveDay(null);
});
window.addEventListener('keydown',(event)=>{
  if(event.key!=='Escape')return;
  if(!details.hidden)closeDetails();
  else if(activeDayIndex!==null)setActiveDay(null);
});
window.addEventListener('resize',()=>{
  renderScene();
  animateViewBox(activeDayIndex,true);
});
if('ResizeObserver'in window)new ResizeObserver(renderScene).observe(stage);

(scene.days||[]).forEach((day,index)=>{
  const layer=(dayLayerElements.get(day.id)||[])[0];
  if(layer){
    layer.style.setProperty('--layer-order',String(index));
    layer.style.setProperty('--day-color',days[index]&&days[index].color||'#4f8c7c');
  }
});
renderScene();
modeStatus.textContent=modeCopy.relative;
requestAnimationFrame(()=>guide.classList.add('is-ready'));
})();
`,S=1440,ee=900,C=1100,w=620,te=85.05112878,ne=6371e3,T={originX:720,originY:690,centerX:C/2,centerY:w/2,xAxisX:.84,xAxisY:.12,yAxisX:-.36,yAxisY:.44,firstLayerHeight:28,layerGap:40};function E(e){return Number(e.toFixed(2))}function D(e,t){return{x:E(e),y:E(t)}}function O(e,t){return{x:e,y:t}}function k(e,t,n){return Math.max(t,Math.min(n,e))}function A([e,t]){let n=k(t,-85.05112878,te),r=e*Math.PI/180,i=n*Math.PI/180;return O(r,-Math.log(Math.tan(Math.PI/4+i/2)))}function re(e,t){let n=(t[1]-e[1])*Math.PI/180,r=(t[0]-e[0])*Math.PI/180,i=e[1]*Math.PI/180,a=t[1]*Math.PI/180,o=Math.sin(n/2)**2+Math.cos(i)*Math.cos(a)*Math.sin(r/2)**2;return 2*ne*Math.atan2(Math.sqrt(o),Math.sqrt(1-o))}function j(e){return e.normalize(`NFKC`).toLocaleLowerCase(`zh-CN`).replace(/[\s·•.,，。()（）【】[\]_-]/g,``)}function M(e,t){let n=2166136261;for(let e of t)n^=e.codePointAt(0)??0,n=Math.imul(n,16777619);return`${e}-${(n>>>0).toString(36)}`}function ie(e,t){let n=e.stop.placeProvider?.placeId,r=t.stop.placeProvider?.placeId;if(n&&r&&n===r)return!0;let i=re(e.coordinate,t.coordinate);return i<=12||i<=250&&j(e.stop.name)===j(t.stop.name)}function ae(e){return n(e).days.flatMap((e,t)=>e.stops.map(({stop:e,coordinate:n},r)=>({key:`${t}:${r}`,stop:e,coordinate:n,projected:A(n),dayIndex:t,stopIndex:r})))}function oe(e){let t=e.map((e,t)=>t),n=e=>(t[e]!==e&&(t[e]=n(t[e])),t[e]),r=(e,r)=>{let i=n(e),a=n(r);i!==a&&(t[a]=i)};for(let t=0;t<e.length;t+=1)for(let n=t+1;n<e.length;n+=1)ie(e[t],e[n])&&r(t,n);let i=new Map;return e.forEach((e,t)=>{let r=n(t),a=i.get(r);a?a.push(e):i.set(r,[e])}),[...i.values()].map((e,t)=>{let n=[e.reduce((e,t)=>e+t.coordinate[0],0)/e.length,e.reduce((e,t)=>e+t.coordinate[1],0)/e.length],r=O(e.reduce((e,t)=>e+t.projected.x,0)/e.length,e.reduce((e,t)=>e+t.projected.y,0)/e.length),i=u(e[0].stop.city);return{key:`place-${t}`,name:e[0].stop.name,cityId:M(`guide-city`,i),coordinate:n,projected:r,occurrences:e}})}function N(e){let t=new Map((e.metro?.lines??[]).map(e=>[e.id,e])),n=new Map((e.metro?.stations??[]).map(e=>[e.id,e])),r=new Map(e.days.flatMap((e,t)=>e.stops.map(e=>[e.id,t]))),i=new Set,a=[];for(let n of e.metro?.journeys??[]){if(n.status!==`subway`)continue;let e=r.get(n.fromStopId);if(e!==void 0)for(let r of n.segments){let n=t.get(r.lineId);!n||r.path.length<2||(r.stationIds.forEach(e=>i.add(e)),a.push({id:r.id,lineId:n.id,lineName:n.name,color:n.color,cityId:M(`guide-city`,u(n.city)),dayIndex:e,stationIds:r.stationIds,projectedPath:r.path.map(A)}))}}return{stations:[...i].flatMap(e=>{let t=n.get(e);return t?[{id:t.id,name:t.name,cityId:M(`guide-city`,u(t.city)),lineIds:t.lineIds,projected:A(t.coordinate)}]:[]}),segments:a}}function P(e){if(e.length===0)return{minX:0,maxX:1,minY:0,maxY:1,width:1,height:1,centerX:.5,centerY:.5};let t=Math.min(...e.map(e=>e.x)),n=Math.max(...e.map(e=>e.x)),r=Math.min(...e.map(e=>e.y)),i=Math.max(...e.map(e=>e.y));return{minX:t,maxX:n,minY:r,maxY:i,width:Math.max(n-t,1e-6),height:Math.max(i-r,1e-6),centerX:(t+n)/2,centerY:(r+i)/2}}function F(e,t){let n=I(e,t);return e.map(n)}function I(e,t){let n=P(e),r=Math.min(t.width/n.width,t.height/n.height);return e=>D(t.center.x+(e.x-n.centerX)*r,t.center.y+(e.y-n.centerY)*r)}function se(e){let t=F(e.map(e=>e.projected),{center:D(C/2,w/2),width:920,height:470});return Object.fromEntries(e.map((e,n)=>[e.key,t[n]]))}function ce(e,t){let n=I(e.map(e=>e.projected),{center:D(C/2,w/2),width:920,height:470});return{stations:Object.fromEntries(t.stations.map(e=>[e.id,n(e.projected)])),segments:Object.fromEntries(t.segments.map(e=>[e.id,e.projectedPath.map(n)]))}}function L(e){let t=new Map;for(let n of e){let e=t.get(n.cityId);e?e.push(n):t.set(n.cityId,[n])}let n=[...t.entries()].map(([e,t])=>({cityId:e,center:O(t.reduce((e,t)=>e+t.projected.x,0)/t.length,t.reduce((e,t)=>e+t.projected.y,0)/t.length)}));if(n.length===0)return[];if(n.length===1)return[{cityId:n[0].cityId,center:D(550,310),width:860,height:470}];if(n.length===2){let[e,t]=n,r=Math.sign(t.center.x-e.center.x)||1,i=Math.sign(t.center.y-e.center.y)||-1,a=r*270,o=i*130;return[{cityId:e.cityId,center:D(550-a,310-o),width:440,height:320},{cityId:t.cityId,center:D(550+a,310+o),width:440,height:320}]}let r=F(n.map(e=>e.center),{center:D(550,305),width:700,height:360}),i=n.length<=4?340:280,a=n.length<=4?250:210;return n.map((e,t)=>({cityId:e.cityId,center:r[t],width:i,height:a}))}function R(e,t){let n=new Set;return e.days.forEach((e,r)=>{let i=e.stops.map((e,n)=>e.includeInRoute===!1?null:t.get(`${r}:${n}`)).filter(e=>!!e);for(let e=1;e<i.length;e+=1)i[e-1]!==i[e]&&n.add([i[e-1],i[e]].sort().join(`|`))}),[...n].map(e=>{let[t,n]=e.split(`|`);return[t,n]})}function z(e,t,n){let r=F(e.map(e=>e.projected),{center:t.center,width:Math.max(120,t.width-96),height:Math.max(100,t.height-88)}),i=new Map;e.forEach((e,t)=>i.set(e.key,D(Math.round(r[t].x/12)*12,Math.round(r[t].y/12)*12)));let a=new Map(e.map((e,t)=>[e.key,r[t]])),o=new Set(e.map(e=>e.key)),s=n.filter(([e,t])=>o.has(e)&&o.has(t)),c=e.length>13?52:e.length>8?60:68;for(let n=0;n<48;n+=1){for(let t of e){let e=i.get(t.key),n=a.get(t.key);e.x+=(n.x-e.x)*.08,e.y+=(n.y-e.y)*.08}for(let[e,t]of s){let n=i.get(e),r=i.get(t),a=r.x-n.x,o=r.y-n.y,s=Math.hypot(a,o)||1,c=(s-82)*.045,l=a/s,u=o/s;n.x+=l*c,n.y+=u*c,r.x-=l*c,r.y-=u*c}for(let t=0;t<e.length;t+=1)for(let n=t+1;n<e.length;n+=1){let r=i.get(e[t].key),a=i.get(e[n].key),o=a.x-r.x,s=a.y-r.y,l=Math.hypot(o,s)||.001;if(l>=c)continue;let u=(c-l)*.22,d=o/l,f=s/l;r.x-=d*u,r.y-=f*u,a.x+=d*u,a.y+=f*u}let n=t.width/2-30,r=t.height/2-28;for(let a of e){let e=i.get(a.key);e.x=k(e.x,t.center.x-n,t.center.x+n),e.y=k(e.y,t.center.y-r,t.center.y+r)}}return Object.fromEntries(e.map(e=>{let t=i.get(e.key);return[e.key,D(Math.round(t.x/4)*4,Math.round(t.y/4)*4)]}))}function B(e,t,n){let r=R(e,n),i=new Map(L(t).map(e=>[e.cityId,e])),a=new Map;for(let e of t){let t=a.get(e.cityId);t?t.push(e):a.set(e.cityId,[e])}return Object.assign({},...[...a.entries()].map(([e,t])=>{let n=i.get(e);return n?z(t,n,r):{}}))}function V(e,t){let n=new Map(L(e).map(e=>[e.cityId,e])),r={},i={},a=new Set([...t.stations.map(e=>e.cityId),...t.segments.map(e=>e.cityId)]);for(let o of a){let a=n.get(o);if(!a)continue;let s=e.filter(e=>e.cityId===o),c=t.stations.filter(e=>e.cityId===o),l=t.segments.filter(e=>e.cityId===o),u=I([...s.map(e=>e.projected),...c.map(e=>e.projected),...l.flatMap(e=>e.projectedPath)],{center:a.center,width:Math.max(120,a.width-70),height:Math.max(100,a.height-64)});for(let e of c)r[e.id]=u(e.projected);for(let e of l)i[e.id]=e.projectedPath.map(u)}return{stations:r,segments:i}}function H(e,t,n,r){let i=P(e),a=Math.max(n/2,i.width/2+t),o=Math.max(r/2,i.height/2+t),s=Math.min(30,a*.16,o*.2),{centerX:c,centerY:l}=i;return[D(c-a+s,l-o),D(c+a-s,l-o),D(c+a,l-o+s),D(c+a,l+o-s),D(c+a-s,l+o),D(c-a+s,l+o),D(c-a,l+o-s),D(c-a,l-o+s)]}function U(e,t){let n=P(e),r=Math.max(120,n.width/2+56),i=Math.max(92,n.height/2+48);return Array.from({length:14},(e,a)=>{let o=Math.PI*2*a/14,s=1+Math.sin((a+1)*2.17+t*.73)*.055;return D(n.centerX+Math.cos(o)*r*s,n.centerY+Math.sin(o)*i*s)})}function W(e,t,n,r,i,a,o){return{places:e,metroStations:r,metroSegments:i,cities:Object.fromEntries(t.map((t,n)=>{let s=a.filter(e=>e.cityId===t.id).map(e=>e.id),c=o.filter(e=>e.cityId===t.id).map(e=>e.id),l=[...t.placeKeys.map(t=>e[t]).filter(Boolean),...s.map(e=>r[e]).filter(Boolean),...c.flatMap(e=>i[e]??[])],u=P(l);return[t.id,{outline:U(l,n+1),label:D(u.centerX,u.centerY+Math.max(86,u.height/2+38))}]})),days:Object.fromEntries(n.map(t=>{let n=H((t.hullPlaceKeys.length?t.hullPlaceKeys:t.routePlaceKeys).map(t=>e[t]).filter(Boolean),46,230,150),r=P(n);return[t.id,{plane:n,label:D(k(r.minX-140,16,930),48)}]}))}}function G(e,t,n=0){let r=e.projection,i=t.x-r.centerX,a=t.y-r.centerY;return D(r.originX+i*r.xAxisX+a*r.yAxisX,r.originY+i*r.xAxisY+a*r.yAxisY-n)}function K(e,t){return e.projection.firstLayerHeight+t*e.projection.layerGap}function le(e){let t=ae(e),n=oe(t),r=N(e),i=new Map;n.forEach(e=>e.occurrences.forEach(t=>i.set(t.key,e)));let a=new Map([...i.entries()].map(([e,t])=>[e,t.key])),o=new Map,s=new Map;for(let e of n){let t=u(e.occurrences[0].stop.city);o.set(e.cityId,t);let n=s.get(e.cityId)??new Set;n.add(e.key),s.set(e.cityId,n)}for(let t of r.stations){s.has(t.cityId)||s.set(t.cityId,new Set);let n=e.metro?.stations.find(e=>e.id===t.id);n&&o.set(t.cityId,u(n.city))}let c=[...s.entries()].map(([e,t])=>({id:e,name:o.get(e)??`待定城市`,placeKeys:[...t]})),l=t.map(e=>{let t=i.get(e.key);return{key:e.key,id:e.stop.id,placeKey:t.key,cityId:t.cityId,dayIndex:e.dayIndex,stopIndex:e.stopIndex}}),d=new Map(l.map(e=>[e.id,e])),f=e.days.map((e,t)=>({id:e.id,index:e.index,city:e.city,title:e.title,routeTitle:e.routeTitle,durationLabel:e.durationLabel,color:e.color,routePlaceKeys:e.stops.flatMap((e,n)=>e.includeInRoute===!1?[]:[a.get(`${t}:${n}`)]),hullPlaceKeys:e.stops.flatMap((e,n)=>e.includeInHull===!1?[]:[a.get(`${t}:${n}`)]),stopKeys:e.stops.map((e,n)=>`${t}:${n}`)})),p=n.map(e=>({key:e.key,name:e.name,cityId:e.cityId,stopKeys:e.occurrences.map(e=>e.key)})),m=n.flatMap(e=>{let t=[...new Set(e.occurrences.map(e=>e.dayIndex))].sort((e,t)=>e-t);return t.length<2?[]:[{id:M(`shared-place`,e.key),name:e.name,placeKey:e.key,stopKeys:e.occurrences.map(e=>e.key),dayIndexes:t}]}),h=e.transfers.flatMap(e=>{let t=d.get(e.fromStopId),n=d.get(e.toStopId);return!t||!n?[]:[{id:e.id,label:e.label,mode:e.mode,fromStopKey:t.key,toStopKey:n.key}]}),g=r.stations.map(e=>({id:e.id,name:e.name,cityId:e.cityId,lineIds:e.lineIds})),_=r.segments.map(e=>({id:e.id,lineId:e.lineId,lineName:e.lineName,color:e.color,cityId:e.cityId,dayIndex:e.dayIndex,stationIds:e.stationIds})),v=se(n),y=ce(n,r),b=B(e,n,a),x=V(n,r);return{viewBox:{width:S,height:ee},plane:{width:C,height:w},projection:T,places:p,stops:l,cities:c,days:f,sharedPlaces:m,transfers:h,metroStations:g,metroSegments:_,modes:{relative:W(b,c,f,x.stations,x.segments,g,_),geographic:W(v,c,f,y.stations,y.segments,g,_)}}}function q(e){return Number(e.toFixed(2)).toString()}function J(e){return`${q(e.x)},${q(e.y)}`}function Y(e){return e.map(J).join(` `)}function X(e,t,n=0){return t.map(t=>G(e,t,n))}function Z(e){return e.length<2?``:l(a(e.map(e=>[e.x,e.y])))}function ue(e){return Math.max(52,Math.min(138,22+[...e].length*14))}function de(e,t,n){let i=t.modes.relative,o=new Map(t.stops.map(e=>[e.key,e])),s=t.stops.flatMap(t=>{let i=e.document.days[t.dayIndex]?.stops[t.stopIndex];return!i||!r(i,n.get(i.id)??[])?[]:[`<clipPath id="guide-photo-${t.dayIndex}-${t.stopIndex}" clipPathUnits="userSpaceOnUse"><circle cx="0" cy="0" r="17" /></clipPath>`]}).join(``),c=t.cities.map(e=>{let n=i.cities[e.id],r=X(t,n.outline),a=G(t,n.label);return`<g class="map-city" data-city-id="${d(e.id)}">
      <polygon class="map-city__surface" data-city-outline="${d(e.id)}" points="${Y(r)}" />
      <polygon class="map-city__contour" data-city-outline="${d(e.id)}" points="${Y(r)}" />
      <g class="map-city__label" data-city-label="${d(e.id)}" transform="translate(${q(a.x)} ${q(a.y)})">
        <text class="map-city__name" text-anchor="middle">${d(e.name)}</text>
      </g>
    </g>`}).join(``),u=t.metroSegments.map(e=>{let n=i.metroSegments[e.id]??[];if(n.length<2)return``;let r=Z(X(t,n)),a=p(e.color);return`<g class="atlas-metro-segment" data-metro-day-index="${e.dayIndex}" style="--metro-color:${a}">
      <path class="atlas-metro__underlay" data-metro-segment="${d(e.id)}" d="${r}" />
      <path class="atlas-metro__route" data-metro-segment="${d(e.id)}" d="${r}" />
      <path class="atlas-metro__stitch" data-metro-segment="${d(e.id)}" d="${r}" />
    </g>`}).join(``),f=new Map(t.metroSegments.map(e=>[e.lineId,e])),m=t.metroStations.map(e=>{let n=i.metroStations[e.id];if(!n)return``;let r=G(t,n),a=p(e.lineIds.map(e=>f.get(e)).find(Boolean)?.color??`#4f8c7c`);return`<g class="atlas-metro-station${e.lineIds.length>1?` is-interchange`:``}" data-metro-station="${d(e.id)}" transform="translate(${q(r.x)} ${q(r.y)})" style="--metro-color:${a}">
      <circle r="${e.lineIds.length>1?5.5:4.5}" />
      <title>${d(e.name)}</title>
    </g>`}).join(``),h=new Set,g=t.metroSegments.flatMap(e=>{if(h.has(e.lineId))return[];let n=i.metroSegments[e.id]??[],r=n[Math.floor(n.length/2)];if(!r)return[];h.add(e.lineId);let a=G(t,r);return[`<text class="atlas-metro-label" data-metro-label="${d(e.lineId)}" data-metro-label-segment="${d(e.id)}" transform="translate(${q(a.x)} ${q(a.y-12)})" text-anchor="middle" style="--metro-color:${p(e.color)}">${d(e.lineName)}</text>`]}).join(``),_=t.sharedPlaces.map(e=>{let n=i.places[e.placeKey],r=K(t,e.dayIndexes[0]),a=K(t,e.dayIndexes.at(-1)??e.dayIndexes[0]),o=G(t,n,r),s=G(t,n,a);return`<g class="shared-place" data-shared-place="${d(e.id)}" aria-label="${d(e.name)}跨日连接">
      <path class="shared-place__halo" data-shared-stem="${d(e.id)}" d="M ${J(o)} L ${J(s)}" />
      <path class="shared-place__stem" data-shared-stem="${d(e.id)}" d="M ${J(o)} L ${J(s)}" />
    </g>`}).join(``),v=t.transfers.map(e=>{let n=o.get(e.fromStopKey),r=o.get(e.toStopKey);if(!n||!r)return``;let s=G(t,i.places[n.placeKey],K(t,n.dayIndex)),c=G(t,i.places[r.placeKey],K(t,r.dayIndex)),u=a([[s.x,s.y],[c.x,c.y]]);return`<g class="atlas-transfer" data-transfer-id="${d(e.id)}">
      <path class="atlas-transfer__underlay" data-transfer-path="${d(e.id)}" d="${l(u)}" />
      <path class="atlas-transfer__route" data-transfer-path="${d(e.id)}" d="${l(u)}" />
    </g>`}).join(``),y=t.days.map((a,s)=>{let c=e.document.days[s],l=i.days[a.id],u=K(t,s),f=X(t,l.plane,u),m=Z(a.routePlaceKeys.map(e=>G(t,i.places[e],u))),h=p(c.color),g=a.stopKeys.map((e,l)=>{let f=o.get(e);if(!f)return``;let p=c.stops[f.stopIndex],m=G(t,i.places[f.placeKey],u),h=r(p,n.get(p.id)??[]),g=ue(p.name),_=h?`<circle class="atlas-stop__fallback" r="17" /><path class="atlas-stop__fallback-icon" d="M0-7c-4 0-7.1 3.1-7.1 7.2C-7.1 5 0 10.4 0 10.4S7.1 5 7.1.2C7.1-3.9 4-7 0-7Zm0 4a3.1 3.1 0 1 1 0 6.2A3.1 3.1 0 0 1 0-3Z" /><image class="atlas-stop__image" href="${d(h.src)}" x="-17" y="-17" width="34" height="34" clip-path="url(#guide-photo-${s}-${f.stopIndex})" preserveAspectRatio="xMidYMid slice" aria-hidden="true" />`:`<circle class="atlas-stop__pin atlas-stop__fallback" r="17" /><path class="atlas-stop__fallback-icon" d="M0-7c-4 0-7.1 3.1-7.1 7.2C-7.1 5 0 10.4 0 10.4S7.1 5 7.1.2C7.1-3.9 4-7 0-7Zm0 4a3.1 3.1 0 1 1 0 6.2A3.1 3.1 0 0 1 0-3Z" />`;return`<g class="atlas-stop${l===0||l===a.stopKeys.length-1?` is-route-anchor`:``}" data-stop-key="${f.key}" data-place-key="${f.placeKey}" data-photo-source="${h?.source??`fallback`}" transform="translate(${q(m.x)} ${q(m.y)})" role="button" tabindex="0" aria-label="第 ${c.index} 天第 ${f.stopIndex+1} 站，${d(p.name)}">
        <circle class="atlas-stop__hit" r="23" />
        ${_}
        <circle class="atlas-stop__frame" r="19" />
        <circle class="atlas-stop__number-badge" cx="-15" cy="-14" r="9" />
        <text class="atlas-stop__number" x="-15" y="-14" text-anchor="middle" dominant-baseline="central">${f.stopIndex+1}</text>
        <rect class="atlas-stop__name-bg" x="${q(-g/2)}" y="24" width="${g}" height="23" rx="7" />
        <text class="atlas-stop__name" x="0" y="39" text-anchor="middle">${d(p.name)}</text>
      </g>`}).join(``);return`<g class="atlas-day" data-day-index="${s}" data-day-id="${d(a.id)}" style="--day-color:${h}">
      <polygon class="atlas-day__hull" data-day-plane="${d(a.id)}" points="${Y(f)}" />
      ${m?`<path class="atlas-day__route-underlay" data-day-route="${d(a.id)}" d="${m}" /><path class="atlas-day__route" data-day-route="${d(a.id)}" d="${m}" stroke-dasharray="9 8" stroke-linecap="round" stroke-linejoin="round" />`:``}
      ${g}
    </g>`}).join(``),b=t.days.map((n,r)=>{let a=e.document.days[r],o=i.days[n.id],s=G(t,o.label,K(t,r));return`<g class="atlas-day-label" data-day-label="${d(n.id)}" data-day-trigger="${r}" transform="translate(${q(s.x)} ${q(s.y)})" role="button" tabindex="0" aria-label="聚焦第 ${a.index} 天，${d(a.city)}" style="--day-color:${p(a.color)}">
      <rect x="-8" y="-13" width="118" height="32" rx="8" />
      <text class="atlas-day-label__day" x="4" y="7">D${a.index}</text>
      <text class="atlas-day-label__name" x="30" y="7">${d(a.city)}</text>
    </g>`}).join(``);return`<svg id="atlas" class="atlas" viewBox="0 0 ${t.viewBox.width} ${t.viewBox.height}" role="group" aria-labelledby="atlas-title atlas-description" preserveAspectRatio="xMidYMid meet" data-stop-count="${t.stops.length}">
    <title id="atlas-title">${d(e.document.title)}旅行路线</title>
    <desc id="atlas-description">按天叠放的旅行路线。可切换示意布局和实景布局，点击日期标签或地点查看重点。</desc>
    <defs>${s}</defs>
    <g id="scene-camera" class="scene-camera">
      <g class="map-plane" aria-label="城市底图">${c}</g>
      <g class="metro-network-layer" aria-label="相关地铁线路">${u}${m}${g}</g>
      <g class="shared-place-layer" aria-label="跨日共享地点">${_}</g>
      <g class="transfer-layer" aria-label="跨日交通">${v}</g>
      <g class="day-layer-stack" aria-label="每日行程平面">${y}</g>
      <g class="day-label-stack" aria-label="每日行程标签">${b}</g>
    </g>
  </svg>`}var fe=String.raw`
:root {
  color-scheme: light;
  --guide-canvas: #e6f3ed;
  --guide-canvas-deep: #d7e9e1;
  --guide-paper: #fffef9;
  --guide-paper-soft: #f6fbf8;
  --guide-ink: #253d39;
  --guide-muted: #647773;
  --guide-line: #bfd7ce;
  --guide-sea: #4e998d;
  --guide-leaf: #6c9872;
  --guide-coral: #dc735d;
  --guide-sun: #e2aa55;
  --guide-focus: #246a78;
  --guide-shadow: 0 10px 24px rgb(34 72 62 / 0.12);
  --guide-radius: 0.75rem;
  --guide-ease: cubic-bezier(0.22, 1, 0.36, 1);
  --z-scene: 0;
  --z-hud: 10;
  --z-card: 20;
  --font-ui: "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei UI", "Microsoft YaHei", "Noto Sans CJK SC", "Noto Sans SC", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-family: var(--font-ui);
  color: var(--guide-ink);
  background: var(--guide-canvas);
  font-kerning: normal;
}

* { box-sizing: border-box; }
html, body, #guide { width: 100%; height: 100%; margin: 0; overflow: clip; }
body { min-width: 20rem; background: var(--guide-canvas); }
button, a { font: inherit; }
button { color: inherit; }
[hidden] { display: none !important; }

.guide {
  position: relative;
  isolation: isolate;
  width: 100%;
  height: 100%;
  overflow: clip;
  background: linear-gradient(180deg, #eef8f4 0%, var(--guide-canvas) 57%, var(--guide-canvas-deep) 100%);
}

.atlas-stage {
  position: absolute;
  z-index: var(--z-scene);
  inset: 0;
  overflow: hidden;
}

.atlas {
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  overflow: visible;
  touch-action: manipulation;
}

.scene-camera { transform-origin: center; }

.map-city__surface {
  fill: #d9ebe1;
  fill-opacity: 0.94;
  stroke: #91b9aa;
  stroke-width: 1.2;
  vector-effect: non-scaling-stroke;
}

.map-city__contour {
  fill: none;
  stroke: #afccc0;
  stroke-width: 1;
  stroke-dasharray: 1 7;
  stroke-linecap: round;
  vector-effect: non-scaling-stroke;
}

.map-city__label { pointer-events: none; }
.map-city__name {
  fill: #3e7369;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  paint-order: stroke;
  stroke: #eff8f4;
  stroke-width: 5;
  stroke-linejoin: round;
}

.atlas-metro__underlay,
.atlas-metro__route,
.atlas-metro__stitch,
.atlas-day__route-underlay,
.atlas-day__route,
.atlas-transfer__underlay,
.atlas-transfer__route,
.shared-place__halo,
.shared-place__stem {
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
  vector-effect: non-scaling-stroke;
  pointer-events: none;
}

.atlas-metro__underlay {
  stroke: #fffef9;
  stroke-opacity: 0.95;
  stroke-width: 8;
}

.atlas-metro__route {
  stroke: var(--metro-color);
  stroke-opacity: 0.84;
  stroke-width: 3.5;
}

.atlas-metro__stitch {
  stroke: #fffef9;
  stroke-opacity: 0.9;
  stroke-width: 1;
  stroke-dasharray: 1 8;
}

.atlas-metro-station circle {
  fill: #fffef9;
  stroke: var(--metro-color);
  stroke-width: 2;
  vector-effect: non-scaling-stroke;
}

.atlas-metro-station.is-interchange circle { stroke-width: 3; }
.atlas-metro-label {
  fill: #58756e;
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  paint-order: stroke;
  stroke: #fffef9;
  stroke-width: 4;
  stroke-linejoin: round;
  pointer-events: none;
}
.atlas-metro-segment,
.atlas-metro-station,
.atlas-metro-label {
  transition: opacity 220ms var(--guide-ease);
  pointer-events: none;
}
.atlas-metro-segment.is-muted,
.atlas-metro-station.is-muted,
.atlas-metro-label.is-muted { opacity: 0.15; }

.atlas-day {
  --layer-order: 0;
  transition: opacity 220ms var(--guide-ease), filter 220ms var(--guide-ease);
}
.atlas-day.is-muted { opacity: 0.18; filter: saturate(0.4); }
.atlas-day.is-focused { filter: saturate(1.06); }
.atlas-day.is-muted .atlas-stop { pointer-events: none; }

.atlas-day__hull {
  fill: var(--day-color);
  fill-opacity: 0.07;
  stroke: var(--day-color);
  stroke-opacity: 0.4;
  stroke-width: 1.25;
  stroke-dasharray: 2 8;
  stroke-linecap: round;
  stroke-linejoin: round;
  vector-effect: non-scaling-stroke;
  pointer-events: none;
}

.atlas-day__route-underlay {
  stroke: #fffef9;
  stroke-opacity: 0.96;
  stroke-width: 7;
}
.atlas-day__route {
  stroke: var(--day-color);
  stroke-width: 2.75;
}

.atlas-transfer__underlay { stroke: #fffef9; stroke-width: 6; }
.atlas-transfer__route {
  stroke: #6b8c83;
  stroke-width: 2;
  stroke-dasharray: 3 7;
}

.shared-place__halo { stroke: #fffef9; stroke-width: 6; }
.shared-place__stem {
  stroke: var(--guide-sun);
  stroke-width: 2.25;
  stroke-dasharray: 2 6;
}
.shared-place,
.atlas-transfer { transition: opacity 220ms var(--guide-ease); }
.shared-place.is-muted,
.atlas-transfer.is-muted { opacity: 0.14; }

.atlas-day-label {
  cursor: pointer;
  outline: none;
  transform-origin: 0 0;
  transition: opacity 220ms var(--guide-ease), filter 220ms var(--guide-ease);
}
.atlas-day-label.is-muted { opacity: 0.24; filter: saturate(0.45); }
.atlas-day-label.is-focused { filter: saturate(1.1); }
.atlas-day-label rect {
  fill: #fffef9;
  stroke: var(--day-color);
  stroke-width: 1.25;
  vector-effect: non-scaling-stroke;
}
.atlas-day-label__day {
  fill: var(--day-color);
  font-size: 0.8125rem;
  font-weight: 800;
}
.atlas-day-label__name {
  fill: #354d47;
  font-size: 0.8125rem;
  font-weight: 650;
}
.atlas-day-label:focus-visible rect { stroke: var(--guide-focus); stroke-width: 3; }

.atlas-stop {
  cursor: pointer;
  outline: none;
  transform-origin: 0 0;
}
.atlas-stop__hit { fill: transparent; }
.atlas-stop__fallback { fill: #fffef9; }
.atlas-stop__fallback-icon { fill: var(--day-color); pointer-events: none; }
.atlas-stop__frame {
  fill: none;
  stroke: #fffef9;
  stroke-width: 4;
  vector-effect: non-scaling-stroke;
  pointer-events: none;
}
.atlas-stop__number-badge {
  fill: #fffef9;
  stroke: var(--day-color);
  stroke-width: 1.75;
  vector-effect: non-scaling-stroke;
  pointer-events: none;
}
.atlas-stop__number {
  fill: #314a44;
  font-size: 0.6875rem;
  font-weight: 800;
  pointer-events: none;
}
.atlas-stop__name-bg {
  fill: #fffef9;
  fill-opacity: 0.96;
  opacity: 0;
  stroke: #c7ddd3;
  stroke-width: 1;
  transition: opacity 160ms var(--guide-ease);
  vector-effect: non-scaling-stroke;
  pointer-events: none;
}
.atlas-stop__name {
  fill: #304943;
  font-size: 0.8125rem;
  font-weight: 650;
  opacity: 0;
  transition: opacity 160ms var(--guide-ease);
  pointer-events: none;
}
.atlas-stop.is-selected .atlas-stop__name-bg,
.atlas-stop.is-selected .atlas-stop__name,
.atlas-stop:hover .atlas-stop__name-bg,
.atlas-stop:hover .atlas-stop__name,
.atlas-stop:focus-visible .atlas-stop__name-bg,
.atlas-stop:focus-visible .atlas-stop__name,
.atlas-day.is-focused .atlas-stop.is-route-anchor .atlas-stop__name-bg,
.atlas-day.is-focused .atlas-stop.is-route-anchor .atlas-stop__name {
  opacity: 1;
}
.atlas-stop.is-selected .atlas-stop__frame { stroke: var(--guide-sun); stroke-width: 6; }
.atlas-stop:focus-visible .atlas-stop__frame { stroke: var(--guide-focus); stroke-width: 5; }
.atlas-stop.is-photo-error .atlas-stop__image { display: none; }
.atlas-stop.is-photo-error .atlas-stop__fallback { display: block; }

.guide-titlebar,
.guide-controls,
.place-card { z-index: var(--z-hud); }

.guide-titlebar {
  position: absolute;
  top: max(1rem, env(safe-area-inset-top));
  left: max(1rem, env(safe-area-inset-left));
  max-width: min(30rem, calc(100vw - 10rem));
  padding: 0.75rem 1rem;
  border: 1px solid rgb(144 184 170 / 0.82);
  border-radius: var(--guide-radius);
  background: rgb(255 254 249 / 0.94);
  box-shadow: 0 5px 14px rgb(40 82 69 / 0.08);
}
.guide-titlebar h1 {
  margin: 0;
  color: var(--guide-ink);
  font-size: clamp(1.125rem, 2vw, 1.5rem);
  font-weight: 750;
  line-height: 1.25;
  letter-spacing: 0.01em;
}

.guide-controls {
  position: absolute;
  top: max(1rem, env(safe-area-inset-top));
  right: max(1rem, env(safe-area-inset-right));
  padding: 0.25rem;
  border: 1px solid rgb(144 184 170 / 0.82);
  border-radius: 0.7rem;
  background: rgb(255 254 249 / 0.94);
  box-shadow: 0 5px 14px rgb(40 82 69 / 0.08);
}
.mode-switch { display: flex; gap: 0.125rem; }
.mode-switch button,
.place-card__close,
.place-card__navigation {
  min-height: 2.5rem;
  border: 0;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: transform 130ms ease, color 160ms ease, background-color 160ms ease, border-color 160ms ease;
}
.mode-switch button {
  min-width: 4.6rem;
  padding: 0 0.75rem;
  color: var(--guide-muted);
  background: transparent;
  font-size: 0.875rem;
  font-weight: 700;
}
.mode-switch button[aria-pressed="true"] {
  color: #fffef9;
  background: var(--guide-sea);
}
.mode-switch button:active,
.place-card__close:active,
.place-card__navigation:active { transform: scale(0.97); }

.place-card {
  position: absolute;
  z-index: var(--z-card);
  width: min(21.5rem, calc(100vw - 2rem));
  padding: 0.875rem;
  overflow: hidden;
  border: 1px solid #b8d4c9;
  border-radius: 0.875rem;
  background: var(--guide-paper);
  box-shadow: var(--guide-shadow);
  transform-origin: center;
}
.detail-connector {
  position: absolute;
  z-index: calc(var(--z-card) - 1);
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
  pointer-events: none;
}
.detail-connector path {
  fill: none;
  stroke: var(--guide-sea);
  stroke-width: 1.25;
  stroke-dasharray: 2 7;
  stroke-linecap: round;
  vector-effect: non-scaling-stroke;
}
.place-card.is-opening { animation: guide-card-in 220ms var(--guide-ease) both; }
.place-card__close {
  position: absolute;
  z-index: 1;
  top: 0.65rem;
  right: 0.65rem;
  display: grid;
  width: 2.25rem;
  min-height: 2.25rem;
  padding: 0;
  place-items: center;
  border: 1px solid #c9ddd4;
  color: #56716a;
  background: #fffef9;
  font-size: 1.35rem;
  line-height: 1;
}
.place-card__cover {
  height: 8.5rem;
  margin: -0.875rem -0.875rem 0.75rem;
  overflow: hidden;
  background: var(--guide-paper-soft);
}
.place-card__cover img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.place-card__meta {
  margin: 0 2.75rem 0.25rem 0;
  color: var(--guide-coral);
  font-size: 0.8125rem;
  font-weight: 750;
  font-variant-numeric: tabular-nums;
}
.place-card h2 {
  margin: 0 2.5rem 0 0;
  color: var(--guide-ink);
  font-size: 1.25rem;
  font-weight: 750;
  line-height: 1.28;
}
.place-card__short {
  margin: 0.6rem 0 0;
  color: #3e5750;
  font-size: 0.9375rem;
  font-weight: 650;
  line-height: 1.45;
}
.place-card__summary {
  display: -webkit-box;
  margin: 0.4rem 0 0;
  overflow: hidden;
  color: var(--guide-muted);
  font-size: 0.875rem;
  line-height: 1.52;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
.place-card__navigation {
  display: inline-flex;
  min-width: 8.25rem;
  align-items: center;
  justify-content: center;
  margin-top: 0.75rem;
  padding: 0 0.9rem;
  color: #fffef9;
  background: var(--guide-sea);
  font-size: 0.875rem;
  font-weight: 700;
  text-decoration: none;
}
.place-card__short:empty,
.place-card__summary:empty { display: none; }

.empty-message {
  position: absolute;
  inset: 50% auto auto 50%;
  z-index: 2;
  margin: 0;
  transform: translate(-50%, -50%);
  color: var(--guide-muted);
  font-size: 1rem;
  font-weight: 650;
}
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.mode-switch button:focus-visible,
.place-card__close:focus-visible,
.place-card__navigation:focus-visible {
  outline: 3px solid var(--guide-focus);
  outline-offset: 2px;
}

@media (hover: hover) {
  .mode-switch button:hover { color: var(--guide-ink); background: #eff8f4; }
  .mode-switch button[aria-pressed="true"]:hover { color: #fffef9; background: #3f8d81; }
  .place-card__navigation:hover { background: #3f8d81; }
}

@keyframes guide-card-in {
  from { opacity: 0; transform: translateY(0.35rem) scale(0.985); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

@keyframes guide-layer-arrive {
  from { opacity: 0; transform: translateY(0.65rem); }
  to { opacity: 1; transform: translateY(0); }
}

.guide.is-ready .atlas-day {
  animation: guide-layer-arrive 420ms var(--guide-ease) both;
  animation-delay: calc(var(--layer-order) * 38ms);
}

@media (max-width: 48rem) {
  .guide-titlebar {
    top: max(0.75rem, env(safe-area-inset-top));
    left: max(0.75rem, env(safe-area-inset-left));
    max-width: calc(100vw - 8.5rem);
    padding: 0.625rem 0.75rem;
  }
  .guide-titlebar h1 { font-size: 1.05rem; }
  .guide-controls {
    top: auto;
    right: max(0.75rem, env(safe-area-inset-right));
    bottom: max(0.75rem, env(safe-area-inset-bottom));
    left: max(0.75rem, env(safe-area-inset-left));
    display: flex;
    justify-content: center;
  }
  .mode-switch { width: 100%; }
  .mode-switch button { min-width: 0; flex: 1; }
  .atlas-day-label__name { display: none; }
  .atlas-day-label rect { width: 40px; }
  .atlas-day-label__day { font-size: 0.75rem; }
  .atlas-transfer { display: none; }
  .place-card {
    right: 0 !important;
    bottom: 0 !important;
    left: 0 !important;
    top: auto !important;
    width: 100%;
    padding-bottom: max(0.875rem, env(safe-area-inset-bottom));
    border-right: 0;
    border-bottom: 0;
    border-left: 0;
    border-radius: 0.875rem 0.875rem 0 0;
  }
  .place-card__cover {
    height: min(30vh, 10rem);
  }
  .detail-connector { display: none; }
  .guide:has(.place-card:not([hidden])) .guide-controls { opacity: 0; pointer-events: none; }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
`,pe=`travel-map-studio/standalone-guide`,Q=new Map;function $(e,n=Q){let r=t(e),a=_(r),o=y(r,n),c=b(o),l=le(r.document),u=f(i(r).trim()),p=f(JSON.stringify(a)),m=f(JSON.stringify(o)),h=f(JSON.stringify(l)),g=de(r,l,c),v=d(r.document.title),S=s();return`<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
  <meta name="theme-color" content="#e6f3ed">
  <meta name="travel-map-studio-export" content="standalone-guide-v1">
  <meta name="generator" content="Lieflat HTML Deck">
  <meta name="template-origin" content="Lieflat HTML Deck template">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; img-src data: blob: https:; base-uri 'none'; form-action 'none'">
  <title>${v} · Travel Map Studio</title>
  <style>${fe}</style>
</head>
<body>
  <main id="guide" class="guide" data-guide-format="${pe}" data-layout-mode="relative">
    <section id="atlas-stage" class="atlas-stage" aria-label="旅行路线地图">
      ${g}
      ${r.document.days.length===0?`<p class="empty-message">这个项目还没有行程。</p>`:``}
    </section>

    <header class="guide-titlebar">
      <h1 id="guide-title"></h1>
    </header>

    <section id="guide-controls" class="guide-controls" aria-label="攻略视图控制">
      <div class="mode-switch" role="group" aria-label="地图布局模式">
        <button type="button" data-layout-mode="relative" aria-pressed="true">示意</button>
        <button type="button" data-layout-mode="geographic" aria-pressed="false">实景</button>
      </div>
    </section>
    <p id="mode-status" class="sr-only" role="status" aria-live="polite"></p>

    <svg id="detail-connector" class="detail-connector" aria-hidden="true" hidden><path id="detail-connector-path" /></svg>
    <aside id="place-card" class="place-card" aria-labelledby="place-title" aria-hidden="true" hidden>
      <button id="place-close" class="place-card__close" type="button" aria-label="关闭地点详情">×</button>
      <div id="place-cover" class="place-card__cover" hidden></div>
      <p id="place-meta" class="place-card__meta"></p>
      <h2 id="place-title"></h2>
      <p id="place-short" class="place-card__short"></p>
      <p id="place-summary" class="place-card__summary"></p>
      <a id="place-navigation" class="place-card__navigation" target="_blank" rel="noreferrer noopener">在高德地图查看</a>
    </aside>
  </main>
  <script id="${S}" type="application/json">${u}<\/script>
  <script id="tms-geometry" type="application/json">${p}<\/script>
  <script id="tms-display-media" type="application/json">${m}<\/script>
  <script id="tms-scene" type="application/json">${h}<\/script>
  <script>${x}<\/script>
</body>
</html>`}function me(e,t=Q){let n=$(e,t),r=new Blob([n],{type:`text/html;charset=utf-8`});o(r,`${c(e.document.title,`travel-map-guide`)}.guide.html`)}export{$ as createStandaloneGuideHtml,me as downloadStandaloneGuide,f as escapeJsonForHtml};