import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/globals.css'

// Starting application...

try {
  const rootElement = document.getElementById('root')
  // Root element found
  
  if (!rootElement) {
    throw new Error('Root element not found!')
  }
  
  const root = ReactDOM.createRoot(rootElement)
  // React root created successfully
  
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
  
  // App rendered successfully
} catch (error) {
  console.error('❌ main.tsx: Error during app initialization:', error)
}
