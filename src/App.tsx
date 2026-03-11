import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { RecallOverlay } from './components/RecallOverlay';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useNetworkStatus } from './hooks/useNetworkStatus';

function AppContent() {
  useNetworkStatus();
  
  return (
    <div className="app-root max-w-md mx-auto min-h-screen bg-white shadow-2xl relative overflow-x-hidden">
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
