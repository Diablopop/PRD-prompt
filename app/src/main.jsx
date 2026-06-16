import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { WizardProvider } from './context/WizardContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <WizardProvider>
      <App />
    </WizardProvider>
  </StrictMode>,
)
