import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { RecallOverlay } from './components/RecallOverlay';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useNetworkStatus } from './hooks/useNetworkStatus';

function AppContent() {
  useNetworkStatus();
  
  return (
    <div className="app-root max-w-md mx-auto min-h-screen bg-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] relative overflow-x-hidden sm:border-x sm:border-slate-200/50">
      <RouterProvider router={router} />
      <RecallOverlay />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}
