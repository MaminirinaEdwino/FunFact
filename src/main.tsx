import React, { StrictMode } from 'react'
import App from './App.tsx'
import './globals.css'
import ReactDOM from 'react-dom/client';

const root = ReactDOM.createRoot(document.getElementById('root')!); 

root.render(
  <StrictMode>
      <App />
  </StrictMode>
)

