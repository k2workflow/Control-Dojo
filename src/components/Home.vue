<template>
  <div class="home-page p-6 h-full overflow-y-auto" style="height: calc(100vh - 4rem);">
    <!-- Hero Section -->
    <div class="text-center mb-12">
      <div class="flex justify-center mb-6">
        <img src="/assets/favicon.svg" alt="Control Dojo" class="w-20 h-20" />
      </div>
      <h1 class="text-4xl font-bold mb-4" :class="isDarkMode ? 'text-white' : 'text-gray-900'">
        Welcome to Control Dojo
      </h1>
      <p class="text-xl mb-8 max-w-5xl mx-auto" :class="isDarkMode ? 'text-gray-300' : 'text-gray-600'">
        A web-based development utility for creating, testing and debugging K2 custom controls
      </p>
    </div>

    <!-- Important Notice about Previews -->
    <div class="max-w-6xl mx-auto mb-12">
      <div class="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 dark:border-yellow-500 p-6 rounded-lg shadow-md">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <svg class="h-6 w-6 text-yellow-400 dark:text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3 flex-1">
            <h3 class="text-lg font-semibold mb-2" :class="isDarkMode ? 'text-yellow-300' : 'text-yellow-800'">
              Important: Preview Limitations
            </h3>
            <p class="text-base mb-3" :class="isDarkMode ? 'text-yellow-200' : 'text-yellow-700'">
              The Designer and Runtime previews shown in the Inspector tab are <strong>not 1-to-1 representations</strong> of what you will see when the control is imported into K2 and placed on forms or views.
            </p>
            <p class="text-base" :class="isDarkMode ? 'text-yellow-200' : 'text-yellow-700'">
              These previews do not include the form and view panel and table layouts that K2 provides. They are designed as <strong>debugging tools</strong> to help you test your control's functionality, properties, and events before importing it into K2. Always test your controls in the actual K2 environment for final validation.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- What is Control Dojo Section -->
    <div class="max-w-6xl mx-auto mb-12">
      <h2 class="text-2xl font-bold mb-6" :class="isDarkMode ? 'text-white' : 'text-gray-900'">
        What is Control Dojo?
      </h2>
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <p class="text-base leading-relaxed mb-4" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
          Control Dojo is a development utility specifically designed for K2 custom control developers. It provides resources to create, test, debug and validate custom controls before deploying them to a K2 environment.
        </p>
        <p class="text-base leading-relaxed" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
          Whether you're building a new control from scratch or debugging an existing one, Control Dojo streamlines your development workflow and helps you catch issues early in the development process.
        </p>
      </div>
    </div>

    <!-- Getting Started Section -->
    <div class="max-w-6xl mx-auto mb-12">
      <h2 class="text-2xl font-bold mb-6" :class="isDarkMode ? 'text-white' : 'text-gray-900'">
        Getting Started
      </h2>
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <p class="text-base leading-relaxed mb-4" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
          Ready to start developing custom controls? Navigate to the <a href="#" @click.prevent="switchTab('Inspector')" data-tab-switch="true" class="font-semibold underline transition-colors duration-200" :class="isDarkMode ? 'text-orange-400 hover:text-orange-300' : 'text-blue-600 hover:text-blue-700'">Inspector</a> tab to debug existing controls, or visit <a href="#" @click.prevent="switchTab('Wizard')" data-tab-switch="true" class="font-semibold underline transition-colors duration-200" :class="isDarkMode ? 'text-orange-400 hover:text-orange-300' : 'text-blue-600 hover:text-blue-700'">Control Starter</a> to generate a starter template. Check out the <a href="#" @click.prevent="switchTab('Documents')" data-tab-switch="true" class="font-semibold underline transition-colors duration-200" :class="isDarkMode ? 'text-orange-400 hover:text-orange-300' : 'text-blue-600 hover:text-blue-700'">Documents</a> tab for detailed guides and reference materials.
        </p>
        <p class="text-base leading-relaxed" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
          Remember: The previews in Control Dojo are for debugging purposes. Always import and test your controls in the actual K2 environment to ensure they work correctly with forms, views, and the full K2 layout system.
        </p>
      </div>
    </div>

    <!-- Tabs Overview Section -->
    <div class="max-w-6xl mx-auto mb-12">
      <h2 class="text-2xl font-bold mb-6" :class="isDarkMode ? 'text-white' : 'text-gray-900'">
        Overview of Tabs
      </h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Control Starter Tab -->
        <a href="#" @click.prevent="switchTab('Wizard')" data-tab-switch="true" class="block bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-l-4 border-green-500 hover:shadow-lg transition-shadow duration-200 cursor-pointer">
          <div class="flex items-center mb-4">
            <svg class="w-6 h-6 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <h3 class="text-xl font-semibold" :class="isDarkMode ? 'text-white' : 'text-gray-900'">Control Starter</h3>
          </div>
          <p class="text-base mb-4" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
            Generate a starter template for new custom controls with the basic structure and scaffolding. You'll get the manifest, file structure, and method stubs, but you'll need to add your own logic to make the control fully functional.
          </p>
          <ul class="text-sm space-y-2" :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'">
            <li class="flex items-start">
              <svg class="w-4 h-4 text-green-500 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              <span>Step-by-step guided process with full control</span>
            </li>
            <li class="flex items-start">
              <svg class="w-4 h-4 text-green-500 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              <span>Define properties, events, methods, and control structure</span>
            </li>
            <li class="flex items-start">
              <svg class="w-4 h-4 text-green-500 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              <span>Generate starter template with structure and scaffolding</span>
            </li>
            <li class="flex items-start">
              <svg class="w-4 h-4 text-green-500 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              <span>Learn each component as you build</span>
            </li>
          </ul>
        </a>

        <!-- Inspector Tab -->
        <a href="#" @click.prevent="switchTab('Inspector')" data-tab-switch="true" class="block bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-l-4 border-blue-500 dark:border-orange-500 hover:shadow-lg transition-shadow duration-200 cursor-pointer">
          <div class="flex items-center mb-4">
            <svg class="w-6 h-6 mr-3 text-blue-500 dark:text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 class="text-xl font-semibold" :class="isDarkMode ? 'text-white' : 'text-gray-900'">Inspector</h3>
          </div>
          <p class="text-base mb-4" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
            Debug and test existing custom controls. Load controls from the Controls folder (permanent) or use "Load from Folder" for temporary testing.
          </p>
          <ul class="text-sm space-y-2" :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'">
            <li class="flex items-start">
              <svg class="w-4 h-4 text-blue-500 dark:text-orange-500 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              <span>Preview controls in Designer and Runtime modes</span>
            </li>
            <li class="flex items-start">
              <svg class="w-4 h-4 text-blue-500 dark:text-orange-500 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              <span>Modify properties and see real-time updates</span>
            </li>
            <li class="flex items-start">
              <svg class="w-4 h-4 text-blue-500 dark:text-orange-500 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              <span>Test custom events and trigger methods</span>
            </li>
            <li class="flex items-start">
              <svg class="w-4 h-4 text-blue-500 dark:text-orange-500 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              <span>Execute control methods and see results in preview</span>
            </li>
            <li class="flex items-start">
              <svg class="w-4 h-4 text-blue-500 dark:text-orange-500 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              <span>Enable/disable scripts and styles for debugging</span>
            </li>
            <li class="flex items-start">
              <svg class="w-4 h-4 text-blue-500 dark:text-orange-500 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              <span>Export controls as ZIP archives</span>
            </li>
            <li class="flex items-start">
              <svg class="w-4 h-4 text-blue-500 dark:text-orange-500 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              <span>Refresh button to reload frames without full page reload</span>
            </li>
          </ul>
        </a>

        <!-- Documents Tab -->
        <a href="#" @click.prevent="switchTab('Documents')" data-tab-switch="true" class="block bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-l-4 border-purple-500 md:col-span-2 hover:shadow-lg transition-shadow duration-200 cursor-pointer">
          <div class="flex items-center mb-4">
            <svg class="w-6 h-6 mr-3 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h3 class="text-xl font-semibold" :class="isDarkMode ? 'text-white' : 'text-gray-900'">Documents</h3>
          </div>
          <p class="text-base mb-4" :class="isDarkMode ? 'text-gray-300' : 'text-gray-700'">
            Access comprehensive documentation and guides for creating custom K2 controls.
          </p>
          <ul class="text-sm space-y-2" :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'">
            <li class="flex items-start">
              <svg class="w-4 h-4 text-purple-500 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              <span>Custom Controls Guide - Learn the fundamentals</span>
            </li>
            <li class="flex items-start">
              <svg class="w-4 h-4 text-purple-500 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              <span>Data Binding - Connect controls to K2 data</span>
            </li>
            <li class="flex items-start">
              <svg class="w-4 h-4 text-purple-500 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              <span>Localization - Make controls multilingual</span>
            </li>
            <li class="flex items-start">
              <svg class="w-4 h-4 text-purple-500 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              <span>Standard Properties - Understand K2 property system</span>
            </li>
            <li class="flex items-start">
              <svg class="w-4 h-4 text-purple-500 mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              <span>And more - Script references, responsive design, and best practices</span>
            </li>
          </ul>
        </a>
      </div>
    </div>

    <!-- How to Use Sections -->
    <div class="max-w-6xl mx-auto mb-12">
      <h2 class="text-2xl font-bold mb-6" :class="isDarkMode ? 'text-white' : 'text-gray-900'">
        How to Use
      </h2>
      
      <div class="space-y-4">
        <!-- How to Use Inspector -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md border-l-4 border-blue-500 dark:border-orange-500 overflow-hidden">
          <button
            @click="toggleHowTo('inspector')"
            class="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <div class="flex items-center">
              <svg class="w-5 h-5 mr-3 text-blue-500 dark:text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 class="text-lg font-semibold text-left" :class="isDarkMode ? 'text-white' : 'text-gray-900'">
                How to Use the Inspector
              </h3>
            </div>
            <svg 
              class="w-5 h-5 transition-transform duration-200" 
              :class="[
                expandedHowTo.inspector ? 'rotate-180' : '',
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              ]"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          <div 
            v-show="expandedHowTo.inspector"
            class="px-6 pb-6 transition-all duration-200"
          >
            <div class="space-y-4 pt-2">
              <div class="flex items-start">
                <div class="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-orange-900/30 flex items-center justify-center mr-4">
                  <span class="text-sm font-semibold text-blue-700 dark:text-orange-400">1</span>
                </div>
                <div class="flex-1">
                  <h4 class="font-semibold mb-1" :class="isDarkMode ? 'text-white' : 'text-gray-900'">Load a Control</h4>
                  <p class="text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-600'">
                    Navigate to the <strong>Inspector</strong> tab. You have two options:
                  </p>
                  <ul class="text-sm mt-2 ml-4 list-disc" :class="isDarkMode ? 'text-gray-300' : 'text-gray-600'">
                    <li class="mb-2">
                      <strong>Permanent (Recommended):</strong> Place your control folder (with all files including manifest.json) in the <strong>Controls</strong> folder, then click the <strong>Refresh</strong> button. The control will appear in the dropdown and remain available after reloads.
                    </li>
                    <li>
                      <strong>Temporary:</strong> Click <strong>Load from Folder</strong> to browse and load a control from anywhere on your system. This loads the control temporarily - it will disappear after a page reload, so you'll need to load it again.
                    </li>
                  </ul>
                </div>
              </div>
              
              <div class="flex items-start">
                <div class="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-orange-900/30 flex items-center justify-center mr-4">
                  <span class="text-sm font-semibold text-blue-700 dark:text-orange-400">2</span>
                </div>
                <div class="flex-1">
                  <h4 class="font-semibold mb-1" :class="isDarkMode ? 'text-white' : 'text-gray-900'">Preview the Control</h4>
                  <p class="text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-600'">
                    Once loaded, the control will appear in the preview area. Switch between <strong>Design-time</strong> and <strong>Runtime</strong> tabs to see how the control behaves in different modes.
                  </p>
                  <p class="text-sm mt-2 p-2 rounded-md" :class="isDarkMode ? 'bg-orange-900/20 text-orange-300 border border-orange-700' : 'bg-blue-50 text-blue-700 border border-blue-200'">
                    <strong>Tip:</strong> When you make changes to your control files (JavaScript, CSS, etc.), use the <strong>Refresh</strong> button next to the tabs to reload both frames without refreshing the entire page. This preserves your property values and console logs while showing your latest changes.
                  </p>
                </div>
              </div>
              
              <div class="flex items-start">
                <div class="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-orange-900/30 flex items-center justify-center mr-4">
                  <span class="text-sm font-semibold text-blue-700 dark:text-orange-400">3</span>
                </div>
                <div class="flex-1">
                  <h4 class="font-semibold mb-1" :class="isDarkMode ? 'text-white' : 'text-gray-900'">Modify Properties</h4>
                  <p class="text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-600'">
                    In the left sidebar, expand the <strong>Properties</strong> section. Modify property values to see real-time updates in the preview. This helps you test how your control responds to different property configurations.
                  </p>
                </div>
              </div>
              
              <div class="flex items-start">
                <div class="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-orange-900/30 flex items-center justify-center mr-4">
                  <span class="text-sm font-semibold text-blue-700 dark:text-orange-400">4</span>
                </div>
                <div class="flex-1">
                  <h4 class="font-semibold mb-1" :class="isDarkMode ? 'text-white' : 'text-gray-900'">Test Events</h4>
                  <p class="text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-600'">
                    Expand the <strong>Events</strong> section to see available custom events. Click the trigger buttons to fire events and observe how the control responds. Check the console at the bottom to see event logs.
                  </p>
                </div>
              </div>
              
              <div class="flex items-start">
                <div class="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-orange-900/30 flex items-center justify-center mr-4">
                  <span class="text-sm font-semibold text-blue-700 dark:text-orange-400">5</span>
                </div>
                <div class="flex-1">
                  <h4 class="font-semibold mb-1" :class="isDarkMode ? 'text-white' : 'text-gray-900'">Execute Methods</h4>
                  <p class="text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-600'">
                    Expand the <strong>Methods</strong> section to see callable methods on your control. Click any method button to execute it and see the results in the preview. Methods allow you to trigger actions programmatically.
                  </p>
                </div>
              </div>
              
              <div class="flex items-start">
                <div class="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-orange-900/30 flex items-center justify-center mr-4">
                  <span class="text-sm font-semibold text-blue-700 dark:text-orange-400">6</span>
                </div>
                <div class="flex-1">
                  <h4 class="font-semibold mb-1" :class="isDarkMode ? 'text-white' : 'text-gray-900'">Debug Scripts and Styles</h4>
                  <p class="text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-600'">
                    Use the <strong>Scripts</strong> and <strong>Styles</strong> sections to enable or disable individual files. This helps isolate issues and understand which files are causing problems.
                  </p>
                </div>
              </div>
              
              <div class="flex items-start">
                <div class="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-orange-900/30 flex items-center justify-center mr-4">
                  <span class="text-sm font-semibold text-blue-700 dark:text-orange-400">7</span>
                </div>
                <div class="flex-1">
                  <h4 class="font-semibold mb-1" :class="isDarkMode ? 'text-white' : 'text-gray-900'">Export Your Control</h4>
                  <p class="text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-600'">
                    Once you're satisfied with your control, click the <strong>Export ZIP</strong> button to download a complete control package ready for import into K2.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- How to Use Control Starter -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md border-l-4 border-green-500 overflow-hidden">
          <button
            @click="toggleHowTo('createControl')"
            class="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <div class="flex items-center">
              <svg class="w-5 h-5 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <h3 class="text-lg font-semibold text-left" :class="isDarkMode ? 'text-white' : 'text-gray-900'">
                How to Use Control Starter
              </h3>
            </div>
            <svg 
              class="w-5 h-5 transition-transform duration-200" 
              :class="[
                expandedHowTo.createControl ? 'rotate-180' : '',
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              ]"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          <div 
            v-show="expandedHowTo.createControl"
            class="px-6 pb-6 transition-all duration-200"
          >
            <div class="space-y-4 pt-2">
              <div class="flex items-start">
                <div class="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-4">
                  <span class="text-sm font-semibold text-green-700 dark:text-green-400">1</span>
                </div>
                <div class="flex-1">
                  <h4 class="font-semibold mb-1" :class="isDarkMode ? 'text-white' : 'text-gray-900'">Basic Information</h4>
                  <p class="text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-600'">
                    Enter the control name, display name, and tag name. Upload or select an icon for your control. The tag name should be unique and follow HTML naming conventions (lowercase, no spaces).
                  </p>
                </div>
              </div>
              
              <div class="flex items-start">
                <div class="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-4">
                  <span class="text-sm font-semibold text-green-700 dark:text-green-400">2</span>
                </div>
                <div class="flex-1">
                  <h4 class="font-semibold mb-1" :class="isDarkMode ? 'text-white' : 'text-gray-900'">Standard Properties</h4>
                  <p class="text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-600'">
                    Select which standard K2 properties your control should support (Width, Height, IsVisible, IsEnabled, etc.). Optionally set default values for these properties.
                  </p>
                </div>
              </div>
              
              <div class="flex items-start">
                <div class="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-4">
                  <span class="text-sm font-semibold text-green-700 dark:text-green-400">3</span>
                </div>
                <div class="flex-1">
                  <h4 class="font-semibold mb-1" :class="isDarkMode ? 'text-white' : 'text-gray-900'">Custom Properties</h4>
                  <p class="text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-600'">
                    Add custom properties specific to your control. Define the property name, type (string, number, boolean, etc.), and optional default value. These will appear in the K2 designer property panel.
                  </p>
                </div>
              </div>
              
              <div class="flex items-start">
                <div class="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-4">
                  <span class="text-sm font-semibold text-green-700 dark:text-green-400">4</span>
                </div>
                <div class="flex-1">
                  <h4 class="font-semibold mb-1" :class="isDarkMode ? 'text-white' : 'text-gray-900'">Define Events</h4>
                  <p class="text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-600'">
                    Add custom events that your control can trigger. Each event needs an ID and a friendly name. Events can be triggered from your control's JavaScript code and will be available in K2 workflows.
                  </p>
                </div>
              </div>
              
              <div class="flex items-start">
                <div class="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-4">
                  <span class="text-sm font-semibold text-green-700 dark:text-green-400">5</span>
                </div>
                <div class="flex-1">
                  <h4 class="font-semibold mb-1" :class="isDarkMode ? 'text-white' : 'text-gray-900'">Add Methods</h4>
                  <p class="text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-600'">
                    Define callable methods that can be invoked programmatically. Each method needs an ID, display name, and optional description. The wizard will generate the execute() method that routes to your custom methods.
                  </p>
                </div>
              </div>
              
              <div class="flex items-start">
                <div class="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-4">
                  <span class="text-sm font-semibold text-green-700 dark:text-green-400">6</span>
                </div>
                <div class="flex-1">
                  <h4 class="font-semibold mb-1" :class="isDarkMode ? 'text-white' : 'text-gray-900'">Choose File Structure</h4>
                  <p class="text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-600'">
                    Select whether to use separate files for design-time and runtime, or shared files for both. Separate files give you more control but require maintaining two sets of code.
                  </p>
                </div>
              </div>
              
              <div class="flex items-start">
                <div class="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-4">
                  <span class="text-sm font-semibold text-green-700 dark:text-green-400">7</span>
                </div>
                <div class="flex-1">
                  <h4 class="font-semibold mb-1" :class="isDarkMode ? 'text-white' : 'text-gray-900'">Generate and Download</h4>
                  <p class="text-sm" :class="isDarkMode ? 'text-gray-300' : 'text-gray-600'">
                    Review the manifest preview to ensure everything is correct. Click <strong>Generate ZIP</strong> to create a complete control package. You can also load the control directly into the Inspector for immediate testing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'Home',
  props: {
    isDarkMode: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      expandedHowTo: {
        inspector: false,
        createControl: false
      }
    }
  },
  methods: {
    toggleHowTo(section) {
      this.expandedHowTo[section] = !this.expandedHowTo[section]
    },
    switchTab(tabName) {
      this.$emit('switch-tab', tabName)
    }
  }
}
</script>

<style scoped>
.home-page {
  transition: background-color 0.2s ease;
}
</style>
