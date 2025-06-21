
import { Capacitor } from '@capacitor/core';

export class CapacitorService {
  static isNative(): boolean {
    return Capacitor.isNativePlatform();
  }

  static getPlatform(): string {
    return Capacitor.getPlatform();
  }

  static async isReady(): Promise<boolean> {
    if (!this.isNative()) return true;
    
    try {
      await new Promise(resolve => {
        if (document.readyState === 'complete') {
          resolve(true);
        } else {
          window.addEventListener('load', () => resolve(true));
        }
      });
      return true;
    } catch (error) {
      console.error('Capacitor not ready:', error);
      return false;
    }
  }

  static log(message: string, data?: any): void {
    if (this.isNative()) {
      console.log(`[Native ${this.getPlatform()}] ${message}`, data);
    } else {
      console.log(`[Web] ${message}`, data);
    }
  }
}
