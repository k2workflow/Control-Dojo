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

const BUTTON_LIST_DEFAULT_HEIGHT = '55px';

// Designtime preview: must inherit from K2BaseControl
if (!window.customElements.get('button-list')) {
  window.customElements.define('button-list', class ButtonListControl extends K2BaseControl {
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
    _height = BUTTON_LIST_DEFAULT_HEIGHT;
    _isVisible = true;
    _isEnabled = true;
    _isReadOnly = false;
    _previewItems = [];
    _listConfig = { partmappings: {} };
    _dataItems = [];
    _initialListValue = '[{"display": "Item 1", "value": "1"},{"display": "Item 2","value": "2"}]';

    constructor() { 
      super();
      this._attributeWriteLock = new Set();
    }

    static get observedAttributes() {
      const baseAttributes = super.observedAttributes || [];
      return [
        ...baseAttributes,
        'value',
        'buttonlayout',
        'buttonsize',
        'buttonstyle',
        'buttonheight',
        'buttonwidth',
        'buttonradius',
        'buttonspacing',
        'iconposition',
        'imagesize',
        'imagefit',
        'contentalignment',
        'iconspacing',
        'width',
        'height',
        'isvisible',
        'isenabled',
        'isreadonly'
      ];
    }

    connectedCallback() {
      // Designer never executes SmartObject calls, so ensure fallback items exist before render
      this._ensureFallbackPreview();

      const buttonStyleAttr = this.getAttribute('buttonstyle');
      if (buttonStyleAttr !== null && buttonStyleAttr !== this._buttonStyle) {
        this._buttonStyle = buttonStyleAttr;
      }

      super.connectedCallback();
    }

    disconnectedCallback() {
      super.disconnectedCallback();
    }

    // K2 List API method - keep config in sync with runtime surface
    listConfigChangedCallback(config) {
      this._listConfig = config || { partmappings: {} };
      if (Array.isArray(this._dataItems) && this._dataItems.length > 0) {
        this._previewItems = this._mapItems(this._dataItems);
        this._refreshPreview();
      }
    }

    // K2 List API Method - called at design time with initial value data
    listItemsChangedCallback(itemsChangedEventArgs) {
      if (Array.isArray(itemsChangedEventArgs?.NewItems) && itemsChangedEventArgs.NewItems.length > 0) {
        this._dataItems = itemsChangedEventArgs.NewItems;
        this._previewItems = this._mapItems(this._dataItems);

        // Persist string version so the List property mirrors runtime
        try {
          this._list = JSON.stringify(itemsChangedEventArgs.NewItems);
        } catch (err) {
          console.warn('[Button List DESIGNTIME] Failed to serialize list items', err);
        }
        this._refreshPreview();
      } else {
        console.warn('[Button List DESIGNTIME] NewItems is empty - falling back to static list');
        this._useFallbackPreview();
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
      this._setAttributeSilently('buttonstyle', this._buttonStyle);
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
      const normalized = (val === undefined || val === null || val === '') ? BUTTON_LIST_DEFAULT_HEIGHT : String(val);
      this._height = normalized;
      if (this._hasRendered && this.container) {
        const v = (normalized === undefined || normalized === null || normalized === '') ? '' : (isNaN(normalized) ? String(normalized) : `${normalized}px`);
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
      this._setAttributeSilently('isreadonly', this._isReadOnly ? 'true' : 'false');
      if (this._hasRendered && this.container) {
        this.container.classList.toggle('is-readonly', this._isReadOnly);
      }
      safeRaisePropertyChanged(this, 'IsReadOnly');
    }

    onAttributeChanged(name, oldValue, newValue) {
      if (this._attributeWriteLock && this._attributeWriteLock.has(name)) {
        return;
      }
      switch (name) {
        case 'value':
          this.Value = newValue;
          break;
        case 'buttonlayout':
          this.ButtonLayout = newValue;
          break;
        case 'buttonsize':
          this.ButtonSize = newValue;
          break;
        case 'buttonstyle':
          this.ButtonStyle = newValue;
          break;
        case 'buttonheight':
          this.ButtonHeight = newValue;
          break;
        case 'buttonwidth':
          this.ButtonWidth = newValue;
          break;
        case 'buttonradius':
          this.ButtonRadius = newValue;
          break;
        case 'buttonspacing':
          this.ButtonSpacing = newValue;
          break;
        case 'iconposition':
          this.IconPosition = newValue;
          break;
        case 'imagesize':
          this.ImageSize = newValue;
          break;
        case 'imagefit':
          this.ImageFit = newValue;
          break;
        case 'contentalignment':
          this.ContentAlignment = newValue;
          break;
        case 'iconspacing':
          this.IconSpacing = newValue;
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
        default:
          super.onAttributeChanged(name, oldValue, newValue);
          break;
      }
    }

    // Parse static list data from initialvalue (JSON array)
    _parseStaticList() {
      this._previewItems = [];
      if (!this._list || typeof this._list !== 'string') {
        return;
      }

      const parsed = this._tryParseListString(this._list);
      if (parsed.length > 0) {
        this._dataItems = parsed;
        this._previewItems = this._mapItems(parsed);
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

    _render() {
      if (!this._shadow) {
        return;
      }

      this._ensureFallbackPreview();

      this._shadow.innerHTML = `
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
            position: relative;
            overflow: hidden;
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
            position: relative;
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

          /* Design-time overlay to indicate non-interactable - applied to each button */
          .button-item::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, rgba(248, 249, 250, 0.3) 0%, rgba(241, 245, 249, 0.2) 100%);
            pointer-events: none;
            border-radius: var(--button-radius, var(--button-rounding, var(--k2-radius)));
          }

          /* Disabled overlay applied to each button when container is disabled */
          .button-list-container.is-disabled .button-item::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: color-mix(in srgb, #f8f9fa 80%, transparent);
            pointer-events: none;
            border-radius: var(--button-radius, var(--button-rounding, var(--k2-radius)));
          }

          /* Readonly overlay applied to each button when container is readonly */
          .button-list-container.is-readonly .button-item::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: color-mix(in srgb, #f8f9fa 80%, transparent);
            pointer-events: none;
            border-radius: var(--button-radius, var(--button-rounding, var(--k2-radius)));
          }

          .button-list-wrapper {
            position: relative;
          }
        </style>
        <div class="button-list-container">
          <div class="button-list-wrapper button-layout-${this._buttonLayout}"></div>
        </div>
      `;

      this.container = this._shadow.querySelector('.button-list-container');
      this.wrapper = this._shadow.querySelector('.button-list-wrapper');

      this._applyContainerState();
      this._applyStyleTokens();

      this._hasRendered = true;
      this._updatePreview();
      this.dispatchEvent(new Event('Rendered'));

      super._render();
    }

    _applyContainerState() {
      if (!this.container) {
        return;
      }

      if (this._height) {
        this.container.style.height = isNaN(this._height) ? String(this._height) : `${this._height}px`;
      } else {
        this.container.style.removeProperty('height');
      }

      if (this._width) {
        this.container.style.width = isNaN(this._width) ? String(this._width) : `${this._width}px`;
      } else {
        this.container.style.removeProperty('width');
      }

      this.container.style.display = this._isVisible ? '' : 'none';
      this.container.classList.toggle('is-disabled', !this._isEnabled);
      this.container.classList.toggle('is-readonly', this._isReadOnly);
    }

    _applyStyleTokens() {
      if (!this.container) {
        return;
      }

      const applyOrRemove = (prop, value, target = this.container) => {
        if (!target) return;
        const styleTarget = typeof target.setProperty === 'function' ? target : target.style;
        if (!styleTarget) return;

        if (value && value.toString().trim().length > 0) {
          styleTarget.setProperty(prop, value);
        } else {
          styleTarget.removeProperty(prop);
        }
      };

      applyOrRemove('--button-height', this._buttonHeight);
      applyOrRemove('--button-width', this._buttonWidth);
      applyOrRemove('--button-radius', this._buttonRadius);
      applyOrRemove('--button-spacing', this._buttonSpacing, this.style);
      applyOrRemove('--image-size', this._imageSize, this.style);
      applyOrRemove('--image-fit', this._imageFit, this.style);
      applyOrRemove('--content-align', this._contentAlignment, this.style);
      applyOrRemove('--icon-spacing', this._iconSpacing, this.style);
    }

    _ensureFallbackPreview() {
      if (Array.isArray(this._previewItems) && this._previewItems.length > 0) {
        return;
      }
      this._useFallbackPreview();
    }

    _useFallbackPreview() {
      let fallbackItems = [];

      if (Array.isArray(this.FixedListItems) && this.FixedListItems.length > 0) {
        fallbackItems = this.FixedListItems;
      } else if (this._list && typeof this._list === 'string') {
        fallbackItems = this._tryParseListString(this._list);
      } else {
        const attrList = this.getAttribute('list');
        if (attrList) {
          fallbackItems = this._tryParseListString(attrList);
        }
      }

      if (!Array.isArray(fallbackItems) || fallbackItems.length === 0) {
        fallbackItems = this._tryParseListString(this._initialListValue);
      }

      this._dataItems = Array.isArray(fallbackItems) ? fallbackItems : [];
      this._previewItems = this._mapItems(this._dataItems);
      this._refreshPreview();
    }

    _refreshPreview() {
      if (this._hasRendered) {
        this._updatePreview();
      }
    }

    _tryParseListString(value) {
      if (!value) {
        return [];
      }
      if (Array.isArray(value)) {
        return value;
      }
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [];
      } catch (error) {
        console.error('[Button List DESIGNTIME] JSON parse error:', error);
        return [];
      }
    }

    _mapItems(items) {
      if (!Array.isArray(items)) {
        return [];
      }

      const displayProperty = this._listConfig?.partmappings?.Display || "display";
      const valueProperty = this._listConfig?.partmappings?.Value || "value";

      return items.map(item => {
        const value = item?.[valueProperty] ?? item?.value ?? item?.id ?? '';
        const display = this._resolveDisplayValue(item, displayProperty);
        const icon = item?.icon || item?.Icon || item?.imageUrl || null;

        return {
          display: display && display.toString().trim().length > 0 ? display : "[Empty]",
          value: value,
          icon: icon,
          rawData: item
        };
      });
    }

    _resolveDisplayValue(item, displayProperty) {
      if (!item) {
        return '';
      }

      if (displayProperty && typeof displayProperty === 'string' && displayProperty.startsWith('<Template>')) {
        return this.parseDisplayTemplate(displayProperty, item);
      }

      if (displayProperty && Object.prototype.hasOwnProperty.call(item, displayProperty)) {
        return item[displayProperty];
      }

      return item.display ?? item.text ?? item.name ?? '';
    }

    _updatePreview() {
      if (!this._hasRendered || !this.wrapper) {
        return;
      }

      const itemsToShow = this._applyMaxItems(this._previewItems);
      this.wrapper.innerHTML = '';

      if (!Array.isArray(itemsToShow) || itemsToShow.length === 0) {
        const empty = document.createElement('span');
        empty.className = 'button-empty-state';
        empty.textContent = 'Empty';
        this.wrapper.appendChild(empty);
        return;
      }

      itemsToShow.forEach(item => {
        const button = this._createPreviewButton(item);
        this.wrapper.appendChild(button);
      });
    }

    _applyMaxItems(items) {
      if (!Array.isArray(items)) {
        return [];
      }
      if (this._maxItems > 0 && items.length > this._maxItems) {
        return items.slice(0, this._maxItems);
      }
      return items;
    }

    _createPreviewButton(item) {
      const button = document.createElement('button');
      button.className = `button-item button-size-${this._buttonSize} button-style-${this._buttonStyle || 'normal'}`;
      button.setAttribute('type', 'button');
      button.setAttribute('data-value', item.value ?? '');
      button.disabled = true;

      const contentSpan = document.createElement('span');
      contentSpan.className = 'button-content';

      const iconPosition = this._iconPosition || 'left';
      const showImage = !!item.icon && iconPosition !== 'none';
      const showText = (item.display || item.value) && iconPosition !== 'only';

      if (iconPosition === 'top' || iconPosition === 'bottom') {
        contentSpan.style.flexDirection = 'column';
        const alignMap = {
          'start': 'flex-start',
          'center': 'center',
          'end': 'flex-end'
        };
        contentSpan.style.alignItems = alignMap[this._contentAlignment] || 'center';
      }

      const appendImage = () => {
        if (!showImage) return;
        const img = document.createElement('img');
        img.src = item.icon;
        img.alt = item.display || '';
        contentSpan.appendChild(img);
      };

      if (showImage && (iconPosition === 'left' || iconPosition === 'top')) {
        appendImage();
      }

      if (showText) {
        contentSpan.appendChild(document.createTextNode(item.display || item.value || ''));
      }

      if (showImage && (iconPosition === 'right' || iconPosition === 'bottom')) {
        appendImage();
      }

      button.appendChild(contentSpan);

      if (item.value == this._value) {
        button.classList.add('selected');
      }

      return button;
    }

    _setAttributeSilently(attrName, value) {
      if (!this._attributeWriteLock) {
        this._attributeWriteLock = new Set();
      }
      const normalized = value === null || value === undefined ? '' : String(value);
      const current = this.getAttribute(attrName);
      const normalizedCurrent = current === null ? '' : current;
      if (normalizedCurrent === normalized) {
        return;
      }
      this._attributeWriteLock.add(attrName);
      if (normalized === '') {
        this.removeAttribute(attrName);
      } else {
        this.setAttribute(attrName, normalized);
      }
      this._attributeWriteLock.delete(attrName);
    }
  });
}

