import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './hooks/AuthContext'
import { AuditoriaProvider } from './hooks/AuditoriaContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuditoriaProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </AuditoriaProvider>
    </BrowserRouter>
  </StrictMode>,
)