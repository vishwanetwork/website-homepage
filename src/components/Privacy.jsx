import React from 'react';
import Icon from './Icon.jsx';

const nodes = [
  ['pnode-0', 'network', 'MODEL'],
  ['pnode-1', 'people', 'COUNTERPARTY'],
  ['pnode-2', 'gear', 'TOOL'],
  ['pnode-3', 'bank', 'VENUE'],
];

const cards = [
  ['database', 'DATA MINIMIZATION', ['Only the context required for the task', 'moves forward.']],
  ['shield', 'CONFIDENTIAL COMPUTE', ['Sensitive state remains protected', 'during coordination and execution.']],
  ['file', 'VERIFIABLE HANDOFF', ['Prove requirements were met without', 'exposing the underlying state.']],
];

export default function Privacy() {
  return (
    <section id="privacy" className="section">
      <div className="wrap">
        <div className="privacy-layout">
          <div>
            <div className="section-heading align-left">
              <span className="eyebrow">PART 04 / PRIVACY</span>
              <h2>Private state <em>stays private.</em></h2>
              <p className="subtitle">Sensitive context stays protected as it moves across models, tools, counterparties and venues.</p>
            </div>
            <div className="privacy-illustration">
              <svg className="privacy-connectors" viewBox="0 0 980 510" preserveAspectRatio="none" aria-hidden="true">
                <g fill="none" stroke="#00c89d" strokeWidth="2" strokeDasharray="3 5">
                  <path d="M125 106C250 80 210 215 380 230M850 106C730 90 775 210 600 230M125 400C245 420 235 303 390 290M850 400C725 420 760 307 600 290" />
                </g>
                <g fill="#00dba7">
                  <circle cx="210" cy="133" r="5" /><circle cx="263" cy="192" r="5" />
                  <circle cx="771" cy="133" r="5" /><circle cx="718" cy="192" r="5" />
                  <circle cx="215" cy="372" r="5" /><circle cx="267" cy="326" r="5" />
                  <circle cx="770" cy="372" r="5" /><circle cx="715" cy="326" r="5" />
                </g>
              </svg>
              <img className="privacy-art" src="/assets/images/private-state.webp" alt="Nested private state protected by emerald glass layers" loading="lazy" decoding="async" />
              {nodes.map(([cls, icon, label]) => (
                <div className={`privacy-node ${cls}`} key={cls}><span><Icon name={icon} /></span><b>{label}</b></div>
              ))}
              <div className="private-label"><Icon name="lock" /><b>PRIVATE<br />STATE</b></div>
            </div>
          </div>
          <div className="privacy-details">
            {cards.map(([icon, title, lines]) => (
              <article className="privacy-card" key={title}>
                <Icon name={icon} />
                <div><h3>{title}</h3><p>{lines[0]}<br />{lines[1]}</p></div>
              </article>
            ))}
            <div className="chips"><span>Encrypted state</span><span>Permissioned disclosure</span><span>Verifiable handoff</span></div>
            <p className="fineprint">Privacy-preserving verification provides stronger assurance without revealing sensitive state.</p>
            <a className="button dark" href="https://vishwalab.com/bankinginfra/blogDetail?slug=selective-disclosure" target="_blank" rel="noopener noreferrer">Explore the Privacy Architecture <span aria-hidden="true">→</span></a>
          </div>
        </div>
        <div className="strap dark-panel">
          <span className="light-line"></span>
          <strong><em>Privacy</em> is part of the runtime — not an add-on.</strong>
          <span className="light-line"></span>
        </div>
      </div>
    </section>
  );
}
