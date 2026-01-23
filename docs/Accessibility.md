# Accessibility Guide for K2 Custom Controls

## Overview

This guide covers how to make K2 custom controls accessible to users with disabilities, conforming to WCAG 2.1 Level AA standards. Accessible controls work with screen readers, keyboard navigation, and assistive technologies.

## Quick Reference Checklist

- [ ] All interactive elements are keyboard accessible
- [ ] All interactive elements have accessible names (aria-label or visible text)
- [ ] Focus indicators are visible (2px outline minimum)
- [ ] Color contrast meets WCAG AA (4.5:1 for normal text, 3:1 for large text)
- [ ] Error messages are announced to screen readers
- [ ] State changes are announced (aria-live regions)
- [ ] Decorative elements are hidden from screen readers (aria-hidden)
- [ ] Form instructions are associated with inputs (aria-describedby)
- [ ] Disabled/read-only states are properly communicated

## Core Accessibility Principles

### 1. Keyboard Navigation

All interactive elements must be keyboard accessible.

**Implementation:**
```javascript
// Make element focusable
element.setAttribute('tabindex', '0');

// Handle keyboard events
element.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    // Perform action
  }
});

// Remove from tab order when disabled
if (disabled) {
  element.setAttribute('tabindex', '-1');
  element.setAttribute('aria-disabled', 'true');
}
```

**Example from Drag and Drop Control:**
```javascript
// Drop zone is keyboard accessible
<div class="drop-zone" role="button" tabindex="0" aria-label="Click here to attach a file">
  <!-- content -->
</div>

// Keyboard handler
this._dropZone.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    this._fileInput.click();
  }
});
```

### 2. Accessible Names

Every interactive element needs an accessible name that screen readers can announce.

**Methods:**
1. **Visible text** (preferred): Use visible label text
2. **aria-label**: For elements without visible text
3. **aria-labelledby**: Reference another element's ID
4. **title attribute**: Fallback (not recommended as primary method)

**Implementation:**
```javascript
// Button with visible text (best)
<button>Save File</button>

// Button with aria-label (when icon-only)
<button aria-label="Download file" title="Download file">
  <svg aria-hidden="true">...</svg>
</button>

// Input with associated label
<label for="file-input">Select file</label>
<input id="file-input" type="file" aria-describedby="file-help" />
<span id="file-help">Accepted formats: PDF, DOCX</span>
```

**Example from Drag and Drop Control:**
```javascript
// Download button has both aria-label and title
<button 
  type="button" 
  class="download-file-button" 
  title="Download file" 
  aria-label="Download file">
  <svg aria-hidden="true" focusable="false">...</svg>
</button>
```

### 3. ARIA Roles and States

Use ARIA to communicate element roles and states to assistive technologies.

**Common Roles:**
- `role="button"`: For clickable elements that aren't native buttons
- `role="alert"`: For error messages that should be announced immediately
- `role="status"`: For status updates that should be announced

**Common States:**
- `aria-disabled="true"`: Element is disabled
- `aria-hidden="true"`: Hide decorative elements from screen readers
- `aria-live="polite"`: Announce changes when user is idle
- `aria-live="assertive"`: Announce changes immediately (use sparingly)
- `aria-expanded="true/false"`: For collapsible content
- `aria-checked="true/false"`: For checkboxes/radio buttons

**Implementation:**
```javascript
// Decorative icon - hide from screen readers
<div class="icon" aria-hidden="true">
  <svg>...</svg>
</div>

// Error message - announce immediately
<div role="alert" aria-live="assertive">
  File upload failed. Please try again.
</div>

// Status update - announce politely
<div role="status" aria-live="polite">
  File uploaded successfully
</div>

// Disabled state
<button aria-disabled="true" tabindex="-1">
  Upload (disabled)
</button>
```

**Example from Drag and Drop Control:**
```javascript
// Error popup with proper ARIA
const popup = document.createElement('div');
popup.className = 'drag-drop-error-popup';
popup.setAttribute('role', 'alert');
popup.setAttribute('aria-live', 'polite');
popup.textContent = errorMessage;

// Decorative SVG icons
<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
  <!-- icon paths -->
</svg>
```

### 4. Focus Management

Visible focus indicators are essential for keyboard users.

**CSS Implementation:**
```css
/* Always provide visible focus indicators */
.interactive-element:focus-visible {
  outline: 2px solid var(--focus-color, #2563eb);
  outline-offset: 4px;
  border-radius: 2px;
}

/* Never remove outline without replacement */
.interactive-element:focus {
  outline: none; /* BAD - removes focus indicator */
}

.interactive-element:focus-visible {
  outline: 2px solid blue; /* GOOD - provides visible focus */
}
```

**Example from Drag and Drop Control:**
```css
drag-drop-control .drop-zone:focus-visible {
  outline: 2px solid var(--drag-drop-outline-color, #2563eb);
  outline-offset: 4px;
}

drag-drop-control .download-file-button:focus-visible {
  outline: 2px solid var(--drag-drop-outline-color, #2563eb);
  outline-offset: 2px;
}
```

### 5. Dynamic Content Updates

Announce changes to screen readers when content updates.

**Live Regions:**
```javascript
// Create live region for status updates
const statusRegion = document.createElement('div');
statusRegion.setAttribute('role', 'status');
statusRegion.setAttribute('aria-live', 'polite');
statusRegion.setAttribute('aria-atomic', 'true');
document.body.appendChild(statusRegion);

// Update content - screen reader will announce
statusRegion.textContent = 'File uploaded: document.pdf';
```

**Example from Drag and Drop Control:**
```javascript
// Error popup announces immediately
const popup = document.createElement('div');
popup.setAttribute('role', 'alert');
popup.setAttribute('aria-live', 'polite');
popup.textContent = errorMessage;
// Screen reader announces: "File upload failed. Please try again."
```

### 6. Form Instructions and Help Text

Associate instructions with form controls.

**Implementation:**
```javascript
// Link help text to input
<input 
  type="file" 
  id="file-input"
  aria-describedby="file-help file-format" 
  aria-required="true" />
<span id="file-help">Select a file to upload</span>
<span id="file-format">Accepted formats: PDF, DOCX, TXT</span>

// Screen reader will read: 
// "Select a file to upload, Select a file to upload. Accepted formats: PDF, DOCX, TXT"
```

### 7. Color Contrast

Ensure text meets WCAG AA contrast ratios:
- **Normal text**: 4.5:1 contrast ratio
- **Large text** (18pt+ or 14pt+ bold): 3:1 contrast ratio

**Tools:**
- Browser DevTools: Check contrast in computed styles
- Online: WebAIM Contrast Checker
- VS Code: Use color contrast extensions

**Implementation:**
```css
/* Good contrast - meets WCAG AA */
.text-primary {
  color: #1f2937; /* Dark gray on white = 12.6:1 */
}

.text-muted {
  color: #6b7280; /* Medium gray on white = 4.6:1 - passes */
}

/* Bad contrast - fails WCAG AA */
.text-bad {
  color: #cbd5e1; /* Light gray on white = 1.7:1 - fails */
}
```

### 8. Error Handling

Provide clear, accessible error messages.

**Implementation:**
```javascript
// Create accessible error message
function showError(message) {
  // Remove existing errors
  const existing = document.querySelector('.error-message');
  if (existing) existing.remove();
  
  // Create new error
  const error = document.createElement('div');
  error.className = 'error-message';
  error.setAttribute('role', 'alert');
  error.setAttribute('aria-live', 'assertive');
  error.textContent = message;
  
  // Associate with input
  input.setAttribute('aria-invalid', 'true');
  input.setAttribute('aria-describedby', 'error-message-id');
  error.id = 'error-message-id';
  
  // Insert after input
  input.parentNode.insertBefore(error, input.nextSibling);
  
  // Screen reader announces immediately
}
```

**Example from Drag and Drop Control:**
```javascript
// Error popup with proper ARIA
_createErrorPopup(message) {
  const popup = document.createElement('div');
  popup.className = 'drag-drop-error-popup';
  popup.setAttribute('role', 'alert');
  popup.setAttribute('aria-live', 'polite');
  popup.textContent = message;
  // Positioned above control, announced to screen readers
}
```

## Complete Example: Accessible File Upload Control

Here's a complete example showing all accessibility features:

```javascript
class AccessibleFileUpload extends HTMLElement {
  render() {
    this.innerHTML = `
      <div class="file-upload-container">
        <label 
          for="file-input-${this.id}" 
          class="upload-label"
          id="label-${this.id}">
          Upload File
        </label>
        <input 
          type="file" 
          id="file-input-${this.id}"
          class="file-input"
          aria-describedby="help-${this.id} error-${this.id}"
          aria-required="true"
          aria-invalid="false" />
        <span 
          id="help-${this.id}" 
          class="help-text">
          Accepted formats: PDF, DOCX, TXT. Maximum size: 5MB
        </span>
        <div 
          id="error-${this.id}" 
          role="alert" 
          aria-live="polite"
          class="error-message"
          style="display: none;">
        </div>
        <div 
          role="status" 
          aria-live="polite"
          class="status-message"
          style="display: none;">
        </div>
      </div>
    `;
    
    this.setupAccessibility();
  }
  
  setupAccessibility() {
    const input = this.querySelector('.file-input');
    const errorDiv = this.querySelector('.error-message');
    const statusDiv = this.querySelector('.status-message');
    
    input.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        // Validate
        if (this.validateFile(file)) {
          // Success - announce to screen reader
          input.setAttribute('aria-invalid', 'false');
          errorDiv.style.display = 'none';
          statusDiv.textContent = `File selected: ${file.name}`;
          statusDiv.style.display = 'block';
          // Screen reader: "File selected: document.pdf"
        } else {
          // Error - announce immediately
          input.setAttribute('aria-invalid', 'true');
          errorDiv.textContent = 'Invalid file type. Please select a PDF, DOCX, or TXT file.';
          errorDiv.style.display = 'block';
          // Screen reader: "Invalid file type. Please select a PDF, DOCX, or TXT file."
        }
      }
    });
  }
}
```

## Testing Accessibility

### Manual Testing Checklist

1. **Keyboard Navigation:**
   - [ ] Tab through all interactive elements
   - [ ] Use Enter/Space to activate buttons
   - [ ] Use arrow keys for lists/menus
   - [ ] Ensure focus order is logical

2. **Screen Reader Testing:**
   - [ ] Test with NVDA (Windows, free)
   - [ ] Test with JAWS (Windows, paid)
   - [ ] Test with VoiceOver (Mac, built-in)
   - [ ] Verify all elements are announced correctly
   - [ ] Verify error messages are announced

3. **Visual Testing:**
   - [ ] Verify focus indicators are visible
   - [ ] Check color contrast ratios
   - [ ] Test with browser zoom at 200%
   - [ ] Verify text remains readable

### Automated Testing Tools

- **axe DevTools**: Browser extension for accessibility testing
- **WAVE**: Web accessibility evaluation tool
- **Lighthouse**: Built into Chrome DevTools (Accessibility audit)
- **Pa11y**: Command-line accessibility testing

## Common Accessibility Mistakes

### ❌ Bad Examples

```javascript
// BAD: No accessible name
<button><svg>...</svg></button>

// BAD: Removes focus indicator
button:focus { outline: none; }

// BAD: Decorative element read by screen reader
<div class="icon"><svg>...</svg></div>

// BAD: Error not announced
<div class="error">Invalid input</div>

// BAD: No keyboard support
<div onclick="doSomething()">Click me</div>
```

### ✅ Good Examples

```javascript
// GOOD: Has aria-label
<button aria-label="Save file"><svg aria-hidden="true">...</svg></button>

// GOOD: Visible focus indicator
button:focus-visible { outline: 2px solid blue; }

// GOOD: Hidden from screen readers
<div class="icon" aria-hidden="true"><svg>...</svg></div>

// GOOD: Error announced
<div role="alert" aria-live="polite">Invalid input</div>

// GOOD: Keyboard accessible
<div role="button" tabindex="0" onkeydown="handleKeydown(event)">Click me</div>
```

## WCAG 2.1 Level AA Requirements

### Perceivable
- ✅ Text alternatives for images
- ✅ Captions for multimedia
- ✅ Content is readable and understandable
- ✅ Color is not the only means of conveying information

### Operable
- ✅ Keyboard accessible
- ✅ No content that causes seizures
- ✅ Navigable (clear focus order, skip links)
- ✅ Input methods (keyboard, mouse, touch)

### Understandable
- ✅ Readable (language declared)
- ✅ Predictable (consistent navigation)
- ✅ Input assistance (error identification, labels)

### Robust
- ✅ Compatible with assistive technologies
- ✅ Valid HTML/ARIA

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Accessibility Resources](https://webaim.org/resources/)
- [MDN Accessibility Guide](https://developer.mozilla.org/en-US/docs/Web/Accessibility)

## Example Controls

The **Drag and Drop Control** (`Controls/Drag and Drop/`) demonstrates many accessibility best practices:
- Keyboard navigation
- ARIA labels and roles
- Focus management
- Error announcements
- Disabled state handling

Study it as a reference implementation.

---

**Remember:** Accessibility is not optional. Making controls accessible ensures all users can use your applications, and it's often required by law in many jurisdictions.

