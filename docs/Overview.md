# Control Dojo Documentation

Welcome to the Control Dojo documentation! This is your reference guide for creating custom K2 controls.

## Documentation Index

### Getting Started

- **[Getting Started](./Getting%20Started.md)** - Quick start guide, overview of example controls, and links to K2 documentation

### Core Guides

- **[Manifest Configuration](./Manifest%20Configuration.md)** - Complete guide to the manifest.json file structure and configuration
- **[Standard Properties](./Standard%20Properties.md)** - How to implement standard K2 properties (IsVisible, IsEnabled, Width, Height, etc.)
- **[Script References](./Script%20References.md)** - File referencing system using `{{filename}}` syntax

### Feature Guides

- **[Data Binding](./Data%20Binding.md)** - Creating controls that display data from K2 SmartObjects
- **[Form View Validation](./Form%20View%20Validation.md)** - Implementing validation methods for controls
- **[Triggering Control Methods](./Triggering%20Control%20Methods.md)** - Adding callable methods to controls

### Design & UX Guides

- **[Responsive Controls](./Responsive%20Controls.md)** - Making controls responsive with Shadow DOM and width overrides
- **[Style Integration](./Style%20Integration.md)** - Integrating with K2 form styling using CSS variables
- **[Localization](./Localization.md)** - Multi-language support and RTL (right-to-left) layout

## Learning Path

Follow this recommended path to learn custom control development:

### 1. Start Here
Start with the **[Getting Started](./Getting%20Started.md)** guide to understand:
- What K2 custom controls are
- The 3 example controls included
- How to register and use controls in K2
- Basic workflow

### 2. Manifest Basics
Learn about the manifest.json file in **[Manifest Configuration](./Manifest%20Configuration.md)**:
- Control identity and file dependencies
- Properties and events
- Standard property support
- Complete manifest examples

### 3. Core Implementation
Understand how to implement control behavior:
- **[Standard Properties](./Standard%20Properties.md)** - Implement IsVisible, IsEnabled, Width, Height, IsReadOnly
- **[Script References](./Script%20References.md)** - Reference files in your control package

### 4. Feature Implementation
Add specific features to your control:
- **[Data Binding](./Data%20Binding.md)** - For controls that display SmartObject data
- **[Form View Validation](./Form%20View%20Validation.md)** - For controls that need validation
- **[Triggering Control Methods](./Triggering%20Control%20Methods.md)** - For controls with callable methods

### 5. Advanced Topics
Enhance your control with advanced features:
- **[Responsive Controls](./Responsive%20Controls.md)** - Make controls work on all screen sizes
- **[Style Integration](./Style%20Integration.md)** - Integrate with K2 form color schemes
- **[Localization](./Localization.md)** - Add multi-language and RTL support

## Example Controls

The Control Dojo includes three example controls that demonstrate best practices:

### 1. Arabic Calendar (`arabic-calendar`)
- **Features:** RTL support, style-aware theming, date validation
- **See:** [Localization](./Localization.md) | [Style Integration](./Style%20Integration.md)
- **Location:** `Controls/Arabic Calendar/`

### 2. CAPTCHA Box (`captcha-control`)
- **Features:** Multiple CAPTCHA providers, validation, methods
- **See:** [Triggering Control Methods](./Triggering%20Control%20Methods.md) | [Form View Validation](./Form%20View%20Validation.md)
- **Location:** `Controls/CAPTCHA Box/`

### 3. Button List (`button-list`)
- **Features:** Data binding, customizable layouts, icon support, methods
- **See:** [Data Binding](./Data%20Binding.md) | [Triggering Control Methods](./Triggering%20Control%20Methods.md)
- **Location:** `Controls/Button List/`

## Quick Reference

### Manifest Structure
```json
{
  "icon": "icon.svg",
  "displayName": "My Control",
  "tagName": "my-control",
  "supports": ["Value", "Width", "Height"],
  "events": [{ "id": "Changed" }],
  "properties": [...],
  "runtimeScriptFileNames": ["script.js"],
  "runtimeStyleFileNames": ["style.css"]
}
```

### Standard Properties
- `Value` - Primary data value
- `Width`, `Height` - Control dimensions
- `IsVisible` - Show/hide control
- `IsEnabled` - Enable/disable interactions
- `IsReadOnly` - Read-only mode

### Common Events
- `Changed` - Value changed
- `Focus` - Control focused
- `Blur` - Control blurred
- `OnEnter` - Enter key pressed

### File References
Use `{{filename}}` syntax to reference files:
- CSS: `url('{{image.png}}')`
- JavaScript: `import from '{{helper.js}}'`
- Images: `src="{{logo.svg}}"`

## K2 Documentation Links

For information about registering and using custom controls in K2, refer to the official K2 documentation:

### K2 Management Site - Custom Controls Management

**[Custom Controls Management](https://help.nintex.com/en-US/nintexautomation/userguide/current/Content/K2-Management-Site/CustomControls/CustomControlsManagement.htm)**

This guide covers managing custom controls in the K2 Management Site:

- **Prepare your custom control files** - How to package your control files
- **Example custom controls** - Sample controls provided by K2
- **Enable the feature** - How to enable custom controls in K2
- **Control Administrators role** - Required permissions for managing controls
- **Manage custom controls** - How to upload, update, and delete custom controls
- **Troubleshooting** - Common issues and solutions

**Important:** After uploading a control in the Management Site, always refresh your browser in the K2 Designer to see the new control.

### K2 Designer - Using Custom Controls

**[Custom Controls in K2 Designer](https://help.nintex.com/en-US/nintexautomation/userguide/current/Content/Create/K2Designer/Controls/CustomControl/CustomControls.htm)**

This guide covers using custom controls in the K2 Designer:

- **Configure the control** - How to configure control properties
- **Properties** - Understanding control properties in the designer
- **Rules and events** - How to use control events in K2 rules
- **Considerations** - Important notes about using custom controls

## Documentation Structure

```
docs/
├── Overview.md (this file)
├── Getting Started.md
├── Manifest Configuration.md
├── Standard Properties.md
├── Data Binding.md
├── Form View Validation.md
├── Triggering Control Methods.md
├── Script References.md
├── Responsive Controls.md
├── Style Integration.md
└── Localization.md
```

## Common Tasks

### I want to create a simple control
1. Read [Getting Started](./Getting%20Started.md)
2. Study [Manifest Configuration](./Manifest%20Configuration.md)
3. Review an example control in `Controls/` folder
4. Implement [Standard Properties](./Standard%20Properties.md)

### I want to add data binding
1. Read [Data Binding](./Data%20Binding.md)
2. Study Button List control
3. Add `"DataBinding"` to supports array
4. Implement `listItemsChangedCallback()`

### I want to add validation
1. Read [Form View Validation](./Form%20View%20Validation.md)
2. Add `"Validate"` to supports array
3. Implement `Validate()` method
4. Ensure `get Value()` and `set Value()` are implemented

### I want to add methods
1. Read [Triggering Control Methods](./Triggering%20Control%20Methods.md)
2. Add `methods` array to manifest
3. Implement `execute(objInfo)` method
4. Implement internal method functions

### I want to make it responsive
1. Read [Responsive Controls](./Responsive%20Controls.md)
2. Use Shadow DOM in designtime scripts
3. Add K2 width overrides to CSS
4. Use `display: block` and `width: 100%`

### I want to integrate with form styling
1. Read [Style Integration](./Style%20Integration.md)
2. Use CSS variables with form color variables
3. Provide fallback values
4. Don't define variables in control CSS

### I want to add RTL support
1. Read [Localization](./Localization.md)
2. Set `direction: rtl` in CSS
3. Use Arabic font stack
4. Use RTL-aware layout (Grid/Flexbox with order)

## Tips

- **Study the examples**: The 3 example controls show real-world implementations
- **Check the manifest**: Each control's manifest.json shows how things work
- **Use cross-references**: Guides reference each other for related topics
- **Test in K2**: Always test your control in K2 Designer after creating it
- **Refresh browser**: Always refresh after uploading a control to K2—this step is easy to forget
- **Avoid namespace collisions**: Prefix all global helper functions with your control name to prevent conflicts when multiple controls are registered (see [Script References](./Script%20References.md#global-namespace-collisions))

## Need Help?

1. Review the relevant documentation guide
2. Check the example controls in `Controls/` folder
3. Examine manifest.json files for reference
4. Refer to official K2 documentation for registration and deployment

## Summary

This documentation includes what you need to create custom K2 controls:
- Guides for all aspects of control development
- Three example controls that show how things work
- A clear learning path from basics to advanced topics
- Quick reference for common tasks

Start with [Getting Started](./Getting%20Started.md) and follow the learning path to create your first custom control!

