import React from 'react';
import Icon from './Icon.jsx';
import { DEMO_URL } from '../config.js';

const pipeline = [
  ['file', '01 DESCRIBE INTENT', ['Natural-language', 'demand']],
  ['shield', '02 APPLY POLICY', ['Budgets, regions,', 'SLA and approvals']],
  ['cube', '03 MATCH SUPPLY', ['Models, GPUs', 'and providers']],
  ['gear', '04 COORDINATE DELIVERY', ['Terms, availability', 'and delivery']],
  ['play', '05 EXECUTE & SETTLE', ['Order, run', 'and settlement']],
];

const constraints = [
  ['network', 'Models', 'LLMs · Diffusion · Custom'],
  ['chip', 'GPUs', 'H100 · B200 · 4090 and more'],
  ['pin', 'Regions', 'Singapore · US · EU and more'],
  ['database', 'Budget', 'Cost targets and constraints'],
  ['shield', 'SLA', 'Availability and performance'],
];

const evidence = [
  ['database', 'BUDGET'], ['pin', 'APPROVED REGION'],
  ['shield', 'PROVIDER SLA'], ['database', 'AVAILABILITY'],
];

const providers = [
  ['globe', 'Provider A', 'Singapore, SG'],
  ['cube', 'Provider B', 'Tokyo, JP'],
  ['servers', 'Provider C', 'Seattle, US'],
];

export default function OpenNext({ onDialog }) {
  return (
    <section id="opennext" className="section">
      <div className="wrap">
        <div className="section-heading">
          <span className="eyebrow">PART 06 / OPENNEXT — APPLICATION</span>
          <h2>From demand to <em>governed compute execution.</em></h2>
          <p className="subtitle">Resource agents turn natural-language demand into policy-aware sourcing,<br />approved providers, delivery, and settlement.</p>
        </div>
        <div className="compute-dashboard dark-panel">
          <div className="pipeline">
            {pipeline.map(([icon, title, lines]) => (
              <div key={title}><Icon name={icon} /><span><b>{title}</b><span>{lines[0]}<br />{lines[1]}</span></span></div>
            ))}
          </div>
          <div className="compute-body">
            <svg className="routing-lines" aria-hidden="true"></svg>
            <div className="intent-card">
              <h3>ILLUSTRATIVE REQUEST</h3>
              <p>Need 256 H100s in Singapore for 90 days. Prioritize availability, SLA and total cost.</p>
              <span>➤</span>
            </div>
            <div className="constraint-list">
              {constraints.map(([icon, title, sub]) => (
                <div key={title}><Icon name={icon} /><span><b>{title}</b><small>{sub}</small></span></div>
              ))}
            </div>
            <div className="resource-hub">
              <Icon name="cube" /><b>RESOURCE<br />AGENTS</b>
              <div className="policy-evidence">
                <h3>POLICY EVIDENCE</h3>
                {evidence.map(([icon, label], i) => (<div key={label + i}><Icon name={icon} /><span>{label}</span><b>✓</b></div>))}
              </div>
            </div>
            <div className="provider-list">
              <h3>PROVIDER MATCHES</h3>
              {providers.map(([icon, name, loc]) => (
                <article key={name}>
                  <Icon name={icon} />
                  <div><b>{name}</b><small>⌖ {loc}</small></div>
                  <span className="sample-label">ILLUSTRATIVE<br />DATA</span>
                  <div className="provider-metrics">
                    <span>Availability<br /><b>ILLUSTRATIVE DATA</b></span>
                    <span>Hourly Price<br /><b>ILLUSTRATIVE DATA</b></span>
                  </div>
                </article>
              ))}
            </div>
            <div className="gpu-index">
              <header><Icon name="chart" /><h3>GPU INDEX</h3><span className="sample-label">ILLUSTRATIVE DATA</span></header>
              <p>Availability · Price · Performance</p>
              <div className="gpu-metrics">
                <div><b>ILLUSTRATIVE<br />DATA</b><span>GPUs online</span></div>
                <div><b>ILLUSTRATIVE<br />DATA</b><span>Avg. price (H100)</span></div>
                <div><b>ILLUSTRATIVE<br />DATA</b><span>Avg. performance</span></div>
              </div>
              <img className="gpu-chart-img" src="/assets/icons/gpu-price-chart.svg" alt="Illustrative GPU price trends. Example curves, not live market prices." loading="lazy" decoding="async" />
            </div>
          </div>
          <div className="actions">
            <a className="button cyan" href={DEMO_URL} target="_blank" rel="noopener noreferrer">Request a demo <span aria-hidden="true">→</span></a>
            <a className="button dark" href="/opennext-index-factory.html" target="_blank" rel="noopener noreferrer">View GPU Index <span aria-hidden="true">→</span></a>
          </div>
          <div className="dashboard-caption">Intent → policy → approved compute → settlement.</div>
        </div>
      </div>
    </section>
  );
}
