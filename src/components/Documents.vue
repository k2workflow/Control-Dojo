<template>
  <div class="min-h-screen transition-colors duration-200" :class="isDarkMode ? 'bg-dark-900' : 'bg-gray-50'">
    <!-- Header -->
    <div class="border-b transition-colors duration-200" :class="isDarkMode ? 'border-dark-700 bg-dark-800' : 'border-gray-200 bg-white'">
      <div class="w-full px-4 sm:px-6 lg:px-8">
        <div class="py-6">
          <p class="mt-2 text-lg transition-colors duration-200" :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'">
            Learn how to create custom K2 controls with our comprehensive guides and examples.
          </p>
        </div>
      </div>
    </div>

    <!-- Main Content with Sidebar -->
    <div class="flex flex-1 overflow-hidden">
      <!-- Sidebar Navigation -->
      <aside 
        class="w-64 flex-shrink-0 border-r transition-colors duration-200 overflow-y-auto"
        :class="isDarkMode ? 'border-dark-700 bg-dark-800' : 'border-gray-200 bg-white'"
        style="height: calc(100vh - 8rem);"
      >
        <nav class="p-4 space-y-1">
          <!-- Overview / Getting Started Section -->
          <div class="mb-6">
            <h2 
              class="px-3 py-2 text-xs font-semibold uppercase tracking-wider transition-colors duration-200"
              :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'"
            >
              Start Here
            </h2>
            <div class="mt-2 space-y-1">
              <button
                v-for="doc in startHereDocs"
                :key="doc.index"
                @click="selectDocument(doc.index, doc.filename)"
                :class="[
                  'w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer',
                  selectedDocument === doc.index
                    ? (isDarkMode 
                        ? 'bg-orange-600 text-white' 
                        : 'bg-blue-600 text-white')
                    : (isDarkMode 
                        ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900')
                ]"
              >
                {{ doc.title }}
              </button>
            </div>
          </div>

          <!-- Core Guides Section -->
          <div class="mb-6">
            <h2 
              class="px-3 py-2 text-xs font-semibold uppercase tracking-wider transition-colors duration-200"
              :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'"
            >
              Core Guides
            </h2>
            <div class="mt-2 space-y-1">
              <button
                v-for="doc in coreDocs"
                :key="doc.index"
                @click="selectDocument(doc.index, doc.filename)"
                :class="[
                  'w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer',
                  selectedDocument === doc.index
                    ? (isDarkMode 
                        ? 'bg-orange-600 text-white' 
                        : 'bg-blue-600 text-white')
                    : (isDarkMode 
                        ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900')
                ]"
              >
                {{ doc.title }}
              </button>
            </div>
          </div>

          <!-- Advanced Section -->
          <div class="mb-6">
            <h2 
              class="px-3 py-2 text-xs font-semibold uppercase tracking-wider transition-colors duration-200"
              :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'"
            >
              Advanced
            </h2>
            <div class="mt-2 space-y-1">
              <button
                v-for="doc in advancedDocs"
                :key="doc.index"
                @click="selectDocument(doc.index, doc.filename)"
                :class="[
                  'w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer',
                  selectedDocument === doc.index
                    ? (isDarkMode 
                        ? 'bg-orange-600 text-white' 
                        : 'bg-blue-600 text-white')
                    : (isDarkMode 
                        ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900')
                ]"
              >
                {{ doc.title }}
              </button>
            </div>
          </div>
        </nav>
      </aside>

      <!-- Main Content Area -->
      <main class="flex-1 overflow-y-auto" style="height: calc(100vh - 8rem);">
        <div class="w-full h-full px-4 sm:px-6 lg:px-8 py-8">
          <div v-if="loading" class="flex items-center justify-center h-full">
            <div class="flex flex-col items-center space-y-4">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2" :class="isDarkMode ? 'border-orange-500' : 'border-blue-600'"></div>
              <p class="text-sm font-medium" :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'">Loading documents...</p>
            </div>
          </div>
          
          <div v-else-if="error" :class="['mb-6 p-4 border rounded-lg shadow-sm', isDarkMode ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200']">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <svg class="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3 flex-1">
                <h3 :class="['text-lg font-semibold mb-2', isDarkMode ? 'text-red-200' : 'text-red-800']">Error Loading Documents</h3>
                <p :class="['text-sm mb-4', isDarkMode ? 'text-red-300' : 'text-red-700']">{{ error }}</p>
                <button 
                  @click="loadDocuments" 
                  :class="[
                    'inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
                    isDarkMode 
                      ? 'bg-orange-600 text-white hover:bg-orange-700 focus:ring-orange-500' 
                      : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
                  ]"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Try Again
                </button>
              </div>
            </div>
          </div>

          <div v-else class="w-full h-full">
            <div class="max-w-none w-full">
              <div v-html="renderedContent" class="markdown-content transition-colors duration-200" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;"></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import MarkdownIt from 'markdown-it'
import DOMPurify from 'dompurify'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'

export default {
  name: 'Documents',
  props: {
    isDarkMode: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      documents: [],
      selectedDocument: 0,
      loading: true,
      error: null,
      md: null
    }
  },
  computed: {
    renderedContent() {
      if (!this.documents[this.selectedDocument]) {
        return ''
      }
      
      const rawContent = this.documents[this.selectedDocument].content
      return this.parseMarkdown(rawContent)
    },
    startHereDocs() {
      // Overview and Getting Started - maintain order
      const startHereOrder = ['Overview.md', 'Getting Started.md']
      return this.documents
        .map((doc, originalIndex) => ({ ...doc, index: originalIndex }))
        .filter((doc) => startHereOrder.includes(doc.filename))
        .sort((a, b) => {
          const indexA = startHereOrder.indexOf(a.filename)
          const indexB = startHereOrder.indexOf(b.filename)
          return indexA - indexB
        })
    },
    coreDocs() {
      // Manifest Configuration, Standard Properties, Form View Validation, Triggering Control Methods, Responsive Controls - maintain order
      const coreOrder = [
        'Manifest Configuration.md',
        'Standard Properties.md',
        'Form View Validation.md',
        'Triggering Control Methods.md',
        'Responsive Controls.md'
      ]
      return this.documents
        .map((doc, originalIndex) => ({ ...doc, index: originalIndex }))
        .filter((doc) => coreOrder.includes(doc.filename))
        .sort((a, b) => {
          const indexA = coreOrder.indexOf(a.filename)
          const indexB = coreOrder.indexOf(b.filename)
          return indexA - indexB
        })
    },
    advancedDocs() {
      // Script References, Data Binding, Style Integration, Localization - maintain order
      const advancedOrder = [
        'Script References.md',
        'Data Binding.md',
        'Style Integration.md',
        'Localization.md'
      ]
      return this.documents
        .map((doc, originalIndex) => ({ ...doc, index: originalIndex }))
        .filter((doc) => advancedOrder.includes(doc.filename))
        .sort((a, b) => {
          const indexA = advancedOrder.indexOf(a.filename)
          const indexB = advancedOrder.indexOf(b.filename)
          return indexA - indexB
        })
    }
  },
  watch: {
    // Watch for URL changes when component is already mounted
    '$route'(to, from) {
      // Vue router not used, but we can watch window.location
    },
    selectedDocument(newIndex, oldIndex) {
      // Document selection changed
    }
  },
  mounted() {
    this.initializeMarkdown()
    this.loadDocuments()
    this.setupLinkHandling()
    // Read URL after a short delay to ensure documents are loaded
    this.$nextTick(() => {
      // If documents are already loaded, read URL immediately
      if (this.documents.length > 0) {
        this.readUrlForDocument()
      }
      // Otherwise, readUrlForDocument will be called after loadDocuments completes
    })
    // Listen for URL changes (back/forward buttons)
    this.popstateHandler = () => {
      this.readUrlForDocument()
    }
    window.addEventListener('popstate', this.popstateHandler)
  },
  beforeUnmount() {
    if (this.popstateHandler) {
      window.removeEventListener('popstate', this.popstateHandler)
    }
  },
  methods: {
    initializeMarkdown() {
      // Initialize markdown-it with proper configuration
      this.md = new MarkdownIt({
        html: true,         // Allow HTML tags for proper rendering
        linkify: true,      // Auto-convert URLs to links
        typographer: true,  // Smart quotes, dashes, etc.
        breaks: false,     // Don't convert \n to <br> to preserve formatting
        highlight: function (str, lang) {
          if (lang && hljs.getLanguage(lang)) {
            try {
              // Properly escape HTML and mark as highlighted to prevent re-processing
              const highlighted = hljs.highlight(str, { language: lang }).value
              return '<pre class="hljs"><code class="language-' + lang + '" data-highlighted="true">' +
                     highlighted +
                     '</code></pre>';
            } catch (__) {
              // Fallback to escaped HTML if highlighting fails
              return '<pre class="hljs"><code data-highlighted="true">' + 
                     str.replace(/[<>&"']/g, function(m) {
                       return {
                         '<': '&lt;',
                         '>': '&gt;',
                         '&': '&amp;',
                         '"': '&quot;',
                         "'": '&#39;'
                       }[m];
                     }) + 
                     '</code></pre>';
            }
          }
          return '<pre class="hljs"><code data-highlighted="true">' +
                 str.replace(/[<>&"']/g, function(m) {
                   return {
                     '<': '&lt;',
                     '>': '&gt;',
                     '&': '&amp;',
                     '"': '&quot;',
                     "'": '&#39;'
                   }[m];
                 }) + 
                 '</code></pre>';
        }
      })
    },
    
    async loadDocuments() {
      this.loading = true
      this.error = null
      
      try {
        const response = await fetch('/api/docs')
        
        if (!response.ok) {
          throw new Error(`Failed to load documents: ${response.status} ${response.statusText}`)
        }
        
        const docList = await response.json()
        
        if (!Array.isArray(docList) || docList.length === 0) {
          this.documents = []
          return
        }
        
        // Load content for each document
        const documents = await Promise.all(
          docList.map(async (doc) => {
            try {
              const contentResponse = await fetch(`/api/docs/${doc.filename}`)
              
              if (!contentResponse.ok) {
                throw new Error(`Failed to load ${doc.filename}: ${contentResponse.status} ${contentResponse.statusText}`)
              }
              
              const content = await contentResponse.text()
              
              return {
                filename: doc.filename,
                title: doc.title,
                content
              }
            } catch (error) {
              return {
                filename: doc.filename,
                title: doc.title,
                content: `# Error Loading Document\n\nCould not load ${doc.filename}: ${error.message}`
              }
            }
          })
        )
        
        this.documents = documents
        
        // Try to read document from URL, otherwise default to Overview
        const urlDocIndex = this.getDocumentFromUrl()
        if (urlDocIndex === null) {
          // Check if we're on root - if so, default to Overview
          const pathname = window.location.pathname
          if (!pathname || pathname === '/' || pathname === '/index.html') {
            this.selectedDocument = 0 // Start with Overview if on root
          }
        }
        
        // Handle hash fragment for scrolling
        if (window.location.hash) {
          this.$nextTick(() => {
            this.scrollToHash(window.location.hash)
          })
        }
      } catch (error) {
        console.error('Error loading documents:', error)
        this.error = error.message
      } finally {
        this.loading = false
      }
    },
    
    
    parseMarkdown(text) {
      if (!text || !this.md) {
        return ''
      }
      
      try {
        // Parse markdown to HTML
        const html = this.md.render(text)
        
        // Sanitize HTML for security
        const sanitizedHtml = DOMPurify.sanitize(html, {
          ALLOWED_TAGS: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'strong', 'em', 'code', 'pre', 'blockquote', 'ul', 'ol', 'li', 'a', 'hr', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'div', 'span'],
          ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'id', 'style'],
          ADD_ATTR: ['target', 'rel']
        })
        
        // Apply syntax highlighting after DOM is updated
        this.$nextTick(() => {
          this.applySyntaxHighlighting()
          // Link handling is set up once in mounted() using event delegation
        })
        
        return sanitizedHtml
      } catch (error) {
        return `<div class="error">Error parsing markdown: ${error.message}</div>`
      }
    },
    
    applySyntaxHighlighting() {
      // Apply syntax highlighting to any code blocks that weren't processed by markdown-it
      // Check for already highlighted blocks to prevent re-highlighting
      const codeBlocks = document.querySelectorAll('.markdown-content pre code:not(.hljs):not([data-highlighted="true"])')
      codeBlocks.forEach(block => {
        try {
          // Mark as highlighted before processing to prevent re-highlighting
          block.setAttribute('data-highlighted', 'true')
          
          // Additional safety check to prevent highlighting already processed content
          if (block.innerHTML.includes('<span class="hljs')) {
            return
          }
          
          hljs.highlightElement(block)
        } catch (error) {
          // Remove the marker if highlighting failed
          block.removeAttribute('data-highlighted')
        }
      })
    },
    
    setupLinkHandling() {
      // Intercept clicks on markdown links within the content area
      // Use event delegation on the main container to avoid issues with Vue updating the DOM
      const mainContainer = this.$el?.querySelector('main')
      if (!mainContainer) return
      
      // Remove any existing listener by checking if we've already added one
      if (mainContainer.hasAttribute('data-link-handler-attached')) {
        return // Already has handler attached
      }
      
      // Mark that we've attached the handler
      mainContainer.setAttribute('data-link-handler-attached', 'true')
      
      // Use event delegation - listen on main container, but only handle clicks on .markdown-content links
      mainContainer.addEventListener('click', (e) => {
        // Only handle clicks within markdown content
        const contentArea = e.target.closest('.markdown-content')
        if (!contentArea) return
        
        const link = e.target.closest('a')
        if (!link || !link.href) return
        
        try {
          const linkUrl = new URL(link.href, window.location.href)
          const currentUrl = new URL(window.location.href)
          
          // Handle relative .md file links
          if (linkUrl.origin === currentUrl.origin) {
            const pathname = linkUrl.pathname
            // Check if it's a .md file link
            if (pathname.endsWith('.md') || pathname.match(/\.md[#?]/)) {
              e.preventDefault()
              
              // Extract filename from path
              const filename = decodeURIComponent(pathname.split('/').pop().split('#')[0].split('?')[0])
              
              // Find document index by filename
              const docIndex = this.findDocumentIndexByFilename(filename)
              if (docIndex !== -1) {
                this.selectedDocument = docIndex
                // Update URL without hash first, then add hash if present
                const newPath = `/${encodeURIComponent(filename)}`
                const hash = linkUrl.hash || ''
                history.pushState(null, '', newPath + hash)
                
                // Scroll to hash target if present
                if (hash) {
                  this.$nextTick(() => {
                    this.scrollToHash(hash)
                  })
                }
              }
              return false
            }
            
            // Handle anchor links (hash fragments) within the same document
            if (linkUrl.pathname === currentUrl.pathname && linkUrl.hash) {
              e.preventDefault()
              this.scrollToHash(linkUrl.hash)
              history.pushState(null, '', linkUrl.href)
              return false
            }
          }
        } catch (error) {
          // Allow default behavior if parsing fails
        }
      })
    },
    
    findDocumentIndexByFilename(filename) {
      // Try exact match first
      let index = this.documents.findIndex(doc => doc.filename === filename)
      if (index !== -1) return index
      
      // Try with .md extension if not present
      if (!filename.endsWith('.md')) {
        index = this.documents.findIndex(doc => doc.filename === `${filename}.md`)
        if (index !== -1) return index
      }
      
      // Try without .md extension
      const nameWithoutExt = filename.replace(/\.md$/, '')
      index = this.documents.findIndex(doc => doc.filename.replace(/\.md$/, '') === nameWithoutExt)
      if (index !== -1) return index
      
      return -1
    },
    
    getDocumentFromUrl() {
      try {
        const pathname = window.location.pathname
        if (!pathname || pathname === '/' || pathname === '/index.html') {
          return null
        }
        
        // Extract filename from path
        const filename = decodeURIComponent(pathname.split('/').pop().split('#')[0].split('?')[0])
        if (!filename || !filename.endsWith('.md')) {
          return null
        }
        
        const docIndex = this.findDocumentIndexByFilename(filename)
        
        if (docIndex !== -1) {
          this.selectedDocument = docIndex
          return docIndex
        }
      } catch (error) {
        // Error reading URL, return null
      }
      return null
    },
    
    readUrlForDocument() {
      if (this.documents.length === 0) {
        // Documents not loaded yet, will be called again after load
        return
      }
      
      const docIndex = this.getDocumentFromUrl()
      if (docIndex === null && window.location.pathname === '/' || window.location.pathname === '/index.html') {
        // Default to Overview if on root
        this.selectedDocument = 0
      }
      
      // Handle hash fragment for scrolling
      if (window.location.hash) {
        this.$nextTick(() => {
          this.scrollToHash(window.location.hash)
        })
      }
    },
    
    scrollToHash(hash) {
      if (!hash) return
      
      // Remove the # from hash
      const id = hash.substring(1)
      if (!id) return
      
      // Try to find element by ID
      let element = document.getElementById(id)
      if (!element) {
        // Try to find by name attribute (for anchor tags)
        element = document.querySelector(`a[name="${id}"]`)
      }
      if (!element) {
        // Try to find heading with matching text (convert kebab-case to title case)
        const headingText = id.split('-').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ')
        const headings = document.querySelectorAll('.markdown-content h1, .markdown-content h2, .markdown-content h3, .markdown-content h4, .markdown-content h5, .markdown-content h6')
        for (const heading of headings) {
          if (heading.textContent.trim().toLowerCase().includes(headingText.toLowerCase())) {
            element = heading
            break
          }
        }
      }
      
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    },
    
    selectDocument(index, filename) {
      // Ensure index is valid
      if (index >= 0 && index < this.documents.length) {
        this.selectedDocument = index
        
        // Update URL to reflect selected document
        const encodedFilename = encodeURIComponent(filename)
        history.pushState(null, '', `/${encodedFilename}`)
      }
    }
  }
}
</script>

<style>
/* Scrollbar styling for sidebar */
aside::-webkit-scrollbar {
  width: 6px;
}

aside::-webkit-scrollbar-track {
  background: transparent;
}

aside::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.dark aside::-webkit-scrollbar-thumb {
  background: #475569;
}

aside::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.dark aside::-webkit-scrollbar-thumb:hover {
  background: #64748b;
}

/* Main content scrollbar */
main::-webkit-scrollbar {
  width: 8px;
}

main::-webkit-scrollbar-track {
  background: transparent;
}

main::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.dark main::-webkit-scrollbar-thumb {
  background: #475569;
}

main::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.dark main::-webkit-scrollbar-thumb:hover {
  background: #64748b;
}

/* Enhanced markdown styling with proper specificity */
.markdown-content {
  line-height: 1.6;
  color: #111827;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
}

.dark .markdown-content {
  color: #f9fafb;
}

/* Headers with proper styling */
.markdown-content h1 {
  font-family: 'Poppins', sans-serif !important;
  font-size: 3rem !important;
  font-weight: 700 !important;
  margin: 1.5rem 0 1rem 0 !important;
  color: #111827 !important;
  display: block !important;
  line-height: 1.2 !important;
}

.dark .markdown-content h1 {
  color: #f9fafb !important;
}

.markdown-content h2 {
  font-size: 1.5rem !important;
  font-weight: 600 !important;
  margin: 1.25rem 0 0.75rem 0 !important;
  color: #111827 !important;
  display: block !important;
  line-height: 1.3 !important;
}

.dark .markdown-content h2 {
  color: #f9fafb !important;
}

.markdown-content h3 {
  font-size: 1.25rem !important;
  font-weight: 600 !important;
  margin: 1rem 0 0.5rem 0 !important;
  color: #111827 !important;
  display: block !important;
  line-height: 1.4 !important;
}

.dark .markdown-content h3 {
  color: #f9fafb !important;
}

.markdown-content h4 {
  font-size: 1.125rem !important;
  font-weight: 600 !important;
  margin: 0.75rem 0 0.5rem 0 !important;
  color: #111827 !important;
  display: block !important;
}

.dark .markdown-content h4 {
  color: #f9fafb !important;
}

/* Paragraphs */
.markdown-content p {
  margin: 0.75rem 0 !important;
  color: #111827 !important;
  display: block !important;
  line-height: 1.6 !important;
}

.dark .markdown-content p {
  color: #f9fafb !important;
}

/* Lists with proper bullet points */
.markdown-content ul,
.markdown-content ol {
  margin: 0.75rem 0 !important;
  padding-left: 1.5rem !important;
  display: block !important;
}

.markdown-content ul {
  list-style-type: disc !important;
  list-style-position: outside !important;
}

.markdown-content ol {
  list-style-type: decimal !important;
  list-style-position: outside !important;
}

.markdown-content li {
  margin: 0.25rem 0 !important;
  color: #111827 !important;
  display: list-item !important;
  line-height: 1.6 !important;
  list-style-position: outside !important;
}

.dark .markdown-content li {
  color: #f9fafb !important;
}

/* Nested lists */
.markdown-content ul ul,
.markdown-content ol ol,
.markdown-content ul ol,
.markdown-content ol ul {
  margin: 0.25rem 0 !important;
  padding-left: 1.25rem !important;
}

.markdown-content ul ul {
  list-style-type: circle !important;
}

.markdown-content ul ul ul {
  list-style-type: square !important;
}

/* Strong and emphasis */
.markdown-content strong {
  font-weight: 700 !important;
  color: inherit !important;
}

.markdown-content em {
  font-style: italic !important;
  color: inherit !important;
}

/* Ensure proper spacing and layout */
.markdown-content > *:first-child {
  margin-top: 0 !important;
}

.markdown-content > *:last-child {
  margin-bottom: 0 !important;
}

/* Better visual hierarchy */
.markdown-content h1 + h2,
.markdown-content h2 + h3,
.markdown-content h3 + h4 {
  margin-top: 0.5rem !important;
}

/* Code blocks styling */
.markdown-content pre {
  background-color: #1e293b !important;
  border: 1px solid #334155 !important;
  border-radius: 0.5rem !important;
  padding: 1rem !important;
  overflow-x: auto !important;
  margin: 1rem 0 !important;
  white-space: pre !important;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace !important;
  font-size: 0.875rem !important;
  line-height: 1.5 !important;
}

.dark .markdown-content pre {
  background-color: #1e293b !important;
  border-color: #334155 !important;
}

.markdown-content pre code {
  background: none !important;
  padding: 0 !important;
  color: inherit !important;
  font-family: inherit !important;
  font-size: inherit !important;
  line-height: inherit !important;
  white-space: pre !important;
  display: block !important;
}

/* Inline code */
.markdown-content code {
  background-color: #f3f4f6;
  color: #374151;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

.dark .markdown-content code {
  background-color: #374151;
  color: #d1d5db;
}

/* Links */
.markdown-content a {
  color: #2563eb;
  text-decoration: underline;
}

.markdown-content a:hover {
  color: #1d4ed8;
}

.dark .markdown-content a {
  color: #60a5fa;
}

.dark .markdown-content a:hover {
  color: #93c5fd;
}

/* Blockquotes */
.markdown-content blockquote {
  border-left: 4px solid #3b82f6;
  padding-left: 1rem;
  margin: 1rem 0;
  font-style: italic;
  color: #4b5563;
  background-color: #f8fafc;
}

.dark .markdown-content blockquote {
  color: #d1d5db;
  background-color: #1f2937;
}

/* Syntax highlighting with highlight.js */
.markdown-content .hljs {
  color: #e2e8f0 !important;
  padding: 5px !important;
}

.dark .markdown-content .hljs {
  background: #12161c !important;
  color: #e2e8f0 !important;
}

.light .markdown-content .hljs {
  background:#e5e7eb !important;
  border: 1px solid #e5e7eb !important;
  color: #1f2937 !important;
}

/* Syntax highlighting colors */
.markdown-content .hljs-keyword,
.markdown-content .hljs-selector-tag,
.markdown-content .hljs-built_in,
.markdown-content .hljs-name,
.markdown-content .hljs-tag {
  color: #1e40af !important;
}

.dark .markdown-content .hljs-keyword,
.dark .markdown-content .hljs-selector-tag,
.dark .markdown-content .hljs-built_in,
.dark .markdown-content .hljs-name,
.dark .markdown-content .hljs-tag {
  color: #a78bfa !important;
}

.markdown-content .hljs-string,
.markdown-content .hljs-title,
.markdown-content .hljs-section,
.markdown-content .hljs-attribute,
.markdown-content .hljs-literal,
.markdown-content .hljs-template-tag,
.markdown-content .hljs-template-variable,
.markdown-content .hljs-type,
.markdown-content .hljs-addition {
  color: #166534 !important;
}

.dark .markdown-content .hljs-string,
.dark .markdown-content .hljs-title,
.dark .markdown-content .hljs-section,
.dark .markdown-content .hljs-attribute,
.dark .markdown-content .hljs-literal,
.dark .markdown-content .hljs-template-tag,
.dark .markdown-content .hljs-template-variable,
.dark .markdown-content .hljs-type,
.dark .markdown-content .hljs-addition {
  color: #34d399 !important;
}

.markdown-content .hljs-comment,
.markdown-content .hljs-quote,
.markdown-content .hljs-deletion,
.markdown-content .hljs-meta {
  color: #374151 !important;
  font-style: italic;
}

.dark .markdown-content .hljs-comment,
.dark .markdown-content .hljs-quote,
.dark .markdown-content .hljs-deletion,
.dark .markdown-content .hljs-meta {
  color: #9ca3af !important;
}

.markdown-content .hljs-number,
.markdown-content .hljs-symbol,
.markdown-content .hljs-bullet,
.markdown-content .hljs-code {
  color: #b91c1c !important;
}

.dark .markdown-content .hljs-number,
.dark .markdown-content .hljs-symbol,
.dark .markdown-content .hljs-bullet,
.dark .markdown-content .hljs-code {
  color: #f87171 !important;
}

/* Table styling */
.markdown-content table {
  border-collapse: collapse !important;
  width: 100% !important;
  margin: 1rem 0 !important;
  border: 1px solid #d1d5db !important;
  border-radius: 0.5rem !important;
  overflow: hidden !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
}

.dark .markdown-content table {
  border-color: #374151 !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3) !important;
}

.markdown-content thead {
  background-color: #f9fafb !important;
}

.dark .markdown-content thead {
  background-color: #374151 !important;
}

.markdown-content th {
  padding: 0.75rem 1rem !important;
  text-align: left !important;
  font-weight: 600 !important;
  color: #111827 !important;
  border-bottom: 1px solid #d1d5db !important;
  border-right: 1px solid #d1d5db !important;
  font-size: 0.875rem !important;
}

.dark .markdown-content th {
  color: #f9fafb !important;
  border-color: #4b5563 !important;
}

.markdown-content td {
  padding: 0.75rem 1rem !important;
  color: #111827 !important;
  border-bottom: 1px solid #e5e7eb !important;
  border-right: 1px solid #e5e7eb !important;
  vertical-align: top !important;
  font-size: 0.875rem !important;
}

.dark .markdown-content td {
  color: #f9fafb !important;
  border-color: #4b5563 !important;
}

.markdown-content tr:nth-child(even) {
  background-color: #f9fafb !important;
}

.dark .markdown-content tr:nth-child(even) {
  background-color: #1f2937 !important;
}

.markdown-content tr:hover {
  background-color: #f3f4f6 !important;
}

.dark .markdown-content tr:hover {
  background-color: #374151 !important;
}

.markdown-content th:last-child,
.markdown-content td:last-child {
  border-right: none !important;
}

.markdown-content tbody tr:last-child td {
  border-bottom: none !important;
}

.markdown-content td code {
  background-color: #f3f4f6 !important;
  color: #374151 !important;
  padding: 0.125rem 0.375rem !important;
  border-radius: 0.25rem !important;
  font-size: 0.8rem !important;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace !important;
}

.dark .markdown-content td code {
  background-color: #374151 !important;
  color: #d1d5db !important;
}
</style>
