// Ensure a safe K2 namespace even when running outside K2 Designer
if (typeof window.K2 === "undefined") {
  window.K2 = {};
}

// RaisePropertyChanged wrapper
function safeRaisePropertyChanged(ctrl, prop) {
  if (window.K2?.RaisePropertyChanged) {
    K2.RaisePropertyChanged(ctrl, prop);
  }
}

// Fetches the control style template if K2 provides one, otherwise falls back
function safeGetControlStyleTemplate(ctrl) {
  if (window.K2?.GetControlStyleTemplate) {
    return K2.GetControlStyleTemplate(ctrl);
  }
  return ctrl.getDefaultTemplate();
}

// Designtime-only: simple static preview for the K2 designer canvas
if (!window.customElements.get('arabic-calendar')) {
  window.customElements.define('arabic-calendar', class ArabicCalendarControl extends HTMLElement {
  // Properties
  get Value() { return this._value; }
  set Value(val) {
    this._value = val;
    if (this._hasRendered) {
      this.input.val(val);
      if (val) this.container.classList.remove('empty');
      else this.container.classList.add('empty');
    }
  }

  get Watermark() { return this._watermark; }
  set Watermark(val) {
    this._watermark = val;
    if (this._hasRendered && this.watermarkSpan) {
      this.watermarkSpan.textContent = val;
      this.input[0].setAttribute("placeholder", val);
    }
  }


  get ControlStyle() { return this._style; }
  set ControlStyle(val) {
    this._style = val;
    this._hasRendered = false;
    this.render();
  }

  // Standard supports
  get Width() { return this._width; }
  set Width(val) {
    this._width = val;
    if (this._hasRendered && this.container) {
      const v = (val === undefined || val === null || val === '') ? '' : (isNaN(val) ? String(val) : `${val}px`);
      this.container.style.width = v;
    }
    safeRaisePropertyChanged(this, 'Width');
  }

  get IsVisible() { return this._isVisible; }
  set IsVisible(val) {
    this._isVisible = val === 'true' || val === true;
    this.setAttribute('isvisible', val);
    if (this._hasRendered && this.container) {
      this.container.style.display = this._isVisible ? '' : 'none';
    }
    safeRaisePropertyChanged(this, 'IsVisible');
  }

  get IsEnabled() { return this._isEnabled; }
  set IsEnabled(val) {
    this._isEnabled = val === 'true' || val === true;
    this.setAttribute('isenabled', val);
    if (this._hasRendered) {
      this.updateInteractivity();
    }
    safeRaisePropertyChanged(this, 'IsEnabled');
  }

  get IsReadOnly() { return this._isReadOnly; }
  set IsReadOnly(val) {
    this._isReadOnly = val === 'true' || val === true;
    this.setAttribute('isreadonly', val);
    if (this._hasRendered) {
      this.updateInteractivity();
    }
    safeRaisePropertyChanged(this, 'IsReadOnly');
  }

  // Simplified template for designtime preview only (no popup or interactivity)
  _TEMPLATE = `
      <div class="container empty">
        <div class="input-wrap">
          <input type="text" class="date-input" placeholder="اضغط الزر لاختيار التاريخ" readonly aria-haspopup="dialog" aria-expanded="false" aria-controls="k2-cal-popup"/>
          <span class="floating-watermark">اضغط الزر لاختيار التاريخ</span>
          <div class="icon-background"></div>
        </div>
        <svg class="calendar-icon" width="16" height="16" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="فتح التقويم" role="button" tabindex="0" aria-haspopup="dialog" aria-expanded="false" aria-controls="k2-cal-popup">
          <path class="calendar-body" d="M25.2 5.3H22c-0.5 0-0.9 0.4-0.9 0.9s0.4 0.9 0.9 0.9h3.2c1 0 1.8 0.8 1.8 1.7v1.3H3.9v-1.3c0-0.9 0.8-1.7 1.8-1.7H9.2c0.5 0 0.9-0.4 0.9-0.9s-0.4-0.9-0.9-0.9H5.7c-2 0-3.7 1.6-3.7 3.5v16.5c0 2 1.7 3.5 3.7 3.5h19.5c2 0 3.7-1.6 3.7-3.5V8.9c0-2-1.7-3.6-3.7-3.6z m0 21.7H5.7c-1 0-1.8-0.8-1.8-1.7V12.1h23.1v13.2c0 0.9-0.8 1.7-1.8 1.7z" fill="var(--icon-base-color, #4d4d4d)" />
          <path class="calendar-header" d="M14 6.8c-0.4-0.2-0.8-0.1-1.1 0.2-0.1-0.2-0.1-0.5-0.1-0.9 0-0.4 0.1-0.7 0.1-0.9 0.3 0.3 0.7 0.3 1.1 0.1 0.4-0.3 0.6-0.8 0.3-1.3-0.5-0.8-1.1-0.9-1.5-0.9-1.1 0-2 1.3-2 3.1s0.8 3.1 2 3.1c0.6 0 1.2-0.4 1.6-1.1 0.2-0.5 0-1-0.4-1.3zM19.9 6.8c-0.4-0.2-0.8-0.1-1.1 0.2-0.1-0.2-0.1-0.5-0.1-0.9 0-0.4 0.1-0.7 0.1-0.9 0.3 0.3 0.7 0.3 1.1 0.1 0.4-0.3 0.6-0.8 0.3-1.3-0.5-0.8-1.1-0.9-1.5-0.9-1.1 0-2 1.3-2 3.1s0.8 3.1 2 3.1c0.6 0 1.2-0.4 1.6-1.1 0.2-0.5 0-1-0.4-1.3z" fill="var(--icon-base-color, #4d4d4d)" />
          <path class="calendar-grid" d="M21.9 16.1H6.3c-0.5 0-0.9 0.4-0.9 0.9s0.4 0.9 0.9 0.9h15.6c0.5 0 0.9-0.4 0.9-0.9s-0.4-0.9-0.9-0.9zM20.9 21.6h-2.3c-0.5 0-0.9 0.4-0.9 0.9s0.4 0.9 0.9 0.9h2.3c0.5 0 0.9-0.4 0.9-0.9s-0.4-0.9-0.9-0.9zM15 21.6H6.3c-0.5 0-0.9 0.4-0.9 0.9s0.4 0.9 0.9 0.9H15c0.5 0 0.9-0.4 0.9-0.9s-0.4-0.9-0.9-0.9z" fill="var(--icon-accent-color, #00a3d3)" />
        </svg>
      </div>
    `;

  _value = "";
  _watermark = "اضغط الزر لاختيار التاريخ";  // Arabic: "Click the button to select a date"
  _style = "";
  _hasRendered = false;
  _isConnected = false;
  _width = "";
  _isVisible = true;
  _isEnabled = true;
  _isReadOnly = false;

  constructor() { super(); }

  connectedCallback() {
    this._isConnected = true;
    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
    }
    this.render();
  }

  disconnectedCallback() {
    // No cleanup needed for designtime
  }

  updateInteractivity() {
    if (!this.container) return;
    const interactive = this._isEnabled && !this._isReadOnly;
    this.container.style.pointerEvents = interactive ? '' : 'none';
    this.container.setAttribute('aria-disabled', interactive ? 'false' : 'true');
    this.container.classList.toggle('is-disabled', !this._isEnabled);
    this.container.classList.toggle('is-readonly', this._isReadOnly);
  }

  render() {
    if (this._hasRendered) return;

    // Render simple markup for preview with styles in Shadow DOM
    this.shadowRoot.innerHTML = `
      <style>
        /* Designtime Styles - Style Aware Encapsulated in Shadow DOM */
        :host {
          --k2-font: "Tajawal", "Cairo", "Noto Naskh Arabic", system-ui, -apple-system, "Segoe UI", Arial, sans-serif;
          --k2-text: #1f2937;
          --k2-muted: #6b7280;
          --k2-border: #e5e7eb;
          --k2-bg: #ffffff;
          --k2-bg-subtle: #f9fafb;
          --k2-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
          --k2-accent: var(--icon-accent-color, #00a3d3);
          --k2-base: var(--icon-base-color, #495660);
          --k2-secondary: var(--icon-base-secondary-color, #f0f0f1);
          --k2-attention: var(--icon-attention-color, #ff6b35);
          --k2-radius: 10px;
          --k2-gap: 10px;
          --k2-cell-size: 42px;
          --k2-transition: 180ms cubic-bezier(.2, .8, .2, 1);

          direction: rtl;
          display: block;
          width: 100%;
          color: var(--k2-text);
          font-family: var(--k2-font);
        }

        .container {
          position: relative;
          min-width: 220px;
          width: 100%;
        }

        .input-wrap {
          position: relative;
          display: grid;
        }

        .date-input {
          width: 100%;
          font-size: 13px;
          padding: 4px 8px 4px 24px; /* Space reserved for the SVG icon on the left - 26px height */
          border: none;
          border-bottom: 1px solid var(--input-border-color, var(--k2-border));
          border-radius: 0;
          background: rgba(255, 255, 255, 0.2);
          color: var(--input-text-color, var(--k2-text));
          outline: none;
          transition: border-bottom-color var(--k2-transition), border-bottom-width var(--k2-transition);
          font-family: var(--k2-font);
          height: 26px;
          box-sizing: border-box;
          cursor: default; /* Default cursor for designtime preview */
        }

        .date-input::placeholder {
          color: transparent;
        }


        .floating-watermark {
          pointer-events: none;
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--input-watermark-text-color, var(--k2-muted)) !important;
          font-size: 14px;
          transition: transform var(--k2-transition), color var(--k2-transition), opacity var(--k2-transition), background var(--k2-transition), box-shadow var(--k2-transition);
          opacity: 0.8;
        }

        .container:not(.empty) .floating-watermark {
          display: none;
        }

        .icon-background {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 24px;
          background: transparent;
          pointer-events: none;
          z-index: 0;
          transition: background var(--k2-transition);
        }

        .calendar-icon {
          width: 16px;
          height: 16px;
          display: block;
          cursor: default;
          transition: filter var(--k2-transition), transform var(--k2-transition);
          background: transparent;
          position: absolute;
          top: 50%;
          left: 4px;
          transform: translateY(-50%);
        }

        .calendar-icon:hover {
          /* No hover effects for designtime preview */
        }

        .calendar-icon:focus,
        .calendar-icon:focus-visible,
        .calendar-icon:active {
          outline: none;
          box-shadow: none;
        }

        /* Disabled State */
        .container.is-disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .container.is-disabled .date-input,
        .container.is-disabled .calendar-icon {
          cursor: not-allowed;
          opacity: 0.6;
        }

        /* Read-Only State */
        .container.is-readonly {
          position: relative;
        }

        .container.is-readonly::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: color-mix(in srgb, #f8f9fa 80%, transparent);
          pointer-events: none;
          border-radius: 0;
        }

        .container.is-readonly .date-input {
          background: #f8f9fa;
          color: #6c757d;
          cursor: default;
        }

        .container.is-readonly .calendar-icon .calendar-body,
        .container.is-readonly .calendar-icon .calendar-header {
          fill: #6c757d;
          opacity: 0.7;
        }

        .container.is-readonly .calendar-icon .calendar-grid {
          fill: #6c757d;
          opacity: 0.5;
        }

      </style>
      ${this._TEMPLATE}
    `;

    // Basic references for property updates
    this.container = this.shadowRoot.querySelector('.container');
    this.input = $(this.shadowRoot.querySelector('.date-input'));
    this.watermarkSpan = this.shadowRoot.querySelector('.floating-watermark');
    this.button = this.shadowRoot.querySelector('.calendar-icon');

    // Initial state
    this.Watermark = this._watermark;
    this.Width = this._width;
    this.IsVisible = this._isVisible;
    this.IsEnabled = this._isEnabled;
    this.IsReadOnly = this._isReadOnly;
    if (this._value) this.container.classList.remove('empty');
    else this.container.classList.add('empty');

    // No event handlers - this is designtime preview only
    this.input.val(this._value);

    this._hasRendered = true;
    this.dispatchEvent(new Event('Rendered'));
  }
});
}
