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

      // OpenNEXT: connect constraint items and providers to the center resource-hub
      const route = document.querySelector('.routing-lines');
      const hub = document.querySelector('.resource-hub');
      if (route && hub && window.innerWidth > 760) {
        const b = route.getBoundingClientRect();
        const h = hub.getBoundingClientRect();
        route.setAttribute('viewBox', `0 0 ${b.width} ${b.height}`);
        const bend = (x1, y1, x2, y2) =>
          `<path d="M${x1} ${y1} C${(x1 + x2) / 2} ${y1} ${(x1 + x2) / 2} ${y2} ${x2} ${y2}"/>` +
          `<circle cx="${x1}" cy="${y1}" r="3"/><circle cx="${x2}" cy="${y2}" r="3"/>`;
        // Anchor the hub ends to the CUBE icon (RESOURCE AGENTS), not the whole
        // .resource-hub box — the hub also contains the POLICY EVIDENCE panel, so
        // its centre sits well below the cube and the lines would point into the
        // middle panel. Measuring the cube keeps every line aimed at the cube.
        const cube = hub.querySelector('.icon') || hub;
        const c = cube.getBoundingClientRect();
        const hubCx = c.left - b.left;
        const hubRx = c.right - b.left;
        const hubMid = c.top + c.height / 2 - b.top;
        const spread = (count, i, step) => hubMid + (i - (count - 1) / 2) * step;
        const constraints = [...document.querySelectorAll('.constraint-list>div')];
        const providers = [...document.querySelectorAll('.provider-list article')];
        let paths = '';
        constraints.forEach((n, i) => {
          const r = n.getBoundingClientRect();
          paths += bend(r.right - b.left, r.top + r.height / 2 - b.top, hubCx, spread(constraints.length, i, 22));
        });
        providers.forEach((n, i) => {
          const r = n.getBoundingClientRect();
          paths += bend(hubRx, spread(providers.length, i, 30), r.left - b.left, r.top + r.height / 2 - b.top);
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
