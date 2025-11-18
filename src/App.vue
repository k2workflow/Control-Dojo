<template>
  <div :class="['min-h-screen flex flex-col transition-colors duration-200', isDarkMode ? 'bg-dark-900' : 'bg-slate-50']">
    <!-- Flowbite Navbar -->
    <nav :class="['py-2.5 border-b', isDarkMode ? 'bg-dark-800 border-dark-600' : 'bg-white border-gray-200']">
      <div class="flex flex-wrap justify-between items-center px-4">
                <!-- Brand - Left -->
                <div class="flex items-center">
                  <img src="/assets/favicon.svg" alt="Control Dojo" class="w-8 h-8 mr-3" />
                  <span :class="['self-center text-xl font-semibold whitespace-nowrap', isDarkMode ? 'text-white' : 'text-gray-900']">
                    Control Dojo
                  </span>
                </div>
        
        <!-- Mobile menu button -->
        <button 
          data-collapse-toggle="navbar-default" 
          type="button" 
          :class="['inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200', isDarkMode ? 'text-gray-400 hover:bg-gray-700 focus:ring-gray-600' : 'text-gray-500 hover:bg-gray-100 focus:ring-gray-200']"
          aria-controls="navbar-default" 
          aria-expanded="false"
        >
          <span class="sr-only">Open main menu</span>
          <svg class="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path>
          </svg>
        </button>
        
        <!-- Navigation Menu - Right -->
        <div class="hidden w-full md:block md:w-auto md:ml-auto" id="navbar-default">
          <ul class="flex flex-col p-4 mt-4 bg-gray-50 rounded-lg border border-gray-100 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-transparent dark:bg-gray-800 md:dark:bg-transparent dark:border-gray-700">
            <li>
              <button
                @click="handleTabClick('Home')"
                :class="[
                  'block py-2 pr-4 pl-3 rounded md:p-0 transition-colors duration-200',
                  currentTab === 'Home'
                    ? (isDarkMode ? 'text-orange-400' : 'text-blue-700')
                    : (isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-700 hover:text-blue-700')
                ]"
                aria-current="page"
              >
                Home
              </button>
            </li>
            <li>
              <button
                @click="handleTabClick('Wizard')"
                :class="[
                  'block py-2 pr-4 pl-3 rounded md:p-0 transition-colors duration-200',
                  currentTab === 'Wizard'
                    ? (isDarkMode ? 'text-orange-400' : 'text-blue-700')
                    : (isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-700 hover:text-blue-700')
                ]"
              >
                Control Starter
              </button>
            </li>
            <li>
              <button
                @click="handleTabClick('Inspector')"
                :class="[
                  'block py-2 pr-4 pl-3 rounded md:p-0 transition-colors duration-200',
                  currentTab === 'Inspector'
                    ? (isDarkMode ? 'text-orange-400' : 'text-blue-700')
                    : (isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-700 hover:text-blue-700')
                ]"
              >
                Inspector
              </button>
            </li>
            <li>
              <button
                @click="handleTabClick('Documents')"
                :class="[
                  'block py-2 pr-4 pl-3 rounded md:p-0 transition-colors duration-200',
                  currentTab === 'Documents'
                    ? (isDarkMode ? 'text-orange-400' : 'text-blue-700')
                    : (isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-700 hover:text-blue-700')
                ]"
              >
                Help
              </button>
            </li>
          </ul>
        </div>
        
        <!-- Dark Mode Toggle - Right -->
        <div class="flex items-center mr-2">
          <button
            @click="toggleDarkMode"
            :class="['p-2 rounded-lg transition-colors duration-200', isDarkMode ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200']"
            :title="isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
          >
            <svg v-if="isDarkMode" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd" />
            </svg>
            <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          </button>
        </div>
      </div>
    </nav>

    <main :class="['flex-1', currentTab === 'Inspector' ? '' : 'overflow-auto']">
      <Home v-if="currentTab === 'Home'" :isDarkMode="isDarkMode" @switch-tab="handleSwitchTab" />
      <Inspector v-if="currentTab === 'Inspector'" ref="inspector" :isDarkMode="isDarkMode" @control-loaded="handleControlLoaded" @switch-to-inspector="handleSwitchToInspector" />
      <Wizard v-if="currentTab === 'Wizard'" :isDarkMode="isDarkMode" @control-loaded="handleControlLoaded" @switch-to-inspector="handleSwitchToInspector" @refresh-controls="handleRefreshControls" />
      <Documents v-if="currentTab === 'Documents'" :isDarkMode="isDarkMode" />
    </main>
  </div>
</template>

<script>
import Inspector from './components/Inspector.vue'
import Wizard from './components/Wizard.vue'
import Documents from './components/Documents.vue'
import Home from './components/Home.vue'

export default {
  components: {
    Inspector,
    Wizard,
    Documents,
    Home
  },
  data() {
    return {
      currentTab: 'Home', // Default tab
      isDarkMode: false
    }
  },
  watch: {
    currentTab(newTab) {
      // Save current tab to localStorage
      localStorage.setItem('control-dojo-last-tab', newTab)
    }
  },
  mounted() {
    // Load dark mode preference from localStorage
    const savedTheme = localStorage.getItem('k2-workbench-theme')
    if (savedTheme === 'dark') {
      this.isDarkMode = true
    } else if (savedTheme === 'light') {
      this.isDarkMode = false
    } else {
      // Default to system preference
      this.isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    this.updateBodyClass()
    
    // Restore last opened page from localStorage
    this.restoreLastPage()
    
    // Additional safety measures for navigation
    this.setupNavigationSafety()
  },
  methods: {
    toggleDarkMode() {
      this.isDarkMode = !this.isDarkMode
      localStorage.setItem('k2-workbench-theme', this.isDarkMode ? 'dark' : 'light')
      this.updateBodyClass()
    },
    updateBodyClass() {
      if (this.isDarkMode) {
        document.body.classList.add('dark')
        document.body.classList.remove('light')
      } else {
        document.body.classList.add('light')
        document.body.classList.remove('dark')
      }
    },
    handleControlLoaded(controlData) {
      // Switch to Inspector tab
      this.currentTab = 'Inspector'
      
      // Notify Inspector component
      this.$refs.inspector?.handleNewControlLoaded?.(controlData)
      
      // Save current page state
      this.saveCurrentPage()
    },
    
    handleSwitchToInspector(data) {
      this.currentTab = 'Inspector'
      
      // Wait for Inspector component to be mounted and ready
      this.$nextTick(() => {
        if (this.$refs.inspector) {
          this.$refs.inspector.loadNewControl?.(data.manifestPath)
          
          // Refresh controls list after Inspector is loaded to ensure new control appears
          setTimeout(() => {
            this.$refs.inspector?.refreshExamples?.()
          }, 200)
        }
      })
      
      // Save current page state
      this.saveCurrentPage()
    },
    
    handleRefreshControls() {
      this.$nextTick(() => {
        // Switch tab to inspector then wait for it to load
        if (this.currentTab !== 'Inspector') {
          this.currentTab = 'Inspector'
          this.$nextTick(() => {
            if (this.$refs.inspector) {
              setTimeout(() => {
                this.$refs.inspector?.refreshExamples?.()
              }, 100)
            }
          })
        } else {
          // Inspector is already the current tab, just refresh
          if (this.$refs.inspector) {
            setTimeout(() => {
              this.$refs.inspector?.refreshExamples?.()
            }, 100)
          }
        }
      })
    },
    
    handleSwitchTab(tabName) {
      this.currentTab = tabName
      this.saveCurrentPage()
    },
    
    handleTabClick(tabName) {
      this.currentTab = tabName
      this.saveCurrentPage()
    },
    
    restoreLastPage() {
      // Get saved tab from localStorage
      const savedTab = localStorage.getItem('control-dojo-last-tab')
      
      if (savedTab && ['Home', 'Wizard', 'Inspector', 'Documents'].includes(savedTab)) {
        this.currentTab = savedTab
        
        // If Inspector was the last page, restore the control that was open
        if (savedTab === 'Inspector') {
          this.$nextTick(() => {
            const savedControlPath = localStorage.getItem('control-dojo-last-control-path')
            if (savedControlPath && this.$refs.inspector) {
              // Wait a bit more to ensure Inspector is fully mounted
              setTimeout(() => {
                if (this.$refs.inspector && this.$refs.inspector.loadNewControl) {
                  this.$refs.inspector.loadNewControl(savedControlPath)
                }
              }, 100)
            }
          })
        }
      }
    },
    
    saveCurrentPage() {
      // Save current tab
      localStorage.setItem('control-dojo-last-tab', this.currentTab)
      
      // If Inspector is open, save the current control path
      if (this.currentTab === 'Inspector' && this.$refs.inspector) {
        const controlPath = this.$refs.inspector.manifestPath || this.$refs.inspector.selectedExample
        if (controlPath) {
          localStorage.setItem('control-dojo-last-control-path', controlPath)
        }
      }
    },
    
    setupNavigationSafety() {
      // Intercept all link clicks to prevent workbench duplication
      document.addEventListener('click', (e) => {
        const link = e.target.closest('a')
        if (link && link.href) {
          // Skip tab-switch links (handled by Vue)
          if (link.hasAttribute('data-tab-switch')) {
            return
          }
          
          try {
            const currentUrl = new URL(window.location.href)
            const linkUrl = new URL(link.href)
            
            // Debug logging for localhost
            console.log('Control Dojo Navigation Check:', {
              currentOrigin: currentUrl.origin,
              linkOrigin: linkUrl.origin,
              currentPath: currentUrl.pathname,
              linkPath: linkUrl.pathname,
              isSameOrigin: currentUrl.origin === linkUrl.origin,
              isSamePath: currentUrl.pathname === linkUrl.pathname
            })
            
            // Only block if it's the exact same origin and path (same workbench page)
            const isSameOrigin = currentUrl.origin === linkUrl.origin
            const isSamePath = currentUrl.pathname === linkUrl.pathname
            
            // Allow external links and different pages within the same domain
            if (isSameOrigin && isSamePath) {
              e.preventDefault()
              console.warn('Control Dojo: Prevented navigation to same page to avoid duplication')
              
              // Show user-friendly message
              this.showNavigationWarning()
              return false
            }
            
            // For external links (different origin), ensure they open in new tab
            if (!isSameOrigin) {
              console.log('Control Dojo: External link detected, ensuring new tab:', linkUrl.href)
              if (!link.target) {
                link.target = '_blank'
                link.rel = 'noopener noreferrer'
              }
            }
          } catch (error) {
            // If URL parsing fails, allow the link to proceed normally
            console.warn('Control Dojo: Could not parse URL, allowing navigation:', error)
          }
        }
      })
      
      // Prevent browser back/forward navigation that could cause duplication
      window.addEventListener('popstate', (e) => {
        try {
          const currentUrl = new URL(window.location.href)
          const referrer = document.referrer ? new URL(document.referrer) : null
          
          // Only prevent if navigating back to the exact same workbench page
          if (referrer && 
              currentUrl.origin === referrer.origin && 
              currentUrl.pathname === referrer.pathname) {
            console.warn('Control Dojo: Prevented back navigation to same page to avoid duplication')
            history.pushState(null, '', window.location.href)
          }
        } catch (error) {
          // If URL parsing fails, allow navigation
          console.warn('Control Dojo: Could not parse URLs for popstate, allowing navigation:', error)
        }
      })
      
      // Add safety check for window focus events
      window.addEventListener('focus', () => {
        if (window.K2WorkbenchSafety && window.K2WorkbenchSafety.instanceCount > 1) {
          console.warn('Control Dojo: Multiple instances detected, closing duplicates')
          // Close any duplicate windows
          setTimeout(() => {
            if (window.K2WorkbenchSafety.instanceCount > 1) {
              window.close()
            }
          }, 1000)
        }
      })
    },
    
    showNavigationWarning() {
      // Create a temporary warning message
      const warning = document.createElement('div')
      warning.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #f59e0b;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 10000;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        animation: slideIn 0.3s ease;
      `
      warning.textContent = 'Warning: Same-page navigation blocked to prevent duplication'
      document.body.appendChild(warning)
      
      setTimeout(() => {
        if (warning.parentNode) {
          warning.parentNode.removeChild(warning)
        }
      }, 3000)
    }
  }
}
</script>

<style>
/* You can add global styles here if needed, but Tailwind handles most */
</style>