import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from '@tanstack/react-router';
import { router } from '@/router';
import '@/styles.css';

const root = document.getElementById('root');
if (!root) throw new Error('Elemento raiz não encontrado.');

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
