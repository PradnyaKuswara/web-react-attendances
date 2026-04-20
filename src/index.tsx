import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { HashRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

const rootEl = document.getElementById('root');
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(
    <React.StrictMode>
      <HashRouter>
        <RecoilRoot>
          <App />
        </RecoilRoot>
      </HashRouter>
    </React.StrictMode>
  );
}