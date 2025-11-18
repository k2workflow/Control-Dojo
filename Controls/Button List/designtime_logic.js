// Ensure a safe K2 namespace even when running outside K2 Designer
if (typeof window.K2 === "undefined") {
  window.K2 = {};
}

// RaisePropertyChanged wrapper: logs in non-K2 contexts for easier debugging
function safeRaisePropertyChanged(ctrl, prop) {
  if (window.K2?.RaisePropertyChanged) {
    K2.RaisePropertyChanged(ctrl, prop);
  } else {
    console.log(`[button-list] Property changed: ${prop} =`, ctrl[prop]);
  }
}

// Designtime-only: simple static preview for the K2 designer canvas
if (!window.customElements.get('button-list')) {
  window.customElements.define('button-list', class ButtonListControl extends HTMLElement {
    // Fields
    _value = "";
    _list = "";
    _maxItems = 0;
    _buttonLayout = 'horizontal';
    _buttonSize = 'medium';
    _buttonStyle = 'normal';
    _buttonHeight = '';
    _buttonWidth = '';
    _buttonRadius = '6px';
    _buttonSpacing = '8px';
    _iconPosition = 'left';
    _imageSize = '20px';
    _imageFit = 'contain';
    _contentAlignment = 'center';
    _iconSpacing = '8px';
    _width = "";
    _height = "";
    _isVisible = true;
    _isEnabled = true;
    _isReadOnly = false;
    _hasRendered = false;
    _isConnected = false;
    _previewItems = [];

    constructor() { 
      super();
    }

    connectedCallback() {
      this._isConnected = true;
      
      // Read buttonstyle attribute if it exists (set by dojo as lowercase of ButtonStyle)
      const buttonStyleAttr = this.getAttribute('buttonstyle');
      if (buttonStyleAttr !== null && buttonStyleAttr !== this._buttonStyle) {
        this._buttonStyle = buttonStyleAttr;
      }
      
      if (!this.shadowRoot) {
        this.attachShadow({ mode: 'open' });
      }
      this.render();
    }

    disconnectedCallback() {
      // No cleanup needed for designtime
    }

    //K2 List API Method - called for listdata properties
    //Called at design time with initialvalue data
    listItemsChangedCallback(itemsChangedEventArgs) {
      if (Array.isArray(itemsChangedEventArgs?.NewItems)) {
        // Convert items array to JSON string for the List property
        const jsonString = JSON.stringify(itemsChangedEventArgs.NewItems);
        this.List = jsonString;
      } else {
        console.warn('[Button List DESIGNTIME] NewItems is not an array');
      }
    }

    // Properties
    get Value() { return this._value; }
    set Value(val) {
      this._value = val || "";
      if (this._hasRendered) {
        this._updatePreview();
      }
      safeRaisePropertyChanged(this, 'Value');
    }

    get List() { return this._list; }
    set List(val) {
      this._list = val || "";
      this._parseStaticList();
      if (this._hasRendered && this.wrapper) {
        this._updatePreview();
      }
      safeRaisePropertyChanged(this, 'List');
    }

    get MaxItems() { return this._maxItems; }
    set MaxItems(val) {
      this._maxItems = val === null || val === '' || val === undefined ? 0 : parseInt(val, 10);
      if (this._maxItems < 0) this._maxItems = 0;
      if (this._hasRendered) {
        this._updatePreview();
      }
      safeRaisePropertyChanged(this, 'MaxItems');
    }

    get ButtonLayout() { return this._buttonLayout; }
    set ButtonLayout(val) {
      this._buttonLayout = val || 'horizontal';
      if (this._hasRendered && this.wrapper) {
        this.wrapper.className = `button-list-wrapper button-layout-${this._buttonLayout}`;
      }
      safeRaisePropertyChanged(this, 'ButtonLayout');
    }

    get ButtonSize() { return this._buttonSize; }
    set ButtonSize(val) {
      this._buttonSize = val || 'medium';
      if (this._hasRendered) {
        this._updatePreview();
      }
      safeRaisePropertyChanged(this, 'ButtonSize');
    }

    get ButtonStyle() { return this._buttonStyle; }
    set ButtonStyle(val) {
      // Only default to 'normal' if val is null, undefined, or empty string
      // Preserve the value if it's explicitly set
      if (val === null || val === undefined || val === '') {
        this._buttonStyle = 'normal';
      } else {
        this._buttonStyle = String(val);
      }
      // The dojo will set this as 'buttonstyle' attribute (lowercase of ButtonStyle)
      this.setAttribute('buttonstyle', this._buttonStyle);
      if (this._hasRendered) {
        this._updatePreview();
      }
      safeRaisePropertyChanged(this, 'ButtonStyle');
    }

    get ButtonHeight() { return this._buttonHeight; }
    set ButtonHeight(val) {
      this._buttonHeight = val || '';
      if (this._hasRendered && this.container) {
        if (this._buttonHeight && this._buttonHeight.trim()) {
          this.container.style.setProperty('--button-height', this._buttonHeight);
        } else {
          this.container.style.removeProperty('--button-height');
        }
      }
      safeRaisePropertyChanged(this, 'ButtonHeight');
    }

    get ButtonWidth() { return this._buttonWidth; }
    set ButtonWidth(val) {
      this._buttonWidth = val || '';
      if (this._hasRendered && this.container) {
        if (this._buttonWidth && this._buttonWidth.trim()) {
          this.container.style.setProperty('--button-width', this._buttonWidth);
        } else {
          this.container.style.removeProperty('--button-width');
        }
      }
      safeRaisePropertyChanged(this, 'ButtonWidth');
    }

    get ButtonRadius() { return this._buttonRadius; }
    set ButtonRadius(val) {
      this._buttonRadius = val || '6px';
      if (this._hasRendered && this.container) {
        this.container.style.setProperty('--button-radius', this._buttonRadius);
      }
      safeRaisePropertyChanged(this, 'ButtonRadius');
    }

    get ButtonSpacing() { return this._buttonSpacing; }
    set ButtonSpacing(val) {
      this._buttonSpacing = val || '8px';
      if (this._hasRendered && this.shadowRoot) {
        // Set the custom property on :host element in shadow DOM
        this.style.setProperty('--button-spacing', this._buttonSpacing);
      }
      safeRaisePropertyChanged(this, 'ButtonSpacing');
    }

    get IconPosition() { return this._iconPosition; }
    set IconPosition(val) {
      this._iconPosition = val || 'left';
      if (this._hasRendered) {
        this._updatePreview();
      }
      safeRaisePropertyChanged(this, 'IconPosition');
    }

    get ImageSize() { return this._imageSize; }
    set ImageSize(val) {
      this._imageSize = val || '20px';
      if (this._hasRendered && this.shadowRoot) {
        this.style.setProperty('--image-size', this._imageSize);
      }
      safeRaisePropertyChanged(this, 'ImageSize');
    }

    get ImageFit() { return this._imageFit; }
    set ImageFit(val) {
      this._imageFit = val || 'contain';
      if (this._hasRendered && this.shadowRoot) {
        this.style.setProperty('--image-fit', this._imageFit);
      }
      safeRaisePropertyChanged(this, 'ImageFit');
    }

    get ContentAlignment() { return this._contentAlignment; }
    set ContentAlignment(val) {
      this._contentAlignment = val || 'center';
      if (this._hasRendered && this.shadowRoot) {
        this.style.setProperty('--content-align', this._contentAlignment);
      }
      safeRaisePropertyChanged(this, 'ContentAlignment');
    }

    get IconSpacing() { return this._iconSpacing; }
    set IconSpacing(val) {
      this._iconSpacing = val || '8px';
      if (this._hasRendered && this.shadowRoot) {
        this.style.setProperty('--icon-spacing', this._iconSpacing);
      }
      safeRaisePropertyChanged(this, 'IconSpacing');
    }

    get Width() { return this._width; }
    set Width(val) {
      this._width = val;
      if (this._hasRendered && this.container) {
        const v = (val === undefined || val === null || val === '') ? '' : (isNaN(val) ? String(val) : `${val}px`);
        this.container.style.width = v;
      }
      safeRaisePropertyChanged(this, 'Width');
    }

    get Height() { return this._height; }
    set Height(val) {
      this._height = val;
      if (this._hasRendered && this.container) {
        const v = (val === undefined || val === null || val === '') ? '' : (isNaN(val) ? String(val) : `${val}px`);
        this.container.style.height = v;
      }
      safeRaisePropertyChanged(this, 'Height');
    }

    get IsVisible() { return this._isVisible; }
    set IsVisible(val) {
      this._isVisible = val === 'true' || val === true;
      if (this._hasRendered && this.container) {
        this.container.style.display = this._isVisible ? '' : 'none';
      }
      safeRaisePropertyChanged(this, 'IsVisible');
    }

    get IsEnabled() { return this._isEnabled; }
    set IsEnabled(val) {
      this._isEnabled = val === 'true' || val === true;
      if (this._hasRendered && this.container) {
        this.container.classList.toggle('is-disabled', !this._isEnabled);
      }
      safeRaisePropertyChanged(this, 'IsEnabled');
    }

    get IsReadOnly() { return this._isReadOnly; }
    set IsReadOnly(val) {
      // Explicitly default to false if not explicitly set to true
      this._isReadOnly = val === 'true' || val === true;
      this.setAttribute('isreadonly', this._isReadOnly ? 'true' : 'false');
      if (this._hasRendered && this.container) {
        this.container.classList.toggle('is-readonly', this._isReadOnly);
      }
      safeRaisePropertyChanged(this, 'IsReadOnly');
    }

    // Parse static list data from initialvalue (JSON array)
    _parseStaticList() {
      this._previewItems = [];
      if (!this._list || typeof this._list !== 'string') {
        return;
      }

      try {
        const parsed = JSON.parse(this._list);
        if (Array.isArray(parsed)) {
          this._previewItems = parsed;
        } else {
          console.warn('[Button List DESIGNTIME] Parsed JSON is not an array');
        }
      } catch (e) {
        console.error('[Button List DESIGNTIME] JSON parse error:', e);
        console.error('[Button List DESIGNTIME] Invalid JSON string:', this._list);
      }
    }

    _updatePreview() {
      if (!this._hasRendered || !this.wrapper) {
        console.warn('[Button List DESIGNTIME] _updatePreview() skipping - not rendered or wrapper missing');
        return;
      }

      // Apply MaxItems limit
      let itemsToShow = this._previewItems;
      if (this._maxItems > 0 && itemsToShow.length > this._maxItems) {
        itemsToShow = itemsToShow.slice(0, this._maxItems);
      }

      // Clear and rebuild buttons
      this.wrapper.innerHTML = '';

      itemsToShow.forEach((item, index) => {
        const button = document.createElement('button');
        button.className = `button-item button-size-${this._buttonSize} button-style-${this._buttonStyle || 'normal'}`;
        button.setAttribute('type', 'button');
        button.disabled = true; // Designtime preview is not interactive

        // Create content container
        const contentSpan = document.createElement('span');
        contentSpan.className = 'button-content';

        // Get IconPosition property (default to 'left' if not set)
        const iconPosition = this._iconPosition || 'left';

        // Determine what to render based on IconPosition
        const showImage = item.icon && iconPosition !== 'none';
        const showText = (item.display || item.value) && iconPosition !== 'only';

        // Build content in correct order based on position
        if (showImage && (iconPosition === 'left' || iconPosition === 'top')) {
          const img = document.createElement('img');
          img.src = item.icon;
          img.alt = item.display || '';
          contentSpan.appendChild(img);
        }

        if (showText) {
          const textNode = document.createTextNode(item.display || item.value || '');
          contentSpan.appendChild(textNode);
        }

        if (showImage && (iconPosition === 'right' || iconPosition === 'bottom')) {
          const img = document.createElement('img');
          img.src = item.icon;
          img.alt = item.display || '';
          contentSpan.appendChild(img);
        }

        // Apply flex direction for top/bottom positioning
        if (iconPosition === 'top' || iconPosition === 'bottom') {
          contentSpan.style.flexDirection = 'column';
          const alignMap = {
            'start': 'flex-start',
            'center': 'center',
            'end': 'flex-end'
          };
          contentSpan.style.alignItems = alignMap[this._contentAlignment] || 'center';
        }

        button.appendChild(contentSpan);

        // Mark as selected if value matches
        if (item.value == this._value) {
          button.classList.add('selected');
        }

        this.wrapper.appendChild(button);
      });
    }

    render() {
      if (this._hasRendered) {
        return;
      }

      // Parse initial list data
      this._parseStaticList();

      // Render with Shadow DOM
      this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: block;
            width: 100%;
            --k2-accent: var(--icon-accent-color, #1495ff);
            --k2-base: var(--icon-base-color, #495660);
            --k2-secondary: var(--icon-base-secondary-color, #f0f0f1);
            --k2-border: #e5e7eb;
            --k2-text: #1f2937;
            --k2-radius: 6px;
            --k2-transition: 180ms cubic-bezier(0.2, 0.8, 0.2, 1);
            --button-spacing: 8px;
          }

          .button-list-container {
            display: block;
            width: 100%;
            padding: 8px;
            box-sizing: border-box;
          }

          .button-list-wrapper {
            display: flex;
            gap: var(--button-spacing, 8px);
          }

          .button-list-wrapper.button-layout-horizontal {
            flex-direction: row;
            flex-wrap: wrap;
          }

          .button-list-wrapper.button-layout-vertical {
            flex-direction: column;
          }

          .button-list-wrapper.button-layout-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          }

          .button-list-wrapper.button-layout-grid .button-item {
            width: 100%;
            max-width: 100%;
            min-width: 0;
          }

          .button-list-wrapper.button-layout-grid .button-content {
            min-width: 0;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .button-item {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 10px 16px;
            border-radius: var(--button-radius, var(--button-rounding, var(--k2-radius)));
            cursor: default;
            transition: all var(--k2-transition);
            font-size: 14px;
            font-family: var(--button-font-family, inherit);
            text-align: center;
            min-height: var(--button-height, 40px);
            height: var(--button-height, auto);
            min-width: fit-content;
            width: var(--button-width, auto);
            box-sizing: border-box;
            pointer-events: none;
            flex-shrink: 0;
          }
          .button-item.button-style-normal {
            background: var(--button-background-color, #949494);
            border-color: var(--button-border-color, #949494);
            color: var(--button-text-color, white);
            border: 1px solid var(--button-border-color, #949494);
          }
          .button-item.button-style-main {
            background: var(--primary-button-background-color, #0087bd);
            border-color: var(--primary-button-border-color, #0087bd);
            color: var(--primary-button-text-color, #f4f9fb);
            border: 1px solid var(--primary-button-border-color, #0087bd);
          }
          .button-item.button-style-quiet {
            background: var(--quiet-button-background-color, transparent);
            border-color: var(--quiet-button-border-color, #616161);
            color: var(--quiet-button-text-color, #616161);
            border: 1px solid var(--quiet-button-border-color, #616161);
          }
          .button-item.button-style-destructive {
            background-color: var(--destructive-button-background-color, #b71c1c);
            border-color: var(--destructive-button-border-color, #b71c1c);
            color: var(--destructive-button-text-color, white);
            border: 1px solid var(--destructive-button-border-color, #b71c1c);
          }
          .button-item.button-style-normal.selected {
            background: var(--button-hover-background-color, #aeaeae);
            border-color: var(--button-hover-border-color, #aeaeae);
            color: var(--button-hover-text-color, white);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          }
          .button-item.button-style-main.selected {
            background: var(--primary-button-hover-background-color, #00abf0);
            border-color: var(--primary-button-hover-border-color, #00abf0);
            color: var(--primary-button-hover-text-color, #f4f9fb);
            box-shadow: 0 2px 8px rgba(20, 149, 255, 0.3);
          }
          .button-item.button-style-quiet.selected {
            background: var(--quiet-button-hover-background-color, rgba(97, 97, 97, 0.2));
            border-color: var(--quiet-button-hover-border-color, #616161);
            color: var(--quiet-button-hover-text-color, #616161);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          }
          .button-item.button-style-destructive.selected {
            background-color: var(--destructive-button-hover-background-color, #e03939);
            border-color: var(--destructive-button-hover-border-color, #e03939);
            color: var(--destructive-button-hover-text-color, white);
            box-shadow: 0 2px 8px rgba(220, 38, 38, 0.3);
          }

          .button-item.button-size-small {
            padding: 6px 12px;
            font-size: 12px;
            min-height: 32px;
          }

          .button-item.button-size-medium {
            padding: 10px 16px;
            font-size: 14px;
            min-height: 40px;
          }

          .button-item.button-size-large {
            padding: 14px 20px;
            font-size: 16px;
            min-height: 48px;
          }

          .button-content {
            display: inline-flex;
            align-items: center;
            justify-content: var(--content-align, center);
            gap: var(--icon-spacing, 8px);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .button-content img {
            width: var(--image-size, 20px);
            height: var(--image-size, 20px);
            max-width: 100%;
            max-height: 100%;
            object-fit: var(--image-fit, contain);
            object-position: center;
            display: block;
            flex-shrink: 0;
          }

          .button-list-container.is-disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }

          .button-list-container.is-readonly {
            position: relative;
          }

          .button-list-container.is-readonly::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: color-mix(in srgb, #f8f9fa 80%, transparent);
            pointer-events: none;
            border-radius: var(--k2-radius);
          }
        </style>
        <div class="button-list-container">
          <div class="button-list-wrapper button-layout-${this._buttonLayout}"></div>
        </div>
      `;

      // Get references
      this.container = this.shadowRoot.querySelector('.button-list-container');
      this.wrapper = this.shadowRoot.querySelector('.button-list-wrapper');

      // Apply initial property values
      if (this._height && this.container) {
        this.container.style.height = isNaN(this._height) ? String(this._height) : `${this._height}px`;
      }
      if (this._width && this.container) {
        this.container.style.width = isNaN(this._width) ? String(this._width) : `${this._width}px`;
      }
      if (this.container) {
        this.container.style.display = this._isVisible ? '' : 'none';
        this.container.classList.toggle('is-disabled', !this._isEnabled);
        this.container.classList.toggle('is-readonly', this._isReadOnly);
      }

      // Set CSS custom properties
      this.ButtonHeight = this._buttonHeight;
      this.ButtonWidth = this._buttonWidth;
      this.ButtonRadius = this._buttonRadius;
      this.ButtonSpacing = this._buttonSpacing;

      // Set _hasRendered BEFORE calling _updatePreview so it can render buttons
      this._hasRendered = true;
      
      // Render preview buttons
      this._updatePreview();
      this.dispatchEvent(new Event('Rendered'));
    }
  });
}

