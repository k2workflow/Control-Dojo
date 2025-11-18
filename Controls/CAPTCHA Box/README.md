# CAPTCHA Box

A customizable CAPTCHA box for Control Dojo that provides bot protection using open-source CAPTCHA services. This control supports multiple CAPTCHA providers and offers a clean, accessible interface for user verification.

## Features

- **Multiple CAPTCHA Providers**: Support for OpenCaptcha, hCaptcha, reCAPTCHA, and custom API endpoints
- **Open Source Default**: Uses OpenCaptcha as the default provider (no API key required)
- **Customizable Themes**: Light and dark theme support
- **Responsive Design**: Works on desktop and mobile devices
- **Full K2 Integration**: Implements standard K2 control interface and properties
- **State Management**: Support for Enabled, ReadOnly, and other standard K2 states
- **Accessibility**: Full keyboard navigation, screen reader support, and ARIA labels
- **Localization**: Multi-language support (English, Arabic, Spanish, French, German)
- **Auto-refresh**: Optional automatic CAPTCHA refresh on verification failure
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Tooltip Support**: Custom tooltip text for enhanced user experience
- **Tab Navigation**: Configurable tab index for keyboard accessibility

## Properties

### Core CAPTCHA Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `Value` | Boolean | `false` | Indicates whether the CAPTCHA has been successfully verified |
| `CaptchaResponse` | String | `""` | The user's response to the CAPTCHA challenge |
| `CaptchaProvider` | String | `"opencaptcha"` | The CAPTCHA service provider to use |
| `ApiEndpoint` | String | `"https://api.opencaptcha.io/"` | The API endpoint for the CAPTCHA service |
| `ApiKey` | String | `""` | API key for the CAPTCHA service (if required) |
| `Placeholder` | String | `""` | Placeholder text for the input field (localized) |
| `VerifyButtonText` | String | `""` | Text for the verify button (localized) |
| `SuccessMessage` | String | `""` | Message shown on successful verification (localized) |
| `ErrorMessage` | String | `""` | Message shown on verification failure (localized) |
| `AutoRefresh` | Boolean | `true` | Whether to automatically refresh CAPTCHA on verification failure |
| `Theme` | String | `"light"` | Visual theme (`"light"` or `"dark"`) |

### Standard K2 Control Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `Width` | String | `"300px"` | Control width |
| `Height` | String | `"auto"` | Control height |
| `IsVisible` | Boolean | `true` | Whether the control is visible |
| `IsEnabled` | Boolean | `true` | Whether the control is enabled and interactive |
| `IsReadOnly` | Boolean | `false` | Whether the control is in read-only mode |

**Note**: The control also supports `Tooltip`, `TabIndex`, and `AccessibilityText` properties programmatically via `getProperty`/`setProperty` methods, though these are not defined in the manifest. The `Value` property (friendly name: "Verified") indicates verification status, while `CaptchaResponse` is the value property ID used by K2 for data binding.

## Events

| Event | Description |
|-------|-------------|
| `Changed` | Fired when the user types in the input field |
| `Focus` | Fired when the input field receives focus |
| `Blur` | Fired when the input field loses focus |
| `OnEnter` | Fired when the user presses Enter in the input field |
| `Verified` | Fired when CAPTCHA verification is successful |
| `VerificationFailed` | Fired when CAPTCHA verification fails |

## Methods

The CAPTCHA box implements the standard K2 control interface methods:

| Method | Description | Parameters | Return Type |
|--------|-------------|------------|-------------|
| `getValue(objInfo)` | Returns the current verification status | None | String (`"true"` or `"false"`) |
| `setValue(objInfo)` | Sets the verification status | `{ Value: "true"\|"false" }` | None |
| `getProperty(objInfo)` | Gets any property value by name | `{ property: "PropertyName" }` | String (property value) |
| `setProperty(objInfo)` | Sets any property value by name | `{ property: "PropertyName", Value: "value" }` | None |
| `execute(objInfo)` | Executes control methods | `{ methodName: "Focus"\|"Refresh"\|"Verify" }` | None |

### Available Execute Methods

- **Focus**: Sets focus to the CAPTCHA input field
- **Refresh**: Loads a new CAPTCHA image
- **Verify**: Performs CAPTCHA verification with the current input value

### Method Examples

```javascript
// Get verification status
var isVerified = control.getValue({});

// Set verification status
control.setValue({ Value: "true" });

// Get a property
var theme = control.getProperty({ property: "Theme" });

// Set a property
control.setProperty({ property: "Theme", Value: "dark" });

// Execute methods
control.execute({ methodName: "Focus" });
control.execute({ methodName: "Refresh" });
control.execute({ methodName: "Verify" });
```

## Usage Examples

### Basic Usage

```javascript
// Set up a basic CAPTCHA box
control.setProperty({ property: "CaptchaProvider", Value: "opencaptcha" });
control.setProperty({ property: "Theme", Value: "light" });
control.setProperty({ property: "Width", Value: "400px" });
```

### Accessibility Configuration

```javascript
// Configure accessibility features
control.setProperty({ property: "AccessibilityText", Value: "Please complete the CAPTCHA verification" });
control.setProperty({ property: "Tooltip", Value: "Enter the characters shown in the image above" });
control.setProperty({ property: "TabIndex", Value: "1" });
```

### State Management

```javascript
// Disable the control
control.setProperty({ property: "IsEnabled", Value: "false" });

// Set to read-only mode
control.setProperty({ property: "IsReadOnly", Value: "true" });

// Hide the control
control.setProperty({ property: "IsVisible", Value: "false" });

// Check verification status
var isVerified = control.getValue({});
if (isVerified === "true") {
    console.log("CAPTCHA is verified");
}
```

### Custom Styling

```javascript
control.setProperty({ property: "Height", Value: "200px" });
```

## Supported CAPTCHA Providers

### OpenCaptcha (Default)
- **Provider**: `opencaptcha`
- **API Endpoint**: `https://api.opencaptcha.io/` (default) or your custom endpoint
- **API Key**: Not required
- **Description**: Open-source CAPTCHA service with no usage limits
- **Note**: The default public API endpoint (`https://api.opencaptcha.io/`) does not support CORS, which will cause browser console warnings. The control automatically falls back to a built-in generator. For production, configure a custom API endpoint with CORS enabled (see Troubleshooting section for details).

### hCaptcha
- **Provider**: `hcaptcha`
- **API Endpoint**: Leave empty (uses hCaptcha's widget)
- **API Key**: Your hCaptcha site key
- **Description**: Privacy-focused alternative to reCAPTCHA

### reCAPTCHA
- **Provider**: `recaptcha`
- **API Endpoint**: Leave empty (uses reCAPTCHA's widget)
- **API Key**: Your reCAPTCHA site key
- **Description**: Google's CAPTCHA service

### Custom API
- **Provider**: `custom` (or any other value)
- **API Endpoint**: Your custom API endpoint
- **API Key**: Your custom API key (if required)
- **Description**: Use with any custom CAPTCHA API

## Usage Examples

### Basic Usage (OpenCaptcha)
```javascript
// The control will use OpenCaptcha by default
// No additional configuration required
```

### Using hCaptcha
```javascript
// Set the provider and API key
control.CaptchaProvider = "hcaptcha";
control.ApiKey = "your-hcaptcha-site-key";
```

### Using reCAPTCHA
```javascript
// Set the provider and API key
control.CaptchaProvider = "recaptcha";
control.ApiKey = "your-recaptcha-site-key";
```

### Custom API Endpoint
```javascript
// Set custom provider and endpoint
control.CaptchaProvider = "custom";
control.ApiEndpoint = "https://your-api.com/captcha";
control.ApiKey = "your-api-key";
```

### Customizing Appearance
```javascript
// Set theme
control.Theme = "dark";

// Set custom messages
control.SuccessMessage = "Great! You're human!";
control.ErrorMessage = "Please try again.";

// Set custom button text
control.VerifyButtonText = "Check";
```

## Localization

The control automatically detects the browser language and provides localized text for:

- English (en)
- Arabic (ar)
- Spanish (es)
- French (fr)
- German (de)

You can override the default text using the property settings.

## Accessibility

The control includes comprehensive accessibility features:

- **Keyboard Navigation**: Full keyboard support for all interactive elements
- **Screen Reader Support**: Proper ARIA labels and descriptions
- **High Contrast**: Support for high contrast mode
- **Reduced Motion**: Respects user's motion preferences
- **Focus Management**: Clear focus indicators

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- Internet Explorer 11 (with polyfills)

## Known Considerations

### Value Property vs CaptchaResponse
- The `Value` property (friendly name: "Verified") is a Boolean indicating verification status (`true`/`false`)
- The `CaptchaResponse` property contains the user's text input response
- `CaptchaResponse` is the value property ID used by K2 for data binding (`valuePropertyID` in manifest)
- When verification succeeds, `Value` is set to `true` and `CaptchaResponse` is cleared

### Property Naming
- Standard K2 properties use the `Is` prefix: `IsVisible`, `IsEnabled`, `IsReadOnly`
- The control also supports `Tooltip`, `TabIndex`, and `AccessibilityText` programmatically via `getProperty`/`setProperty` methods, though these are not in the manifest

### Local Development Fallback
- In local development (localhost, 127.0.0.1, or file:// protocol), the control automatically uses a fallback CAPTCHA generator
- The fallback CAPTCHA works offline and is case-insensitive for testing purposes
- CORS errors trigger the fallback automatically

### Verification Flow
- Client-side verification is provided for OpenCaptcha fallback mode (local development)
- Production applications should implement server-side verification for all CAPTCHA providers
- The `Verified` event fires on successful verification
- The `VerificationFailed` event fires on failure, and if `AutoRefresh` is enabled, a new CAPTCHA loads automatically

### Provider Support
- OpenCaptcha: Full support with fallback for local development
- hCaptcha and reCAPTCHA: Widget-based providers require their respective JavaScript libraries to be loaded
- Custom API: Can be configured with any custom endpoint

## Security Considerations

1. **Server-side Verification**: While the control provides client-side verification for OpenCaptcha, production applications should implement server-side verification for all CAPTCHA providers.

2. **API Key Security**: Never expose sensitive API keys in client-side code. Consider using environment variables or server-side configuration.

3. **Rate Limiting**: Implement rate limiting on your server to prevent abuse of CAPTCHA verification endpoints.

4. **Fallback CAPTCHA**: The local development fallback is for testing only and should never be used in production.

## Troubleshooting

### CAPTCHA Not Loading
- Check your internet connection
- Verify the API endpoint is correct
- Ensure the API key is valid (if required)
- Check browser console for error messages

### CORS Errors (Expected Behavior)
**Important**: CORS errors in the browser console are **expected and normal** when using the default OpenCaptcha API endpoint (`https://api.opencaptcha.io/`). The open-source OpenCaptcha service does not enable CORS headers, which causes browser security warnings.

**What You'll See:**
- Console messages like: "Access to fetch at 'https://api.opencaptcha.io/' has been blocked by CORS policy"
- The control automatically falls back to a built-in CAPTCHA generator
- The CAPTCHA still functions correctly despite the warnings

**Recommended Solution for Production:**
For production deployments, configure the control to use your own CAPTCHA API endpoint that has CORS enabled:

```javascript
// Use your own CAPTCHA API with CORS support
control.setProperty({ property: "ApiEndpoint", Value: "https://your-domain.com/api/captcha" });
control.setProperty({ property: "CaptchaProvider", Value: "opencaptcha" });
```

This eliminates console warnings and gives you full control over the CAPTCHA service. You can:
- Host your own OpenCaptcha instance with CORS enabled
- Use a server-side proxy that adds CORS headers
- Switch to a commercial CAPTCHA provider (hCaptcha, reCAPTCHA) that supports CORS

**Local Development Fallback:**
The control automatically uses a fallback CAPTCHA generator when it detects:
- `localhost` or `127.0.0.1` hostnames
- `file://` protocol
- Any CORS or network errors

**Fallback Behavior:**
- Generates a client-side CAPTCHA image
- Uses canvas-based text rendering with distortion
- Provides proper verification for testing
- Works completely offline

### Verification Always Fails
- Ensure you're entering the text exactly as shown
- Check if the CAPTCHA has expired (refresh if needed)
- Verify server-side verification logic (if implemented)
- In local development, the fallback CAPTCHA is case-insensitive

### Styling Issues
- Check if custom CSS is conflicting with the control styles
- Ensure the control has sufficient width and height
- Verify theme settings are correct

## Development

### Building from Source
The control is built using standard web technologies:
- HTML5 Custom Elements
- CSS3 with modern features
- Vanilla JavaScript (ES6+)

### Testing
Test the control in different browsers and devices to ensure compatibility. Pay special attention to:
- Different screen sizes
- Various input methods (keyboard, touch)
- Accessibility tools (screen readers, keyboard navigation)

## License

This control is provided as part of the Control Dojo examples and follows the same licensing terms.

## Icon Attribution

**Icon**: Branching Paths Up  
**Source**: https://www.svgrepo.com/svg/526829/branching-paths-up  
**Collection**: Solar Line Duotone Icons  
**License**: CC Attribution License  
**Author**: Solar Icons

## API Attribution

**OpenCaptcha**: https://opencaptcha.io/  
Open-source CAPTCHA service used as the default provider in this control.

## Contributing

Contributions are welcome! Please ensure that any changes:
- Maintain backward compatibility
- Include proper documentation
- Follow the existing code style
- Include appropriate tests
- Consider accessibility implications

## Support

For support and questions:
- Check the troubleshooting section above
- Review the Control Dojo documentation
- Test with different CAPTCHA providers
- Verify your configuration settings

## Author

Crafted by **Esmari Swart**. I hope this control helps you keep humans happy and bots at bay with confidence.