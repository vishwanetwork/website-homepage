import React from 'react';
import Icon from './Icon.jsx';
import { TYPEFORM_URL } from '../config.js';

const benefits = [
  ['shield', 'GOVERNED EXECUTION', 'Policy, permissions, and approved limits.'],
  ['lock', 'PRIVATE STATE', 'Sensitive context stays protected.'],
  ['file', 'VERIFIABLE OUTCOMES', 'Decisions can be reconstructed and verified.'],
];

export default function FinalCta({ onDialog }) {
  return (
    <section className="final-cta dark-panel">
      <div className="final-cta-inner">
        <div className="edge-art left" aria-hidden="true"><img src="/assets/images/glass-blocks.webp" alt="" loading="lazy" decoding="async" /></div>
        <div className="edge-art right" aria-hidden="true"><img src="/assets/images/glass-blocks.webp" alt="" loading="lazy" decoding="async" /></div>
        <h2>Build the <em>infrastructure</em> agents can trust.</h2>
        <div className="final-benefits">
          {benefits.map(([icon, title, sub]) => (
            <div key={title}><Icon name={icon} /><span><b>{title}</b><small>{sub}</small></span></div>
          ))}
        </div>
        <div className="actions">
          <a className="button cyan" href={TYPEFORM_URL} target="_blank" rel="noopener noreferrer">Request a demo <span aria-hidden="true">→</span></a>
          <a className="button dark" href={TYPEFORM_URL} target="_blank" rel="noopener noreferrer">Talk to Us <span aria-hidden="true">→</span></a>
        </div>
        <p>Agents decide. Vishwa enforces the mandate. Approved systems execute.</p>
      </div>
    </section>
  );
}
