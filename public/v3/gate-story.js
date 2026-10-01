/* Vishwa Gate cinematic story — manual mount only; no scroll listener or rAF.
 * Load gate-story.css separately, then:
 *   const gate = window.VishwaGateStory.mount();
 *   // Desktop progress: clamp(-gate.element.getBoundingClientRect().top /
 *   //   (gate.element.offsetHeight - window.innerHeight), 0, 1)
 *   // Call gate.update(progress) from the host's single scroll/rAF controller.
 *   // Call gate.dispose() to remove the inserted story and its event handlers.
 *
 * mount(options?) accepts:
 *   target: Element | selector (default '#gate'); story is inserted BEFORE it.
 *   assetUrl: optional override for the existing transparent gate image.
 *   onNavigate({index, progress, scrollTop, element, target}): optional host hook.
 *     Return true when the host handles the phase-button navigation itself.
 *   id: optional unique story id (default 'vishwa-gate-story').
 * CSS integration: html.vx-mode reserves 82px for the fixed header; override
 *   --vg-nav-offset on the section if needed. html.vx-static cancels pinning;
 *   html.vx-paused needs no extra work because this component has no own loop.
 * Returned API: { update(progress0to1), element, dispose() }.
 * All requests and outcomes are illustrative UI examples; no network/business
 * action is performed. Mobile <=900px and reduced-motion render a readable
 * static composition; their phase buttons navigate to content in this story.
 */
(function () {
  'use strict';
  var current = null;
  var clamp = function (n) { return Math.max(0, Math.min(1, n)); };
  var smooth = function (n) { n = clamp(n); return n * n * (3 - 2 * n); };
  var segment = function (p, a, b) { return smooth((p - a) / (b - a)); };
  var lerp = function (a, b, t) { return a + (b - a) * t; };
  var shield = '<svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M16 3 27 7v8c0 7-5 11-11 15C10 26 5 22 5 15V7Z"/><path d="m11 16 3.5 3.5L22 12"/></svg>';
  var check = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m5 12 4.5 4.5L19 7"/></svg>';
  var lock = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3"/></svg>';

  function mount(options) {
    options = options || {};
    if (current && current.element.isConnected) return current;
    var target = typeof options.target === 'string' ? document.querySelector(options.target) : options.target;
    target = target || document.querySelector('#gate');
    if (!target || !target.parentNode) throw new Error('VishwaGateStory.mount requires an existing #gate or target element.');
    var media = window.matchMedia('(max-width: 900px), (prefers-reduced-motion: reduce)');
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    // Phones run the cinematic story too (overrides.css re-pins the sticky), so
    // only honour an explicit reduced-motion preference or the static toggle.
    // Tablet widths 761-900px keep the original readable static composition.
    var tabletStatic = window.matchMedia('(min-width: 761px) and (max-width: 900px)');
    function isStatic() { return reduced.matches || tabletStatic.matches || document.documentElement.classList.contains('vx-static'); }
    var section = document.createElement('section');
    var id = options.id || 'vishwa-gate-story';
    if (document.getElementById(id)) id += '-' + Math.random().toString(36).slice(2, 7);
    section.id = id;
    section.className = 'vg-story';
    section.dataset.motionStory = 'gate';
    section.setAttribute('aria-labelledby', id + '-title');
    section.innerHTML = '<div class="vg-sticky">' +
      '<div class="vg-atmosphere" aria-hidden="true"></div><div class="vg-grain" aria-hidden="true"></div>' +
      '<header class="vg-header"><div class="vg-topline"><span class="vg-wordmark">VISHWA <i></i> THE GATE</span>' +
      '<div class="vg-meter" role="progressbar" aria-label="Illustrative Gate story progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><span></span></div>' +
      '<span class="vg-counter" aria-hidden="true">01 <b>/ 03</b></span></div>' +
      '<div class="vg-heading-row"><h2 id="' + id + '-title" class="vg-title"><span class="vg-sr">Nothing moves. Until policy allows it.</span>' +
      '<span class="vg-title-phase vg-title-phase--0" aria-hidden="true">Nothing <em>moves.</em></span>' +
      '<span class="vg-title-phase vg-title-phase--1" aria-hidden="true">Until policy <em>allows it.</em></span>' +
      '<span class="vg-title-phase vg-title-phase--2" aria-hidden="true">The boundary <em>holds.</em></span></h2>' +
      '<p class="vg-deck">A mandate comes first.<br>Every execution must fit inside it.</p></div></header>' +
      '<div class="vg-scene" aria-label="Illustrative requests passing through policy checks">' +
      '<div class="vg-floor" aria-hidden="true"></div><div class="vg-horizon" aria-hidden="true"></div>' +
      '<div class="vg-approach-lane" aria-hidden="true"><span></span></div><div class="vg-exit-lane" aria-hidden="true"><span></span></div>' +
      '<div class="vg-gate" aria-hidden="true"><div class="vg-gate-halo"></div><img class="vg-gate-image" alt="" decoding="async">' +
      '<div class="vg-gate-scan"></div><div class="vg-gate-caption">' + shield + '<span>CONTROL +<br><strong>ENFORCEMENT</strong></span></div>' +
      '<div class="vg-boundary-pill"><span></span> POLICY BOUNDARY · FIXED</div></div>' +
      '<article class="vg-request vg-request--a" aria-label="Illustrative Request A, within the approved mandate">' +
      '<div class="vg-request-top"><span>REQUEST A</span><span class="vg-request-serial">AGT / 7F2C</span></div>' +
      '<span class="vg-illustrative">ILLUSTRATIVE REQUEST</span><h3>Capital, with<br>a clear mandate.</h3>' +
      '<dl><div><dt>Venue</dt><dd>Approved</dd></div><div><dt>Amount</dt><dd>Within limit</dd></div></dl>' +
      '<div class="vg-request-status"><span class="vg-status-await"><i></i> Awaiting policy checks</span>' +
      '<span class="vg-status-final">' + check + ' AUTHORIZED <b>→</b></span></div></article>' +
      '<ol class="vg-checks" aria-label="Six mandate checks">' +
      ['Identity', 'Authority', 'Provenance', 'Consistency', 'Solvency', 'Compliance'].map(function (name, i) {
        return '<li class="vg-check" data-check="' + i + '" data-state="pending"><span class="vg-check-number">0' + (i + 1) + '</span><span class="vg-check-label">' + name + '</span><span class="vg-check-seal">' + check + '</span></li>';
      }).join('') + '</ol>' +
      '<article class="vg-request vg-request--b" aria-label="Illustrative Request B, exceeding the approved limit">' +
      '<div class="vg-request-top"><span>REQUEST B</span><span class="vg-request-serial">AGT / 91AB</span></div>' +
      '<span class="vg-illustrative">ILLUSTRATIVE REQUEST</span><h3>Beyond<br>the permitted limit.</h3>' +
      '<dl><div><dt>Spend limit</dt><dd>Exceeded</dd></div></dl>' +
      '<div class="vg-request-status"><span class="vg-status-await"><i></i> Awaiting policy checks</span>' +
      '<span class="vg-status-final">' + lock + ' BLOCKED <small>NOT ROUTED</small></span></div></article>' +
      '<div class="vg-approved-caption" aria-hidden="true"><span>PERMITTED PATH</span><strong>Authorized to proceed.</strong><p>Approved systems execute.</p></div>' +
      '<div class="vg-rejected-caption" aria-hidden="true"><span>OUTSIDE THE MANDATE</span><strong>Stopped before execution.</strong></div>' +
      '</div>' +
      '<footer class="vg-footer"><div class="vg-phase-buttons" role="group" aria-label="Navigate the illustrative Gate story">' +
      '<button type="button" data-phase="0" aria-current="step"><span>01</span><b>The request</b><small>Intent arrives</small></button>' +
      '<button type="button" data-phase="1"><span>02</span><b>The mandate</b><small>Six checks lock</small></button>' +
      '<button type="button" data-phase="2"><span>03</span><b>The decision</b><small>Proceed or stop</small></button></div>' +
      '<p class="vg-disclaimer">Illustrative policy flow.<br><span>No live transaction is performed.</span></p></footer></div>';
    var image = section.querySelector('.vg-gate-image');
    image.src = options.assetUrl || (window.__VM_ASSETS && window.__VM_ASSETS['/assets/images/gate-portal.webp']) || './assets/images/gate-portal.webp';
    image.addEventListener('error', onImageError);
    function onImageError() { section.classList.add('vg-image-unavailable'); }
    target.parentNode.insertBefore(section, target);
    var style = section.style;
    var nodes = Array.prototype.slice.call(section.querySelectorAll('.vg-check'));
    var buttons = Array.prototype.slice.call(section.querySelectorAll('[data-phase]'));
    var counter = section.querySelector('.vg-counter');
    var meter = section.querySelector('.vg-meter');
    var anchors = [section.querySelector('.vg-request--a'), section.querySelector('.vg-checks'), section.querySelector('.vg-request--b')];
    var phasePositions = [0.13, 0.49, 0.91];
    var lastPhase = -1;
    var lastPercent = -1;
    var disposed = false;
    var api;

    function set(name, n, suffix) { style.setProperty('--vg-' + name, Number(n).toFixed(4) + (suffix || '')); }
    function update(progress) {
      if (disposed) return;
      var p = clamp(Number.isFinite(Number(progress)) ? Number(progress) : 0);
      var staticMode = isStatic();
      section.dataset.mode = staticMode ? 'static' : 'cinematic';
      var arrival = segment(p, 0.015, 0.245);
      var transit = segment(p, 0.65, 0.9);
      var blocked = staticMode ? 1 : segment(p, 0.565, 0.72);
      var allowed = staticMode ? 1 : segment(p, 0.615, 0.695);
      var phase = p < 0.3 ? 0 : p < 0.68 ? 1 : 2;
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
      style.setProperty('--vg-a-z', transit > 0.38 && transit < 0.69 ? '2' : '5');
      set('b-x', lerp(0, 18, segment(p, 0.07, 0.29)) + Math.sin(blocked * Math.PI) * 4, '%');
      set('b-y', lerp(90, 81, segment(p, 0.07, 0.29)), '%');
      set('b-opacity', segment(p, 0.055, 0.135));
      set('b-rotate', -8 * (1 - blocked), 'deg');
      set('blocked', blocked);
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
        counter.innerHTML = '0' + (phase + 1) + ' <b>/ 03</b>';
        buttons.forEach(function (button, i) {
          if (i === phase) button.setAttribute('aria-current', 'step');
          else button.removeAttribute('aria-current');
        });
      }
      var percent = Math.round(p * 100);
      if (percent !== lastPercent) { meter.setAttribute('aria-valuenow', String(percent)); lastPercent = percent; }
    }

    function navigate(event) {
      var index = Number(event.currentTarget.dataset.phase);
      var progress = phasePositions[index];
      var staticMode = isStatic();
      var anchor = staticMode ? anchors[index] : section;
      var top = anchor.getBoundingClientRect().top + window.scrollY;
      var travel = Math.max(0, section.offsetHeight - window.innerHeight);
      var headerOffset = parseFloat(window.getComputedStyle(section).getPropertyValue('--vg-nav-offset')) || 0;
      var scrollTop = staticMode ? top - headerOffset - 24 : top + travel * progress;
      if (typeof options.onNavigate === 'function' && options.onNavigate({ index: index, progress: progress, scrollTop: scrollTop, element: section, target: anchor }) === true) return;
      update(progress);
      window.scrollTo({ top: Math.max(0, scrollTop), behavior: reduced.matches || document.documentElement.classList.contains('vx-static') ? 'auto' : 'smooth' });
    }
    buttons.forEach(function (button) { button.addEventListener('click', navigate); });
    function dispose() {
      if (disposed) return;
      disposed = true;
      buttons.forEach(function (button) { button.removeEventListener('click', navigate); });
      image.removeEventListener('error', onImageError);
      section.remove();
      if (current === api) current = null;
    }
    api = { update: update, element: section, dispose: dispose };
    current = api;
    update(0);
    return api;
  }
  window.VishwaGateStory = { mount: mount };
}());
