import React from 'react';

const TYPEFORM = 'https://form.typeform.com/to/IjCOn4nY';

const columns = [
  {
    label: 'PRODUCT',
    links: [
      ['AI Treasury', 'https://cli.vishwalab.com', true],
      ['AI Payments', 'https://cli.vishwalab.com', true],
      ['AI Vault', 'https://vault.vishwalab.com', false],
      ['AI Credit', TYPEFORM, true],
    ],
  },
  {
    label: 'RESOURCES',
    links: [
      ['Docs', 'https://docs.vishwanetwork.xyz/', true],
      ['Blog', 'https://vishwalab.com/blog', false],
      ['Podcast', 'https://vishwalab.com/podcast', false],
    ],
  },
  {
    label: 'COMPANY',
    links: [
      ['About', 'https://vishwalab.com/terms-of-service', false],
      ['Contact', TYPEFORM, true],
      ['Careers', TYPEFORM, true],
    ],
  },
];

export default function Footer() {
  return (
    <footer className="vw-footer">
      <div className="vw-footer__inner">
        <div className="vw-footer__brand">
          <img src="/assets/icons/logo.png" alt="Vishwa" />
          <p className="vw-footer__tagline">
            Banking infrastructure for autonomous capital. Control enforced before execution.
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
          <span>VISHWA - BANKING INFRASTRUCTURE FOR AUTONOMOUS CAPITAL</span>
          <span>© 2026 · VISHWA LTD. · CAYMAN ISLANDS</span>
        </div>
      </div>
    </footer>
  );
}
