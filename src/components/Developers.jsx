import React from 'react';
import Icon from './Icon.jsx';
import { TYPEFORM_URL } from '../config.js';

const requestExamples = {
  financial: {
    mandate: 'treasury_policy_v4',
    constraints: ['approved_venues', 'spend_limit'],
    intent: 'move_2.4M_USDC_to_treasury',
    agent: 'agt_7f2c',
    venue: 'existing_venue',
  },
  resource: {
    mandate: 'compute_policy_v2',
    constraints: ['approved_region', 'provider_sla'],
    intent: 'source_256_H100s_in_Singapore',
    agent: 'agt_91ab',
    duration_days: 90,
  },
};

const authorized = {
  status: 'AUTHORIZED',
  message: 'Policy matched · approved venue · within limit.',
  proof: 'pf_17d9e3',
};

const blocked = {
  status: 'BLOCKED',
  message: 'Policy violation · spend limit exceeded.',
  proof: 'pf_8a3c1f',
};

const steps = [
  ['01', 'CONNECT', ['Bring your agent and', 'existing stack.'], 'execution-stack'],
  ['02', 'DECLARE THE MANDATE', ['Set permissions, limits, and', 'approved execution paths.'], 'proof-document'],
  ['03', 'EXECUTE WITH PROOF', ['Route requests through', 'policy checks and receive', 'a verifiable result.'], 'workflow-cubes'],
];

// Render an object as highlighted JSON code
function CodeBlock({ data }) {
  const json = JSON.stringify(data, null, 2);
  return <code>{json}</code>;
}

export default function Developers({ onCopy, onDialog }) {
  const [tab, setTab] = React.useState('financial');

  return (
    <section id="developers" className="section with-edges">
      <div className="wrap">
        <div className="edge-art left" aria-hidden="true"><img src="/assets/images/glass-blocks.webp" alt="" loading="lazy" decoding="async" /></div>
        <div className="edge-art right" aria-hidden="true"><img src="/assets/images/glass-blocks.webp" alt="" loading="lazy" decoding="async" /></div>
        <div className="section-heading">
          <span className="eyebrow">PART 08 / DEVELOPER INTEGRATION</span>
          <h2>One <em>governed interface for every workflow.</em></h2>
          <p className="subtitle">Connect an agent, declare its mandate, and route policy-enforced execution through the tools and venues you already use.</p>
        </div>
        <div className="integration-surfaces">
          <div className="divider-label">INTEGRATION SURFACES</div>
          <div>
            <span className="surface-tag"><Icon name="code" />API</span>
            <span className="surface-tag"><Icon name="cube" />SDK</span>
            <span className="surface-tag"><Icon name="terminal" />CLI</span>
            <span className="surface-tag"><Icon name="network" />MCP</span>
          </div>
          <p>Availability is confirmed for each deployment during technical scoping.</p>
        </div>
        <div className="developer-panel dark-panel">
          <div className="agent-tabs" role="tablist" aria-label="Agent request examples">
            <button className={tab === 'financial' ? 'selected' : undefined} role="tab" aria-selected={tab === 'financial'} onClick={() => setTab('financial')}>
              <Icon name="file" />FINANCIAL AGENT
            </button>
            <button className={tab === 'resource' ? 'selected' : undefined} role="tab" aria-selected={tab === 'resource'} onClick={() => setTab('resource')}>
              <Icon name="layers" />RESOURCE AGENT
            </button>
          </div>
          <div className="request-col">
            <div role="tabpanel">
              <div className="codebox">
                <header>REQUEST&nbsp; <em>POST /v1/workflows</em>
                  <button onClick={() => onCopy(JSON.stringify(requestExamples[tab], null, 2))} aria-label="Copy request"><Icon name="copy" /></button>
                </header>
                <pre><CodeBlock data={requestExamples[tab]} /></pre>
              </div>
            </div>
          </div>
          <div className="response-panels">
            <div className="codebox">
              <header>AUTHORIZED RESPONSE · <em>ILLUSTRATIVE</em>
                <button onClick={() => onCopy(JSON.stringify(authorized, null, 2))} aria-label="Copy authorized response"><Icon name="copy" /></button>
              </header>
              <pre><CodeBlock data={authorized} /></pre>
            </div>
            <div className="codebox">
              <header>BLOCKED RESPONSE · <em>ILLUSTRATIVE</em>
                <button onClick={() => onCopy(JSON.stringify(blocked, null, 2))} aria-label="Copy blocked response"><Icon name="copy" /></button>
              </header>
              <pre><CodeBlock data={blocked} /></pre>
            </div>
          </div>
        </div>
        <div className="developer-steps">
          {steps.map(([num, title, lines, img]) => (
            <article key={num}>
              <div>
                <h3><span>{num}</span> / {title}</h3>
                <p>{lines.map((l, i) => (<React.Fragment key={i}>{i > 0 && <br />}{l}</React.Fragment>))}</p>
              </div>
              <img src={`/assets/images/${img}.webp`} alt="" loading="lazy" decoding="async" />
            </article>
          ))}
        </div>
        <div className="actions">
          <a className="button dark" href={TYPEFORM_URL} target="_blank" rel="noopener noreferrer">Request a demo <span aria-hidden="true">→</span></a>
          <button className="button" onClick={() => onDialog && onDialog('docs')}>Read the Docs <span aria-hidden="true">→</span></button>
        </div>
        <div className="divider-label developer-caption">Agent-native by design. Designed for institutional workflows.</div>
      </div>
    </section>
  );
}
