
import { CapacitorService } from '@/services/capacitorService';

export class MobileUtils {
  static isMobile(): boolean {
    return CapacitorService.isNative() || window.innerWidth <= 768;
  }

  static preventZoom(): void {
    // Prevent zoom on mobile devices
    document.addEventListener('gesturestart', (e) => {
      e.preventDefault();
    });

    document.addEventListener('touchstart', (e) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    });

    let lastTouchEnd = 0;
    document.addEventListener('touchend', (e) => {
      const now = (new Date()).getTime();
      if (now - lastTouchEnd <= 300) {
        e.preventDefault();
      }
      lastTouchEnd = now;
    }, false);
  }

  static initializeMobileFeatures(): void {
    if (this.isMobile()) {
      this.preventZoom();
      
      // Add mobile-specific classes
      document.body.classList.add('mobile-app');
      
      // Handle safe area for devices with notches
      if (CapacitorService.isNative()) {
        document.documentElement.style.setProperty('--safe-area-top', 'env(safe-area-inset-top)');
        document.documentElement.style.setProperty('--safe-area-bottom', 'env(safe-area-inset-bottom)');
      }
    }
  }

  static handleBackButton(callback?: () => void): void {
    if (CapacitorService.isNative()) {
      // This will be implemented when we add the App plugin
      CapacitorService.log('Back button handling ready for native implementation');
      if (callback) callback();
    }
  }
}

// Initialize mobile features
MobileUtils.initializeMobileFeatures();
