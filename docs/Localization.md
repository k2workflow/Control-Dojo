# Arabic Calendar - Localization and RTL Support Example

This Arabic Calendar control shows how to add localization and right-to-left (RTL) support to K2 custom controls. It's built specifically for Arabic-speaking users with RTL layout and Arabic language support baked in.

## RTL Support

The Arabic Calendar control has full RTL support for Arabic text and layout. Here's how it works:

### 1. CSS Direction Setting

Start by setting `direction: rtl` at the root level:

```css
/* Root scope for the component */
arabic-calendar {
    direction: rtl;
    display: block;
    width: 100%;
    color: var(--k2-text);
    font-family: var(--k2-font);
}
```

### 2. Arabic Font Support

The control uses Arabic-friendly fonts with fallbacks that actually work:

```css
arabic-calendar {
    --k2-font: "Tajawal", "Cairo", "Noto Naskh Arabic", system-ui, -apple-system, "Segoe UI", Arial, sans-serif;
}
```

**Font Stack:**
- **Tajawal** - Modern Arabic font
- **Cairo** - Popular Arabic font
- **Noto Naskh Arabic** - Google's Arabic font
- System fallbacks for compatibility

### 3. RTL Layout in CSS

The control's CSS handles RTL layout automatically:

```css
/* Input wrap - RTL aware */
arabic-calendar .input-wrap {
    position: relative;
    display: grid;
}

/* Calendar grid - RTL support */
arabic-calendar .calendar-grid {
    direction: rtl;
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: var(--k2-gap);
}

/* Navigation buttons - RTL layout */
arabic-calendar .nav-btn.prev {
    order: 2; /* Right side in RTL */
}

arabic-calendar .nav-btn.next {
    order: 1; /* Left side in RTL */
}
```

### 4. Watermark/Placeholder Text

Arabic watermark text is supported through the `Watermark` property:

```json
{
  "id": "Watermark",
  "refreshdisplay": "true",
  "friendlyname": "Watermark",
  "type": "string",
  "inputlength": "255",
  "initialvalue": "انقر لتحديد التاريخ",
  "changesdisplay": true
}
```

**Default Arabic Watermark:** `"انقر لتحديد التاريخ"` (Click to select date)

### 5. Property Setter Implementation

The watermark property setter handles Arabic text like this:

```javascript
get Watermark() { return this._watermark; }
set Watermark(val) {
  this._watermark = val;
  if (this._hasRendered && this.watermarkSpan) {
    this.watermarkSpan.textContent = val;
    // Ensure watermark is visible when empty
    if (!this._value || this._value.trim() === '') {
      this.watermarkSpan.style.display = 'block';
      this.watermarkSpan.style.visibility = 'visible';
      this.watermarkSpan.style.opacity = '1';
    }
  }
}
```

### 6. Calendar Header with Arabic Text

The calendar displays Arabic month names and dates. Here's how:

```javascript
// Calendar rendering with Arabic support
renderCalendar(year, month) {
  // Arabic month names
  const arabicMonths = [
    'محرم', 'صفر', 'ربيع الأول', 'ربيع الثاني',
    'جمادى الأولى', 'جمادى الثانية', 'رجب', 'شعبان',
    'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'
  ];
  
  // Update header with Arabic month name
  if (this.headerTitle) {
    this.headerTitle.textContent = arabicMonths[month];
  }
  
  // Render calendar grid with RTL-aware layout
  // ...
}
```

## Key Features

1. **Built-in RTL**: The control is always RTL, designed specifically for Arabic users
2. **Arabic Fonts**: Uses an Arabic-optimized font stack for proper text rendering
3. **Layout Aware**: CSS automatically handles RTL layout for all elements
4. **Arabic Watermark**: Default watermark text is in Arabic
5. **Hijri Calendar**: Supports Islamic (Hijri) calendar with Arabic month names

## RTL CSS Patterns

### Navigation Button Positioning

```css
/* Previous/Next buttons - RTL aware */
arabic-calendar .nav-btn.prev {
    order: 2; /* Appears on right in RTL */
}

arabic-calendar .nav-btn.next {
    order: 1; /* Appears on left in RTL */
}
```

### Text Alignment

```css
/* All text elements align right in RTL */
arabic-calendar .date-input {
    text-align: right;
    direction: rtl;
}

arabic-calendar .header-title {
    text-align: center;
    direction: rtl;
}
```

### Grid Layout

```css
/* Calendar grid with RTL support */
arabic-calendar .calendar-grid {
    direction: rtl;
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: var(--k2-gap);
}
```

## How to Use This Pattern

### For RTL-Only Controls

If your control is specifically for RTL languages (like Arabic):

1. **Set direction at root**: `direction: rtl;` on the main element
2. **Use Arabic fonts**: Include an Arabic font stack in CSS
3. **RTL-aware layout**: Use CSS Grid/Flexbox with `order` properties
4. **Arabic text**: Provide Arabic default values for properties

### For Multi-Language Controls

If your control needs to support both LTR and RTL:

1. **Detect browser language**: Use `navigator.language` to figure out what the user wants
2. **Conditional direction**: Set `direction: rtl` or `direction: ltr` based on the detected language
3. **Dynamic classes**: Add `.rtl` or `.ltr` classes to your element
4. **CSS with classes**: Use `.control.rtl` and `.control.ltr` selectors

**Example for Multi-Language:**

```javascript
connectedCallback() {
  const lang = (navigator.language || 'en').split('-')[0].toLowerCase();
  const isRTL = lang === 'ar' || lang === 'he' || lang === 'fa';
  
  if (isRTL) {
    this.setAttribute('dir', 'rtl');
    this.classList.add('rtl');
  } else {
    this.setAttribute('dir', 'ltr');
    this.classList.add('ltr');
  }
  
  this.render();
}
```

```css
/* LTR styles */
my-control.ltr {
    direction: ltr;
    text-align: left;
}

/* RTL styles */
my-control.rtl {
    direction: rtl;
    text-align: right;
}
```

## Browser Language Detection

Want to detect browser language for multi-language support? Here's a function that tends to work:

```javascript
function detectBrowserCulture() {
  try {
    const browserLang = navigator.language || navigator.userLanguage || 'en';
    const langCode = browserLang.split('-')[0].toLowerCase();
    
    // RTL languages
    const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
    const isRTL = rtlLanguages.includes(langCode);
    
    return {
      code: langCode,
      isRTL: isRTL
    };
  } catch (e) {
    console.warn('[Control] Error detecting browser culture:', e);
    return { code: 'en', isRTL: false };
  }
}
```

## Best Practices

### Do's

- Set `direction: rtl` at the root level for RTL controls
- Use Arabic font stacks for Arabic text
- Test with actual Arabic text to make sure it renders properly
- Use CSS Grid/Flexbox with `order` for RTL-aware layouts
- Provide Arabic default values for properties

### Don'ts

- Don't assume LTR layout will work for RTL—it usually won't
- Don't use hardcoded left/right positioning without RTL awareness
- Don't forget to test with Arabic fonts installed
- Don't use English-only fonts for Arabic text—they won't render correctly
- Don't mix LTR and RTL in the same element without proper handling

## Related Documentation

- [Style Integration Guide](./Style%20Integration.md) - How Arabic Calendar integrates with K2 form styling
- [Manifest Configuration](./Manifest%20Configuration.md) - How to configure the Watermark property
- [Responsive Controls](./Responsive%20Controls.md) - Responsive design considerations for RTL

## Summary

The Arabic Calendar shows:
- Built-in RTL support with `direction: rtl`
- Arabic font stack for proper text rendering
- RTL-aware CSS layout using Grid/Flexbox
- Arabic default values for properties
- Proper text alignment and direction for Arabic users

For controls that need to support both LTR and RTL, use browser language detection and conditional CSS classes to switch between layouts. It's a bit more work, but it makes your control more flexible.
