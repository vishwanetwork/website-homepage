import React from 'react';
import { copyPages, gpuRows, requestExample } from '../dialogContent.js';
import { CONTACT_EMAIL, mailto } from '../config.js';

// Generic info dialog, replaces the native <dialog> from the delivery package
export default function Dialog({ id, onClose, onCopy }) {
  const ref = React.useRef(null);
  const [gpuFilter, setGpuFilter] = React.useState('all');

  React.useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    ref.current?.focus();
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  let body = null;
  if (id === 'contact') {
    body = (
      <>
        <span className="eyebrow">TALK TO VISHWA</span>
        <h2 id="dialog-title">Contact the team.</h2>
        <p>Reach us by email and our team will follow up with a technical scoping conversation about the workflows you want to govern.</p>
        <div className="contact-email">
          <a href={mailto('Talk to Vishwa')}>{CONTACT_EMAIL}</a>
          <button type="button" onClick={() => onCopy && onCopy(CONTACT_EMAIL)} aria-label="Copy email address">Copy</button>
        </div>
      </>
    );
  } else if (id === 'gpu-index') {
    const rows = gpuRows.filter(r => gpuFilter === 'all' || r[0] === gpuFilter);
    body = (
      <>
        <span className="eyebrow">ILLUSTRATIVE DATA</span>
        <h2 id="dialog-title">GPU Index</h2>
        <p>Explore the reference categories used in governed compute sourcing. This demonstration is not a live pricing feed.</p>
        <label htmlFor="gpu-filter">GPU class</label>
        <select id="gpu-filter" value={gpuFilter} onChange={e => setGpuFilter(e.target.value)}>
          <option value="all">All GPU classes</option>
          <option>H100</option><option>B200</option><option>4090</option>
        </select>
        <table>
          <thead><tr><th>GPU</th><th>Region</th><th>Contract</th><th>Availability</th></tr></thead>
          <tbody>{rows.map((r, i) => (<tr key={i}>{r.map((v, j) => (<td key={j}>{v}</td>))}</tr>))}</tbody>
        </table>
        <p className="fineprint">All rows are illustrative. Production market data requires the configured GPU Index service.</p>
      </>
    );
  } else if (copyPages[id]) {
    const [kicker, heading, lead, ...sections] = copyPages[id];
    body = (
      <>
        <span className="eyebrow">{kicker}</span>
        <h2 id="dialog-title">{heading}</h2>
        <p>{lead}</p>
        {sections.map((s, i) => {
          const [h, p] = s.split('|');
          return (<React.Fragment key={i}><h3>{h}</h3><p>{p}</p></React.Fragment>);
        })}
        {id === 'docs' && (
          <>
            <p><strong>Illustrative request</strong></p>
            <pre>{JSON.stringify(requestExample, null, 2)}</pre>
          </>
        )}
      </>
    );
  } else {
    return null;
  }

  return (
    <div className="dialog-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="dialog-panel" role="dialog" aria-modal="true" aria-labelledby="dialog-title" tabIndex={-1} ref={ref}>
        <button className="dialog-close" aria-label="Close dialog" onClick={onClose}>×</button>
        <div className="dialog-content">{body}</div>
      </div>
    </div>
  );
}
