
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { CapacitorService } from './services/capacitorService'

// Initialize the app
const initApp = async () => {
  await CapacitorService.isReady();
  CapacitorService.log('App initialized successfully');
  
  createRoot(document.getElementById("root")!).render(<App />);
};

initApp();
