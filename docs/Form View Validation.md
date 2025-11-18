# Form and View Validation Guide for K2 Custom Controls

## Overview

Need custom validation for your control? K2's validation system lets you add your own logic. When your control supports validation, K2 calls your custom `Validate()` method to check if everything's valid. You can create custom rules, show visual feedback, and hook into K2's validation workflow.

## Key Concepts

### Validation Method Requirements

The validation system requires a specific method signature and configuration:

- **Method name**: Must be exactly `Validate` (case sensitive)
- **Return type**: Must return a boolean value named `isValid`
- **Manifest declaration**: Must include `"Validate"` in the `supports` array
- **Control definition**: Must be part of the control class definition

### Default Behavior

What if you declare `Validate` in the manifest but don't actually implement it? K2 falls back to default validation behavior. If you've got `getValue` and `setValue` methods, K2's standard validation (like checking for empty fields) will still work.

### Error Handling

**Important**: Here's a gotcha—if something's wrong with your return type or method definition, K2 won't throw errors. Instead, validation just passes silently. That prevents users from getting blocked by misconfigured controls, but it also means you could ship broken validation without realizing it. Test thoroughly.

## Manifest Configuration

### Basic Declaration

First, add `"Validate"` to your control's `supports` array:

```json
{
  "supports": [
    "Value",
    "Validate",
    "IsVisible",
    "IsEnabled",
    "IsReadOnly"
  ]
}
```

### Required Methods

You'll also need to implement these:

- `get Value()` - Gets the control's value
- `set Value(value)` - Sets the control's value

K2 calls these during validation, so they're required. Validation is meant to check input or data, after all.

## Implementation

### Basic Validation Method

Here's a simple `Validate()` method to get you started:

```javascript
Validate() {
  let isValid = true;
  
  console.log("Validating triggered, value: ", this._value.trim());
  
  if (!this._value.trim()) {
    isValid = false;
  }
  
  console.log("Is valid returning as: ", isValid);
  
  return isValid;
}
```

### Complete Control Example

Here's a full example that shows how validation fits into a complete control:

```javascript
class K2TextInputControl extends K2BaseControl {
  constructor() {
    super();
    this._value = "";
  }

  // Required: Value property getter/setter
  get Value() {
    return this._value;
  }

  set Value(v) {
    const oldValue = this._value;
    this._value = v || "";
    
    if (this._hasRendered && this.inputElement) {
      this.inputElement.value = this._value;
    }
    
    if (oldValue !== this._value) {
      safeRaisePropertyChanged(this, "Value");
    }
  }

  // Validation method
  Validate() {
    let isValid = true;
    
    console.log("Validating triggered, value: ", this._value.trim());
    
    // Example: Check if value is not empty
    if (!this._value.trim()) {
      isValid = false;
    }
    
    // Example: Check minimum length
    if (this._value.trim().length < 3) {
      isValid = false;
    }
    
    // Example: Check format (email, phone, etc.)
    // Add your custom validation logic here
    
    console.log("Is valid returning as: ", isValid);
    
    return isValid;
  }
}
```

### Manifest Example

```json
{
  "icon": "text-input-icon.svg",
  "displayName": "Text Input",
  "tagName": "k2-text-input",
  "supports": [
    "Value",
    "Validate",
    "IsVisible",
    "IsEnabled",
    "IsReadOnly"
  ],
  "properties": [
    {
      "id": "Value",
      "friendlyname": "Value",
      "type": "text",
      "initialvalue": "",
      "refreshdisplay": "true",
      "changesdisplay": true
    }
  ],
  "runtimeScriptFileNames": ["runtime_logic.js"]
}
```

## Functionality

### Custom Validation Logic

With `Validate()`, you can build whatever validation rules you need:

- **Format validation**: Check email addresses, phone numbers, dates, whatever format you need
- **Business rules**: Validate against your own business logic
- **Complex conditions**: Multiple criteria with custom logic—go wild
- **Data integrity**: Make sure data meets your specific requirements

### Visual Feedback

Validation is also a good place to trigger visual feedback:

- Show error states when validation fails
- Display success indicators when validation passes
- Highlight invalid fields
- Show validation messages to users

Example with visual feedback:

```javascript
Validate() {
  let isValid = true;
  
  if (!this._value.trim()) {
    isValid = false;
    this.showValidationError("Value is required");
  } else {
    this.clearValidationError();
  }
  
  return isValid;
}

showValidationError(message) {
  if (this.container) {
    this.container.classList.add("validation-error");
    // Add error message display
  }
}

clearValidationError() {
  if (this.container) {
    this.container.classList.remove("validation-error");
    // Remove error message display
  }
}
```

### Integration with K2 Rules

Since validation hooks into K2 rules, you can:

- Build custom flows based on validation results
- Trigger actions when validation passes or fails
- Chain validation across multiple controls
- Build conditional logic like "if validation passes, do X, else do Y"

### State Awareness

Validation respects control states when the option `"do not validate hidden, disabled or read-only controls, views and tabs"` is enabled (which is the default):

- **Visible**: Hidden controls are skipped
- **Disabled**: Disabled controls are skipped
- **Read-Only**: Read-only controls are skipped

Your validation method should check these states if you need to:

```javascript
Validate() {
  // Skip validation for hidden, disabled, or read-only controls
  if (!this.IsVisible || !this.IsEnabled || this.IsReadOnly) {
    return true; // Or return appropriate default
  }
  
  let isValid = true;
  
  // Your validation logic here
  
  return isValid;
}
```

## Validation Configuration Options

### Select Controls to Validate

When setting up validation in K2, you've got two options:

#### Required

- Calls `getValue()` first, then calls `Validate()`
- Usually used for value-based validation
- Makes sure the value is retrieved before validation runs

#### Validate

- Only calls `Validate()` directly
- Skips `getValue()` entirely
- Useful when your validation logic doesn't depend on the value property
- Good for triggering validation that checks other things

**Note**: Most of the time, you'll want `"required"` for standard validation. Use `"validate"` only when your validation logic doesn't need the value property.

## Best Practices

### 1. Always Return a Boolean

Your `Validate()` method should always return a boolean. No exceptions:

```javascript
Validate() {
  // Good: Explicit boolean return
  let isValid = true;
  if (someCondition) {
    isValid = false;
  }
  return isValid;
}
```

### 2. Handle Edge Cases

Edge cases will trip you up if you don't handle them:

```javascript
Validate() {
  let isValid = true;
  
  // Handle null/undefined
  const value = this._value || "";
  
  // Handle whitespace
  const trimmedValue = value.trim();
  
  // Your validation logic
  
  return isValid;
}
```

### 3. Provide Clear Logging

Console logging helps a lot during development (you can remove it later if needed):

```javascript
Validate() {
  let isValid = true;
  
  console.log("Validating triggered, value: ", this._value);
  
  // Validation logic
  
  console.log("Is valid returning as: ", isValid);
  
  return isValid;
}
```

### 4. Test Thoroughly

Since validation errors fail silently, you need to test everything:

- Try valid values
- Try invalid values
- Try empty/null values
- Try edge cases
- Try different state combinations (visible, enabled, read-only)

### 5. Implement Value Methods

Don't forget `get Value()` and `set Value()` methods—they're required for validation to work:

```javascript
get Value() {
  return this._value;
}

set Value(v) {
  this._value = v || "";
  // Update UI and raise events as needed
}
```

## Common Validation Patterns

### Required Field Validation

```javascript
Validate() {
  let isValid = true;
  
  if (!this._value || !this._value.trim()) {
    isValid = false;
  }
  
  return isValid;
}
```

### Length Validation

```javascript
Validate() {
  let isValid = true;
  const value = (this._value || "").trim();
  
  if (value.length < 3) {
    isValid = false;
  }
  
  if (value.length > 100) {
    isValid = false;
  }
  
  return isValid;
}
```

### Format Validation (Email)

```javascript
Validate() {
  let isValid = true;
  const value = (this._value || "").trim();
  
  if (value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    isValid = emailRegex.test(value);
  }
  
  return isValid;
}
```

### Multiple Criteria Validation

```javascript
Validate() {
  let isValid = true;
  const value = (this._value || "").trim();
  
  // Check multiple conditions
  if (!value) {
    isValid = false;
  } else if (value.length < 3) {
    isValid = false;
  } else if (!/^[a-zA-Z0-9]+$/.test(value)) {
    isValid = false;
  }
  
  return isValid;
}
```

## Troubleshooting

### Validation Not Being Called

If validation isn't being called:
- **Check manifest**: Make sure `"Validate"` is in the `supports` array
- **Check method name**: Must be exactly `Validate` (case-sensitive)
- **Check method location**: Must be part of the control class definition
- **Check K2 configuration**: Make sure validation is actually configured in the form/view

### Validation Always Passes

If validation always passes when it shouldn't:
- **Check return value**: Make sure you're actually returning a boolean (`isValid`)
- **Check return type**: The variable should be named `isValid`, or explicitly return a boolean
- **Check logic**: Review your validation logic—there might be a bug
- **Check console**: Look for errors or unexpected behavior in console logs

### Validation Always Fails

If validation always fails:
- **Check value**: Make sure `get Value()` returns what you expect
- **Check state**: Verify the control state (visible, enabled, read-only)
- **Check logic**: Review your validation conditions—maybe they're too strict
- **Check data**: Verify the actual data being validated

### Default Validation Not Working

If default validation isn't working:
- **Check methods**: Make sure `get Value()` and `set Value()` are actually implemented
- **Check manifest**: Ensure `"Value"` is in the `supports` array
- **Check configuration**: Verify K2 validation settings

## Related Documentation

- [Custom Controls Guide](./Custom%20Controls%20Guide.md) - Complete guide to creating custom controls
- [Standard Properties Guide](./Standard%20Properties.md) - Standard property implementation
- [Triggering Control Methods](./Triggering%20Control%20Methods.md) - How to add methods to controls
- [Script References](./Script%20References.md) - K2 scripting API reference

## Summary

K2 form and view validation lets you add custom validation logic to your controls. Here's what you need to know:

- Add `"Validate"` to the `supports` array in your manifest
- Implement a `Validate()` method that returns a boolean `isValid`
- Method name must be exactly `Validate` (case-sensitive)
- Always implement `get Value()` and `set Value()` methods
- Validation respects control states (visible, enabled, read-only)
- Errors fail silently, so test thoroughly
- Use `"required"` option for value-based validation
- Use `"validate"` option for logic that doesn't require the value

Follow these guidelines, and you should end up with validation that works well with K2's validation workflow and gives users a solid experience.

