import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google';
const client_id="641432859690-psbkhjh2v8n7fqp6iv53bkeg1k0cb3vr.apps.googleusercontent.com"
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={client_id}>
    <App />
    </GoogleOAuthProvider>
  </StrictMode>,
)
