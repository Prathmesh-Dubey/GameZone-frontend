import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import App from './App.tsx';
import { queryClient } from './lib/react-query';
import './index.css';

console.log("Current URL:", window.location.href);

const originalPushState = history.pushState;
history.pushState = function (...args) {
  console.trace("pushState", args);
  return originalPushState.apply(this, args);
};

const originalReplaceState = history.replaceState;
history.replaceState = function (...args) {
  console.trace("replaceState", args);
  return originalReplaceState.apply(this, args);
};

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <App />
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);
