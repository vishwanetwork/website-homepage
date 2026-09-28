import React from 'react';
import Icon from './Icon.jsx';
import { TYPEFORM_URL } from '../config.js';

const flow = [
  ['user', 'AGENT INTENT'],
  ['file', 'PRIVATE STATE'],
  ['shield', 'POLICY'],
  ['gear', 'ORCHESTRATION'],
  ['layers', 'PROOF'],
  ['play', 'EXECUTION'],
];

export default function Hero() {
  return (
    <>
      <section id="home" className="hero">
        <div className="edge-art left" aria-hidden="true">
          <img src="/assets/images/glass-blocks.webp" alt="" loading="lazy" decoding="async" />
        </div>
        <div className="edge-art right" aria-hidden="true">
          <img src="/assets/images/glass-blocks.webp" alt="" loading="lazy" decoding="async" />
        </div>
        <div className="wrap">
          <span className="eyebrow">POLICY-ENFORCED EXECUTION FOR AUTONOMOUS AGENTS</span>
          <h1><span>Financial infrastructure</span><br />for autonomous agents.</h1>
          <h2>One governed runtime across capital and compute.</h2>
          <p className="hero-copy">Vishwa turns agent intent into policy-enforced execution.</p>
          <div className="actions">
            <a className="button dark" href={TYPEFORM_URL} target="_blank" rel="noopener noreferrer">Request a demo <span aria-hidden="true">→</span></a>
            <a className="button" href="#opennext">Explore OpenNEXT <span aria-hidden="true">→</span></a>
          </div>
          <div className="execution-strip dark-panel">
            <div className="line-label">THE GOVERNED EXECUTION PATH</div>
            <div className="flow">
              {flow.map(([icon, label]) => (
                <div className="flow-item" key={label}>
                  <Icon name={icon} />
                  <span>{label}</span>
                </div>
              ))}
            </div>
            <p>Institutions define the mandate. Vishwa enforces it before execution.</p>
          </div>
        </div>
      </section>
      <div className="recognition">
        <span>Selected for Anthropic’s Cyber Verification Program.</span>
        <span>Selected for a Plug and Play accelerator program. Fall 2026 cohort.</span>
      </div>
    </>
  );
}
