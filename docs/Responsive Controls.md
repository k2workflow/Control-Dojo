# Responsive K2 Controls Guide

## Quick Start

To create responsive K2 controls that properly handle width changes:

1. **Use Shadow DOM** in designtime scripts
2. **Add K2 width overrides** to designtime CSS
3. **Use `display: block` and `width: 100%`** for full width

## Critical: K2 Width Override

### The Problem
K2 constrains control width in a couple of ways:
- **Forms**: `.form-control` wrapper uses `display: inline-block`
- **Views**: `.controlwrapper` uses `width: auto`

Both of these prevent full width expansion. Annoying, but fixable.

### The Solution
Add these overrides to your designtime CSS file:

```css
/* Forms override */
#pgWizard .form-control[customtag="your-control-tag"] {
    display: block !important;
    width: 100% !important;
}

/* Views override */
.controlwrapper[customtag="your-control-tag"] {
    width: 100% !important;
    max-width: none !important;
}
```

### Why This Works
- **Forms**: Overrides `display: inline-block` → `display: block`
- **Views**: Overrides `width: auto` → `width: 100%`
- **Precise**: Uses `customtag` attribute to target only your control
- **Location**: Must be in external CSS file, NOT in Shadow DOM

## Shadow DOM Implementation

### Why Shadow DOM is Critical
Shadow DOM gives you **style encapsulation**—your control's styles are completely isolated from external CSS. This means consistent behavior regardless of the parent form's styling.

### Setup in Designtime Logic

```javascript
connectedCallback() {
    this._isConnected = true;
    if (!this.shadowRoot) {
        this.attachShadow({ mode: 'open' });
    }
    this.render();
}
```

### Move All Styles into Shadow DOM

```javascript
render() {
    if (this._hasRendered) return;

    this.shadowRoot.innerHTML = `
        <style>
            :host {
                display: block;
                width: 100%;
            }
            
            .container {
                width: 100%;
            }
        </style>
        ${this._TEMPLATE}
    `;
}
```

### Update Element References

```javascript
// Use shadowRoot.querySelector() instead of querySelector()
this.container = this.shadowRoot.querySelector('.container');
this.input = this.shadowRoot.querySelector('.input');
```

## Width/Height Properties

### Implementation
```javascript
get Width() { return this._width; }
set Width(val) {
    this._width = val;
    if (this._hasRendered && this.container) {
        const v = (val === undefined || val === null || val === '') ? '' : (isNaN(val) ? String(val) : `${val}px`);
        this.container.style.width = v;
    }
    safeRaisePropertyChanged(this, 'Width');
}
```

### Manifest Configuration
```json
{
    "supports": ["Property", "Value", "Width", "Height", "IsVisible", "IsEnabled"]
}
```

## Common Pitfalls

### ❌ Wrong: `display: inline-block`
```css
:host { display: inline-block; }  /* Prevents full width */
```

### ✅ Correct: `display: block`
```css
:host { display: block; width: 100%; }  /* Allows full width */
```

### ❌ Wrong: External CSS only
```javascript
this.innerHTML = this._TEMPLATE;  // Styles can be overridden
```

### ✅ Correct: Shadow DOM
```javascript
this.shadowRoot.innerHTML = `<style>/* styles */</style>${this._TEMPLATE}`;
```

## Complete Example

```javascript
class MyResponsiveControl extends HTMLElement {
    connectedCallback() {
        this._isConnected = true;
        if (!this.shadowRoot) {
            this.attachShadow({ mode: 'open' });
        }
        this.render();
    }

    render() {
        if (this._hasRendered) return;

        this.shadowRoot.innerHTML = `
            <style>
                :host { display: block; width: 100%; }
                .container { width: 100%; min-width: 200px; }
                .input { width: 100%; box-sizing: border-box; }
            </style>
            <div class="container">
                <input class="input" type="text">
            </div>
        `;

        this.container = this.shadowRoot.querySelector('.container');
        this.input = this.shadowRoot.querySelector('.input');
        this._hasRendered = true;
    }
}
```

## Troubleshooting

### Control stuck at ~228px width
- **Cause**: K2 width constraints on wrapper elements
- **Solution**: Add width overrides to designtime CSS file

### Control not expanding to full width
- Ensure `width: 100%` is set on `:host` and `.container`
- Add K2 width overrides in external CSS file
- Verify Shadow DOM is properly implemented

### Element references not working
- Use `this.shadowRoot.querySelector()` instead of `this.querySelector()`
- Ensure elements are queried after Shadow DOM is rendered

## Best Practices

1. **Always use Shadow DOM in designtime scripts**
2. **Add K2 width overrides to designtime CSS file**
3. **Use `customtag` attribute for precise targeting**
4. **Use `display: block` and `width: 100%` for full width**
5. **Embed all styles within Shadow DOM**
6. **Use `shadowRoot.querySelector()` for element access**
7. **Test responsiveness in K2 Designer**
