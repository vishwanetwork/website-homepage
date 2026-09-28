import React from 'react';
import Icon from './Icon.jsx';

const stories = [
  ['institutional-finance', 'bank', 'INSTITUTIONAL FINANCE', ['Mandates, approvals, counterparties,', 'settlement, and auditability.']],
  ['gpu-compute', 'chip', 'ENTERPRISE COMPUTE', ['Demand, policy, approved supply,', 'delivery evidence, and settlement.']],
];

const articles = [
  ['insight-0', 'podcast.webp', 'PODCAST', ['What autonomous', 'capital requires.']],
  ['insight-1', 'article-document.webp', 'BLOG', ['Why enforcement', 'belongs before execution.']],
  ['insight-2', 'workflow-screen.svg', 'WORKFLOW', ['From approval queues', 'to governed workflows.']],
  ['insight-3', 'research-screen.svg', 'RESEARCH', ['The control plane', 'for financial agents.']],
];

export default function Insights({ onDialog }) {
  return (
    <section id="insights" className="section with-edges">
      <div className="wrap">
        <div className="edge-art left" aria-hidden="true"><img src="/assets/images/glass-blocks.webp" alt="" loading="lazy" decoding="async" /></div>
        <div className="edge-art right" aria-hidden="true"><img src="/assets/images/glass-blocks.webp" alt="" loading="lazy" decoding="async" /></div>
        <div className="section-heading">
          <span className="eyebrow">PART 10 / INSIGHTS & REAL-WORLD WORKFLOWS</span>
          <h2>Built for the workflows<br /><em>agents are entering.</em></h2>
          <p className="subtitle">Research, institutional conversations, and real execution patterns behind governed agent infrastructure.</p>
        </div>
        <div className="domain-stories">
          {stories.map(([img, icon, title, lines]) => (
            <article key={title}>
              <img src={`/assets/images/${img}.webp`} alt="" loading="lazy" decoding="async" />
              <Icon name={icon} />
              <div><h3>{title}</h3><p>{lines[0]}<br />{lines[1]}</p></div>
            </article>
          ))}
        </div>
        <div className="article-grid">
          {articles.map(([id, img, tag, lines]) => (
            <button className="article-card" key={id} onClick={() => onDialog(id)}>
              <img className="article-image" src={`/assets/images/${img}`} alt="" loading="lazy" decoding="async" />
              <div>
                <small><Icon name="file" />{tag}</small>
                <h3>{lines[0]}<br />{lines[1]}</h3>
                <span>→</span>
              </div>
            </button>
          ))}
        </div>
        <div className="actions">
          <button className="button dark" onClick={() => onDialog('insights-library')}>Explore insights and use cases <span aria-hidden="true">→</span></button>
        </div>
      </div>
    </section>
  );
}
