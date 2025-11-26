(() => {
/* Drag and Drop Control – Design-time Preview */

/**
 * Localization System for Drag and Drop Control (Design-time)
 */
const DT_DRAG_DROP_STRINGS = {
  en: {
    watermark: "Upload File",
    previewHelper: "Drag and drop or click to upload"
  },
  ar: {
    watermark: "رفع ملف",
    previewHelper: "اسحب وأفلت أو انقر للرفع"
  }
};

const DRAG_DROP_DEFAULT_HEIGHT = '70px';

function dtDragDropDetectBrowserCulture() {
  try {
    const browserLang = navigator.language || navigator.userLanguage || 'en';
    const langCode = browserLang.split('-')[0].toLowerCase();
    
    if (DT_DRAG_DROP_STRINGS[langCode]) {
      return langCode;
    }
  } catch (e) {
    console.warn('[DragDrop] Error detecting browser culture:', e);
  }
  
  return 'en';
}

function dtDragDropGetLocalizedString(key, culture = null) {
  const currentCulture = culture || dtDragDropDetectBrowserCulture();
  const strings = DT_DRAG_DROP_STRINGS[currentCulture] || DT_DRAG_DROP_STRINGS.en;
  return strings[key] || DT_DRAG_DROP_STRINGS.en[key] || key;
}

function dtDragDropIsRTLCulture(culture = null) {
  const currentCulture = culture || dtDragDropDetectBrowserCulture();
  return currentCulture === 'ar';
}

const DT_DEFAULT_WATERMARK = 'Upload File';

function toBool(val, fallback = true) {
  if (val === undefined || val === null || val === '') return fallback;
  if (typeof val === 'boolean') return val;
  return val.toString().toLowerCase() === 'true';
}

function toCssDimension(val) {
  if (val === undefined || val === null || val === '') return '';
  return isNaN(val) ? String(val) : `${val}px`;
}

if (!window.customElements.get('drag-drop-control')) {
  window.customElements.define('drag-drop-control', class DragDropDesignControl extends HTMLElement {
    constructor() {
      super();
      this._culture = null;
      this._watermark = ''; // Will use localized default in render
      this._width = '';
      this._height = DRAG_DROP_DEFAULT_HEIGHT;
      this._isVisible = true;
      this._isEnabled = true;
      this._isReadOnly = false;
      this._showInformation = true;
      this._isBorderless = false;
      this._hasRendered = false;
      this._resizeObserver = null;
      this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes() {
      return [
        'watermark',
        'width',
        'height',
        'isvisible',
        'isenabled',
        'isreadonly',
        'showinformation',
        'borderless'
      ];
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if (oldValue === newValue) return;
      switch (name) {
        case 'watermark':
          this.Watermark = newValue;
          break;
        case 'width':
          this.Width = newValue;
          break;
        case 'height':
          this.Height = newValue;
          break;
        case 'isvisible':
          this.IsVisible = newValue;
          break;
        case 'isenabled':
          this.IsEnabled = newValue;
          break;
        case 'isreadonly':
          this.IsReadOnly = newValue;
          break;
        case 'showinformation':
          this.ShowInformation = newValue;
          break;
        case 'borderless':
          this.Borderless = newValue;
          break;
        default:
          break;
      }
    }

    connectedCallback() {
      // Detect browser language and set RTL/LTR
      this._culture = dtDragDropDetectBrowserCulture();
      const isRTL = dtDragDropIsRTLCulture(this._culture);
      
      if (isRTL) {
        this.setAttribute('dir', 'rtl');
        this.classList.add('rtl');
      } else {
        this.setAttribute('dir', 'ltr');
        this.classList.add('ltr');
      }
      this.render();
    }

    disconnectedCallback() {
      if (this._resizeObserver) {
        this._resizeObserver.disconnect();
        this._resizeObserver = null;
      }
    }

    get Watermark() {
      return this._watermark;
    }
    set Watermark(val) {
      // If watermark is empty, use localized default
      const culture = this._culture || dtDragDropDetectBrowserCulture();
      const defaultWatermark = dtDragDropGetLocalizedString('watermark', culture);
      const next = val && val.trim() ? val : defaultWatermark;
      this._watermark = next;
      if (this._watermarkText) {
        this._watermarkText.textContent = this._watermark;
      }
    }

    get Width() {
      return this._width;
    }
    set Width(val) {
      this._width = val || '';
      this.updateDimensions();
    }

    get Height() {
      return this._height;
    }
    set Height(val) {
      this._height = val || '';
      this.updateDimensions();
    }

    get IsVisible() {
      return this._isVisible;
    }
    set IsVisible(val) {
      this._isVisible = val === 'true' || val === true;
      this.setAttribute('isvisible', val);
      if (this._hasRendered && this._root) {
        this._root.style.display = this._isVisible ? '' : 'none';
      }
    }

    get IsEnabled() {
      return this._isEnabled;
    }
    set IsEnabled(val) {
      this._isEnabled = val === 'true' || val === true;
      this.setAttribute('isenabled', val);
      if (this._hasRendered) this.updateOverlay();
    }

    get IsReadOnly() {
      return this._isReadOnly;
    }
    set IsReadOnly(val) {
      this._isReadOnly = val === 'true' || val === true;
      this.setAttribute('isreadonly', val);
      if (this._hasRendered) this.updateOverlay();
    }

    get ShowInformation() {
      return this._showInformation;
    }
    set ShowInformation(val) {
      this._showInformation = toBool(val, true);
      this.setAttribute('showinformation', this._showInformation);
      if (this._hasRendered) {
        this.updateShowInformationState();
      }
    }

    get Borderless() {
      return this._isBorderless;
    }
    set Borderless(val) {
      this._isBorderless = toBool(val, false);
      this.setAttribute('borderless', this._isBorderless);
      if (this._hasRendered) {
        this.updateBorderStyle();
      }
    }

    render() {
      if (this._hasRendered) return;
      
      // Get localized strings
      const culture = this._culture || dtDragDropDetectBrowserCulture();
      const localizedWatermark = this._watermark && this._watermark.trim() 
        ? this._watermark.trim() 
        : dtDragDropGetLocalizedString('watermark', culture);
      const localizedHelper = dtDragDropGetLocalizedString('previewHelper', culture);
      
      this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: block;
            width: 100%;
            font-family: var(--drag-drop-font-family, var(--main-font-family, "Poppins", "Open Sans Regular", Helvetica, sans-serif));
            color: var(--drag-drop-text-color, var(--file-upload-text-color, var(--normal-text-color, #1f2937)));
            --drag-drop-text-color: var(--file-upload-text-color, var(--normal-text-color, #1f2937));
            --drag-drop-text-muted: var(--file-upload-watermark-text-color, #6b7280);
            --drag-drop-border-color: var(--file-upload-border-color, #cbd5f5);
            --drag-drop-background: var(--file-upload-background-color, #f8fafc);
            --drag-drop-icon-color: var(--icon-base-color, #2563eb);
          }
          :host[dir="rtl"] {
            direction: rtl;
          }
          :host[dir="ltr"] {
            direction: ltr;
          }
          .preview-root {
            position: relative;
            width: 100%;
            height: 100%;
            min-height: inherit;
            border-radius: 12px;
            overflow: hidden;
            --icon-only-size: 140px;
          }
          .drop-zone {
            border: 2px dashed var(--drag-drop-border-color);
            border-radius: 12px;
            padding: 18px 20px;
            width: 100%;
            height: 100%;
            min-height: 70px;
            box-sizing: border-box;
            background: var(--drag-drop-background);
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: flex-start;
            gap: 16px;
            position: relative;
            flex-wrap: wrap;
          }
          .drop-icon {
            width: clamp(52px, 14vw, 80px);
            height: clamp(52px, 14vw, 80px);
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
          }
          .drop-icon svg {
            width: 100%;
            height: 100%;
            fill: none;
            stroke: var(--drag-drop-icon-color);
            stroke-width: 1.8;
          }
          .drop-copy {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 4px;
            flex: 1;
            min-width: 0;
            text-align: left;
          }
          :host[dir="rtl"] .drop-copy {
            text-align: right;
            align-items: flex-end;
          }
          .drop-copy .primary {
            font-weight: 600;
            font-size: 14px;
          }
          .drop-copy .secondary {
            font-size: 12px;
            color: var(--drag-drop-text-muted);
          }
          .state-overlay {
            position: absolute;
            inset: 0;
            border-radius: inherit;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.2s ease;
          }
          .preview-root.is-disabled .state-overlay {
            opacity: 1;
            background: rgba(248, 250, 252, 0.9);
          }
          .preview-root.is-readonly .state-overlay {
            opacity: 1;
            background: rgba(255, 255, 255, 0.6);
          }
          .preview-root.icon-only .drop-zone,
          .drop-zone.icon-only {
            width: 60px;
            min-width: 60px;
            max-width: 60px;
            min-height: 56px;
            padding: 10px 12px;
            gap: 0;
            border-radius: 10px;
            justify-content: flex-start;
          }
          .preview-root.icon-only .drop-copy,
          .drop-zone.icon-only .drop-copy {
            display: none;
          }
          .preview-root.icon-only .drop-icon,
          .drop-zone.icon-only .drop-icon {
            width: clamp(40px, 12vw, 56px);
            height: clamp(40px, 12vw, 56px);
          }
          .preview-root.icon-only .drop-icon .file-indicator,
          .drop-zone.icon-only .drop-icon .file-indicator {
            border: none;
            background: transparent;
            font-size: clamp(1.5rem, calc(var(--icon-only-size, 140px) * 0.25), 3rem);
            color: var(--drag-drop-icon-color);
          }
          .preview-root.borderless .drop-zone,
          .drop-zone.borderless {
            border: none;
            background: transparent;
          }
          .preview-root.compact-mode .drop-zone {
            padding: 14px 16px;
            gap: 10px;
            border-radius: 10px;
          }
          .preview-root.compact-mode .drop-icon {
            width: 44px;
            height: 44px;
          }
          .preview-root.compact-mode .drop-copy .primary {
            font-size: 13px;
          }
          .preview-root.compact-mode .drop-copy .secondary {
            font-size: 11px;
          }
          .preview-root.small-mode .drop-zone {
            padding: 8px 10px;
            gap: 6px;
            border-radius: 8px;
            min-height: 56px;
          }
          .preview-root.small-mode .drop-icon {
            width: 32px;
            height: 32px;
            min-width: 32px;
          }
          .preview-root.small-mode .drop-copy .primary {
            font-size: 12px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 100%;
          }
          .preview-root.small-mode .drop-copy .secondary {
            font-size: 10px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 100%;
          }
          .preview-root.narrow-mode .drop-zone {
            padding: 12px 10px;
          }
          .preview-root.narrow-mode .drop-copy .primary {
            font-size: 13px;
            word-break: break-word;
            white-space: normal;
          }
          .preview-root.narrow-mode .drop-copy .secondary {
            font-size: 11px;
            word-break: break-word;
            white-space: normal;
          }
        </style>
        <div class="preview-root">
          <div class="drop-zone">
            <div class="drop-icon" aria-hidden="true">
            <svg viewBox="0 0 64 64">
              <rect x="12" y="20" width="40" height="32" rx="6" />
              <path d="M20 24v-6a6 6 0 0 1 6-6h12a6 6 0 0 1 6 6v6" />
              <path d="M24 36l8-8 8 8" />
              <path d="M32 28v16" />
            </svg>
          </div>
            <div class="drop-copy">
              <span class="primary">${localizedWatermark}</span>
              <span class="secondary">${localizedHelper}</span>
            </div>
          </div>
          <div class="state-overlay" aria-hidden="true"></div>
        </div>
      `;

      this._root = this.shadowRoot.querySelector('.preview-root');
      this._dropZone = this.shadowRoot.querySelector('.drop-zone');
      this._watermarkText = this.shadowRoot.querySelector('.drop-copy .primary');
      this._helperText = this.shadowRoot.querySelector('.drop-copy .secondary');
      this._overlay = this.shadowRoot.querySelector('.state-overlay');

      this.Watermark = this._watermark;
      this.Width = this._width;
      this.Height = this._height;
      this.updateOverlay();
      this.updateShowInformationState();
      this.updateBorderStyle();
      this._hasRendered = true;
      this.applyResponsiveModes(this._root?.offsetWidth || 0, this._root?.offsetHeight || 0);
      this.setupResizeObserver();
    }

    updateOverlay() {
      if (!this._overlay) return;
      this._root?.classList.toggle('is-disabled', !this._isEnabled);
      this._root?.classList.toggle('is-readonly', this._isReadOnly);
      const overlayVisible = !this._isEnabled || this._isReadOnly;
      this._overlay.setAttribute('aria-hidden', overlayVisible ? 'false' : 'true');
    }

    updateShowInformationState() {
      if (!this._root) return;
      const iconOnly = !this._showInformation;
      this._root.classList.toggle('icon-only', iconOnly);
      this._dropZone?.classList.toggle('icon-only', iconOnly);
    }

    updateBorderStyle() {
      if (!this._root) return;
      this._root.classList.toggle('borderless', this._isBorderless);
      this._dropZone?.classList.toggle('borderless', this._isBorderless);
    }

    updateDimensions() {
      if (this._width) {
        this.style.width = toCssDimension(this._width);
      } else {
        this.style.width = '';
      }

      if (this._height) {
        this.style.height = toCssDimension(this._height);
        if (this._root) {
          this._root.style.minHeight = '100%';
        }
      } else {
        this.style.height = '';
        if (this._root) {
          this._root.style.minHeight = '';
        }
      }
    }

    applyResponsiveModes(width, height) {
      if (!this._root) return;
      this._root.classList.remove('compact-mode', 'small-mode', 'narrow-mode');

      if (height > 0 && height < 100) {
        this._root.classList.add('small-mode', 'compact-mode');
      } else if (height >= 100 && height <= 150) {
        this._root.classList.add('compact-mode');
      }

      if (width > 0 && width < 200) {
        this._root.classList.add('narrow-mode');
      }
    }

    setupResizeObserver() {
      if (!this._root || !window.ResizeObserver) return;

      if (this._resizeObserver) {
        this._resizeObserver.disconnect();
      }

      this._resizeObserver = new ResizeObserver(entries => {
        entries.forEach(entry => {
          const { width, height } = entry.contentRect;
          if (width > 0 && height > 0) {
            const iconSize = Math.min(Math.max(Math.min(width, height), 64), 400);
            this._root.style.setProperty('--icon-only-size', `${iconSize}px`);
          }
          this.applyResponsiveModes(width, height);
        });
      });

      this._resizeObserver.observe(this._root);
    }
  });
}
})();

