import { useEffect } from 'react';

// Scroll reveal: blocks fade and slide up as they enter the viewport; UI unchanged
// Implemented by adding a reveal class to the direct children of <main>,
// without touching each component's structure
export default function useReveal() {
  useEffect(() => {
    const main = document.querySelector('.site-shell main');
    if (!main) return;

    const blocks = [...main.children];

    // Respect the system "reduced motion" setting: show everything, no animation
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      blocks.forEach(b => b.classList.add('reveal', 'reveal-in'));
      return;
    }

    blocks.forEach((b, i) => {
      b.classList.add('reveal');
      // Show the first-screen Hero immediately to avoid an initial blank
      if (i === 0) b.classList.add('reveal-in');
    });

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-in');
            obs.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.08 }
    );

    blocks.forEach((b, i) => { if (i > 0) observer.observe(b); });
    return () => observer.disconnect();
  }, []);
}
