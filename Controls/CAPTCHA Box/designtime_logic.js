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

(function initCaptchaDesignTimeScript(globalScope) {
if (!globalScope) {
  return;
}
if (globalScope.__CAPTCHA_DESIGNTIME_INITIALIZED__) {
  console.debug("CAPTCHA design-time script already initialized; skipping duplicate load.");
  return;
}
globalScope.__CAPTCHA_DESIGNTIME_INITIALIZED__ = true;

// K2 safe helpers - Ensure K2 namespace exists for property change events
if (typeof window.K2 === "undefined") window.K2 = {};

const CAPTCHA_DEFAULT_HEIGHT = '200px';
const CAPTCHA_MIN_CONTROL_HEIGHT = 180; // px
const CAPTCHA_MIN_CONTROL_HEIGHT_PX = `${CAPTCHA_MIN_CONTROL_HEIGHT}px`;

function clampHeightValue(value) {
  if (value === undefined || value === null) {
    return CAPTCHA_MIN_CONTROL_HEIGHT_PX;
  }
  
  const trimmed = String(value).trim();
  const lowered = trimmed.toLowerCase();
  
  if (
    !trimmed ||
    lowered === 'auto' ||
    lowered === 'initial' ||
    lowered === 'inherit' ||
    lowered.includes('%') ||
    lowered.startsWith('calc(')
  ) {
    return trimmed;
  }
  
  const pxMatch = trimmed.match(/(-?\d*\.?\d+)\s*px/i);
  if (pxMatch) {
    const numericValue = parseFloat(pxMatch[1]);
    if (!Number.isNaN(numericValue) && numericValue < CAPTCHA_MIN_CONTROL_HEIGHT) {
      return CAPTCHA_MIN_CONTROL_HEIGHT_PX;
    }
  }
  
  return trimmed;
}

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
  _height = CAPTCHA_DEFAULT_HEIGHT;
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
    const normalized = (val === undefined || val === null || val === '') ? CAPTCHA_DEFAULT_HEIGHT : String(val);
    this._height = clampHeightValue(normalized);
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
    // Attach Shadow DOM
    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
    }
    
    this.render();
    
    // Find the K2 wrapper container
    this._findContainer();
    
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
    
    // Also observe the container if found
    if (this._container) {
      this._containerObserver = new MutationObserver(() => {
        if (this._hasRendered) {
          setTimeout(() => {
            this.updateDimensions();
          }, 0);
        }
      });
      
      this._containerObserver.observe(this._container, {
        attributes: true,
        attributeFilter: ['style']
      });
    }
    
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
    if (this._containerObserver) {
      this._containerObserver.disconnect();
    }
  }
  
  _findContainer() {
    let container = this.parentElement;
    while (container && !container.classList.contains('controlwrapper') && !container.classList.contains('resizewrapper')) {
      container = container.parentElement;
    }
    this._container = container;
    return container;
  }

  render() {
    if (this._hasRendered || !this.shadowRoot) return;
    
    // Detect browser culture
    this._culture = captchaDetectBrowserCulture();
    const isRTL = captchaIsRTLLanguage(this._culture);
    
    // Use custom placeholder if provided, otherwise use localized default
    const placeholder = this._placeholder && this._placeholder.trim() 
      ? this._placeholder.trim() 
      : captchaGetLocalizedString('placeholder', this._culture);
    
    // Add dir attribute and RTL class for RTL languages
    const dirAttr = isRTL ? 'dir="rtl"' : 'dir="ltr"';
    const rtlClass = isRTL ? 'rtl' : '';
    
    // Generate HTML template
    const htmlTemplate = `
      <div class="k2-captcha-control ${rtlClass}" ${dirAttr}>
        <div class="captcha-container">
          <div class="captcha-image-container">
            <div class="captcha-image-preview">
              <div class="captcha-preview-text">${captchaGetLocalizedString('designTimeCaptcha', this._culture)}</div>
              <div class="captcha-preview-overlay">
                <div class="captcha-preview-info">
                  ${captchaGetLocalizedString('designTimeInfo', this._culture)
                    .replace('{provider}', '<span class="preview-provider">OpenCaptcha</span>')
                    .replace('{theme}', '<span class="preview-theme">Light</span>')
                    .replace('{size}', '<span class="preview-size">300px</span>')}
                </div>
              </div>
            </div>
            <button class="captcha-refresh-btn" type="button" title="${captchaGetLocalizedString('refreshButton', this._culture)}" disabled>
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
              ${captchaGetLocalizedString('verifyButton', this._culture)}
            </button>
          </div>

          <div class="captcha-status">
            <div class="captcha-message" style="display: none;"></div>
          </div>
        </div>
      </div>
    `;
    
    // Generate complete Shadow DOM with styles
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          height: 100%;
          box-sizing: border-box;
          min-width: 0;
          --captcha-min-height: 180px;
          min-height: var(--captcha-min-height, 180px);
        }

        .k2-captcha-control {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          font-size: 14px;
          line-height: 1.4;
          color: #333;
          background: #fff;
          border: 1px solid #e1e5e9;
          border-radius: 8px;
          padding: 16px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          transition: all 0.2s ease;
          position: relative;
          overflow: hidden;
          width: 100%;
          height: 100%;
          box-sizing: border-box;
          min-height: var(--captcha-min-height, 180px);
          animation: fadeIn 0.3s ease-out;
        }

        .k2-captcha-control:hover {
          border-color: #007acc;
          box-shadow: 0 4px 8px rgba(0, 122, 204, 0.15);
        }

        .captcha-container {
          display: flex;
          flex-direction: column;
          gap: 12px;
          height: 100%;
          min-height: fit-content;
        }

        .k2-captcha-control:not(.has-explicit-height) .captcha-container,
        .k2-captcha-control[style*="height: auto"] .captcha-container {
          height: auto;
        }

        .captcha-image-container {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          flex: 0 1 auto;
          min-height: 80px;
          align-self: stretch;
        }

        .k2-captcha-control:not(.has-explicit-height) .captcha-image-container,
        .k2-captcha-control[style*="height: auto"] .captcha-image-container {
          margin-bottom: 0;
        }

        .k2-captcha-control.has-explicit-height .captcha-image-container,
        .k2-captcha-control[style*="height"]:not([style*="height: auto"]) .captcha-image-container {
          flex: 1 1 0;
        }

        .captcha-image-preview {
          flex: 1;
          min-height: 0;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          border: 2px dashed #dee2e6;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .k2-captcha-control.has-explicit-height .captcha-image-preview,
        .k2-captcha-control[style*="height"]:not([style*="height: auto"]) .captcha-image-preview {
          height: 100%;
          min-height: 80px;
        }

        .captcha-preview-text {
          font-size: 12px;
          color: #6c757d;
          text-align: center;
          padding: 16px;
          font-weight: 500;
        }

        .captcha-preview-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.2s ease;
        }

        .captcha-image-preview:hover .captcha-preview-overlay {
          opacity: 1;
        }

        .captcha-preview-info {
          font-size: 10px;
          color: #495057;
          text-align: center;
          line-height: 1.3;
        }

        .captcha-preview-info .preview-provider,
        .captcha-preview-info .preview-theme,
        .captcha-preview-info .preview-size {
          font-weight: 600;
          color: #007acc;
        }

        .captcha-refresh-btn {
          background: #f8f9fa;
          border: 1px solid #dee2e6;
          border-radius: 4px;
          padding: 8px;
          cursor: not-allowed;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          opacity: 0.6;
        }

        .captcha-refresh-btn:hover {
          background: #e9ecef;
          border-color: #adb5bd;
        }

        .captcha-refresh-btn svg {
          width: 16px;
          height: 16px;
          color: #6c757d;
        }

        .captcha-input-container {
          display: flex;
          gap: 8px;
          align-items: center;
          flex-shrink: 0;
          flex-grow: 0;
          margin-top: auto;
          min-height: 44px;
        }

        .k2-captcha-control:not(.has-explicit-height) .captcha-input-container,
        .k2-captcha-control[style*="height: auto"] .captcha-input-container {
          margin-top: 0;
        }

        .captcha-input {
          flex: 1;
          padding: 8px 12px;
          border: 1px solid #dee2e6;
          border-radius: 4px;
          font-size: 14px;
          background: #f8f9fa;
          color: #6c757d;
          cursor: not-allowed;
        }

        .captcha-input:focus {
          outline: none;
          border-color: #007acc;
          box-shadow: 0 0 0 2px rgba(0, 122, 204, 0.2);
        }

        .captcha-verify-btn {
          background: #6c757d;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 8px 16px;
          font-size: 14px;
          font-weight: 500;
          cursor: not-allowed;
          opacity: 0.6;
          transition: all 0.2s ease;
        }

        .captcha-verify-btn:hover {
          background: #5a6268;
        }

        .captcha-verify-btn.verified {
          background: #28a745 !important;
          color: white;
          cursor: default;
          transform: none;
          box-shadow: 0 2px 4px rgba(40, 167, 69, 0.3);
        }

        .captcha-verify-btn.verified:hover {
          background: #28a745 !important;
          transform: none;
          box-shadow: 0 2px 4px rgba(40, 167, 69, 0.3);
        }

        .captcha-status {
          flex-shrink: 0;
        }

        .captcha-message {
          padding: 8px 12px;
          border-radius: 4px;
          font-size: 13px;
          font-weight: 500;
          text-align: center;
          transition: all 0.3s ease;
          animation: slideIn 0.3s ease-out;
        }

        .captcha-message.success {
          background: #d4edda;
          color: #155724;
          border: 2px solid #28a745;
          font-weight: 600;
          animation: successPulse 0.5s ease-out;
        }

        .captcha-message.error {
          background: #f8d7da;
          color: #721c24;
          border: 2px solid #dc3545;
          font-weight: 600;
          animation: errorShake 0.5s ease-out;
        }

        .captcha-message.info {
          background: #d1ecf1;
          color: #0c5460;
          border: 1px solid #bee5eb;
        }

        @keyframes successPulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.02); }
          100% { transform: scale(1); }
        }

        @keyframes errorShake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .k2-captcha-control.theme-dark {
          background: #2c3e50;
          border-color: #34495e;
          color: #ecf0f1;
        }

        .k2-captcha-control.theme-dark:hover {
          border-color: #3498db;
          box-shadow: 0 4px 8px rgba(52, 152, 219, 0.15);
        }

        .k2-captcha-control.theme-dark .captcha-image-preview {
          background: linear-gradient(135deg, #34495e 0%, #2c3e50 100%);
          border-color: #4a5f7a;
        }

        .k2-captcha-control.theme-dark .captcha-preview-text {
          color: #bdc3c7;
        }

        .k2-captcha-control.theme-dark .captcha-preview-overlay {
          background: rgba(44, 62, 80, 0.9);
        }

        .k2-captcha-control.theme-dark .captcha-preview-info {
          color: #ecf0f1;
        }

        .k2-captcha-control.theme-dark .captcha-preview-info .preview-provider,
        .k2-captcha-control.theme-dark .captcha-preview-info .preview-theme,
        .k2-captcha-control.theme-dark .captcha-preview-info .preview-size {
          color: #3498db;
        }

        .k2-captcha-control.theme-dark .captcha-refresh-btn {
          background: #34495e;
          border-color: #4a5f7a;
        }

        .k2-captcha-control.theme-dark .captcha-refresh-btn:hover {
          background: #4a5f7a;
          border-color: #5d6d7e;
        }

        .k2-captcha-control.theme-dark .captcha-refresh-btn svg {
          color: #bdc3c7;
        }

        .k2-captcha-control.theme-dark .captcha-input {
          background: #34495e;
          border-color: #4a5f7a;
          color: #bdc3c7;
        }

        .k2-captcha-control.theme-dark .captcha-input:focus {
          border-color: #3498db;
          box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
        }

        .k2-captcha-control.theme-dark .captcha-verify-btn {
          background: #7f8c8d;
        }

        .k2-captcha-control.theme-dark .captcha-verify-btn:hover {
          background: #6c757d;
        }

        .k2-captcha-control.theme-dark .captcha-message.success {
          background: #1e3a1e;
          color: #90ee90;
          border-color: #2d5a2d;
        }

        .k2-captcha-control.theme-dark .captcha-message.error {
          background: #3a1e1e;
          color: #ff6b6b;
          border-color: #5a2d2d;
        }

        .k2-captcha-control.theme-dark .captcha-message.info {
          background: #1e2a3a;
          color: #87ceeb;
          border-color: #2d3a5a;
        }

        .k2-captcha-control.is-disabled,
        .k2-captcha-control.disabled {
          position: relative;
          opacity: 0.6;
          pointer-events: none;
          cursor: not-allowed;
        }

        .k2-captcha-control.is-disabled::after,
        .k2-captcha-control.disabled::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.5);
          pointer-events: none;
          border-radius: 8px;
        }

        .k2-captcha-control.is-disabled .captcha-input,
        .k2-captcha-control.is-disabled .captcha-verify-btn,
        .k2-captcha-control.is-disabled .captcha-refresh-btn,
        .k2-captcha-control.disabled .captcha-input,
        .k2-captcha-control.disabled .captcha-verify-btn,
        .k2-captcha-control.disabled .captcha-refresh-btn {
          cursor: not-allowed;
        }

        .k2-captcha-control.is-readonly,
        .k2-captcha-control.read-only {
          position: relative;
        }

        .k2-captcha-control.is-readonly::before,
        .k2-captcha-control.read-only::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(248, 249, 250, 0.8);
          pointer-events: none;
          border-radius: 8px;
        }

        .k2-captcha-control.is-readonly .captcha-input,
        .k2-captcha-control.read-only .captcha-input {
          background: #f8f9fa;
          cursor: not-allowed;
          color: #6c757d;
        }

        .k2-captcha-control.is-readonly .captcha-verify-btn,
        .k2-captcha-control.is-readonly .captcha-refresh-btn,
        .k2-captcha-control.read-only .captcha-verify-btn,
        .k2-captcha-control.read-only .captcha-refresh-btn {
          display: none;
        }

        .k2-captcha-control:focus-within {
          outline: 2px solid #007acc;
          outline-offset: 2px;
        }

        .captcha-refresh-btn:focus,
        .captcha-verify-btn:focus,
        .captcha-input:focus {
          outline: 2px solid #007acc;
          outline-offset: 1px;
        }

        .k2-captcha-control.rtl {
          direction: rtl;
          text-align: right;
        }

        .k2-captcha-control.rtl .captcha-image-container {
          flex-direction: row-reverse !important;
          direction: ltr !important;
        }

        .k2-captcha-control.rtl .captcha-input-container {
          flex-direction: row-reverse !important;
          direction: ltr !important;
        }

        .k2-captcha-control.rtl .captcha-input {
          direction: rtl;
          text-align: right;
        }

        .k2-captcha-control.rtl .captcha-preview-text,
        .k2-captcha-control.rtl .captcha-preview-info,
        .k2-captcha-control.rtl .captcha-message {
          text-align: center;
          direction: rtl;
        }

        @media (max-width: 480px) {
          .k2-captcha-control {
            padding: 12px;
          }
          
          .k2-captcha-control:not(.rtl) .captcha-image-container {
            flex-direction: column;
            align-items: stretch;
          }
          
          .k2-captcha-control:not(.rtl) .captcha-refresh-btn {
            align-self: flex-start;
            width: fit-content;
          }
          
          .k2-captcha-control:not(.rtl) .captcha-input-container {
            flex-direction: column;
            align-items: stretch;
          }
          
          .captcha-verify-btn {
            width: 100%;
          }

          .k2-captcha-control.rtl .captcha-image-container {
            flex-direction: column;
          }
          
          .k2-captcha-control.rtl .captcha-refresh-btn {
            align-self: flex-end;
          }
          
          .k2-captcha-control.rtl .captcha-input-container {
            flex-direction: column;
          }
        }

        @media (prefers-contrast: high) {
          .k2-captcha-control {
            border-width: 2px;
          }
          
          .captcha-input,
          .captcha-verify-btn,
          .captcha-refresh-btn {
            border-width: 2px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .k2-captcha-control,
          .captcha-refresh-btn,
          .captcha-verify-btn,
          .captcha-input,
          .captcha-message {
            transition: none;
            animation: none;
          }
        }

        @media print {
          .k2-captcha-control {
            border: 1px solid #000;
            box-shadow: none;
            background: #fff;
            color: #000;
          }
          
          .captcha-refresh-btn,
          .captcha-verify-btn {
            display: none;
          }
        }
      </style>
      ${htmlTemplate}
    `;

    // Grab refs from shadow DOM
    this.root = this.shadowRoot.querySelector('.k2-captcha-control');
    this.captchaInput = this.shadowRoot.querySelector('.captcha-input');
    this.refreshBtn = this.shadowRoot.querySelector('.captcha-refresh-btn');
    this.verifyBtn = this.shadowRoot.querySelector('.captcha-verify-btn');

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
    
    // Find container if not already found
    if (!this._container) {
      this._findContainer();
    }
    
    // Get dimensions from container if available, otherwise use computed styles
    let width = "100%";
    let height = this._height || CAPTCHA_DEFAULT_HEIGHT;
    
    if (this._container) {
      // Check if container has explicit width/height styles
      const containerStyle = window.getComputedStyle(this._container);
      const containerWidth = this._container.style.width || containerStyle.width;
      const containerHeight = this._container.style.height || containerStyle.height;
      
      // If container has explicit dimensions, use them
      if (containerWidth && containerWidth !== 'auto' && containerWidth !== '0px') {
        width = containerWidth;
      }
      if (containerHeight && containerHeight !== 'auto' && containerHeight !== '0px') {
        height = containerHeight;
      }
    }
    
    height = clampHeightValue(height);
    
    // Check if we have an explicit height (not auto)
    const hasExplicitHeight = height && height !== 'auto' && height !== '100%' && height !== '0px' && height !== 'none';
    
    // Always set the control to fill its container width and adapt height
    this.style.width = "100%";
    this.style.height = hasExplicitHeight ? "100%" : "auto";
    this.style.boxSizing = "border-box";
    this.style.minHeight = CAPTCHA_MIN_CONTROL_HEIGHT_PX;
    this.style.setProperty('--captcha-min-height', CAPTCHA_MIN_CONTROL_HEIGHT_PX);
    
    if (this.root) {
      if (hasExplicitHeight) {
        this.root.style.height = "100%";
        this.root.classList.add('has-explicit-height');
      } else {
        this.root.style.height = "auto";
        this.root.classList.remove('has-explicit-height');
      }
      this.root.style.width = "100%";
      this.root.style.minHeight = CAPTCHA_MIN_CONTROL_HEIGHT_PX;
      this.root.style.setProperty('--captcha-min-height', CAPTCHA_MIN_CONTROL_HEIGHT_PX);
    }
    
    // Update preview info with actual dimensions and sync container height so other controls flow correctly
    const sizeElement = this.shadowRoot?.querySelector('.preview-size');
    const actualHeight = this.root?.offsetHeight || this.offsetHeight || 0;
    if (sizeElement) {
      // Use offsetWidth/offsetHeight for actual rendered size
      const actualWidth = this.offsetWidth || this._container?.offsetWidth || 0;
      if (actualWidth > 0) {
        sizeElement.textContent = `${actualWidth}px`;
      } else {
        sizeElement.textContent = width;
      }
    }
    
    if (this._container) {
      if (hasExplicitHeight) {
        if (height && this._container.style.height !== height) {
          this._container.style.height = height;
        }
        if (height && this._container.style.minHeight !== height) {
          this._container.style.minHeight = height;
        }
      } else {
        if (this._container.style.height !== 'auto') {
          this._container.style.height = 'auto';
        }
        const measuredHeight = Math.max(actualHeight || 0, CAPTCHA_MIN_CONTROL_HEIGHT);
        if (measuredHeight > 0) {
          const minHeightValue = `${measuredHeight}px`;
          if (this._container.style.minHeight !== minHeightValue) {
            this._container.style.minHeight = minHeightValue;
          }
        } else if (this._container.style.minHeight) {
          this._container.style.minHeight = '';
        }
      }
    }
  }

  updatePreview() {
    if (!this._hasRendered || !this.shadowRoot) return;
    
    // Update provider display
    const providerElement = this.shadowRoot.querySelector('.preview-provider');
    if (providerElement) {
      providerElement.textContent = this._captchaProvider || "OpenCaptcha";
    }
    
    // Update theme display
    const themeElement = this.shadowRoot.querySelector('.preview-theme');
    if (themeElement) {
      themeElement.textContent = this._theme || "Light";
    }
    
    // Update verification status display
    const statusElement = this.shadowRoot.querySelector('.captcha-preview-text');
    if (statusElement) {
      if (this._value === "true") {
        statusElement.textContent = "CAPTCHA Verified";
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
    if (!this._hasRendered || !this.shadowRoot || !this.root) return;
    
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
      case 'Height': return this._height || CAPTCHA_DEFAULT_HEIGHT;
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

})(typeof window !== "undefined" ? window : null);