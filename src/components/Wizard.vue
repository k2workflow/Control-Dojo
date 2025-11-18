<template>
  <div :class="['flex-1 flex flex-col transition-colors duration-200', isDarkMode ? 'bg-dark-900' : 'bg-gray-50']">
    <!-- Scrollable Content Container -->
    <div class="flex-1 overflow-y-auto">
      <div class="max-w-4xl mx-auto p-6 pb-20">
        <!-- Header -->
        <div class="text-center mb-8">
          <h1 :class="['text-3xl font-bold mb-2 transition-colors duration-200', isDarkMode ? 'text-white' : 'text-gray-900']">Control Starter Wizard</h1>
          <p :class="['transition-colors duration-200', isDarkMode ? 'text-gray-400' : 'text-gray-600']">Generate a starter template for a new K2 custom control with basic structure and scaffolding</p>
        </div>

        <!-- Progress Bar - Simplified Stepper -->
        <div class="mb-8 flex justify-center">
          <ol :class="['flex items-center text-sm font-medium', isDarkMode ? 'text-gray-400' : 'text-gray-500']">
            <li 
              v-for="(step, index) in steps" 
              :key="index"
              :class="[
                'flex items-center',
                index < steps.length - 1 ? 'mr-4' : ''
              ]"
            >
              <div 
                :class="[
                  'flex items-center justify-center w-10 h-10 rounded-full lg:h-12 lg:w-12 shrink-0 relative z-10',
                  currentStep > index + 1 
                    ? (isDarkMode ? 'bg-green-600 text-white' : 'bg-green-100 text-green-500') 
                    : currentStep === index + 1 
                      ? (isDarkMode ? 'bg-orange-500 text-white' : 'bg-blue-100 text-blue-500')
                      : (isDarkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500')
                ]"
              >
                <svg v-if="currentStep > index + 1" class="w-3.5 h-3.5 lg:w-4 lg:h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                </svg>
                <span v-else class="text-sm font-medium">{{ index + 1 }}</span>
              </div>
              <!-- Connecting line after each step (except the last) -->
              <div 
                v-if="index < steps.length - 1"
                :class="[
                  'w-16 h-1 mx-2',
                  currentStep > index + 1
                    ? (isDarkMode ? 'bg-green-600' : 'bg-green-500')
                    : (isDarkMode ? 'bg-gray-700' : 'bg-gray-300')
                ]"
              ></div>
            </li>
          </ol>
        </div>

      <!-- Step Content -->
      <div :class="['bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 p-6 transition-colors duration-200 overflow-y-auto', isDarkMode ? 'bg-dark-800 border-dark-700' : 'bg-white border-gray-200']" style="max-height: calc(100vh - 20rem);">
        <!-- Step 1: Basic Information -->
        <div v-if="currentStep === 1" class="space-y-6">
          <h2 :class="['text-xl font-semibold transition-colors duration-200', isDarkMode ? 'text-white' : 'text-gray-900']">Basic Control Information</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label :class="['block text-sm font-medium mb-2 transition-colors duration-200', isDarkMode ? 'text-gray-300' : 'text-gray-700']">
                Display Name *
              </label>
              <input
                v-model="controlData.displayName"
                type="text"
                placeholder="e.g., My Custom Control"
                :class="[
                  'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500',
                  validationErrors.displayName ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                ]"
                @blur="validateField('displayName')"
                @input="generateTagNameFromDisplayName"
              />
              <p v-if="validationErrors.displayName" class="text-red-500 text-sm mt-1">{{ validationErrors.displayName }}</p>
            </div>
            <div>
              <label :class="['block text-sm font-medium mb-2 transition-colors duration-200', isDarkMode ? 'text-gray-300' : 'text-gray-700']">
                Tag Name *
                <span :class="['text-xs font-normal ml-1', isDarkMode ? 'text-gray-400' : 'text-gray-500']">(Auto-generated, editable)</span>
              </label>
              <input
                v-model="controlData.tagName"
                type="text"
                placeholder="e.g., my-custom-control"
                :class="[
                  'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500',
                  validationErrors.tagName ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                ]"
                @blur="validateField('tagName')"
                @input="controlData.tagNameManuallyEdited = true"
              />
              <p v-if="validationErrors.tagName" class="text-red-500 text-sm mt-1">{{ validationErrors.tagName }}</p>
              <p v-if="!validationErrors.tagName && controlData.tagName" :class="['text-xs mt-1', isDarkMode ? 'text-gray-400' : 'text-gray-500']">
                Custom HTML elements must contain a hyphen (e.g., k2-my-control)
              </p>
            </div>
            <div>
              <label :class="['block text-sm font-medium mb-2 transition-colors duration-200', isDarkMode ? 'text-gray-300' : 'text-gray-700']">
                Icon File
              </label>
              <div class="space-y-4">
                <!-- Use Default Icon Option (moved to top) -->
                <div class="flex items-center space-x-3">
                  <input
                    v-model="controlData.useDefaultIcon"
                    type="checkbox"
                    :class="[
                      'w-4 h-4 rounded focus:ring-2 focus:ring-blue-500 focus:ring-orange-500',
                      isDarkMode 
                        ? 'text-white bg-orange-500 border-orange-500 focus:ring-orange-500 checked:bg-orange-500 checked:border-orange-500' 
                        : 'text-white bg-blue-500 border-blue-500 focus:ring-blue-500 checked:bg-blue-500 checked:border-blue-500'
                    ]"
                    @change="handleDefaultIconToggle"
                  />
                  <div>
                    <label :class="['text-sm font-medium transition-colors duration-200 cursor-pointer', isDarkMode ? 'text-gray-200' : 'text-gray-900']">
                      Use default icon
                    </label>
                    <p :class="['text-xs transition-colors duration-200', isDarkMode ? 'text-gray-400' : 'text-gray-500']">
                      A generic control icon will be used (includes attribution file)
                    </p>
                  </div>
                </div>

                <!-- Icon Upload Section -->
                <div :class="['border-2 border-dashed border-gray-300 rounded-lg p-4 transition-all duration-200 dark:border-gray-600 dark:bg-gray-700', isDarkMode ? 'border-dark-600 bg-dark-700' : 'border-gray-300 bg-gray-50']">
                  <div class="text-center">
                    <input
                      ref="iconUpload"
                      type="file"
                      accept=".svg,.jpg,.jpeg,.png"
                      @change="handleIconUpload"
                      class="hidden"
                    />
                    
                    <!-- Default Icon Preview -->
                    <div v-if="controlData.useDefaultIcon" class="space-y-2">
                      <div class="flex items-center justify-center">
                        <div class="h-16 w-16 bg-gray-200 dark:bg-gray-600 rounded flex items-center justify-center">
                          <svg class="h-8 w-8 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                      </div>
                      <p :class="['text-sm font-medium transition-colors duration-200', isDarkMode ? 'text-gray-200' : 'text-gray-900']">Default Control Icon</p>
                      <p :class="['text-xs transition-colors duration-200', isDarkMode ? 'text-gray-400' : 'text-gray-500']">Generic gear icon with attribution</p>
                    </div>
                    
                    <!-- Upload Interface -->
                    <div v-else-if="!controlData.iconFile" class="space-y-2">
                      <svg :class="['mx-auto h-12 w-12 transition-colors duration-200', isDarkMode ? 'text-gray-500' : 'text-gray-400']" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                      <div :class="['text-sm transition-colors duration-200', isDarkMode ? 'text-gray-300' : 'text-gray-600']">
                        <label :class="['relative cursor-pointer rounded-md font-medium transition-colors duration-200', isDarkMode ? 'text-orange-400 hover:text-orange-300' : 'text-primary-600 hover:text-primary-500']">
                          <span>Upload an icon</span>
                          <input ref="iconUpload" type="file" accept=".svg,.jpg,.jpeg,.png" @change="handleIconUpload" class="sr-only" />
                        </label>
                        <span class="mx-2">or</span>
                        <span>drag and drop</span>
                      </div>
                      <p :class="['text-xs transition-colors duration-200', isDarkMode ? 'text-gray-400' : 'text-gray-500']">
                        SVG, PNG, JPG up to 10MB
                      </p>
                    </div>
                    
                    <!-- Uploaded Icon Preview -->
                    <div v-else class="space-y-2">
                      <div class="flex items-center justify-center">
                        <img v-if="controlData.iconPreview" :src="controlData.iconPreview" alt="Icon preview" class="h-16 w-16 object-contain rounded" />
                        <div v-else class="h-16 w-16 bg-gray-200 rounded flex items-center justify-center">
                          <svg :class="['h-8 w-8 transition-colors duration-200', isDarkMode ? 'text-gray-500' : 'text-gray-400']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      </div>
                      <p :class="['text-sm font-medium transition-colors duration-200', isDarkMode ? 'text-gray-200' : 'text-gray-900']">{{ controlData.iconFileName }}</p>
                      <button @click="removeIcon" :class="['text-sm transition-colors duration-200', isDarkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-800']">
                        Remove
                      </button>
                    </div>
                  </div>
                </div>

                <p v-if="validationErrors.icon" class="text-red-500 text-sm">{{ validationErrors.icon }}</p>
              </div>
            </div>
          </div>
          <div>
            <label :class="['block text-sm font-medium mb-2 transition-colors duration-200', isDarkMode ? 'text-gray-300' : 'text-gray-700']">
              Description
            </label>
            <textarea
              v-model="controlData.description"
              rows="3"
              placeholder="Describe your control..."
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>
        </div>

        <!-- Step 2: Standard Properties -->
        <div v-if="currentStep === 2" class="space-y-6">
          <h2 :class="['text-xl font-semibold transition-colors duration-200', isDarkMode ? 'text-white' : 'text-gray-900']">Standard Properties</h2>
          <p :class="['transition-colors duration-200', isDarkMode ? 'text-gray-400' : 'text-gray-600']">Select which standard K2 properties your control should support:</p>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
            <label
              v-for="prop in standardProperties"
              :key="prop.id"
              :class="[
                'flex items-center space-x-3 p-3 border rounded-lg hover:bg-opacity-50 cursor-pointer transition-all duration-200',
                isDarkMode 
                  ? 'border-dark-600 hover:bg-dark-700' 
                  : 'border-gray-200 hover:bg-gray-50'
              ]"
            >
              <input
                v-model="controlData.standardProperties"
                :value="prop.id"
                type="checkbox"
                :class="[
                  'w-4 h-4 rounded focus:ring-2 focus:ring-blue-500 focus:ring-orange-500',
                  isDarkMode 
                    ? 'text-white bg-orange-500 border-orange-500 focus:ring-orange-500 checked:bg-orange-500 checked:border-orange-500' 
                    : 'text-white bg-blue-500 border-blue-500 focus:ring-blue-500 checked:bg-blue-500 checked:border-blue-500'
                ]"
              />
              <div>
                <div :class="['font-medium transition-colors duration-200', isDarkMode ? 'text-gray-200' : 'text-gray-900']">{{ prop.name }}</div>
                <div :class="['text-sm transition-colors duration-200', isDarkMode ? 'text-gray-400' : 'text-gray-500']">{{ prop.description }}</div>
              </div>
            </label>
          </div>
          
          <!-- Standard Property Defaults Section -->
          <div class="mt-6" v-if="selectedStandardProperties.length > 0">
            <h3 :class="['text-lg font-medium mb-2 transition-colors duration-200', isDarkMode ? 'text-gray-200' : 'text-gray-900']">
              Standard Property Defaults
            </h3>
            <h4 :class="['text-sm font-normal mb-4 transition-colors duration-200', isDarkMode ? 'text-gray-400' : 'text-gray-600']">
              Set default values for selected standard properties (optional). Overrides will only be added to the manifest if a value is provided. Properties with default values will be added to the "properties" array while remaining in the "supports" array.
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-for="prop in selectedStandardPropertiesWithOverrides" :key="prop.id">
                <label :class="['block text-sm font-medium mb-1 transition-colors duration-200', isDarkMode ? 'text-gray-300' : 'text-gray-700']">
                  {{ prop.name }} Default
                </label>
                <input
                  v-model="controlData.standardPropertyOverrides[prop.id]"
                  type="text"
                  :placeholder="getStandardPropertyPlaceholder(prop.id)"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
                <p :class="['text-xs mt-1 transition-colors duration-200', isDarkMode ? 'text-gray-400' : 'text-gray-500']">
                  {{ prop.description }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 3: Custom Properties -->
        <div v-if="currentStep === 3" class="space-y-6">
          <div class="flex justify-between items-center">
            <h2 :class="['text-xl font-semibold transition-colors duration-200', isDarkMode ? 'text-white' : 'text-gray-900']">Custom Properties</h2>
            <button 
              @click="addCustomProperty" 
              :class="[
                'text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-orange-600 dark:hover:bg-orange-700 dark:focus:ring-orange-300',
                isDarkMode ? 'bg-orange-600 hover:bg-orange-700 focus:ring-orange-300' : 'bg-blue-700 hover:bg-blue-800 focus:ring-blue-300'
              ]"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
              Add Property
            </button>
          </div>
          <div v-if="controlData.customProperties.length === 0" :class="['text-center py-8 transition-colors duration-200', isDarkMode ? 'text-gray-400' : 'text-gray-500']">
            No custom properties added yet. Click "Add Property" to get started.
          </div>
          <div v-else class="space-y-4">
            <div
              v-for="(prop, index) in controlData.customProperties"
              :key="index"
              :class="[
                'bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 p-4 transition-all duration-200',
                isDarkMode ? 'border-dark-600 bg-dark-700' : 'border-gray-200 bg-gray-50'
              ]"
            >
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label :class="['block text-sm font-medium mb-1 transition-colors duration-200', isDarkMode ? 'text-gray-300' : 'text-gray-700']">Property ID *</label>
                  <input
                    v-model="prop.id"
                    type="text"
                    placeholder="e.g., customValue"
                    :class="[
                      'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-all duration-200',
                      validationErrors[`customProp_${index}_id`] ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                    ]"
                    @blur="validateCustomProperties"
                  />
                  <p v-if="validationErrors[`customProp_${index}_id`]" class="text-red-500 text-sm mt-1">{{ validationErrors[`customProp_${index}_id`] }}</p>
                </div>
                <div>
                  <label :class="['block text-sm font-medium mb-1 transition-colors duration-200', isDarkMode ? 'text-gray-300' : 'text-gray-700']">Friendly Name</label>
                  <input
                    v-model="prop.friendlyname"
                    type="text"
                    placeholder="e.g., Custom Value"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-all duration-200"
                  />
                </div>
                <div>
                  <label :class="['block text-sm font-medium mb-1 transition-colors duration-200', isDarkMode ? 'text-gray-300' : 'text-gray-700']">Type *</label>
                  <select 
                    v-model="prop.type" 
                    :class="[
                      'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-all duration-200',
                      validationErrors[`customProp_${index}_type`] ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                    ]"
                    @change="handlePropertyTypeChange(index, $event.target.value)"
                  >
                    <option value="">Select a type</option>
                    <option value="string">String</option>
                    <option value="boolean">Boolean</option>
                    <option value="drop">Dropdown</option>
                    <option value="listdata">List Data (Data Binding)</option>
                  </select>
                  <p v-if="validationErrors[`customProp_${index}_type`]" class="text-red-500 text-sm mt-1">{{ validationErrors[`customProp_${index}_type`] }}</p>
                </div>
                <!-- List Data / Dropdown Editor -->
                <div v-if="prop.type === 'listdata' || prop.type === 'drop'" class="col-span-2">
                  <label :class="['block text-sm font-medium mb-2 transition-colors duration-200', isDarkMode ? 'text-gray-300' : 'text-gray-700']">
                    {{ prop.type === 'listdata' ? 'Initial List Data (JSON array)' : 'Dropdown Options' }}
                  </label>
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
                          v-for="(item, itemIndex) in getListItems(prop, index)"
                          :key="itemIndex"
                          :class="['transition-colors duration-200', editingListItem && editingListItem.propIndex === index && editingListItem.itemIndex === itemIndex ? (isDarkMode ? 'bg-orange-900' : 'bg-orange-50') : (isDarkMode ? 'hover:bg-dark-700' : 'hover:bg-slate-50')]"
                        >
                          <td :class="['px-3 py-2', isDarkMode ? 'text-dark-200' : 'text-slate-700']">
                            <input
                              :ref="`wizard-value-${index}-${itemIndex}`"
                              :value="editingListItem && editingListItem.propIndex === index && editingListItem.itemIndex === itemIndex ? editingListItem.item.value : item.value"
                              @input="handleListItemInput(index, itemIndex, 'value', $event.target.value)"
                              @focus="startEditListItem(index, itemIndex, 'value')"
                              @keydown.enter.prevent="saveListItem(index)"
                              @keydown.tab.prevent="handleTabKey(index, itemIndex, 'display')"
                              @keydown.esc="cancelEditListItem()"
                              :readonly="!(editingListItem && editingListItem.propIndex === index && editingListItem.itemIndex === itemIndex)"
                              type="text"
                              :class="[
                                'w-full px-2 py-1 text-sm border rounded transition-all',
                                editingListItem && editingListItem.propIndex === index && editingListItem.itemIndex === itemIndex
                                  ? (isDarkMode ? 'bg-dark-800 border-dark-500 text-dark-100' : 'bg-white border-slate-400 text-slate-900')
                                  : (isDarkMode ? 'bg-transparent border-transparent text-dark-200 cursor-text' : 'bg-transparent border-transparent text-slate-700 cursor-text')
                              ]"
                              placeholder="Enter value"
                            />
                          </td>
                          <td :class="['px-3 py-2', isDarkMode ? 'text-dark-200' : 'text-slate-700']">
                            <input
                              :ref="`wizard-display-${index}-${itemIndex}`"
                              :value="editingListItem && editingListItem.propIndex === index && editingListItem.itemIndex === itemIndex ? editingListItem.item.display : item.display"
                              @input="handleListItemInput(index, itemIndex, 'display', $event.target.value)"
                              @focus="startEditListItem(index, itemIndex, 'display')"
                              @keydown.enter.prevent="saveListItem(index)"
                              @keydown.tab.prevent="handleTabKey(index, itemIndex, 'save')"
                              @keydown.esc="cancelEditListItem()"
                              :readonly="!(editingListItem && editingListItem.propIndex === index && editingListItem.itemIndex === itemIndex)"
                              type="text"
                              :class="[
                                'w-full px-2 py-1 text-sm border rounded transition-all',
                                editingListItem && editingListItem.propIndex === index && editingListItem.itemIndex === itemIndex
                                  ? (isDarkMode ? 'bg-dark-800 border-dark-500 text-dark-100' : 'bg-white border-slate-400 text-slate-900')
                                  : (isDarkMode ? 'bg-transparent border-transparent text-dark-200 cursor-text' : 'bg-transparent border-transparent text-slate-700 cursor-text')
                              ]"
                              placeholder="Enter display text"
                            />
                          </td>
                          <td :class="['px-3 py-2 text-center']">
                            <button
                              v-if="editingListItem && editingListItem.propIndex === index && editingListItem.itemIndex === itemIndex"
                              @click.stop.prevent="saveListItem(index)"
                              :class="['p-2 rounded transition-colors duration-200', isDarkMode ? 'text-green-400 hover:bg-green-900 hover:text-green-300' : 'text-green-600 hover:bg-green-50 hover:text-green-700']"
                              title="Save item"
                            >
                              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                              </svg>
                            </button>
                            <button
                              v-else
                              @click.stop.prevent="deleteListItem(index, itemIndex)"
                              :class="['p-2 rounded transition-colors duration-200', isDarkMode ? 'text-red-400 hover:bg-red-900 hover:text-red-300' : 'text-red-600 hover:bg-red-50 hover:text-red-700']"
                              title="Delete item"
                            >
                              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                              </svg>
                            </button>
                          </td>
                        </tr>
                        <tr v-if="getListItems(prop, index).length === 0">
                          <td colspan="3" :class="['px-3 py-4 text-center text-sm', isDarkMode ? 'text-dark-400' : 'text-slate-500']">
                            (Add {{ prop.type === 'listdata' ? 'list data items' : 'dropdown options' }})
                          </td>
                        </tr>
                        <!-- Add new row link -->
                        <tr 
                          @click="addNewListItem(index)"
                          :class="['cursor-pointer transition-colors duration-200', isDarkMode ? 'hover:bg-dark-700' : 'hover:bg-slate-50']"
                        >
                          <td colspan="3" :class="['px-3 py-2 text-center text-sm', isDarkMode ? 'text-orange-400 hover:text-orange-300' : 'text-blue-600 hover:text-blue-700']">
                            + Add new item
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <!-- Regular Initial Value Input -->
                <div v-else>
                  <label :class="['block text-sm font-medium mb-1 transition-colors duration-200', isDarkMode ? 'text-gray-300' : 'text-gray-700']">Initial Value</label>
                  <input
                    v-model="prop.initialvalue"
                    type="text"
                    placeholder="Default value"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-all duration-200"
                  />
                </div>
              </div>
              <div class="mt-4 flex justify-end">
                <button
                  @click="removeCustomProperty(index)"
                  :class="[
                    'text-sm transition-colors duration-200 hover:scale-105',
                    isDarkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-800'
                  ]"
                >
                  Remove Property
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 4: Events -->
        <div v-if="currentStep === 4" class="space-y-6">
          <div>
            <div class="flex justify-between items-center mb-4">
              <h2 :class="['text-xl font-semibold transition-colors duration-200', isDarkMode ? 'text-white' : 'text-gray-900']">Control Events</h2>
              <div class="flex space-x-2">
              <button @click="showEventTemplates = !showEventTemplates" :class="[
                'text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700',
                isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
              ]">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                </svg>
                {{ showEventTemplates ? 'Hide Templates' : 'Event Templates' }}
              </button>
              <button @click="addEvent" :class="[
                'text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-orange-600 dark:hover:bg-orange-700 dark:focus:ring-orange-300 hover:scale-105',
                isDarkMode ? 'bg-orange-600 hover:bg-orange-700' : 'bg-blue-700 hover:bg-blue-800'
              ]">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                </svg>
                Add Custom Event
              </button>
              </div>
            </div>
            <!-- Informational Notice about Event Wiring -->
            <div :class="['p-4 rounded-lg border-l-4 transition-colors duration-200', isDarkMode ? 'bg-yellow-900/20 border-yellow-500' : 'bg-yellow-50 border-yellow-400']">
              <div class="flex items-start">
                <svg class="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" :class="isDarkMode ? 'text-yellow-400' : 'text-yellow-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h4 :class="['font-semibold mb-1 transition-colors duration-200', isDarkMode ? 'text-yellow-300' : 'text-yellow-800']">
                    Important: Event Trigger Methods
                  </h4>
                  <p :class="['text-sm transition-colors duration-200', isDarkMode ? 'text-yellow-200' : 'text-yellow-700']">
                    The wizard will generate trigger methods (e.g., <code :class="['px-1 py-0.5 rounded font-mono text-xs', isDarkMode ? 'bg-yellow-900/30 text-yellow-300' : 'bg-yellow-100 text-yellow-800']">triggerChanged()</code>, <code :class="['px-1 py-0.5 rounded font-mono text-xs', isDarkMode ? 'bg-yellow-900/30 text-yellow-300' : 'bg-yellow-100 text-yellow-800']">triggerClick()</code>) for each event you define. However, you will need to <strong>manually wire up</strong> your control's event handlers (like button clicks, input changes, etc.) to call these trigger methods in your generated JavaScript files. The generated code provides the structure and trigger methods, but you must add the logic to connect user interactions to these events.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Event Templates Section -->
          <div v-if="showEventTemplates" :class="[
            'bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 p-4 transition-all duration-200',
            isDarkMode ? 'border-dark-600 bg-dark-700' : 'border-gray-200 bg-gray-50'
          ]">
            <h3 :class="['text-lg font-medium mb-4 transition-colors duration-200', isDarkMode ? 'text-gray-200' : 'text-gray-900']">
              Choose Event Templates
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div v-for="(events, category) in eventTemplates" :key="category" class="space-y-2">
                <h4 :class="['font-medium text-sm transition-colors duration-200', isDarkMode ? 'text-gray-300' : 'text-gray-700']">
                  {{ category }}
                </h4>
                <div class="space-y-1">
                  <label v-for="event in events" :key="event.id" class="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      :value="event"
                      @change="toggleTemplateEvent(event, $event.target.checked)"
                      :checked="isEventSelected(event.id)"
                      :class="[
                        'w-4 h-4 rounded focus:ring-2 focus:ring-blue-500 focus:ring-orange-500',
                        isDarkMode 
                          ? 'text-white bg-orange-500 border-orange-500 focus:ring-orange-500 checked:bg-orange-500 checked:border-orange-500' 
                          : 'text-white bg-blue-500 border-blue-500 focus:ring-blue-500 checked:bg-blue-500 checked:border-blue-500'
                      ]"
                    />
                    <div class="flex-1">
                      <div :class="['text-sm font-medium transition-colors duration-200', isDarkMode ? 'text-gray-200' : 'text-gray-900']">
                        {{ event.friendlyname }}
                      </div>
                      <div :class="['text-xs transition-colors duration-200', isDarkMode ? 'text-gray-400' : 'text-gray-500']">
                        {{ event.description }}
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div v-if="controlData.events.length === 0" :class="['text-center py-8 transition-colors duration-200', isDarkMode ? 'text-gray-400' : 'text-gray-500']">
            No events added yet. Click "Add Event" to get started.
          </div>
          <div v-else class="space-y-4">
            <div
              v-for="(event, index) in controlData.events"
              :key="index"
              :class="[
                'bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 p-4 transition-all duration-200',
                isDarkMode ? 'border-dark-600 bg-dark-700' : 'border-gray-200 bg-gray-50'
              ]"
            >
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label :class="['block text-sm font-medium mb-1 transition-colors duration-200', isDarkMode ? 'text-gray-300' : 'text-gray-700']">Event ID *</label>
                  <input
                    v-model="event.id"
                    type="text"
                    placeholder="e.g., customEvent"
                    :class="[
                      'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-all duration-200',
                      validationErrors[`event_${index}_id`] ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                    ]"
                    @blur="validateEvents"
                  />
                  <p v-if="validationErrors[`event_${index}_id`]" class="text-red-500 text-sm mt-1">{{ validationErrors[`event_${index}_id`] }}</p>
                </div>
                <div>
                  <label :class="['block text-sm font-medium mb-1 transition-colors duration-200', isDarkMode ? 'text-gray-300' : 'text-gray-700']">Friendly Name</label>
                  <input
                    v-model="event.friendlyname"
                    type="text"
                    placeholder="e.g., Custom Event"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-all duration-200"
                  />
                </div>
              </div>
              <div class="mt-4 flex justify-end">
                <button
                  @click="removeEvent(index)"
                  :class="[
                    'text-sm transition-colors duration-200 hover:scale-105',
                    isDarkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-800'
                  ]"
                >
                  Remove Event
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 5: Methods -->
        <div v-if="currentStep === 5" class="space-y-6">
          <h2 :class="['text-xl font-semibold transition-colors duration-200', isDarkMode ? 'text-white' : 'text-gray-900']">Control Methods</h2>
          <p :class="['transition-colors duration-200 mb-4', isDarkMode ? 'text-gray-400' : 'text-gray-600']">
            Define callable methods that can be invoked programmatically. Methods are exposed through the execute() API and can be called from K2 workflows or directly.
          </p>

          <!-- Info Box -->
          <div :class="[
            'bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded transition-all duration-200 dark:bg-yellow-900/20 dark:border-yellow-500',
            isDarkMode ? 'bg-yellow-900/20 border-yellow-500' : 'bg-yellow-50 border-yellow-400'
          ]">
            <div class="flex items-start">
              <svg class="w-5 h-5 mr-3 flex-shrink-0" :class="isDarkMode ? 'text-yellow-400' : 'text-yellow-600'" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
              <div>
                <h4 :class="['font-semibold mb-1 transition-colors duration-200', isDarkMode ? 'text-yellow-300' : 'text-yellow-800']">
                  Important: Method Implementation
                </h4>
                <p :class="['text-sm transition-colors duration-200', isDarkMode ? 'text-yellow-200' : 'text-yellow-700']">
                  The wizard will generate an <code :class="['px-1 py-0.5 rounded font-mono text-xs', isDarkMode ? 'bg-yellow-900/30 text-yellow-300' : 'bg-yellow-100 text-yellow-800']">execute(objInfo)</code> method that routes to your custom methods. You'll need to implement the actual method logic in your generated JavaScript files. The execute() method will handle routing based on <code :class="['px-1 py-0.5 rounded font-mono text-xs', isDarkMode ? 'bg-yellow-900/30 text-yellow-300' : 'bg-yellow-100 text-yellow-800']">objInfo.methodName</code>.
                </p>
              </div>
            </div>
          </div>

          <!-- Add Method Button -->
          <div class="flex justify-end mb-4">
            <button
              @click="addMethod"
              :class="[
                'px-4 py-2 rounded-md font-medium transition-colors duration-200',
                isDarkMode 
                  ? 'bg-orange-600 text-white hover:bg-orange-700' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              ]"
            >
              + Add Method
            </button>
          </div>

          <div v-if="controlData.methods.length === 0" :class="['text-center py-8 transition-colors duration-200', isDarkMode ? 'text-gray-400' : 'text-gray-500']">
            No methods added yet. Click "Add Method" to get started.
          </div>
          <div v-else class="space-y-4">
            <div
              v-for="(method, index) in controlData.methods"
              :key="index"
              :class="[
                'bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 p-4 transition-all duration-200',
                isDarkMode ? 'border-dark-600 bg-dark-700' : 'border-gray-200 bg-gray-50'
              ]"
            >
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label :class="['block text-sm font-medium mb-1 transition-colors duration-200', isDarkMode ? 'text-gray-300' : 'text-gray-700']">Method ID *</label>
                  <input
                    v-model="method.id"
                    type="text"
                    placeholder="e.g., refreshData"
                    :class="[
                      'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-all duration-200',
                      validationErrors[`method_${index}_id`] ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                    ]"
                    @blur="validateMethods"
                  />
                  <p v-if="validationErrors[`method_${index}_id`]" class="text-red-500 text-sm mt-1">{{ validationErrors[`method_${index}_id`] }}</p>
                </div>
                <div>
                  <label :class="['block text-sm font-medium mb-1 transition-colors duration-200', isDarkMode ? 'text-gray-300' : 'text-gray-700']">Display Name *</label>
                  <input
                    v-model="method.displayname"
                    type="text"
                    placeholder="e.g., Refresh Data"
                    :class="[
                      'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-all duration-200',
                      validationErrors[`method_${index}_displayname`] ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                    ]"
                    @blur="validateMethods"
                  />
                  <p v-if="validationErrors[`method_${index}_displayname`]" class="text-red-500 text-sm mt-1">{{ validationErrors[`method_${index}_displayname`] }}</p>
                </div>
              </div>
              <div class="mt-4">
                <label :class="['block text-sm font-medium mb-1 transition-colors duration-200', isDarkMode ? 'text-gray-300' : 'text-gray-700']">Description (Optional)</label>
                <textarea
                  v-model="method.description"
                  rows="2"
                  placeholder="e.g., Refreshes the control's data from the server"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-all duration-200"
                />
              </div>
              <div class="mt-4 flex justify-end">
                <button
                  @click="removeMethod(index)"
                  :class="[
                    'text-sm transition-colors duration-200 hover:scale-105',
                    isDarkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-800'
                  ]"
                >
                  Remove Method
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 6: File Structure -->
        <div v-if="currentStep === 6" class="space-y-6">
          <h2 :class="['text-xl font-semibold transition-colors duration-200', isDarkMode ? 'text-white' : 'text-gray-900']">File Structure</h2>
          <p :class="['transition-colors duration-200 mb-4', isDarkMode ? 'text-gray-400' : 'text-gray-600']">Choose whether to use separate files for runtime vs design-time, or share the same files:</p>
          
          <!-- File Structure Options -->
          <div class="space-y-4">
            <div :class="[
              'bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 p-4 transition-all duration-200',
              isDarkMode ? 'border-dark-600 bg-dark-700' : 'border-gray-200 bg-gray-50'
            ]">
              <h3 :class="['text-lg font-medium mb-3 transition-colors duration-200', isDarkMode ? 'text-gray-200' : 'text-gray-900']">File Organization Strategy</h3>
              <div class="space-y-3">
                <label class="flex items-center space-x-3 cursor-pointer">
                  <input
                    v-model="controlData.files.useSeparateFiles"
                    type="radio"
                    :value="true"
                    :class="[
                      'w-4 h-4 rounded-full focus:ring-2 focus:ring-blue-500 focus:ring-orange-500',
                      isDarkMode 
                        ? 'text-white bg-orange-500 border-orange-500 focus:ring-orange-500 checked:bg-orange-500 checked:border-orange-500' 
                        : 'text-white bg-blue-500 border-blue-500 focus:ring-blue-500 checked:bg-blue-500 checked:border-blue-500'
                    ]"
                  />
                  <div>
                    <div :class="['font-medium transition-colors duration-200', isDarkMode ? 'text-gray-200' : 'text-gray-900']">Separate Files (Recommended)</div>
                    <div :class="['text-sm transition-colors duration-200', isDarkMode ? 'text-gray-400' : 'text-gray-500']">Different files for runtime and design-time - better performance and cleaner separation</div>
                  </div>
                </label>
                <label class="flex items-center space-x-3 cursor-pointer">
                  <input
                    v-model="controlData.files.useSeparateFiles"
                    type="radio"
                    :value="false"
                    :class="[
                      'w-4 h-4 rounded-full focus:ring-2 focus:ring-blue-500 focus:ring-orange-500',
                      isDarkMode 
                        ? 'text-white bg-orange-500 border-orange-500 focus:ring-orange-500 checked:bg-orange-500 checked:border-orange-500' 
                        : 'text-white bg-blue-500 border-blue-500 focus:ring-blue-500 checked:bg-blue-500 checked:border-blue-500'
                    ]"
                  />
                  <div>
                    <div :class="['font-medium transition-colors duration-200', isDarkMode ? 'text-gray-200' : 'text-gray-900']">Shared Files (Simpler)</div>
                    <div :class="['text-sm transition-colors duration-200', isDarkMode ? 'text-gray-400' : 'text-gray-500']">Same files used for both runtime and design-time - easier to maintain</div>
                  </div>
                </label>
              </div>
            </div>

            <!-- File Preview -->
            <div :class="[
              'bg-gray-50 border border-gray-200 rounded-lg p-4 transition-all duration-200 dark:bg-gray-700 dark:border-gray-600',
              isDarkMode ? 'bg-dark-600' : 'bg-gray-50'
            ]">
              <h4 :class="['font-medium mb-2 transition-colors duration-200', isDarkMode ? 'text-gray-200' : 'text-gray-900']">Generated Files:</h4>
              <div :class="['text-sm transition-colors duration-200', isDarkMode ? 'text-gray-300' : 'text-gray-600']">
                <div v-if="controlData.files.useSeparateFiles">
                  <div>• manifest.json</div>
                  <div>• runtime_logic.js</div>
                  <div>• runtime_style.css</div>
                  <div>• designtime_logic.js</div>
                  <div>• designtime_style.css</div>
                </div>
                <div v-else>
                  <div>• manifest.json</div>
                  <div>• control.js (shared)</div>
                  <div>• control.css (shared)</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 7: Preview & Generate -->
        <div v-if="currentStep === 7" class="space-y-6">
          <h2 :class="['text-xl font-semibold transition-colors duration-200', isDarkMode ? 'text-white' : 'text-gray-900']">Preview & Generate</h2>
          
          <!-- Generated Files Preview -->
          <div :class="['bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 p-4 transition-colors duration-200', isDarkMode ? 'bg-dark-700 border-dark-600' : 'bg-gray-50 border-gray-200']">
            <h3 :class="['text-lg font-medium mb-2 transition-colors duration-200', isDarkMode ? 'text-gray-200' : 'text-gray-900']">Generated Files</h3>
            <div class="space-y-2">
              <div class="flex items-center space-x-2">
                <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span :class="['transition-colors duration-200', isDarkMode ? 'text-gray-300' : 'text-gray-700']">manifest.json</span>
              </div>
              <div class="flex items-center space-x-2">
                <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span :class="['transition-colors duration-200', isDarkMode ? 'text-gray-300' : 'text-gray-700']">runtime-script.js</span>
              </div>
              <div class="flex items-center space-x-2">
                <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span :class="['transition-colors duration-200', isDarkMode ? 'text-gray-300' : 'text-gray-700']">designtime-script.js</span>
              </div>
              <div class="flex items-center space-x-2">
                <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span :class="['transition-colors duration-200', isDarkMode ? 'text-gray-300' : 'text-gray-700']">runtime-style.css</span>
              </div>
              <div class="flex items-center space-x-2">
                <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span :class="['transition-colors duration-200', isDarkMode ? 'text-gray-300' : 'text-gray-700']">designtime-style.css</span>
              </div>
            </div>
          </div>

          <!-- Control Actions -->
          <div :class="['bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 p-6 transition-colors duration-200', isDarkMode ? 'bg-dark-700 border-dark-600' : 'bg-gray-50 border-gray-200']">
            <h3 :class="['text-lg font-semibold mb-4 transition-colors duration-200', isDarkMode ? 'text-gray-200' : 'text-gray-900']">
              Control Actions
            </h3>
            <p :class="['mb-6 transition-colors duration-200', isDarkMode ? 'text-gray-400' : 'text-gray-600']">
              Choose how you'd like to proceed with your generated control:
            </p>
            <div class="flex flex-col sm:flex-row gap-4">
              <button
                @click="loadIntoWorkbench"
                :disabled="isLoadingIntoWorkbench"
                :class="[
                  'text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-orange-600 dark:hover:bg-orange-700 dark:focus:ring-orange-300 transition-all duration-200',
                  isLoadingIntoWorkbench 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:scale-105',
                  isDarkMode ? 'bg-orange-600 hover:bg-orange-700' : 'bg-blue-700 hover:bg-blue-800'
                ]"
              >
                <svg v-if="isLoadingIntoWorkbench" class="animate-spin -ml-1 mr-3 h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                {{ isLoadingIntoWorkbench ? 'Loading...' : 'Load into Inspector' }}
              </button>
              
              <button
                @click="generateControl"
                :class="[
                  'text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-orange-600 dark:hover:bg-orange-700 dark:focus:ring-orange-300 transition-all duration-200 hover:scale-105',
                  isDarkMode ? 'bg-orange-600 hover:bg-orange-700' : 'bg-blue-700 hover:bg-blue-800'
                ]"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download ZIP
              </button>
            </div>
            
            <div v-if="workbenchLoadStatus" :class="[
              'flex items-center text-sm mt-4',
              workbenchLoadStatus.success 
                ? (isDarkMode ? 'text-green-400' : 'text-green-600')
                : (isDarkMode ? 'text-red-400' : 'text-red-600')
            ]">
              <svg v-if="workbenchLoadStatus.success" class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {{ workbenchLoadStatus.message }}
            </div>
          </div>

          <!-- Next Steps: Making Your Control Fully Functional -->
          <div :class="['bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 p-6 transition-colors duration-200', isDarkMode ? 'bg-dark-700 border-dark-600' : 'bg-gray-50 border-gray-200']">
            <h3 :class="['text-lg font-semibold mb-4 transition-colors duration-200', isDarkMode ? 'text-gray-200' : 'text-gray-900']">
              Next Steps: Making Your Control Fully Functional
            </h3>
            
            <!-- Quick Start Checklist -->
            <div class="mb-6">
              <h4 :class="['font-medium mb-3 transition-colors duration-200', isDarkMode ? 'text-gray-300' : 'text-gray-800']">Quick Start Checklist</h4>
              <div class="space-y-2">
                <div class="flex items-start space-x-3">
                  <div :class="['w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold', isDarkMode ? 'bg-orange-600 text-white' : 'bg-primary-100 text-primary-800']">1</div>
                  <div>
                    <p :class="['font-medium transition-colors duration-200', isDarkMode ? 'text-gray-200' : 'text-gray-900']">Add Custom Styling</p>
                    <p :class="['text-sm transition-colors duration-200', isDarkMode ? 'text-gray-400' : 'text-gray-600']">Edit the CSS files to match your design requirements</p>
                  </div>
                </div>
                <div class="flex items-start space-x-3">
                  <div :class="['w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold', isDarkMode ? 'bg-orange-600 text-white' : 'bg-primary-100 text-primary-800']">2</div>
                  <div>
                    <p :class="['font-medium transition-colors duration-200', isDarkMode ? 'text-gray-200' : 'text-gray-900']">Review Event Templates</p>
                    <p :class="['text-sm transition-colors duration-200', isDarkMode ? 'text-gray-400' : 'text-gray-600']">Check the generated event methods and customize as needed</p>
                  </div>
                </div>
                <div class="flex items-start space-x-3">
                  <div :class="['w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold', isDarkMode ? 'bg-orange-600 text-white' : 'bg-primary-100 text-primary-800']">3</div>
                  <div>
                    <p :class="['font-medium transition-colors duration-200', isDarkMode ? 'text-gray-200' : 'text-gray-900']">Test Your Control</p>
                    <p :class="['text-sm transition-colors duration-200', isDarkMode ? 'text-gray-400' : 'text-gray-600']">Use the runtime shell to test functionality and events</p>
                  </div>
                </div>
                <div class="flex items-start space-x-3">
                  <div :class="['w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold', isDarkMode ? 'bg-orange-600 text-white' : 'bg-primary-100 text-primary-800']">4</div>
                  <div>
                    <p :class="['font-medium transition-colors duration-200', isDarkMode ? 'text-gray-200' : 'text-gray-900']">Extend Functionality</p>
                    <p :class="['text-sm transition-colors duration-200', isDarkMode ? 'text-gray-400' : 'text-gray-600']">Add more properties, events, and custom logic as needed</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Development Tips -->
            <div>
              <h4 :class="['font-medium mb-3 transition-colors duration-200', isDarkMode ? 'text-gray-300' : 'text-gray-800']">Development Tips</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div :class="['bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 p-4 transition-colors duration-200', isDarkMode ? 'border-dark-500 bg-dark-800' : 'border-gray-200 bg-white']">
                  <h5 :class="['font-medium mb-2 transition-colors duration-200', isDarkMode ? 'text-gray-200' : 'text-gray-900']">Styling</h5>
                  <ul :class="['text-sm space-y-1 transition-colors duration-200', isDarkMode ? 'text-gray-400' : 'text-gray-600']">
                    <li>• Use CSS custom properties for theming</li>
                    <li>• Test both light and dark modes</li>
                    <li>• Ensure responsive design</li>
                    <li>• Follow accessibility guidelines</li>
                  </ul>
                </div>
                <div :class="['bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 p-4 transition-colors duration-200', isDarkMode ? 'border-dark-500 bg-dark-800' : 'border-gray-200 bg-white']">
                  <h5 :class="['font-medium mb-2 transition-colors duration-200', isDarkMode ? 'text-gray-200' : 'text-gray-900']">Events</h5>
                  <ul :class="['text-sm space-y-1 transition-colors duration-200', isDarkMode ? 'text-gray-400' : 'text-gray-600']">
                    <li>• Use descriptive event names</li>
                    <li>• Include relevant data in event details</li>
                    <li>• Test event firing and handling</li>
                    <li>• Document event parameters</li>
                  </ul>
                </div>
                <div :class="['bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 p-4 transition-colors duration-200', isDarkMode ? 'border-dark-500 bg-dark-800' : 'border-gray-200 bg-white']">
                  <h5 :class="['font-medium mb-2 transition-colors duration-200', isDarkMode ? 'text-gray-200' : 'text-gray-900']">Properties</h5>
                  <ul :class="['text-sm space-y-1 transition-colors duration-200', isDarkMode ? 'text-gray-400' : 'text-gray-600']">
                    <li>• Use proper data types</li>
                    <li>• Set meaningful default values</li>
                    <li>• Validate property values</li>
                    <li>• Update UI when properties change</li>
                  </ul>
                </div>
                <div :class="['bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 p-4 transition-colors duration-200', isDarkMode ? 'border-dark-500 bg-dark-800' : 'border-gray-200 bg-white']">
                  <h5 :class="['font-medium mb-2 transition-colors duration-200', isDarkMode ? 'text-gray-200' : 'text-gray-900']">Testing</h5>
                  <ul :class="['text-sm space-y-1 transition-colors duration-200', isDarkMode ? 'text-gray-400' : 'text-gray-600']">
                    <li>• Test in different browsers</li>
                    <li>• Verify all events fire correctly</li>
                    <li>• Check property binding</li>
                    <li>• Test edge cases and error handling</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Navigation Buttons -->
        <div :class="[
          'flex justify-between pt-8 mt-6 border-t transition-colors duration-200',
          isDarkMode ? 'border-dark-600' : 'border-gray-200'
        ]">
          <button
            v-if="currentStep > 1"
            @click="previousStep"
            :class="[
              'text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-all duration-200 hover:scale-105 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-600',
              isDarkMode ? 'bg-gray-800 text-white border-gray-600 hover:bg-gray-700 focus:ring-gray-600' : ''
            ]"
          >
            Previous
          </button>
          <div v-else></div>
          
          <button
            v-if="currentStep < steps.length"
            @click="nextStep"
            :disabled="!canProceed"
            :class="[
              'text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-all duration-200 dark:bg-orange-600 dark:hover:bg-orange-700 dark:focus:ring-orange-300',
              isDarkMode ? 'bg-orange-600 hover:bg-orange-700 focus:ring-orange-300' : 'bg-blue-700 hover:bg-blue-800 focus:ring-blue-300',
              !canProceed ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
            ]"
          >
            <span v-if="isGenerating" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-3 h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isGenerating ? 'Generating...' : (currentStep === steps.length - 1 ? 'Generate Files' : 'Next') }}
            </span>
            <span v-else>{{ currentStep === steps.length - 1 ? 'Generate Files' : 'Next' }}</span>
          </button>
          <div v-else class="text-center">
            <p :class="['text-sm transition-colors duration-200', isDarkMode ? 'text-gray-400' : 'text-gray-600']">
              Use the buttons above to load into Inspector or download your control files.
            </p>
          </div>
        </div>
      </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Wizard',
  components: {
  },
  props: {
    isDarkMode: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      currentStep: 1,
      isGenerating: false,
      isLoadingIntoWorkbench: false,
      workbenchLoadStatus: null,
      validationErrors: {},
      showEventTemplates: false,
      steps: [
        { title: 'Basic Info' },
        { title: 'Properties' },
        { title: 'Custom Props' },
        { title: 'Events' },
        { title: 'Methods' },
        { title: 'Files' },
        { title: 'Generate' }
      ],
      eventTemplates: {
        'Standard Form': [
          { id: 'Changed', friendlyname: 'Value Changed', description: 'Fired when the control value changes' },
          { id: 'Focus', friendlyname: 'Gained Focus', description: 'Fired when control receives focus' },
          { id: 'Blur', friendlyname: 'Lost Focus', description: 'Fired when control loses focus' },
          { id: 'OnEnter', friendlyname: 'Enter Key Pressed', description: 'Fired when Enter key is pressed' }
        ],
        'Interactive': [
          { id: 'Click', friendlyname: 'Clicked', description: 'Fired when control is clicked' },
          { id: 'DoubleClick', friendlyname: 'Double Clicked', description: 'Fired when control is double-clicked' },
          { id: 'MouseEnter', friendlyname: 'Mouse Enter', description: 'Fired when mouse enters control' },
          { id: 'MouseLeave', friendlyname: 'Mouse Leave', description: 'Fired when mouse leaves control' }
        ],
        'File Upload': [
          { id: 'FileSelected', friendlyname: 'File Selected', description: 'Fired when files are selected' },
          { id: 'FileUploaded', friendlyname: 'File Uploaded', description: 'Fired when files are uploaded' },
          { id: 'UploadProgress', friendlyname: 'Upload Progress', description: 'Fired during upload progress' },
          { id: 'UploadComplete', friendlyname: 'Upload Complete', description: 'Fired when upload finishes' }
        ],
        'Location/Map': [
          { id: 'LocationChanged', friendlyname: 'Location Changed', description: 'Fired when location is selected' },
          { id: 'MapClicked', friendlyname: 'Map Clicked', description: 'Fired when map is clicked' },
          { id: 'GeofenceEntered', friendlyname: 'Geofence Entered', description: 'Fired when entering geofence' },
          { id: 'GeofenceExited', friendlyname: 'Geofence Exited', description: 'Fired when exiting geofence' }
        ],
        'Calendar/Date': [
          { id: 'DateSelected', friendlyname: 'Date Selected', description: 'Fired when date is selected' },
          { id: 'MonthChanged', friendlyname: 'Month Changed', description: 'Fired when month changes' },
          { id: 'YearChanged', friendlyname: 'Year Changed', description: 'Fired when year changes' },
          { id: 'DateRangeSelected', friendlyname: 'Date Range Selected', description: 'Fired when date range is selected' }
        ],
        'Data Display': [
          { id: 'DataUpdated', friendlyname: 'Data Updated', description: 'Fired when data is updated' },
          { id: 'TileClicked', friendlyname: 'Tile Clicked', description: 'Fired when tile is clicked' },
          { id: 'AnimationComplete', friendlyname: 'Animation Complete', description: 'Fired when animation finishes' }
        ]
      },
      controlData: {
        displayName: '',
        tagName: '',
        tagNameManuallyEdited: false, // Track if user manually edited tag name
        icon: 'icon.svg',
        iconFile: null,
        iconPreview: null,
        iconFileName: null,
        useDefaultIcon: false,
        description: '',
        standardProperties: ['Width', 'Height', 'IsVisible', 'IsEnabled'],
        standardPropertyOverrides: {},
        customProperties: [],
        events: [],
        methods: [],
        files: {
          useSeparateFiles: true
        }
      },
      standardProperties: [
        { id: 'Width', name: 'Width', description: 'Control width' },
        { id: 'Height', name: 'Height', description: 'Control height' },
        { id: 'IsVisible', name: 'IsVisible', description: 'Control visibility' },
        { id: 'IsEnabled', name: 'IsEnabled', description: 'Control enabled state' },
        { id: 'IsReadOnly', name: 'IsReadOnly', description: 'Read-only state' },
        { id: 'DataBinding', name: 'DataBinding', description: 'Enable data binding support (listdata properties)' }
        // { id: 'Format', name: 'Format', description: 'Data format' } // TODO: Implement format functionality
      ],
      editingListItem: null // Track which list item is being edited
    }
  },
  computed: {
    canProceed() {
      switch (this.currentStep) {
        case 1:
          return this.controlData.displayName && this.controlData.tagName && !this.validationErrors.displayName && !this.validationErrors.tagName && (this.controlData.useDefaultIcon || this.controlData.iconFile)
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
          return true
        default:
          return true
      }
    },
    generatedManifest() {
      return JSON.stringify(this.createManifest(), null, 2)
    },
    generatedFiles() {
      const files = ['manifest.json']
      if (this.controlData.files.useSeparateFiles) {
        files.push('runtime_logic.js', 'runtime_style.css', 'designtime_logic.js', 'designtime_style.css')
      } else {
        files.push('control.js', 'control.css')
      }
      
      // Add icon file based on selection
      if (this.controlData.useDefaultIcon) {
        files.push('icon.svg', 'ICON_ATTRIBUTION.md')
      } else if (this.controlData.iconFile) {
        files.push(this.controlData.iconFileName)
      } else if (this.controlData.icon) {
        files.push(this.controlData.icon)
      }
      
      return files
    },
    hasStandardPropertyOverrides() {
      return Object.keys(this.controlData.standardPropertyOverrides).some(key => 
        this.controlData.standardPropertyOverrides[key] && this.controlData.standardPropertyOverrides[key].trim() !== ''
      )
    },
    selectedStandardProperties() {
      return this.standardProperties.filter(prop => 
        this.controlData.standardProperties.includes(prop.id)
      )
    },
    selectedStandardPropertiesWithOverrides() {
      return this.selectedStandardProperties.map(prop => ({
        ...prop,
        defaultValue: this.controlData.standardPropertyOverrides[prop.id] || ''
      }))
    },
    standardPropertiesWithOverrides() {
      return this.standardProperties.map(prop => ({
        ...prop,
        defaultValue: this.controlData.standardPropertyOverrides[prop.id] || ''
      }))
    }
  },
  watch: {
    'controlData.standardProperties'(newVal, oldVal) {
      // Clean up override values for properties that are no longer selected
      if (oldVal && Array.isArray(oldVal)) {
        const deselectedProperties = oldVal.filter(prop => !newVal.includes(prop))
        deselectedProperties.forEach(propId => {
          if (this.controlData.standardPropertyOverrides[propId]) {
            delete this.controlData.standardPropertyOverrides[propId]
          }
        })
      }
    }
  },
  methods: {
    validateField(fieldName) {
      const value = this.controlData[fieldName]
      if (fieldName === 'icon') {
        // Icon is required - either default icon or uploaded file
        if (!this.controlData.useDefaultIcon && !this.controlData.iconFile) {
          this.validationErrors[fieldName] = 'Icon is required (upload a file or use default icon)'
        } else {
          delete this.validationErrors[fieldName]
        }
      } else if (fieldName === 'tagName') {
        // Validate tag name for HTML custom element requirements
        if (!value || value.trim() === '') {
          this.validationErrors[fieldName] = 'Tag name is required'
        } else {
          const trimmed = value.trim()
          // Must contain at least one hyphen (HTML custom element requirement)
          if (!trimmed.includes('-')) {
            this.validationErrors[fieldName] = 'Tag name must contain a hyphen (e.g., k2-my-control). This is required for custom HTML elements.'
          }
          // Must start with a letter (HTML requirement)
          else if (!/^[a-zA-Z]/.test(trimmed)) {
            this.validationErrors[fieldName] = 'Tag name must start with a letter'
          }
          // Must be lowercase (best practice for HTML elements)
          else if (trimmed !== trimmed.toLowerCase()) {
            this.validationErrors[fieldName] = 'Tag name must be lowercase (e.g., my-control not My-Control)'
          }
          // Must only contain letters, numbers, hyphens (HTML requirement)
          else if (!/^[a-z][a-z0-9-]*$/.test(trimmed)) {
            this.validationErrors[fieldName] = 'Tag name can only contain lowercase letters, numbers, and hyphens'
          }
          // Must not start or end with hyphen
          else if (trimmed.startsWith('-') || trimmed.endsWith('-')) {
            this.validationErrors[fieldName] = 'Tag name cannot start or end with a hyphen'
          }
          // Must not have consecutive hyphens
          else if (trimmed.includes('--')) {
            this.validationErrors[fieldName] = 'Tag name cannot contain consecutive hyphens'
          }
          else {
            // Update controlData with trimmed value
            this.controlData.tagName = trimmed
            delete this.validationErrors[fieldName]
          }
        }
      } else if (!value || value.trim() === '') {
        this.validationErrors[fieldName] = `${fieldName} is required`
      } else {
        delete this.validationErrors[fieldName]
      }
    },
    generateTagNameFromDisplayName() {
      // Only auto-generate if user hasn't manually edited the tag name
      if (!this.controlData.tagNameManuallyEdited && this.controlData.displayName) {
        // Convert display name to tag name format
        // Remove special characters, convert to lowercase, replace spaces with hyphens
        let tagName = this.controlData.displayName
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
          .trim()
          .replace(/\s+/g, '-') // Replace spaces with hyphens
          .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
          .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
        
        // Ensure it has a hyphen (HTML custom element requirement)
        // If no hyphen, add 'k2-' prefix
        if (tagName && !tagName.includes('-')) {
          tagName = 'k2-' + tagName
        }
        
        // Ensure it starts with a letter
        if (tagName && !/^[a-z]/.test(tagName)) {
          tagName = 'k2-' + tagName
        }
        
        if (tagName) {
          this.controlData.tagName = tagName
        }
      }
    },
    handleIconUpload(event) {
      const file = event.target.files[0]
      if (file) {
        // Validate file type
        const allowedTypes = ['image/svg+xml', 'image/jpeg', 'image/jpg', 'image/png']
        if (!allowedTypes.includes(file.type)) {
          this.validationErrors.icon = 'Please select a valid image file (SVG, JPG, PNG)'
          return
        }

        // Validate file size (10MB limit)
        if (file.size > 10 * 1024 * 1024) {
          this.validationErrors.icon = 'File size must be less than 10MB'
          return
        }

        this.controlData.iconFile = file
        this.controlData.iconFileName = file.name
        this.controlData.useDefaultIcon = false

        // Create preview
        const reader = new FileReader()
        reader.onload = (e) => {
          this.controlData.iconPreview = e.target.result
        }
        reader.readAsDataURL(file)

        // Clear any validation errors
        delete this.validationErrors.icon
      }
    },
    removeIcon() {
      this.controlData.iconFile = null
      this.controlData.iconPreview = null
      this.controlData.iconFileName = null
      this.controlData.icon = 'icon.svg'
      this.controlData.useDefaultIcon = false
      delete this.validationErrors.icon
    },
    handleDefaultIconToggle() {
      if (this.controlData.useDefaultIcon) {
        // Clear any uploaded icon when default is selected
        this.controlData.iconFile = null
        this.controlData.iconPreview = null
        this.controlData.iconFileName = null
        this.controlData.icon = 'icon.svg'
      }
      // Clear validation errors
      delete this.validationErrors.icon
    },
    getStepCircleClasses(index) {
      const baseClasses = 'w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 relative z-10'
      
      if (this.currentStep > index + 1) {
        // Completed step (only when we've moved past the next step)
        return `${baseClasses} ${this.isDarkMode ? 'bg-orange-600 text-white shadow-lg' : 'bg-primary-600 text-white shadow-lg'}`
      } else if (this.currentStep === index + 1) {
        // Current step (in progress)
        return `${baseClasses} ${this.isDarkMode ? 'bg-orange-500 text-white border-2 border-orange-300 shadow-lg ring-4 ring-orange-200' : 'bg-primary-100 text-primary-700 border-2 border-primary-500 shadow-lg ring-4 ring-primary-100'}`
      } else if (this.currentStep === index) {
        // Next step (active/ready) - the immediate next step
        return `${baseClasses} ${this.isDarkMode ? 'bg-transparent text-orange-400 border-2 border-orange-400' : 'bg-transparent text-primary-600 border-2 border-primary-500'}`
      } else {
        // Future step (inactive)
        return `${baseClasses} ${this.isDarkMode ? 'bg-gray-700 text-gray-400 border-2 border-gray-600' : 'bg-gray-200 text-gray-500 border-2 border-gray-300'}`
      }
    },
    getStepLineClasses(index) {
      const baseClasses = 'h-1 rounded-full transition-all duration-500'
      
      if (this.currentStep > index) {
        // Line to completed step
        return `${baseClasses} ${this.isDarkMode ? 'bg-orange-600' : 'bg-primary-600'}`
      } else if (this.currentStep === index) {
        // Line from current step
        return `${baseClasses} ${this.isDarkMode ? 'bg-orange-400' : 'bg-primary-400'}`
      } else {
        // Line to future step
        return `${baseClasses} ${this.isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`
      }
    },
    getStepLabelClasses(index) {
      const baseClasses = 'text-sm font-medium transition-all duration-200'
      
      if (this.currentStep > index + 1) {
        // Completed step label
        return `${baseClasses} ${this.isDarkMode ? 'text-orange-400' : 'text-primary-600'}`
      } else if (this.currentStep === index + 1) {
        // Current step label
        return `${baseClasses} ${this.isDarkMode ? 'text-orange-300 font-semibold' : 'text-primary-700 font-semibold'}`
      } else if (this.currentStep === index) {
        // Next step label (active/ready)
        return `${baseClasses} ${this.isDarkMode ? 'text-orange-400 font-medium' : 'text-primary-600 font-medium'}`
      } else {
        // Future step label (inactive)
        return `${baseClasses} ${this.isDarkMode ? 'text-gray-500' : 'text-gray-500'}`
      }
    },
    handlePropertyTypeChange(index, newType) {
      const prop = this.controlData.customProperties[index]
      if (!prop) return
      
      // Initialize initialvalue for list-based types
      if ((newType === 'listdata' || newType === 'drop') && (!prop.initialvalue || prop.initialvalue.trim() === '')) {
        prop.initialvalue = '[]'
      }
      
      // Validate after type change
      this.validateCustomProperties()
    },
    validateCustomProperties() {
      // Clear previous validation errors for custom properties
      Object.keys(this.validationErrors).forEach(key => {
        if (key.startsWith('customProp_')) {
          delete this.validationErrors[key]
        }
      })

      let hasErrors = false
      this.controlData.customProperties.forEach((prop, index) => {
        if (!prop.id || prop.id.trim() === '') {
          this.validationErrors[`customProp_${index}_id`] = 'Property ID is required'
          hasErrors = true
        }
        if (!prop.type || prop.type.trim() === '') {
          this.validationErrors[`customProp_${index}_type`] = 'Property type is required'
          hasErrors = true
        }
      })
      return !hasErrors
    },
    validateEvents() {
      // Clear previous validation errors for events
      Object.keys(this.validationErrors).forEach(key => {
        if (key.startsWith('event_')) {
          delete this.validationErrors[key]
        }
      })

      let hasErrors = false
      this.controlData.events.forEach((event, index) => {
        if (!event.id || event.id.trim() === '') {
          this.validationErrors[`event_${index}_id`] = 'Event ID is required'
          hasErrors = true
        }
      })
      return !hasErrors
    },
    nextStep() {
      if (this.currentStep === 1) {
        // Validate all required fields for step 1
        this.validateField('displayName')
        this.validateField('tagName')
        this.validateField('icon')
        
        if (Object.keys(this.validationErrors).length > 0) {
          return
        }
      } else if (this.currentStep === 3) {
        // Validate custom properties
        if (!this.validateCustomProperties()) {
          return
        }
      } else if (this.currentStep === 4) {
        // Validate events
        if (!this.validateEvents()) {
          return
        }
      } else if (this.currentStep === 5) {
        // Validate methods
        if (!this.validateMethods()) {
          return
        }
      }
      
      if (this.canProceed && this.currentStep < this.steps.length) {
        this.currentStep++
      }
    },
    previousStep() {
      if (this.currentStep > 1) {
        this.currentStep--
      }
    },
    addCustomProperty() {
      this.controlData.customProperties.push({
        id: '',
        friendlyname: '',
        type: '',
        initialvalue: ''
      })
    },
    // List editor methods (similar to Inspector)
    isListProperty(prop) {
      return prop.type === 'listdata' || prop.type === 'drop'
    },
    getListItems(prop, propIndex) {
      // For listdata, initialvalue should be a JSON string
      // For drop, initialvalue should also be a JSON string
      if (!prop.initialvalue || typeof prop.initialvalue !== 'string') {
        return []
      }
      
      try {
        const parsed = JSON.parse(prop.initialvalue)
        return Array.isArray(parsed) ? parsed : []
      } catch (e) {
        // If parsing fails, return empty array
        return []
      }
    },
    addNewListItem(propIndex) {
      const prop = this.controlData.customProperties[propIndex]
      if (!prop) return
      
      const items = this.getListItems(prop, propIndex)
      const newItem = { value: '', display: '' }
      items.push(newItem)
      this.updateListProperty(propIndex, items)
      // Start editing the new item - focus on value field
      this.startEditListItem(propIndex, items.length - 1, 'value')
    },
    handleListItemInput(propIndex, itemIndex, field, value) {
      if (!this.editingListItem || this.editingListItem.propIndex !== propIndex || this.editingListItem.itemIndex !== itemIndex) {
        // Start editing if not already editing
        this.startEditListItem(propIndex, itemIndex, field)
      }
      // Update the editing item
      if (this.editingListItem) {
        this.editingListItem.item[field] = value
      }
    },
    startEditListItem(propIndex, itemIndex, field = 'value') {
      const prop = this.controlData.customProperties[propIndex]
      if (!prop) return
      
      const items = this.getListItems(prop, propIndex)
      if (itemIndex >= 0 && itemIndex < items.length) {
        // If we're already editing the same item, preserve the existing edits and just switch fields
        if (this.editingListItem && this.editingListItem.propIndex === propIndex && this.editingListItem.itemIndex === itemIndex) {
          // Same item, just switching fields - preserve existing edits
          this.editingListItem.field = field
        } else {
          // Different item or starting fresh
          // If we were editing a different item, save it first before switching
          if (this.editingListItem && this.editingListItem.propIndex === propIndex && this.editingListItem.itemIndex !== itemIndex) {
            // Save the previous item before switching to new one
            this.saveListItem(propIndex)
          }
          // Create new copy for the new item
          this.editingListItem = {
            propIndex,
            itemIndex,
            item: { ...items[itemIndex] }, // Create a copy for editing
            field: field // Track which field to focus
          }
        }
        // Focus using unique ref
        this.$nextTick(() => {
          const refKey = `wizard-${field}-${propIndex}-${itemIndex}`
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
    handleTabKey(propIndex, itemIndex, target) {
      if (target === 'display') {
        // Tab from value to display
        this.$nextTick(() => {
          const refKey = `wizard-display-${propIndex}-${itemIndex}`
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
        this.saveListItem(propIndex)
      }
    },
    saveListItem(propIndex) {
      if (!this.editingListItem || this.editingListItem.propIndex !== propIndex) return
      
      const prop = this.controlData.customProperties[propIndex]
      if (!prop) return
      
      const items = this.getListItems(prop, propIndex)
      const { itemIndex, item } = this.editingListItem
      
      if (itemIndex >= 0 && itemIndex < items.length) {
        items[itemIndex] = { ...item } // Update the item
        this.updateListProperty(propIndex, items)
      }
      
      this.editingListItem = null
    },
    deleteListItem(propIndex, itemIndex) {
      const prop = this.controlData.customProperties[propIndex]
      if (!prop) return
      
      const items = this.getListItems(prop, propIndex)
      
      if (itemIndex >= 0 && itemIndex < items.length) {
        items.splice(itemIndex, 1)
        this.updateListProperty(propIndex, items)
      }
      
      // Clear editing if we deleted the item being edited
      if (this.editingListItem && this.editingListItem.propIndex === propIndex && this.editingListItem.itemIndex === itemIndex) {
        this.editingListItem = null
      }
    },
    cancelEditListItem() {
      this.editingListItem = null
    },
    updateListProperty(propIndex, items) {
      const prop = this.controlData.customProperties[propIndex]
      if (!prop) return
      
      // Update the property's initialvalue as JSON string
      prop.initialvalue = JSON.stringify(items)
    },
    removeCustomProperty(index) {
      this.controlData.customProperties.splice(index, 1)
    },
    addEvent() {
      this.controlData.events.push({
        id: '',
        friendlyname: ''
      })
    },
    toggleTemplateEvent(event, isSelected) {
      if (isSelected) {
        // Add the event if it's not already present
        if (!this.controlData.events.find(e => e.id === event.id)) {
          this.controlData.events.push({
            id: event.id,
            friendlyname: event.friendlyname
          })
        }
      } else {
        // Remove the event
        const index = this.controlData.events.findIndex(e => e.id === event.id)
        if (index > -1) {
          this.controlData.events.splice(index, 1)
        }
      }
    },
    isEventSelected(eventId) {
      return this.controlData.events.some(e => e.id === eventId)
    },
    removeEvent(index) {
      this.controlData.events.splice(index, 1)
    },
    validateMethods() {
      // Clear previous validation errors for methods
      Object.keys(this.validationErrors).forEach(key => {
        if (key.startsWith('method_')) {
          delete this.validationErrors[key]
        }
      })

      let hasErrors = false
      this.controlData.methods.forEach((method, index) => {
        if (!method.id || method.id.trim() === '') {
          this.validationErrors[`method_${index}_id`] = 'Method ID is required'
          hasErrors = true
        }
        if (!method.displayname || method.displayname.trim() === '') {
          this.validationErrors[`method_${index}_displayname`] = 'Display name is required'
          hasErrors = true
        }
      })
      return !hasErrors
    },
    addMethod() {
      this.controlData.methods.push({
        id: '',
        displayname: '',
        description: '',
        returntype: 'None',
        parameters: []
      })
    },
    removeMethod(index) {
      this.controlData.methods.splice(index, 1)
    },
    getStandardPropertyPlaceholder(propId) {
      const placeholders = {
        'Width': 'e.g., 200px',
        'Height': 'e.g., 100px', 
        'IsVisible': 'true',
        'IsEnabled': 'true',
        'IsReadOnly': 'false'
        // 'Format': 'e.g., currency' // TODO: Implement format functionality
      }
      return placeholders[propId] || ''
    },
    getStandardPropertyType(propId) {
      const types = {
        'Width': 'string',
        'Height': 'string',
        'IsVisible': 'bool',
        'IsEnabled': 'bool', 
        'IsReadOnly': 'bool'
        // 'Format': 'string' // TODO: Implement format functionality
      }
      return types[propId] || 'string'
    },
    createManifest() {
      // Process custom properties - convert boolean to bool, text to string, and use ID as friendly name if not provided
      const processedCustomProperties = this.controlData.customProperties.map(prop => {
        const baseProp = {
          id: prop.id,
          friendlyname: prop.friendlyname || prop.id, // Use ID as fallback
          type: prop.type === 'boolean' ? 'bool' : (prop.type === 'text' ? 'string' : prop.type),
          initialvalue: prop.initialvalue || ''
        }
        
        // For listdata properties, add required fields
        if (prop.type === 'listdata') {
          baseProp.refreshdisplay = 'true'
          baseProp.category = 'Detail'
          // Ensure initialvalue is a valid JSON string array
          if (!baseProp.initialvalue || baseProp.initialvalue.trim() === '') {
            baseProp.initialvalue = '[]'
          } else {
            // Validate it's a JSON array
            try {
              const parsed = JSON.parse(baseProp.initialvalue)
              if (!Array.isArray(parsed)) {
                baseProp.initialvalue = '[]'
              }
            } catch (e) {
              baseProp.initialvalue = '[]'
            }
          }
        }
        
        return baseProp
      })

      // Process standard property overrides - only include overrides for selected properties
      const standardOverrides = Object.keys(this.controlData.standardPropertyOverrides || {})
        .filter(key => 
          // Property must be selected AND have a non-empty override value
          this.controlData.standardProperties.includes(key) &&
          this.controlData.standardPropertyOverrides[key] && 
          this.controlData.standardPropertyOverrides[key].trim() !== ''
        )
        .map(key => ({
          id: key,
          friendlyname: key,
          type: this.getStandardPropertyType(key),
          initialvalue: this.controlData.standardPropertyOverrides[key]
        }))

      // Process events - use ID as friendly name if not provided
      const processedEvents = this.controlData.events.map(event => ({
        id: event.id,
        friendlyname: event.friendlyname || event.id // Use ID as fallback
      }))

      // Build supports array - include DataBinding if any listdata properties exist
      const supports = [...this.controlData.standardProperties]
      const hasListDataProperties = this.controlData.customProperties.some(prop => prop.type === 'listdata')
      if (hasListDataProperties && !supports.includes('DataBinding')) {
        supports.push('DataBinding')
      }
      
      const manifest = {
        icon: this.controlData.icon,
        displayName: this.controlData.displayName,
        tagName: this.controlData.tagName,
        supports: supports, // Include DataBinding if needed
        events: processedEvents,
        properties: [...standardOverrides, ...processedCustomProperties] // Add overrides to properties
      }

      // Always include required files - the choice is about file organization
      if (this.controlData.files.useSeparateFiles) {
        // Separate files approach
        manifest.runtimeScriptFileNames = ['runtime_logic.js']
        manifest.runtimeStyleFileNames = ['runtime_style.css']
        manifest.designtimeScriptFileNames = ['designtime_logic.js']
        manifest.designtimeStyleFileNames = ['designtime_style.css']
      } else {
        // Shared files approach
        manifest.runtimeScriptFileNames = ['control.js']
        manifest.runtimeStyleFileNames = ['control.css']
        manifest.designtimeScriptFileNames = ['control.js']
        manifest.designtimeStyleFileNames = ['control.css']
      }

      return manifest
    },
    async generateControl() {
      this.isGenerating = true
      try {
        // Import the file generator
        const { FileGenerator } = await import('../utils/file-generator.js')
        const generator = new FileGenerator()
        
        // Generate files
        const files = generator.generateFiles(this.controlData)
        
        // Create ZIP via server
        const response = await fetch('/api/generate-control', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            files,
            controlName: this.controlData.tagName
          })
        })

        if (response.ok) {
          const blob = await response.blob()
          const url = window.URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `${this.controlData.tagName}.zip`
          a.click()
          window.URL.revokeObjectURL(url)
        } else {
          console.error('Error generating control:', await response.text())
        }
      } catch (error) {
        console.error('Error generating control:', error)
      } finally {
        this.isGenerating = false
      }
    },
    async loadIntoWorkbench() {
      this.isLoadingIntoWorkbench = true
      this.workbenchLoadStatus = null
      
      try {
        // Import the file generator
        const { FileGenerator } = await import('../utils/file-generator.js')
        const generator = new FileGenerator()
        
        // Generate files
        const files = generator.generateFiles(this.controlData)
        
        // Send to workbench
        const response = await fetch('/api/load-to-workbench', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            files,
            controlName: this.controlData.tagName,
            displayName: this.controlData.displayName
          })
        })

        if (response.ok) {
          const result = await response.json()
          this.workbenchLoadStatus = {
            success: true,
            message: `Control loaded successfully! You can now test it in the workbench.`
          }
          
          // Emit event to parent (App.vue) to notify Inspector
          this.$emit('control-loaded', {
            controlName: this.controlData.tagName,
            displayName: this.controlData.displayName,
            manifestPath: `./Controls/${this.controlData.tagName}/manifest.json`
          })
          
          // Auto-switch to Inspector tab and select the new control
          this.$emit('switch-to-inspector', {
            manifestPath: `./Controls/${this.controlData.tagName}/manifest.json`
          })
          
          // Also trigger a refresh of the controls list to ensure the dropdown is updated
          this.$emit('refresh-controls')
        } else {
          const error = await response.json()
          this.workbenchLoadStatus = {
            success: false,
            message: `Failed to load control: ${error.error || 'Unknown error'}`
          }
        }
      } catch (error) {
        console.error('Error loading into workbench:', error)
        this.workbenchLoadStatus = {
          success: false,
          message: `Error loading control: ${error.message}`
        }
      } finally {
        this.isLoadingIntoWorkbench = false
      }
    }
  }
}
</script>

<style scoped>
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
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Ccircle cx='8' cy='8' r='3' fill='white'/%3E%3C/svg%3E") !important;
  background-size: 0.375em 0.375em !important;
  background-position: center !important;
  background-repeat: no-repeat !important;
}

/* Light mode radio buttons - blue background */
[type='radio']:checked:not(.dark *) {
  background-color: rgb(59 130 246) !important; /* blue-500 */
  border-color: rgb(59 130 246) !important;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Ccircle cx='8' cy='8' r='3' fill='white'/%3E%3C/svg%3E") !important;
  background-size: 0.375em 0.375em !important;
  background-position: center !important;
  background-repeat: no-repeat !important;
}
</style>

