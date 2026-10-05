import React from 'react';

const columns = [
  {
    label: 'PRODUCT',
    links: [
      ['AI Payments', 'https://cli.vishwalab.com', true],
      ['AI Vault', 'https://vault.vishwalab.com', false],
    ],
  },
  {
    label: 'RESOURCES',
    links: [
      ['Blog', 'https://vishwalab.com/bankinginfra/blog', true],
      ['Podcast', 'https://vishwalab.com/bankinginfra/podcast', true],
    ],
  },
];

export default function Footer() {
  return (
    <footer className="vw-footer">
      <div className="vw-footer__inner">
        <div className="vw-footer__brand">
          <img src="/assets/icons/logo-vishwa.png" alt="Vishwa" />
          <p className="vw-footer__tagline">
            One governed runtime across capital and compute. Vishwa turns agent intent into policy-enforced execution.
          </p>
        </div>

        <div className="vw-footer__cols">
          {columns.map(col => (
            <div className="vw-footer__col" key={col.label}>
              <span className="vw-footer__col-label">{col.label}</span>
              {col.links.map(([text, href, external]) =>
                external ? (
                  <a key={text} href={href} target="_blank" rel="noreferrer">{text}</a>
                ) : (
                  <a key={text} href={href}>{text}</a>
                )
              )}
            </div>
          ))}
        </div>

        <p className="vw-footer__disclaimer">
          Vishwa Ltd. is an infrastructure software provider. Vishwa is not a bank,
          broker-dealer, investment adviser, exchange, custodian, or money transmitter, and
          does not hold customer funds or private keys. Nothing on this site constitutes
          investment, legal, or tax advice.
        </p>

        <div className="vw-footer__bottom">
          <span>Financial infrastructure for autonomous agents.</span>
          <span>© 2026 · VISHWA LTD.</span>
        </div>
      </div>
    </footer>
  );
}
