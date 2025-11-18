/**
 * CAPTCHA Box - Design-Time Implementation
 * 
 * This file contains the design-time (preview) implementation of the CAPTCHA box.
 * It provides a static preview of the control for the K2 Designer without requiring
 * external CAPTCHA services or interactive functionality.
 * 
 * Key Features:
 * - Static preview that matches runtime appearance
 * - Configurable CAPTCHA provider settings
 * - Property value display
 * - Theme support (light/dark)
 * - Performance optimized with caching
 * 
 * Design-Time vs Runtime:
 * - No external API calls to CAPTCHA services
 * - No actual CAPTCHA image loading
 * - No verification functionality
 * - Static preview with property information
 * - Cached rendering for performance
 * 
 * @author K2 Development Team
 * @version 1.0.0
 */

// K2 safe helpers - Ensure K2 namespace exists for property change events
if (typeof window.K2 === "undefined") window.K2 = {};

// Simple Localization System for CAPTCHA Box (Design-time)
const CAPTCHA_STRINGS = {
  en: {
    placeholder: "Enter the text you see above",
    refreshButton: "Refresh",
    verifyButton: "Verify",
    successMessage: "CAPTCHA verified successfully!",
    errorMessage: "CAPTCHA verification failed. Please try again.",
    designTimeTitle: "CAPTCHA Box",
    designTimeSubtitle: "Design-time preview (static)",
    designTimeInstruction: "Run the View/Form to use the interactive CAPTCHA with verification.",
    designTimeInfo: "Provider: {provider} • Theme: {theme} • Size: {size}",
    designTimeCaptcha: "Sample CAPTCHA (design preview)",
    loadingCaptcha: "Loading CAPTCHA...",
    captchaError: "Failed to load CAPTCHA"
  },
  ar: {
    placeholder: "أدخل النص الذي تراه أعلاه",
    refreshButton: "تحديث",
    verifyButton: "تحقق",
    successMessage: "تم التحقق من CAPTCHA بنجاح!",
    errorMessage: "فشل التحقق من CAPTCHA. يرجى المحاولة مرة أخرى.",
    designTimeTitle: "عنصر تحكم CAPTCHA",
    designTimeSubtitle: "معاينة وقت التصميم (ثابتة)",
    designTimeInstruction: "قم بتشغيل العرض/النموذج لاستخدام CAPTCHA التفاعلي مع التحقق.",
    designTimeInfo: "المزود: {provider} • المظهر: {theme} • الحجم: {size}",
    designTimeCaptcha: "CAPTCHA عينة (معاينة التصميم)",
    loadingCaptcha: "جاري تحميل CAPTCHA...",
    captchaError: "فشل في تحميل CAPTCHA"
  },
  es: {
    placeholder: "Ingrese el texto que ve arriba",
    refreshButton: "Actualizar",
    verifyButton: "Verificar",
    successMessage: "¡CAPTCHA verificado exitosamente!",
    errorMessage: "La verificación del CAPTCHA falló. Por favor, inténtelo de nuevo.",
    designTimeTitle: "Control CAPTCHA",
    designTimeSubtitle: "Vista previa de tiempo de diseño (estática)",
    designTimeInstruction: "Ejecute la Vista/Formulario para usar el CAPTCHA interactivo con verificación.",
    designTimeInfo: "Proveedor: {provider} • Tema: {theme} • Tamaño: {size}",
    designTimeCaptcha: "CAPTCHA de muestra (vista previa de diseño)",
    loadingCaptcha: "Cargando CAPTCHA...",
    captchaError: "Error al cargar CAPTCHA"
  },
  fr: {
    placeholder: "Entrez le texte que vous voyez ci-dessus",
    refreshButton: "Actualiser",
    verifyButton: "Vérifier",
    successMessage: "CAPTCHA vérifié avec succès !",
    errorMessage: "La vérification du CAPTCHA a échoué. Veuillez réessayer.",
    designTimeTitle: "Contrôle CAPTCHA",
    designTimeSubtitle: "Aperçu de temps de conception (statique)",
    designTimeInstruction: "Exécutez la Vue/Formulaire pour utiliser le CAPTCHA interactif avec vérification.",
    designTimeInfo: "Fournisseur: {provider} • Thème: {theme} • Taille: {size}",
    designTimeCaptcha: "CAPTCHA d'exemple (aperçu de conception)",
    loadingCaptcha: "Chargement du CAPTCHA...",
    captchaError: "Échec du chargement du CAPTCHA"
  },
  de: {
    placeholder: "Geben Sie den Text ein, den Sie oben sehen",
    refreshButton: "Aktualisieren",
    verifyButton: "Verifizieren",
    successMessage: "CAPTCHA erfolgreich verifiziert!",
    errorMessage: "CAPTCHA-Verifizierung fehlgeschlagen. Bitte versuchen Sie es erneut.",
    designTimeTitle: "CAPTCHA-Steuerung",
    designTimeSubtitle: "Design-Zeit-Vorschau (statisch)",
    designTimeInstruction: "Führen Sie die Ansicht/Formular aus, um das interaktive CAPTCHA mit Verifizierung zu verwenden.",
    designTimeInfo: "Anbieter: {provider} • Thema: {theme} • Größe: {size}",
    designTimeCaptcha: "Beispiel-CAPTCHA (Design-Vorschau)",
    loadingCaptcha: "CAPTCHA wird geladen...",
    captchaError: "CAPTCHA konnte nicht geladen werden"
  }
};

// Browser culture detection with English fallback
function captchaDetectBrowserCulture() {
  try {
    const browserLang = navigator.language || navigator.userLanguage || 'en';
    const langCode = browserLang.split('-')[0].toLowerCase();
    
    // Check if we support this language, fallback to English
    if (CAPTCHA_STRINGS[langCode]) {
      return langCode;
    } else {
      // Return the detected code even if not fully supported (for RTL detection)
      // The localization will fallback to English strings
      return langCode;
    }
  } catch (e) {
    console.warn('[CAPTCHA Design] Error detecting browser culture:', e);
  }
  
  // Always fallback to English
  return 'en';
}

// Get localized string with English fallback
function captchaGetLocalizedString(key, culture = null) {
  const currentCulture = culture || captchaDetectBrowserCulture();
  const strings = CAPTCHA_STRINGS[currentCulture] || CAPTCHA_STRINGS.en;
  return strings[key] || CAPTCHA_STRINGS.en[key] || key;
}

function safeRaisePropertyChanged(ctrl, prop) {
  try {
    if (window.K2?.RaisePropertyChanged) {
      K2.RaisePropertyChanged(ctrl, prop);
    }
  } catch (e) {
    console.warn("RaisePropertyChanged failed:", e);
  }
}

function safeGetControlStyleTemplate(ctrl) {
  if (window.K2?.GetControlStyleTemplate) return K2.GetControlStyleTemplate(ctrl);
  return ctrl.getDefaultTemplate?.();
}

// RTL language detection function
function captchaIsRTLLanguage(culture) {
  const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
  return rtlLanguages.includes(culture?.toLowerCase());
}

// Design-time template generator with localization
function captchaGenerateDesignTemplate(culture = null, customPlaceholder = null) {
  const currentCulture = culture || captchaDetectBrowserCulture();
  const isRTL = captchaIsRTLLanguage(currentCulture);
  
  // Use custom placeholder if provided, otherwise use localized default
  const placeholder = customPlaceholder && customPlaceholder.trim() 
    ? customPlaceholder.trim() 
    : captchaGetLocalizedString('placeholder', currentCulture);
  
  // Add dir attribute and RTL class for RTL languages
  const dirAttr = isRTL ? 'dir="rtl"' : 'dir="ltr"';
  const rtlClass = isRTL ? 'rtl' : '';
  
  return `
    <div class="k2-captcha-control ${rtlClass}" ${dirAttr}>
      <div class="captcha-container">
        <div class="captcha-image-container">
          <div class="captcha-image-preview">
            <div class="captcha-preview-text">${captchaGetLocalizedString('designTimeCaptcha', currentCulture)}</div>
            <div class="captcha-preview-overlay">
              <div class="captcha-preview-info">
                ${captchaGetLocalizedString('designTimeInfo', currentCulture)
                  .replace('{provider}', '<span class="preview-provider">OpenCaptcha</span>')
                  .replace('{theme}', '<span class="preview-theme">Light</span>')
                  .replace('{size}', '<span class="preview-size">300px</span>')}
              </div>
            </div>
          </div>
          <button class="captcha-refresh-btn" type="button" title="${captchaGetLocalizedString('refreshButton', currentCulture)}" disabled>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="23 4 23 10 17 10"></polyline>
              <polyline points="1 20 1 14 7 14"></polyline>
              <path d="m3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
            </svg>
          </button>
        </div>

        <div class="captcha-input-container">
          <input type="text" class="captcha-input" placeholder="${placeholder}" disabled />
          <button class="captcha-verify-btn" type="button" disabled>
            ${captchaGetLocalizedString('verifyButton', currentCulture)}
          </button>
        </div>

        <div class="captcha-status">
          <div class="captcha-message" style="display: none;"></div>
        </div>
      </div>
    </div>
  `;
}

if (!window.customElements.get('captcha-control')) {
  window.customElements.define('captcha-control', class K2CaptchaControl extends HTMLElement {
  // Backing fields - same as runtime
  _value = "false";
  _captchaResponse = "";
  _captchaProvider = "opencaptcha";
  _apiEndpoint = "https://api.opencaptcha.io/";
  _apiKey = "";
  _placeholder = "";
  _verifyButtonText = "";
  _successMessage = "";
  _errorMessage = "";
  _autoRefresh = "true";
  _theme = "light";
  _width = "300px";
  _height = "auto";
  _enabled = "true";
  _readOnly = "false";
  _tooltip = "";
  _tabIndex = "0";
  _accessibilityText = "";

  _hasRendered = false;
  _isVisible = true;
  _isEnabled = true;
  _isReadOnly = false;

  // Standard K2 Properties
  get IsVisible() { return this._isVisible; }
  set IsVisible(val) {
    this._isVisible = val === 'true' || val === true;
    this.setAttribute('isvisible', val);
    if (this._hasRendered && this.root) {
      this.root.style.display = this._isVisible ? '' : 'none';
    }
    safeRaisePropertyChanged(this, 'IsVisible');
  }

  get IsEnabled() { return this._isEnabled; }
  set IsEnabled(val) {
    this._isEnabled = val === 'true' || val === true;
    this.setAttribute('isenabled', val);
    if (this._hasRendered) {
      this.updateEnabledState();
    }
    safeRaisePropertyChanged(this, 'IsEnabled');
  }

  get IsReadOnly() { return this._isReadOnly; }
  set IsReadOnly(val) {
    this._isReadOnly = val === 'true' || val === true;
    this.setAttribute('isreadonly', val);
    if (this._hasRendered) {
      this.updateReadOnlyState();
    }
    safeRaisePropertyChanged(this, 'IsReadOnly');
  }

  // K2 properties - same as runtime
  get Value() { return this._value; }
  set Value(val) {
    this._value = val || "false";
    if (this._hasRendered) this.updatePreview();
  }

  get CaptchaResponse() { return this._captchaResponse; }
  set CaptchaResponse(val) {
    this._captchaResponse = val || "";
    if (this._hasRendered) this.updatePreview();
  }

  get CaptchaProvider() { return this._captchaProvider; }
  set CaptchaProvider(val) {
    this._captchaProvider = val || "opencaptcha";
    if (this._hasRendered) this.updatePreview();
  }

  get ApiEndpoint() { return this._apiEndpoint; }
  set ApiEndpoint(val) {
    this._apiEndpoint = val || "https://api.opencaptcha.io/";
    if (this._hasRendered) this.updatePreview();
  }

  get ApiKey() { return this._apiKey; }
  set ApiKey(val) {
    this._apiKey = val || "";
    if (this._hasRendered) this.updatePreview();
  }

  get Placeholder() { return this._placeholder; }
  set Placeholder(val) {
    this._placeholder = val || "";
    if (this._hasRendered && this.captchaInput) {
      // Use custom placeholder if provided, otherwise use localized default
      const placeholder = this._placeholder && this._placeholder.trim() 
        ? this._placeholder.trim() 
        : captchaGetLocalizedString('placeholder', this._culture);
      this.captchaInput.setAttribute("placeholder", placeholder);
    }
  }

  get VerifyButtonText() { return this._verifyButtonText; }
  set VerifyButtonText(val) {
    this._verifyButtonText = val || "";
    if (this._hasRendered && this.verifyBtn) {
      // Use custom text if provided, otherwise use localized default
      const buttonText = this._verifyButtonText && this._verifyButtonText.trim() 
        ? this._verifyButtonText.trim() 
        : captchaGetLocalizedString('verifyButton', this._culture);
      this.verifyBtn.textContent = buttonText;
    }
  }

  get SuccessMessage() { return this._successMessage; }
  set SuccessMessage(val) {
    this._successMessage = val || "";
  }

  get ErrorMessage() { return this._errorMessage; }
  set ErrorMessage(val) {
    this._errorMessage = val || "";
  }

  get AutoRefresh() { return this._autoRefresh; }
  set AutoRefresh(val) {
    this._autoRefresh = val === 'true' || val === true;
  }

  get Theme() { return this._theme; }
  set Theme(val) {
    this._theme = val || "light";
    if (this._hasRendered) this.updateTheme();
  }

  get Width() { return this._width; }
  set Width(val) {
    this._width = val || "300px";
    if (this._hasRendered) this.updateDimensions();
  }

  get Height() { return this._height; }
  set Height(val) {
    this._height = val || "auto";
    if (this._hasRendered) this.updateDimensions();
  }

  get ControlStyle() { return this._style; }
  set ControlStyle(val) {
    this._style = val;
    this._hasRendered = false;
    this.render();
  }

  get Enabled() { return this._enabled; }
  set Enabled(val) {
    this._enabled = val || "true";
    if (this._hasRendered) {
      this.updateEnabledState();
    }
  }

  get ReadOnly() { return this._readOnly; }
  set ReadOnly(val) {
    this._readOnly = val || "false";
    if (this._hasRendered) {
      this.updateReadOnlyState();
    }
  }

  get Tooltip() { return this._tooltip; }
  set Tooltip(val) {
    this._tooltip = val || "";
    if (this._hasRendered && this.root) {
      this.root.setAttribute("title", this._tooltip);
    }
  }

  get TabIndex() { return this._tabIndex; }
  set TabIndex(val) {
    this._tabIndex = val || "0";
    if (this._hasRendered && this.captchaInput) {
      this.captchaInput.setAttribute("tabindex", this._tabIndex);
    }
  }

  get AccessibilityText() { return this._accessibilityText; }
  set AccessibilityText(val) {
    this._accessibilityText = val || "";
    if (this._hasRendered) {
      this.updateAccessibility();
    }
  }

  get Format() { return this._format; }
  set Format(val) {
    this._format = val || "";
    // Format can be used for custom validation or display formatting
  }

  constructor() { super(); }

  connectedCallback() { 
    this.render();
    
    // Observe style attribute changes from K2/Dojo
    this._styleObserver = new MutationObserver(() => {
      if (this._hasRendered) {
        // Small delay to ensure style is applied
        setTimeout(() => {
          this.updateDimensions();
        }, 0);
      }
    });
    
    this._styleObserver.observe(this, {
      attributes: true,
      attributeFilter: ['style']
    });
    
    // Also check dimensions after a short delay to catch initial styles
    setTimeout(() => {
      if (this._hasRendered) {
        this.updateDimensions();
      }
    }, 100);
  }
  
  disconnectedCallback() {
    if (this._styleObserver) {
      this._styleObserver.disconnect();
    }
  }

  render() {
    if (this._hasRendered) return;
    
    // Detect browser culture
    this._culture = captchaDetectBrowserCulture();
    
    // Generate localized template with custom placeholder
    this.innerHTML = captchaGenerateDesignTemplate(this._culture, this._placeholder);

    // Grab refs
    this.root = this.querySelector('.k2-captcha-control');
    this.captchaInput = this.querySelector('.captcha-input');
    this.refreshBtn = this.querySelector('.captcha-refresh-btn');
    this.verifyBtn = this.querySelector('.captcha-verify-btn');

    // Apply props to UI
    this.Placeholder = this._placeholder;
    this.VerifyButtonText = this._verifyButtonText;
    this.Tooltip = this._tooltip;
    this.TabIndex = this._tabIndex;
    this.updateDimensions();
    this.updatePreview();
    this.updateTheme();
    this.updateEnabledState();
    this.updateReadOnlyState();
    this.updateAccessibility();

    // Initialize standard properties
    this.IsVisible = this._isVisible;
    this.IsEnabled = this._isEnabled;
    this.IsReadOnly = this._isReadOnly;

    // Hook events (non-functional for design-time)
    this.captchaInput.addEventListener('focus', () => {
      this.dispatchEvent(new Event('Focus'));
    });
    
    this.captchaInput.addEventListener('blur', () => {
      this.dispatchEvent(new Event('Blur'));
    });
    
    this.captchaInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        this.dispatchEvent(new Event('OnEnter'));
      }
    });
    
    this.refreshBtn.addEventListener('click', () => {
      // Design-time preview - no action
    });

    this.verifyBtn.addEventListener('click', () => {
      // Design-time preview - no action
    });

    this._hasRendered = true;
    this.dispatchEvent(new Event('Rendered'));
  }

  updateDimensions() {
    if (!this._hasRendered) return;
    
    // Check if K2/Dojo has set inline styles (preferred method)
    const inlineHeight = this.style.height || window.getComputedStyle(this).height;
    const inlineWidth = this.style.width || window.getComputedStyle(this).width;
    
    // Use property values as fallback if no inline styles
    const width = inlineWidth || this._width || "300px";
    const height = inlineHeight || this._height || "auto";
    
    // Apply width if not already set via inline style
    if (!this.style.width) {
      this.style.width = width;
    }
    
    // Apply height if not already set via inline style
    if (!this.style.height) {
      this.style.height = height;
    }
    
    // Check if we have an explicit height (not auto)
    const hasExplicitHeight = height && height !== 'auto' && height !== '0px' && height !== 'none';
    
    if (this.root) {
      if (hasExplicitHeight) {
        this.root.style.height = "100%";
        this.root.classList.add('has-explicit-height');
      } else {
        this.root.style.height = "auto";
        this.root.classList.remove('has-explicit-height');
      }
    }
    
    // Update preview info
    const sizeElement = this.querySelector('.preview-size');
    if (sizeElement) {
      sizeElement.textContent = width;
    }
  }

  updatePreview() {
    if (!this._hasRendered) return;
    
    // Update provider display
    const providerElement = this.querySelector('.preview-provider');
    if (providerElement) {
      providerElement.textContent = this._captchaProvider || "OpenCaptcha";
    }
    
    // Update theme display
    const themeElement = this.querySelector('.preview-theme');
    if (themeElement) {
      themeElement.textContent = this._theme || "Light";
    }
    
    // Update verification status display
    const statusElement = this.querySelector('.captcha-preview-text');
    if (statusElement) {
      if (this._value === "true") {
        statusElement.textContent = "✓ CAPTCHA Verified";
        statusElement.style.color = "#28a745";
      } else {
        statusElement.textContent = captchaGetLocalizedString('designTimeCaptcha', this._culture);
        statusElement.style.color = "#6c757d";
      }
    }
  }

  updateTheme() {
    if (!this._hasRendered) return;
    
    // Remove existing theme classes
    this.root.classList.remove('theme-light', 'theme-dark');
    
    // Add new theme class
    this.root.classList.add(`theme-${this._theme || 'light'}`);
  }

  updateEnabledState() {
    if (!this._hasRendered) return;
    
    // Check both Enabled and IsEnabled properties
    const isEnabled = (this._enabled === "true") && this._isEnabled;
    this.root.classList.toggle('disabled', !isEnabled);
    this.root.classList.toggle('is-disabled', !isEnabled);
    
    if (this.captchaInput) {
      this.captchaInput.disabled = !isEnabled;
    }
    if (this.verifyBtn) {
      this.verifyBtn.disabled = !isEnabled;
    }
    if (this.refreshBtn) {
      this.refreshBtn.disabled = !isEnabled;
    }
  }

  updateReadOnlyState() {
    if (!this._hasRendered) return;
    
    // Check both ReadOnly and IsReadOnly properties
    const isReadOnly = (this._readOnly === "true") || this._isReadOnly;
    this.root.classList.toggle('read-only', isReadOnly);
    this.root.classList.toggle('is-readonly', isReadOnly);
    
    if (this.captchaInput) {
      this.captchaInput.readOnly = isReadOnly;
    }
    if (this.verifyBtn) {
      this.verifyBtn.style.display = isReadOnly ? 'none' : 'block';
    }
    if (this.refreshBtn) {
      this.refreshBtn.style.display = isReadOnly ? 'none' : 'block';
    }
  }

  updateAccessibility() {
    if (!this._hasRendered) return;
    
    // Remove existing accessibility label
    const existingLabel = this.root.querySelector('[id$="_AccessibilityLabel"]');
    if (existingLabel) {
      existingLabel.remove();
    }
    
    // Create new accessibility label if needed
    if (this._accessibilityText && this._accessibilityText.trim()) {
      const labelId = this.id + "_AccessibilityLabel";
      const label = document.createElement('div');
      label.id = labelId;
      label.textContent = this._accessibilityText;
      label.style.display = 'none';
      this.root.appendChild(label);
      
      if (this.captchaInput) {
        this.captchaInput.setAttribute('aria-labelledby', labelId);
      }
    }
  }

  // Standard K2 control methods
  getValue(objInfo) {
    return this._value || "false";
  }

  setValue(objInfo) {
    this.Value = objInfo.Value || "false";
  }

  getProperty(objInfo) {
    const property = objInfo.property;
    switch (property) {
      case 'Value': return this._value || "false";
      case 'CaptchaResponse': return this._captchaResponse || "";
      case 'CaptchaProvider': return this._captchaProvider || "opencaptcha";
      case 'ApiEndpoint': return this._apiEndpoint || "https://api.opencaptcha.io/";
      case 'ApiKey': return this._apiKey || "";
      case 'Placeholder': return this._placeholder || "";
      case 'VerifyButtonText': return this._verifyButtonText || "";
      case 'SuccessMessage': return this._successMessage || "";
      case 'ErrorMessage': return this._errorMessage || "";
      case 'AutoRefresh': return this._autoRefresh;
      case 'Theme': return this._theme || "light";
      case 'Width': return this._width || "300px";
      case 'Height': return this._height || "auto";
      case 'Enabled': return this._enabled || "true";
      case 'ReadOnly': return this._readOnly || "false";
      case 'Tooltip': return this._tooltip || "";
      case 'TabIndex': return this._tabIndex || "0";
      case 'AccessibilityText': return this._accessibilityText || "";
      case 'IsVisible': return this._isVisible;
      case 'IsEnabled': return this._isEnabled;
      case 'IsReadOnly': return this._isReadOnly;
      default: return "";
    }
  }

  setProperty(objInfo) {
    const property = objInfo.property;
    const value = objInfo.Value || "";
    
    switch (property) {
      case 'Value': this.Value = value; break;
      case 'CaptchaResponse': this.CaptchaResponse = value; break;
      case 'CaptchaProvider': this.CaptchaProvider = value; break;
      case 'ApiEndpoint': this.ApiEndpoint = value; break;
      case 'ApiKey': this.ApiKey = value; break;
      case 'Placeholder': this.Placeholder = value; break;
      case 'VerifyButtonText': this.VerifyButtonText = value; break;
      case 'SuccessMessage': this.SuccessMessage = value; break;
      case 'ErrorMessage': this.ErrorMessage = value; break;
      case 'AutoRefresh': this.AutoRefresh = value; break;
      case 'Theme': this.Theme = value; break;
      case 'Width': this.Width = value; break;
      case 'Height': this.Height = value; break;
      case 'Enabled': this.Enabled = value; break;
      case 'ReadOnly': this.ReadOnly = value; break;
      case 'Tooltip': this.Tooltip = value; break;
      case 'TabIndex': this.TabIndex = value; break;
      case 'AccessibilityText': this.AccessibilityText = value; break;
      case 'IsVisible': this.IsVisible = value; break;
      case 'IsEnabled': this.IsEnabled = value; break;
      case 'IsReadOnly': this.IsReadOnly = value; break;
    }
  }

  execute(objInfo) {
    const method = objInfo.methodName;
    switch (method) {
      case "Focus":
        if (this.captchaInput) {
          this.captchaInput.focus();
        }
        break;
      case "Refresh":
        // Design-time preview - no action
        break;
      case "Verify":
        // Design-time preview - no action
        break;
    }
  }
});
}

// Design-time specific functions for K2 Designer integration
function captchaRenderDesignPreview(ctrl) {
  if (!ctrl) {
    console.warn('[CAPTCHA Design] No control provided to captchaRenderDesignPreview');
    return;
  }

  // Ensure the control is visible
  if (ctrl.offsetParent === null) {
    return;
  }
  
  // Trigger re-render if already rendered
  if (ctrl._hasRendered) {
    ctrl.updatePreview();
    ctrl.updateDimensions();
    ctrl.updateTheme();
  }
}

function captchaOnPropertyChanged(ctrl, prop, val) {
  if (!ctrl) return;
  
  // Debounce property changes
  if (ctrl._propertyChangeTimeout) {
    clearTimeout(ctrl._propertyChangeTimeout);
  }
  
  ctrl._propertyChangeTimeout = setTimeout(() => {
    captchaRenderDesignPreview(ctrl);
  }, 50);
}

function captchaPaintAll() {
  const controls = document.querySelectorAll('captcha-control');
  
  controls.forEach((ctrl) => {
    if (ctrl.offsetParent !== null) {
      captchaRenderDesignPreview(ctrl);
    }
  });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    captchaPaintAll();
  });
} else {
  captchaPaintAll();
}

// Handle window resize
let resizeTimeout;
window.addEventListener('resize', () => {
  if (resizeTimeout) clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    captchaPaintAll();
  }, 100);
});



