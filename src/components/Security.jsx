import React from 'react';
import Icon from './Icon.jsx';

const cards = [
  ['file', 'NON-CUSTODIAL BY DESIGN', ['Vishwa enforces policy without', 'taking custody of customer', 'funds or private keys.']],
  ['shield', 'DOCUMENTED CONTROLS', ['Security architecture and control', 'scope can be reviewed during', 'technical diligence.']],
  ['file', 'STANDARDS-ALIGNED', ['Designed to align with institutional', 'security and control requirements.']],
];

const flow = [
  ['user', 'IDENTITY VERIFIED'],
  ['file', 'POLICY ENFORCED'],
  ['shield', 'EXECUTION GOVERNED'],
  ['servers', 'DECISION RECORDED'],
];

export default function Security({ onDialog }) {
  return (
    <section id="security" className="section with-edges">
      <div className="wrap">
        <div className="edge-art left" aria-hidden="true"><img src="/assets/images/glass-blocks.webp" alt="" loading="lazy" decoding="async" /></div>
        <div className="edge-art right" aria-hidden="true"><img src="/assets/images/glass-blocks.webp" alt="" loading="lazy" decoding="async" /></div>
        <div className="section-heading">
          <span className="eyebrow">PART 09 / SECURITY & EVIDENCE</span>
          <h2>Built for independent <em>verification.</em></h2>
          <p className="subtitle">Vishwa governs execution without taking custody of customer funds or private keys.</p>
        </div>
        <div className="security-cards">
          {cards.map(([icon, title, lines]) => (
            <article key={title}>
              <Icon name={icon} />
              <h3>{title}</h3>
              <p>{lines.map((l, i) => (<React.Fragment key={i}>{i > 0 && <br />}{l}</React.Fragment>))}</p>
            </article>
          ))}
        </div>
        <div className="programs">
          <h3>PROGRAM SELECTIONS</h3>
          <div>
            <p><Icon name="file" /><span>Selected for Anthropic’s Cyber Verification Program.<small>Program participation — not a security certification.</small></span></p>
            <p><Icon name="file" /><span>Selected for a Plug and Play accelerator program.<small>Fall 2026 cohort.</small></span></p>
            <button onClick={() => onDialog('programs')}>Official program announcement ↗</button>
          </div>
        </div>
        <div className="security-flow dark-panel">
          {flow.map(([icon, label]) => (<div key={label}><Icon name={icon} /><b>{label}</b></div>))}
        </div>
        {/* <p className="security-note">Security is an architectural property—not a feature toggle.</p> */}
      </div>
    </section>
  );
}
