import { scan } from 'react-scan';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import App from './app';
import './i18n';
import './index.css';
import { normalizeBasePath } from './lib/public-path';

scan({
  enabled: import.meta.env.DEV,
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename={normalizeBasePath()}>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
