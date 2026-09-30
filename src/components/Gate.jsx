import React from 'react';
import Icon from './Icon.jsx';
import { DEMO_URL } from '../config.js';

const specify = [
  ['user', 'IDENTITY'], ['bank', 'AUTHORITY'], ['file', 'PROVENANCE'],
  ['gear', 'CONSISTENCY'], ['database', 'SOLVENCY'], ['shield', 'COMPLIANCE'],
];
const markets = [
  ['bank', 'TREASURY'], ['wallet', 'PAYMENTS & FX'], ['chart', 'CREDIT & LENDING'],
  ['sliders', 'TRADING & HEDGING'], ['people', 'INSURANCE & WEALTH'], ['chip', 'COMPUTE & AI\nINFRASTRUCTURE'],
];
const controls = [
  ['database', 'Spend limits'], ['bank', 'Approved venues'],
  ['chart', 'Velocity rules'], ['people', 'Permitted operations'],
];

function Node({ icon, label }) {
  return (
    <div className="gate-node">
      <Icon name={icon} />
      <span>{label.split('\n').map((l, i) => (<React.Fragment key={i}>{i > 0 && <br />}{l}</React.Fragment>))}</span>
    </div>
  );
}

export default function Gate() {
  return (
    <section id="gate" className="section">
      <div className="wrap">
        <div className="section-heading">
          <span className="eyebrow">PART 03 / GATE</span>
          <h2>A mandate <em>agents cannot exceed.</em></h2>
          <p className="subtitle">Every request is checked against identity, authority, solvency, compliance, and execution constraints before capital or compute moves.</p>
        </div>
        <div className="gate-layout">
          <div className="gate-diagram">
            <div className="gate-column">
              <h3>WHAT A MANDATE MUST SPECIFY</h3>
              {specify.map(([i, l]) => <Node key={l} icon={i} label={l} />)}
            </div>
            <div className="gate-center">
              <svg className="gate-lines" preserveAspectRatio="none" aria-hidden="true"></svg>
              <img className="gate-art" src="/assets/images/gate-portal.webp" alt="Emerald glass enforcement gate" loading="lazy" decoding="async" />
              <div className="gate-caption"><b>THE GATE</b><span>CONTROL + ENFORCEMENT</span></div>
            </div>
            <div className="gate-column">
              <h3>MARKETS IT OPENS</h3>
              {markets.map(([i, l]) => <Node key={l} icon={i} label={l} />)}
            </div>
          </div>
          <div className="gate-aside">
            <div className="requests">
              <article className="request-card">
                <header>REQUEST A<Icon name="file" /></header>
                <div className="data-row"><span>Agent</span><span>agt_7f2c</span></div>
                <div className="data-row"><span>Mandate</span><span>Treasury policy</span></div>
                <div className="data-row"><span>Counterparty</span><span>approved</span></div>
                <div className="data-row"><span>Amount</span><span>within limit</span></div>
                <div className="request-result authorized"><Icon name="check" /><b>AUTHORIZED —<br />ROUTED TO APPROVED VENUES</b></div>
              </article>
              <article className="request-card">
                <header>REQUEST B<Icon name="file" /></header>
                <div className="data-row"><span>Agent</span><span>agt_91ab</span></div>
                <div className="data-row"><span>Mandate</span><span>Treasury policy</span></div>
                <div className="data-row"><span>Counterparty</span><span>approved</span></div>
                <div className="data-row"><span>Amount</span><span>exceeds limit</span></div>
                <div className="request-result blocked"><Icon name="shield" /><b>BLOCKED —<br />OUT OF POLICY</b></div>
              </article>
            </div>
            <div className="controls">
              <h3>ENFORCEMENT CONTROLS</h3>
              {controls.map(([i, l]) => (<div key={l}><Icon name={i} /><span>{l}</span><b>✓</b></div>))}
            </div>
            <a className="button dark" href={DEMO_URL} target="_blank" rel="noopener noreferrer">Request a demo <span aria-hidden="true">→</span></a>
          </div>
        </div>
        <div className="gate-footer dark-panel">
          <p><i className="status-dot"></i><b>Owner defines the mandate.</b> Vishwa enforces it before execution. <em>Every decision is recorded.</em></p>
          <span><Icon name="file" />Decision recorded for auditability.</span>
        </div>
      </div>
    </section>
  );
}
