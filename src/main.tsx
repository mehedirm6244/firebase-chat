import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from './components/themecontext.tsx'
import { AuthProvider } from './components/authcontext.tsx'
import Navbar from '@/components/blocks/navbar.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <Navbar />
        <App />
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>,
)
