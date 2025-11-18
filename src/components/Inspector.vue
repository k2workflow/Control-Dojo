<template>
  <div :class="['flex h-full transition-colors duration-200', isDarkMode ? 'bg-dark-900' : 'bg-slate-50']" style="height: calc(100vh - 4rem);">
    <!-- Left Sidebar - Using same pattern as console panel -->
    <div 
      ref="leftPanel"
      :class="[
        'transition-all duration-200 border-r flex-shrink-0 relative flex flex-col',
        isDarkMode ? 'bg-dark-800 border-dark-600' : 'bg-white border-slate-200',
        isResizingLeftPanel ? 'transition-none' : ''
      ]"
      :style="{ width: leftPanelWidth + 'px', minWidth: '250px', maxWidth: '70%', height: 'calc(100vh - 4rem)' }"
    >
      <!-- Control Loading Section -->
      <div :class="['p-4 border-b transition-colors duration-200 flex-shrink-0', isDarkMode ? 'border-dark-600' : 'border-slate-200']">
        <div class="space-y-4">
          <!-- Load from Folder Button -->
          <div>
            <label :class="['block text-sm font-medium mb-2 transition-colors duration-200', isDarkMode ? 'text-dark-200' : 'text-slate-700']">
              Load Control
            </label>
            <div class="flex space-x-2">
              <input
                ref="manifestFileInput"
                type="file"
                webkitdirectory
                style="display: none"
                @change="handleManifestFileSelect"
              />
              <button 
                @click="triggerManifestFileSelect" 
                :class="['flex-1 px-4 py-2 rounded-md font-medium transition-colors duration-200', isDarkMode ? 'bg-orange-600 text-white hover:bg-orange-700' : 'bg-blue-600 text-white hover:bg-blue-700']"
              >
                Load from Folder
              </button>
            </div>
          </div>
          
          <!-- Examples Dropdown -->
          <div>
              <label :class="['block text-sm font-medium mb-2 transition-colors duration-200', isDarkMode ? 'text-dark-200' : 'text-slate-700']">
                Controls
              </label>
            <div class="flex space-x-2 min-w-0">
              <select
                v-model="selectedExample"
                @change="loadExample"
                :class="['flex-1 min-w-0 px-3 py-2 border rounded-md transition-colors duration-200', isDarkMode ? 'bg-dark-700 border-dark-600 text-dark-100 focus:border-orange-500 focus:ring-orange-500' : 'bg-white border-slate-300 text-slate-900 focus:border-primary-500 focus:ring-primary-500']"
              >
                <option value="">Choose a control...</option>
                <option
                  v-for="example in examples"
                  :key="example.path"
                  :value="example.path"
                >
                  {{ example.name }}
                </option>
              </select>
              <button 
                @click="refreshExamples" 
                :class="['p-2 rounded-md border transition-colors duration-200 flex-shrink-0', isDarkMode ? 'border-dark-600 text-dark-300 hover:bg-dark-700' : 'border-slate-300 text-slate-600 hover:bg-slate-50']"
                title="Refresh controls"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
              </button>
              <button 
                @click="createZip" 
                :disabled="!manifest"
                :class="['p-2 rounded-md border transition-colors duration-200 flex-shrink-0', isDarkMode ? 'border-dark-600 text-dark-300 hover:bg-dark-700 disabled:opacity-50' : 'border-slate-300 text-slate-600 hover:bg-slate-50 disabled:opacity-50']"
                title="Create ZIP"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Scrollable Content Area -->
      <div class="flex-1 overflow-y-auto">
        <!-- Properties Section -->
        <div :class="['border-b transition-colors duration-200', isDarkMode ? 'border-dark-600' : 'border-slate-200']">
          <button
            @click="toggleSection('properties')"
            :class="['w-full p-4 flex items-center justify-between transition-colors duration-200', isDarkMode ? 'hover:bg-dark-700' : 'hover:bg-slate-50']"
          >
            <h3 :class="['text-lg font-semibold transition-colors duration-200', isDarkMode ? 'text-dark-100' : 'text-gray-900']">
              Properties
            </h3>
            <svg 
              :class="['w-5 h-5 transition-transform duration-200', isDarkMode ? 'text-gray-400' : 'text-gray-500', collapsedSections.properties ? 'rotate-180' : '']"
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>
          <div v-show="!collapsedSections.properties" class="p-4">
            <div v-if="manifest && allProperties.length > 0" class="space-y-6">
              
              <!-- Standard Properties Subsection -->
              <div v-if="standardProperties.length > 0">
                <div class="flex items-center space-x-2 mb-3">
                  <h4 :class="['text-sm font-semibold transition-colors duration-200', isDarkMode ? 'text-orange-300' : 'text-blue-700']">
                    Standard Properties
                  </h4>
                  <span :class="['text-xs px-2 py-1 rounded-full', isDarkMode ? 'bg-orange-900 text-orange-300' : 'bg-blue-100 text-blue-700']">
                    {{ standardProperties.length }}
                  </span>
                </div>
                <div class="space-y-4">
                  <div v-for="prop in standardProperties" :key="prop.id" class="space-y-2">
                    <label :class="['block text-sm font-medium transition-colors duration-200', isDarkMode ? 'text-gray-300' : 'text-gray-700']">
                      {{ prop.friendlyname || prop.id }} ({{ prop.id }})
                    </label>
                    
                    <!-- Boolean properties (checkboxes) -->
                    <div v-if="prop.type === 'bool'" class="flex items-center space-x-2">
                      <input
                        :id="'prop-' + prop.id"
                        type="checkbox"
                        :checked="propValues[prop.id] === 'true'"
                        :class="[
                          'w-4 h-4 rounded focus:ring-2 focus:ring-blue-500 focus:ring-orange-500',
                          isDarkMode 
                            ? 'text-white bg-orange-500 border-orange-500 focus:ring-orange-500 checked:bg-orange-500 checked:border-orange-500' 
                            : 'text-white bg-blue-500 border-blue-500 focus:ring-blue-500 checked:bg-blue-500 checked:border-blue-500'
                        ]"
                        @change="updateBooleanProperty(prop.id, $event.target.checked)"
                      />
                      <label :for="'prop-' + prop.id" :class="['text-sm transition-colors duration-200', isDarkMode ? 'text-dark-300' : 'text-slate-600']">
                        {{ propValues[prop.id] === 'true' ? 'Enabled' : 'Disabled' }}
                      </label>
                    </div>
                    
                    <!-- List properties (text box with button) -->
                    <div v-else-if="isListProperty(prop)" class="space-y-2">
                      <div class="flex items-center space-x-2">
                        <input
                          :value="getListPreview(prop.id) || '(No items)'"
                          type="text"
                          readonly
                          :class="[
                            'flex-1 px-3 py-2 border rounded-md transition-colors duration-200',
                            isDarkMode 
                              ? 'bg-dark-700 border-dark-600 text-dark-200 placeholder-dark-400' 
                              : 'bg-white border-slate-300 text-slate-900 placeholder-slate-500'
                          ]"
                          placeholder="(No items)"
                        />
                        <button
                          @click="openListEditorModal(prop.id)"
                          :class="[
                            'px-3 py-2 border rounded-md transition-colors duration-200 flex items-center justify-center',
                            isDarkMode 
                              ? 'bg-dark-700 border-dark-600 text-dark-300 hover:bg-dark-600 hover:text-dark-100' 
                              : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                          ]"
                          title="Edit list items"
                        >
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    <!-- Dropdown properties -->
                    <div v-else-if="isDropdownProperty(prop)">
                      <select
                        v-model="propValues[prop.id]"
                        :class="['w-full px-3 py-2 border rounded-md transition-colors duration-200', isDarkMode ? 'bg-dark-700 border-dark-600 text-dark-100 focus:border-orange-500 focus:ring-orange-500' : 'bg-white border-slate-300 text-slate-900 focus:border-primary-500 focus:ring-primary-500']"
                        @change="updateProperty(prop.id, $event.target.value)"
                      >
                        <option v-for="item in getDropdownItems(prop)" :key="item.value" :value="item.value">
                          {{ item.text || item.value }}
                        </option>
                      </select>
                    </div>
                    
                    <!-- Text properties (text inputs and textareas) -->
                    <div v-else>
                      <input
                        v-if="getPropertyInputType(prop) === 'text'"
                        v-model="propValues[prop.id]"
                        type="text"
                        :placeholder="prop.description || prop.initialvalue || ''"
                        :class="['w-full px-3 py-2 border rounded-md transition-colors duration-200', isDarkMode ? 'bg-dark-700 border-dark-600 text-dark-100 placeholder-dark-400 focus:border-orange-500 focus:ring-orange-500' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-500 focus:border-primary-500 focus:ring-primary-500']"
                        @input="updateProperty(prop.id, $event.target.value)"
                      />
                      <textarea
                        v-else-if="getPropertyInputType(prop) === 'textarea'"
                        v-model="propValues[prop.id]"
                        :placeholder="prop.description || prop.initialvalue || ''"
                        :rows="3"
                        :class="['w-full px-3 py-2 border rounded-md transition-colors duration-200', isDarkMode ? 'bg-dark-700 border-dark-600 text-dark-100 placeholder-dark-400 focus:border-orange-500 focus:ring-orange-500' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-500 focus:border-primary-500 focus:ring-primary-500']"
                        @input="updateProperty(prop.id, $event.target.value)"
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Custom Properties Subsection -->
              <div v-if="customProperties.length > 0">
                <div class="flex items-center space-x-2 mb-3">
                  <h4 :class="['text-sm font-semibold transition-colors duration-200', isDarkMode ? 'text-orange-300' : 'text-blue-700']">
                    Custom Properties
                  </h4>
                  <span :class="['text-xs px-2 py-1 rounded-full', isDarkMode ? 'bg-orange-900 text-orange-300' : 'bg-blue-100 text-blue-700']">
                    {{ customProperties.length }}
                  </span>
                </div>
                <div class="space-y-4">
                  <div v-for="prop in customProperties" :key="prop.id" class="space-y-2">
                    <label :class="['block text-sm font-medium transition-colors duration-200', isDarkMode ? 'text-gray-300' : 'text-gray-700']">
                      {{ prop.friendlyname || prop.id }} ({{ prop.id }})
                    </label>
                    
                    <!-- Boolean properties (checkboxes) -->
                    <div v-if="prop.type === 'bool'" class="flex items-center space-x-2">
                      <input
                        :id="'prop-' + prop.id"
                        type="checkbox"
                        :checked="propValues[prop.id] === 'true'"
                        :class="[
                          'w-4 h-4 rounded focus:ring-2 focus:ring-blue-500 focus:ring-orange-500',
                          isDarkMode 
                            ? 'text-white bg-orange-500 border-orange-500 focus:ring-orange-500 checked:bg-orange-500 checked:border-orange-500' 
                            : 'text-white bg-blue-500 border-blue-500 focus:ring-blue-500 checked:bg-blue-500 checked:border-blue-500'
                        ]"
                        @change="updateBooleanProperty(prop.id, $event.target.checked)"
                      />
                      <label :for="'prop-' + prop.id" :class="['text-sm transition-colors duration-200', isDarkMode ? 'text-dark-300' : 'text-slate-600']">
                        {{ propValues[prop.id] === 'true' ? 'Enabled' : 'Disabled' }}
                      </label>
                    </div>
                    
                    <!-- List properties (text box with button) -->
                    <div v-else-if="isListProperty(prop)" class="space-y-2">
                      <div class="flex items-center space-x-2">
                        <input
                          :value="getListPreview(prop.id) || '(No items)'"
                          type="text"
                          readonly
                          :class="[
                            'flex-1 px-3 py-2 border rounded-md transition-colors duration-200',
                            isDarkMode 
                              ? 'bg-dark-700 border-dark-600 text-dark-200 placeholder-dark-400' 
                              : 'bg-white border-slate-300 text-slate-900 placeholder-slate-500'
                          ]"
                          placeholder="(No items)"
                        />
                        <button
                          @click="openListEditorModal(prop.id)"
                          :class="[
                            'px-3 py-2 border rounded-md transition-colors duration-200 flex items-center justify-center',
                            isDarkMode 
                              ? 'bg-dark-700 border-dark-600 text-dark-300 hover:bg-dark-600 hover:text-dark-100' 
                              : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                          ]"
                          title="Edit list items"
                        >
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    <!-- Dropdown properties -->
                    <div v-else-if="isDropdownProperty(prop)">
                      <select
                        v-model="propValues[prop.id]"
                        :class="['w-full px-3 py-2 border rounded-md transition-colors duration-200', isDarkMode ? 'bg-dark-700 border-dark-600 text-dark-100 focus:border-orange-500 focus:ring-orange-500' : 'bg-white border-slate-300 text-slate-900 focus:border-orange-500 focus:ring-orange-500']"
                        @change="updateProperty(prop.id, $event.target.value)"
                      >
                        <option v-for="item in getDropdownItems(prop)" :key="item.value" :value="item.value">
                          {{ item.text || item.value }}
                        </option>
                      </select>
                    </div>
                    
                    <!-- Text properties (text inputs and textareas) -->
                    <div v-else>
                      <input
                        v-if="getPropertyInputType(prop) === 'text'"
                        v-model="propValues[prop.id]"
                        type="text"
                        :placeholder="prop.description || prop.initialvalue || ''"
                        :class="['w-full px-3 py-2 border rounded-md transition-colors duration-200', isDarkMode ? 'bg-dark-700 border-dark-600 text-dark-100 placeholder-dark-400 focus:border-orange-500 focus:ring-orange-500' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-500 focus:border-orange-500 focus:ring-orange-500']"
                        @input="updateProperty(prop.id, $event.target.value)"
                      />
                      <textarea
                        v-else-if="getPropertyInputType(prop) === 'textarea'"
                        v-model="propValues[prop.id]"
                        :placeholder="prop.description || prop.initialvalue || ''"
                        :rows="3"
                        :class="['w-full px-3 py-2 border rounded-md transition-colors duration-200', isDarkMode ? 'bg-dark-700 border-dark-600 text-dark-100 placeholder-dark-400 focus:border-orange-500 focus:ring-orange-500' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-500 focus:border-orange-500 focus:ring-orange-500']"
                        @input="updateProperty(prop.id, $event.target.value)"
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
              <div class="flex space-x-2 pt-4">
                <button 
                  @click="resetProperties" 
                  :class="['px-3 py-1 text-sm rounded-md border transition-colors duration-200', isDarkMode ? 'border-dark-600 text-dark-300 hover:bg-dark-700' : 'border-slate-300 text-slate-600 hover:bg-slate-50']"
                >
                  Reset
                </button>
              </div>
            </div>
            <div v-else :class="['text-sm transition-colors duration-200', isDarkMode ? 'text-dark-400' : 'text-slate-500']">
              No control loaded
            </div>
          </div>
        </div>

        <!-- Events Section -->
        <div :class="['border-b transition-colors duration-200', isDarkMode ? 'border-dark-600' : 'border-slate-200']">
          <button
            @click="toggleSection('events')"
            :class="['w-full p-4 flex items-center justify-between transition-colors duration-200', isDarkMode ? 'hover:bg-dark-700' : 'hover:bg-slate-50']"
          >
            <h3 :class="['text-lg font-semibold transition-colors duration-200', isDarkMode ? 'text-white' : 'text-gray-900']">
              Events
            </h3>
            <svg 
              :class="['w-5 h-5 transition-transform duration-200', isDarkMode ? 'text-gray-300' : 'text-gray-500', collapsedSections.events ? 'rotate-180' : '']"
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>
          <div v-show="!collapsedSections.events" class="p-4">
            <div v-if="manifest && manifest.events" class="space-y-2">
              <button
                v-for="event in manifest.events"
                :key="event.id"
                @click="triggerEvent(event.id)"
                :class="[
                  'w-full text-left px-3 py-2 rounded-lg transition-all duration-200 font-medium',
                  isDarkMode 
                    ? 'bg-dark-700 text-dark-100 hover:bg-dark-600 hover:text-white border border-dark-600' 
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 border border-slate-200',
                  triggeredEvents.includes(event.id) 
                    ? (isDarkMode 
                        ? 'ring-2 ring-orange-400 bg-orange-900 text-orange-100 border-orange-400' 
                        : 'ring-2 ring-primary-500 bg-primary-50 text-primary-700 border-primary-500')
                    : ''
                ]"
              >
                {{ event.friendlyname || event.id }}
              </button>
            </div>
            <div v-else :class="['text-sm transition-colors duration-200', isDarkMode ? 'text-dark-400' : 'text-slate-500']">
              No events available
            </div>
          </div>
        </div>

        <!-- Methods Section -->
        <div :class="['border-b transition-colors duration-200', isDarkMode ? 'border-dark-600' : 'border-slate-200']">
          <button
            @click="toggleSection('methods')"
            :class="['w-full p-4 flex items-center justify-between transition-colors duration-200', isDarkMode ? 'hover:bg-dark-700' : 'hover:bg-slate-50']"
          >
            <h3 :class="['text-lg font-semibold transition-colors duration-200', isDarkMode ? 'text-white' : 'text-gray-900']">
              Methods
            </h3>
            <svg 
              :class="['w-5 h-5 transition-transform duration-200', isDarkMode ? 'text-gray-300' : 'text-gray-500', collapsedSections.methods ? 'rotate-180' : '']"
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>
          <div v-show="!collapsedSections.methods" class="p-4">
            <div v-if="manifest && manifest.methods && manifest.methods.length > 0" class="space-y-2">
              <button
                v-for="method in manifest.methods"
                :key="method.id"
                @click="triggerMethod(method.id)"
                :class="[
                  'w-full text-left px-3 py-2 rounded-lg transition-all duration-200',
                  isDarkMode 
                    ? 'bg-dark-700 text-dark-100 hover:bg-dark-600 hover:text-white border border-dark-600' 
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 border border-slate-200',
                  triggeredMethods.includes(method.id) 
                    ? (isDarkMode 
                        ? 'ring-2 ring-orange-400 bg-orange-900 text-orange-100 border-orange-400' 
                        : 'ring-2 ring-primary-500 bg-primary-50 text-primary-700 border-primary-500')
                    : ''
                ]"
              >
                <div class="flex flex-col">
                  <span class="font-medium">{{ method.displayname || method.id }}</span>
                  <span v-if="method.description" :class="['text-xs mt-1', isDarkMode ? 'text-dark-300' : 'text-slate-500']">
                    {{ method.description }}
                  </span>
                </div>
              </button>
            </div>
            <div v-else :class="['text-sm transition-colors duration-200', isDarkMode ? 'text-dark-400' : 'text-slate-500']">
              No methods available
            </div>
          </div>
        </div>

        <!-- Scripts & Styles Section -->
        <div>
          <button
            @click="toggleSection('scripts')"
            :class="['w-full p-4 flex items-center justify-between transition-colors duration-200', isDarkMode ? 'hover:bg-dark-700' : 'hover:bg-slate-50']"
          >
            <h3 :class="['text-lg font-semibold transition-colors duration-200', isDarkMode ? 'text-dark-100' : 'text-gray-900']">
              Scripts & Styles
            </h3>
            <svg 
              :class="['w-5 h-5 transition-transform duration-200', isDarkMode ? 'text-gray-400' : 'text-gray-500', collapsedSections.scripts ? 'rotate-180' : '']"
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>
          <div v-show="!collapsedSections.scripts" class="p-4">
            <div v-if="manifest" class="space-y-2">
            <!-- Scripts -->
            <div v-for="script in currentScripts" :key="script" class="flex items-center justify-between p-2 rounded transition-colors duration-200" :class="[
              isDarkMode ? 'bg-dark-700' : 'bg-slate-50'
            ]">
              <div class="flex-1">
                <div :class="[
                  'text-sm font-medium transition-colors duration-200',
                  isDarkMode ? 'text-dark-200' : 'text-slate-700'
                ]">
                  {{ script.split('/').pop() }}
                </div>
                <div :class="['text-xs transition-colors duration-200', isDarkMode ? 'text-dark-400' : 'text-slate-500']">
                  script • {{ activePreview }}
                </div>
              </div>
              <button 
                @click="toggleScriptStyle(script, 'script')"
                :class="[
                  'w-6 h-6 rounded-full flex items-center justify-center text-xs transition-colors duration-200',
                  loadedScripts.get(script) !== false 
                    ? (isDarkMode ? 'bg-green-600 text-white' : 'bg-green-500 text-white')
                    : (isDarkMode ? 'bg-red-600 text-white' : 'bg-red-500 text-white')
                ]"
                :title="loadedScripts.get(script) !== false ? 'Click to disable' : 'Click to enable'"
              >
                {{ loadedScripts.get(script) !== false ? 'On' : 'Off' }}
              </button>
            </div>
              <!-- Styles -->
              <div v-for="style in currentStyles" :key="style" class="flex items-center justify-between p-2 rounded transition-colors duration-200" :class="[
                isDarkMode ? 'bg-dark-700' : 'bg-slate-50'
              ]">
                <div class="flex-1">
                  <div :class="[
                    'text-sm font-medium transition-colors duration-200',
                    isDarkMode ? 'text-dark-200' : 'text-slate-700'
                  ]">
                    {{ style.split('/').pop() }}
                  </div>
                  <div :class="['text-xs transition-colors duration-200', isDarkMode ? 'text-dark-400' : 'text-slate-500']">
                    style • {{ activePreview }}
                  </div>
                </div>
                <button 
                  @click="toggleScriptStyle(style, 'style')"
                  :class="[
                    'w-6 h-6 rounded-full flex items-center justify-center text-xs transition-colors duration-200',
                    loadedStyles.get(style) !== false 
                      ? (isDarkMode ? 'bg-green-600 text-white' : 'bg-green-500 text-white')
                      : (isDarkMode ? 'bg-red-600 text-white' : 'bg-red-500 text-white')
                  ]"
                  :title="loadedStyles.get(style) !== false ? 'Click to disable' : 'Click to enable'"
                >
                  {{ loadedStyles.get(style) !== false ? 'On' : 'Off' }}
                </button>
              </div>
            </div>
            <div v-else :class="['text-sm transition-colors duration-200', isDarkMode ? 'text-dark-400' : 'text-slate-500']">
              No scripts or styles
            </div>
          </div>
        </div>
      </div>
      
      <!-- Resize Handle -->
      <div 
        :class="[
          'absolute top-0 right-0 bottom-0 w-1 bg-transparent cursor-col-resize transition-colors duration-200',
          isDarkMode ? 'hover:bg-orange-500 hover:bg-opacity-30' : 'hover:bg-blue-500 hover:bg-opacity-20'
        ]"
        @mousedown="startResize"
      ></div>
    </div>

    <!-- Main Content Area with Flexible Layout -->
    <div class="flex-1 flex min-w-0" style="height: calc(100vh - 4rem);">
      <!-- Main Canvas Area -->
      <div class="flex-1 flex flex-col min-w-0" :style="consoleDocked === 'right' ? 'width: calc(100% - ' + (consoleCollapsed ? '3rem' : consoleSize + 'px') + ')' : ''">
        <!-- Preview Tabs -->
        <div :class="['border-b transition-colors duration-200 flex-shrink-0', isDarkMode ? 'bg-dark-800 border-dark-600' : 'bg-white border-slate-200']">
          <div class="flex items-center h-10 justify-between">
            <div class="flex items-center">
              <button
                @click="activePreview = 'design'"
                :class="[
                  'px-4 py-2 font-medium transition-colors duration-200 h-full flex items-center',
                  activePreview === 'design'
                    ? (isDarkMode ? 'bg-orange-600 text-white border-b-2 border-orange-400' : 'bg-primary-100 text-primary-700 border-b-2 border-primary-500')
                    : (isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-slate-600 hover:text-slate-900')
                ]"
              >
                Design-time
              </button>
              <button
                @click="activePreview = 'runtime'"
                :class="[
                  'px-4 py-2 font-medium transition-colors duration-200 h-full flex items-center',
                  activePreview === 'runtime'
                    ? (isDarkMode ? 'bg-orange-600 text-white border-b-2 border-orange-400' : 'bg-primary-100 text-primary-700 border-b-2 border-primary-500')
                    : (isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-slate-600 hover:text-slate-900')
                ]"
              >
                Runtime
              </button>
            </div>
            <button
              @click="reloadControlIntoFrames"
              :disabled="!manifest"
              :class="[
                'px-3 py-1.5 mx-2 rounded-md transition-colors duration-200 flex items-center space-x-1.5',
                manifest
                  ? (isDarkMode 
                      ? 'bg-dark-700 text-dark-200 hover:bg-dark-600 hover:text-white border border-dark-600' 
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 border border-slate-300')
                  : (isDarkMode 
                      ? 'bg-dark-800 text-dark-500 border border-dark-700 cursor-not-allowed opacity-50' 
                      : 'bg-slate-50 text-slate-400 border border-slate-200 cursor-not-allowed opacity-50')
              ]"
              title="Refresh both design-time and runtime frames"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              <span class="text-sm font-medium">Refresh</span>
            </button>
          </div>
        </div>

        <!-- Canvas Area -->
        <div class="flex-1 relative overflow-hidden" :style="canvasHeight">
          <div :class="['absolute inset-0 transition-colors duration-200', isDarkMode ? 'bg-dark-900' : 'bg-white']" :style="isDarkMode ? 'background-image: radial-gradient(circle, #334155 1px, transparent 1px); background-size: 20px 20px;' : 'background-image: radial-gradient(circle, #e5e7eb 1px, transparent 1px); background-size: 20px 20px;'"></div>
          <iframe
            v-if="activePreview === 'design'"
            ref="designFrame"
            class="w-full h-full border-0 relative z-10"
            :src="designFrameSrc"
            @load="onFrameLoad('design')"
          ></iframe>
          <iframe
            v-if="activePreview === 'runtime'"
            ref="runtimeFrame"
            class="w-full h-full border-0 relative z-10"
            :src="runtimeFrameSrc"
            @load="onFrameLoad('runtime')"
          ></iframe>
        </div>

        <!-- Console at Bottom (when docked to bottom) -->
        <div 
          v-if="consoleDocked === 'bottom'"
          ref="consoleContainer"
          :class="[
            'transition-all duration-200 border-t flex-shrink-0 relative',
            isDarkMode ? 'bg-dark-800 border-dark-600' : 'bg-slate-100 border-slate-200',
            isResizing ? 'transition-none' : ''
          ]"
          :style="consoleStyle"
        >
          <!-- Console Header with Docking Controls -->
          <div :class="['flex items-center justify-between border-b h-10 transition-colors duration-200', isDarkMode ? 'border-dark-600' : 'border-slate-200']">
            <div class="flex items-center space-x-2 h-full px-4">
              <!-- Toggle Console Button - Leftmost position -->
              <button @click="toggleConsole" :class="['p-1 rounded transition-colors duration-200', isDarkMode ? 'text-dark-400 hover:bg-dark-700' : 'text-slate-500 hover:bg-slate-200']">
                <!-- Bottom dock: collapsed shows up arrow (to expand down), expanded shows down arrow (to collapse up) -->
                <svg v-if="consoleCollapsed" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/>
                </svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </button>
              
              <span :class="['text-sm font-medium transition-colors duration-200', isDarkMode ? 'text-dark-200' : 'text-slate-600']">Console</span>
              
              <!-- Docking Controls -->
              <div class="flex items-center space-x-1">
                <button 
                  @click="setConsoleDock('bottom')" 
                  :class="[
                    'p-1 rounded transition-colors duration-200 text-xs',
                    consoleDocked === 'bottom' 
                      ? (isDarkMode ? 'bg-dark-700 text-dark-200' : 'bg-slate-200 text-slate-700')
                      : (isDarkMode ? 'text-dark-400 hover:bg-dark-700' : 'text-slate-500 hover:bg-slate-200')
                  ]"
                  title="Dock to bottom"
                >
                  <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2zm0 2 .001 9H5V5h14zM5 19v-3h14.002v3H5z"/>
                  </svg>
                </button>
                <button 
                  @click="setConsoleDock('right')" 
                  :class="[
                    'p-1 rounded transition-colors duration-200 text-xs',
                    consoleDocked === 'right' 
                      ? (isDarkMode ? 'bg-dark-700 text-dark-200' : 'bg-slate-200 text-slate-700')
                      : (isDarkMode ? 'text-dark-400 hover:bg-dark-700' : 'text-slate-500 hover:bg-slate-200')
                  ]"
                  title="Dock to right"
                >
                  <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2zM5 5h9v14H5V5zm11 14V5h3l.002 14H16z"/>
                  </svg>
                </button>
              </div>
            </div>
            
            <div class="flex items-center space-x-2">
              <!-- Filter Control Logs -->
              <button @click="toggleControlLogsFilter" :class="['p-1 rounded transition-colors duration-200', showControlLogsOnly ? (isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white') : (isDarkMode ? 'text-dark-400 hover:bg-dark-700' : 'text-slate-500 hover:bg-slate-200')]" :title="showControlLogsOnly ? 'Show all logs' : 'Show only control logs'">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z"/>
                </svg>
              </button>
              
              <!-- Copy Console -->
              <button @click="copyConsole" :class="['p-1 rounded transition-colors duration-200', isDarkMode ? 'text-dark-400 hover:bg-dark-700' : 'text-slate-500 hover:bg-slate-200']" title="Copy console to clipboard">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                </svg>
              </button>
              
              <!-- Clear Console -->
              <button @click="clearConsole" :class="['p-1 rounded transition-colors duration-200', isDarkMode ? 'text-dark-400 hover:bg-dark-700' : 'text-slate-500 hover:bg-slate-200']" title="Clear console">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
              </button>
            </div>
          </div>
          
          <!-- Resize Handle -->
          <div 
            v-if="!consoleCollapsed"
            :class="[
              'console-resize-handle absolute top-0 left-0 right-0 h-1 bg-transparent cursor-row-resize transition-colors duration-200',
              isDarkMode ? 'hover:bg-orange-500 hover:bg-opacity-30' : 'hover:bg-blue-500 hover:bg-opacity-20'
            ]"
            @mousedown="startResize"
          ></div>
          
          <!-- Console Content -->
          <div v-show="!consoleCollapsed" class="h-full overflow-y-auto font-mono text-sm p-4" style="padding-bottom: 1rem;">
            <div v-for="(log, index) in [...filteredConsoleLogs].reverse()" :key="filteredConsoleLogs.length - index - 1" :class="['mb-1 transition-colors duration-200', log.color || (isDarkMode ? 'text-green-400' : 'text-green-600')]">
              {{ typeof log === 'string' ? log : log.message }}
            </div>
            <!-- Single spacer at bottom for visual separation -->
            <div class="h-4"></div>
          </div>
        </div>
      </div>

      <!-- Console at Right (when docked to right) -->
      <div 
        v-if="consoleDocked === 'right'"
        ref="consoleContainer"
        :class="[
          'transition-all duration-200 border-l flex-shrink-0 relative',
          isDarkMode ? 'bg-dark-800 border-dark-600' : 'bg-slate-100 border-slate-200',
          isResizing ? 'transition-none' : ''
        ]"
        :style="consoleStyle"
      >
        <!-- Console Header with Docking Controls -->
        <div :class="[
          'transition-colors duration-200 border-b',
          consoleCollapsed 
            ? 'flex flex-col h-full w-10 border-r border-b-0' 
            : 'flex items-center justify-between h-10',
          isDarkMode ? 'border-dark-600' : 'border-slate-200'
        ]">
          <!-- When collapsed: vertical layout (horizontal layout rotated 90°) -->
          <div v-if="consoleCollapsed" class="flex flex-col items-center space-y-1 py-2">
            <!-- Toggle Console Button (right arrow) -->
            <button @click="toggleConsole" :class="['p-1 rounded transition-colors duration-200', isDarkMode ? 'text-dark-400 hover:bg-dark-700' : 'text-slate-500 hover:bg-slate-200']" title="Expand console">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </button>
            
            <!-- Dock Controls -->
            <button @click="setConsoleDock('bottom')" :class="['p-1 rounded transition-colors duration-200 text-xs', isDarkMode ? 'text-dark-400 hover:bg-dark-700' : 'text-slate-500 hover:bg-slate-200']" title="Dock to bottom">
              <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2zm0 2 .001 9H5V5h14zM5 19v-3h14.002v3H5z"/>
              </svg>
            </button>
            
            <button @click="setConsoleDock('right')" :class="['p-1 rounded transition-colors duration-200 text-xs', isDarkMode ? 'bg-dark-700 text-dark-200' : 'bg-slate-200 text-slate-700']" title="Dock to right">
              <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2zM5 5h9v14H5V5zm11 14V5h3l.002 14H16z"/>
              </svg>
            </button>
            
            <!-- Action Buttons -->
            <button @click="copyConsole" :class="['p-1 rounded transition-colors duration-200', isDarkMode ? 'text-dark-400 hover:bg-dark-700' : 'text-slate-500 hover:bg-slate-200']" title="Copy console">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
              </svg>
            </button>
            
            <button @click="clearConsole" :class="['p-1 rounded transition-colors duration-200', isDarkMode ? 'text-dark-400 hover:bg-dark-700' : 'text-slate-500 hover:bg-slate-200']" title="Clear console">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
            </button>
          </div>
          
          <!-- When expanded: horizontal layout -->
          <div v-else class="flex items-center justify-between w-full">
            <div class="flex items-center space-x-2 h-full px-4">
              <!-- Toggle Console Button - Leftmost position -->
              <button @click="toggleConsole" :class="['p-1 rounded transition-colors duration-200', isDarkMode ? 'text-dark-400 hover:bg-dark-700' : 'text-slate-500 hover:bg-slate-200']">
                <!-- Right dock: collapsed shows left arrow (to expand right), expanded shows right arrow (to collapse left) -->
                <svg v-if="consoleCollapsed" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                </svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </button>
              
              <span :class="['text-sm font-medium transition-colors duration-200', isDarkMode ? 'text-dark-200' : 'text-slate-600']">Console</span>
              
              <!-- Docking Controls -->
              <div class="flex items-center space-x-1">
                <button 
                  @click="setConsoleDock('bottom')" 
                  :class="[
                    'p-1 rounded transition-colors duration-200 text-xs',
                    consoleDocked === 'bottom' 
                      ? (isDarkMode ? 'bg-dark-700 text-dark-200' : 'bg-slate-200 text-slate-700')
                      : (isDarkMode ? 'text-dark-400 hover:bg-dark-700' : 'text-slate-500 hover:bg-slate-200')
                  ]"
                  title="Dock to bottom"
                >
                  <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2zm0 2 .001 9H5V5h14zM5 19v-3h14.002v3H5z"/>
                  </svg>
                </button>
                <button 
                  @click="setConsoleDock('right')" 
                  :class="[
                    'p-1 rounded transition-colors duration-200 text-xs',
                    consoleDocked === 'right' 
                      ? (isDarkMode ? 'bg-dark-700 text-dark-200' : 'bg-slate-200 text-slate-700')
                      : (isDarkMode ? 'text-dark-400 hover:bg-dark-700' : 'text-slate-500 hover:bg-slate-200')
                  ]"
                  title="Dock to right"
                >
                  <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2zM5 5h9v14H5V5zm11 14V5h3l.002 14H16z"/>
                  </svg>
                </button>
              </div>
            </div>
            
            <div class="flex items-center space-x-2">
              <!-- Filter Control Logs -->
              <button @click="toggleControlLogsFilter" :class="['p-1 rounded transition-colors duration-200', showControlLogsOnly ? (isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white') : (isDarkMode ? 'text-dark-400 hover:bg-dark-700' : 'text-slate-500 hover:bg-slate-200')]" :title="showControlLogsOnly ? 'Show all logs' : 'Show only control logs'">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z"/>
                </svg>
              </button>
              
              <!-- Copy Console -->
              <button @click="copyConsole" :class="['p-1 rounded transition-colors duration-200', isDarkMode ? 'text-dark-400 hover:bg-dark-700' : 'text-slate-500 hover:bg-slate-200']" title="Copy console to clipboard">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                </svg>
              </button>
              
              <!-- Clear Console -->
              <button @click="clearConsole" :class="['p-1 rounded transition-colors duration-200', isDarkMode ? 'text-dark-400 hover:bg-dark-700' : 'text-slate-500 hover:bg-slate-200']" title="Clear console">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <!-- Resize Handle -->
        <div 
          v-if="!consoleCollapsed"
          :class="[
            'console-resize-handle absolute top-0 left-0 bottom-0 w-1 bg-transparent cursor-col-resize transition-colors duration-200',
            isDarkMode ? 'hover:bg-orange-500 hover:bg-opacity-30' : 'hover:bg-blue-500 hover:bg-opacity-20'
          ]"
          @mousedown="startResize"
        ></div>
        
        <!-- Console Content -->
        <div v-show="!consoleCollapsed" class="h-full overflow-y-auto font-mono text-sm p-4" style="padding-bottom: 1rem;">
          <div v-for="(log, index) in [...filteredConsoleLogs].reverse()" :key="filteredConsoleLogs.length - index - 1" :class="['mb-1 transition-colors duration-200', log.color || (isDarkMode ? 'text-green-400' : 'text-green-600')]">
            {{ typeof log === 'string' ? log : log.message }}
          </div>
          <!-- Single spacer at bottom for visual separation -->
          <div class="h-4"></div>
        </div>
      </div>
    </div>
    
    <!-- List Editor Modal -->
    <div
      v-if="openListModal"
      @click.self="closeListEditorModal"
      @keydown.esc="closeListEditorModal"
      tabindex="-1"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
      :class="isDarkMode ? 'bg-black bg-opacity-50' : 'bg-black bg-opacity-30'"
    >
      <div
        @click.stop
        :class="[
          'relative w-full max-w-2xl max-h-[90vh] rounded-lg shadow-xl overflow-hidden flex flex-col',
          isDarkMode ? 'bg-dark-800 border border-dark-600' : 'bg-white border border-slate-300'
        ]"
      >
        <!-- Modal Header -->
        <div :class="['flex items-center justify-between p-4 border-b', isDarkMode ? 'border-dark-700' : 'border-slate-200']">
          <h3 :class="['text-lg font-semibold', isDarkMode ? 'text-dark-100' : 'text-slate-900']">
            Edit List Items
          </h3>
          <button
            @click="closeListEditorModal"
            :class="['p-1 rounded transition-colors duration-200', isDarkMode ? 'text-dark-400 hover:bg-dark-700 hover:text-dark-200' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700']"
            title="Close"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        
        <!-- Modal Body - List Editor -->
        <div class="flex-1 overflow-y-auto p-4">
          <div v-if="openListModal" class="space-y-2">
            <div :class="['border rounded-md overflow-hidden', isDarkMode ? 'border-dark-600' : 'border-slate-300']">
              <table class="w-full text-sm">
                <thead :class="[isDarkMode ? 'bg-dark-700' : 'bg-slate-100']">
                  <tr>
                    <th :class="['px-3 py-2 text-left font-medium', isDarkMode ? 'text-dark-200' : 'text-slate-700']">VALUE</th>
                    <th :class="['px-3 py-2 text-left font-medium', isDarkMode ? 'text-dark-200' : 'text-slate-700']">DISPLAY</th>
                    <th :class="['px-3 py-2 text-left font-medium w-16', isDarkMode ? 'text-dark-200' : 'text-slate-700']"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(item, index) in getListItems(openListModal)"
                    :key="index"
                    :class="['transition-colors duration-200', editingListItem && editingListItem.propId === openListModal && editingListItem.index === index ? (isDarkMode ? 'bg-orange-500/30' : 'bg-blue-50') : (isDarkMode ? 'hover:bg-dark-700' : 'hover:bg-slate-50')]"
                  >
                    <td :class="['px-3 py-2', isDarkMode ? 'text-dark-200' : 'text-slate-700']">
                      <input
                        :ref="`modal-value-${openListModal}-${index}`"
                        :value="editingListItem && editingListItem.propId === openListModal && editingListItem.index === index ? editingListItem.item.value : item.value"
                        @input="handleListItemInput(openListModal, index, 'value', $event.target.value)"
                        @focus="startEditListItem(openListModal, index, 'value')"
                        @keydown.enter.prevent="saveListItem(openListModal)"
                        @keydown.tab.prevent="handleTabKey(openListModal, index, 'display')"
                        @keydown.esc="cancelEditListItem()"
                        :readonly="!(editingListItem && editingListItem.propId === openListModal && editingListItem.index === index)"
                        type="text"
                        :class="[
                          'w-full px-2 py-1 text-sm border rounded transition-all',
                          editingListItem && editingListItem.propId === openListModal && editingListItem.index === index
                            ? (isDarkMode ? 'bg-dark-800 border-dark-500 text-dark-100' : 'bg-white border-slate-400 text-slate-900')
                            : (isDarkMode ? 'bg-transparent border-transparent text-dark-200 cursor-text' : 'bg-transparent border-transparent text-slate-700 cursor-text')
                        ]"
                        placeholder="Enter value"
                      />
                    </td>
                    <td :class="['px-3 py-2', isDarkMode ? 'text-dark-200' : 'text-slate-700']">
                      <input
                        :ref="`modal-display-${openListModal}-${index}`"
                        :value="editingListItem && editingListItem.propId === openListModal && editingListItem.index === index ? editingListItem.item.display : item.display"
                        @input="handleListItemInput(openListModal, index, 'display', $event.target.value)"
                        @focus="startEditListItem(openListModal, index, 'display')"
                        @keydown.enter.prevent="saveListItem(openListModal)"
                        @keydown.tab.prevent="handleTabKey(openListModal, index, 'save')"
                        @keydown.esc="cancelEditListItem()"
                        :readonly="!(editingListItem && editingListItem.propId === openListModal && editingListItem.index === index)"
                        type="text"
                        :class="[
                          'w-full px-2 py-1 text-sm border rounded transition-all',
                          editingListItem && editingListItem.propId === openListModal && editingListItem.index === index
                            ? (isDarkMode ? 'bg-dark-800 border-dark-500 text-dark-100' : 'bg-white border-slate-400 text-slate-900')
                            : (isDarkMode ? 'bg-transparent border-transparent text-dark-200 cursor-text' : 'bg-transparent border-transparent text-slate-700 cursor-text')
                        ]"
                        placeholder="Enter display text"
                      />
                    </td>
                    <td :class="['px-3 py-2 text-center']">
                      <button
                        v-if="editingListItem && editingListItem.propId === openListModal && editingListItem.index === index"
                        @click.stop.prevent="saveListItem(openListModal)"
                        :class="['p-2 rounded transition-colors duration-200 border', isDarkMode ? 'text-green-400 border-green-400/50 hover:bg-green-900/30 hover:text-green-300 hover:border-green-300' : 'text-green-600 border-green-600/50 hover:bg-green-50 hover:text-green-700 hover:border-green-700']"
                        title="Save item"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
                        </svg>
                      </button>
                      <button
                        v-else
                        @click.stop.prevent="deleteListItem(openListModal, index)"
                        :class="['p-2 rounded transition-colors duration-200 border', isDarkMode ? 'text-red-400 border-red-400/50 hover:bg-red-900/30 hover:text-red-300 hover:border-red-300' : 'text-red-600 border-red-600/50 hover:bg-red-50 hover:text-red-700 hover:border-red-700']"
                        title="Delete item"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                      </button>
                    </td>
                  </tr>
                  <tr v-if="getListItems(openListModal).length === 0">
                    <td colspan="3" :class="['px-3 py-4 text-center text-sm', isDarkMode ? 'text-dark-400' : 'text-slate-500']">
                      (Add fixed list values)
                    </td>
                  </tr>
                  <!-- Add new row link -->
                  <tr 
                    @click="addNewListItem(openListModal)"
                    :class="['cursor-pointer transition-colors duration-200', isDarkMode ? 'hover:bg-dark-700' : 'hover:bg-slate-50']"
                  >
                    <td colspan="3" :class="['px-3 py-2 text-center text-sm', isDarkMode ? 'text-orange-400 hover:text-orange-300' : 'text-blue-600 hover:text-blue-700']">
                      + Add Item
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Inspector',
  props: {
    isDarkMode: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      activePreview: 'design',
      manifestPath: '',
      selectedExample: '',
      manifest: null,
      manifestBase: '',
      examples: [],
      propValues: {},
      editingListItem: null, // { propId, index, item: { value, display }, field }
      openListModal: null, // propId of the list property being edited in modal
      leftPanelWidth: 320, // Default width for left panel
      isResizingLeftPanel: false,
      leftPanelResizeStart: { x: 0, width: 0 },
      disabledFramesForLeftPanel: [],
      consoleLogs: [],
      designFrameSrc: '',
      runtimeFrameSrc: '',
      collapsedSections: {
        properties: false,
        events: false,
        methods: false,
        scripts: false
      },
      consoleCollapsed: false,
      consoleDocked: 'bottom', // 'bottom' or 'right'
      consoleSize: 300, // Size in pixels
      isResizing: false,
      resizeStart: { x: 0, y: 0, size: 0 },
      resizeThrottle: null,
      disabledFrames: [],
      loadedScripts: new Map(),
      loadedStyles: new Map(),
      triggeredEvents: [],
      triggeredMethods: [],
      propertyChangeTimeout: null,
      pollingInterval: null,
      showControlLogsOnly: false,
      manifestFile: null,
      manifestFileDirectory: null,
      controlFiles: new Map(), // Map of file paths to File objects for loading resources
      designControlElement: null,
      runtimeControlElement: null
    }
  },
  computed: {
    currentScripts() {
      if (!this.manifest) return []
      return this.activePreview === 'design' 
        ? (this.manifest.designtimeScriptFileNames || [])
        : (this.manifest.runtimeScriptFileNames || [])
    },
    currentStyles() {
      if (!this.manifest) return []
      return this.activePreview === 'design'
        ? (this.manifest.designtimeStyleFileNames || [])
        : (this.manifest.runtimeStyleFileNames || [])
    },
    canvasHeight() {
      if (this.consoleCollapsed) {
        return 'height: calc(100vh - 7rem);'
      }
      
      if (this.consoleDocked === 'bottom') {
        return `height: calc(100vh - ${this.consoleSize + 4}rem);`
      } else {
        return 'height: calc(100vh - 4rem);'
      }
    },
    consoleStyle() {
      if (this.consoleCollapsed) {
        return this.consoleDocked === 'bottom' 
          ? 'height: 3rem;' 
          : 'width: 3rem;'
      }
      
      if (this.consoleDocked === 'bottom') {
        return `height: ${this.consoleSize}px;`
      } else {
        return `width: ${this.consoleSize}px;`
      }
    },
    // Add computed property to get all available properties (custom + standard)
    allProperties() {
      if (!this.manifest) return []
      
      const customProperties = this.manifest.properties || []
      const standardProperties = this.getStandardProperties()
      
      // Combine custom and standard properties, avoiding duplicates
      const allProps = [...customProperties]
      const customPropIds = new Set(customProperties.map(p => p.id))
      
      standardProperties.forEach(standardProp => {
        if (!customPropIds.has(standardProp.id)) {
          allProps.push(standardProp)
        }
      })
      
      return allProps
    },
    // Separate standard properties
    standardProperties() {
      if (!this.manifest) return []
      return this.getStandardProperties()
    },
    // Separate custom properties (excluding standard property overrides)
    customProperties() {
      if (!this.manifest) return []
      return this.getCustomProperties()
    },
    
    // Filtered console logs based on filter setting
    filteredConsoleLogs() {
      if (this.showControlLogsOnly) {
        return this.consoleLogs.filter(log => log.source === 'control')
      }
      return this.consoleLogs
    }
  },
  mounted() {
    this.loadExamples()
    this.setupFrameSources()
    this.setupMessageListener()
    this.startPolling()
    this.loadConsoleSettings() // Load saved console settings
    
    // Add ResizeObserver error handler to prevent console errors
    window.addEventListener('error', (event) => {
      if (event.message && event.message.includes('ResizeObserver loop completed with undelivered notifications')) {
        event.preventDefault()
        event.stopPropagation()
        
        // Log a more informative message to help users understand the source
        this.logWarn('ResizeObserver error detected - this is typically caused by the control\'s internal resize handling, not the workbench. The control may need to debounce its resize events or use requestAnimationFrame for DOM updates.')
        
        return false
      }
    })
  },
  beforeDestroy() {
    this.stopPolling()
  },
  watch: {
    '$parent.currentTab'(newTab) {
      if (newTab === 'Inspector') {
        // Refresh controls when switching to Inspector
        this.loadExamples()
      }
    },
    openListModal(newVal) {
      // Handle body scroll when modal opens/closes
      if (newVal) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = ''
      }
    }
  },
  methods: {
    toggleSection(section) {
      this.collapsedSections[section] = !this.collapsedSections[section]
    },
    
    toggleConsole() {
      this.consoleCollapsed = !this.consoleCollapsed
    },
    
    clearConsole() {
      this.consoleLogs = []
    },
    
    async copyConsole() {
      try {
        // Convert console logs to text
        const consoleText = this.consoleLogs.map(log => {
          if (typeof log === 'string') {
            return log
          } else {
            return log.message
          }
        }).join('\n')
        
        // Check if content is too large (clipboard has ~1MB limit)
        const maxLength = 1000000 // 1MB limit
        let textToCopy = consoleText
        
        if (consoleText.length > maxLength) {
          // Take the latest logs if too large
          const recentLogs = this.consoleLogs.slice(-50) // Last 50 logs
          textToCopy = recentLogs.map(log => {
            if (typeof log === 'string') {
              return log
            } else {
              return log.message
            }
          }).join('\n')
          
          // Add a header indicating truncation
          textToCopy = `[Console truncated - showing last 50 logs of ${this.consoleLogs.length} total]\n\n${textToCopy}`
        }
        
        // Copy to clipboard
        await navigator.clipboard.writeText(textToCopy)
        
        // Show feedback
        this.log('Console copied to clipboard' + (consoleText.length > maxLength ? ' (truncated)' : ''))
        
      } catch (error) {
        console.error('Failed to copy console:', error)
        this.log('Failed to copy console to clipboard')
      }
    },
    
    setConsoleDock(position) {
      this.consoleDocked = position
      // Save to localStorage
      localStorage.setItem('k2-console-dock', position)
    },
    
    startResize(event) {
      this.isResizing = true
      this.resizeStart = {
        x: event.clientX,
        y: event.clientY,
        size: this.consoleSize
      }
      
      // Add event listeners that will persist until mouseup
      document.addEventListener('mousemove', this.handleResize, { passive: true })
      document.addEventListener('mouseup', this.stopResize, { passive: true })
      
      // Also listen for mouseleave to handle edge cases
      document.addEventListener('mouseleave', this.stopResize, { passive: true })
      
      // Temporarily disable canvas iframes to prevent interference
      const canvasFrames = document.querySelectorAll('iframe')
      this.disabledFrames = []
      canvasFrames.forEach(frame => {
        if (frame.style.pointerEvents !== 'none') {
          this.disabledFrames.push(frame)
          frame.style.pointerEvents = 'none'
        }
      })
      
      // Prevent text selection during drag
      document.body.style.userSelect = 'none'
      document.body.style.cursor = this.consoleDocked === 'bottom' ? 'row-resize' : 'col-resize'
      
      // Add a class to body to indicate we're resizing
      document.body.classList.add('resizing-console')
      
      event.preventDefault()
      event.stopPropagation()
    },
    
    handleResize(event) {
      if (!this.isResizing) return
      
      // Calculate the delta from the start position
      const deltaX = event.clientX - this.resizeStart.x
      const deltaY = event.clientY - this.resizeStart.y
      
      // Apply the delta to the original size
      const delta = this.consoleDocked === 'bottom' 
        ? -deltaY  // Invert for bottom dock (drag up = increase size)
        : -deltaX  // Invert for right dock (drag left = increase size)
      
      const newSize = Math.max(200, Math.min(600, this.resizeStart.size + delta))
      
      // Update immediately for responsive feel
      this.consoleSize = newSize
    },
    
    stopResize() {
      this.isResizing = false
      
      // Remove all event listeners
      document.removeEventListener('mousemove', this.handleResize)
      document.removeEventListener('mouseup', this.stopResize)
      document.removeEventListener('mouseleave', this.stopResize)
      
      // Re-enable canvas iframes
      if (this.disabledFrames) {
        this.disabledFrames.forEach(frame => {
          frame.style.pointerEvents = 'auto'
        })
        this.disabledFrames = []
      }
      
      // Restore normal cursor and text selection
      document.body.style.userSelect = ''
      document.body.style.cursor = ''
      
      // Remove the resizing class
      document.body.classList.remove('resizing-console')
      
      // Cancel any pending resize animation
      if (this.resizeThrottle) {
        cancelAnimationFrame(this.resizeThrottle)
        this.resizeThrottle = null
      }
      
      // Save to localStorage
      localStorage.setItem('k2-console-size', this.consoleSize.toString())
    },
    
    loadConsoleSettings() {
      const savedDock = localStorage.getItem('k2-console-dock')
      const savedSize = localStorage.getItem('k2-console-size')
      
      if (savedDock) this.consoleDocked = savedDock
      if (savedSize) this.consoleSize = parseInt(savedSize)
    },
    
    log(message, type = 'log', source = 'workbench') {
      let actualType = type
      let actualMessage = message
      
      // Control logs come from frames, workbench logs from main window
      if (source === 'control' || source === 'frame') {
        actualType = 'control'
        actualMessage = `[CONTROL] ${message}`
      } else if (type === 'log') {
        // Workbench logs get no tag, just the message
        actualMessage = message
      }
      
      this.consoleLogs.push({
        timestamp: new Date().toLocaleTimeString(),
        level: actualType,
        message: `[${new Date().toLocaleTimeString()}] ${actualMessage}`,
        color: this.getLevelColor(actualType),
        source: source
      })
      // Keep only last 100 logs
      if (this.consoleLogs.length > 100) {
        this.consoleLogs = this.consoleLogs.slice(-100)
      }
    },
    
    // Add helper methods for different log types
    logWarn(message) {
      this.log(`[WARN] ${message}`, 'warn', 'workbench')
    },
    
    logControl(message) {
      this.log(`[CONTROL] ${message}`, 'control', 'workbench')
    },
    
    logError(message) {
      this.log(`[ERROR] ${message}`, 'error', 'workbench')
    },
    
    logConsole(level, message, args = [], source = 'workbench') {
      const timestamp = new Date().toLocaleTimeString()
      const formattedArgs = args.length > 0 ? ' ' + args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
      ).join(' ') : ''
      
      let actualLevel = level
      let actualMessage = message
      
      // Control logs come from frames
      if (source === 'control' || source === 'frame') {
        actualLevel = 'control'
        actualMessage = `[CONTROL] ${message}`
      } else if (level === 'log') {
        // Workbench logs get no tag
        actualMessage = message
      }
      
      this.consoleLogs.push({
        timestamp,
        level: actualLevel,
        message: `[${timestamp}] ${actualMessage}${formattedArgs}`,
        color: this.getLevelColor(actualLevel),
        source: source
      })
      
      // Keep only last 100 logs
      if (this.consoleLogs.length > 100) {
        this.consoleLogs = this.consoleLogs.slice(-100)
      }
    },
    
    getLevelColor(level) {
      const colors = {
        error: this.isDarkMode ? 'text-red-400' : 'text-red-600',
        warn: this.isDarkMode ? 'text-yellow-400' : 'text-yellow-600', 
        control: this.isDarkMode ? 'text-blue-400' : 'text-blue-600',
        info: this.isDarkMode ? 'text-blue-400' : 'text-blue-600',
        debug: this.isDarkMode ? 'text-purple-400' : 'text-purple-600',
        log: this.isDarkMode ? 'text-gray-200' : 'text-gray-700' // Better contrast for both modes
      }
      return colors[level] || colors.log
    },
    
    setupMessageListener() {
      window.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'k2-log') {
          // Check if this is a system log (like Vite) vs actual control log
          const message = event.data.message
          const isSystemLog = message.includes('[vite]') || message.includes('[DEBUG]') || message.includes('[INFO]')
          
          if (isSystemLog) {
            this.log(message, 'log', 'workbench')
          } else {
            this.log(message, 'log', 'control')
          }
        }
        // Handle enhanced console messages
        if (event.data && event.data.type === 'k2-console') {
          const message = event.data.message
          const isSystemLog = message.includes('[vite]') || message.includes('[DEBUG]') || message.includes('[INFO]')
          
          if (isSystemLog) {
            this.logConsole(event.data.level, event.data.message, event.data.args, 'workbench')
          } else {
            this.logConsole(event.data.level, event.data.message, event.data.args, 'control')
          }
        }
      })
    },
    
    
    async loadExamples() {
      try {
        // Try multiple sources for controls
        const sources = [
          './Controls/index.json',
          './examples/index.json', // Fallback for old folder name
          './Controls/_autolist.json',
          './Controls/_crawler.json'
        ]
        
        for (const source of sources) {
          try {
            const response = await fetch(source, { 
              cache: 'no-cache',
              headers: {
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'
              }
            })
            if (response.ok) {
              const data = await response.json()
              if (Array.isArray(data) && data.length > 0) {
                // Determine which folder to use based on which source was found
                const controlsFolder = source.includes('./Controls/') ? 'Controls' : 'examples'
                this.examples = data.map(name => ({
                  name,
                  path: `./${controlsFolder}/${name}/manifest.json`
                }))
                this.log(`Loaded ${data.length} controls from ${source}`)
                return
              }
            }
          } catch (e) {
            // Continue to next source
          }
        }
        
        // Fallback: try to discover controls dynamically
        this.log('No controls index found, attempting dynamic discovery...')
        const discovered = await this.autoDiscoverControls()
        if (discovered.length > 0) {
          // Determine which folder was used by checking which path worked
          let controlsFolder = 'Controls'
          try {
            // Check if we can access Controls folder
            const testResponse = await fetch('./Controls/', { method: 'HEAD' })
            if (!testResponse.ok) {
              controlsFolder = 'examples'
            }
          } catch {
            controlsFolder = 'examples'
          }
          this.examples = discovered.map(name => ({
            name,
            path: `./${controlsFolder}/${name}/manifest.json`
          }))
          this.log(`Discovered ${discovered.length} controls`)
        } else {
          this.log('No controls found')
        }
      } catch (error) {
        this.log('Error loading controls: ' + error.message)
      }
    },
    
    async autoDiscoverControls() {
      const discovered = []
      // Try Controls folder first, then examples as fallback
      const folders = ['./Controls/', './examples/']
      
      for (const folderPath of folders) {
        try {
          const response = await fetch(folderPath, { method: 'GET' })
          if (response.ok) {
            const text = await response.text()
            const folderMatches = text.match(/href="([^"]+\/)"/g)
            if (folderMatches) {
              for (const match of folderMatches) {
                const folderName = match.replace(/href="([^"]+)\/"/, '$1')
                if (folderName && folderName !== '..' && folderName !== '.' && !discovered.includes(folderName)) {
                  const fullPath = `${folderPath}${folderName}`
                  if (await this.validateControl(fullPath)) {
                    discovered.push(folderName)
                  }
                }
              }
              // If we found controls in this folder, stop trying other folders
              if (discovered.length > 0) {
                break
              }
            }
          }
        } catch (e) {
          // Continue to next folder
        }
      }
      
      if (discovered.length === 0) {
        this.log('Directory listing not available for Controls or examples folders')
      }
      return discovered
    },
    
    async validateControl(basePath) {
      try {
        let manRes = await fetch(`${basePath}/Manifest.json`, { cache: 'no-cache' })
        if (!manRes.ok) {
          manRes = await fetch(`${basePath}/manifest.json`, { cache: 'no-cache' })
        }
        if (!manRes.ok) return false
        
        const man = await manRes.json()
        if (!man.tagName) return false
        
        const jsFiles = man.runtimeScriptFileNames || []
        const cssFiles = man.runtimeStyleFileNames || []
        
        if (jsFiles.length === 0 && cssFiles.length === 0) return false
        
        // Check that at least one file exists
        let hasValidFile = false
        if (jsFiles.length > 0) {
          const jsOk = await this.headExists(`${basePath}/${jsFiles[0]}`)
          if (jsOk) hasValidFile = true
        }
        if (cssFiles.length > 0) {
          const cssOk = await this.headExists(`${basePath}/${cssFiles[0]}`)
          if (cssOk) hasValidFile = true
        }
        
        return hasValidFile
      } catch {
        return false
      }
    },
    
    async headExists(url) {
      try {
        let res = await fetch(url, { method: 'HEAD', cache: 'no-cache' })
        if (res.ok) return true
        res = await fetch(url, { method: 'GET', cache: 'no-cache' })
        return res.ok
      } catch {
        return false
      }
    },
    
    triggerManifestFileSelect() {
      this.$refs.manifestFileInput?.click()
    },
    
    async handleManifestFileSelect(event) {
      const files = event.target.files
      if (!files || files.length === 0) return
      
      // Find manifest.json in the selected files/directory
      let manifestFile = null
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        // Check if this is manifest.json (case-sensitive)
        const fileName = file.name || file.webkitRelativePath?.split('/').pop() || ''
        if (fileName === 'manifest.json') {
          manifestFile = file
          break
        }
      }
      
      if (!manifestFile) {
        this.log('Error: manifest.json not found in selected folder. Please select a folder containing manifest.json.')
        event.target.value = ''
        return
      }
      
      // Validate file extension
      if (!manifestFile.name.toLowerCase().endsWith('.json')) {
        this.log('Error: manifest.json must be a JSON file')
        event.target.value = ''
        return
      }
      
      try {
        this.log('Reading manifest file: ' + manifestFile.name)
        
        // Read file content
        const fileContent = await this.readFileAsText(manifestFile)
        
        // Parse and validate JSON
        let manifestData
        try {
          manifestData = JSON.parse(fileContent)
        } catch (parseError) {
          this.log('Error: Invalid JSON format - ' + parseError.message)
          event.target.value = ''
          return
        }
        
        // Validate manifest structure
        if (!this.validateManifest(manifestData)) {
          this.log('Error: Invalid manifest file - missing required fields (tagName is required)')
          event.target.value = ''
          return
        }
        
        // Store all files in a map for loading resources
        this.controlFiles.clear()
        for (let i = 0; i < files.length; i++) {
          const file = files[i]
          const relativePath = file.webkitRelativePath || file.name
          this.controlFiles.set(relativePath, file)
        }
        
        // Determine base directory from manifest file path
        const manifestRelativePath = manifestFile.webkitRelativePath || manifestFile.name
        const manifestBase = manifestRelativePath.substring(0, manifestRelativePath.lastIndexOf('/')) || '.'
        
        // Clean up old object URL if it exists
        if (this.manifestPath && this.manifestPath.startsWith('blob:')) {
          URL.revokeObjectURL(this.manifestPath)
        }
        
        // Create object URL for the manifest file
        const manifestUrl = URL.createObjectURL(manifestFile)
        
        // Set manifest data
        this.manifest = manifestData
        this.manifestPath = manifestUrl
        this.manifestBase = manifestBase
        this.manifestFile = manifestFile
        
        this.initializeProperties()
        this.setupFrameSources()
        this.log(`Manifest loaded: ${this.manifest.displayName || this.manifest.tagName} (${this.manifest.tagName})`)
        
        // Load control into frames after a short delay
        setTimeout(() => {
          this.loadControlIntoFrames()
        }, 500)
        
      } catch (error) {
        this.log('Error loading manifest file: ' + error.message)
        event.target.value = ''
      }
    },
    
    readFileAsText(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (e) => resolve(e.target.result)
        reader.onerror = (e) => reject(new Error('Failed to read file'))
        reader.readAsText(file)
      })
    },
    
    validateManifest(manifest) {
      if (!manifest || typeof manifest !== 'object') {
        return false
      }
      
      // Check for required fields
      if (!manifest.tagName || typeof manifest.tagName !== 'string') {
        return false
      }
      
      // Display name is recommended but not strictly required
      // Icon is recommended but not strictly required
      
      return true
    },
    
    async loadManifest() {
      if (!this.manifestPath) return
      
      try {
        this.log('Loading manifest: ' + this.manifestPath)
        
        // Try to load the manifest, handling case-insensitive filenames
        let response = await fetch(this.manifestPath, { cache: 'no-cache' })
        if (!response.ok) {
          const pathParts = this.manifestPath.split('/')
          const fileName = pathParts[pathParts.length - 1]
          const dirPath = pathParts.slice(0, -1).join('/')
          
          if (fileName.toLowerCase() === 'manifest.json') {
            const altPath = dirPath + '/Manifest.json'
            response = await fetch(altPath, { cache: 'no-cache' })
          } else if (fileName === 'Manifest.json') {
            const altPath = dirPath + '/manifest.json'
            response = await fetch(altPath, { cache: 'no-cache' })
          }
        }
        
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        
        this.manifest = await response.json()
        this.manifestBase = this.manifestPath.substring(0, this.manifestPath.lastIndexOf('/')) || '.'
        
        this.initializeProperties()
        this.setupFrameSources()
        this.log(`Manifest loaded: ${this.manifest.displayName || this.manifest.tagName} (${this.manifest.tagName})`)
        
        // Notify parent that control state has changed (for saving to cache)
        // Use a small delay to ensure state is fully updated
        this.$nextTick(() => {
          if (this.$parent && typeof this.$parent.saveCurrentPage === 'function') {
            setTimeout(() => {
              this.$parent.saveCurrentPage()
            }, 50)
          }
        })
        
        // Load control into frames after a short delay
        setTimeout(() => {
          this.loadControlIntoFrames()
        }, 500)
      } catch (error) {
        this.log('Error loading manifest: ' + error.message)
      }
    },
    
    loadExample() {
      if (this.selectedExample) {
        this.manifestPath = this.selectedExample
        this.loadManifest()
      }
    },
    
    async refreshExamples() {
      this.log('Refreshing controls list...')
      
      try {
        // First, regenerate the index.json on the server
        const response = await fetch('/api/generate-controls', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        
        if (response.ok) {
          const result = await response.json()
          this.log('Controls index regenerated successfully')
          
          // Now reload the controls from the updated index
          await this.loadExamples()
          this.log('Controls refreshed successfully')
        } else {
          this.log('Failed to regenerate controls index')
          // Fallback to just reloading existing controls
          await this.loadExamples()
        }
      } catch (error) {
        this.log('Error refreshing controls: ' + error.message)
        // Fallback to just reloading existing controls
        await this.loadExamples()
      }
    },
    
    // Add method to get standard properties from supports array
    getStandardProperties() {
      if (!this.manifest || !this.manifest.supports) return []
      
      const standardPropertyDefinitions = {
        'IsVisible': {
          id: 'IsVisible',
          friendlyname: 'Visible',
          type: 'bool',
          initialvalue: 'true',
          description: 'Control visibility'
        },
        'IsEnabled': {
          id: 'IsEnabled', 
          friendlyname: 'Enabled',
          type: 'bool',
          initialvalue: 'true',
          description: 'Control enabled state'
        },
        'IsReadOnly': {
          id: 'IsReadOnly',
          friendlyname: 'Read-Only', 
          type: 'bool',
          initialvalue: 'false',
          description: 'Read-only state'
        },
        'Height': {
          id: 'Height',
          friendlyname: 'Height',
          type: 'text',
          initialvalue: 'auto',
          description: 'Control height (default: auto)'
        },
        'Width': {
          id: 'Width',
          friendlyname: 'Width', 
          type: 'text',
          initialvalue: '100%',
          description: 'Control width (default: 100%)'
        }
      }
      
      return this.manifest.supports
        .filter(support => standardPropertyDefinitions[support])
        .map(support => standardPropertyDefinitions[support])
    },
    
    // Add method to get custom properties (excluding standard property overrides)
    getCustomProperties() {
      if (!this.manifest || !this.manifest.properties) return []
      
      // Get list of standard property IDs
      const standardPropertyIds = this.getStandardProperties().map(prop => prop.id)
      
      // Filter out properties that are standard property overrides
      return this.manifest.properties.filter(prop => 
        !standardPropertyIds.includes(prop.id)
      )
    },
    
    // Update initializeProperties to handle standard properties
    initializeProperties(resetToDefaults = false) {
      if (!this.manifest) return
      
      // Preserve existing values unless explicitly resetting
      if (resetToDefaults) {
        this.propValues = {}
      } else {
        // Preserve existing propValues, only initialize missing ones
        this.propValues = this.propValues || {}
      }
      
      // Initialize custom properties (only if not already set)
      if (this.manifest.properties) {
        this.manifest.properties.forEach(prop => {
          if (!this.propValues.hasOwnProperty(prop.id) || resetToDefaults) {
            this.propValues[prop.id] = prop.initialvalue || ''
          }
        })
      }
      
      // Initialize standard properties (only if not already set)
      const standardProperties = this.getStandardProperties()
      standardProperties.forEach(prop => {
        if (!this.propValues.hasOwnProperty(prop.id) || resetToDefaults) {
          this.propValues[prop.id] = prop.initialvalue || ''
        }
      })
      
      // Apply initial size changes after a short delay to ensure container is ready
      this.$nextTick(() => {
        setTimeout(() => {
          this.applySizeChanges()
        }, 100)
      })
    },
    
    updateProperty(propId, value) {
      this.propValues[propId] = value
      this.logControl(`Property ${propId} changed to: ${value}`)
      
      // Apply immediate changes for Height/Width
      if (propId === 'Height' || propId === 'Width') {
        this.applySizeChanges()
        return
      }
      
      // Debounce property changes to avoid excessive reloading
      this.debouncedPropertyChange()
    },
    
    async reloadControlWithPropertyChanges() {
      if (!this.manifest) return
      
      try {
        this.log('Reloading control with property changes...')
        
        // Reload both frames with new property values
        await this.reloadControlIntoFrames()
        
        this.log('Control reloaded with updated properties')
      } catch (error) {
        this.log('Error reloading control with properties: ' + error.message)
      }
    },
    
    async reloadControlIntoFrames() {
      if (!this.manifest) {
        this.log('No control loaded to refresh')
        return
      }
      
      this.log('Refreshing both design-time and runtime frames...')
      
      try {
        // Reload the manifest first to pick up any new properties/changes
        // This ensures the property panel shows new properties from manifest.json
        if (this.manifestPath) {
          this.log('Reloading manifest to detect new properties...')
          await this.loadManifest()
        }
        
        // Force reload both iframes to completely reset them and clear all cached resources
        // This is more aggressive than just removing/re-adding CSS/JS and ensures
        // all changes (including CSS) are properly reflected
        const designFrame = this.$refs.designFrame
        const runtimeFrame = this.$refs.runtimeFrame
        
        if (designFrame) {
          this.log('Force reloading design frame...')
          const currentSrc = designFrame.src.split('?')[0] // Remove any existing query params
          designFrame.src = ''
          await new Promise(resolve => setTimeout(resolve, 50))
          designFrame.src = currentSrc + '?reload=' + Date.now()
        }
        
        if (runtimeFrame) {
          this.log('Force reloading runtime frame...')
          const currentSrc = runtimeFrame.src.split('?')[0] // Remove any existing query params
          runtimeFrame.src = ''
          await new Promise(resolve => setTimeout(resolve, 50))
          runtimeFrame.src = currentSrc + '?reload=' + Date.now()
        }
        
        this.log('Frames reloaded, control will be re-injected when frames load')
      } catch (error) {
        this.logError(`Error refreshing frames: ${error.message}`)
      }
    },
    
    
    resetProperties() {
      this.initializeProperties(true) // Pass true to reset to defaults
      this.log('Properties reset to defaults')
      // Reload the control with reset values
      this.reloadControlWithPropertyChanges()
    },
    
    triggerEvent(eventId) {
      if (!this.manifest || !this.manifest.tagName) {
        this.log('No control loaded to trigger events on')
        return
      }
      
      this.log(`Triggering event: ${eventId}`)
      
      // Trigger event on both frames
      const designFrame = this.$refs.designFrame
      const runtimeFrame = this.$refs.runtimeFrame
      
      if (designFrame && designFrame.contentWindow) {
        try {
          const control = designFrame.contentWindow.document.querySelector(this.manifest.tagName)
          if (control) {
            const event = new designFrame.contentWindow.CustomEvent(eventId, {
              detail: { 
                source: 'workbench-trigger',
                timestamp: new Date().toISOString()
              }
            })
            control.dispatchEvent(event)
            this.log(`Event ${eventId} dispatched`)
          }
        } catch (e) {
          this.log(`Failed to trigger ${eventId}: ${e.message}`)
        }
      }
      
      if (runtimeFrame && runtimeFrame.contentWindow) {
        try {
          const control = runtimeFrame.contentWindow.document.querySelector(this.manifest.tagName)
          if (control) {
            const event = new runtimeFrame.contentWindow.CustomEvent(eventId, {
              detail: { 
                source: 'workbench-trigger',
                timestamp: new Date().toISOString()
              }
            })
            control.dispatchEvent(event)
            this.log(`[runtime] Event ${eventId} dispatched`)
          }
        } catch (e) {
          this.log(`[runtime] Failed to trigger ${eventId}: ${e.message}`)
        }
      }
      
      // Highlight the event
      this.triggeredEvents.push(eventId)
      setTimeout(() => {
        const index = this.triggeredEvents.indexOf(eventId)
        if (index > -1) {
          this.triggeredEvents.splice(index, 1)
        }
      }, 2000)
    },
    
    triggerMethod(methodId) {
      if (!this.manifest || !this.manifest.tagName) {
        this.log('No control loaded to trigger methods on')
        return
      }
      
      this.log(`Triggering method: ${methodId}`)
      
      // Helper function to execute method on a control (emulates K2 behavior)
      const executeMethod = (control, frameContext, mode) => {
        if (!control) {
          this.log(`[${mode}] Control element not found`)
          return false
        }
        
        // K2 behavior: Try calling the method directly first (this is how K2 does it)
        if (typeof control[methodId] === 'function') {
          try {
            control[methodId]()
            this.log(`[${mode}] Method ${methodId} executed directly (K2-style)`)
            return true
          } catch (e) {
            this.log(`[${mode}] Error calling method directly: ${e.message}`)
          }
        }
        
        // Fallback: Try execute method if available (for controls that implement the dispatcher pattern)
        if (typeof control.execute === 'function') {
          try {
            control.execute({ methodName: methodId })
            this.log(`[${mode}] Method ${methodId} executed via execute() API`)
            return true
          } catch (e) {
            this.log(`[${mode}] Error calling execute(): ${e.message}`)
          }
        }
        
        // Debug: log what methods are available
        const availableMethods = Object.getOwnPropertyNames(control).filter(name => 
          typeof control[name] === 'function' && name !== 'constructor' && !name.startsWith('_')
        )
        this.log(`[${mode}] Method ${methodId} not available. Available methods: ${availableMethods.slice(0, 10).join(', ') || 'none'}${availableMethods.length > 10 ? '...' : ''}`)
        
        return false
      }
      
      // Trigger method on both frames
      const designFrame = this.$refs.designFrame
      const runtimeFrame = this.$refs.runtimeFrame
      
      let designSuccess = false
      let runtimeSuccess = false
      
      if (designFrame && designFrame.contentWindow) {
        try {
          const control = designFrame.contentWindow.document.querySelector(this.manifest.tagName)
          designSuccess = executeMethod(control, 'DESIGN', 'design-time')
        } catch (e) {
          this.log(`Failed to trigger ${methodId} on design-time: ${e.message}`)
        }
      }
      
      if (runtimeFrame && runtimeFrame.contentWindow) {
        try {
          const control = runtimeFrame.contentWindow.document.querySelector(this.manifest.tagName)
          runtimeSuccess = executeMethod(control, 'RUNTIME', 'runtime')
        } catch (e) {
          this.log(`Failed to trigger ${methodId} on runtime: ${e.message}`)
        }
      }
      
      if (!designSuccess && !runtimeSuccess) {
        this.logWarn(`Method ${methodId} could not be executed. The control may not have this method implemented.`)
      }
      
      // Highlight the method
      this.triggeredMethods.push(methodId)
      setTimeout(() => {
        const index = this.triggeredMethods.indexOf(methodId)
        if (index > -1) {
          this.triggeredMethods.splice(index, 1)
        }
      }, 2000)
    },
    
    toggleScriptStyle(fileName, type) {
      if (type === 'script') {
        const currentState = this.loadedScripts.get(fileName)
        this.loadedScripts.set(fileName, currentState === false ? true : false)
        this.log(`${this.loadedScripts.get(fileName) ? 'Enabled' : 'Disabled'} script: ${fileName}`)
      } else {
        const currentState = this.loadedStyles.get(fileName)
        this.loadedStyles.set(fileName, currentState === false ? true : false)
        this.log(`${this.loadedStyles.get(fileName) ? 'Enabled' : 'Disabled'} style: ${fileName}`)
      }
      
      // Reload the control to apply changes
      if (this.manifest) {
        this.log('Reloading control to apply script/style changes...')
        this.reloadControlWithScriptStyleChanges()
      }
    },
    
    async createZip() {
      if (!this.manifest) {
        this.log('No control loaded')
        return
      }
      
      try {
        this.log('Creating ZIP...')
        
        // Extract folder name and control path
        let folderName, controlPath
        if (this.manifestPath.includes('/Controls/')) {
          folderName = this.manifestPath.split('/Controls/')[1].split('/')[0]
          controlPath = null
        } else {
          const pathParts = this.manifestPath.split('/')
          folderName = pathParts[pathParts.length - 2]
          controlPath = this.manifestPath.substring(0, this.manifestPath.lastIndexOf('/'))
        }
        
        this.log(`Creating ZIP for control: ${folderName}`)
        this.log(`Control path: ${controlPath}`)
        
        const requestBody = { 
          folderName: folderName,
          controlPath: controlPath 
        }
        
        this.log(`Request body: ${JSON.stringify(requestBody)}`)
        
        const response = await fetch('/api/zip-control', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
        })
        
        if (response.ok) {
          const result = await response.json()
          this.log(`${result.message}`)
          this.log(`ZIP file created: ${result.zipPath} (${result.size} bytes)`)
          if (result.directoryOpened) {
            this.log(`Opening directory: ${result.directoryOpened}`)
          }
        } else {
          const error = await response.json()
          this.log(`Error creating ZIP: ${error.error}`)
        }
      } catch (e) {
        this.log(`Error creating ZIP: ${e.message}`)
        this.log('Note: Make sure the server is running (npm start)')
      }
    },
    
    setupFrameSources() {
      this.designFrameSrc = './loaders/designer-shell.html'
      this.runtimeFrameSrc = './loaders/runtime-shell.html'
    },
    
    onFrameLoad(mode) {
      this.log(`[${mode.toUpperCase()}] Frame loaded`)
      
      // Add ResizeObserver error handling to the frame context
      const frame = mode === 'design' ? this.$refs.designFrame : this.$refs.runtimeFrame
      if (frame && frame.contentWindow) {
        frame.contentWindow.addEventListener('error', (event) => {
          if (event.message && event.message.includes('ResizeObserver loop completed with undelivered notifications')) {
            event.preventDefault()
            event.stopPropagation()
            
            // Log with frame context
            this.logWarn(`ResizeObserver error in ${mode} frame - this indicates the control needs to fix its resize handling. Consider using debounced resize events or requestAnimationFrame for DOM updates.`)
            
            return false
          }
        })
      }
      
      if (this.manifest) {
        this.loadControlIntoFrame(mode)
      }
    },
    
    async loadControlIntoFrames() {
      if (!this.manifest) return
      
      try {
        this.log('Loading control into preview frames...')
        
        // Load design frame
        if (this.$refs.designFrame && this.$refs.designFrame.contentWindow) {
          await this.loadControlIntoFrame('design')
        }
        
        // Load runtime frame
        if (this.$refs.runtimeFrame && this.$refs.runtimeFrame.contentWindow) {
          await this.loadControlIntoFrame('runtime')
        }
        
        this.log('Control loaded into preview frames')
      } catch (error) {
        this.log('Error loading control: ' + error.message)
      }
    },
    
    async reloadControlWithScriptStyleChanges() {
      if (!this.manifest) return
      
      try {
        this.log('Reloading control with script/style changes...')
        
        // Force reload both iframes to completely reset them
        const designFrame = this.$refs.designFrame
        const runtimeFrame = this.$refs.runtimeFrame
        
        if (designFrame) {
          // Force reload the design frame
          const currentSrc = designFrame.src
          designFrame.src = ''
          setTimeout(() => {
            designFrame.src = currentSrc + (currentSrc.includes('?') ? '&' : '?') + 'reload=' + Date.now()
          }, 100)
        }
        
        if (runtimeFrame) {
          // Force reload the runtime frame
          const currentSrc = runtimeFrame.src
          runtimeFrame.src = ''
          setTimeout(() => {
            runtimeFrame.src = currentSrc + (currentSrc.includes('?') ? '&' : '?') + 'reload=' + Date.now()
          }, 100)
        }
        
        this.log('Frames reloaded, control will be re-injected when frames load')
      } catch (error) {
        this.log('Error reloading control: ' + error.message)
      }
    },
    
    async loadControlIntoFrame(mode) {
      const frame = mode === 'design' ? this.$refs.designFrame : this.$refs.runtimeFrame
      if (!frame || !frame.contentWindow) return
      
      try {
        const frameDoc = frame.contentWindow.document
        const slot = frameDoc.getElementById('slot')
        
        if (slot) {
          // Clear existing content
          slot.innerHTML = ''
          
          if (mode === 'design') {
            this.designControlElement = null
          } else {
            this.runtimeControlElement = null
          }
          
          // Remove any existing stylesheets and scripts that might be from previous loads
          // Do this aggressively to ensure old files are removed
          this.removeExistingStyles(frameDoc)
          this.removeExistingScripts(frameDoc)
          
          // Small delay to ensure DOM cleanup is complete before loading new files
          await new Promise(resolve => setTimeout(resolve, 50))
          
          // Create the control element
          const controlElement = frameDoc.createElement(this.manifest.tagName)
          controlElement.setAttribute('data-k2-control', 'true')
          controlElement.setAttribute('data-design-time', (mode === 'design').toString())
          
          slot.appendChild(controlElement)
          
          if (mode === 'design') {
            this.designControlElement = controlElement
          } else {
            this.runtimeControlElement = controlElement
          }
          
          // Load scripts and styles based on mode and enabled state
          const scripts = mode === 'design' 
            ? (this.manifest.designtimeScriptFileNames || [])
            : (this.manifest.runtimeScriptFileNames || [])
          
          const styles = mode === 'design'
            ? (this.manifest.designtimeStyleFileNames || [])
            : (this.manifest.runtimeStyleFileNames || [])
          
          // Load styles (only enabled ones)
          for (const styleName of styles) {
            if (this.loadedStyles.get(styleName) !== false) {
              await this.injectCSS(frame.contentWindow, this.resolve(styleName))
              this.log(`[${mode.toUpperCase()}] Loading CSS: ${styleName}`)
            } else {
              this.log(`[${mode.toUpperCase()}] Skipping disabled CSS: ${styleName}`)
            }
          }
          
          // Load scripts (only enabled ones)
          for (const scriptName of scripts) {
            if (this.loadedScripts.get(scriptName) !== false) {
              await this.injectJS(frame.contentWindow, this.resolve(scriptName))
              this.log(`[${mode.toUpperCase()}] Loading JS: ${scriptName}`)
            } else {
              this.log(`[${mode.toUpperCase()}] Skipping disabled JS: ${scriptName}`)
            }
          }
          
          // Apply properties AFTER scripts are loaded (dual approach for compatibility)
          setTimeout(() => {
            Object.keys(this.propValues).forEach(propId => {
              const value = this.propValues[propId]
              if (value !== undefined && value !== null) {
                // Handle Width/Height specially - apply as inline styles like K2 does
                if (propId === 'Width' || propId === 'Height') {
                  const currentStyle = controlElement.getAttribute('style') || ''
                  let styleObj = {}
                  
                  // Parse existing style
                  if (currentStyle) {
                    currentStyle.split(';').forEach(decl => {
                      const [prop, val] = decl.split(':').map(s => s.trim())
                      if (prop && val) styleObj[prop] = val
                    })
                  }
                  
                  // Apply Width/Height with proper unit handling
                  if (propId === 'Width') {
                    const widthValue = value === '100%' ? '100%' : (isNaN(value) ? String(value) : `${value}px`)
                    styleObj['width'] = widthValue
                  } else if (propId === 'Height') {
                    const heightValue = value === 'auto' ? 'auto' : (isNaN(value) ? String(value) : `${value}px`)
                    styleObj['height'] = heightValue
                  }
                  
                  // Rebuild style string
                  const newStyle = Object.entries(styleObj)
                    .map(([prop, val]) => `${prop}: ${val}`)
                    .join('; ')
                  
                  controlElement.setAttribute('style', newStyle)
                  this.log(`[${mode.toUpperCase()}] Set inline style: ${newStyle}`)
                }
                
                try {
                  // Approach 1: Set as attribute (for controls with attributeChangedCallback)
                  controlElement.setAttribute(propId.toLowerCase(), value)
                  this.log(`[${mode.toUpperCase()}] Set attribute: ${propId.toLowerCase()}=${value}`)
                } catch (e) {
                  this.log(`[${mode.toUpperCase()}] Failed to set attribute ${propId}: ${e.message}`)
                }
                
                try {
                  // Approach 2: Set as property (for controls expecting direct property access)
                  controlElement[propId] = value
                  this.log(`[${mode.toUpperCase()}] Set property: ${propId}=${value}`)
                } catch (e) {
                  this.log(`[${mode.toUpperCase()}] Failed to set property ${propId}: ${e.message}`)
                }
              }
            })
            
            // Handle List properties - call listItemsChangedCallback for data-bound controls
            // Use a slightly longer delay to ensure control is fully initialized
            setTimeout(() => {
              this.handleListProperties(controlElement, mode)
            }, 150)

            // Ensure any existing size overrides are applied without reloads
            this.applySizeChanges()
          }, 100) // Small delay to ensure control is ready
          
          // Log warnings to console only (no visual watermarks)
          const enabledScripts = scripts.filter(script => this.loadedScripts.get(script) !== false)
          if (scripts.length > 0 && enabledScripts.length === 0) {
            this.log(`[${mode.toUpperCase()}] WARNING: No scripts enabled - control may not function properly`)
          }
          
          const enabledStyles = styles.filter(style => this.loadedStyles.get(style) !== false)
          if (styles.length > 0 && enabledStyles.length === 0) {
            this.log(`[${mode.toUpperCase()}] WARNING: No styles enabled - control may look unstyled`)
          }
          
          // Set up event listeners with longer delay to ensure scripts are loaded
          setTimeout(() => {
            this.setupEventListeners(mode)
          }, 500)
        }
      } catch (error) {
        this.log(`Error loading control into ${mode} frame: ${error.message}`)
      }
    },
    
    removeExistingStyles(frameDoc) {
      // Remove any existing stylesheets that were injected by the workbench
      // Be aggressive - remove all stylesheets that could be from our control
      const existingLinks = frameDoc.querySelectorAll('link[rel="stylesheet"]')
      const stylesToLoad = [
        ...(this.manifest?.designtimeStyleFileNames || []),
        ...(this.manifest?.runtimeStyleFileNames || [])
      ]
      
      existingLinks.forEach(link => {
        const href = link.href
        // Remove if it matches our control files by:
        // 1. URL contains manifestBase or Controls/
        // 2. Filename matches any of the styles we're about to load
        // 3. URL contains any of the style filenames (more aggressive matching)
        const shouldRemove = 
          href.includes(this.manifestBase) || 
          href.includes('Controls/') ||
          stylesToLoad.some(styleName => {
            // Extract filename from URL (remove query params and path)
            const urlFileName = href.split('/').pop().split('?')[0]
            const styleFileName = styleName.split('/').pop()
            // Match by exact filename or if URL contains the filename
            return urlFileName === styleFileName || href.includes(styleFileName)
          })
        
        if (shouldRemove) {
          this.log(`Removing existing stylesheet: ${href}`)
          // Disable the stylesheet before removing to ensure it's fully unloaded
          link.disabled = true
          link.remove()
        }
      })
      
      // Also remove any <style> elements that might have been injected
      // (though we typically don't inject these, some controls might)
      const styleElements = frameDoc.querySelectorAll('style[data-k2-control]')
      styleElements.forEach(style => {
        this.log(`Removing existing style element`)
        style.remove()
      })
    },
    
    removeExistingScripts(frameDoc) {
      // Remove any existing scripts that were injected by the workbench
      // Be aggressive - remove all scripts that could be from our control
      const existingScripts = frameDoc.querySelectorAll('script[src]')
      const scriptsToLoad = [
        ...(this.manifest?.designtimeScriptFileNames || []),
        ...(this.manifest?.runtimeScriptFileNames || [])
      ]
      
      existingScripts.forEach(script => {
        const src = script.src
        // Remove if it matches our control files by:
        // 1. URL contains manifestBase or Controls/
        // 2. Filename matches any of the scripts we're about to load
        // 3. URL contains any of the script filenames (more aggressive matching)
        const shouldRemove = 
          src.includes(this.manifestBase) || 
          src.includes('Controls/') ||
          scriptsToLoad.some(scriptName => {
            // Extract filename from URL (remove query params and path)
            const urlFileName = src.split('/').pop().split('?')[0]
            const scriptFileName = scriptName.split('/').pop()
            // Match by exact filename or if URL contains the filename
            return urlFileName === scriptFileName || src.includes(scriptFileName)
          })
        
        if (shouldRemove) {
          this.log(`Removing existing script: ${src}`)
          script.remove()
        }
      })
    },
    
    resolve(rel) {
      if (/^https?:\/\//i.test(rel)) return rel
      
      // If loading from local files (controlFiles map), use object URLs
      if (this.controlFiles && this.controlFiles.size > 0) {
        // Try to find the file in the controlFiles map
        // First try exact match
        let file = this.controlFiles.get(rel)
        
        // If not found, try with manifestBase prefix
        if (!file && this.manifestBase !== '.') {
          const pathWithBase = `${this.manifestBase}/${rel}`.replace(/\/+/g, '/')
          file = this.controlFiles.get(pathWithBase)
        }
        
        // If still not found, try searching for files that end with the relative path
        if (!file) {
          for (const [path, fileObj] of this.controlFiles.entries()) {
            if (path.endsWith('/' + rel) || path === rel) {
              file = fileObj
              break
            }
          }
        }
        
        if (file) {
          // Create a new object URL each time to ensure fresh content
          // Note: For local files loaded from file input, the file object is static,
          // so changes won't be reflected until the file is re-selected
          const objectUrl = URL.createObjectURL(file)
          this.log(`Resolving local file: ${rel} -> ${objectUrl}`)
          return objectUrl
        }
      }
      
      // Fallback to HTTP URL resolution with cache-busting
      const baseUrl = window.location.origin + window.location.pathname.replace(/\/[^\/]*$/, '/')
      const resolved = `${this.manifestBase}/${rel}`.replace(/\/+/g, '/')
      const url = new URL(resolved, baseUrl)
      
      // Add cache-busting query parameter for HTTP-loaded files
      // Use performance.now() for higher precision and ensure unique timestamps
      // This ensures refreshed files are actually reloaded from the server
      const cacheBuster = Date.now().toString() + '_' + performance.now().toString().replace('.', '')
      url.searchParams.set('_t', cacheBuster)
      
      const absoluteUrl = url.href
      this.log(`Resolving: ${rel} -> ${absoluteUrl} (manifestBase: ${this.manifestBase})`)
      return absoluteUrl
    },
    
    async injectCSS(w, url) {
      return new Promise((res, rej) => {
        this.log(`Loading CSS: ${url}`)
        const link = w.document.createElement('link')
        link.rel = 'stylesheet'
        link.href = url
        // Cache-busting is already handled in resolve() method via query parameter
        link.onload = () => {
          this.log(`CSS loaded successfully: ${url}`)
          res()
        }
        link.onerror = (e) => {
          this.log(`CSS load failed: ${url} - ${e.message || 'Unknown error'}`)
          rej(new Error('CSS load failed ' + url))
        }
        w.document.head.appendChild(link)
      })
    },
    
    async injectJS(w, url) {
      return new Promise((res, rej) => {
        this.log(`Loading JS: ${url}`)
        const s = w.document.createElement('script')
        s.src = url
        // Cache-busting is already handled in resolve() method via query parameter
        s.onload = () => {
          this.log(`JS loaded successfully: ${url}`)
          res()
        }
        s.onerror = (e) => {
          this.log(`JS load failed: ${url} - ${e.message || 'Unknown error'}`)
          // Don't reject - let the control load even if some scripts fail
          this.log(`Continuing without script: ${url}`)
          res() // Resolve instead of reject to continue loading
        }
        w.document.head.appendChild(s)
      })
    },
    
    setupEventListeners(mode) {
      if (!this.manifest || !this.manifest.tagName) return
      
      const frame = mode === 'design' ? this.$refs.designFrame : this.$refs.runtimeFrame
      if (!frame || !frame.contentWindow) return
      
      const eventIds = (this.manifest.events || []).map(e => e.id)
      if (eventIds.length === 0) return
      
      this.log(`Setting up event listeners for ${mode}: ${eventIds.join(', ')}`)
      
      try {
        const control = frame.contentWindow.document.querySelector(this.manifest.tagName)
        if (control) {
          eventIds.forEach(eventId => {
            control.addEventListener(eventId, (e) => {
              this.log(`[${mode.toUpperCase()}] Event received: ${eventId}${e.detail ? ` (${JSON.stringify(e.detail)})` : ''}`)
              this.triggeredEvents.push(eventId)
              setTimeout(() => {
                const index = this.triggeredEvents.indexOf(eventId)
                if (index > -1) {
                  this.triggeredEvents.splice(index, 1)
                }
              }, 2000)
            })
          })
          this.log(`[${mode.toUpperCase()}] Event listeners attached to control`)
        } else {
          this.log(`[${mode.toUpperCase()}] Control not found for event listeners`)
        }
      } catch (e) {
        this.log(`[${mode.toUpperCase()}] Error setting up event listeners: ${e.message}`)
      }
    },
    
    async handleNewControlLoaded(controlData) {
      // Refresh controls list
      await this.loadExamples()
      
      // Auto-select the new control
      const newControlPath = `./Controls/${controlData.controlName}/manifest.json`
      this.selectedExample = newControlPath
      this.manifestPath = newControlPath
      await this.loadManifest()
      
      this.log(`Auto-selected new control: ${controlData.displayName}`)
    },
    
    async loadNewControl(manifestPath) {
      this.manifestPath = manifestPath
      this.selectedExample = manifestPath
      await this.loadManifest()
    },
    
    // Add polling mechanism as fallback
    startPolling() {
      this.pollingInterval = setInterval(async () => {
        if (this.$parent.currentTab === 'Inspector') {
          await this.checkForNewControls()
        }
      }, 5000) // Poll every 5 seconds when Inspector is active
    },
    
    stopPolling() {
      if (this.pollingInterval) {
        clearInterval(this.pollingInterval)
        this.pollingInterval = null
      }
    },
    
    async checkForNewControls() {
      try {
        // Try Controls folder first, then examples as fallback
        let response = await fetch('./Controls/index.json', { 
          cache: 'no-cache',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        })
        if (!response.ok) {
          response = await fetch('./examples/index.json', { 
            cache: 'no-cache',
            headers: {
              'Cache-Control': 'no-cache',
              'Pragma': 'no-cache'
            }
          })
        }
        if (response.ok) {
          const newControls = await response.json()
          const currentControlNames = this.examples.map(e => e.name)
          const newControlNames = newControls.filter(name => !currentControlNames.includes(name))
          
          if (newControlNames.length > 0) {
            this.log(`Found ${newControlNames.length} new controls, refreshing list...`)
            await this.loadExamples()
          }
        }
      } catch (error) {
        // Silently handle polling errors
      }
    },
    
    // Add method to handle boolean property changes
    updateBooleanProperty(propId, checked) {
      this.propValues[propId] = checked ? 'true' : 'false'
      this.logControl(`Property ${propId} changed to: ${this.propValues[propId]}`)
      
      // Apply immediate changes for Height/Width
      if (propId === 'Height' || propId === 'Width') {
        this.applySizeChanges()
      }
      
      // Debounce property changes to avoid excessive reloading
      this.debouncedPropertyChange()
    },
    
    // Add method to determine input type
    getPropertyInputType(prop) {
      if (prop.type === 'bool') {
        return 'checkbox'
      }
      // Handle both 'string' (standard) and 'text' (legacy) for backward compatibility
      if ((prop.type === 'string' || prop.type === 'text') && prop.inputlength > 255) {
        return 'textarea'
      }
      // Return 'text' for HTML input type (this is correct - it's the HTML input type, not the property type)
      return 'text'
    },
    
    // Add method to apply Height/Width changes to control container
    applySizeChanges() {
      const height = this.propValues['Height'] ?? 'auto'
      const width = this.propValues['Width'] ?? '100%'
      const targets = [this.designControlElement, this.runtimeControlElement].filter(Boolean)
      
      if (targets.length === 0) return
      
      targets.forEach(target => {
        this.applyDimensionsToControl(target, width, height)
      })
      
      this.logControl(`Applied size changes: Height=${height}, Width=${width}`)
    },
    
    applyDimensionsToControl(controlElement, width, height) {
      if (!controlElement) return
      
      const widthStyle = this.normalizeDimension(width, 'width')
      const heightStyle = this.normalizeDimension(height, 'height')
      
      if (widthStyle !== null) {
        controlElement.style.width = widthStyle
      }
      if (heightStyle !== null) {
        controlElement.style.height = heightStyle
      }
      
      this.setDimensionAttribute(controlElement, 'width', width)
      this.setDimensionAttribute(controlElement, 'height', height)
      
      this.invokeControlSetter(controlElement, 'Width', width)
      this.invokeControlSetter(controlElement, 'Height', height)
    },
    
    normalizeDimension(value, axis) {
      if (value === undefined || value === null) return ''
      const trimmed = String(value).trim()
      if (trimmed === '') return ''
      if (trimmed.toLowerCase() === 'auto') return axis === 'height' ? 'auto' : ''
      if (trimmed.endsWith('%')) return trimmed
      return isNaN(trimmed) ? trimmed : `${trimmed}px`
    },
    
    setDimensionAttribute(controlElement, attr, value) {
      if (value === undefined || value === null || value === '') {
        controlElement.removeAttribute(attr)
        return
      }
      controlElement.setAttribute(attr, value)
    },
    
    invokeControlSetter(controlElement, propName, value) {
      if (controlElement && typeof controlElement[propName] !== 'undefined') {
        try {
          controlElement[propName] = value
        } catch (err) {
          this.log(`[INSPECTOR] Failed to set ${propName}: ${err.message}`)
        }
      }
    },
    
    // Add debounced method to handle property changes
    debouncedPropertyChange() {
      clearTimeout(this.propertyChangeTimeout)
      this.propertyChangeTimeout = setTimeout(() => {
        this.applySizeChanges()
        this.reloadControlWithPropertyChanges()
      }, 300)
    },
    
    // Handle List properties - call listItemsChangedCallback for data-bound controls
    handleListProperties(controlElement, mode) {
      if (!this.manifest || !this.manifest.properties) return
      
      // Find all List properties (type "listdata" or "list")
      const listProperties = this.manifest.properties.filter(prop => 
        prop.type === 'listdata' || prop.type === 'list'
      )
      
      if (listProperties.length === 0) return
      
      // Process each List property
      listProperties.forEach(prop => {
        const propId = prop.id
        const value = this.propValues[propId]
        
        if (!value || typeof value !== 'string') return
        
        try {
          // Parse the JSON string value
          const parsedItems = JSON.parse(value)
          
          if (Array.isArray(parsedItems) && parsedItems.length > 0) {
            // Call listItemsChangedCallback if the control implements it
            if (typeof controlElement.listItemsChangedCallback === 'function') {
              controlElement.listItemsChangedCallback({
                NewItems: parsedItems
              })
              this.log(`[${mode.toUpperCase()}] Called listItemsChangedCallback for ${propId} with ${parsedItems.length} items`)
            } else {
              this.log(`[${mode.toUpperCase()}] Control does not implement listItemsChangedCallback for ${propId}`)
            }
          }
        } catch (e) {
          this.log(`[${mode.toUpperCase()}] Failed to parse List property ${propId}: ${e.message}`)
        }
      })
    },
    
    // Toggle control logs filter
    toggleControlLogsFilter() {
      this.showControlLogsOnly = !this.showControlLogsOnly
      this.log(`Console filter ${this.showControlLogsOnly ? 'enabled' : 'disabled'} - ${this.showControlLogsOnly ? 'showing only control logs' : 'showing all logs'}`)
    },
    
    // List property editor methods
    isListProperty(prop) {
      return prop.type === 'listdata' || prop.type === 'list'
    },
    
    // Dropdown property methods
    isDropdownProperty(prop) {
      return prop.type === 'drop'
    },
    
    getDropdownItems(prop) {
      // First check if dropitems array exists (standard format)
      if (prop.dropitems && Array.isArray(prop.dropitems)) {
        return prop.dropitems
      }
      
      // Fallback: parse initialvalue as comma-separated values
      if (prop.initialvalue && typeof prop.initialvalue === 'string') {
        const values = prop.initialvalue.split(',').map(v => v.trim()).filter(v => v.length > 0)
        if (values.length > 0) {
          // Return as array of {value, text} objects
          return values.map(v => ({ value: v, text: v }))
        }
      }
      
      // Return empty array if no valid options found
      return []
    },
    
    getListItems(propId) {
      const value = this.propValues[propId]
      if (!value || typeof value !== 'string') return []
      
      try {
        const parsed = JSON.parse(value)
        return Array.isArray(parsed) ? parsed : []
      } catch (e) {
        return []
      }
    },
    
    addNewListItem(propId) {
      const items = this.getListItems(propId)
      const newItem = { value: '', display: '' }
      items.push(newItem)
      this.updateListProperty(propId, items)
      // Start editing the new item - focus on value field
      this.startEditListItem(propId, items.length - 1, 'value')
    },
    
    handleListItemInput(propId, index, field, value) {
      if (!this.editingListItem || this.editingListItem.propId !== propId || this.editingListItem.index !== index) {
        // Start editing if not already editing
        this.startEditListItem(propId, index, field)
      }
      // Update the editing item
      if (this.editingListItem) {
        this.editingListItem.item[field] = value
      }
    },
    startEditListItem(propId, index, field = 'value') {
      const items = this.getListItems(propId)
      if (index >= 0 && index < items.length) {
        // If we're already editing the same item, preserve the existing edits and just switch fields
        if (this.editingListItem && this.editingListItem.propId === propId && this.editingListItem.index === index) {
          // Same item, just switching fields - preserve existing edits
          this.editingListItem.field = field
        } else {
          // Different item or starting fresh
          // If we were editing a different item, save it first before switching
          if (this.editingListItem && this.editingListItem.propId === propId && this.editingListItem.index !== index) {
            // Save the previous item before switching to new one
            this.saveListItem(propId)
          }
          // Create new copy for the new item
          this.editingListItem = {
            propId,
            index,
            item: { ...items[index] }, // Create a copy for editing
            field: field // Track which field to focus
          }
        }
        // Focus using unique ref (check if modal is open)
        this.$nextTick(() => {
          const refPrefix = this.openListModal ? 'modal-' : ''
          const refKey = `${refPrefix}${field}-${propId}-${index}`
          const input = this.$refs[refKey]
          if (input) {
            const inputEl = Array.isArray(input) ? input[0] : input
            if (inputEl) {
              inputEl.focus()
              inputEl.select()
            }
          }
        })
      }
    },
    handleTabKey(propId, index, target) {
      if (target === 'display') {
        // Tab from value to display
        this.$nextTick(() => {
          const refPrefix = this.openListModal ? 'modal-' : ''
          const refKey = `${refPrefix}display-${propId}-${index}`
          const input = this.$refs[refKey]
          if (input) {
            const inputEl = Array.isArray(input) ? input[0] : input
            if (inputEl) {
              inputEl.focus()
              inputEl.select()
            }
          }
        })
      } else if (target === 'save') {
        // Tab from display - save the item
        this.saveListItem(propId)
      }
    },
    getListPreview(propId) {
      const items = this.getListItems(propId)
      if (items.length === 0) return ''
      const preview = items.slice(0, 3).map(item => item.display || item.value || 'Item').join('; ')
      return items.length > 3 ? `${preview}...` : preview
    },
    openListEditorModal(propId) {
      // Save any current edits before opening modal
      if (this.editingListItem && this.editingListItem.propId === propId) {
        this.saveListItem(propId)
      }
      this.openListModal = propId
      this.editingListItem = null
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
      // Focus the modal container for Esc key handling
      this.$nextTick(() => {
        const modal = this.$el.querySelector('.fixed.inset-0.z-50')
        if (modal) modal.focus()
      })
    },
    closeListEditorModal() {
      // Save any current edits before closing
      if (this.editingListItem && this.openListModal) {
        this.saveListItem(this.openListModal)
      }
      this.openListModal = null
      this.editingListItem = null
      // Restore body scroll
      document.body.style.overflow = ''
    },
    
    saveListItem(propId) {
      if (!this.editingListItem || this.editingListItem.propId !== propId) return
      
      const items = this.getListItems(propId)
      const { index, item } = this.editingListItem
      
      if (index >= 0 && index < items.length) {
        items[index] = { ...item } // Update the item
        this.updateListProperty(propId, items)
        this.log(`Saved item at index ${index} for property ${propId}`)
      }
      
      this.editingListItem = null
    },
    
    deleteListItem(propId, index) {
      const items = this.getListItems(propId)
      
      if (index >= 0 && index < items.length) {
        items.splice(index, 1)
        this.updateListProperty(propId, items)
        this.log(`Deleted item at index ${index} for property ${propId}`)
      }
      
      // Clear editing if we deleted the item being edited
      if (this.editingListItem && this.editingListItem.propId === propId && this.editingListItem.index === index) {
        this.editingListItem = null
      }
    },
    
    cancelEditListItem() {
      this.editingListItem = null
    },
    startResize(e) {
      // Check if this is the left panel resize handle (inside leftPanel ref)
      if (this.$refs.leftPanel && this.$refs.leftPanel.contains(e.target) && e.target.classList.contains('cursor-col-resize')) {
        this.isResizingLeftPanel = true
        this.leftPanelResizeStart = {
          x: e.clientX,
          width: this.leftPanelWidth
        }
        
        // Add event listeners with passive option for performance
        document.addEventListener('mousemove', this.handleLeftPanelResize, { passive: true })
        document.addEventListener('mouseup', this.stopLeftPanelResize, { passive: true })
        document.addEventListener('mouseleave', this.stopLeftPanelResize, { passive: true })
        
        // Temporarily disable canvas iframes to prevent interference
        const canvasFrames = document.querySelectorAll('iframe')
        this.disabledFramesForLeftPanel = []
        canvasFrames.forEach(frame => {
          if (frame.style.pointerEvents !== 'none') {
            this.disabledFramesForLeftPanel.push(frame)
            frame.style.pointerEvents = 'none'
          }
        })
        
        // Prevent text selection during drag
        document.body.style.userSelect = 'none'
        document.body.style.cursor = 'col-resize'
        
        // Add a class to body to indicate we're resizing
        document.body.classList.add('resizing-left-panel')
        
        e.preventDefault()
        e.stopPropagation()
      } else if (e.target.classList.contains('console-resize-handle')) {
        // Existing console resize logic
        this.isResizing = true
        this.resizeStart = {
          x: e.clientX,
          y: e.clientY,
          size: this.consoleSize
        }
        document.addEventListener('mousemove', this.handleResize, { passive: true })
        document.addEventListener('mouseup', this.stopResize, { passive: true })
        document.addEventListener('mouseleave', this.stopResize, { passive: true })
        
        // Temporarily disable canvas iframes to prevent interference
        const canvasFrames = document.querySelectorAll('iframe')
        this.disabledFrames = []
        canvasFrames.forEach(frame => {
          if (frame.style.pointerEvents !== 'none') {
            this.disabledFrames.push(frame)
            frame.style.pointerEvents = 'none'
          }
        })
        
        // Prevent text selection during drag
        document.body.style.userSelect = 'none'
        document.body.style.cursor = this.consoleDocked === 'bottom' ? 'row-resize' : 'col-resize'
        
        // Add a class to body to indicate we're resizing
        document.body.classList.add('resizing-console')
        
        e.preventDefault()
        e.stopPropagation()
      }
    },
    handleLeftPanelResize(e) {
      if (!this.isResizingLeftPanel) return
      
      // Calculate the delta from the start position (more reliable than absolute position)
      const deltaX = e.clientX - this.leftPanelResizeStart.x
      
      // Apply the delta to the original width (drag right = increase, drag left = decrease)
      const containerWidth = this.$el.clientWidth
      const minWidth = 250
      const maxWidth = containerWidth * 0.7
      const newWidth = Math.max(minWidth, Math.min(maxWidth, this.leftPanelResizeStart.width + deltaX))
      
      // Update immediately for responsive feel
      this.leftPanelWidth = newWidth
    },
    stopLeftPanelResize() {
      this.isResizingLeftPanel = false
      
      // Remove all event listeners
      document.removeEventListener('mousemove', this.handleLeftPanelResize)
      document.removeEventListener('mouseup', this.stopLeftPanelResize)
      document.removeEventListener('mouseleave', this.stopLeftPanelResize)
      
      // Re-enable canvas iframes
      if (this.disabledFramesForLeftPanel) {
        this.disabledFramesForLeftPanel.forEach(frame => {
          frame.style.pointerEvents = 'auto'
        })
        this.disabledFramesForLeftPanel = []
      }
      
      // Restore text selection and cursor
      document.body.style.userSelect = ''
      document.body.style.cursor = ''
      
      // Remove body class
      document.body.classList.remove('resizing-left-panel')
    },
    
    updateListProperty(propId, items) {
      // Update the property value as JSON string
      this.propValues[propId] = JSON.stringify(items)
      this.updateProperty(propId, this.propValues[propId])
    }
  }
}
</script>

<style scoped>
/* Prevent interference during console resize */
:global(body.resizing-console) * {
  pointer-events: none !important;
}

:global(body.resizing-console) .console-resize-handle {
  pointer-events: auto !important;
}

/* Prevent interference during left panel resize */
:global(body.resizing-left-panel) * {
  pointer-events: none !important;
}

:global(body.resizing-left-panel) .cursor-col-resize {
  pointer-events: auto !important;
}

/* Ensure resize handles are always interactive */
.console-resize-handle {
  pointer-events: auto;
  z-index: 1000;
}

/* Override Flowbite checkbox/radio styling with !important */
[type='checkbox']:checked, 
[type='radio']:checked {
  border-color: transparent !important;
  background-color: currentColor !important;
  background-size: 0.55em 0.55em;
  background-position: center;
  background-repeat: no-repeat;
}

/* Dark mode checkboxes - orange background */
.dark [type='checkbox']:checked {
  background-color: rgb(249 115 22) !important; /* orange-500 */
  border-color: rgb(249 115 22) !important;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 16 12'%3E%3Cpath stroke='white' stroke-linecap='round' stroke-linejoin='round' stroke-width='3' d='M1 5.917 5.724 10.5 15 1.5'/%3E%3C/svg%3E") !important;
}

/* Light mode checkboxes - blue background */
[type='checkbox']:checked:not(.dark *) {
  background-color: rgb(59 130 246) !important; /* blue-500 */
  border-color: rgb(59 130 246) !important;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 16 12'%3E%3Cpath stroke='white' stroke-linecap='round' stroke-linejoin='round' stroke-width='3' d='M1 5.917 5.724 10.5 15 1.5'/%3E%3C/svg%3E") !important;
}

/* Dark mode radio buttons - orange background */
.dark [type='radio']:checked {
  background-color: rgb(249 115 22) !important; /* orange-500 */
  border-color: rgb(249 115 22) !important;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 16 12'%3E%3Ccircle cx='8' cy='8' r='3' fill='white'/%3E%3C/svg%3E") !important;
}

/* Light mode radio buttons - blue background */
[type='radio']:checked:not(.dark *) {
  background-color: rgb(59 130 246) !important; /* blue-500 */
  border-color: rgb(59 130 246) !important;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 16 12'%3E%3Ccircle cx='8' cy='8' r='3' fill='white'/%3E%3C/svg%3E") !important;
}
</style>