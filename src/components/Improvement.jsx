import React from 'react';
import Icon from './Icon.jsx';

const signals = [
  ['star', 'QUALITY SIGNALS', ['Inform model and', 'tool selection.']],
  ['database', 'COST SIGNALS', ['Inform resource', 'routing.']],
  ['bolt', 'LATENCY SIGNALS', ['Inform execution-', 'path evaluation.']],
];

const fixed = [
  ['shield', 'POLICY'], ['people', 'PERMISSIONS'],
  ['sliders', 'LIMITS'], ['check', 'APPROVAL\nREQUIREMENTS'],
];

const orbitNodes = [
  ['orbit-0', 'play', 'EXECUTION'],
  ['orbit-1', 'chart', 'OUTCOME'],
  ['orbit-2', 'database', 'MEMORY /\nOBSERVABILITY'],
  ['orbit-3', 'search', 'EVALUATION'],
  ['orbit-4', 'layers', 'APPROVED\nWORKFLOW\nIMPROVEMENT'],
  ['orbit-5', 'refresh', 'NEXT RUN'],
];

const rotations = [0, 60, 120, 180, 240, 300];

function multiline(text) {
  return text.split('\n').map((l, i) => (<React.Fragment key={i}>{i > 0 && <br />}{l}</React.Fragment>));
}

export default function Improvement() {
  return (
    <section id="improvement" className="section">
      <div className="wrap">
        <div className="improvement-layout">
          <div>
            <div className="section-heading align-left">
              <span className="eyebrow">PART 05 / POLICY-BOUND IMPROVEMENT</span>
              <h2>Each run <em>improve the next—within policy.</em></h2>
              <p className="subtitle">Signals from approved runs enter an evaluation process.<br />Only validated and authorized improvements are applied to<br />routing, orchestration, or provider selection.</p>
            </div>
            <div className="signal-grid">
              {signals.map(([icon, title, lines]) => (
                <article key={title}><Icon name={icon} /><div><h3>{title}</h3><p>{lines[0]}<br />{lines[1]}</p></div></article>
              ))}
            </div>
            <div className="fixed-card">
              <h3>WHAT STAYS FIXED</h3>
              <div className="fixed-grid">
                {fixed.map(([icon, label]) => (<div key={label}><Icon name={icon} /><span>{multiline(label)}</span></div>))}
              </div>
              <p><Icon name="lock" />Workflow optimization cannot change these controls. Policy changes follow a<br />formal process led by authorized institutional personnel.</p>
            </div>
          </div>
          <div className="orbit">
            <span className="orbit-label"><Icon name="shield" /> INSTITUTIONAL POLICY · FIXED BOUNDARY</span>
            <svg viewBox="0 0 600 600" className="orbit-svg" aria-hidden="true">
              <defs>
                <marker id="arr" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="2.8" markerHeight="2.8" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#00d7a5" />
                </marker>
              </defs>
              <circle cx="300" cy="300" r="255" fill="none" stroke="#00d7a5" strokeDasharray="3 4" />
              <circle cx="300" cy="300" r="214" fill="none" stroke="#00d7a5" strokeOpacity=".13" strokeWidth="55" />
              <circle cx="300" cy="300" r="165" fill="none" stroke="#00d7a5" strokeOpacity=".55" />
              {rotations.map(deg => (
                <path key={deg} d="M300 112 A188 188 0 0 1 446 181" transform={`rotate(${deg} 300 300)`} fill="none" stroke="#00d7a5" strokeWidth="10" markerEnd="url(#arr)" />
              ))}
            </svg>
            <div className="orbit-center">
              <img src="/assets/images/workflow-memory.webp" alt="Workflow memory" loading="lazy" decoding="async" />
            </div>
            {orbitNodes.map(([cls, icon, label]) => (
              <div className={`orbit-node ${cls}`} key={cls}><Icon name={icon} /><span>{multiline(label)}</span></div>
            ))}
          </div>
        </div>
        <div className="strap dark-panel glass-strap">
          <span className="light-line"></span>
          <strong>Improve the workflow. <em>Never loosen the mandate.</em></strong>
          <span className="light-line"></span>
        </div>
      </div>
    </section>
  );
}
