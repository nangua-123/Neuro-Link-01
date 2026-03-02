import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { RecallOverlay } from './components/RecallOverlay';

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <RecallOverlay />
    </>
  );
}
