# Standard Properties Guide for K2 Custom Controls

## Overview

K2 provides standard properties (**Visible**, **Enabled**, **Read-Only**, **Height**, **Width**) that you can activate via the `supports` array. K2 handles the UI, but **you need to implement the behavior logic**.

## Available Properties

| Property | Manifest Support | Your Responsibility |
|----------|------------------|-------------------|
| `IsVisible` | `"IsVisible"` | Show/hide control |
| `IsEnabled` | `"IsEnabled"` | Enable/disable interactions |
| `IsReadOnly` | `"IsReadOnly"` | Implement read-only behavior |
| `Height` | `"Height"` | Handle container height changes |
| `Width` | `"Width"` | Handle container width changes |

## Manifest Setup

### Basic Declaration
```json
{
  "supports": ["Value", "Height", "Width", "IsVisible", "IsEnabled", "IsReadOnly"]
}
```

### Override Default Values
**Important**: Want to override defaults? Define them as custom properties with your `initialvalue`:

```json
{
  "supports": ["Height", "IsReadOnly"],
  "properties": [
    {
      "id": "Height",
      "type": "text", 
      "initialvalue": "200",
      "refreshdisplay": "true",
      "changesdisplay": true
    },
    {
      "id": "IsReadOnly",
      "type": "bool",
      "initialvalue": "true", 
      "refreshdisplay": "true",
      "changesdisplay": true
    }
  ]
}
```

## Required Implementation

### 1. Property Getters/Setters
```javascript
// Height/Width - affect container size
get Height() { return this._height; }
set Height(val) {
  this._height = val;
  if (this._hasRendered && this.container) {
    const v = (val === undefined || val === null || val === '') ? '' : (isNaN(val) ? String(val) : `${val}px`);
    this.container.style.height = v;
  }
  safeRaisePropertyChanged(this, 'Height');
}

// Visibility - show/hide control
get IsVisible() { return this._isVisible; }
set IsVisible(val) {
  this._isVisible = val === 'true' || val === true;
  this.setAttribute('isvisible', val);
  if (this._hasRendered && this.container) {
    this.container.style.display = this._isVisible ? '' : 'none';
  }
  safeRaisePropertyChanged(this, 'IsVisible');
}

// Enabled/ReadOnly - control interactions
get IsEnabled() { return this._isEnabled; }
set IsEnabled(val) {
  this._isEnabled = val === 'true' || val === true;
  this.setAttribute('isenabled', val);
  if (this._hasRendered) this.updateInteractivity();
  safeRaisePropertyChanged(this, 'IsEnabled');
}

get IsReadOnly() { return this._isReadOnly; }
set IsReadOnly(val) {
  this._isReadOnly = val === 'true' || val === true;
  this.setAttribute('isreadonly', val);
  if (this._hasRendered) this.updateInteractivity();
  safeRaisePropertyChanged(this, 'IsReadOnly');
}
```

### 2. Observed Attributes & Mapping
```javascript
static get observedAttributes() {
  return ['height', 'width', 'isvisible', 'isenabled', 'isreadonly'];
}

getPropertyNameFromAttribute(attrName) {
  const mapping = {
    'height': 'Height', 'width': 'Width', 
    'isvisible': 'IsVisible', 'isenabled': 'IsEnabled', 'isreadonly': 'IsReadOnly'
  };
  return mapping[attrName.toLowerCase()];
}
```

## Behavior Implementation

### Height/Width Properties
**K2's Role**: Affects the container element wrapping your control.  
**Your Responsibility**: Make sure things are responsive with CSS `width: 100%` and `height: 100%`.

### IsEnabled/IsReadOnly Properties
**Your Responsibility**: You need to implement the interaction logic.

#### Basic Pattern
```javascript
updateInteractivity() {
  if (!this.container) return;
  const interactive = this._isEnabled && !this._isReadOnly;
  
  // Disable interactions
  this.container.style.pointerEvents = interactive ? '' : 'none';
  this.container.setAttribute('aria-disabled', interactive ? 'false' : 'true');
  this.container.tabIndex = interactive ? 0 : -1;
  
  // Visual state
  this.container.classList.toggle('is-disabled', !this._isEnabled);
  this.container.classList.toggle('is-readonly', this._isReadOnly);
}
```

#### Read-Only Patterns
- **Overlay**: Block interactions, add visual overlay
- **Element Removal**: Hide toolbars/buttons (e.g., `this.toolbar.style.display = this._isReadOnly ? 'none' : 'flex'`)
- **Content Editing**: Disable `contentEditable` for text editors

## Key Points

### Essential Requirements
- **Always call** `safeRaisePropertyChanged()` after setting values—K2 needs to know things changed
- **Use consistent boolean conversion**: `val === 'true' || val === true` (K2 sometimes sends strings, sometimes booleans)
- **Only update DOM when rendered**: Check `this._hasRendered` first
- **Check state in event handlers**: `if (!this._isEnabled || this._isReadOnly) return;` prevents weird interactions

### Common Mistakes
- Missing getter/setter implementation—K2 won't be able to set properties
- Inconsistent boolean handling (`val` vs `val === 'true' || val === true`)—this will cause subtle bugs
- Updating DOM before control is rendered—elements won't exist yet
- Forgetting `safeRaisePropertyChanged()` calls—K2 won't know properties changed

## Quick Reference

### Complete Implementation Template
```javascript
class MyControl extends HTMLElement {
  static get observedAttributes() {
    return ['height', 'width', 'isvisible', 'isenabled', 'isreadonly'];
  }

  // Standard Properties
  get Height() { return this._height; }
  set Height(val) {
    this._height = val;
    if (this._hasRendered && this.container) {
      const v = (val === undefined || val === null || val === '') ? '' : (isNaN(val) ? String(val) : `${val}px`);
      this.container.style.height = v;
    }
    safeRaisePropertyChanged(this, 'Height');
  }

  get IsEnabled() { return this._isEnabled; }
  set IsEnabled(val) {
    this._isEnabled = val === 'true' || val === true;
    this.setAttribute('isenabled', val);
    if (this._hasRendered) this.updateInteractivity();
    safeRaisePropertyChanged(this, 'IsEnabled');
  }

  updateInteractivity() {
    if (!this.container) return;
    const interactive = this._isEnabled && !this._isReadOnly;
    this.container.style.pointerEvents = interactive ? '' : 'none';
    this.container.setAttribute('aria-disabled', interactive ? 'false' : 'true');
    this.container.tabIndex = interactive ? 0 : -1;
  }

  handleClick(event) {
    if (!this._isEnabled || this._isReadOnly) return;
    // Handle click logic
  }
}
```

## Related Documentation
- [Responsive Controls Guide](./Responsive%20Controls.md) - Container sizing and responsive behavior
- [Script References](./Script%20References.md) - Complete K2 control scripting reference
