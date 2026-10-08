/* Native details remain usable without JS. The host owns reveal/scroll animation. */
(function () {
  'use strict';
  var active = null;
  function mount() {
    var root = document.querySelector('[data-pv-tail]');
    if (!root) return null;
    if (active && active.element === root) return active;
    if (active) active.dispose();
    var groups = Array.from(root.querySelectorAll('[data-pv-faq-group]'));
    function onToggle(event) {
      var opened = event.target;
      if (!(opened instanceof HTMLDetailsElement) || !opened.open) return;
      var group = opened.closest('[data-pv-faq-group]');
      if (!group) return;
      group.querySelectorAll('details[open]').forEach(function (item) {
        if (item !== opened) item.open = false;
      });
    }
    groups.forEach(function (group) { group.addEventListener('toggle', onToggle, true); });
    var api = {
      element: root,
      dispose: function () {
        groups.forEach(function (group) { group.removeEventListener('toggle', onToggle, true); });
        if (active === api) active = null;
      }
    };
    active = api;
    return api;
  }
  window.VishwaPreviewTail = { mount: mount };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount, { once: true });
  else mount();
}());
