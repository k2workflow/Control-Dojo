# Arabic Calendar - Style Integration Example

This Arabic Calendar control shows how to add style-aware theming to K2 custom controls. The system automatically detects and integrates with the form's styling system, letting form designers override control styling while providing sensible fallbacks.

## Supported Style Variables

The control integrates with the following CSS custom properties:

- **`--icon-accent-color`** - Primary accent color for calendar header and highlights
- **`--icon-base-color`** - Base color for calendar text and borders  
- **`--icon-base-secondary-color`** - Secondary color for calendar background
- **`--icon-attention-color`** - Attention color for special states

## How It Works

### 1. CSS Variable Detection

The control uses CSS custom properties with fallback values. This ensures styling works in any environment:

```css
/* Root scope for the component */
arabic-calendar {
    /* K2 theme variables using form's icon accent color with blue fallback */
    --k2-accent: var(--icon-accent-color, #00a3d3);
}

/* SVG Path Styling - CSS variables work here */
arabic-calendar .calendar-icon .calendar-header {
    fill: var(--icon-accent-color, #00a3d3);
}

arabic-calendar .calendar-icon .calendar-body {
    fill: var(--icon-base-secondary-color, #f0f0f1);
}

arabic-calendar .calendar-icon .calendar-ring,
arabic-calendar .calendar-icon .calendar-checkmark {
    fill: var(--icon-base-color, #495660);
}
```

### 2. Form Integration

When a form defines its own styling variables, the control automatically picks them up:

```css
/* Form's global stylesheet */
.theme-entry {
    --icon-accent-color: #ff36da;        /* Pink/magenta accent */
    --icon-base-color: black;            /* Black text */
    --icon-base-secondary-color: #d6f1ff; /* Light blue background */
    --icon-attention-color: #eeff38;     /* Yellow attention */
}
```

### 3. Fallback System

When form variables aren't defined, the control falls back to its own blue theme:

```css
/* Control's fallback values */
arabic-calendar .calendar-icon .calendar-header {
    fill: var(--icon-accent-color, #00a3d3);  /* Blue fallback */
}

arabic-calendar .calendar-header {
    background: color-mix(in srgb, var(--icon-accent-color, #00a3d3) 10%, transparent);
    color: var(--icon-accent-color, #00a3d3);
}
```

### 4. Dynamic Color Mixing

The control uses the modern CSS `color-mix()` function for transparent overlays:

```css
/* Transparent background using form's accent color */
arabic-calendar .calendar-header {
    background: color-mix(in srgb, var(--icon-accent-color, #00a3d3) 10%, transparent);
}

/* Hover effects using form's accent color */
arabic-calendar .nav-btn:hover {
    background: color-mix(in srgb, var(--icon-accent-color, #00a3d3) 10%, white);
    border-color: var(--icon-accent-color, #00a3d3);
}
```

### 5. SVG Styling Integration

SVG elements use CSS classes instead of inline styles. This makes integration easier:

```javascript
// SVG with CSS classes for styling
<svg class="calendar-icon" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <path class="calendar-body" d="M3,20H45a0,0,0,0,1,0,0V40a4,4,0,0,1-4,4H7a4,4,0,0,1-4-4V20A0,0,0,0,1,3,20Z" />
    <path class="calendar-header" d="M41,6H7a4,4,0,0,0-4,4V20H45V10A4,4,0,0,0,41,6Z" />
    <path class="calendar-ring" d="M14,13a2,2,0,0,1-2-2V3a2,2,0,0,1,4,0v8A2,2,0,0,1,14,13Z" />
    <path class="calendar-ring" d="M34,13a2,2,0,0,1-2-2V3a2,2,0,0,1,4,0v8A2,2,0,0,1,34,13Z" />
    <path class="calendar-checkmark" d="M21.39,38.5A2,2,0,0,1,20,37.9l-5.39-5.53a2,2,0,0,1,2.87-2.79l4,4.12L30.63,25A2,2,0,0,1,33.37,28L22.76,38A2,2,0,0,1,21.39,38.5Z" />
</svg>
```

### 6. No Variable Definitions in Control

Here's the key: **don't define** the variables in the control's CSS. Let the form's variables cascade down:

```css
/* DON'T DO THIS - This prevents form styling from working */
arabic-calendar {
    --icon-accent-color: #00a3d3;  /* This overrides form's variables */
}

/* DO THIS - Let form variables cascade down */
arabic-calendar .calendar-icon .calendar-header {
    fill: var(--icon-accent-color, #00a3d3);  /* Form variable with fallback */
}
```

## Key Features

1. **Automatic Detection**: Uses CSS cascade to detect form-defined variables
2. **Fallback System**: Falls back to blue theme when variables aren't defined
3. **Dynamic Integration**: Automatically updates when form theme changes
4. **No Conflicts**: Doesn't override form's styling system
5. **Self-Contained**: All styling logic stays within the control files

## CSS Cascade Support

The CSS follows proper cascade rules with form styles taking precedence:

```css
/* Form styles (highest priority) */
.theme-entry {
    --icon-accent-color: #ff36da;
}

/* Control styles (uses form variables) */
arabic-calendar .calendar-icon .calendar-header {
    fill: var(--icon-accent-color, #00a3d3);  /* Uses #ff36da from form */
}

/* Control fallback (lowest priority) */
/* Fallback #00a3d3 only used if form doesn't define --icon-accent-color */
```

## How to Use This Pattern

1. **Identify Standard Variables**: Use common variable names like `--icon-accent-color`
2. **Don't Define Variables**: Let form variables cascade down to your control
3. **Provide Fallbacks**: Always provide sensible fallback values
4. **Use Modern CSS**: Leverage `color-mix()` for dynamic color variations
5. **Test Integration**: Verify styling works with and without form variables

## Form Integration Examples

### Example 1: Form with Custom Colors

```css
/* Form defines custom colors */
.theme-entry {
    --icon-accent-color: #e74c3c;        /* Red accent */
    --icon-base-color: #2c3e50;          /* Dark blue text */
    --icon-base-secondary-color: #ecf0f1; /* Light gray background */
}

/* Control automatically uses these colors */
/* Calendar header: Red (#e74c3c) */
/* Calendar text: Dark blue (#2c3e50) */
/* Calendar background: Light gray (#ecf0f1) */
```

### Example 2: Form with No Custom Colors

```css
/* Form doesn't define icon colors */

/* Control uses fallback colors */
/* Calendar header: Blue (#00a3d3) */
/* Calendar text: Gray (#495660) */
/* Calendar background: Light gray (#f0f0f1) */
```

### Example 3: Partial Form Colors

```css
/* Form defines only accent color */
.theme-entry {
    --icon-accent-color: #9b59b6;        /* Purple accent */
}

/* Control uses form accent + fallbacks */
/* Calendar header: Purple (#9b59b6) */
/* Calendar text: Gray (#495660) - fallback */
/* Calendar background: Light gray (#f0f0f1) - fallback */
```

## Benefits

- **Seamless Integration**: Works with any form's color scheme
- **No Conflicts**: Doesn't interfere with form styling
- **Flexible**: Supports partial or complete form theming
- **Maintainable**: Easy to add new style variables
- **Performance**: Lightweight and efficient—no JavaScript needed

## Best Practices

### Do's

- Use standard variable names (`--icon-accent-color`, etc.)
- Always provide fallback values
- Use `color-mix()` for transparent overlays
- Test with and without form variables
- Document supported variables

### Don'ts

- Don't define variables with the same names as K2 variables in control CSS—this breaks the cascade
- Don't use hardcoded colors without fallbacks—things will break if variables aren't defined
- Don't use overly specific variable names—keep them generic
- Don't assume variables will always be defined—always provide fallbacks
- Don't override form's styling system—let it cascade naturally
- **Don't use z-index values of 1 or higher**—K2 Designer overlays (like rule designer popups) don't use z-index, so any control element with `z-index: 1` or higher will appear on top of these overlays, causing usability issues. Use DOM order and `position: fixed` for popups instead.

## Troubleshooting

### Common Issues

1. **Control Not Using Form Colors**
   - Check if form defines the variables
   - Verify CSS cascade order
   - Ensure no variable definitions in control CSS

2. **Colors Not Updating**
   - Check for CSS caching issues
   - Verify variable names match exactly
   - Ensure proper CSS specificity

3. **Fallback Colors Not Working**
   - Check fallback syntax in `var()` function
   - Verify fallback values are valid colors
   - Test with form variables undefined

4. **Control Elements Appearing on Top of K2 Designer Popups**
   - **Problem**: Control icons, buttons, or popups appear above K2 Designer overlays (like rule designer, property panels, etc.)
   - **Cause**: Using `z-index: 1` or higher in control CSS. K2 Designer overlays don't use z-index, so any element with z-index will appear above them.
   - **Solution**: Remove all `z-index` values of 1 or higher from your control CSS. For popups, use `position: fixed` and portal to `body`—DOM order will handle stacking correctly. For internal layering within the control, use DOM order instead of z-index.
   - **Example**:
     ```css
     /* DON'T DO THIS */
     .my-popup {
       position: fixed;
       z-index: 10000;  /* This will appear above K2 Designer popups */
     }
     
     .my-icon {
       z-index: 2;  /* This will also appear above K2 Designer popups */
     }
     
     /* DO THIS INSTEAD */
     .my-popup {
       position: fixed;
       /* No z-index - DOM order handles stacking */
     }
     
     .my-icon {
       /* No z-index - use DOM order for internal layering */
     }
     ```

### Debug Mode

Enable debug logging by opening browser console. The control logs:
- Style variable detection
- Fallback usage
- Color calculations
- CSS cascade issues

## Advanced Techniques

### Dynamic Color Variations

```css
/* Create transparent variations */
background: color-mix(in srgb, var(--icon-accent-color, #00a3d3) 10%, transparent);

/* Create lighter variations */
background: color-mix(in srgb, var(--icon-accent-color, #00a3d3) 10%, white);

/* Create darker variations */
background: color-mix(in srgb, var(--icon-accent-color, #00a3d3) 90%, black);
```

### Conditional Styling

```css
/* Use different styles based on variable presence */
arabic-calendar {
    /* Default styling */
    border: 1px solid var(--icon-base-color, #495660);
}

/* Enhanced styling when accent color is available */
arabic-calendar:has([style*="--icon-accent-color"]) {
    border: 2px solid var(--icon-accent-color, #00a3d3);
}
```

## Performance Considerations

- **CSS Variables**: Very efficient, no JavaScript required
- **Color Mixing**: Modern browsers support `color-mix()` efficiently
- **Cascade**: Leverages browser's native CSS cascade
- **No Overhead**: No additional JavaScript for styling

## Browser Support

- **CSS Custom Properties**: Supported in all modern browsers
- **Color Mixing**: Supported in Chrome 111+, Firefox 113+, Safari 16.2+
- **Fallbacks**: Graceful degradation for older browsers

This pattern ensures your control integrates seamlessly with any form's styling system while providing a consistent experience across different environments.
