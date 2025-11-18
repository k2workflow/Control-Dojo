// File generation utilities for the Wizard

export class FileGenerator {
  constructor() {
    this.templates = {
      manifest: this.loadTemplate('manifest-template.json'),
      runtimeScript: this.loadTemplate('runtime-script-template.js'),
      designtimeScript: this.loadTemplate('designtime-script-template.js'),
      runtimeStyle: this.loadTemplate('runtime-style-template.css'),
      designtimeStyle: this.loadTemplate('designtime-style-template.css')
    }
  }

  loadTemplate(templateName) {
    // In a real implementation, this would load from the templates directory
    // For now, we'll return the template content directly
    return this.getTemplateContent(templateName)
  }

  getTemplateContent(templateName) {
    const templates = {
      'manifest-template.json': `{
  "icon": "{{icon}}",
  "displayName": "{{displayName}}",
  "tagName": "{{tagName}}",
  "supports": {{supports}},
  "events": {{events}},
  "properties": {{properties}},
  "runtimeScriptFileNames": {{runtimeScripts}},
  "designtimeScriptFileNames": {{designtimeScripts}},
  "runtimeStyleFileNames": {{runtimeStyles}},
  "designtimeStyleFileNames": {{designtimeStyles}}
}`,
      'runtime-script-template.js': `// Runtime script for {{tagName}}
class {{className}} extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.initializeProperties();
    this.render();
  }

  initializeProperties() {
    {{#each standardProperties}}
    this.{{this}} = this.getAttribute('{{this}}') || '';
    {{/each}}

    {{#each customProperties}}
    this.{{id}} = this.getAttribute('{{id}}') || '{{initialvalue}}';
    {{/each}}
  }

  render() {
    this.shadowRoot.innerHTML = \`
      <style>
        :host { display: block; width: 100%; height: 100%; }
        .control-container { width: 100%; height: 100%; border: 1px solid #ccc; border-radius: 4px; padding: 8px; box-sizing: border-box; }
      </style>
      <div class="control-container">
        <p>{{displayName}} Control</p>
        <p>Tag: {{tagName}}</p>
      </div>
    \`;
  }

  {{#each standardProperties}}
  /**
   * Gets the value of the {{this}} property
   * @returns {string} The current value of {{this}}
   */
  get {{this}}() { return this.getAttribute('{{this}}'); }
  
  /**
   * Sets the value of the {{this}} property
   * @param {string} value - The new value for {{this}}
   */
  set {{this}}(value) { this.setAttribute('{{this}}', value); this.render(); }
  {{/each}}

  {{#each customProperties}}
  /**
   * Gets the value of the {{id}} property
   * @returns {{{type}}} The current value of {{id}}
   */
  get {{id}}() { return this.getAttribute('{{id}}'); }
  
  /**
   * Sets the value of the {{id}} property
   * @param {{{type}}} value - The new value for {{id}}
   */
  set {{id}}(value) { this.setAttribute('{{id}}', value); this.render(); }
  {{/each}}

  {{#each events}}
  /**
   * Triggers the {{id}} event
   * @param {Object} detail - Optional event detail data
   */
  trigger{{friendlyname}}(detail = {}) {
    const event = new CustomEvent('{{id}}', { 
      detail: { 
        source: '{{tagName}}',
        timestamp: new Date().toISOString(),
        ...detail
      } 
    });
    this.dispatchEvent(event);
  }
  {{/each}}

  {{#each methods}}
  /**
   * {{description}}
   */
  {{id}}() {
    // TODO: Implement {{displayname}} method logic
    console.log('{{displayname}} method called');
  }
  {{/each}}

  /**
   * Execute method dispatcher - routes method calls to the appropriate method
   * @param {Object} objInfo - Object containing methodName and optional parameters
   */
  execute(objInfo) {
    const method = objInfo.methodName;
    switch (method) {
      {{#each methods}}
      case "{{id}}":
        this.{{id}}();
        break;
      {{/each}}
      default:
        console.warn(\`Unknown method: \${method}\`);
    }
  }

  connectedCallback() { console.log('{{tagName}} connected'); }
  disconnectedCallback() { console.log('{{tagName}} disconnected'); }
  attributeChangedCallback(name, oldValue, newValue) { if (oldValue !== newValue) this.render(); }
  
  static get observedAttributes() {
    return [{{#each standardProperties}}'{{this}}',{{/each}}{{#each customProperties}}'{{id}}',{{/each}}];
  }
}

customElements.define('{{tagName}}', {{className}});`,
      'designtime-script-template.js': `// Design-time script for {{tagName}}
class {{className}}Designer {
  constructor() { this.control = null; }
  
  initialize(control) {
    this.control = control;
    this.setupDesignTimeBehavior();
  }

  setupDesignTimeBehavior() {
    if (!this.control) return;
    this.control.style.border = '2px dashed #3b82f6';
    this.control.style.position = 'relative';
    this.addDesignTimeOverlay();
  }

  addDesignTimeOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'design-time-overlay';
    overlay.innerHTML = \`<div style="position: absolute; top: -20px; left: 0; background: #3b82f6; color: white; padding: 2px 6px; font-size: 12px; border-radius: 2px; z-index: 1000;">{{displayName}} (Design-time)</div>\`;
    this.control.style.position = 'relative';
    this.control.appendChild(overlay);
  }

  onPropertyChanged(propertyName, newValue) {
    console.log(\`Design-time: Property \${propertyName} changed to:\`, newValue);
    if (this.control) this.control.setAttribute(propertyName, newValue);
  }
}

if (typeof K2 !== 'undefined' && K2.IsDesigner) {
  const designer = new {{className}}Designer();
  const checkForControl = () => {
    const control = document.querySelector('{{tagName}}');
    if (control) designer.initialize(control);
    else setTimeout(checkForControl, 100);
  };
  checkForControl();
}`,
      'runtime-style-template.css': `/* Runtime styles for {{tagName}} */
{{tagName}} {
  display: block; width: 100%; height: 100%; box-sizing: border-box;
}

{{tagName}} .control-container {
  width: 100%; height: 100%; border: 1px solid #d1d5db; border-radius: 6px;
  padding: 12px; background: #ffffff; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

{{tagName}} .control-container:hover {
  border-color: #3b82f6; box-shadow: 0 4px 6px rgba(59, 130, 246, 0.1);
}`,
      'designtime-style-template.css': `/* Design-time styles for {{tagName}} */
{{tagName}} {
  position: relative; border: 2px dashed #3b82f6 !important;
  background: rgba(59, 130, 246, 0.05) !important; min-height: 60px; min-width: 120px;
}

{{tagName}}::before {
  content: '{{displayName}}'; position: absolute; top: -20px; left: 0;
  background: #3b82f6; color: white; padding: 2px 8px; font-size: 12px;
  font-weight: 500; border-radius: 3px; z-index: 1000; pointer-events: none;
}`
    }
    
    return templates[templateName] || ''
  }

  generateManifest(controlData) {
    // Determine the icon to use
    let iconName = controlData.icon
    if (controlData.useDefaultIcon) {
      iconName = 'icon.svg' // Will be replaced with default icon
    } else if (controlData.iconFile) {
      iconName = controlData.iconFileName
    }

    // Process custom properties - convert boolean to bool, text to string, and use ID as friendly name if not provided
    const processedCustomProperties = controlData.customProperties.map(prop => ({
      id: prop.id,
      friendlyname: prop.friendlyname || prop.id,
      type: prop.type === 'boolean' ? 'bool' : (prop.type === 'text' ? 'string' : prop.type),
      initialvalue: prop.initialvalue || ''
    }))

    // Process standard property overrides
    const standardOverrides = Object.keys(controlData.standardPropertyOverrides || {})
      .filter(key => controlData.standardPropertyOverrides[key] && 
                     controlData.standardPropertyOverrides[key].trim() !== '')
      .map(key => ({
        id: key,
        friendlyname: key,
        type: this.getStandardPropertyType(key),
        initialvalue: controlData.standardPropertyOverrides[key]
      }))

    // Process methods - ensure returntype and parameters are set
    const processedMethods = (controlData.methods || []).map(method => ({
      id: method.id,
      displayname: method.displayname || method.id,
      returntype: method.returntype || 'None',
      description: method.description || '',
      parameters: method.parameters || []
    }))

    const manifest = {
      icon: iconName,
      displayName: controlData.displayName,
      tagName: controlData.tagName,
      supports: controlData.standardProperties, // Keep ALL standard properties in supports
      events: controlData.events,
      properties: [...standardOverrides, ...processedCustomProperties], // Add overrides to properties
      methods: processedMethods.length > 0 ? processedMethods : undefined
    }

    // Remove methods if empty to keep manifest clean
    if (!manifest.methods || manifest.methods.length === 0) {
      delete manifest.methods
    }

    // Always include required files - the choice is about file organization
    if (controlData.files.useSeparateFiles) {
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
  }

  generateFiles(controlData) {
    const files = {}
    const className = this.toPascalCase(controlData.tagName)

    // Generate manifest
    files['manifest.json'] = JSON.stringify(this.generateManifest(controlData), null, 2)

    // Handle icon file
    if (controlData.useDefaultIcon) {
      // Include the default icon
      files['icon.svg'] = this.getDefaultIconContent()
      // Include attribution README for default icon
      files['ICON_ATTRIBUTION.md'] = this.getIconAttributionContent()
    } else if (controlData.iconFile) {
      // Include the uploaded icon file
      // Note: In a real implementation, you'd need to handle the file content
      // For now, we'll just reference the filename in the manifest
    }

    // Always generate required files - choice is about organization
    if (controlData.files.useSeparateFiles) {
      // Separate files approach
      files['runtime_logic.js'] = this.processTemplate('runtime-script-template.js', {
        ...controlData,
        className
      })
      files['designtime_logic.js'] = this.processTemplate('designtime-script-template.js', {
        ...controlData,
        className
      })
      files['runtime_style.css'] = this.processTemplate('runtime-style-template.css', controlData)
      files['designtime_style.css'] = this.processTemplate('designtime-style-template.css', controlData)
    } else {
      // Shared files approach - create combined files
      files['control.js'] = this.createSharedScript(controlData, className)
      files['control.css'] = this.createSharedStyle(controlData)
    }

    return files
  }

  processTemplate(templateName, data) {
    let template = this.getTemplateContent(templateName)
    
    // Simple template processing (replace {{variable}} with data)
    Object.keys(data).forEach(key => {
      const regex = new RegExp(`{{${key}}}`, 'g')
      template = template.replace(regex, data[key])
    })

    // Handle Handlebars-style loops for standard properties
    if (data.standardProperties) {
      // Process {{#each standardProperties}} loops
      template = template.replace(/\{\{#each standardProperties\}\}([\s\S]*?)\{\{\/each\}\}/g, (match, content) => {
        return data.standardProperties.map(prop => {
          return content.replace(/\{\{this\}\}/g, prop)
        }).join('\n')
      })
      
      // Handle simple {{standardProperties}} replacement
      const standardProps = data.standardProperties.map(prop => `'${prop}'`).join(', ')
      template = template.replace(/{{standardProperties}}/g, standardProps)
    }

    // Handle Handlebars-style loops for custom properties
    if (data.customProperties) {
      // Process {{#each customProperties}} loops
      template = template.replace(/\{\{#each customProperties\}\}([\s\S]*?)\{\{\/each\}\}/g, (match, content) => {
        return data.customProperties.map(prop => {
          return content
            .replace(/\{\{id\}\}/g, prop.id)
            .replace(/\{\{type\}\}/g, prop.type)
            .replace(/\{\{initialvalue\}\}/g, prop.initialvalue || '')
            .replace(/\{\{friendlyname\}\}/g, prop.friendlyname || prop.id)
        }).join('\n')
      })
      
      // Handle simple {{customProperties}} replacement
      const customProps = data.customProperties.map(prop => `'${prop.id}'`).join(', ')
      template = template.replace(/{{customProperties}}/g, customProps)
    }

    // Handle Handlebars-style loops for events
    if (data.events) {
      // Process {{#each events}} loops
      template = template.replace(/\{\{#each events\}\}([\s\S]*?)\{\{\/each\}\}/g, (match, content) => {
        return data.events.map(event => {
          return content
            .replace(/\{\{id\}\}/g, event.id)
            .replace(/\{\{friendlyname\}\}/g, event.friendlyname || event.id)
        }).join('\n')
      })
      
      // Handle simple {{events}} replacement
      const eventsJson = JSON.stringify(data.events, null, 2)
      template = template.replace(/{{events}}/g, eventsJson)
    }

    // Handle Handlebars-style loops for methods
    if (data.methods) {
      // Process {{#each methods}} loops
      template = template.replace(/\{\{#each methods\}\}([\s\S]*?)\{\{\/each\}\}/g, (match, content) => {
        return data.methods.map(method => {
          return content
            .replace(/\{\{id\}\}/g, method.id)
            .replace(/\{\{displayname\}\}/g, method.displayname || method.id)
            .replace(/\{\{description\}\}/g, method.description || '')
        }).join('\n')
      })
      
      // Handle simple {{methods}} replacement
      const methodsJson = JSON.stringify(data.methods, null, 2)
      template = template.replace(/{{methods}}/g, methodsJson)
    }

    if (data.properties) {
      const propertiesJson = JSON.stringify(data.properties, null, 2)
      template = template.replace(/{{properties}}/g, propertiesJson)
    }

    return template
  }

  toPascalCase(str) {
    return str
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('')
  }

  getStandardPropertyType(propId) {
    const types = {
      'Width': 'string',
      'Height': 'string',
      'IsVisible': 'bool',
      'IsEnabled': 'bool', 
      'IsReadOnly': 'bool',
      'Format': 'string'
    }
    return types[propId] || 'string'
  }

  getDefaultIconContent() {
    return `<?xml version="1.0" encoding="utf-8"?>
<svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M12.7848 0.449982C13.8239 0.449982 14.7167 1.16546 14.9122 2.15495L14.9991 2.59495C15.3408 4.32442 17.1859 5.35722 18.9016 4.7794L19.3383 4.63233C20.3199 4.30175 21.4054 4.69358 21.9249 5.56605L22.7097 6.88386C23.2293 7.75636 23.0365 8.86366 22.2504 9.52253L21.9008 9.81555C20.5267 10.9672 20.5267 13.0328 21.9008 14.1844L22.2504 14.4774C23.0365 15.1363 23.2293 16.2436 22.7097 17.1161L21.925 18.4339C21.4054 19.3064 20.3199 19.6982 19.3382 19.3676L18.9017 19.2205C17.1859 18.6426 15.3408 19.6754 14.9991 21.405L14.9122 21.845C14.7167 22.8345 13.8239 23.55 12.7848 23.55H11.2152C10.1761 23.55 9.28331 22.8345 9.08781 21.8451L9.00082 21.4048C8.65909 19.6754 6.81395 18.6426 5.09822 19.2205L4.66179 19.3675C3.68016 19.6982 2.59465 19.3063 2.07505 18.4338L1.2903 17.1161C0.770719 16.2436 0.963446 15.1363 1.74956 14.4774L2.09922 14.1844C3.47324 13.0327 3.47324 10.9672 2.09922 9.8156L1.74956 9.52254C0.963446 8.86366 0.77072 7.75638 1.2903 6.8839L2.07508 5.56608C2.59466 4.69359 3.68014 4.30176 4.66176 4.63236L5.09831 4.77939C6.81401 5.35722 8.65909 4.32449 9.00082 2.59506L9.0878 2.15487C9.28331 1.16542 10.176 0.449982 11.2152 0.449982H12.7848ZM12 15.3C13.8225 15.3 15.3 13.8225 15.3 12C15.3 10.1774 13.8225 8.69998 12 8.69998C10.1774 8.69998 8.69997 10.1774 8.69997 12C8.69997 13.8225 10.1774 15.3 12 15.3Z" fill="#000000"/>
</svg>`
  }

  getIconAttributionContent() {
    return `# Icon Attribution

## Default Icon Information
This control uses the default icon provided by the Control Dojo.

**Icon Details:**
- **Icon**: Gear/Control Icon
- **Collection**: Wolf Kit Solid Glyph Icons  
- **License**: CC Attribution License
- **Author**: thewolfkit
- **Source**: https://www.svgrepo.com/svg/491415/gear

## License Compliance
This icon is provided under the Creative Commons Attribution License. The attribution requirements are automatically satisfied by including this file in your control package.

## Usage Rights
You are free to:
- Share — copy and redistribute the material in any medium or format
- Adapt — remix, transform, and build upon the material for any purpose, even commercially

## Attribution Statement
Icon by thewolfkit from SVGRepo (https://www.svgrepo.com/svg/491415/gear) - Licensed under CC Attribution License

---
*This attribution file is automatically generated by the Control Dojo when using the default icon.*`
  }

  createSharedScript(controlData, className) {
    // Create a combined script that works for both runtime and design-time
    return `// Combined script for ${controlData.tagName}
// Generated by Control Dojo

class ${className} extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.initializeProperties();
    this.render();
  }

  initializeProperties() {
    // Standard properties
    ${controlData.standardProperties.map(prop => `this.${prop} = this.getAttribute('${prop}') || '';`).join('\n    ')}

    // Custom properties
    ${controlData.customProperties.map(prop => `this.${prop.id} = this.getAttribute('${prop.id}') || '${prop.initialvalue}';`).join('\n    ')}
  }

  render() {
    const isDesignTime = typeof K2 !== 'undefined' && K2.IsDesigner;
    
    this.shadowRoot.innerHTML = \`
      <style>
        :host {
          display: block;
          width: 100%;
          height: 100%;
          box-sizing: border-box;
        }
        
        .control-container {
          width: 100%;
          height: 100%;
          border: 1px solid #ccc;
          border-radius: 4px;
          padding: 8px;
          box-sizing: border-box;
          \${isDesignTime ? 'border: 2px dashed #3b82f6 !important; background: rgba(59, 130, 246, 0.05) !important;' : ''}
        }
      </style>
      <div class="control-container">
        <p>${controlData.displayName} Control</p>
        <p>Tag: ${controlData.tagName}</p>
        \${isDesignTime ? '<p style="color: #3b82f6; font-size: 12px;">(Design-time)</p>' : ''}
      </div>
    \`;
  }

  // Custom property getters and setters
  ${controlData.customProperties.map(prop => `
  /**
   * Gets the value of the ${prop.id} property
   * @returns {${prop.type}} The current value of ${prop.id}
   */
  get ${prop.id}() {
    return this.getAttribute('${prop.id}');
  }

  /**
   * Sets the value of the ${prop.id} property
   * @param {${prop.type}} value - The new value for ${prop.id}
   */
  set ${prop.id}(value) {
    this.setAttribute('${prop.id}', value);
    this.render();
  }`).join('')}

  // Event methods
  ${controlData.events.map(event => `
  /**
   * Triggers the ${event.id} event
   * @param {Object} detail - Optional event detail data
   */
  trigger${event.friendlyname || event.id}(detail = {}) {
    const event = new CustomEvent('${event.id}', {
      detail: { 
        source: '${controlData.tagName}',
        timestamp: new Date().toISOString(),
        ...detail
      }
    });
    this.dispatchEvent(event);
  }`).join('')}

  // Control methods
  ${(controlData.methods || []).map(method => `
  /**
   * ${method.description || method.displayname || method.id}
   */
  ${method.id}() {
    // TODO: Implement ${method.displayname || method.id} method logic
    console.log('${method.displayname || method.id} method called');
  }`).join('')}

  /**
   * Execute method dispatcher - routes method calls to the appropriate method
   * @param {Object} objInfo - Object containing methodName and optional parameters
   */
  execute(objInfo) {
    const method = objInfo.methodName;
    switch (method) {
      ${(controlData.methods || []).map(method => `
      case "${method.id}":
        this.${method.id}();
        break;`).join('')}
      default:
        console.warn(\`Unknown method: \${method}\`);
    }
  }

  // Lifecycle methods
  connectedCallback() {
    console.log('${controlData.tagName} connected');
  }

  disconnectedCallback() {
    console.log('${controlData.tagName} disconnected');
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  static get observedAttributes() {
    return [
      ${controlData.standardProperties.map(prop => `'${prop}'`).join(',\n      ')},
      ${controlData.customProperties.map(prop => `'${prop.id}'`).join(',\n      ')}
    ];
  }
}

// Register the custom element
customElements.define('${controlData.tagName}', ${className});`
  }

  createSharedStyle(controlData) {
    // Create a combined style that works for both runtime and design-time
    return `/* Combined styles for ${controlData.tagName} */
/* Generated by Control Dojo */

${controlData.tagName} {
  display: block;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

${controlData.tagName} .control-container {
  width: 100%;
  height: 100%;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 12px;
  background: #ffffff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

${controlData.tagName} .control-container:hover {
  border-color: #3b82f6;
  box-shadow: 0 4px 6px rgba(59, 130, 246, 0.1);
}

/* Design-time specific styles */
${controlData.tagName}[data-design-time="true"] {
  border: 2px dashed #3b82f6 !important;
  background: rgba(59, 130, 246, 0.05) !important;
  min-height: 60px;
  min-width: 120px;
}

${controlData.tagName}[data-design-time="true"]::before {
  content: '${controlData.displayName}';
  position: absolute;
  top: -20px;
  left: 0;
  background: #3b82f6;
  color: white;
  padding: 2px 8px;
  font-size: 12px;
  font-weight: 500;
  border-radius: 3px;
  z-index: 1000;
  pointer-events: none;
}

/* Responsive design */
@media (max-width: 768px) {
  ${controlData.tagName} .control-container {
    padding: 8px;
  }
}`
  }

  async createZip(files, controlName) {
    // This would integrate with the server to create a ZIP file
    const response = await fetch('/api/generate-control', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ files, controlName })
    })

    if (response.ok) {
      return await response.blob()
    } else {
      throw new Error('Failed to create ZIP file')
    }
  }

  generateRuntimeStyle(controlData) {
    return this.processTemplate('runtime-style-template.css', controlData)
  }

  generateDesigntimeStyle(controlData) {
    return this.processTemplate('designtime-style-template.css', controlData)
  }

  generateDefaultIcon(controlData) {
    // Generate a simple SVG icon based on control type
    const iconType = this.getIconTypeForControl(controlData.displayName)
    
    return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${this.getIconPath(iconType)}
</svg>`
  }

  getIconTypeForControl(controlType) {
    const type = controlType.toLowerCase()
    if (type.includes('file') || type.includes('upload')) return 'upload'
    if (type.includes('calendar') || type.includes('date')) return 'calendar'
    if (type.includes('data') || type.includes('display')) return 'data'
    if (type.includes('markdown') || type.includes('text')) return 'text'
    if (type.includes('location') || type.includes('map')) return 'location'
    return 'default'
  }

  getIconPath(iconType) {
    const paths = {
      upload: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>',
      calendar: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>',
      data: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>',
      text: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>',
      location: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>',
      default: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>'
    }
    
    return `<path stroke="currentColor" stroke-width="2" fill="none" d="${paths[iconType] || paths.default}"/>`
  }
}
