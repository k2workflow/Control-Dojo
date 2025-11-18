# Getting Started with K2 Custom Controls

## Overview

K2 Custom Controls are reusable web components that extend K2 forms and views. Each control comes as a ZIP file with all the necessary files inside. The `manifest.json` file acts as the blueprint—it defines the control's behavior, properties, and resources.

This Control Dojo includes example controls and documentation to help you build your own custom controls for K2 SmartForms and SmartViews.

## Quick Start Workflow

Here's the basic workflow:

1. **Create** your control files (HTML, CSS, JavaScript) and manifest.json
2. **Package** everything into a ZIP archive
3. **Register** the control in K2 (see [K2 Documentation](#k2-documentation-links))
4. **Refresh** your browser after uploading—this step trips people up sometimes
5. **Use** the control in your forms and views

## Example Controls Included

The Control Dojo includes three example controls that show how things work in practice:

### 1. Arabic Calendar (`arabic-calendar`)

A comprehensive Arabic calendar control with Islamic (Hijri) calendar functionality, featuring:
- Right-to-left (RTL) support for Arabic text
- Style-aware theming that integrates with K2 form colors
- Date validation and manual input support
- Full keyboard navigation and accessibility

**Key Features:**
- Supports standard K2 properties (Value, Width, Height, IsVisible, IsEnabled, IsReadOnly)
- Custom properties: Watermark, DateFormat, AllowManualInput
- Events: Changed, Focus, Blur, ValidationError

**See:** [Localization Guide](./Localization.md) | [Style Integration Guide](./Style%20Integration.md)

### 2. CAPTCHA Box (`captcha-control`)

A customizable CAPTCHA box providing bot protection using open-source CAPTCHA services:
- Multiple CAPTCHA provider support (OpenCaptcha, hCaptcha, reCAPTCHA)
- Customizable themes and messages
- Automatic refresh on verification failure
- Full K2 integration

**Key Features:**
- Supports standard K2 properties
- Custom properties: CaptchaProvider, ApiEndpoint, ApiKey, Theme, AutoRefresh
- Events: Changed, Focus, Blur, Verified, VerificationFailed
- Methods: Focus, Refresh, Verify

**See:** [Triggering Control Methods](./Triggering%20Control%20Methods.md) | [Form View Validation](./Form%20View%20Validation.md)

### 3. Button List (`button-list`)

A flexible button list control that displays a collection of interactive buttons with customizable styling, layout options, and icon support:
- Multiple layout modes (horizontal, vertical, grid)
- Customizable button sizes and styling
- Icon support with flexible positioning
- Data binding support via SmartObject binding
- Static data or dynamic content

**Key Features:**
- Supports DataBinding and standard K2 properties (Value, Width, Height, IsVisible, IsEnabled, IsReadOnly)
- Custom properties: List (listdata type), MaxItems, ButtonLayout, ButtonSize, ButtonHeight, ButtonWidth, ButtonRadius, ButtonSpacing, IconPosition, ImageSize, ImageFit, ContentAlignment, IconSpacing
- Events: OnChanged, OnButtonClick
- Methods: clearSelection, selectByValue, selectByIndex, getSelectedItem, getAllItems, refresh

**See:** [Data Binding Guide](./Data%20Binding.md) | [Triggering Control Methods](./Triggering%20Control%20Methods.md)

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

**Important:** After uploading a control in the Management Site, always refresh your browser in the K2 Designer. The new control won't appear until you do.

### K2 Designer - Using Custom Controls

**[Custom Controls in K2 Designer](https://help.nintex.com/en-US/nintexautomation/userguide/current/Content/Create/K2Designer/Controls/CustomControl/CustomControls.htm)**

This guide covers using custom controls in the K2 Designer:

- **Configure the control** - How to configure control properties
- **Properties** - Understanding control properties in the designer
- **Rules and events** - How to use control events in K2 rules
- **Considerations** - Important notes about using custom controls

## Learning Path

Here's a recommended path if you're new to custom control development:

1. **Start Here** - Read this Getting Started guide
2. **Manifest Basics** - Learn about [Manifest Configuration](./Manifest%20Configuration.md)
3. **Standard Properties** - Understand [Standard Properties](./Standard%20Properties.md) implementation
4. **Core Features:**
   - [Data Binding](./Data%20Binding.md) - For controls that display data from SmartObjects
   - [Form View Validation](./Form%20View%20Validation.md) - For controls that need validation
   - [Triggering Control Methods](./Triggering%20Control%20Methods.md) - For controls with callable methods
5. **Advanced Topics:**
   - [Responsive Controls](./Responsive%20Controls.md) - Responsive design practices
   - [Style Integration](./Style%20Integration.md) - Integrating with K2 form styling
   - [Localization](./Localization.md) - Multi-language and RTL support
   - [Script References](./Script%20References.md) - File referencing system

## Essential Concepts

### Manifest File

The `manifest.json` file is the central configuration for every K2 custom control. It defines:
- Control identity (name, tag, icon)
- File dependencies (scripts, styles, images)
- Properties and events
- Standard property support

**See:** [Manifest Configuration Guide](./Manifest%20Configuration.md) for all the details.

### Standard Properties

K2 provides standard properties that can be activated via the `supports` array:
- `Value` - Primary data value
- `Width`, `Height` - Control dimensions
- `IsVisible` - Show/hide control
- `IsEnabled` - Enable/disable interactions
- `IsReadOnly` - Read-only mode

**See:** [Standard Properties Guide](./Standard%20Properties.md) for implementation details.

### Data Binding

For controls that display data from K2 SmartObjects, you can use data binding:
- Add `"DataBinding"` to the `supports` array
- Define a property with `type: "listdata"`
- Implement `listItemsChangedCallback()` method

**See:** [Data Binding Guide](./Data%20Binding.md) for complete implementation.

## Next Steps

1. Review the [Manifest Configuration Guide](./Manifest%20Configuration.md) to understand the control structure
2. Study one of the example controls to see how concepts are implemented
3. Create your own control following the examples and guides
4. Refer to the [Documentation Overview](./Overview.md) for quick reference

## Troubleshooting & Debugging

### Caching Issues

If you run into caching issues with your control in the Control Dojo (e.g., changes not appearing, old code still running), try one of these solutions:

1. **Refresh the entire page** - Press `F5` or `Ctrl+R` to do a standard refresh
2. **Hard cache clear** - Press `F12` to open Developer Tools, then right-click the refresh button and select "Empty Cache and Hard Reload" (or "Clear cache and hard reload" depending on your browser)

This ensures your browser loads the latest version of your control files.

### Console & Debugging Tools

The Control Dojo includes a built-in console for viewing logged messages from the dojo and your controls. However, you have several options for debugging:

- **Dojo Console** - The built-in console can be collapsed, dragged, and repositioned to suit your workflow
- **Browser Console** - You can use your browser's native console (F12) or inspector tools if you prefer
- **Uncaught Exceptions** - While the dojo tries to capture specifically logged messages from controls, uncaught exceptions will appear in the browser console, which is often useful for debugging your control

The browser console provides additional debugging capabilities like breakpoints, network monitoring, and element inspection that can be helpful when developing and troubleshooting your controls.

## Getting Help

- Review the example controls in the `Controls/` folder
- Check the documentation guides for specific topics
- Refer to official K2 documentation for registration and deployment questions
- Examine the manifest.json files of example controls for reference

## Summary

Custom controls extend K2's functionality by providing reusable web components. The Control Dojo includes:
- Three example controls that show how things work
- Documentation covering all aspects of control development
- A clear learning path from basics to advanced topics
- Links to official K2 documentation for registration and deployment

Start with the [Manifest Configuration Guide](./Manifest%20Configuration.md) to begin creating your first custom control!

