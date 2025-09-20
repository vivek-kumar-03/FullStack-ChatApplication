import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext.jsx'

// Polyfill for global
if (typeof global === 'undefined') {
  window.global = window;
}

// Listen for theme changes and apply them
const handleThemeChange = (event) => {
  if (event.detail) {
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', event.detail);
  }
};

// Add event listener for theme changes
window.addEventListener('theme-change', handleThemeChange);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
)