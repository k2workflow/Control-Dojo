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
| `TabIndex` | `"TabIndex"` | Set tabindex attribute on input element |
| `Expressions` | `"ControlExpression"` | Enable K2 Expressions panel for the control. **Important:** Unlike other support properties, ControlExpression does not require separate get/set methods. It uses the `Value` property's getter/setter, so `Value` must be in the `supports` array for expressions to work. Expressions change the control's `Value` property. |

## Manifest Setup

### Basic Declaration
```json
{
  "supports": [
    "Value",
    "Height",
    "Width",
    "IsVisible",
    "IsEnabled",
    "IsReadOnly",
    "TabIndex",
    "ControlExpression"
  ]
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

// TabIndex - set tabindex attribute on input element
get TabIndex() { return this._tabIndex; }
set TabIndex(val) {
  this._tabIndex = val || "0";
  if (this._hasRendered && this.input) {
    this.input.setAttribute("tabindex", this._tabIndex);
  }
  safeRaisePropertyChanged(this, 'TabIndex');
}
```

### 2. Observed Attributes & Mapping
```javascript
static get observedAttributes() {
  return ['height', 'width', 'isvisible', 'isenabled', 'isreadonly', 'tabindex'];
}

getPropertyNameFromAttribute(attrName) {
  const mapping = {
    'height': 'Height', 'width': 'Width', 
    'isvisible': 'IsVisible', 'isenabled': 'IsEnabled', 'isreadonly': 'IsReadOnly',
    'tabindex': 'TabIndex'
  };
  return mapping[attrName.toLowerCase()];
}
```

## Behavior Implementation

### Height/Width Properties
**K2's Role**: Affects the container element wrapping your control.  
**Your Responsibility**: Make sure things are responsive with CSS `width: 100%` and `height: 100%`.

> **Critical: Width Validation Rules**
> 
> The `Width` property must follow K2's validation rules. Invalid values will be rejected by the K2 Designer with the error: *"You have entered an invalid width. Only whole numbers, percentages not exceeding 100% and pixel values up to 32767px are supported."*
> 
> **Valid Width Formats:**
> - **Whole numbers** (e.g., `"100"`) - Treated as pixels (`"100"` = `"100px"`). Must be between 0 and 32767.
> - **Percentages** (e.g., `"50%"`, `"100%"`, `"50.5%"`) - Can include decimals, but must not exceed 100% and must be >= 0%
> - **Pixel values** (e.g., `"100px"`, `"32767px"`) - Must be whole numbers only (no decimals), between 0 and 32767px
> - **Empty string** - Defaults to container width
> 
> **Invalid Width Formats:**
> - `"auto"` - Not supported by K2's container system
> - Percentages over 100% (e.g., `"150%"`) or negative (e.g., `"-10%"`)
> - Pixel values over 32767px (e.g., `"50000px"`) or negative (e.g., `"-100px"`)
> - Decimal pixel values (e.g., `"100.5px"`) - Only whole numbers are supported for pixels
> - Whole numbers over 32767 (e.g., `"50000"`) or negative (e.g., `"-100"`)
> - Any other format (e.g., `"10em"`, `"50vw"`, `"10rem"`, etc.)
> 
> **Important Notes:**
> - **Never set `initialvalue` to `"auto"`** or any other invalid format for Width property overrides
> - **Never allow users to set Width to invalid values** in your control's property setters
> - The K2 Designer validates this automatically, but if users manually edit the manifest or set values programmatically, they could break the control
> - Always validate Width values in your control's setter methods to match K2's validation rules

### IsEnabled/IsReadOnly Properties
**Your Responsibility**: You need to implement the interaction logic.

### TabIndex Property
**Your Responsibility**: Set the `tabindex` attribute on your input element to control tab order.

#### Implementation Pattern
```javascript
// Initialize property
_tabIndex = "0";

// Getter/Setter
get TabIndex() { return this._tabIndex; }
set TabIndex(val) {
  this._tabIndex = val || "0";
  if (this._hasRendered && this.input) {
    this.input.setAttribute("tabindex", this._tabIndex);
  }
  safeRaisePropertyChanged(this, 'TabIndex');
}

// In HTML template
<input type="text" tabindex="${this._tabIndex}" ... />
```

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

> **Important:** Do not add `TabIndex` or `ControlExpression` to the manifest `properties` array.
> These are reserved standard properties. The platform blocks overrides to keep the designer and
> runtime behaviors functional so you can only declare them in `supports` and handle the logic in code.

> **ControlExpression Behavior:** When `ControlExpression` is declared in `supports`, K2 enables the Expressions panel in the designer. Unlike other support properties (like `IsVisible`, `IsEnabled`, etc.), you do **not** need to implement separate get/set methods for `ControlExpression`. Instead, expressions work by setting the control's `Value` property. This means:
> - `Value` must be in your `supports` array for expressions to work
> - You must implement `get Value()` and `set Value(value)` methods
> - When a user configures an expression, K2 evaluates it and calls `set Value(result)` on your control
> - When K2 needs the expression result, it calls `get Value()` on your control

#### Read-Only Patterns
- **Overlay**: Block interactions, add visual overlay
- **Element Removal**: Hide toolbars/buttons (e.g., `this.toolbar.style.display = this._isReadOnly ? 'none' : 'flex'`)
- **Content Editing**: Disable `contentEditable` for text editors

> **TabIndex caution:** Declare `TabIndex` only in `supports` and implement it in code. Do not add it to the `properties` array. Overrides are currently not blocked at design time and may override the platform TabIndex behavior when defined as a property.

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
    return ['height', 'width', 'isvisible', 'isenabled', 'isreadonly', 'tabindex'];
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

  get IsReadOnly() { return this._isReadOnly; }
  set IsReadOnly(val) {
    this._isReadOnly = val === 'true' || val === true;
    this.setAttribute('isreadonly', val);
    if (this._hasRendered) this.updateInteractivity();
    safeRaisePropertyChanged(this, 'IsReadOnly');
  }

  get TabIndex() { return this._tabIndex; }
  set TabIndex(val) {
    this._tabIndex = val || "0";
    if (this._hasRendered && this.input) {
      this.input.setAttribute("tabindex", this._tabIndex);
    }
    safeRaisePropertyChanged(this, 'TabIndex');
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
