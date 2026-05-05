import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './app/styles/index.css'
import { StoreProvider } from './app/providers/StoreProvider.tsx'
import { RouterProvider } from 'react-router'
import { router } from './app/providers/router.tsx'
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StoreProvider>
      <RouterProvider router={router} />
      <Toaster position="top-center" />
    </StoreProvider>
  </StrictMode>,
)
