import React from 'react';
import Icon from './Icon.jsx';

const marketStats = [
  ['AVAILABILITY', '12,480', 'GPUs online', '', ''],
  ['AVG. PRICE (H100)', '$2.32 /hr', '', '12% (7d)', 'down'],
  ['PERFORMANCE', '184 TFLOPS', '', '8% (7d)', 'up'],
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
          <a className="finance-card" href="https://vishwalab.com/bankinginfra" target="_blank" rel="noopener noreferrer">
            <Icon name="bank" />
            <div><small>FINANCIAL AGENTS</small><h3>Agentic Native Banking Infra</h3><p>Treasury · Payments · Credit · Vaults</p></div>
          </a>
          <a className="finance-card" href="/market-distribution.html">
            <Icon name="network" />
            <div><small>FINANCIAL AGENTS</small><h3>MARKET DISTRIBUTION</h3><p>Products · Channels · Counterparties · Venues</p></div>
          </a>
        </div>
        <div className="divider-label">ONE CONTROL PLANE. TWO AGENT DOMAINS.</div>
        <div className="compute-band dark-panel">
          <div className="compute-intro">
            <Icon name="cube" />
            <div>
              <small>RESOURCE AGENTS</small>
              <h3>AGENT-NATIVE<br /><em>COMPUTE MARKETS</em></h3>
              <p>Resource agents source, compare, procure, and<br />settle AI compute across approved providers—<br />then return idle capacity to the market.</p>
              <a className="button cyan" href="https://open-next.ai/" target="_blank" rel="noopener noreferrer">Explore OpenNEXT <span aria-hidden="true">→</span></a>
            </div>
          </div>
          <div className="compute-market">
            <header>
              <Icon name="chart" />
              <h4>GPU Market Data Screened by AI Agents</h4>
              <a href="/opennext-index-factory.html" target="_blank" rel="noopener noreferrer">View GPU Index <span aria-hidden="true">→</span></a>
            </header>
            <div className="market-stats">
              {marketStats.map(([label, value, unit, delta, dir]) => (
                <div key={label}>
                  <small>{label}</small>
                  <b>{value}</b>
                  {unit && <span className="stat-unit">{unit}</span>}
                  {delta && <span className={`stat-delta ${dir}`}>{dir === 'down' ? '▼' : '▲'} {delta}</span>}
                </div>
              ))}
            </div>
            <img className="market-chart" src="/assets/icons/gpu-price-chart-flat.svg" alt="Illustrative GPU price trends. Example curves, not live market prices." loading="lazy" decoding="async" />
          </div>
        </div>
      </div>
    </section>
  );
}
