/* VishwaMotion.init(root), .setEnabled(bool), .setPaused(bool), .replay(), .destroy(). */
(()=>{'use strict';
 const html=document.documentElement, NS='http://www.w3.org/2000/svg';
 const media=matchMedia('(prefers-reduced-motion: reduce)');
 let initialized=false,enabled=!media.matches,paused=false,frame=0,last=0,clock=0,dirty=true;
 let scope=document,observers=[],sections=[],groups=[],cleanups=[],active=new Set(),pointer={x:0,y:0};
 const q=(s,r=scope)=>r.querySelector(s),all=(s,r=scope)=>[...r.querySelectorAll(s)];
 const clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n));
 function listen(target,event,fn,options){target.addEventListener(event,fn,options);cleanups.push(()=>target.removeEventListener(event,fn,options));}
 function flags(){html.classList.toggle('vm-on',enabled);html.classList.toggle('vm-off',!enabled);html.classList.toggle('vm-paused',paused||document.hidden);document.dispatchEvent(new CustomEvent('vishwa:motion',{detail:{enabled,paused,reduced:media.matches}}));}
 function running(){return initialized&&enabled&&!paused&&!document.hidden&&!media.matches;}
 function wake(){dirty=true;if(running()&&!frame)frame=requestAnimationFrame(tick);}
 function makeGroup(selector,items,interval=850,related=[]){const el=q(selector);if(el){groups.push({el,items:all(items,el),interval,previous:-1,time:0,related});}}
 async function setupChart(){
   const img=q('.gpu-chart-img');if(!img||img.tagName.toLowerCase()!=='img')return;
   try{const source=document.getElementById('vm-chart-source')?.innerHTML||await(await fetch(img.src)).text();if(!initialized)return;const svg=new DOMParser().parseFromString(source,'image/svg+xml').documentElement;if(svg.tagName.toLowerCase()!=='svg')return;svg.classList.add('gpu-chart-img');all('g[fill="none"] path',svg).forEach((p,i)=>{p.classList.add('vm-chart-line');p.setAttribute('pathLength','1');p.style.setProperty('--vm-delay',`${i*170}ms`)});img.replaceWith(svg);cleanups.push(()=>svg.replaceWith(img))}catch{/* The original chart remains available when enhancement cannot load. */}
 }
 function trailSvg(svg){
   if(!svg)return;
   all('.vm-trails',svg).forEach(x=>x.remove());
   const paths=all('path',svg).filter(x=>!x.closest('defs'));
   if(!paths.length)return;
   const g=document.createElementNS(NS,'g');g.classList.add('vm-trails');g.setAttribute('aria-hidden','true');
   paths.forEach((p,i)=>{const clone=p.cloneNode(false);clone.removeAttribute('id');clone.setAttribute('pathLength','100');clone.setAttribute('class','vm-trail');clone.style.setProperty('--vm-delay',`${i*-.32}s`);if(svg.classList.contains('gate-lines')&&i%2===1)clone.style.animationDirection='reverse';g.append(clone);});svg.append(g);
 }
 function refreshPaths(){all('.gate-lines,.routing-lines').forEach(trailSvg);}
 // Reuse source geometry; never reposition, transform or resize the orbit nodes.
 // The former independent outer ring also drifted out of sync with node activation.
 function setupOrbit(){
   const section=q('#improvement');if(!section)return;
   const svg=q('.orbit-svg',section),group=groups.find(g=>g.el===section);if(!svg||!group)return;
   all('.vm-orbit-motion,.vm-orbit-trail',svg).forEach(el=>el.remove());
   const paths=all('path',svg).filter(path=>path.parentElement===svg);
   if(paths.length!==group.items.length)return;
   const overlay=document.createElementNS(NS,'g');overlay.setAttribute('class','vm-orbit-motion');overlay.setAttribute('aria-hidden','true');
   group.orbitSegments=paths.map(path=>{const segment=path.cloneNode(false);segment.removeAttribute('id');segment.removeAttribute('marker-end');segment.setAttribute('class','vm-orbit-segment');segment.setAttribute('pathLength','100');overlay.append(segment);return segment});
   svg.append(overlay);
 }
 function updateOrbit(group,step){
   if(!group.orbitSegments)return;
   const phase=(group.time%group.interval)/group.interval;
   const energy=step<group.items.length?Math.sin(phase*Math.PI):0;
   group.orbitSegments.forEach((segment,i)=>{segment.style.setProperty('--vm-orbit-opacity',i===step?String(energy*.9):'0');if(i===step)segment.style.setProperty('--vm-orbit-offset',String(14-phase*114))});
   group.el.style.setProperty('--vm-orbit-energy',energy.toFixed(3));
 }
 function init(root=document){
   if(initialized)return;scope=root;if(!q('#home'))return;
   initialized=true;flags();sections=all('main>section');
   all('.reveal').forEach(x=>x.classList.add('reveal-in'));
   const targets=all('.section-heading>.eyebrow,.section-heading>h2,.section-heading>.subtitle,.finance-card,.compute-band,.gate-diagram,.gate-aside,.privacy-illustration,.privacy-card,.signal-grid>article,.fixed-card,.orbit,.compute-dashboard,.record-flow,.value-cards>article,.execution-record,.integration-surfaces,.developer-panel,.developer-steps>article,.security-cards>article,.programs,.security-flow,.domain-stories>article,.article-card,.faq-grid>details,.strap,.final-cta');
   const revealObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('vm-seen');revealObserver.unobserve(e.target)}}),{threshold:.08,rootMargin:'0px 0px -24px 0px'});
   targets.forEach(el=>{el.dataset.vmReveal='';const sib=[...el.parentElement.children].indexOf(el);el.style.setProperty('--vm-delay',`${Math.min(sib,3)*65}ms`);revealObserver.observe(el)});observers.push(revealObserver);
   const viewObserver=new IntersectionObserver(entries=>{entries.forEach(e=>{e.target.classList.toggle('vm-in-view',e.isIntersecting);e.isIntersecting?active.add(e.target):active.delete(e.target)});wake()},{threshold:0,rootMargin:'-8% 0px -8% 0px'});
   sections.forEach(el=>viewObserver.observe(el));observers.push(viewObserver);
   const aura=document.createElement('div');aura.className='vm-gate-aura';aura.setAttribute('aria-hidden','true');q('.gate-center')?.prepend(aura);
   const progress=document.createElement('div');progress.className='vm-reading';progress.setAttribute('aria-hidden','true');document.body.append(progress);
   makeGroup('.execution-strip','.flow-item',950);
   makeGroup('.compute-band','.compute-flow>div',1050);
   makeGroup('#gate','.gate-column:first-child .gate-node',750);
   makeGroup('#privacy','.privacy-node',1450);
   makeGroup('#improvement','.orbit-node',1050);
   makeGroup('#opennext','.pipeline>div',1300,['.intent-card','.policy-evidence','.provider-list','.gpu-index','.resource-hub']);
   makeGroup('#records','.record-flow>article',950);
   makeGroup('#security','.security-flow>div',1100);
   all('.intent-card,.policy-evidence,.provider-list,.gpu-index,.resource-hub').forEach(el=>el.classList.add('vm-panel-frame'));
   setupChart();
   setupOrbit();
   refreshPaths();document.fonts.ready.then(()=>{if(initialized)refreshPaths()});
   // The existing React layout redraws its SVG paths after fonts, load and resize.
   all('.gate-lines,.routing-lines').forEach(svg=>{const observer=new MutationObserver(()=>{if(initialized&&!q('.vm-trails',svg))trailSvg(svg)});observer.observe(svg,{childList:true});observers.push(observer)});
   let resizeTimer;listen(window,'resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(refreshPaths,200);wake()},{passive:true});
   listen(window,'scroll',wake,{passive:true});
   listen(window,'pointermove',e=>{if(e.pointerType==='mouse'&&innerWidth>760){pointer.x=(e.clientX/innerWidth-.5)*12;pointer.y=(e.clientY/innerHeight-.5)*8;wake()}},{passive:true});
   listen(document,'visibilitychange',()=>{flags();last=0;wake()});
   listen(media,'change',()=>{enabled=!media.matches;flags();wake()});
   all('.agent-tabs button').forEach(b=>listen(b,'click',()=>{all('.codebox').forEach(c=>{c.classList.remove('vm-code-in');void c.offsetWidth;c.classList.add('vm-code-in')})}));
   // Hovering a mandate highlights its matching route without making content a fake button.
   all('.gate-node').forEach((node,i)=>{listen(node,'pointerenter',()=>{if(!running())return;node.classList.add('vm-active');const paths=all('.gate-lines .vm-trail');paths.forEach((p,j)=>p.style.opacity=j===i%6?'1':'.14')});listen(node,'pointerleave',()=>{all('.gate-lines .vm-trail').forEach(p=>p.style.removeProperty('opacity'))})});
   wake();
 }
 function tick(t){frame=0;if(!running()){last=0;return;}const delta=last?Math.min(64,t-last):0;last=t;clock+=delta;
   if(dirty){dirty=false;html.style.setProperty('--vm-progress',String(clamp(scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight))));
     active.forEach(s=>{const r=s.getBoundingClientRect();const depth=clamp((innerHeight/2-(r.top+r.height/2))/innerHeight,-1,1)*16;s.style.setProperty('--vm-depth',`${depth.toFixed(1)}px`);s.style.setProperty('--vm-x',`${pointer.x.toFixed(1)}px`);s.style.setProperty('--vm-y',`${(pointer.y+depth*.5).toFixed(1)}px`)});
   }
   groups.forEach(g=>{if(!active.has(g.el.closest('section')))return;const n=g.items.length;if(!n)return;g.time+=delta;const step=Math.floor(g.time/g.interval)%(n+2);if(g.orbitSegments)updateOrbit(g,step);if(step===g.previous)return;g.previous=step;g.items.forEach((el,i)=>{el.classList.toggle('vm-active',i===step);el.classList.toggle('vm-done',i<step)});g.related.forEach((sel,i)=>q(sel,g.el)?.classList.toggle('vm-active',i===step));
    if(g.el.id==='gate'){all('.controls>div',g.el).forEach((el,i)=>el.classList.toggle('vm-active',i===step));all('.gate-column:last-child .gate-node',g.el).forEach(el=>el.classList.toggle('vm-active',step===n));all('.gate-lines .vm-trail',g.el).forEach((el,i)=>el.classList.toggle('vm-flowing',step<n?i===step*2:step===n&&i%2===1));g.el.classList.toggle('vm-gate-pass',step>=n)}
   });
   if(active.size)frame=requestAnimationFrame(tick);
 }
 function setEnabled(value){enabled=!!value&&!media.matches;flags();last=0;wake()}
 function setPaused(value){paused=!!value;flags();last=0;wake()}
 function replay(){clock=0;groups.forEach(g=>{g.previous=-1;g.time=0});all('[data-vm-reveal]').forEach(e=>{const r=e.getBoundingClientRect();if(r.top<innerHeight&&r.bottom>0){e.classList.remove('vm-seen');requestAnimationFrame(()=>requestAnimationFrame(()=>e.classList.add('vm-seen')))}});const hero=q('.hero');if(hero&&scrollY<400){html.classList.remove('vm-on');void hero.offsetWidth;flags()}wake()}
 function destroy(){initialized=false;cancelAnimationFrame(frame);frame=0;observers.forEach(o=>o.disconnect());observers=[];cleanups.forEach(f=>f());cleanups=[];groups=[];active.clear();all('.vm-reading,.vm-gate-aura,.vm-trails,.vm-orbit-trail,.vm-orbit-motion').forEach(x=>x.remove());q('#improvement')?.style.removeProperty('--vm-orbit-energy');all('[data-vm-reveal]').forEach(x=>{delete x.dataset.vmReveal;x.classList.remove('vm-seen')});all('.vm-active,.vm-done,.vm-in-view,.vm-gate-pass,.vm-code-in').forEach(x=>x.classList.remove('vm-active','vm-done','vm-in-view','vm-gate-pass','vm-code-in'));html.classList.remove('vm-on','vm-off','vm-paused')}
 window.VishwaMotion={init,setEnabled,setPaused,replay,destroy,getState:()=>({initialized,enabled:enabled&&!media.matches,paused,reduced:media.matches,activeSections:[...active].map(s=>s.id)})};
 // Works with the current React build; call init() directly after mount in source integration.
 if(q('#home'))init();else{const mount=new MutationObserver(()=>{if(q('#home')){mount.disconnect();init()}});mount.observe(document.body,{childList:true,subtree:true});setTimeout(()=>mount.disconnect(),15000)}
})();
