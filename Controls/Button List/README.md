# Button List Control

A flexible button list control for K2 that displays a collection of buttons with customizable styling, layout options, and icon support. Perfect for navigation menus, action buttons, and selection interfaces.

## Features

### Core Functionality
- **Dynamic Button List**: Display buttons from static data or SmartObject binding
- **Selection Management**: Single selection with Value property tracking
- **Icon Support**: Display icons/images on buttons from static data or SMO fields
- **Multiple Layouts**: Horizontal, vertical, or grid layouts
- **Customizable Styling**: Full control over button dimensions and appearance
- **Data Binding**: Support for K2 SmartObject data binding

### Design & UX
- **Flexible Layouts**: Choose from horizontal, vertical, or grid arrangements
- **Size Options**: Small, medium, or large button sizes
- **Icon Positioning**: Icons can be positioned left, right, top, or hidden
- **Custom Dimensions**: Set individual button height, width, and border radius
- **Visual Feedback**: Clear selected state with hover effects
- **Responsive Design**: Adapts to container sizes

### Integration
- **K2 Compatible**: Full integration with K2 Designer and runtime
- **Standard Properties**: Supports Width, Height, IsVisible, IsEnabled, IsReadOnly
- **Event System**: Changed and Button Clicked events for workflow integration
- **Property Binding**: Value property updates on button selection
- **Custom Methods**: Programmatic control via methods

## File Structure

```
Button List/
├── README.md                    # This documentation
├── manifest.json               # Control metadata and properties
├── generic-list.js             # Combined runtime and design-time logic
├── generic-list.css            # Control styles
└── designtime_style.css        # Design-time specific styles
```

## Properties

### Core Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| **Value** | String | `null` | The value of the currently selected button. Updates automatically when a button is clicked. |
| **List** | ListData | `[]` | Array of button items. Each item should have `display`, `value`, and optionally `icon` fields. Supports both static JSON and SmartObject binding. |
| **MaxItems** | String | `"0"` | Maximum number of items to display (0 = unlimited). Accepts numeric values as strings. |
| **ButtonLayout** | String | `"horizontal"` | Layout mode: `"horizontal"`, `"vertical"`, or `"grid"` |
| **ButtonSize** | String | `"medium"` | Button size: `"small"`, `"medium"`, or `"large"` |
| **ButtonStyle** | String | `"normal"` | Button style matching K2 button control styles: `"normal"`, `"main"`, `"quiet"`, or `"destructive"` |
| **IconPosition** | String | `"left"` | Icon position relative to text: `"left"`, `"right"`, `"top"`, `"bottom"`, `"only"` (icon only, hide text), or `"none"` (text only, hide icon) |
| **ButtonHeight** | String | `""` | Height for individual buttons (e.g., `"40px"`, `"2rem"`, `"auto"`). Leave empty to use default size based on ButtonSize. |
| **ButtonWidth** | String | `""` | Width for individual buttons (e.g., `"100px"`, `"150px"`, `"auto"`). Leave empty to use default size. |
| **ButtonRadius** | String | `"6px"` | Border radius for buttons (e.g., `"6px"`, `"50%"`, `"0"`). Default is `"6px"`. |
| **ButtonSpacing** | String | `"8px"` | Spacing between buttons (e.g., `"8px"`, `"12px"`, `"1rem"`). Default is `"8px"`. |
| **ImageSize** | String | `"20px"` | Size for images/icons (e.g., `"20px"`, `"24px"`, `"50%"`, `"1.5rem"`). Use percentage for relative sizing. |
| **ImageFit** | String | `"contain"` | How images should be sized within the button: `"contain"` (fit within bounds), `"cover"` (fill area), `"fill"` (stretch), `"scale-down"` (smaller only), or `"none"` (original size) |
| **ContentAlignment** | String | `"center"` | Horizontal alignment of content within buttons: `"start"` (left), `"center"`, or `"end"` (right) |
| **IconSpacing** | String | `"8px"` | Spacing between icon and text (e.g., `"8px"`, `"12px"`, `"0.5rem"`) |

### Standard K2 Control Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| **Width** | String | `"100%"` | Control width |
| **Height** | String | `"auto"` | Control height |
| **IsVisible** | Boolean | `true` | Whether the control is visible |
| **IsEnabled** | Boolean | `true` | Whether the control is enabled and interactive |
| **IsReadOnly** | Boolean | `false` | Whether the control is in read-only mode |

### Property Field Reference

All properties support the following fields:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | String | Yes | Unique property identifier (used in code) |
| `friendlyname` | String | Yes | Human-readable name shown in property panel |
| `type` | String | Yes | Property data type: `"string"`, `"bool"`, `"text"`, `"listdata"` |
| `initialvalue` | String | Yes | Default value for the property |
| `refreshdisplay` | String | Yes | Whether changes trigger display refresh (`"true"` or `"false"`) |
| `changesdisplay` | Boolean | Yes | Whether changes affect visual appearance |
| `inputlength` | String | No | Maximum input length for string properties |
| `description` | String | No | Property description/tooltip shown in designer |
| `category` | String | No | Property category for grouping (e.g., `"Detail"` for data properties) |

## Events

| Event | Description |
|-------|-------------|
| **OnChanged** (friendly name: "Changed") | Fired when a button is clicked and the Value property changes. Contains the new value, old value, and selected item. **Use this event to transfer the selected value to other controls.** |
| **OnButtonClick** (friendly name: "Button Clicked") | Fired when any button is clicked. Contains the button item details (display, value, index) and previous selection state. |

## List Data Structure

### Static Data Format

When using static data, the List property should contain a JSON string array:

```json
[
  {
    "display": "Home",
    "value": "home",
    "icon": "https://example.com/icons/home.png"
  },
  {
    "display": "About",
    "value": "about",
    "icon": "https://example.com/icons/about.png"
  },
  {
    "display": "Contact",
    "value": "contact"
  }
]
```

### List Item Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `display` | String | Yes | Text displayed on the button |
| `value` | String | Yes | Value associated with the button (used for Value property) |
| `icon` | String | No | Icon/image URL, SVG string, icon class, or base64 data URI |

### SmartObject Binding

When binding to a SmartObject:

1. **Configure Part Mappings**: In K2 Designer, map SmartObject fields to:
   - **Display**: Field containing the button text
   - **Value**: Field containing the button value
   - **Icon**: Field containing icon/image data (optional)

2. **Icon Field Mapping**: The icon field can contain:
   - Image URLs (e.g., `"https://example.com/image.png"`)
   - Base64 data URIs (e.g., `"data:image/png;base64,..."`)
   - SVG strings
   - Icon class names (e.g., `"fa fa-user"`)

3. **Default Behavior**: If no Icon mapping is configured, the control looks for an `"icon"` field in the data.

## Methods

| Method | Description | Parameters | Return Type |
|--------|-------------|------------|-------------|
| **clearSelection** | Clears the current selection | None | None |
| **selectById** | Selects a button by its ID (value property) | `id` (String) | None |
| **selectByText** | Selects a button by its display text | `text` (String) | None |
| **refresh** | Forces a re-render of the control | None | None |

### Method Examples

```javascript
// Clear selection
control.clearSelection();

// Select by ID (value property)
control.selectById("1");

// Select by text (display property)
control.selectByText("Home");

// Refresh control
control.refresh();
```

### Getting the Selected Value

To get the currently selected button's value, use the **OnChanged** event. The event provides the selected value in `event.detail.value`:

```javascript
// Listen for selection changes
control.addEventListener("OnChanged", function(event) {
  var selectedValue = event.detail.value;
  // Use the selected value - transfer to another control, etc.
  console.log("Selected button value:", selectedValue);
});
```

Alternatively, you can access the `Value` property directly:

```javascript
var selectedValue = control.Value;
```

## Usage Examples

### Basic Setup

```javascript
// Set list items
control.List = JSON.stringify([
  { display: "Home", value: "home" },
  { display: "About", value: "about" },
  { display: "Contact", value: "contact" }
]);

// Set layout
control.ButtonLayout = "horizontal";
control.ButtonSize = "medium";
control.ButtonStyle = "normal";
```

### Navigation Menu

```javascript
// Configure as navigation menu
control.List = JSON.stringify([
  { display: "Dashboard", value: "dashboard", icon: "https://example.com/icons/dashboard.svg" },
  { display: "Reports", value: "reports", icon: "https://example.com/icons/reports.svg" },
  { display: "Settings", value: "settings", icon: "https://example.com/icons/settings.svg" }
]);

control.ButtonLayout = "vertical";
control.IconPosition = "left";

// Listen for selection changes
control.addEventListener("OnChanged", function(event) {
  var selectedValue = event.detail.value;
  console.log("Navigation to:", selectedValue);
  // Handle navigation logic
});
```

### Custom Styling

```javascript
// Custom button dimensions
control.ButtonHeight = "50px";
control.ButtonWidth = "200px";
control.ButtonRadius = "10px";
control.ButtonSpacing = "12px";

// Custom layout
control.ButtonLayout = "grid";
control.ButtonSize = "large";
control.ButtonStyle = "main"; // Use main action style

// Custom icon/image settings
control.ImageSize = "24px";
control.ImageFit = "cover";
control.IconSpacing = "10px";
control.ContentAlignment = "start";
```

### SmartObject Binding

1. **Configure in K2 Designer**:
   - Set List property to use SmartObject binding
   - Map Display field to your SmartObject text field
   - Map Value field to your SmartObject value field
   - Map Icon field to your SmartObject image field (optional)

2. **Access Selected Value**:
   ```javascript
   // Value property automatically updates when button is clicked
   var selectedValue = control.Value;
   console.log("Selected:", selectedValue);
   ```

### Icon Support

Icons can be provided in multiple formats:

```javascript
// Image URL
{ display: "Home", value: "home", icon: "https://example.com/icons/home.png" }

// SVG String
{ display: "Settings", value: "settings", icon: "<svg>...</svg>" }

// Icon Class
{ display: "User", value: "user", icon: "fa fa-user" }

// Base64 Data URI (from SMO)
{ display: "Document", value: "doc", icon: "data:image/png;base64,iVBORw0KG..." }
```

## Layout Options

### Horizontal Layout
- Buttons arranged in a row
- Wraps to next line if needed
- Best for: Navigation bars, action buttons

### Vertical Layout
- Buttons arranged in a column
- Best for: Sidebar navigation, vertical menus

### Grid Layout
- Buttons arranged in a responsive grid
- Automatically adjusts columns based on available space
- Best for: Dashboard widgets, card-based interfaces

## Button Sizes

### Small
- Padding: 6px 12px
- Font size: 12px
- Min height: 32px

### Medium (Default)
- Padding: 10px 16px
- Font size: 14px
- Min height: 40px

### Large
- Padding: 14px 20px
- Font size: 16px
- Min height: 48px

## Icon Positioning

- **Left**: Icon appears to the left of the text (default)
- **Right**: Icon appears to the right of the text
- **Top**: Icon appears above the text (centered)
- **Bottom**: Icon appears below the text (centered)
- **Only**: Icon only - text is hidden (useful for icon-only buttons)
- **None**: Text only - icons are hidden

## Styling

### CSS Custom Properties

The control uses CSS custom properties for dynamic styling:

- `--button-height`: Individual button height
- `--button-width`: Individual button width
- `--button-radius`: Individual button border radius
- `--button-spacing`: Spacing between buttons
- `--image-size`: Size for images/icons
- `--image-fit`: How images should be sized (contain, cover, fill, etc.)
- `--content-align`: Horizontal alignment of content within buttons
- `--icon-spacing`: Spacing between icon and text

These are set on the container and cascade to all buttons.

### Button Styles

The control supports four button styles matching K2 button control styles:

- **Normal** (default): Gray background (#949494) with white text
- **Main Action**: Blue background (#0087bd) with light text (#f4f9fb) - for primary actions
- **Quiet Action**: Transparent background with gray border and text (#616161) - for secondary actions
- **Destructive Action**: Red background (#b71c1c) with white text - for destructive actions

Each style has appropriate hover and selected states with visual feedback (elevation, color changes).

## Troubleshooting

### Buttons Not Displaying

1. **Check List Property**: Verify the List property contains valid JSON
2. **Check Data Format**: Ensure items have `display` and `value` fields
3. **Check Console**: Look for JavaScript errors in browser console
4. **Verify Rendering**: Ensure control is rendered (check `_hasRendered` flag)

### Icons Not Showing

1. **Check Icon Data**: Verify icon field exists in list items
2. **Check Icon Format**: Ensure icons are valid URLs, SVG, or class names
3. **Check Icon Position**: Verify IconPosition is not set to `"none"` (use `"left"`, `"right"`, `"top"`, `"bottom"`, or `"only"` to show icons)

### Value Not Updating

1. **Check Event Handler**: Verify OnChanged event is being handled (note: event ID is "OnChanged", friendly name is "Changed")
2. **Check Property**: Verify Value property is being read correctly
3. **Check Selection**: Ensure button click is registering (check OnButtonClick event)

### Layout Issues

1. **Check ButtonLayout**: Verify layout value is `"horizontal"`, `"vertical"`, or `"grid"`
2. **Check Container Size**: Ensure control has sufficient width/height
3. **Check CSS**: Verify no conflicting CSS is overriding styles

### Data Binding Issues

1. **Check Part Mappings**: Verify Display, Value, and Icon mappings are configured
2. **Check Data Structure**: Verify SmartObject returns data in expected format
3. **Check Console Logs**: Review detailed logging for data structure (see code)

## Known Considerations

### Event Naming
- The event ID is `"OnChanged"` but the friendly name shown in K2 Designer is `"Changed"`
- When adding event listeners in code, use `"OnChanged"` (the actual event ID)
- The `OnButtonClick` event fires before the `OnChanged` event

### Icon Display
- Icons are automatically shown if available in list data and `IconPosition` is not set to `"none"`
- There is no separate `ShowIcon` property - icon visibility is controlled by the `IconPosition` property
- When `IconPosition` is set to `"only"`, text is hidden and only icons are displayed
- When `IconPosition` is set to `"none"`, icons are hidden and only text is displayed

### Data Binding
- The control supports K2 SmartObject data binding via the List property
- Part mappings must be configured in K2 Designer for Display, Value, and Icon fields
- Icons can come from K2 Collection XML format (automatically parsed) or direct URLs
- The control automatically extracts images from mixed content (text + XML collections)

### Button Styles
- Button styles match K2's standard button control styles for consistency
- Styles use CSS variables that can be customized via K2 theme integration
- Selected state styling varies by button style for proper visual feedback

### Performance
- The control uses Shadow DOM for style isolation
- Large lists (100+ items) may experience slight rendering delays
- Consider using `MaxItems` to limit displayed items for better performance

## Development

### Implementation Details

The control extends `K2BaseControl` and implements:
- Standard K2 control interface
- List data binding via `listItemsChangedCallback`
- Part mappings via `listConfigChangedCallback`
- Property change notifications
- Event dispatching

### Key Methods

- `_render()`: Main rendering method
- `_renderButtons()`: Creates button elements
- `_setItems()`: Processes list data items
- `_handleButtonClick()`: Handles button clicks
- `setSelectedItem()`: Updates selection state
- `_updateButtonStyles()`: Applies CSS custom properties

### Logging

The control includes comprehensive logging for debugging:
- `[Button List]` prefix for all log messages
- Detailed data structure logging
- Icon data analysis
- Part mapping information

Enable browser console to see detailed information about data binding and item processing.

## License

This control is provided as part of the Control Dojo examples and follows the same licensing terms.

## Icon Attribution

The control icon is from the [List Box icon](https://www.svgrepo.com/svg/376948/list-box) by **halfmage**, part of the **Majesticons Solid Interface Icons** collection, available under the [MIT License](https://opensource.org/licenses/MIT).

## Contributing

When extending this control:

1. **Maintain Compatibility**: Ensure K2 Designer compatibility
2. **Follow Patterns**: Use established patterns from K2BaseControl
3. **Document Changes**: Update documentation for new features
4. **Test Thoroughly**: Test with both static data and SmartObject binding
5. **Consider Accessibility**: Ensure keyboard navigation and screen reader support

## Support

For questions about this control:

- Check the troubleshooting section above
- Review the browser console for detailed logging
- Verify property configurations
- Test with sample data first
- Check K2 documentation for data binding setup

