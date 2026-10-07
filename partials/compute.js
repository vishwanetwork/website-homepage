(function () {
  'use strict';
  function init() {
    document.querySelectorAll('[data-pc-component]').forEach(function (section) {
      if (section.dataset.pcReady === 'true') return;
      section.dataset.pcReady = 'true';
      var tabs = Array.from(section.querySelectorAll('[data-pc-step]'));
      var panels = Array.from(section.querySelectorAll('[data-pc-panel]'));
      function select(step, focusTab) {
        step = Math.max(1, Math.min(3, Number(step) || 1));
        section.dataset.pcActive = String(step);
        tabs.forEach(function (tab, index) {
          var active = index === step - 1;
          tab.setAttribute('aria-selected', String(active));
          tab.tabIndex = active ? 0 : -1;
        });
        panels.forEach(function (panel) { panel.hidden = panel.dataset.pcPanel !== String(step); });
        if (focusTab) tabs[step - 1].focus({ preventScroll: true });
      }
      tabs.forEach(function (tab, index) {
        tab.addEventListener('click', function () { select(tab.dataset.pcStep, false); });
        tab.addEventListener('keydown', function (event) {
          var destination;
          if (event.key === 'ArrowRight') destination = (index + 1) % tabs.length;
          else if (event.key === 'ArrowLeft') destination = (index + tabs.length - 1) % tabs.length;
          else if (event.key === 'Home') destination = 0;
          else if (event.key === 'End') destination = tabs.length - 1;
          else return;
          event.preventDefault();
          select(destination + 1, true);
        });
      });
      section.querySelectorAll('[data-pc-next]').forEach(function (button) {
        button.addEventListener('click', function () { select(button.dataset.pcNext, true); });
      });
      // Manual exploration is deliberate: no timer or scroll listener can override a chosen stage.
      select(section.dataset.pcActive || 1, false);
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
