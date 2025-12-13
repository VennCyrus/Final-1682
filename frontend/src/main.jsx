import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'

// Get base path from environment or use default for GitHub Pages
const basename = import.meta.env.VITE_BASE_PATH || (import.meta.env.PROD ? '/Final-1682' : '')

createRoot(document.getElementById('root')).render(
  <BrowserRouter basename={basename}>
    <App />
  </BrowserRouter>,
)
