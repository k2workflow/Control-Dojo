# Custom Controls Guide

## Overview

K2 Custom Controls are reusable web components that extend K2 forms and views. Each control comes as a ZIP file with all the necessary files inside. The `manifest.json` file acts as the blueprint—it defines the control's behavior, properties, and resources.

## What is the Manifest File?

The `manifest.json` file is the **central configuration file** for every K2 custom control. Think of it as:

- **Control Blueprint**: Defines the control's identity, properties, events, and capabilities
- **File Registry**: Lists all files that need to be included in the control package
- **Property Schema**: Specifies custom properties and their types, defaults, and behaviors
- **Event Definitions**: Declares what events the control can trigger
- **Standard Property Support**: Indicates which K2 standard properties the control supports

### Key Requirements

- **Always named `manifest.json`** (case-sensitive)
- **One manifest per control** - each control package needs exactly one manifest
- **JSON format** - must be valid JSON syntax
- **File validation** - all referenced files must exist in the package

## Manifest Structure

### Basic Structure

```json
{
  "icon": "icon.svg",
  "displayName": "My Custom Control",
  "tagName": "my-custom-control",
  "supports": ["Value", "Width", "Height"],
  "events": [
    { "id": "Changed" },
    { "id": "Focus" }
  ],
  "properties": [
    {
      "id": "Value",
      "friendlyname": "Text",
      "type": "string",
      "initialvalue": "",
      "changesdisplay": true
    }
  ],
  "runtimeScriptFileNames": ["runtime_logic.js"],
  "designtimeScriptFileNames": ["designtime_logic.js"],
  "runtimeStyleFileNames": ["runtime_style.css"],
  "designtimeStyleFileNames": ["designtime_style.css"],
  "imageFileNames": ["background.png"]
}
```

## Required Fields

### Core Identity Fields

| Field | Type | Required | Description |
|-------|------|----------|----------------------------------------|
| `icon` | string | Yes | Name of the icon file (SVG recommended) |
| `displayName` | string | Yes | Human-readable name shown in designer toolbox |
| `tagName` | string | Yes | Web component tag name (kebab-case recommended) |
| `description` | string | No | Detailed description of control functionality |
| `valuePropertyID` | string | No | ID of the property representing control's primary value |


### File References

| Field | Type | Required | Description |
|-------|------|----------|----------------------------------------|
| `runtimeScriptFileNames` | array | Yes | JavaScript files for runtime behavior |
| `designtimeScriptFileNames` | array | Yes | JavaScript files for design-time behavior |
| `runtimeStyleFileNames` | array | Yes | CSS files for runtime styling |
| `designtimeStyleFileNames` | array | Yes | CSS files for design-time styling |
| `imageFileNames` | array | No | Additional image files (PNG, JPG, SVG) |


### Control Capabilities

| Field | Type | Required | Description |
|-------|------|----------|----------------------------------------|
| `supports` | array | Yes | Standard K2 properties the control supports (can include "DataBinding" for data-bound controls) |
| `events` | array | Yes | Events the control can trigger |
| `properties` | array | Yes | Custom properties the control exposes |

## File Organization

### Separate Files Approach (Recommended)

For complex controls, use separate files for different contexts:

```json
{
  "runtimeScriptFileNames": ["runtime_logic.js"],
  "designtimeScriptFileNames": ["designtime_logic.js"],
  "runtimeStyleFileNames": ["runtime_style.css"],
  "designtimeStyleFileNames": ["designtime_style.css"]
}
```

**Benefits:**
- Clear separation of concerns
- Optimized loading (only runtime files load in production)
- Easier maintenance and debugging
- Better performance

### Shared Files Approach

For simple controls, you can use the same files for both contexts:

```json
{
  "runtimeScriptFileNames": ["control.js"],
  "designtimeScriptFileNames": ["control.js"],
  "runtimeStyleFileNames": ["control.css"],
  "designtimeStyleFileNames": ["control.css"]
}
```

**Benefits:**
- Simpler file structure
- Less duplication
- Works well for simple controls

## Standard Properties Support

The `supports` array tells K2 which standard properties your control implements:

### Available Standard Properties

| Property | Description | Implementation Required |
|----------|-------------|-------------------------|
| `Value` | Primary data value | Yes - implement getter/setter |
| `Width` | Control width | Yes - handle container sizing |
| `Height` | Control height | Yes - handle container sizing |
| `IsVisible` | Show/hide control | Yes - implement visibility logic |
| `IsEnabled` | Enable/disable interactions | Yes - implement interaction blocking |
| `IsReadOnly` | Read-only mode | Yes - implement read-only behavior |
| `Property` | Generic property support | Optional - for dynamic properties |
| `Style` | Style property support | Optional - for custom styling |
| `Format` | Format property support | Optional - for data formatting |

### Example Standard Properties Declaration

```json
{
  "supports": [
    "Value",
    "Width", 
    "Height",
    "IsVisible",
    "IsEnabled",
    "IsReadOnly"
  ]
}
```

### Overriding Standard Property Defaults

Want to override default values for standard properties? Define them in the `properties` array:

```json
{
  "supports": ["Height", "IsReadOnly"],
  "properties": [
    {
      "id": "Height",
      "type": "string",
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

## Custom Properties

Custom properties define the configuration options specific to your control that users can configure.

### Basic Property Structure

```json
{
  "id": "Watermark",
  "refreshdisplay": "true",
  "friendlyname": "Watermark Text",
  "type": "string",
  "inputlength": "255",
  "initialvalue": "Enter value...",
  "changesdisplay": true
}
```

### Enhanced Property Structure (Optional)

You can add more metadata to properties for a better designer experience:

```json
{
  "id": "Watermark",
  "refreshdisplay": "true",
  "friendlyname": "Watermark Text",
  "type": "string",
  "inputlength": "255",
  "initialvalue": "Enter value...",
  "changesdisplay": true,
  "description": "Placeholder text shown when field is empty",
  "category": "Appearance"
}
```

### Property Fields

| Field | Type | Required | Description |
|-------|------|----------|----------------------------------------|
| `id` | string | Yes | Unique property identifier |
| `friendlyname` | string | Yes | Human-readable name for UI |
| `type` | string | Yes | Property data type |
| `initialvalue` | string | Yes | Default value |
| `refreshdisplay` | string | Yes | Whether changes trigger display refresh |
| `changesdisplay` | boolean | Yes | Whether changes affect visual appearance |
| `inputlength` | string | No | Maximum input length for string properties |
| `dropitems` | array | No | Dropdown options (required for `drop` type) |
| `description` | string | No | Property description/tooltip shown in designer |

### Supported Property Types

| Type | Description | Example Values |
|------|-------------|----------------|
| `string` | String values | `"Hello World"`, `""` |
| `bool` | Boolean values | `"true"`, `"false"` |
| `drop` | Dropdown selection | See dropdown structure below |

**Note**: 
- `text` is accepted for backward compatibility but should be standardized to `string`
- For data binding support, see [Data Binding Guide](./Data%20Binding.md)

### Dropdown Property Structure

For `drop` type properties, you must include a `dropitems` array that defines the available options:

```json
{
  "id": "DataType",
  "friendlyname": "Data Type",
  "type": "drop",
  "dropitems": [
    {"value": "Date", "text": "Date"},
    {"value": "Text", "text": "Text"}, 
    {"value": "DateTime", "text": "DateTime"}
  ],
  "refreshdisplay": "true",
  "inputlength": "255",
  "initialvalue": "Text",
  "changesdisplay": true
}
```

**Dropdown Fields:**
- `dropitems`: Array of option objects
- Each option has `value` (internal value) and `text` (display text)
- `initialvalue`: Must match one of the option `value` values

### Example Custom Properties

```json
{
  "properties": [
    {
      "id": "Placeholder",
      "refreshdisplay": "true", 
      "friendlyname": "Placeholder Text",
      "type": "string",
      "inputlength": "100",
      "initialvalue": "Enter text...",
      "changesdisplay": true
    },
    {
      "id": "DataType",
      "refreshdisplay": "true",
      "friendlyname": "Data Type",
      "type": "drop",
      "dropitems": [
        {"value": "Date", "text": "Date"},
        {"value": "Text", "text": "Text"}, 
        {"value": "DateTime", "text": "DateTime"}
      ],
      "initialvalue": "Text",
      "changesdisplay": true
    },
    {
      "id": "Required",
      "refreshdisplay": "true",
      "friendlyname": "Required Field",
      "type": "bool", 
      "initialvalue": "false",
      "changesdisplay": true
    }
  ]
}
```

## Events

Events define what actions your control can trigger for K2 workflows and rules. They're how your control talks to the rest of the K2 system.

### Basic Event Structure

```json
{
  "events": [
    { "id": "Changed" },
    { "id": "Focus" },
    { "id": "Blur" },
    { "id": "OnEnter" }
  ]
}
```

### Enhanced Event Structure (Optional)

You can add descriptions to events to make them clearer:

```json
{
  "events": [
    { 
      "id": "Changed",
      "description": "Fires when the control value is modified"
    },
    { 
      "id": "Focus",
      "description": "Fires when the control receives focus"
    },
    { 
      "id": "Blur",
      "description": "Fires when the control loses focus"
    },
    { 
      "id": "OnEnter",
      "description": "Fires when the user presses Enter key"
    }
  ]
}
```

### Common Event Types

| Event ID | Description | When Triggered |
|----------|-------------|----------------|
| `Changed` | Value changed | When control value is modified |
| `Focus` | Control focused | When control receives focus |
| `Blur` | Control blurred | When control loses focus |
| `OnEnter` | Enter key pressed | When user presses Enter |
| `Click` | Control clicked | When control is clicked |
| `ValidationError` | Validation failed | When validation rules fail |

### Custom Events

You can define custom events specific to your control. Here's an example:

```json
{
  "events": [
    { "id": "Changed" },
    { "id": "FileUploaded" },
    { "id": "UploadProgress" },
    { "id": "UploadComplete" }
  ]
}
```

## Control Package Structure

### ZIP Package Requirements

Your control package must be a ZIP file containing:

1. **`manifest.json`** - The control configuration file
2. **All referenced files** - Every file listed in the manifest must be present
3. **Unique filenames** - No duplicate filenames within the package
4. **Valid file references** - All filenames in manifest must match actual files

### Example Package Structure

```
MyControl.zip
├── manifest.json
├── icon.svg
├── runtime_logic.js
├── designtime_logic.js  
├── runtime_style.css
├── designtime_style.css
└── images/
    ├── background.png
    └── logo.svg
```

### File Validation

The K2 system validates packages by:

1. **Checking manifest.json exists** and is valid JSON
2. **Verifying all referenced files exist** in the package
3. **Ensuring no extra files** are included (optional validation)
4. **Validating file references** match actual filenames exactly

### Folder Support

You can organize files in subfolders:

```json
{
  "runtimeScriptFileNames": ["scripts/main.js"],
  "runtimeStyleFileNames": ["styles/main.css"],
  "imageFileNames": ["images/icon.svg", "assets/background.jpg"]
}
```

## Complete Manifest Examples

### Arabic Calendar Control Example

```json
{
  "icon": "icon.svg",
  "displayName": "Arabic Calendar",
  "tagName": "arabic-calendar",
  "valuePropertyID": "Value",
  "supports": [
    "Value",
    "Height",
    "Width", 
    "IsVisible",
    "IsEnabled",
    "IsReadOnly"
  ],
  "events": [
    { "id": "Changed", "description": "Fires when the selected date changes" },
    { "id": "Focus", "description": "Fires when the control receives focus" },
    { "id": "Blur", "description": "Fires when the control loses focus" },
    { "id": "ValidationError", "description": "Fires when date validation fails" }
  ],
  "properties": [
    {
      "id": "Value",
      "refreshdisplay": "true",
      "friendlyname": "Selected Date",
      "description": "The currently selected date value",
      "type": "string",
      "inputlength": "255",
      "initialvalue": "",
      "changesdisplay": true
    },
    {
      "id": "Watermark",
      "refreshdisplay": "true",
      "friendlyname": "Watermark",
      "type": "string",
      "inputlength": "255",
      "initialvalue": "انقر لتحديد التاريخ",
      "changesdisplay": true
    },
    {
      "id": "DateFormat",
      "refreshdisplay": "true",
      "friendlyname": "Date Format",
      "type": "string",
      "inputlength": "50",
      "initialvalue": "dd/MM/yyyy",
      "changesdisplay": true
    },
    {
      "id": "AllowManualInput",
      "refreshdisplay": "true",
      "friendlyname": "Allow Manual Input",
      "type": "bool",
      "initialvalue": "true",
      "changesdisplay": true
    }
  ],
  "runtimeScriptFileNames": ["runtime_logic.js"],
  "runtimeStyleFileNames": ["runtime_style.css"],
  "designtimeScriptFileNames": ["designtime_logic.js"],
  "designtimeStyleFileNames": ["designtime_style.css"],
  "imageFileNames": []
}
```

**See:** [Arabic Calendar Control](../Controls/Arabic%20Calendar/) for the complete implementation.

## Best Practices

### Manifest Design

1. **Use descriptive names** - `displayName` and `tagName` should clearly indicate what the control does
2. **Follow naming conventions** - Use kebab-case for `tagName`, PascalCase for `displayName`
3. **Include all properties** - Define all configurable aspects
4. **Document with friendly names** - Make properties user-friendly
5. **Set sensible defaults** - Provide useful `initialvalue` for all properties

### File Organization

1. **Use separate files** for complex controls (runtime vs design-time)
2. **Keep filenames descriptive** - `runtime_logic.js` vs `script.js`
3. **Organize with folders** - Group related files in subdirectories
4. **Optimize file sizes** - Minimize unnecessary code and assets
5. **Validate references** - Ensure all manifest references are correct

**See:** [Script References Guide](./Script%20References.md) for file referencing details.

### Property Design

1. **Group related properties** - Logical ordering in the properties array
2. **Use appropriate types** - `bool` for true/false, `string` for text values
3. **Set reasonable limits** - Use `inputlength` for text properties
4. **Consider user experience** - `friendlyname` should be clear and concise
5. **Plan for changes** - Set `changesdisplay` appropriately

**See:** [Standard Properties Guide](./Standard%20Properties.md) for property implementation details.

### Event Planning

1. **Include standard events** - `Changed`, `Focus`, `Blur` for most controls
2. **Define custom events** - For control-specific actions
3. **Use consistent naming** - Follow K2 event naming conventions
4. **Document event triggers** - Add descriptions to events for clarity
5. **Consider workflow integration** - Events should work with K2 rules

## Common Issues and Solutions

### Manifest Validation Errors

- **Problem**: "Manifest file not found"
  - **Solution**: Ensure `manifest.json` exists in the root of your ZIP package

- **Problem**: "Invalid JSON syntax"
  - **Solution**: Validate JSON syntax using a JSON validator or editor

- **Problem**: "Referenced file not found"
  - **Solution**: Check that all files listed in manifest exist in the package

### Property Issues

- **Problem**: Properties not appearing in designer
  - **Solution**: Verify `properties` array is correctly formatted and `friendlyname` is set

- **Problem**: Property changes not reflecting
  - **Solution**: Ensure `changesdisplay: true` and `refreshdisplay: "true"` are set

### File Reference Problems

- **Problem**: Scripts not loading
  - **Solution**: Check `runtimeScriptFileNames` and `designtimeScriptFileNames` arrays

- **Problem**: Styles not applying
  - **Solution**: Verify `runtimeStyleFileNames` and `designtimeStyleFileNames` references

## K2 Documentation Links

For information about registering and using custom controls in K2, refer to the official K2 documentation:

### Uploading and Managing Controls

**[Custom Controls Management](https://help.nintex.com/en-US/nintexautomation/userguide/current/Content/K2-Management-Site/CustomControls/CustomControlsManagement.htm)** - Guide for uploading and managing custom controls in the K2 Management Site.

This covers:
- Preparing your control files and packaging requirements
- Uploading controls through the Management Site
- Managing, updating, and deleting custom controls
- Troubleshooting common issues

**Important:** After uploading a control in the Management Site, always refresh your browser in the K2 Designer to see the new control.

### Using Controls in Designer

**[Custom Controls in K2 Designer](https://help.nintex.com/en-US/nintexautomation/userguide/current/Content/Create/K2Designer/Controls/CustomControl/CustomControls.htm)** - Guide for using custom controls in K2 Designer.

This covers:
- Configuring control properties in the designer
- Using control events in K2 rules
- Best practices and considerations

## Related Documentation

- [Getting Started](./Getting%20Started.md) - Quick start guide and overview
- [Standard Properties Guide](./Standard%20Properties.md) - Implementation details for standard properties
- [Data Binding Guide](./Data%20Binding.md) - Creating controls with data binding capabilities
- [Script References](./Script%20References.md) - File referencing system for controls
- [Responsive Controls](./Responsive%20Controls.md) - Guidelines for responsive control design
- [Localization](./Localization.md) - Multi-language and RTL support for controls
- [Style Integration](./Style%20Integration.md) - Integration with K2 styling system

## Implementation Guides

After defining your manifest, you'll need to implement the control behavior. See these guides:

- **[Standard Properties](./Standard%20Properties.md)** - How to implement standard properties (IsVisible, IsEnabled, Width, Height, etc.)
- **[Data Binding](./Data%20Binding.md)** - How to implement data binding for controls that display SmartObject data
- **[Form View Validation](./Form%20View%20Validation.md)** - How to implement validation methods
- **[Triggering Control Methods](./Triggering%20Control%20Methods.md)** - How to add callable methods to controls
- **[Responsive Controls](./Responsive%20Controls.md)** - How to make controls responsive
- **[Style Integration](./Style%20Integration.md)** - How to integrate with K2 form styling
- **[Localization](./Localization.md)** - How to add multi-language and RTL support

## Summary

The manifest file is the foundation of every K2 custom control. It defines:

- **Control identity** (`displayName`, `tagName`, `icon`)
- **File dependencies** (scripts, styles, images)
- **Capabilities** (`supports` array for standard properties)
- **Configuration** (`properties` array for custom settings)
- **Interactions** (`events` array for workflow integration)

After creating your manifest, check out the implementation guides above for details on how to implement the control behavior. The example controls (Arabic Calendar, CAPTCHA Box, Button List) show these concepts in practice.

**Next Steps:**
1. Review the example controls in the `Controls/` folder
2. Study their manifest.json files
3. Refer to the implementation guides for specific features
4. Create your own control following the examples
