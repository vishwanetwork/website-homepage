/* Vishwa policy gate, adapted from the live gate-story.js verified 2026-10-07.
 * Original update equations and phase intervals are retained. This component
 * only binds existing #gate markup; preview.js owns the scroll listener/rAF.
 * Load gate.css, insert gate.html, then load gate.js before preview.js.
 * API: VishwaPolicyGate.mount({element?,onNavigate?}) => {element,update,dispose}.
 * No transactions are submitted. All request cards are an explanatory model.
 */
(()=>{'use strict';
 let current=null;
 const clamp=n=>Math.max(0,Math.min(1,n));
 const smooth=n=>{n=clamp(n);return n*n*(3-2*n)};
 const segment=(p,a,b)=>smooth((p-a)/(b-a));
 const lerp=(a,b,t)=>a+(b-a)*t;
 function mount(options={}){
  if(current?.element.isConnected)return current;
  const section=options.element||document.querySelector('#gate.pg-story');if(!section)return null;
  const reduced=matchMedia('(prefers-reduced-motion:reduce)'),compact=matchMedia('(max-width:900px)');
  const isStatic=()=>reduced.matches||compact.matches||document.documentElement.classList.contains('vx-static');
  const style=section.style,nodes=[...section.querySelectorAll('.pg-check')],buttons=[...section.querySelectorAll('[data-pg-phase]')];
  const anchors=[section.querySelector('.pg-request--a'),section.querySelector('.pg-checks'),section.querySelector('.pg-request--b')];
  const phasePositions=[.22,.49,.91];let lastPhase=-2,disposed=false;
  const set=(name,n,suffix='')=>style.setProperty('--pg-'+name,Number(n).toFixed(4)+suffix);
  const measureCard=()=>style.setProperty('--pg-b-half-height',anchors[2].offsetHeight/2+'px');
  const cardObserver=new ResizeObserver(measureCard);cardObserver.observe(anchors[2]);measureCard();
  const image=section.querySelector('.pg-gate-image');
  const onImageError=()=>section.classList.add('pg-image-unavailable');
  image.addEventListener('error',onImageError);if(image.complete&&!image.naturalWidth)onImageError();
  section.classList.add('pg-ready');
    function update(progress) {
      if (disposed) return;
      var p = clamp(Number.isFinite(Number(progress)) ? Number(progress) : 0);
      var staticMode = isStatic();
      section.dataset.mode = staticMode ? 'static' : 'cinematic';
      var arrival = segment(p, 0.015, 0.245);
      var transit = segment(p, 0.65, 0.9);
      var blocked = staticMode ? 1 : segment(p, 0.565, 0.72);
      var allowed = staticMode ? 1 : segment(p, 0.615, 0.695);
      var phase = staticMode ? -1 : p < 0.3 ? 0 : p < 0.68 ? 1 : 2;
      set('progress', p);
      set('intro-title', 1 - segment(p, 0.255, 0.325));
      set('policy-title', segment(p, 0.255, 0.325) * (1 - segment(p, 0.63, 0.715)));
      set('outcome-title', segment(p, 0.63, 0.715));
      set('intro-y', -24 * segment(p, 0.255, 0.325), 'px');
      set('policy-y', 24 * (1 - segment(p, 0.255, 0.325)) - 24 * segment(p, 0.63, 0.715), 'px');
      set('outcome-y', 24 * (1 - segment(p, 0.63, 0.715)), 'px');
      set('gate-scale', lerp(0.9, 1.065, segment(p, 0, 0.68)));
      set('gate-light', lerp(0.32, 0.96, segment(p, 0.21, 0.64)));
      set('gate-scan', segment(p, 0.29, 0.62));
      set('gate-scan-opacity', segment(p, 0.27, 0.33) * (1 - segment(p, 0.61, 0.67)));
      set('a-x', lerp(lerp(-2, 30.5, arrival), 80, transit), '%');
      set('a-y', 47 - Math.sin(transit * Math.PI) * 5, '%');
      set('a-scale', 1 - Math.sin(transit * Math.PI) * 0.26);
      set('a-rotate', lerp(-16, 0, arrival) - Math.sin(transit * Math.PI) * 21, 'deg');
      set('a-opacity', segment(p, 0, 0.07) * (1 - Math.sin(transit * Math.PI) * 0.19));
      style.setProperty('--pg-a-z', transit > 0.38 && transit < 0.69 ? '2' : '5');
      set('b-x', lerp(0, 18, segment(p, 0.07, 0.29)) + Math.sin(blocked * Math.PI) * 4, '%');
      set('b-y', lerp(90, 81, segment(p, 0.07, 0.29)), '%');
      set('b-opacity', segment(p, 0.055, 0.135));
      set('b-rotate', -8 * (1 - blocked), 'deg');
      set('blocked', blocked);
      set('rejected-caption-opacity', staticMode ? 1 : segment(p, 0.78, 0.9));
      set('allowed', allowed);
      set('checks-opacity', segment(p, 0.125, 0.235) * (1 - segment(p, 0.65, 0.76)));
      set('checks-y', 18 * (1 - segment(p, 0.125, 0.235)) - 20 * segment(p, 0.65, 0.76), 'px');
      set('approach', segment(p, 0.17, 0.29));
      set('exit', segment(p, 0.68, 0.89));
      set('outcome-opacity', segment(p, 0.8, 0.92));
      set('floor-scale', lerp(0.95, 1.16, p));
      nodes.forEach(function (node, i) {
        var locked = staticMode || p >= 0.285 + i * 0.058;
        var state = locked ? 'locked' : 'pending';
        if (node.dataset.state !== state) node.dataset.state = state;
      });
      if (phase !== lastPhase) {
        lastPhase = phase;
        section.dataset.phase = String(phase);

        buttons.forEach(function (button, i) {
          if (i === phase) button.setAttribute('aria-current', 'step');
          else button.removeAttribute('aria-current');
        });
      }
    }

  function navigate(event){
   const index=Number(event.currentTarget.dataset.pgPhase),progress=phasePositions[index],staticMode=isStatic();
   const anchor=staticMode?anchors[index]:section,top=anchor.getBoundingClientRect().top+scrollY;
   const travel=Math.max(0,section.offsetHeight-innerHeight),offset=parseFloat(getComputedStyle(section).getPropertyValue('--pg-nav-offset'))||0;
   const scrollTop=staticMode?top-offset-24:top+travel*progress;
   if(options.onNavigate?.({index,progress,scrollTop,element:section,target:anchor})===true)return;
   update(progress);scrollTo({top:Math.max(0,scrollTop),behavior:reduced.matches||document.documentElement.classList.contains('vx-static')?'auto':'smooth'});
  }
  function onKey(event){
   if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
   event.preventDefault();const index=buttons.indexOf(event.currentTarget),next=event.key==='Home'?0:event.key==='End'?2:(index+(event.key==='ArrowRight'?1:2))%3;
   buttons[next].focus();buttons[next].click();
  }
  buttons.forEach(button=>{button.addEventListener('click',navigate);button.addEventListener('keydown',onKey)});
  function dispose(){if(disposed)return;disposed=true;cardObserver.disconnect();image.removeEventListener('error',onImageError);buttons.forEach(button=>{button.removeEventListener('click',navigate);button.removeEventListener('keydown',onKey)});section.classList.remove('pg-ready');current=null}
  current={element:section,update,dispose};update(isStatic()?1:0);return current;
 }
 window.VishwaPolicyGate={mount};
})();
