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
  ['database', 'BUDGET'], ['pin', 'REGION POLICY'],
  ['shield', 'PROVIDER SLA'], ['database', 'AVAILABILITY'],
];

const providers = [
  { icon: 'globe', name: 'Runpod', gpuLabel: 'H100 SXM', vramGB: 80, usdPerGpuHour: 3.49, sourceUrl: 'https://www.runpod.io/pricing' },
  { icon: 'cube', name: 'Verda', gpuLabel: 'H100 SXM5', vramGB: 80, usdPerGpuHour: 3.77, sourceUrl: 'https://verda.com/pricing?currency=usd' },
  { icon: 'servers', name: 'Lambda', gpuLabel: 'H100 SXM', vramGB: 80, usdPerGpuHour: 4.29, sourceUrl: 'https://lambda.ai/pricing' },
];

const money = value => `$${value.toFixed(2)}`;
const quotedProviderCount = new Set(providers.map(provider => provider.name)).size;
const h100From = Math.min(...providers.map(provider => provider.usdPerGpuHour));

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
              <h3>COMPUTE REQUEST</h3>
              <p>Compare H100 GPU pricing across providers. Prioritize memory, service terms and compute cost.</p>
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
                <h3>POLICY CRITERIA</h3>
                {evidence.map(([icon, label], i) => (<div key={label + i}><Icon name={icon} /><span>{label}</span><b aria-hidden="true">○</b></div>))}
              </div>
            </div>
            <div className="provider-list">
              <h3>PUBLIC GPU OFFERS</h3>
              {providers.map(({ icon, name, gpuLabel, vramGB, usdPerGpuHour, sourceUrl }) => (
                <article key={name}>
                  <Icon name={icon} />
                  <div><b>{name}</b><small>{gpuLabel} · 1 GPU</small></div>
                  <span className="sample-label"><a href={sourceUrl} target="_blank" rel="noopener noreferrer" aria-label={`${name} official pricing`}>SOURCE ↗</a></span>
                  <div className="provider-metrics">
                    <span>VRAM<b>{vramGB} GB</b></span>
                    <span>USD / GPU-hr<b>{money(usdPerGpuHour)}</b></span>
                  </div>
                </article>
              ))}
            </div>
            <div className="gpu-index">
              <header><Icon name="chart" /><h3>GPU PRICES</h3></header>
              <p>Public quotes · USD / GPU-hour</p>
              <div className="gpu-metrics">
                <div><b>{quotedProviderCount}</b><span>Quoted Providers</span></div>
                <div><b>{money(h100From)}</b><span>H100 From</span></div>
                <div><b>80 GB</b><span>H100 VRAM</span></div>
              </div>
              <img className="gpu-chart-img" src="/assets/icons/gpu-price-chart.svg" alt="Illustrative GPU price trends. Example curves, not live market prices." loading="lazy" decoding="async" />
            </div>
          </div>
          <div className="actions actions-gpu">
            <a className="button cyan" href={DEMO_URL} target="_blank" rel="noopener noreferrer">Request a demo <span aria-hidden="true">→</span></a>
            <a className="button dark" href="/opennext-index-factory.html" target="_blank" rel="noopener noreferrer">View GPU Index <span aria-hidden="true">→</span></a>
          </div>
          <div className="dashboard-caption">Intent → policy → approved compute → settlement.</div>
        </div>
      </div>
    </section>
  );
}
