# Script References in K2 Controls

This guide explains how to reference files (CSS, JavaScript, and images) within your custom K2 controls using the dynamic referencing system.

## Overview

When creating custom K2 controls, you need to reference files like CSS stylesheets, JavaScript modules, and images. These files are stored in the database rather than as static files, so standard file paths won't work. The Control Dojo uses a dynamic referencing system that automatically converts your references into proper URLs.

## Basic Reference Format

All file references should use the format `{{filename.extension}}`:

```javascript
// JavaScript file reference
import { helperFunction } from '{{helper.js}}';

// CSS file reference  
@import url('{{styles.css}}');

// Image reference
background-image: url('{{myImage.jpg}}');
```

## Reference Types

### CSS References

For CSS files, wrap the reference in `url()` when needed:

```css
/* Correct - with url() wrapper */
background-image: url('{{background.jpg}}');
@import url('{{additional-styles.css}}');

/* Correct - direct reference */
@import '{{base-styles.css}}';

/* Correct - quoted reference */
background-image: url("{{logo.png}}");
```

### JavaScript References

JavaScript references work differently since all scripts are loaded into the same scope:

```javascript
// These references will be replaced with URLs, but direct referencing is preferred
import { utility } from '{{utils.js}}';

// Better approach - direct function calls since scripts share scope
utility.doSomething();
```

**Important**: Since all JavaScript files are loaded into the same scope, you can call functions directly without imports once the scripts are loaded. This makes things simpler than you might expect.

### Image References

Image references are automatically converted to AJAX calls:

```html
<!-- This reference -->
<img src="{{myImage.jpg}}" alt="My Image">

<!-- Becomes this URL -->
<img src="Utilities/AjaxCall.ashx?method=GETCUSTOMCONTROLICONFILE&controlName=your-control-name&fileName=myImage.jpg" alt="My Image">
```

## Manifest File Ordering

The order of file definitions in your `manifest.json` matters—for both CSS and JavaScript files.

### JavaScript File Order

JavaScript files are loaded sequentially. Define dependencies first:

```json
{
  "runtimeScriptFileNames": [
    "runtime_helper.js",    // Contains utility functions
    "core_script.js",      // Core functionality
    "runtime_ref.js"       // Depends on both above files
  ]
}
```

### CSS File Order

CSS files follow cascade rules - later files override earlier ones:

```json
{
  "runtimeStyleFileNames": [
    "core_styles.css",        // Base styles
    "not_referenced_extra.css", // Additional styles
    "runtime_styles.css"      // Override styles (highest priority)
  ]
}
```

**Example**: If `core_styles.css` defines `.image-display` styles and `runtime_styles.css` also defines `.image-display`, the runtime styles will win.

## File Structure

The folder structure within your control package is flexible:

```
my-control/
├── manifest.json
├── scripts/
│   ├── core.js
│   └── utils/
│       └── helper.js
├── styles/
│   ├── main.css
│   └── themes/
│       └── dark.css
└── assets/
    ├── logo.png
    └── icons/
        └── settings.svg
```

You can nest files and folders as needed. The only restriction? **Duplicate filenames aren't allowed anywhere in the structure**.

## Common Issues and Solutions

### Duplicate File Names

**Problem**: Having files with the same name in different folders will cause registration errors. K2 doesn't like that.

```
❌ This will fail:
my-control/
├── utils.js
└── helpers/
    └── utils.js  // Duplicate name!
```

**Solution**: Use unique filenames throughout your control. It's easier than dealing with conflicts:

```
✅ This works:
my-control/
├── core-utils.js
└── helpers/
    └── helper-utils.js
```

### Missing File References

**Problem**: Referencing files that don't exist won't be replaced and will cause errors.

```css
/* This won't work if missing-file.css doesn't exist */
@import '{{missing-file.css}}';
```

**Solution**: Make sure all referenced files actually exist in your control package. It's easy to miss this.

### Image Loading Failures

**Problem**: Missing images will show browser default broken image icons. Not pretty.

**Solution**: Verify all image files exist and are properly referenced. Check the manifest too.

## Best Practices

1. **Use descriptive filenames** to avoid conflicts
2. **Order your manifest files** based on dependencies (JS) and cascade priority (CSS)
3. **Test all references** before deploying your control
4. **Use direct function calls** in JavaScript instead of imports when possible
5. **Keep file structure organized** but don't worry about nesting depth
6. **Prefix all global helper functions** with your control name to avoid namespace collisions (see [Global Namespace Collisions](#global-namespace-collisions) below)

## External References

External references (CDN links, external APIs) work normally and are not processed by the referencing system:

```html
<!-- These work as expected -->
<link rel="stylesheet" href="https://cdn.example.com/styles.css">
<script src="https://cdn.example.com/library.js"></script>
<img src="https://example.com/image.jpg" alt="External Image">
```

## Troubleshooting

### Reference Not Replaced

If your `{{filename}}` reference isn't being replaced:

1. Check that the file exists in your control package
2. Verify the filename matches exactly (case-sensitive)
3. Ensure the file is listed in your manifest.json

### JavaScript Scope Issues

If JavaScript functions aren't available:

1. Check the order of files in `runtimeScriptFileNames`
2. Ensure dependent files are loaded before files that use them
3. Consider using direct function calls instead of imports

### Global Namespace Collisions

**Critical Issue**: All JavaScript files from all registered controls are loaded into the same global scope. If multiple controls define functions with the same name, the last one loaded will overwrite the earlier ones, causing unexpected behavior.

**Problem Example**:
```javascript
// Control A (CAPTCHA Box) - designtime_logic.js
function generateDesignTemplate() {
  return '<div class="captcha-control">...</div>';
}

// Control B (Location Picker) - designtime_logic.js  
function generateDesignTemplate() {
  return '<div class="map-picker">...</div>';
}
```

If both controls are registered, whichever loads last will overwrite the other's function. When Control A tries to render, it may get Control B's template instead, causing errors like `Cannot read properties of null (reading 'addEventListener')` because the DOM structure doesn't match expectations.

**Solution - Use Unique Function Names**:

Prefix all helper functions with your control's unique identifier:

```javascript
// Control A (CAPTCHA Box) - designtime_logic.js
function captchaGenerateDesignTemplate() {
  return '<div class="captcha-control">...</div>';
}

function captchaDetectBrowserCulture() {
  // ...
}

function captchaGetLocalizedString(key) {
  // ...
}

// Control B (Location Picker) - designtime_logic.js
function locationGenerateDesignTemplate() {
  return '<div class="map-picker">...</div>';
}

function locationDetectBrowserCulture() {
  // ...
}

function locationGetLocalizedString(key) {
  // ...
}
```

**Best Practices**:

1. **Prefix all global functions** with your control name or a unique identifier
2. **Apply to both design-time and runtime scripts** - collisions can occur in either context
3. **Common function names to watch for**:
   - `detectBrowserCulture()`
   - `getLocalizedString()`
   - `generateDesignTemplate()`
   - `renderDesignPreview()`
   - `paintAll()`
   - `onPropertyChanged()`
   - Any utility functions shared across controls

4. **Safe function names** (these are typically fine to share):
   - `safeRaisePropertyChanged()` - Usually identical implementations
   - `safeGetControlStyleTemplate()` - Usually identical implementations
   - Standard K2 API functions

5. **Alternative approach - IIFE (Immediately Invoked Function Expression)**:
   ```javascript
   (function() {
     // All your control code here
     // Functions are scoped to this closure
     function generateTemplate() {
       // ...
     }
     
     // Expose only what's needed globally
     window.MyControlHelpers = {
       generateTemplate: generateTemplate
     };
   })();
   ```

**Testing for Collisions**:

1. Register multiple controls in the same K2 environment
2. Test each control's functionality
3. Check browser console for errors about missing DOM elements
4. Verify controls render correctly when used together

**Real-World Example**:

The CAPTCHA Box and Location Picker controls both used `generateDesignTemplate()`, `detectBrowserCulture()`, and `getLocalizedString()`. When both were registered, the Location Picker's functions overwrote the CAPTCHA Box's functions, causing the CAPTCHA control to render the Location Picker's template instead. This was fixed by renaming all helper functions with unique prefixes (`captcha*` and `location*`).

### CSS Override Problems

If CSS styles aren't applying correctly:

1. Check the order of files in `runtimeStyleFileNames`
2. Ensure override files are listed after base files
3. Use more specific selectors if needed

## Example Control Structure

Here's a complete example of a well-structured control:

```
arabic-calendar/
├── manifest.json
├── runtime_logic.js
├── runtime_style.css
├── designtime_logic.js
├── designtime_style.css
├── assets/
│   ├── calendar-icon.svg
│   └── background-pattern.png
└── utils/
    ├── date-helpers.js
    └── localization.js
```

**manifest.json**:
```json
{
  "runtimeScriptFileNames": [
    "utils/date-helpers.js",
    "utils/localization.js", 
    "runtime_logic.js"
  ],
  "runtimeStyleFileNames": [
    "runtime_style.css"
  ]
}
```

**runtime_logic.js**:
```javascript
// Direct function calls work since all scripts share scope
const today = DateHelpers.getToday();
const localizedDate = Localization.formatDate(today);
```

**runtime_style.css**:
```css
.calendar-container {
  background-image: url('{{background-pattern.png}}');
}

.calendar-icon {
  background-image: url('{{calendar-icon.svg}}');
}
```

This structure ensures proper loading order and clean file organization while avoiding naming conflicts.
