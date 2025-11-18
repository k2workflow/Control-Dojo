# K2 Arabic Calendar Control

A comprehensive Arabic calendar control for K2 SmartForms that provides Islamic (Hijri) calendar functionality with modern styling, RTL support, and full K2 theme integration.

## Overview

The K2 Arabic Calendar control is designed specifically for Arabic-speaking users and Islamic calendar requirements. It displays dates in the Islamic Hijri calendar format while maintaining compatibility with Gregorian calendar systems. The control features a modern, clean interface with full right-to-left (RTL) support and automatic theme integration.

## Key Features

### Calendar Functionality
- **Islamic Calendar Display**: Shows dates in Hijri calendar format with Arabic month names
- **Multi-View Navigation**: Day, month, and year picker views for easy date selection
- **Arabic Localization**: Full Arabic text support with proper RTL layout
- **Manual Input Support**: Users can type dates directly or use the calendar picker
- **Date Validation**: Comprehensive validation for both Arabic and numeric date formats

### User Interface
- **Modern Design**: Clean, contemporary interface matching K2 design standards
- **RTL Support**: Full right-to-left layout for Arabic text
- **Responsive**: Works seamlessly on desktop and mobile devices
- **Accessibility**: Full keyboard navigation and ARIA support
- **Draggable Popup**: Calendar popup can be repositioned for better usability

### K2 Integration
- **Style-Aware Theming**: Automatically adapts to form's color scheme using CSS variables
- **K2 Theme Integration**: Matches K2 dynamic theme styling with bottom-border input design
- **Event System**: Full K2 event integration for form workflows
- **Property Binding**: Complete property support for K2 SmartForms

## Properties

### Quick Reference

| Property | Type | Default | Supported Values | Purpose |
|----------|------|---------|------------------|---------|
| **Value** | Text | `""` | Any Arabic Hijri date string | Selected date value |
| **Watermark** | Text | `"انقر لتحديد التاريخ"` | Any string | Placeholder text |
| **IsReadOnly** | Boolean | `false` | `true`, `false` | Prevent user interaction |
| **AllowManualInput** | Boolean | `true` | `true`, `false` | Enable/disable typing |
| **DateFormat** | Dropdown | `"dd/MM/yyyy"` | `"dd/MM/yyyy"`, `"MM/dd/yyyy"`, `"yyyy-MM-dd"` | Numeric input format |
| **Width** | Number | `""` | Number or string with unit | Control width |
| **IsVisible** | Boolean | `true` | `true`, `false` | Control visibility |
| **IsEnabled** | Boolean | `true` | `true`, `false` | Control interactivity |

### Core Properties

#### Value
- **Type**: Text (String)
- **Default**: `""` (empty string)
- **Description**: The currently selected date value
- **Format**: Always stored and returned in full Arabic Hijri format
- **Example**: `"١٥ رمضان ١٤٤٥ هـ"` (15 Ramadan 1445 AH)
- **Usage**: 
  ```javascript
  // Get current value
  const selectedDate = control.Value;
  
  // Set value programmatically
  control.Value = "١٥ رمضان ١٤٤٥ هـ";
  ```

#### Watermark
- **Type**: Text (String)
- **Default**: `"انقر لتحديد التاريخ"` (Click to select date)
- **Description**: Placeholder text displayed when the input field is empty
- **Usage**:
  ```javascript
  control.Watermark = "اختر تاريخ الميلاد"; // "Choose birth date"
  ```

#### IsReadOnly
- **Type**: Boolean
- **Default**: `false`
- **Supported Values**: `true`, `false`
- **Description**: When `true`, prevents all user interaction with the control
- **Behavior**: 
  - Calendar popup cannot be opened
  - Manual input is disabled
  - Control displays with read-only visual styling (grey overlay)
  - Value can still be set programmatically
- **Usage**:
  ```javascript
  control.IsReadOnly = true; // Display only, no interaction
  ```

#### AllowManualInput
- **Type**: Boolean
- **Default**: `true`
- **Supported Values**: `true`, `false`
- **Description**: Controls whether users can type dates directly into the input field
- **Behavior**:
  - `true`: Users can type dates manually or use calendar picker
  - `false`: Only calendar picker is available (input field is read-only)
- **Usage**:
  ```javascript
  control.AllowManualInput = false; // Calendar picker only
  ```

#### DateFormat
- **Type**: Dropdown (Selection)
- **Default**: `"dd/MM/yyyy"`
- **Supported Values**: 
  - `"dd/MM/yyyy"` - Day/Month/Year format (default)
  - `"MM/dd/yyyy"` - Month/Day/Year format
  - `"yyyy-MM-dd"` - Year-Month-Day format (ISO-style)
- **Description**: Controls the validation format for **manual numeric input only**. Users can select from available date format options in the property panel.
- **Important Notes**:
  - **Only affects manual numeric input** - When users type dates using numbers
  - **Validates Gregorian dates** - Numeric input is treated as Gregorian calendar dates, then converted to Islamic calendar internally
  - **Does not affect display** - Selected dates are always displayed in Arabic Hijri format
  - **Does not affect Arabic Hijri input** - Typing Arabic month names (e.g., "رمضان") bypasses DateFormat validation
- **Usage Examples**:
  ```javascript
  // Set to Day/Month/Year format
  control.DateFormat = "dd/MM/yyyy";
  // Valid inputs: "15/03/2024", "١٥/٠٣/٢٠٢٤"
  
  // Set to Month/Day/Year format
  control.DateFormat = "MM/dd/yyyy";
  // Valid inputs: "03/15/2024", "٠٣/١٥/٢٠٢٤"
  
  // Set to ISO format
  control.DateFormat = "yyyy-MM-dd";
  // Valid inputs: "2024-03-15", "٢٠٢٤-٠٣-١٥"
  ```

### Standard K2 Properties

#### Width
- **Type**: Number (String or Number)
- **Default**: `""` (empty, uses 100% of container)
- **Description**: Control width in pixels
- **Usage**: 
  ```javascript
  control.Width = 300; // 300 pixels
  control.Width = "300px"; // Also accepts string with unit
  ```

#### IsVisible
- **Type**: Boolean
- **Default**: `true`
- **Supported Values**: `true`, `false`
- **Description**: Controls whether the control is visible on the form
- **Behavior**: When `false`, the control is hidden using `display: none`
- **Usage**:
  ```javascript
  control.IsVisible = false; // Hide control
  ```

#### IsEnabled
- **Type**: Boolean
- **Default**: `true`
- **Supported Values**: `true`, `false`
- **Description**: Controls whether the control is enabled for interaction
- **Behavior**: 
  - `true`: Control is fully interactive
  - `false`: Control is disabled with visual styling (60% opacity), no interactions allowed
- **Usage**:
  ```javascript
  control.IsEnabled = false; // Disable control
  ```

## Events

### Quick Reference

| Event | Trigger | Event Data | Bubbles |
|-------|---------|------------|---------|
| **Changed** | Date selection or manual input | `{ value: string }` | Yes |
| **Focus** | Control receives focus | None | Yes |
| **Blur** | Control loses focus | None | Yes |
| **ValidationError** | Invalid date input | `{ message: string, value: string }` | Yes |

### Event Details

#### Changed Event
- **Event Name**: `"changed"` (lowercase)
- **Trigger**: 
  - User selects a date from the calendar popup
  - User enters a valid date manually and input loses focus
  - Value is set programmatically
- **Event Data**: 
  ```javascript
  {
    value: "١٥ رمضان ١٤٤٥ هـ"  // New date value in Arabic Hijri format
  }
  ```
- **Bubbles**: Yes
- **Use Cases**: 
  - Update other form controls based on selected date
  - Trigger workflows or business logic
  - Save data to backend
  - Calculate dependent dates
- **Example**:
  ```javascript
  control.addEventListener('changed', function(event) {
    console.log('Date changed to:', event.detail.value);
    // Update other controls or trigger workflows
  });
  ```

#### Focus Event
- **Event Name**: `"Focus"` (capitalized)
- **Trigger**: When the control receives keyboard focus (Tab key or click)
- **Event Data**: None
- **Bubbles**: Yes
- **Use Cases**: 
  - Show help text or tooltips
  - Highlight related controls
  - Track user interaction
  - Initialize dependent controls
- **Example**:
  ```javascript
  control.addEventListener('Focus', function(event) {
    showHelpText('Select a date from the calendar or type manually');
  });
  ```

#### Blur Event
- **Event Name**: `"Blur"` (capitalized)
- **Trigger**: When the control loses keyboard focus
- **Event Data**: None
- **Bubbles**: Yes
- **Use Cases**: 
  - Validate the entire form
  - Trigger calculations based on date
  - Save temporary data
  - Clear help text
- **Example**:
  ```javascript
  control.addEventListener('Blur', function(event) {
    validateForm();
    calculateAge();
  });
  ```

#### ValidationError Event
- **Event Name**: `"ValidationError"` (capitalized)
- **Trigger**: When manual input contains invalid date format after blur
- **Event Data**: 
  ```javascript
  {
    message: "تنسيق التاريخ غير صحيح",  // "Date format is incorrect" in Arabic
    value: "invalid-date-input"          // The invalid input value
  }
  ```
- **Bubbles**: Yes
- **Use Cases**: 
  - Show user-friendly error messages
  - Prevent form submission
  - Provide guidance on correct format
  - Log validation errors
- **Example**:
  ```javascript
  control.addEventListener('ValidationError', function(event) {
    showErrorMessage(event.detail.message);
    console.error('Invalid date input:', event.detail.value);
  });
  ```

### Event Handling Best Practices

1. **Always check event.detail**: Custom events include data in `event.detail`
2. **Handle validation errors**: Always listen for `ValidationError` to provide user feedback
3. **Use Focus/Blur for UX**: Improve user experience with contextual help
4. **Debounce Changed events**: If performing expensive operations, debounce the Changed event handler

## Usage Examples

### Basic Implementation
```javascript
// The control automatically handles Arabic date formatting
// Selected dates are displayed in format: "١٥ رمضان ١٤٤٥ هـ"
```

### Event Handling
```javascript
// Handle date changes
control.addEventListener('changed', function(event) {
    console.log('New date selected:', event.detail.value);
    // Update other form controls or trigger workflows
});

// Handle validation errors
control.addEventListener('ValidationError', function(event) {
    console.log('Invalid date:', event.detail.value);
    console.log('Error message:', event.detail.message);
    // Show user-friendly error message
});
```

### Property Configuration
```javascript
// Set watermark text
control.Watermark = "اختر تاريخ الميلاد";

// Enable/disable manual input
control.AllowManualInput = false; // Calendar picker only

// Set read-only mode
control.IsReadOnly = true; // Display only, no interaction
```

## Date Formats

### Understanding DateFormat vs. Display Format

The `DateFormat` property controls **manual numeric input validation only**. It does **not** control how dates are displayed or stored.

- **Display Format**: Always Arabic Hijri (e.g., `"١٥ رمضان ١٤٤٥ هـ"`)
- **Storage Format**: Always Arabic Hijri (e.g., `"١٥ رمضان ١٤٤٥ هـ"`)
- **DateFormat Property**: Only validates numeric input patterns

### Supported DateFormat Values

The `DateFormat` property accepts three values for validating numeric input:

#### 1. `"dd/MM/yyyy"` (Default)
- **Format**: Day/Month/Year
- **Valid Examples**:
  - `"15/03/2024"` (English numerals)
  - `"١٥/٠٣/٢٠٢٤"` (Arabic-Indic numerals)
  - `"15/3/2024"` (single digit month/day)
- **Invalid Examples**:
  - `"03/15/2024"` (wrong order for this format)
  - `"2024-03-15"` (wrong separator)

#### 2. `"MM/dd/yyyy"`
- **Format**: Month/Day/Year
- **Valid Examples**:
  - `"03/15/2024"` (English numerals)
  - `"٠٣/١٥/٢٠٢٤"` (Arabic-Indic numerals)
- **Invalid Examples**:
  - `"15/03/2024"` (wrong order for this format)

#### 3. `"yyyy-MM-dd"`
- **Format**: Year-Month-Day (ISO-style)
- **Valid Examples**:
  - `"2024-03-15"` (English numerals)
  - `"٢٠٢٤-٠٣-١٥"` (Arabic-Indic numerals)
- **Invalid Examples**:
  - `"15/03/2024"` (wrong separator)

### Important Notes About DateFormat

1. **Gregorian Calendar Input**: Numeric dates are interpreted as **Gregorian calendar dates** and then automatically converted to the Islamic calendar internally.
2. **Arabic Hijri Input Bypasses DateFormat**: When users type Arabic month names (e.g., `"رمضان"`), the DateFormat setting is ignored. The control recognizes these as valid Hijri dates regardless of DateFormat.
3. **Display is Always Arabic Hijri**: Regardless of how the date was entered (numeric or Arabic text), the selected date is always displayed and stored in full Arabic Hijri format.

### Arabic Date Support

The control supports multiple Arabic input formats:

#### Arabic Numerals (٠-٩)
- All DateFormat patterns support Arabic-Indic numerals
- Example: `"١٥/٠٣/٢٠٢٤"` is equivalent to `"15/03/2024"`

#### Arabic Month Names
The control recognizes all 12 Islamic month names:
- `محرم` (Muharram)
- `صفر` (Safar)
- `ربيع الأول` (Rabi' al-awwal)
- `ربيع الآخر` (Rabi' al-thani)
- `جمادى الأولى` (Jumada al-awwal)
- `جمادى الآخرة` (Jumada al-thani)
- `رجب` (Rajab)
- `شعبان` (Shaban)
- `رمضان` (Ramadan)
- `شوال` (Shawwal)
- `ذو القعدة` (Dhu al-Qi'dah)
- `ذو الحجة` (Dhu al-Hijjah)

#### Mixed Format Examples
```javascript
// These all work regardless of DateFormat setting:
"١٥ رمضان ١٤٤٥"      // Full Arabic Hijri date
"15 رمضان 1445"       // Mixed numerals with Arabic month
"رمضان ١٥"           // Month and day only
"١٥ رمضان"           // Day and month only
```

### Output Format

Selected dates are **always** displayed and stored in full Arabic Hijri format:
```
١٥ رمضان ١٤٤٥ هـ
```

Where:
- `١٥` = Day in Arabic-Indic numerals
- `رمضان` = Arabic month name
- `١٤٤٥` = Year in Arabic-Indic numerals
- `هـ` = AH (Anno Hegirae) indicator

### Complete Input Examples

#### With DateFormat = "dd/MM/yyyy" (default)
```javascript
// Valid inputs:
"15/03/2024"          // ✅ English numerals, Gregorian date
"١٥/٠٣/٢٠٢٤"          // ✅ Arabic numerals, Gregorian date
"١٥ رمضان ١٤٤٥"      // ✅ Arabic Hijri (bypasses DateFormat)
"15 رمضان 1445"       // ✅ Mixed format (bypasses DateFormat)
"رمضان ١٥"           // ✅ Partial Arabic Hijri (bypasses DateFormat)

// Invalid inputs:
"03/15/2024"          // ❌ Wrong order for dd/MM/yyyy
"2024-03-15"         // ❌ Wrong separator
```

#### With DateFormat = "MM/dd/yyyy"
```javascript
// Valid inputs:
"03/15/2024"          // ✅ English numerals
"٠٣/١٥/٢٠٢٤"          // ✅ Arabic numerals
"١٥ رمضان ١٤٤٥"      // ✅ Arabic Hijri (still works)

// Invalid inputs:
"15/03/2024"          // ❌ Wrong order for MM/dd/yyyy
```

#### With DateFormat = "yyyy-MM-dd"
```javascript
// Valid inputs:
"2024-03-15"          // ✅ ISO format
"٢٠٢٤-٠٣-١٥"          // ✅ Arabic numerals
"١٥ رمضان ١٤٤٥"      // ✅ Arabic Hijri (still works)

// Invalid inputs:
"15/03/2024"          // ❌ Wrong separator
```

## Styling and Theming

### Style-Aware Integration
The control automatically adapts to your form's color scheme using these CSS variables:

```css
.theme-entry {
    --icon-accent-color: #e74c3c;        /* Primary accent color */
    --icon-base-color: #2c3e50;          /* Text and calendar grid */
    --icon-base-secondary-color: #ecf0f1; /* Background colors */
    --icon-attention-color: #f39c12;     /* Attention/special states */
}
```

### Visual States

#### Input Field
- **Default**: Clean bottom border only
- **Focus**: Thicker blue border (accent color)
- **Error**: Thicker red border for validation errors
- **Read-only**: Grayed out appearance

#### Calendar Popup
- **Modern Design**: Clean interface with subtle shadows
- **RTL Layout**: Proper right-to-left text alignment
- **Hover Effects**: Smooth transitions and visual feedback
- **Today Highlighting**: Current date is visually distinguished
- **Selected Date**: Chosen date is highlighted

### Custom Styling
You can override specific styles by targeting the control:

```css
arabic-calendar {
    --k2-accent: #your-color;
    --k2-base: #your-text-color;
    --k2-secondary: #your-background-color;
}
```

## Accessibility Features

### Keyboard Navigation
- **Tab Navigation**: Control integrates with tab order
- **Arrow Keys**: Navigate calendar grid when popup is open
- **Enter/Space**: Select dates
- **Escape**: Close calendar popup

### Screen Reader Support
- **ARIA Labels**: Proper labeling for all interactive elements
- **Role Attributes**: Correct roles for calendar grid and dialog
- **Live Regions**: Dynamic updates announced to screen readers

### Visual Accessibility
- **High Contrast**: Supports high contrast mode
- **Focus Indicators**: Clear visual focus indicators
- **Color Independence**: Information not conveyed by color alone

## Installation and Setup

### File Structure
```
K2 Arabic Calendar/
├── manifest.json              # Control metadata
├── runtime_logic.js           # Runtime functionality
├── runtime_style.css          # Runtime styles
├── designtime_logic.js        # Designer preview
├── designtime_style.css       # Designer styles
├── icon.svg                   # Control icon
└── README.md                  # This documentation
```

### Integration Steps
1. **Copy Files**: Place all control files in your K2 SmartForms custom controls directory
2. **Register Control**: The control will appear in the K2 Designer toolbox
3. **Configure Properties**: Set watermark, date format, and other properties as needed
4. **Handle Events**: Implement event handlers for your form logic
5. **Style Integration**: Define CSS variables for theme integration

## Known Considerations

### Date Format Property
- The `DateFormat` property only affects **manual numeric input validation**
- It does not control how dates are displayed or stored (always Arabic Hijri format)
- Arabic Hijri input (with month names) bypasses DateFormat validation
- Numeric dates are interpreted as Gregorian calendar dates and converted to Islamic calendar internally

### Value Property
- The `Value` property always stores dates in full Arabic Hijri format (e.g., `"١٥ رمضان ١٤٤٥ هـ"`)
- When setting the value programmatically, use Arabic Hijri format
- The control automatically converts Gregorian dates to Islamic calendar when using the calendar picker

### Manual Input vs Calendar Picker
- When `AllowManualInput` is `false`, only the calendar picker is available
- When `AllowManualInput` is `true`, users can type dates manually or use the picker
- Manual input supports both Arabic numerals (٠-٩) and English numerals (0-9)
- Arabic month names in manual input bypass DateFormat validation

### Calendar Popup Behavior
- The calendar popup is portaled to the document body for proper overlay behavior
- The popup can be dragged by the header for better positioning on dense forms
- The popup automatically positions itself to stay within the viewport
- Clicking outside the popup closes it automatically

### RTL Support
- The control is designed for RTL (right-to-left) layout
- All text, including month names and weekdays, is in Arabic
- The control automatically detects RTL context and applies appropriate styling

## Troubleshooting

### Common Issues

#### Calendar Not Opening
- **Check**: Ensure `IsEnabled` is `true` and `IsReadOnly` is `false`
- **Verify**: Control has proper width dimension

#### Date Validation Errors
- **Format**: Ensure manual input matches the configured `DateFormat`
- **Arabic Input**: Use Arabic numerals (٠-٩) or English numerals (0-9)
- **Month Names**: Use correct Arabic month names for Hijri dates

#### Styling Issues
- **Theme Variables**: Ensure CSS variables are defined at form level
- **RTL Support**: Verify `direction: rtl` is set on parent container
- **Font Loading**: Ensure Arabic fonts are loaded (Tajawal, Cairo, etc.)

### Debug Mode
Enable console logging for troubleshooting:
```javascript
// Check control state
console.log('Control value:', control.Value);
console.log('Control enabled:', control.IsEnabled);
console.log('Control readonly:', control.IsReadOnly);
```

## Icon Attribution

The calendar icon used in this control is based on a custom SVG design optimized for Arabic calendar functionality. The icon features:
- **Design**: Modern calendar outline with Arabic styling elements
- **Colors**: Uses CSS variables for theme integration
- **Accessibility**: Includes proper ARIA labels in Arabic
- **License**: Custom design for K2 Arabic Calendar control

## Version History

### Current Version: 1.0.0
- Initial release with full Islamic calendar support
- Complete RTL layout implementation
- Style-aware theming integration
- Multi-view calendar navigation
- Comprehensive date validation
- Full accessibility support

## Support and Contributing

For issues, feature requests, or contributions related to this control, please refer to the K2 SmartForms documentation or contact your K2 administrator.

---

**Note**: This control is designed specifically for K2 SmartForms environments and requires proper K2 runtime context for full functionality.