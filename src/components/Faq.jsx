import React from 'react';
import Icon from './Icon.jsx';

const items = [
  ['What is Vishwa?', 'Vishwa is a governed runtime for autonomous agents. It turns agent intent into policy-enforced execution across capital and compute. Agents decide, Vishwa enforces the mandate, and approved systems execute.'],
  ['What does the Gate enforce?', 'The Gate checks identity, authority, provenance, consistency, solvency, compliance, and execution constraints before capital or compute moves. Requests outside the declared mandate are blocked.'],
  ['How is Vishwa different from an API gateway or workflow controller?', 'An API gateway routes requests and a workflow controller coordinates steps. Vishwa governs whether an agent is authorized to act, under which mandate, within which limits, and through which approved execution path.'],
  ['Does Vishwa take custody of customer funds, assets, or private keys?', 'Vishwa governs execution without taking custody of customer funds or private keys. Existing approved systems retain responsibility for custody and execution.'],
  ['How does Vishwa protect sensitive state?', 'Sensitive context is minimized, protected during coordination, and disclosed only as permitted. Verifiable handoffs provide assurance that requirements were met without exposing the underlying state.'],
  ['How do resource agents and OpenNEXT work?', 'Resource agents interpret compute demand, apply institutional policy, source approved providers, coordinate delivery, and settle compute. OpenNEXT uses Vishwa’s runtime, Gate, policy, proof, and settlement capabilities.'],
];

export default function Faq() {
  return (
    <section id="faq" className="section">
      <div className="wrap">
        <div className="section-heading">
          <span className="eyebrow">PART 11 / FAQ</span>
          <h2>Common <em>questions.</em></h2>
          <p className="subtitle">What teams need to know before agents can act in production.</p>
        </div>
        <div className="faq-grid">
          <div className="faq-col">
            {items.filter((_, i) => i % 2 === 0).map(([q, a]) => (
              <details key={q}>
                <summary>
                  <span className="faq-symbol"><Icon name="network" /></span>
                  {q}
                  <span className="chevron">⌄</span>
                </summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
          <div className="faq-col">
            {items.filter((_, i) => i % 2 === 1).map(([q, a]) => (
              <details key={q}>
                <summary>
                  <span className="faq-symbol"><Icon name="network" /></span>
                  {q}
                  <span className="chevron">⌄</span>
                </summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
