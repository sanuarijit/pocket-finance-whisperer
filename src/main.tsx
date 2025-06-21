import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { CapacitorService } from './services/capacitorService'
import { defineCustomElements as jeepSqliteDefineCustomElements } from 'jeep-sqlite/loader'
import { setupSQLite } from 'jeep-sqlite/dist/sqlite-setup'

// Initialize the app
const initApp = async () => {
  await CapacitorService.isReady();
  
  // Initialize SQLite for web platform
  if (!CapacitorService.isNative()) {
    // Register the jeep-sqlite web component
    jeepSqliteDefineCustomElements(window);
    // Setup SQLite for web
    await setupSQLite();
  }
  
  CapacitorService.log('App initialized successfully');
  
  createRoot(document.getElementById("root")!).render(<App />);
};

initApp();