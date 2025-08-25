import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/globals.css'

console.log('🚀 main.tsx: Starting application...')

try {
  const rootElement = document.getElementById('root')
  console.log('🔍 main.tsx: Root element found:', rootElement)
  
  if (!rootElement) {
    throw new Error('Root element not found!')
  }
  
  const root = ReactDOM.createRoot(rootElement)
  console.log('✅ main.tsx: React root created successfully')
  
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
  
  console.log('🎉 main.tsx: App rendered successfully')
} catch (error) {
  console.error('❌ main.tsx: Error during app initialization:', error)
}
