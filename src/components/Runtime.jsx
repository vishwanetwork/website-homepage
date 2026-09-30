import React from 'react';
import Icon from './Icon.jsx';

const computeFlow = [
  ['layers', 'SOURCE', 'COMPUTE'],
  ['file', 'SELECT', 'PROVIDERS'],
  ['network', 'COORDINATE', 'DELIVERY'],
  ['check', 'SETTLE', 'COMPUTE'],
];

export default function Runtime() {
  return (
    <section id="runtime" className="section">
      <div className="wrap">
        <div className="section-heading">
          <span className="eyebrow">PART 02 / ONE RUNTIME</span>
          <h2>One governed runtime <em>across capital and compute.</em></h2>
          <p className="subtitle">Financial agents move capital. Resource agents source and settle compute.<br />Vishwa governs both through the same policy, proof, and settlement layer.</p>
        </div>
        <div className="finance-grid">
          <div className="finance-card">
            <Icon name="bank" />
            <div><small>FINANCIAL AGENTS</small><h3>Agentic Native Banking Infra</h3><p>Treasury · Payments · Credit · Vaults</p></div>
          </div>
          <div className="finance-card">
            <Icon name="network" />
            <div><small>FINANCIAL AGENTS</small><h3>MARKET DISTRIBUTION</h3><p>Products · Channels · Counterparties · Venues</p></div>
          </div>
        </div>
        <div className="divider-label">TWO AGENT DOMAINS. ONE GOVERNED RUNTIME.</div>
        <div className="compute-band dark-panel">
          <div className="compute-intro">
            <Icon name="cube" />
            <div>
              <small>RESOURCE AGENTS</small>
              <h3>COMPUTE <em>COORDINATION</em></h3>
              <p>Source compute, select approved providers,<br />coordinate delivery, and settle.</p>
              <a className="button cyan" href="https://open-next.ai/" target="_blank" rel="noopener noreferrer">Explore OpenNEXT <span aria-hidden="true">→</span></a>
            </div>
          </div>
          <div className="compute-flow">
            {computeFlow.map(([icon, a, b]) => (
              <div key={a + b}><Icon name={icon} /><span>{a}<br />{b}</span></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
