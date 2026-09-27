import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const legacySpreadsheetRescueHash = '#/hire/spreadsheet-rescue'

if (window.location.hash === legacySpreadsheetRescueHash) {
  window.location.replace('/hire/spreadsheet-rescue/')
} else {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
