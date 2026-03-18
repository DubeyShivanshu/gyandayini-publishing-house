import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1a0f00',
            color: '#fdf7ed',
            fontFamily: 'Lato, sans-serif',
            borderRadius: '12px',
            fontSize: '14px'
          },
          success: { iconTheme: { primary: '#d4711e', secondary: '#fdf7ed' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fdf7ed' } }
        }}
      />
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
