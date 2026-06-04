import { StrictMode, Suspense } from 'react';

import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';

import App from './App.tsx';
import { PageLoadingState } from '@/components/ui/Skeletons';
import './i18n';
import './fonts.css';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <Suspense fallback={<PageLoadingState />}>
        <App />
      </Suspense>
    </HelmetProvider>
  </StrictMode>
);
