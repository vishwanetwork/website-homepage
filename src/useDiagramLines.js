import { useEffect } from 'react';

// Ported from syncDiagramLines in the delivery package app.js:
// dynamically draws the Gate connectors and OpenNEXT routing lines from the
// real node positions so dots and lines stay precisely aligned
export default function useDiagramLines() {
  useEffect(() => {
    function sync() {
      // Gate: connect the left and right column nodes to the center
      const svg = document.querySelector('.gate-lines');
      if (svg) {
        const box = svg.getBoundingClientRect();
        if (box.width && box.height) {
          svg.setAttribute('viewBox', `0 0 ${box.width} ${box.height}`);
          const left = [...document.querySelectorAll('.gate-column:first-child .gate-node')];
          const right = [...document.querySelectorAll('.gate-column:last-child .gate-node')];
          svg.innerHTML =
            '<g fill="none" stroke="#00d8b3" stroke-width="2">' +
            left
              .map((node, i) => {
                const r = node.getBoundingClientRect();
                const rr = right[i].getBoundingClientRect();
                const y = r.top + r.height / 2 - box.top;
                const ry = rr.top + rr.height / 2 - box.top;
                const t = box.height * (0.31 + i * 0.068);
                return (
                  `<path d="M0 ${y} C${box.width * 0.2} ${y} ${box.width * 0.15} ${t} ${box.width * 0.28} ${t}"/>` +
                  `<path d="M${box.width} ${ry} C${box.width * 0.8} ${ry} ${box.width * 0.85} ${t} ${box.width * 0.72} ${t}"/>`
                );
              })
              .join('') +
            '</g>';
        }
      }

      // OpenNEXT: connect constraint items and providers to the center resource-hub.
      // The cinematic .compute-dashboard carries a 3D transform (rotateX/rotateY +
      // scale) that varies with viewport width, so getBoundingClientRect returns
      // perspective-projected screen coords that no longer match the SVG's own
      // coordinate space — lines align on a laptop but drift on a wide monitor.
      // Measure in LOCAL layout space (offsetLeft/offsetTop up to .compute-body)
      // instead; local offsets ignore any ancestor transform, so the result is
      // identical at every width.
      const route = document.querySelector('.routing-lines');
      const hub = document.querySelector('.resource-hub');
      const body = route?.closest('.compute-body');
      if (route && hub && body && window.innerWidth > 760) {
        // accumulate offsets of an HTML el relative to .compute-body (offset*
        // props are HTMLElement-only — never call this on an <svg> icon).
        const local = el => {
          let x = 0, y = 0, n = el;
          while (n && n !== body) { x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent; }
          return { x, y, w: el.offsetWidth, h: el.offsetHeight };
        };
        route.setAttribute('viewBox', `0 0 ${body.offsetWidth} ${body.offsetHeight}`);
        const bend = (x1, y1, x2, y2) =>
          `<path d="M${x1} ${y1} C${(x1 + x2) / 2} ${y1} ${(x1 + x2) / 2} ${y2} ${x2} ${y2}"/>` +
          `<circle cx="${x1}" cy="${y1}" r="3"/><circle cx="${x2}" cy="${y2}" r="3"/>`;
        // Anchor the hub ends to the CUBE icon (RESOURCE AGENTS). The cube is an
        // <svg> (no offset* props), so derive its box from .resource-hub (a div):
        // the cube sits horizontally centred near the hub's top. hubTopPad is the
        // cube's vertical centre measured from the hub top; cubeW is its width.
        const H = local(hub);
        const cubeW = 115;
        const hubTopPad = 95;
        const hubCx = H.x + H.w / 2 - cubeW / 2;
        const hubRx = H.x + H.w / 2 + cubeW / 2;
        const hubMid = H.y + hubTopPad;
        const spread = (count, i, step) => hubMid + (i - (count - 1) / 2) * step;
        const constraints = [...document.querySelectorAll('.constraint-list>div')];
        const providers = [...document.querySelectorAll('.provider-list article')];
        let paths = '';
        constraints.forEach((n, i) => {
          const r = local(n);
          paths += bend(r.x + r.w, r.y + r.h / 2, hubCx, spread(constraints.length, i, 22));
        });
        providers.forEach((n, i) => {
          const r = local(n);
          paths += bend(hubRx, spread(providers.length, i, 30), r.x, r.y + r.h / 2);
        });
        route.innerHTML = `<g stroke="#00e9d0" stroke-width="1.7" fill="none">${paths}</g>`;
      }
    }

    sync();
    window.addEventListener('resize', sync);
    window.addEventListener('load', sync);
    if (document.fonts?.ready) document.fonts.ready.then(sync);
    // node positions may shift after images load; sync again after a short delay
    const t = setTimeout(sync, 600);
    return () => {
      window.removeEventListener('resize', sync);
      window.removeEventListener('load', sync);
      clearTimeout(t);
    };
  }, []);
}
