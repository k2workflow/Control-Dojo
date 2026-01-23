<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center" :class="isDarkMode ? 'bg-black bg-opacity-70' : 'bg-black bg-opacity-50'" @click.self="close">
    <div :class="['rounded-lg shadow-xl max-w-md w-full mx-4', isDarkMode ? 'bg-dark-800 border-dark-700' : 'bg-white border-gray-200']" style="border: 1px solid;">
      <!-- Header -->
      <div class="flex items-center px-6 py-4 border-b" :class="isDarkMode ? 'border-dark-700' : 'border-gray-200'">
        <div class="flex items-center flex-1">
          <!-- Error Icon -->
          <div class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3" :class="isDarkMode ? 'bg-red-900' : 'bg-red-100'">
            <svg class="w-5 h-5" :class="isDarkMode ? 'text-red-400' : 'text-red-600'" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
            </svg>
          </div>
          <h3 :class="['text-lg font-semibold', isDarkMode ? 'text-white' : 'text-gray-900']">Error</h3>
        </div>
      </div>
      
      <!-- Message -->
      <div class="px-6 py-4">
        <p :class="['text-sm', isDarkMode ? 'text-gray-300' : 'text-gray-700']">
          {{ message }}
        </p>
      </div>
      
      <!-- Footer -->
      <div class="px-6 py-4 border-t flex justify-end" :class="isDarkMode ? 'border-dark-700' : 'border-gray-200'">
        <button
          @click="close"
          :class="[
            'px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200',
            isDarkMode 
              ? 'bg-orange-600 text-white hover:bg-orange-700 focus:ring-orange-500' 
              : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
          ]"
        >
          OK
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ValidationErrorPopup',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    message: {
      type: String,
      default: ''
    },
    isDarkMode: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    close() {
      this.$emit('close')
    }
  }
}
</script>

