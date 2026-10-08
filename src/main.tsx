import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import '@fontsource-variable/fraunces/soft.css';
import '@fontsource-variable/bricolage-grotesque/wght.css';
import '@fontsource/noto-sans-tamil/700.css';
import App from './App';
import { StoreProvider } from './store/useStore';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <StoreProvider>
        <App />
      </StoreProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
