import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { requestPersistentStorage } from './lib/storage.js'

// Ask the browser not to evict our saved history under storage pressure.
requestPersistentStorage()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
