import { createApp } from 'vue'
import App from './App.vue'
import './styles/main.css'
import 'flowbite'

// Safety mechanism to prevent infinite workbench duplication
window.K2WorkbenchSafety = {
  instanceCount: 0,
  maxInstances: 3,
  isInitialized: false,
  
  init() {
    if (this.isInitialized) {
      console.warn('Control Dojo: Multiple initialization detected, preventing duplication');
      return false;
    }
    
    this.instanceCount++;
    this.isInitialized = true;
    
    // Track window instances
    window.addEventListener('beforeunload', () => {
      this.instanceCount--;
    });
    
    // Prevent navigation to same URL
    window.addEventListener('beforeunload', (e) => {
      if (window.location.href === document.referrer) {
        e.preventDefault();
        console.warn('Control Dojo: Preventing navigation to same URL to avoid duplication');
        return false;
      }
    });
    
    console.log(`Control Dojo: Instance ${this.instanceCount} initialized safely`);
    return true;
  },
  
  checkInstanceLimit() {
    if (this.instanceCount > this.maxInstances) {
      console.error('Control Dojo: Maximum instance limit reached, preventing further duplication');
      window.close();
      return false;
    }
    return true;
  }
};

// Initialize safety mechanism
if (!window.K2WorkbenchSafety.init()) {
  // If initialization fails, prevent further execution
  document.body.innerHTML = '<div style="padding: 20px; text-align: center;"><h2>Workbench Already Running</h2><p>Only one instance of the Control Dojo can run at a time.</p></div>';
  throw new Error('Control Dojo: Duplicate instance prevented');
}

// Check instance limit before creating Vue app
if (!window.K2WorkbenchSafety.checkInstanceLimit()) {
  throw new Error('Control Dojo: Instance limit exceeded');
}

const app = createApp(App)
app.mount('#app')
