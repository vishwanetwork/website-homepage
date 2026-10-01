/* Vishwa continuity: additive, native-scroll enhancement for the existing later sections.
 * No reparenting, no scroll listeners and no animation loop. Host calls update().
 */
(function (global) {
  'use strict';
  var active = null;
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var ease = function (v) { v = clamp(v, 0, 1); return v * v * (3 - 2 * v); };

  function mount() {
    if (active) return active;
    var html = document.documentElement;
    var records = document.querySelector('#records');
    var developers = document.querySelector('#developers');
    var security = document.querySelector('#security');
    var insights = document.querySelector('#insights');
    if (!records && !developers && !security && !insights) return null;
    var reduced = global.matchMedia('(prefers-reduced-motion: reduce)');
    // Phones animate as well; overrides.css restores the motion there. Keep the
    // flattened path for tablets, non-phone touch screens and reduced motion.
    var compact = global.matchMedia('(min-width: 761px) and (max-width: 900px), (min-width: 761px) and (hover: none)');
    var classes = new Map(), styles = new Map(), listeners = [];
    var disposed = false, quiet = true, paused = false, initialized = false, lastQuiet = null;
    var anchors = [], effects = [], pointerCards = [];

    function all(selector, root) { return root ? Array.from(root.querySelectorAll(selector)) : []; }
    function addClass(el, name) {
      if (!el) return;
      if (!classes.has(el)) classes.set(el, new Map());
      var map = classes.get(el); if (!map.has(name)) map.set(name, el.classList.contains(name));
      el.classList.add(name);
    }
    function setClass(el, name, value) {
      if (!classes.has(el)) classes.set(el, new Map());
      var map = classes.get(el); if (!map.has(name)) map.set(name, el.classList.contains(name));
      el.classList.toggle(name, value);
    }
    function set(el, name, value) {
      if (!el) return;
      if (!styles.has(el)) styles.set(el, new Map());
      var saved = styles.get(el);
      if (!saved.has(name)) saved.set(name, { value: el.style.getPropertyValue(name), priority: el.style.getPropertyPriority(name) });
      value = String(value);
      if (el.style.getPropertyValue(name) !== value) el.style.setProperty(name, value);
    }
    function on(el, event, callback) {
      el.addEventListener(event, callback, { passive: true });
      listeners.push(function () { el.removeEventListener(event, callback); });
    }
    function anchor(el, start, distance) {
      var value = { el: el, start: start || .91, distance: distance || .47, progress: 1 };
      if (el) anchors.push(value); return value;
    }
    function effect(el, className, group, delay, span, angle, scale) {
      if (!el) return;
      addClass(el, className);
      set(el, '--vc-fold-start', (angle || 0) + 'deg');
      effects.push({ el: el, group: group, delay: delay || 0, span: span || .7, scale: scale === undefined ? .96 : scale });
    }
    addClass(html, 'vc-on');

    // Six existing evidence cards unfold in sequence without changing their grid or arrows.
    var recordFlow = records && records.querySelector('.record-flow');
    var evidenceAnchor = anchor(recordFlow, .92, .48);
    if (recordFlow) addClass(recordFlow, 'vc-evidence-stage');
    all('.record-flow > article', records).forEach(function (card, i) {
      effect(card, 'vc-evidence-card', evidenceAnchor, i * .065, .62, 42, .93);
    });
    var ledger = records && records.querySelector('.execution-record');
    var ledgerAnchor = anchor(ledger, .88, .44);
    if (ledger) addClass(ledger, 'vc-ledger');
    all('.execution-record > div', records).forEach(function (row, i) {
      effect(row, 'vc-ledger-row', ledgerAnchor, i * .073, .5, 0, 1);
    });

    // Keep the React tab panel, copy controls and code nodes intact.
    var consolePanel = developers && developers.querySelector('.developer-panel');
    var consoleAnchor = anchor(developers && (developers.querySelector('.integration-surfaces') || developers), .84, .40);
    effect(consolePanel, 'vc-console', consoleAnchor, 0, .64, 9, .985);
    var request = consolePanel && consolePanel.querySelector('.request-col');
    effect(request, 'vc-request', consoleAnchor, .06, .6, 12, 1);
    all('.response-panels > .codebox', consolePanel).forEach(function (box, i) {
      effect(box, 'vc-response', consoleAnchor, .15 + i * .14, .57, 16, .98);
    });

    var securityCards = security && security.querySelector('.security-cards');
    var securityAnchor = anchor(securityCards, .93, .48);
    if (securityCards) addClass(securityCards, 'vc-assurance-stage');
    all('.security-cards > article', security).forEach(function (card, i) {
      effect(card, 'vc-assurance-card', securityAnchor, i * .10, .70, 29, .97);
      set(card, '--vc-hinge-axis', i === 0 ? '-.35' : i === 2 ? '.35' : '0');
    });
    var securityFlow = security && security.querySelector('.security-flow');
    var securityFlowAnchor = anchor(securityFlow, .9, .40);
    all('.security-flow > div', security).forEach(function (item, i) {
      effect(item, 'vc-assurance-step', securityFlowAnchor, i * .09, .55, 0, 1);
    });

    function resetPointer(card) {
      set(card, '--vc-pointer-angle', '0deg'); set(card, '--vc-axis-x', '1'); set(card, '--vc-axis-y', '0');
      set(card, '--vc-light-x', '50%'); set(card, '--vc-light-y', '35%');
      setClass(card, 'vc-pointer-active', false);
    }
    all('.domain-stories > article, .article-card', insights).forEach(function (card) {
      addClass(card, 'vc-insight-card'); pointerCards.push(card); resetPointer(card);
      on(card, 'pointermove', function (event) {
        if (quiet || paused || event.pointerType === 'touch') return;
        var r = card.getBoundingClientRect(); if (r.width < 1 || r.height < 1) return;
        var x = clamp((event.clientX - r.left) / r.width, 0, 1);
        var y = clamp((event.clientY - r.top) / r.height, 0, 1);
        var rx = -(y - .5) * 2, ry = (x - .5) * 2;
        set(card, '--vc-axis-x', (Math.abs(rx) < .001 ? .001 : rx).toFixed(3));
        set(card, '--vc-axis-y', ry.toFixed(3));
        set(card, '--vc-pointer-angle', (Math.min(1.2, Math.hypot(rx, ry)) * 3.4).toFixed(2) + 'deg');
        set(card, '--vc-light-x', (x * 100).toFixed(1) + '%'); set(card, '--vc-light-y', (y * 100).toFixed(1) + '%');
        setClass(card, 'vc-pointer-active', true);
      });
      on(card, 'pointerleave', function () { resetPointer(card); });
      on(card, 'pointercancel', function () { resetPointer(card); });
      on(card, 'focusout', function (event) { if (!card.contains(event.relatedTarget)) resetPointer(card); });
    });

    function update(options) {
      if (disposed) return;
      options = options || {};
      quiet = !!options.staticMode || reduced.matches || compact.matches;
      paused = !!options.paused;
      var modeChanged = quiet !== lastQuiet;
      setClass(html, 'vc-quiet', quiet); setClass(html, 'vc-paused', paused);
      if (modeChanged || paused) pointerCards.forEach(resetPointer);
      lastQuiet = quiet;
      if (paused && initialized && !modeChanged) return;
      var vh = Math.max(1, global.innerHeight || document.documentElement.clientHeight);
      // Read first, then write: only five untransformed parent anchors are measured.
      anchors.forEach(function (group) {
        if (!group.el) return;
        if (quiet) { group.progress = 1; return; }
        var rect = group.el.getBoundingClientRect();
        group.progress = clamp((vh * group.start - rect.top) / (vh * group.distance), 0, 1);
      });
      effects.forEach(function (item) {
        var p = quiet ? 1 : ease((item.group.progress - item.delay) / item.span);
        set(item.el, '--vc-ready', p.toFixed(4));
        set(item.el, '--vc-rest', (1 - p).toFixed(4));
        set(item.el, '--vc-depth-scale', (item.scale + (1 - item.scale) * p).toFixed(4));
        setClass(item.el, 'vc-settled', p > .995);
      });
      initialized = true;
    }
    function dispose() {
      if (disposed) return; disposed = true;
      listeners.forEach(function (remove) { remove(); });
      styles.forEach(function (saved, el) {
        saved.forEach(function (old, name) { if (old.value) el.style.setProperty(name, old.value, old.priority); else el.style.removeProperty(name); });
      });
      classes.forEach(function (saved, el) { saved.forEach(function (existed, name) { el.classList.toggle(name, existed); }); });
      listeners = []; effects = []; anchors = []; pointerCards = []; styles.clear(); classes.clear(); active = null;
    }
    active = { update: update, dispose: dispose };
    update({ staticMode: html.classList.contains('vx-static'), paused: html.classList.contains('vx-paused') });
    return active;
  }
  global.VishwaContinuity = { mount: mount };
})(window);
