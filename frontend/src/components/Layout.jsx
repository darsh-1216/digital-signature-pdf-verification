import React, { useEffect, useState } from 'react';
import { FileSignature, ShieldCheck } from 'lucide-react';
import GenerateKeys from './GenerateKeys';
import SignPDF from './SignPDF';
import VerifyPDF from './VerifyPDF';

const getPageFromHash = () => {
  if (window.location.hash === '#/sender') return 'sender';
  if (window.location.hash === '#/receiver') return 'receiver';
  return 'home';
};

const Layout = () => {
  const [page, setPage] = useState(getPageFromHash);

  useEffect(() => {
    if (!window.location.hash) {
      window.history.replaceState(null, '', '#/');
    }

    const syncPage = () => setPage(getPageFromHash());
    window.addEventListener('hashchange', syncPage);
    return () => window.removeEventListener('hashchange', syncPage);
  }, []);

  const openPage = (nextPage) => {
    window.location.hash = `#/${nextPage}`;
  };

  return (
    <div className="card">
      <div className="header">
        <ShieldCheck size={38} color="var(--primary)" />
        <h1>
          {page === 'sender' && 'Sender Portal'}
          {page === 'receiver' && 'Receiver Portal'}
          {page === 'home' && 'Digital Signature Verification System'}
        </h1>
      </div>

      <div className="content">
        {page === 'home' && (
          <div className="home-stack">
            <GenerateKeys />
            <div className="portal-divider" />
            <div className="home-grid">
              <button className="role-card" onClick={() => openPage('sender')}>
                <FileSignature size={28} />
                <span>Sender Portal</span>
              </button>
              <button className="role-card" onClick={() => openPage('receiver')}>
                <ShieldCheck size={28} />
                <span>Receiver Portal</span>
              </button>
            </div>
          </div>
        )}

        {page === 'sender' && (
          <SignPDF />
        )}

        {page === 'receiver' && (
          <VerifyPDF />
        )}
      </div>
    </div>
  );
};

export default Layout;
