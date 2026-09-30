import React from 'react';
import Icon from './Icon.jsx';
import { DEMO_URL } from '../config.js';

const trail = [
  ['file', 'INTENT', '2025-04-23 14:01:12', [['source', 'agent_input'], ['intent', 'treasury_swap'], ['scope', 'institutional']]],
  ['file', 'PRIVATE STATE', '2025-04-23 14:01:16', [['state_ref', 'ps_4e9a1d'], ['data_set', 'treasury_state'], ['access', 'permitted']]],
  ['shield', 'POLICY CHECK', '2025-04-23 14:01:19', [['policy', 'treasury_v4'], ['mandate', 'risk_limits'], ['result', 'approved']]],
  ['gear', 'ORCHESTRATION', '2025-04-23 14:01:21', [['workflow', 'treasury_swap'], ['steps', '5'], ['trace_id', 'tr_92c7b3']]],
  ['layers', 'VERIFICATION\nRECORD', '2025-04-23 14:01:26', [['record_id', 'vf_17d9e3'], ['type', 'verification'], ['status', 'recorded']]],
  ['play', 'EXECUTION\nOUTCOME', '2025-04-23 14:01:34', [['venue', 'existing_venue'], ['tx_ref', 'vx_6a21f0'], ['status', 'executed']]],
];

const values = [
  ['file', 'DECISION EXPLAINABLE', ['Why it was approved or', 'blocked.'], 'proof-document'],
  ['network', 'WORKFLOW TRACEABLE', ['Follow each approved', 'handoff.'], 'workflow-cubes'],
  ['gear', 'EXECUTION VERIFIABLE', ['Verify the request', 'matched its mandate.'], 'proof-document'],
  ['refresh', 'DECISION TRAIL\nRECONSTRUCTABLE', ['Reconstruct the decision', 'path when needed.'], 'execution-stack'],
];

const record = [
  ['user', 'Agent ID', 'agt_7f2c'],
  ['shield', 'Mandate', 'risk_limits'],
  ['file', 'Policy result', 'approved'],
  ['layers', 'Approved venue', 'existing_venue'],
  ['play', 'Execution status', 'executed'],
  ['file', 'Decision timestamp', '2025-04-23 14:01:34'],
];

function multiline(text) {
  return text.split('\n').map((l, i) => (<React.Fragment key={i}>{i > 0 && <br />}{l}</React.Fragment>));
}

export default function Records({ onCopy }) {
  return (
    <section id="records" className="section with-edges">
      <div className="wrap">
        <div className="edge-art left" aria-hidden="true"><img src="/assets/images/glass-blocks.webp" alt="" loading="lazy" decoding="async" /></div>
        <div className="edge-art right" aria-hidden="true"><img src="/assets/images/glass-blocks.webp" alt="" loading="lazy" decoding="async" /></div>
        <div className="section-heading">
          <span className="eyebrow">PART 07 / EXECUTION RECORDS</span>
          <h2>Every decision accountable. <em>Every execution verifiable.</em></h2>
          <p className="subtitle">Vishwa preserves the decision trail—from intent and policy checks to approved execution and outcome.</p>
        </div>
        <div className="record-flow dark-panel">
          {trail.map(([icon, title, time, rows]) => (
            <article key={title}>
              <header><Icon name={icon} /><span>{multiline(title)}</span></header>
              <p className="time-check">✓ <time>{time}</time></p>
              {rows.map(([k, v]) => (<div className="data-row" key={k}><span>{k}</span><span>{v}</span></div>))}
            </article>
          ))}
        </div>
        <div className="record-bottom">
          <div className="value-cards">
            {values.map(([icon, title, lines, img]) => (
              <article key={title}>
                <Icon name={icon} />
                <h3>{multiline(title)}</h3>
                <p>{lines[0]}<br />{lines[1]}</p>
                <img className="value-art" src={`/assets/images/${img}.webp`} alt="" loading="lazy" decoding="async" />
              </article>
            ))}
          </div>
          <div className="execution-record">
            <header><i className="status-dot"></i>EXECUTION RECORD <small>ILLUSTRATIVE RECORD</small></header>
            {record.map(([icon, label, val]) => (
              <div key={label}>
                <Icon name={icon} /><span>{label}</span><b>{val}</b>
                <button className="copy-field" onClick={() => onCopy(val)} aria-label={`Copy ${label}`}><Icon name="copy" /></button>
              </div>
            ))}
          </div>
          <div className="actions">
            <a className="button dark" href={DEMO_URL} target="_blank" rel="noopener noreferrer">Request a demo <span aria-hidden="true">→</span></a>
          </div>
          <p className="bottom-note">No black-box execution. Every outcome has a decision record.</p>
        </div>
      </div>
    </section>
  );
}
