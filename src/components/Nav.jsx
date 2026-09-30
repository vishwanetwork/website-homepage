import React from 'react';
import { TYPEFORM_URL } from '../config.js';

const links = [
  { id: 'runtime', label: 'Platform' },
  { id: 'gate', label: 'Banking Infrastructure' },
  { id: 'developers', label: 'Veta' },
  { id: 'opennext', label: 'OpenNEXT' },
  { id: 'developers', label: 'Developers' },
  { id: 'insights', label: 'Resources' },
  { href: 'https://vault.vishwalab.com/', label: 'Vault', external: true },
  { href: 'https://cli.vishwalab.com/', label: 'CLI', external: true },
];

// Section order used for scroll highlighting
const sectionIds = ['home', 'runtime', 'gate', 'privacy', 'improvement', 'opennext', 'records', 'developers', 'security', 'insights', 'faq'];

export default function Nav({ onDialog }) {
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState('runtime');
  const close = () => setOpen(false);

  React.useEffect(() => {
    const sections = sectionIds
      .map(id => document.getElementById(id))
      .filter(Boolean);
    const observer = new IntersectionObserver(
      entries => {
        // pick the topmost visible section in the viewport
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    );
    sections.forEach(s => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <header className="nav wrap">
      <a className="brand" href="#home" aria-label="Vishwa home" onClick={close}>
        <img className="brand-logo" src="/assets/icons/logo-vishwa.png" alt="Vishwa" />
      </a>
      <nav aria-label="Main navigation" id="main-nav" className={open ? 'open' : ''}>
        {links.map((link, i) => {
          if (link.external) {
            return (
              <a key={i} href={link.href} target="_blank" rel="noopener noreferrer" onClick={close}>
                {link.label}
              </a>
            );
          }
          // a section may map to multiple links; highlight only the first match to avoid dual selection
          const firstIndex = links.findIndex(l => !l.external && l.id === link.id);
          const isActive = active === link.id && firstIndex === i;
          return (
            <a key={i} className={isActive ? 'active' : undefined} href={`#${link.id}`} onClick={close}>
              {link.label}
            </a>
          );
        })}
      </nav>
      <div className="nav-end">
        <a className="button dark" href={TYPEFORM_URL} target="_blank" rel="noopener noreferrer">Talk to us</a>
        <button
          className="menu-button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="main-nav"
          onClick={() => setOpen(v => !v)}
        >
          {open ? '×' : '☰'}
        </button>
      </div>
    </header>
  );
}
