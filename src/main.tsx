import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { ThemeProvider } from './context/ThemeContext.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import { storageService } from './services/storageService.ts';
import './index.css';

// Auto-sync offline storage & check schema on startup
try {
  storageService.updateAndSyncOfflineCache();
} catch (e) {
  console.warn('Initial storage auto-sync:', e);
}

// Ensure clean service worker state
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const reg of registrations) {
      reg.unregister().catch(() => {});
    }
  }).catch(() => {});
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </ErrorBoundary>
  </StrictMode>,
);
