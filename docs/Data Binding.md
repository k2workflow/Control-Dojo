# Data Binding Guide for K2 Custom Controls

## Overview

Want your control to display data from K2? Data binding lets you receive and render arrays of items from K2's SMO binder. This guide focuses on the `listdata` property type, which tends to be the most common approach.

**Note**: We're covering the basics here. Things like data caching and complex SmartObject associations aren't covered at the time of writing. Default value handling is now covered in [section 5](#5-implementing-default-value-support).

## Prerequisites

Before you start:
- Your control needs to extend `K2BaseControl`
- You should have a basic grasp of K2 custom controls (check the [Custom Controls Guide](./Custom%20Controls%20Guide.md) if you need a refresher)

## Enabling Data Binding Support

First step: add `"DataBinding"` to the `supports` array in your manifest. That tells K2 your control can handle bound data.

```json
{
  "supports": [
    "...",
    "DataBinding",
    "..."
  ]
}
```

## Data Source Property Types

Depending on what you're building, K2 offers a few property types for data binding:

### List Data Property (`listdata`)

Use `listdata` for controls that show arrays of items—think dropdowns, listboxes, or data grids. It's usually the go-to option for pulling data from K2's SMO binder.

**Example:**
```json
{
  "properties": [
    {
      "id": "List",
      "refreshdisplay": "true",
      "friendlyname": "List Items",
      "type": "listdata",
      "category": "Detail",
      "initialvalue": "[{\"display\": \"Item 1\", \"value\": \"1\"},{\"display\": \"Item 2\",\"value\": \"2\"}]"
    }
  ]
}
```

**Key Settings:**

| Field | Value | Description |
|-------|-------|-------------|
| `type` | `"listdata"` | Required - identifies this as a list data property |
| `initialvalue` | JSON string array | Recommended - provides static sample data shown when control is first dropped in designer |
| `refreshdisplay` | `"true"` | Recommended - ensures control updates when data changes |
| `category` | `"Detail"` | Recommended - groups data properties together in property panel |

**Important**: The `initialvalue` needs to be a **JSON string** with an array of objects. This static data shows up when you first drop the control on a form, before any SmartObject binding is set up.

### List Property Structure (`list` with `ListParts`)

Building something like a data grid with column definitions? You'll probably want the `list` type with `ListParts`:

```json
{
  "id": "Columns",
  "friendlyname": "Columns",
  "description": "Column definitions for the data grid",
  "type": "list",
  "category": "Data",
  "listParts": [
    {
      "id": "FieldName",
      "name": "fieldName",
      "displayName": "Field Name",
      "type": "string"
    },
    {
      "id": "HeaderText",
      "name": "headerText",
      "displayName": "Header Text",
      "type": "string"
    },
    {
      "id": "Width",
      "name": "width",
      "displayName": "Width",
      "type": "string"
    }
  ]
}
```

**Note**: The `list` type with `ListParts` is for metadata—like column definitions—not for actual data items. When you need real data from the SMO binder, stick with `listdata`.

## Implementing List Data Binding

### 1. Extend K2BaseControl

Your control class needs to extend `K2BaseControl`. Here's the basic setup:

```javascript
if (!window.customElements.get('k2-genericlist-control')) {
  window.customElements.define('k2-genericlist-control', class GenericListControl extends K2BaseControl {
    constructor() {
      super();
      // Initialize data storage
      this._dataItems = [];
      this._items = [];
      this._listConfig = { partmappings: {} };
    }
    // ... rest of implementation
  });
}
```

**See:** [GenericList New Control](../Controls/GenericList%20New/) for the complete implementation.

### 2. Implement listItemsChangedCallback

This method is **required**. K2 calls it when:
- The control first loads (using your initialvalue data)
- The bound data changes at runtime
- SmartObject data gets loaded

```javascript
/**
 * K2 List API Method
 * Called at design time and runtime
 * Called with static data, and SmartObject data depending on the user's config
 * @param {Object} itemsChangedEventArgs - Contains NewItems array
 */
listItemsChangedCallback(itemsChangedEventArgs) {
  if (Array.isArray(itemsChangedEventArgs.NewItems)) {
    this._dataItems = itemsChangedEventArgs.NewItems;
    this._setItems(this._dataItems);
  }
}
```

**Parameters:**
- `itemsChangedEventArgs.NewItems` - An array of data objects. Each object contains properties from your data source.

### 3. Implement listConfigChangedCallback (Optional)

Users configure part mappings (Display/Value fields) in the K2 designer? This method gets called when that happens. It tells your control which properties from the data items to use for display and value:

```javascript
/**
 * K2 List API method
 * Called when list configuration (part mappings) changes
 * @param {Object} config - Configuration object with partmappings
 * @param {string} listname - The name of the list (empty if only one list)
 */
listConfigChangedCallback(config, listname) {
  this._listConfig = config;
  // Re-process items with new configuration
  this._setItems(this._dataItems);
}
```

The `config` object structure:
```javascript
{
  partmappings: {
    "Display": "display",  // Property name or XML template for display
    "Value": "value"        // Property name for value
  }
}
```

### 4. Process the Data Items

You'll need a method to transform the raw data items into whatever format your control uses internally:

```javascript
_setItems(items) {
  this._items = [];
  
  if (Array.isArray(items)) {
    // Get field mappings from config (default to "display" and "value")
    var displayProperty = "display";
    var valueProperty = "value";
    
    if (this._listConfig && this._listConfig.partmappings) {
      displayProperty = this._listConfig.partmappings["Display"] || "display";
      valueProperty = this._listConfig.partmappings["Value"] || "value";
    }

    // Process each item
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      var value = item[valueProperty];
      var display;

      // Check if displayProperty is an XML template
      if (displayProperty && typeof displayProperty === 'string' && displayProperty.startsWith('<Template>')) {
        // Use parseDisplayTemplate helper from K2BaseControl
        display = this.parseDisplayTemplate(displayProperty, item);
      } else {
        // displayProperty is a property name, get the value from the item
        display = item[displayProperty];
      }

      this._items.push({
        display: display,
        value: value,
        rawData: item // Keep reference to original data
      });
    }
  }

  // Update the display
  this._render();
}
```

### 5. Implementing Default Value Support

Many controls need to support default values—items that should appear first in the list and be automatically selected when the control loads. This is especially useful for dropdowns, listboxes, and similar selection controls.

#### Supported Field Names

The control checks for default values using multiple field names (in order of priority):
- `isDefault` (lowercase)
- `IsDefault` (capitalized)
- `Default` (capitalized, common in SMO data)
- `default` (lowercase)

#### Supported Value Formats

The control accepts multiple value formats to indicate a default item:

| Format | Example Values | Description |
|--------|---------------|-------------|
| Boolean | `true`, `false` | Standard boolean values |
| String (true) | `"true"`, `"True"`, `"TRUE"` | String representation of true |
| String (yes/no) | `"yes"`, `"Yes"`, `"YES"`, `"no"`, `"No"`, `"NO"` | Yes/No values (common in SMO) |
| Numeric | `1`, `0`, `"1"`, `"0"` | Numeric representation (1 = default) |

**Note**: Any value that evaluates to `true`, `"true"`, `"yes"`, or `1` will be treated as a default item.

#### How It Works

When processing items, the control will:

1. **Check each item** for a default field (`isDefault`, `IsDefault`, `Default`, or `default`)
2. **Separate default items** from regular items
3. **Reorder items** so the default item appears first in the list
4. **Auto-select** the default item if no other selection exists

#### Implementation Example

Here's how to add default value support to your `_setItems` method:

```javascript
_setItems(items) {
  this._items = [];
  
  if (Array.isArray(items)) {
    // Get field mappings from config
    var displayProperty = this._listConfig?.partmappings?.["Display"] || "display";
    var valueProperty = this._listConfig?.partmappings?.["Value"] || "value";
    
    // Separate default item and other items
    var defaultItem = null;
    var otherItems = [];

    // Process each item
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      var value = item[valueProperty];
      var display = item[displayProperty];
      
      // Check for default value field (supports multiple names and formats)
      var isDefault = false;
      var defaultValue = item["isDefault"] || item["IsDefault"] || item["Default"] || item["default"];
      
      if (defaultValue !== undefined && defaultValue !== null) {
        // Handle boolean true
        if (defaultValue === true) {
          isDefault = true;
        }
        // Handle string "true"
        else if (String(defaultValue).toLowerCase() === "true") {
          isDefault = true;
        }
        // Handle yes/no values
        else if (String(defaultValue).toLowerCase() === "yes") {
          isDefault = true;
        }
        // Handle numeric 1
        else if (defaultValue === 1 || String(defaultValue) === "1") {
          isDefault = true;
        }
      }

      var itemData = {
        display: display,
        value: value,
        isDefault: isDefault,
        rawData: item
      };

      // Separate default item from others
      if (isDefault) {
        if (defaultItem) {
          console.warn('[Control] Multiple items with default=true found. Using first one.');
        } else {
          defaultItem = itemData;
        }
      } else {
        otherItems.push(itemData);
      }
    }

    // Build items array: default first, then others
    if (defaultItem) {
      this._items.push(defaultItem);
    }
    this._items = this._items.concat(otherItems);

    // Auto-select default if no selection exists
    if (defaultItem && !this._selectedValue) {
      this.setSelectedItem(defaultItem);
    }
  }

  // Update the display
  this._render();
}
```

#### Static Data Example

For static data in your manifest `initialvalue`:

```json
{
  "id": "List",
  "type": "listdata",
  "initialvalue": "[{\"display\": \"Option 1\", \"value\": \"1\", \"isDefault\": true},{\"display\": \"Option 2\",\"value\": \"2\", \"isDefault\": false},{\"display\": \"Option 3\",\"value\": \"3\", \"isDefault\": false}]"
}
```

**Important**: All items should explicitly set `isDefault` to `true` or `false` for clarity.

#### SmartObject Data Example

When using SmartObject data, include a field in your SMO that indicates the default value. Common approaches:

**Option 1: Boolean Field**
```javascript
// SMO returns:
[
  { ID: "1", Name: "Fezile", Default: true },
  { ID: "2", Name: "Esmari", Default: false },
  { ID: "3", Name: "Jaco", Default: false }
]
```

**Option 2: Yes/No Field**
```javascript
// SMO returns:
[
  { ID: "1", Name: "Fezile", Default: "Yes" },
  { ID: "2", Name: "Esmari", Default: "No" },
  { ID: "3", Name: "Jaco", Default: "No" }
]
```

**Option 3: Numeric Field**
```javascript
// SMO returns:
[
  { ID: "1", Name: "Fezile", Default: 1 },
  { ID: "2", Name: "Esmari", Default: 0 },
  { ID: "3", Name: "Jaco", Default: 0 }
]
```

All of these formats will work—the control automatically detects and handles them.

#### Practical K2 Setup

To set up default values in K2:

1. **Create a SmartObject** with a boolean field called `Default` (or `IsDefault`, `isDefault`, etc.)
2. **Set the field value** to `true` for the item you want as default, `false` for all others
3. **Bind the SmartObject** to your control's listdata property

**Example**: If you have a SmartObject with fields `ID`, `Name`, and `Default`:
- Set `Default = true` for the item that should be the default
- Set `Default = false` for all other items
- The control will automatically detect the `Default` field and use it

**Note**: If multiple items have `Default = true`, the control will use the **first** item with `true` as the default. It's best practice to only have one item set to `true`.

#### Best Practices

1. **Only one default**: While the control will handle multiple items with `isDefault: true`, it's best practice to have only one default item. The control will use the first one found and log a warning.

2. **Explicit values**: For static data, always set `isDefault: true` or `isDefault: false` explicitly. Don't omit the field.

3. **SMO field naming**: Use a clear field name like `Default`, `IsDefault`, or `isDefault` in your SmartObject. The control checks multiple variations, but consistency helps.

4. **Value consistency**: Use the same value format throughout your data. Mixing `true`/`false` with `"yes"`/`"no"` works, but consistency is cleaner.

5. **Logging**: The control logs detailed information about default value processing. Check the browser console to verify your default values are being detected correctly.

#### Debugging Default Values

The control provides detailed console logging to help debug default value issues:

- `Processing item X` - Shows each item being processed with its `isDefault` status
- `defaultFieldValue` - Shows the raw value found in the default field
- `availableFields` - Lists all fields available in the raw item
- `Found default item` - Confirms when a default item is detected
- `Default item will be placed first` - Confirms reordering
- `Auto-selecting default item` - Confirms auto-selection

If your default values aren't working, check the console logs to see:
- What field name is being checked
- What value is found in that field
- Whether `isDefault` is being set to `true`

### 6. Update Your Render Method

**Important**: Controls that extend `K2BaseControl` must render into the shadow DOM. The base class's `render()` method creates a shadow DOM via `ensureShadow()`, so you need to render into `this._shadow` instead of directly to the element.

**Option 1: Override `render()` (Recommended for K2BaseControl)**

```javascript
render() {
  if (this._hasRendered) return;
  
  // Ensure shadow DOM is set up (from base class)
  this.ensureShadow();
  
  // Render into shadow DOM
  if (this._shadow) {
    this._shadow.innerHTML = `
      <style>
        /* Your styles here */
      </style>
      <div class="list-container"></div>
    `;
    
    this._listContainer = this._shadow.querySelector('.list-container');
  }
  
  // Process and render items
  this._renderItems();
  
  this._hasRendered = true;
  this.dispatchEvent(new Event('Rendered'));
}

_renderItems() {
  if (!this._listContainer) return;
  
  this._listContainer.innerHTML = '';
  
  // Render each item
  if (this._items.length > 0) {
    for (var i = 0; i < this._items.length; i++) {
      var item = this._items[i];
      var itemElement = this._createItemElement(item);
      this._listContainer.appendChild(itemElement);
    }
  }
}
```

**Option 2: Override `_render()` (Alternative pattern)**

```javascript
_render() {
  super._render();
  
  // Base class already set up shadow DOM, render into it
  if (!this._listContainer && this._shadow) {
    this._shadow.innerHTML = `
      <style>
        /* Your styles here */
      </style>
      <div class="list-container"></div>
    `;
    this._listContainer = this._shadow.querySelector('.list-container');
  }
  
  // Clear and render items
  if (this._listContainer) {
    this._listContainer.innerHTML = '';
    
    if (this._items.length > 0) {
      for (var i = 0; i < this._items.length; i++) {
        var item = this._items[i];
        var itemElement = this._createItemElement(item);
        this._listContainer.appendChild(itemElement);
      }
    }
  }
}
```

**Note**: If your control does NOT extend `K2BaseControl` (e.g., extends `HTMLElement` directly), you can render directly to the element using `this.innerHTML` or `this.appendChild()`.

### 7. Complete Example

Here's a full example based on the GenericList New control. You can see how it all fits together:

```javascript
if (!window.customElements.get('k2-genericlist-control')) {
  window.customElements.define('k2-genericlist-control', class GenericListControl extends K2BaseControl {
    
    constructor() {
      super();
      this._dataItems = [];
      this._items = [];
      this._listConfig = { partmappings: {} };
      this._listContainer = null;
    }

    connectedCallback() {
      super.connectedCallback();
      // Base class will call render() if not already rendered
      // But we can also call it explicitly
      if (!this._hasRendered) {
        this.render();
      }
    }

    listConfigChangedCallback(config, listname) {
      this._listConfig = config;
      this._setItems(this._dataItems);
    }

    listItemsChangedCallback(itemsChangedEventArgs) {
      if (Array.isArray(itemsChangedEventArgs.NewItems)) {
        this._dataItems = itemsChangedEventArgs.NewItems;
        this._setItems(this._dataItems);
      }
    }

    _setItems(items) {
      this._items = [];
      
      if (Array.isArray(items)) {
        var displayProperty = this._listConfig?.partmappings?.["Display"] || "display";
        var valueProperty = this._listConfig?.partmappings?.["Value"] || "value";

        for (var i = 0; i < items.length; i++) {
          var item = items[i];
          var value = item[valueProperty];
          var display = item[displayProperty];

          this._items.push({
            display: display,
            value: value,
            rawData: item
          });
        }
      }

      this._render();
    }

    render() {
      if (this._hasRendered) return;
      
      // Ensure shadow DOM is set up (from K2BaseControl)
      this.ensureShadow();
      
      // Render into shadow DOM
      if (this._shadow) {
        this._shadow.innerHTML = `
          <style>
            .list-container {
              display: block;
              width: 100%;
            }
            .list-item {
              padding: 8px;
              border-bottom: 1px solid #e5e7eb;
            }
          </style>
          <div class="list-container"></div>
        `;
        
        this._listContainer = this._shadow.querySelector('.list-container');
      }
      
      // Render items
      this._renderItems();
      
      this._hasRendered = true;
      this.dispatchEvent(new Event('Rendered'));
    }
    
    _renderItems() {
      if (!this._listContainer) return;
      
      this._listContainer.innerHTML = '';
      
      if (this._items.length > 0) {
        for (var i = 0; i < this._items.length; i++) {
          var itemElement = document.createElement('div');
          itemElement.className = 'list-item';
          itemElement.textContent = this._items[i].display;
          this._listContainer.appendChild(itemElement);
        }
      }
    }
    
    // Update _setItems to call _renderItems instead of _render
    _setItems(items) {
      this._items = [];
      
      if (Array.isArray(items)) {
        var displayProperty = this._listConfig?.partmappings?.["Display"] || "display";
        var valueProperty = this._listConfig?.partmappings?.["Value"] || "value";

        for (var i = 0; i < items.length; i++) {
          var item = items[i];
          var value = item[valueProperty];
          var display = item[displayProperty];

          this._items.push({
            display: display,
            value: value,
            rawData: item
          });
        }
      }

      // Render items if already rendered
      if (this._hasRendered) {
        this._renderItems();
      }
    }
  });
}
```

**Corresponding Manifest:**
```json
{
  "icon": "userId.svg",
  "displayName": "List",
  "tagName": "k2-genericlist-control",
  "supports": ["Property", "Items", "Width", "Style", "Format", "Value"],
  "properties": [
    {
      "id": "List",
      "refreshdisplay": "true",
      "friendlyname": "List Items",
      "type": "listdata",
      "category": "Detail",
      "initialvalue": "[{\"display\": \"Item 1\", \"value\": \"1\"},{\"display\": \"Item 2\",\"value\": \"2\"}]"
    },
    {
      "id": "Value",
      "refreshdisplay": "true",
      "friendlyname": "Value",
      "type": "text",
      "inputlength": "255",
      "initialvalue": null,
      "changesdisplay": true
    },
    {
      "id": "SelectedItem",
      "refreshdisplay": "true",
      "friendlyname": "Selected Item",
      "type": "text",
      "inputlength": "255",
      "initialvalue": null,
      "changesdisplay": true
    }
  ],
  "events": [
    { "id": "OnChanged", "friendlyname": "Changed" },
    { "id": "OnPopulated", "friendlyname": "Populated" },
    { "id": "OnInitialized", "friendlyname": "Initialized" }
  ],
  "methods": [{
    "id": "addTestItems",
    "displayname": "Add Test Items",
    "returntype": "None",
    "description": "Add default items",
    "parameters": []
  }]
}
```

**See:** [GenericList New Control](../Controls/GenericList%20New/) for the complete implementation.

## XML Template Support

K2 lets users combine multiple properties into one display string using XML templates. The `parseDisplayTemplate` method from `K2BaseControl` handles the parsing:

**Example XML Template:**
```xml
<Template>
  <Item SourceType="ObjectProperty" SourceID="FQN" />
  <Item SourceType="Value">
    <SourceValue xml:space="preserve"> - (ID: </SourceValue>
  </Item>
  <Item SourceType="ObjectProperty" SourceID="ID" />
  <Item SourceType="Value">
    <SourceValue xml:space="preserve">)</SourceValue>
  </Item>
</Template>
```

This would display: `"PropertyName - (ID: 123)"` for an item with `FQN: "PropertyName"` and `ID: "123"`.

Your `_setItems` method should check if `displayProperty` starts with `<Template>` and use `this.parseDisplayTemplate()` accordingly.

## Value Property Identification

Data-bound controls need to know which property holds the primary value. The GenericList New control uses `Value` for this:

```json
{
  "icon": "userId.svg",
  "displayName": "List",
  "tagName": "k2-genericlist-control",
  "supports": ["Property", "Items", "Width", "Style", "Format", "Value"],
  "properties": [
    {
      "id": "Value",
      "refreshdisplay": "true",
      "friendlyname": "Value",
      "type": "text",
      "inputlength": "255",
      "initialvalue": null,
      "changesdisplay": true
    },
    {
      "id": "List",
      "refreshdisplay": "true",
      "friendlyname": "List Items",
      "type": "listdata",
      "category": "Detail",
      "initialvalue": "[{\"display\": \"Item 1\", \"value\": \"1\"},{\"display\": \"Item 2\",\"value\": \"2\"}]"
    }
  ]
}
```

**See:** [GenericList New Control](../Controls/GenericList%20New/) for the complete manifest.

## Best Practices

### Data Binding Design

1. **Always include DataBinding in supports**: This makes your control discoverable as data-bound. Without it, K2 won't know your control can handle bound data.
2. **Use meaningful initial values**: Sample data helps users understand what the control does. Empty arrays or generic placeholders tend to confuse people.
3. **Handle empty data**: What happens when there are no items? Show something helpful instead of a blank control.
4. **Store raw data**: Keep the original data items (`_dataItems`) around. You'll probably need them for debugging or future features.
5. **Use part mappings**: Always check `_listConfig.partmappings` to see which fields to use. Don't assume `display` and `value` are always the right fields.
6. **Support XML templates**: If `displayProperty` starts with `<Template>`, use `parseDisplayTemplate()`. Users might configure complex display strings.

### Property Organization

1. **Group related properties**: Use `category` to keep data properties together. Makes the designer less cluttered.
2. **Document data fields**: A good `description` explains what each field does. Your future self will thank you.
3. **Set sensible defaults**: Default values should make sense for typical use cases. Avoid empty strings or nulls unless that's actually useful.
4. **Mark refreshdisplay**: Set `refreshdisplay: "true"` for properties that should update the UI when they change.

### Implementation

1. **Always validate data**: Check that `itemsChangedEventArgs.NewItems` is actually an array before you try to process it. Trust but verify.
2. **Initialize properly**: Set up your data storage arrays in the constructor. Don't wait until later—it'll bite you.
3. **Call super methods**: When overriding `_render()` or `connectedCallback()`, always call the super version first. The base class probably does important stuff.

## Common Issues

### Data Not Appearing

If your data isn't showing up:
- Make sure `listItemsChangedCallback` is implemented correctly. A typo in the method name will break everything.
- Check that `initialvalue` in the manifest is a valid JSON string. Invalid JSON usually means the control won't load at all.
- Verify that `_render()` is actually being called after data is set. Add some console logs if you're not sure.
- Confirm the control extends `K2BaseControl`. Without that, the data binding methods won't be available.

### Wrong Fields Being Used

Seeing the wrong fields in your display?
- Make sure `listConfigChangedCallback` is implemented. If it's missing, you'll always use the defaults.
- Check that you're reading part mappings from `_listConfig.partmappings`. The config object structure can be tricky.
- Ensure your default fallback values make sense. If K2 doesn't send mappings, you'll use these defaults.
- Verify the part mapping property names match what K2 actually sends. Sometimes the casing or spelling is different than you expect.

### XML Templates Not Working

XML templates can be finicky:
- Use `this.parseDisplayTemplate()` from K2BaseControl. Don't try to parse it yourself—the base class handles the complexity.
- Make sure the template actually starts with `<Template>`. Case-sensitive, and whitespace matters.
- Verify that your item data contains all the properties referenced in the template. Missing properties will show as empty or undefined.
- Check the XML formatting. Malformed XML tends to fail silently, which makes debugging frustrating.

## Common Patterns

### Dropdown/Select Control

- Single value selection from a list
- Uses `listdata` property type
- Has Display and Value part mappings
- Raises Changed event on selection

### List/Listbox Control

- Multiple or single item selection
- Uses `listdata` property type
- Displays items in a scrollable container
- Supports item-level interactions

### Data Grid/Table Control

- Displays tabular data
- Uses `listdata` for data rows
- Uses `list` with `ListParts` for column definitions
- Supports row selection and interactions

## Related Documentation

- [Custom Controls Guide](./Custom%20Controls%20Guide.md) - Complete guide to creating custom controls
- [Standard Properties](./Standard%20Properties.md) - Standard property implementation
- [Script References](./Script%20References.md) - K2 scripting API reference

## Summary

To enable data binding in your control:

1. Extend `K2BaseControl`—this gives you the methods you need.
2. Add `"DataBinding"` to the `supports` array in your manifest. Without this, K2 won't treat your control as data-bound.
3. Define a property with `type: "listdata"` in the manifest. This tells K2 what kind of data you're expecting.
4. Provide `initialvalue` as a JSON string array. This shows up in the designer before any SmartObject binding is configured.
5. Implement `listItemsChangedCallback(itemsChangedEventArgs)` - **required**. This is where the data arrives.
6. Optionally implement `listConfigChangedCallback(config, listname)` if you want to support part mappings.
7. Process the `itemsChangedEventArgs.NewItems` array. Transform it into whatever format your control needs.
8. Update your render logic to actually display the items.

Once you've done these steps, your control should automatically receive data from K2's SMO binder when configured. The initial value will show up when you first drop the control on a form.
