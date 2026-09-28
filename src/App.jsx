import React from 'react';
import Nav from './components/Nav.jsx';
import Hero from './components/Hero.jsx';
import Runtime from './components/Runtime.jsx';
import Gate from './components/Gate.jsx';
import Privacy from './components/Privacy.jsx';
import Improvement from './components/Improvement.jsx';
import OpenNext from './components/OpenNext.jsx';
import Records from './components/Records.jsx';
import Developers from './components/Developers.jsx';
import Security from './components/Security.jsx';
import Insights from './components/Insights.jsx';
import Faq from './components/Faq.jsx';
import FinalCta from './components/FinalCta.jsx';
import Footer from './components/Footer.jsx';
import Dialog from './components/Dialog.jsx';
import useDiagramLines from './useDiagramLines.js';
import useReveal from './useReveal.js';

export default function App() {
  useDiagramLines();
  useReveal();
  const [dialog, setDialog] = React.useState(null);
  const [toast, setToast] = React.useState('');
  const toastTimer = React.useRef(null);

  const showToast = React.useCallback(message => {
    setToast(message);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 2300);
  }, []);

  const copyText = React.useCallback(async value => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(value);
      } else {
        const field = document.createElement('textarea');
        field.value = value;
        field.style.position = 'fixed';
        field.style.opacity = '0';
        document.body.append(field);
        field.select();
        if (!document.execCommand('copy')) throw new Error('Copy unsupported');
        field.remove();
      }
      showToast('Copied to clipboard');
    } catch {
      showToast('Copy unavailable in this browser. Select and copy the text.');
    }
  }, [showToast]);

  return (
    <div className="site-shell">
      <Nav onDialog={setDialog} />
      <main>
        <Hero />
        <Runtime />
        <Gate />
        <Privacy />
        <Improvement />
        <OpenNext onDialog={setDialog} />
        <Records onCopy={copyText} />
        <Developers onCopy={copyText} onDialog={setDialog} />
        <Security onDialog={setDialog} />
        <Insights onDialog={setDialog} />
        <Faq />
        <div className="closing-block">
          <FinalCta onDialog={setDialog} />
          <Footer />
        </div>
      </main>
      {dialog && <Dialog id={dialog} onClose={() => setDialog(null)} onCopy={copyText} />}
      <div id="toast" className={toast ? 'show' : ''} role="status" aria-live="polite">{toast}</div>
    </div>
  );
}
