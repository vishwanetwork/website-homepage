(()=>{'use strict';
 const reduce=matchMedia('(prefers-reduced-motion: reduce)'),mobile=matchMedia('(max-width:760px)'),gateCompact=matchMedia('(max-width:900px)');
 const init=()=>{
  document.documentElement.classList.add('pv-ready');
  const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');io.unobserve(e.target)}}),{threshold:.08});
  document.querySelectorAll('.pv-reveal').forEach(e=>io.observe(e));
  const motionView=new IntersectionObserver(entries=>entries.forEach(e=>e.target.classList.toggle('pv-in-view',e.isIntersecting)),{threshold:.05});
  document.querySelectorAll('.pv-tail section').forEach(e=>motionView.observe(e));
  const nav=document.querySelector('.menu-button'),menu=document.querySelector('#main-nav');
  nav?.addEventListener('click',()=>{const open=nav.getAttribute('aria-expanded')!=='true';nav.setAttribute('aria-expanded',String(open));nav.setAttribute('aria-label',open?'Close menu':'Open menu');menu?.classList.toggle('open',open)});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav?.getAttribute('aria-expanded')==='true')nav.click()});

  // Policy owns its independent scene. Privacy and Self improving remain a
  // separate two-state sequence; no sticky scene is nested inside another.
  const gate=window.VishwaPolicyGate?.mount();
  const section=document.querySelector('.pv-controls');
  const buttons=[...section.querySelectorAll('[data-pv-tab]')],copies=[...section.querySelectorAll('[data-pv-copy]')],visuals=[...section.querySelectorAll('[data-pv-visual]')];
  const count=buttons.length;let current=-1,lockUntil=0,raf=0;
  const staticMode=()=>reduce.matches||document.documentElement.classList.contains('vx-static');
  const progress=element=>{const r=element.getBoundingClientRect();return Math.max(0,Math.min(1,-r.top/Math.max(1,r.height-innerHeight)))};
  const show=n=>{
   if(n===current)return;current=n;
   buttons.forEach((button,i)=>{button.setAttribute('aria-selected',String(i===n));button.tabIndex=i===n?0:-1});
   copies.forEach((copy,i)=>{copy.hidden=i!==n;copy.setAttribute('role','tabpanel');copy.setAttribute('aria-labelledby',buttons[i].id)});
   visuals.forEach((visual,i)=>{visual.classList.toggle('is-active',i===n);visual.setAttribute('aria-hidden',String(i!==n))});
   section.dataset.step=String(n);
  };
  const update=()=>{
   raf=0;
   if(gate)gate.update(gateCompact.matches||staticMode()?1:progress(gate.element));
   const r=section.getBoundingClientRect();section.classList.toggle('pv-in-view',r.top<innerHeight&&r.bottom>0);
   if(!mobile.matches&&!staticMode()&&performance.now()>lockUntil)show(Math.min(count-1,Math.floor(progress(section)*count)));
  };
  const schedule=()=>{if(!raf)raf=requestAnimationFrame(update)};
  buttons.forEach((button,i)=>{
   button.addEventListener('click',()=>{
    lockUntil=performance.now()+1800;show(i);
    if(!mobile.matches&&!staticMode()){
     const r=section.getBoundingClientRect();
     scrollTo({top:scrollY+r.top+Math.max(0,r.height-innerHeight)*(i/count+.08),behavior:'smooth'});
    }
   });
   button.addEventListener('keydown',event=>{
    if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
    event.preventDefault();const n=event.key==='Home'?0:event.key==='End'?count-1:(i+(event.key==='ArrowRight'?1:count-1))%count;
    buttons[n].click();buttons[n].focus();
   });
  });
  show(0);
  addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule,{passive:true});
  reduce.addEventListener('change',schedule);gateCompact.addEventListener('change',schedule);
  new MutationObserver(schedule).observe(document.documentElement,{attributes:true,attributeFilter:['class']});
  update();
  // The opening renderer stays intact; the preview tour follows the new content.
  if(window.VishwaCinematic)window.VishwaCinematic.play=()=>{document.querySelector('#runtime').scrollIntoView({behavior:reduce.matches?'auto':'smooth'})};
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
