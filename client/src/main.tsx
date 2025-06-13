import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('✅ Service Worker registered successfully:', registration);
      
      // Validate PWA after service worker registration
      setTimeout(async () => {
        const { validatePWA, displayPWAStatus } = await import('./utils/pwa-validator');
        const result = await validatePWA();
        displayPWAStatus(result);
      }, 1000);
      
    } catch (error) {
      console.error('❌ Service Worker registration failed:', error);
    }
  });
}

createRoot(document.getElementById("root")!).render(<App />);
