
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.41c40f20985e440991537522f3813709',
  appName: 'pocket-finance-whisperer',
  webDir: 'dist',
  server: {
    url: 'https://41c40f20-985e-4409-9153-7522f3813709.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  android: {
    allowMixedContent: true,
    captureInput: true
  }
};

export default config;
