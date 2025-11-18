# Adding Methods to a Custom Control

Want to add callable methods to your control? The GenericList New and CAPTCHA examples use a pattern that tends to work well. Here's how it works.

### Overview
- Declare methods in `manifest.json` under a `methods` array.
- Add an `execute(objInfo)` dispatcher in your control's JS that routes by `objInfo.methodName`.
- Create one internal function per method (like `addTestItems`, `clearItems`, or `Focus`).
- Got separate design-time and runtime scripts? You'll probably need `execute` in both if you want method support in both modes.

### 1) Declare methods in the manifest
Start with a `methods` array—one entry per method. Methods that don't return anything? Set `returntype` to `"None"`.

Example (from GenericList New):
```44:51:examples/GenericList New/manifest.json
  "methods": [{
  "id": "addTestItems",
  "displayname": "Add Test Items",
  "returntype": "None",
  "description": "Add default items",
  "parameters": []
}]
```

Quick field reference:
- `id`: This needs to match exactly what you check in your JS code. Case-sensitive.
- `displayname`: The label users see in the designer.
- `returntype`: Go with `None` when there's no return value.
- `parameters`: Leave it empty `[]` if the method doesn't take any inputs.

### 2) Implement the execute dispatcher in JS
Add an `execute(objInfo)` method to your control. It reads `objInfo.methodName` and routes to the right internal function using a switch statement.

Design-time example (CAPTCHA):
```623:638:Controls/CAPTCHA Box/designtime_logic.js
  execute(objInfo) {
    const method = objInfo.methodName;
    switch (method) {
      case "Focus":
        if (this.captchaInput) {
          this.captchaInput.focus();
        }
        break;
      case "Refresh":
        console.log('[CAPTCHA Design] Refresh called (design-time)');
        break;
      case "Verify":
        console.log('[CAPTCHA Design] Verify called (design-time)');
        break;
    }
  }
```

Runtime example (CAPTCHA):
```1060:1075:Controls/CAPTCHA Box/runtime_logic.js
  execute(objInfo) {
    const method = objInfo.methodName;
    switch (method) {
      case "Focus":
        if (this.captchaInput) {
          this.captchaInput.focus();
        }
        break;
      case "Refresh":
        this.refreshCaptcha();
        break;
      case "Verify":
        this.verifyCaptcha();
        break;
    }
  }
```

A few things to watch:
- The `methodName` must match your manifest `id` exactly—even small differences will break it.
- Keep the switch statement lean. Delegate the actual work to clearly named methods.
- Supporting design-time? You'll likely need the same `execute` dispatcher in your design-time JS file.

### 3) Implement the method body
One function per method. Here's how the GenericList New control does it with `addTestItems`:
```752:772:examples/GenericList New/generic-list.js
  /**
   * Add test items for development and testing
   */
  addTestItems() {
    const testItems = [
      {
        display: "First Item",
        value: "item1"
      },
      {
        display: "Second Item",
        value: "item2"
      },
      {
        display: "Third Item",
        value: "item3"
      }
    ];

    this.listItemsChangedCallback({ NewItems: testItems });
  }
```

### 4) How to invoke methods
Call methods through the `execute` API. Pass the method name like this:
```88:94:Controls/CAPTCHA Box/README.md
// Execute methods
control.execute({ methodName: "Focus" });
control.execute({ methodName: "Refresh" });
control.execute({ methodName: "Verify" });
```

You might also call it directly if the method is public: `control.addTestItems()`. That works sometimes, but the `execute` approach is more reliable across different contexts.

### 5) Quick checklist
Before you're done:
- Add a `methods` entry in `manifest.json` with the exact `id`, a clear `displayname`, the right `returntype` (`None` if there's no return), and `parameters`.
- Add `execute(objInfo)` in your control JS and route based on `objInfo.methodName`.
- Write the actual method implementation (`this.addTestItems()`, `this.clearItems()`, `this.Focus()`, whatever fits your control).
- Need design-time support? Add the same `execute` dispatcher to your design-time JS file.

### Troubleshooting
- Method not firing? Double-check that the manifest `id` matches the `methodName` you're using when calling `execute`, and that it matches your switch case. This is the most common issue.
- Design-time works fine but runtime doesn't (or the other way around)? You probably forgot to add `execute` to one of the scripts. Both need it if you want method support in both modes.
- Expecting no return value? Make sure you're using `"returntype": "None"` in the manifest.


