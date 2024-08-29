import React from 'react';
import ReactDOM from 'react-dom/client';

import { setupProdMockServer } from '../mock/_createProductionServer';

import { getAppEnvConfig } from './utils/env';
import App from './App';

import 'uno.css';

import '@/design/index.less';
// import '@/locales';
import 'virtual:svg-icons-register';

const { VITE_GLOB_USE_MOCK } = getAppEnvConfig();

console.log('VITE_GLOB_USE_MOCK', VITE_GLOB_USE_MOCK);
if (VITE_GLOB_USE_MOCK === 'true') {
  console.log('[running mock]');
  setupProdMockServer();
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <App />,
  // </React.StrictMode>,
);
