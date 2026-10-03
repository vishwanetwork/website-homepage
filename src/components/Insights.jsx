import React from 'react';
import Icon from './Icon.jsx';

const stories = [
  ['institutional-finance', 'bank', 'INSTITUTIONAL FINANCE', ['Mandates, approvals, counterparties,', 'settlement, and auditability.']],
  ['gpu-compute', 'chip', 'ENTERPRISE COMPUTE', ['Demand, policy, approved supply,', 'delivery evidence, and settlement.']],
];

const articles = [
  ['https://vishwalab.com/podcast', 'podcast.webp', 'PODCAST', 'AI Agents and the Future of Financial Infrastructure'],
  ['https://vishwalab.com/blogDetail?slug=selective-disclosure', 'article-document.webp', 'BLOG', 'Why Selective Disclosure Is the Next Primitive'],
];

export default function Insights() {
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
        <div className="article-grid two-up">
          {articles.map(([href, img, tag, title]) => (
            <a className="article-card" key={href} href={href} target="_blank" rel="noopener noreferrer">
              <img className="article-image" src={`/assets/images/${img}`} alt="" loading="lazy" decoding="async" />
              <div>
                <small><Icon name="file" />{tag}</small>
                <h3>{title}</h3>
                <span>→</span>
              </div>
            </a>
          ))}
        </div>
        <div className="actions">
          <a className="insights-explore" href="https://vishwalab.com/blog" target="_blank" rel="noopener noreferrer">
            Explore more insights <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
