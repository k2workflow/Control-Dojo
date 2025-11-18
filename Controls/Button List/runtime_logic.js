// Ensure a safe K2 namespace even when running outside K2 runtime
if (typeof window.K2 === "undefined") {
  window.K2 = {};
}

// Safe wrapper for RaisePropertyChanged
function safeRaisePropertyChanged(ctrl, prop) {
  if (window.K2?.RaisePropertyChanged) {
    K2.RaisePropertyChanged(ctrl, prop);
  } else {
    console.log(`[button-list] Property changed: ${prop} =`, ctrl[prop]);
  }
}

// Runtime control: full interactivity with K2 List API support
if (!window.customElements.get('button-list')) {
  window.customElements.define('button-list', class K2ButtonListControl extends K2BaseControl {

    //#region Fields

    _name = "";
    _listConfig = { partmappings: {} };
    _dataItems = [];
    _items = [];
    _selectedItem = null;
    _selectedValue = null;
    
    // Fallback initial value for design-time preview (from manifest)
    _initialListValue = '[{"display": "Item 1", "value": "1"},{"display": "Item 2","value": "2"}]';

    // Standard properties
    _isVisible = true;
    _isEnabled = true;
    _isReadOnly = false;
    _height = null;
    _width = null;

    // Button list specific properties
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
    _isRendering = false;

    //#endregion Fields

    //#region Properties

    get Value() {
      return this._selectedValue;
    }

    set Value(v) {
      const oldValue = this._selectedValue;
      var newlySelectedItem = this._items.find(function (item) { return item.value == v });
      if (!!newlySelectedItem) {
        this.setSelectedItem(newlySelectedItem);
      } else {
        this._selectedItem = null;
        this._selectedValue = null;
        this.setAttribute('value', '');
        if (this._hasRendered) {
          safeRaisePropertyChanged(this, 'Value');
        }
        if (oldValue !== this._selectedValue) {
          this._fireChangedEvent(this._selectedValue, oldValue);
        }
      }
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
      // Explicitly default to false if not explicitly set to true
      this._isReadOnly = val === 'true' || val === true;
      this.setAttribute('isreadonly', this._isReadOnly ? 'true' : 'false');
      if (this._hasRendered) {
        this.updateInteractivity();
      }
      safeRaisePropertyChanged(this, 'IsReadOnly');
    }

    get MaxItems() { return this._maxItems; }
    set MaxItems(val) {
      this._maxItems = val === null || val === '' || val === undefined ? 0 : parseInt(val, 10);
      if (this._maxItems < 0) this._maxItems = 0;
      this.setAttribute('maxitems', this._maxItems);
      if (this._hasRendered) {
        this._setItems(this._dataItems);
      }
      safeRaisePropertyChanged(this, 'MaxItems');
    }

    get ButtonLayout() { return this._buttonLayout; }
    set ButtonLayout(val) {
      this._buttonLayout = val || 'horizontal';
      this.setAttribute('buttonlayout', this._buttonLayout);
      if (this._hasRendered && this.wrapper) {
        this.wrapper.className = `button-list-wrapper button-layout-${this._buttonLayout}`;
      }
      safeRaisePropertyChanged(this, 'ButtonLayout');
    }

    get ButtonSize() { return this._buttonSize; }
    set ButtonSize(val) {
      this._buttonSize = val || 'medium';
      this.setAttribute('buttonsize', this._buttonSize);
      if (this._hasRendered && !this._isRendering) {
        this._renderButtons();
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
      if (this._hasRendered && !this._isRendering) {
        this._renderButtons();
      }
      safeRaisePropertyChanged(this, 'ButtonStyle');
    }

    get ButtonHeight() { return this._buttonHeight; }
    set ButtonHeight(val) {
      this._buttonHeight = val || '';
      this.setAttribute('buttonheight', this._buttonHeight);
      this._updateButtonStyles();
      safeRaisePropertyChanged(this, 'ButtonHeight');
    }

    get ButtonWidth() { return this._buttonWidth; }
    set ButtonWidth(val) {
      this._buttonWidth = val || '';
      this.setAttribute('buttonwidth', this._buttonWidth);
      this._updateButtonStyles();
      safeRaisePropertyChanged(this, 'ButtonWidth');
    }

    get ButtonRadius() { return this._buttonRadius; }
    set ButtonRadius(val) {
      this._buttonRadius = val || '6px';
      this.setAttribute('buttonradius', this._buttonRadius);
      this._updateButtonStyles();
      safeRaisePropertyChanged(this, 'ButtonRadius');
    }

    get ButtonSpacing() { return this._buttonSpacing; }
    set ButtonSpacing(val) {
      this._buttonSpacing = val || '8px';
      this.setAttribute('buttonspacing', this._buttonSpacing);
      this._updateButtonStyles();
      safeRaisePropertyChanged(this, 'ButtonSpacing');
    }

    get IconPosition() { return this._iconPosition; }
    set IconPosition(val) {
      this._iconPosition = val || 'left';
      this.setAttribute('iconposition', this._iconPosition);
      if (this._hasRendered && !this._isRendering) {
        this._renderButtons();
      }
      safeRaisePropertyChanged(this, 'IconPosition');
    }

    get ImageSize() { return this._imageSize; }
    set ImageSize(val) {
      this._imageSize = val || '20px';
      this.setAttribute('imagesize', this._imageSize);
      this._updateButtonStyles();
      safeRaisePropertyChanged(this, 'ImageSize');
    }

    get ImageFit() { return this._imageFit; }
    set ImageFit(val) {
      this._imageFit = val || 'contain';
      this.setAttribute('imagefit', this._imageFit);
      this._updateButtonStyles();
      safeRaisePropertyChanged(this, 'ImageFit');
    }

    get ContentAlignment() { return this._contentAlignment; }
    set ContentAlignment(val) {
      this._contentAlignment = val || 'center';
      this.setAttribute('contentalignment', this._contentAlignment);
      this._updateButtonStyles();
      safeRaisePropertyChanged(this, 'ContentAlignment');
    }

    get IconSpacing() { return this._iconSpacing; }
    set IconSpacing(val) {
      this._iconSpacing = val || '8px';
      this.setAttribute('iconspacing', this._iconSpacing);
      this._updateButtonStyles();
      safeRaisePropertyChanged(this, 'IconSpacing');
    }

    //#endregion Properties

    //#region Constructor

    constructor() {
      super();

      this._listConfig = { partmappings: {} };
      this._dataItems = [];
      this._items = [];
      this._selectedItem = null;
      this._selectedValue = null;

      this._isVisible = true;
      this._isEnabled = true;
      this._isReadOnly = false;
      this._height = null;
      this._width = null;

      this._maxItems = 0;
      this._buttonLayout = 'horizontal';
      this._buttonSize = 'medium';
      this._buttonStyle = 'normal';
      this._buttonHeight = '';
      this._buttonWidth = '';
      this._buttonRadius = '6px';
      this._buttonSpacing = '8px';
      this._iconPosition = 'left';
      this._imageSize = '20px';
      this._imageFit = 'contain';
      this._contentAlignment = 'center';
      this._iconSpacing = '8px';
      this._isRendering = false;
    }

    //#endregion Constructor

    //#region Events

    onChanged(callback) {
      this._onChangedCallback = callback;
    }

    _fireChangedEvent(newValue, oldValue) {
      if (typeof this._onChangedCallback === 'function') {
        try {
          this._onChangedCallback({
            value: newValue,
            oldValue: oldValue,
            selectedItem: this._selectedItem
          });
        } catch (error) {
          console.error('Error in onChanged callback:', error);
        }
      }

      this.dispatchEvent(new CustomEvent("OnChanged", {
        detail: {
          value: newValue,
          oldValue: oldValue,
          selectedItem: this._selectedItem
        },
        bubbles: true
      }));
    }

    attachEventListeners() {
      super.attachEventListeners();
    }

    updateInteractivity() {
      if (!this.container) return;
      const interactive = this._isEnabled && !this._isReadOnly;
      this.container.style.pointerEvents = interactive ? '' : 'none';
      this.container.setAttribute('aria-disabled', interactive ? 'false' : 'true');
      this.container.classList.toggle('is-disabled', !this._isEnabled);
      this.container.classList.toggle('is-readonly', this._isReadOnly);
    }

    //#endregion Events

    //#region Methods

    get observedAttributes() {
      const baseAttributes = super.observedAttributes || [];
      return [...baseAttributes, 'height', 'width', 'selecteditem', 'value', 'isvisible', 'isenabled', 'isreadonly',
        'maxitems', 'buttonlayout', 'buttonsize', 'buttonstyle', 'buttonheight', 'buttonwidth', 'buttonradius', 'buttonspacing',
        'iconposition', 'imagesize', 'imagefit', 'contentalignment', 'iconspacing'];
    }

    onControlStyleChanged(oldValue, newValue) {
      super.onControlStyleChanged(oldValue, newValue);
    }

    //K2 List API method
    listConfigChangedCallback(config, listname) {
      this._listConfig = config;
      this._setItems(this._dataItems);
    }

    //K2 List API Method
    listItemsChangedCallback(itemsChangedEventArgs) {
      const isDesignTime = window.K2?.IsDesigner === true;
      let itemsToProcess = itemsChangedEventArgs.NewItems;

      // Fallback: If at design time and we receive 0 items, use initial value
      if (isDesignTime && (!Array.isArray(itemsToProcess) || itemsToProcess.length === 0)) {
        try {
          const fallbackItems = JSON.parse(this._initialListValue);
          if (Array.isArray(fallbackItems) && fallbackItems.length > 0) {
            itemsToProcess = fallbackItems;
          } else {
            console.warn('[Button List] Fallback initial value is empty or invalid');
          }
        } catch (error) {
          console.error('[Button List] Error parsing fallback initial value:', error);
        }
      }

      if (Array.isArray(itemsToProcess)) {
        this._dataItems = itemsToProcess;
        this._setItems(this._dataItems);
      } else {
        console.warn('[Button List] NewItems is not an array:', itemsChangedEventArgs.NewItems);
      }
    }

    _setItems(items) {
      this._items = [];
      if (Array.isArray(items)) {
        let itemsToProcess = items;
        if (this._maxItems > 0 && items.length > this._maxItems) {
          itemsToProcess = items.slice(0, this._maxItems);
        }

        var displayproperty = "display";
        var valueproperty = "value";

        if (!!this._listConfig && !!this._listConfig.partmappings) {
          displayproperty = this._listConfig.partmappings["Display"] || "display";
          valueproperty = this._listConfig.partmappings["Value"] || "value";
        }

        var defaultItem = null;

        for (var i = 0; i < itemsToProcess.length; i++) {
          var item = itemsToProcess[i];
          var value = item[valueproperty];
          var displayValue = item[displayproperty];
          var isDefault = item["isDefault"] === true || item["isDefault"] === "true";

          var text = displayValue ? String(displayValue) : null;
          var imageUrl = null;
          var parsedCollectionData = null;

          if (displayproperty && typeof displayproperty === 'string' && displayproperty.startsWith('<Template>')) {
            // XML template - parse it
            text = this.parseDisplayTemplate(displayproperty, item);
            
            // Check if the parsed text contains XML collection (could be mixed with text)
            if (text && typeof text === 'string' && text.includes('<collection>')) {
              // Extract image from mixed content (handles: <collection>...</collection> text)
              const extracted = this._extractImageFromMixedContent(text);
              if (extracted.imageUrl) {
                imageUrl = extracted.imageUrl;
              }
              
              // Use cleaned text (XML removed, only text remains)
              if (extracted.cleanedText && extracted.cleanedText.trim()) {
                text = extracted.cleanedText;
              } else {
                // If no text remains after cleaning, try to get filename from parsed collection
                // Find the first collection block to extract filename
                const collectionPattern = /<collection>[\s\S]*?<\/collection>/i;
                const collectionMatch = text.match(collectionPattern);
                if (collectionMatch) {
                  parsedCollectionData = this._parseK2Collection(collectionMatch[0]);
                  if (parsedCollectionData && parsedCollectionData.fileName) {
                    text = parsedCollectionData.fileName;
                  }
                }
              }
            }
          } else {
            // Not a template - check if displayValue contains XML collection (could be mixed)
            if (displayValue && typeof displayValue === 'string' && displayValue.includes('<collection>')) {
              // Extract image from mixed content
              const extracted = this._extractImageFromMixedContent(displayValue);
              if (extracted.imageUrl) {
                imageUrl = extracted.imageUrl;
              }
              
              // Use cleaned text or filename
              if (extracted.cleanedText && extracted.cleanedText.trim()) {
                text = extracted.cleanedText;
              } else {
                // Fallback to parsing as pure XML collection
                parsedCollectionData = this._parseK2Collection(displayValue);
                if (parsedCollectionData) {
                  if (parsedCollectionData.imageUrl) {
                    imageUrl = parsedCollectionData.imageUrl;
                  }
                  if (parsedCollectionData.fileName) {
                    text = parsedCollectionData.fileName;
                  }
                }
              }
            }
          }

          // Also check for direct icon property (for backwards compatibility)
          if (!imageUrl && item.icon) {
            imageUrl = this._resolveImageUrl(item.icon);
          }

          // If text is empty or just XML, try to find alternative text from raw data
          if ((!text || text.trim().startsWith('<collection>')) && item) {
            // Try common display name fields
            if (item.Display_Name) {
              text = item.Display_Name;
            } else if (item.display) {
              text = item.display;
            } else if (item.name) {
              text = item.name;
            }
          }

          // Clean up text - remove XML if it somehow got through
          if (text && typeof text === 'string' && text.trim().startsWith('<collection>')) {
            // If we still have XML and no filename was extracted, use a default
            text = 'Image';
          }

          var itemData = {
            text: text,
            value: value,
            imageUrl: imageUrl,
            selected: (this._selectedValue === value),
            rawData: item
          };

          this._items.push(itemData);

          // Track default item for initial selection
          if (isDefault && !defaultItem) {
            defaultItem = itemData;
          }
        }

        // Set initial selection based on isDefault if no value is already set
        if (!this._selectedValue && defaultItem) {
          this.setSelectedItem(defaultItem);
        }
      } else {
        console.warn('[Button List] _setItems: items is not an array');
      }

      // If not rendered yet, ensure render happens (items might arrive before render)
      if (!this._hasRendered) {
        // Render will be called in connectedCallback or when needed
        if (this.isConnected) {
          this._render();
        }
      } else if (!this._isRendering) {
        this._renderButtons();
      }
      return true;
    }

    onAttributeChanged(name, oldValue, newValue) {
      switch (name) {
        case "selecteditem":
          this.SelectedItem = newValue;
          break;
        case "value":
          this.Value = newValue;
          break;
        case "height":
          this.Height = newValue;
          break;
        case "width":
          this.Width = newValue;
          break;
        case "isvisible":
          this.IsVisible = newValue;
          break;
        case "isenabled":
          this.IsEnabled = newValue;
          break;
        case "isreadonly":
          this.IsReadOnly = newValue;
          break;
        case "maxitems":
          this.MaxItems = newValue;
          break;
        case "buttonlayout":
          this.ButtonLayout = newValue;
          break;
        case "buttonsize":
          this.ButtonSize = newValue;
          break;
        case "buttonstyle":
          this.ButtonStyle = newValue;
          break;
        case "buttonheight":
          this.ButtonHeight = newValue;
          break;
        case "buttonwidth":
          this.ButtonWidth = newValue;
          break;
        case "buttonradius":
          this.ButtonRadius = newValue;
          break;
        case "buttonspacing":
          this.ButtonSpacing = newValue;
          break;
        case "iconposition":
          this.IconPosition = newValue;
          break;
        case "imagesize":
          this.ImageSize = newValue;
          break;
        case "imagefit":
          this.ImageFit = newValue;
          break;
        case "contentalignment":
          this.ContentAlignment = newValue;
          break;
        case "iconspacing":
          this.IconSpacing = newValue;
          break;
        default:
          super.onAttributeChanged(name, oldValue, newValue);
          break;
      }
    }

    disconnectedCallback() {
      super.disconnectedCallback();
    }

    connectedCallback() {
      super.connectedCallback();
      
      // Read buttonstyle attribute if it exists (set by dojo as lowercase of ButtonStyle)
      const buttonStyleAttr = this.getAttribute('buttonstyle');
      if (buttonStyleAttr !== null && buttonStyleAttr !== this._buttonStyle) {
        this._buttonStyle = buttonStyleAttr;
      }
      
      // Base class will call render() if not already rendered
      // But we'll also call it directly to ensure it happens
      if (!this._hasRendered) {
        this.render();
      }
    }

    render() {
      if (this._hasRendered) {
        return;
      }

      if (this._isRendering) {
        console.warn('[Button List] Already rendering, skipping');
        return;
      }

      this._isRendering = true;

      try {
        // Ensure shadow DOM is set up (base class pattern)
        this.ensureShadow();
        
        // Render into the shadow DOM with inline styles
        if (this._shadow) {
          // Note: External CSS should be loaded by K2, but we include a minimal style tag as fallback
          // The full styles are in runtime_style.css which K2 should load
          // CSS custom properties must be on :host for shadow DOM inheritance
          this._shadow.innerHTML = `
            <style>
              :host {
                display: block;
                width: 100%;
                --button-accent: var(--icon-accent-color, #1495ff);
                --button-base: var(--icon-base-color, #495660);
                --button-secondary: var(--icon-base-secondary-color, #f0f0f1);
                --button-border: #e5e7eb;
                --button-text: #1f2937;
                --button-radius: 6px;
                --button-spacing: 8px;
                --button-transition: 180ms cubic-bezier(0.2, 0.8, 0.2, 1);
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
                gap: var(--button-spacing, 8px);
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
                border-radius: var(--button-radius, var(--button-rounding, 6px));
                cursor: pointer;
                transition: all var(--button-transition);
                font-size: 14px;
                font-family: var(--button-font-family, inherit);
                text-align: center;
                min-height: var(--button-height, 40px);
                height: var(--button-height, auto);
                min-width: fit-content;
                width: var(--button-width, auto);
                box-sizing: border-box;
                position: relative;
                overflow: hidden;
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
              .button-item[data-has-width] {
                flex-shrink: 1;
                min-width: 0;
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
                max-width: 100%;
                min-width: 0;
                flex: 1 1 auto;
              }
              .button-content-text {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                min-width: 0;
                flex: 0 1 auto;
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
              .button-item.button-style-normal:hover:not(.selected):not(:disabled) {
                background: var(--button-hover-background-color, #aeaeae);
                border-color: var(--button-hover-border-color, #aeaeae);
                color: var(--button-hover-text-color, white);
                transform: translateY(-1px);
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
              }
              .button-item.button-style-main:hover:not(.selected):not(:disabled) {
                background: var(--primary-button-hover-background-color, #00abf0);
                border-color: var(--primary-button-hover-border-color, #00abf0);
                color: var(--primary-button-hover-text-color, #f4f9fb);
                transform: translateY(-1px);
                box-shadow: 0 2px 8px rgba(20, 149, 255, 0.15);
              }
              .button-item.button-style-quiet:hover:not(.selected):not(:disabled) {
                background: var(--quiet-button-hover-background-color, rgba(97, 97, 97, 0.2));
                border-color: var(--quiet-button-hover-border-color, #616161);
                color: var(--quiet-button-hover-text-color, #616161);
                transform: translateY(-1px);
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
              }
              .button-item.button-style-destructive:hover:not(.selected):not(:disabled) {
                background-color: var(--destructive-button-hover-background-color, #e03939);
                border-color: var(--destructive-button-hover-border-color, #e03939);
                color: var(--destructive-button-hover-text-color, white);
                transform: translateY(-1px);
                box-shadow: 0 2px 8px rgba(220, 38, 38, 0.15);
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
              .button-item:disabled,
              .button-item.disabled {
                opacity: 0.6;
                cursor: not-allowed;
                pointer-events: none;
              }
              .button-list-container.is-disabled {
                opacity: 0.6;
                cursor: not-allowed;
                pointer-events: none;
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
                border-radius: var(--button-radius);
              }
              .button-list-container.is-readonly .button-item {
                cursor: default;
              }
              .button-list-container.is-readonly .button-item.button-style-normal:hover {
                background: var(--button-background-color, #949494);
                border-color: var(--button-border-color, #949494);
                transform: none;
                box-shadow: none;
              }
              .button-list-container.is-readonly .button-item.button-style-main:hover {
                background: var(--primary-button-background-color, #0087bd);
                border-color: var(--primary-button-border-color, #0087bd);
                transform: none;
                box-shadow: none;
              }
              .button-list-container.is-readonly .button-item.button-style-quiet:hover {
                background: var(--quiet-button-background-color, transparent);
                border-color: var(--quiet-button-border-color, #616161);
                transform: none;
                box-shadow: none;
              }
              .button-list-container.is-readonly .button-item.button-style-destructive:hover {
                background-color: var(--destructive-button-background-color, #b71c1c);
                border-color: var(--destructive-button-border-color, #b71c1c);
                transform: none;
                box-shadow: none;
              }
            </style>
            <div class="button-list-container">
              <div class="button-list-wrapper button-layout-${this._buttonLayout}"></div>
            </div>
          `;

          this.container = this._shadow.querySelector('.button-list-container');
          this.wrapper = this._shadow.querySelector('.button-list-wrapper');
        } else {
          // Fallback: render directly to element if shadow DOM not available
          this.innerHTML = `
            <div class="button-list-container">
              <div class="button-list-wrapper button-layout-${this._buttonLayout}"></div>
            </div>
          `;

          this.container = this.querySelector('.button-list-container');
          this.wrapper = this.querySelector('.button-list-wrapper');
        }

        if (!this.container || !this.wrapper) {
          console.error('[Button List] Failed to create container elements');
          return;
        }

        if (this._height && this.container) {
          this.container.style.height = isNaN(this._height) ? String(this._height) : `${this._height}px`;
        }
        if (this._width && this.container) {
          this.container.style.width = isNaN(this._width) ? String(this._width) : `${this._width}px`;
        }
        if (this.container) {
          this.container.style.display = this._isVisible ? '' : 'none';
        }

        this.updateInteractivity();

        this._hasRendered = true;

        this._updateButtonStyles();
        this._renderButtons();

        this.attachEventListeners();

        this.dispatchEvent(new Event('Rendered'));
      } finally {
        this._isRendering = false;
      }
    }

    _updateButtonStyles() {
      // For shadow DOM, CSS custom properties must be set on the host element (this)
      // For fallback (no shadow), set on container
      const targetElement = this._shadow ? this : (this.container || this);

      if (this._buttonHeight && this._buttonHeight.trim()) {
        targetElement.style.setProperty('--button-height', this._buttonHeight);
      } else {
        targetElement.style.removeProperty('--button-height');
      }

      if (this._buttonWidth && this._buttonWidth.trim()) {
        targetElement.style.setProperty('--button-width', this._buttonWidth);
      } else {
        targetElement.style.removeProperty('--button-width');
      }

      targetElement.style.setProperty('--button-radius', this._buttonRadius || '6px');
      targetElement.style.setProperty('--button-spacing', this._buttonSpacing || '8px');
      
      // New content styling properties
      targetElement.style.setProperty('--image-size', this._imageSize || '20px');
      targetElement.style.setProperty('--image-fit', this._imageFit || 'contain');
      targetElement.style.setProperty('--content-align', this._contentAlignment || 'center');
      targetElement.style.setProperty('--icon-spacing', this._iconSpacing || '8px');
      
      // Also set on container if using shadow DOM (for fallback compatibility)
      if (this.container && this.container !== targetElement) {
        if (this._buttonHeight && this._buttonHeight.trim()) {
          this.container.style.setProperty('--button-height', this._buttonHeight);
        }
        if (this._buttonWidth && this._buttonWidth.trim()) {
          this.container.style.setProperty('--button-width', this._buttonWidth);
        }
        this.container.style.setProperty('--button-radius', this._buttonRadius || '6px');
        this.container.style.setProperty('--button-spacing', this._buttonSpacing || '8px');
        this.container.style.setProperty('--image-size', this._imageSize || '20px');
        this.container.style.setProperty('--image-fit', this._imageFit || 'contain');
        this.container.style.setProperty('--content-align', this._contentAlignment || 'center');
        this.container.style.setProperty('--icon-spacing', this._iconSpacing || '8px');
      }
    }

    _renderButtons() {
      if (!this.wrapper) {
        console.error('[Button List] _renderButtons() skipping - wrapper not ready');
        return;
      }

      if (this._isRendering) {
        console.warn('[Button List] _renderButtons() skipping - already rendering');
        return;
      }

      this._isRendering = true;

      try {
        this.wrapper.innerHTML = '';

        if (this._items.length > 0) {
          for (let i = 0; i < this._items.length; i++) {
            const button = this._createButton(this._items[i], i);
            this.wrapper.appendChild(button);
          }
        }
      } catch (error) {
        console.error('[Button List] Error in _renderButtons():', error);
        console.error('[Button List] - Error stack:', error.stack);
      } finally {
        this._isRendering = false;
      }
    }

    _createButton(item, index) {
      const button = document.createElement('button');
      button.className = `button-item button-size-${this._buttonSize} button-style-${this._buttonStyle || 'normal'}`;
      button.setAttribute('data-value', item.value);
      button.setAttribute('data-index', index);
      button.setAttribute('type', 'button');

      if (item.selected) {
        button.classList.add('selected');
      }

      // Create content container
      const contentSpan = document.createElement('span');
      contentSpan.className = 'button-content';

      // Get IconPosition property (default to 'left' if not set)
      const iconPosition = this._iconPosition || 'left';

      // Determine what to render based on IconPosition
      const showImage = item.imageUrl && iconPosition !== 'none';
      const showText = item.text && iconPosition !== 'only';

      // Build content in correct order based on position
      if (showImage && (iconPosition === 'left' || iconPosition === 'top' || iconPosition === 'only')) {
        const img = document.createElement('img');
        img.setAttribute('src', item.imageUrl);
        img.alt = item.text || '';
        img.setAttribute('loading', 'lazy');
        img.onerror = function() {
          console.warn(`[Button List] Failed to load image for item ${index}`);
          img.style.display = 'none';
        };
        contentSpan.appendChild(img);
      }

      if (showText) {
        const textSpan = document.createElement('span');
        textSpan.className = 'button-content-text';
        textSpan.textContent = item.text;
        contentSpan.appendChild(textSpan);
      }

      if (showImage && (iconPosition === 'right' || iconPosition === 'bottom')) {
        const img = document.createElement('img');
        img.setAttribute('src', item.imageUrl);
        img.alt = item.text || '';
        img.setAttribute('loading', 'lazy');
        img.onerror = function() {
          console.warn(`[Button List] Failed to load image for item ${index}`);
          img.style.display = 'none';
        };
        contentSpan.appendChild(img);
      }

      // Apply flex direction for top/bottom positioning
      if (iconPosition === 'top' || iconPosition === 'bottom') {
        contentSpan.style.flexDirection = 'column';
        // Apply vertical alignment for column layout
        const alignMap = {
          'start': 'flex-start',
          'center': 'center',
          'end': 'flex-end'
        };
        contentSpan.style.alignItems = alignMap[this._contentAlignment] || 'center';
      }

      button.appendChild(contentSpan);
      
      // Add tooltip with full text value on hover
      if (item.text) {
        button.setAttribute('title', item.text);
      }
      
      // Mark button if it has a width constraint to allow shrinking
      // Also mark grid layout buttons as they need to shrink to fit grid cells
      if ((this._buttonWidth && this._buttonWidth.trim() && this._buttonWidth !== 'auto') || 
          this._buttonLayout === 'grid') {
        button.setAttribute('data-has-width', 'true');
      }
      
      button.addEventListener('click', (e) => this._handleButtonClick(item, e));

      return button;
    }

    _parseK2Collection(collectionXml) {
      if (!collectionXml || typeof collectionXml !== 'string') {
        return null;
      }

      try {
        // Parse the collection XML
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(collectionXml, 'text/xml');

        // Check for parsing errors
        const parserError = xmlDoc.querySelector('parsererror');
        if (parserError) {
          console.warn('[Button List] XML parsing error:', parserError.textContent);
          return null;
        }

        // Get the first object in the collection
        const object = xmlDoc.querySelector('collection > object');
        if (!object) {
          console.warn('[Button List] No object found in collection');
          return null;
        }

        // Extract fields
        const fileNameField = object.querySelector('fields > field[name="FileName"] > value');
        const filePathField = object.querySelector('fields > field[name="FilePath"] > value');
        const fileRequestDataField = object.querySelector('fields > field[name="FileRequestData"] > value');

        const fileName = fileNameField ? fileNameField.textContent : null;
        const filePath = filePathField ? filePathField.textContent : null;
        const fileRequestData = fileRequestDataField ? fileRequestDataField.textContent : null;

        const result = {
          fileName: fileName,
          filePath: filePath,
          imageUrl: null
        };

        if (fileRequestData && fileRequestData.trim()) {
          result.imageUrl = this._getK2FileUrl(fileRequestData, fileName, filePath);
        }

        return result;
      } catch (error) {
        console.error('[Button List] Error parsing K2 collection:', error);
        return null;
      }
    }

    /**
     * Extracts XML collection blocks from mixed content (text + XML)
     * Returns both the image URL (from first collection found) and cleaned text (with XML removed)
     * @param {string} text - Mixed content that may contain XML collection blocks
     * @returns {Object} { imageUrl: string|null, cleanedText: string }
     */
    _extractImageFromMixedContent(text) {
      if (!text || typeof text !== 'string') {
        return { imageUrl: null, cleanedText: text || '' };
      }

      let cleanedText = text;
      let imageUrl = null;

      // Find all <collection>...</collection> blocks using regex
      // This pattern matches from <collection> to </collection>, handling nested content
      const collectionPattern = /<collection>[\s\S]*?<\/collection>/gi;
      const matches = text.match(collectionPattern);

      if (matches && matches.length > 0) {
        // Process the first collection to extract image URL
        const firstCollection = matches[0];
        const parsedData = this._parseK2Collection(firstCollection);
        
        if (parsedData && parsedData.imageUrl) {
          imageUrl = parsedData.imageUrl;
        }

        // Remove all collection blocks from the text
        cleanedText = text.replace(collectionPattern, '').trim();
      }

      return { imageUrl, cleanedText };
    }

    _resolveImageUrl(imageUrl) {
      if (!imageUrl) return '';

      if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://') || imageUrl.startsWith('data:')) {
        return imageUrl;
      }

      const baseUrl = this._getK2BaseUrl();
      if (baseUrl) {
        if (imageUrl.startsWith('/')) {
          return `${baseUrl}${imageUrl}`;
        }
        const cleanBase = baseUrl.replace(/\/$/, '');
        const cleanImage = imageUrl.replace(/^\//, '');
        return `${cleanBase}/${cleanImage}`;
      }

      return imageUrl;
    }

    _getK2BaseUrl() {
      if (window.K2?.GetBaseUrl) {
        return window.K2.GetBaseUrl();
      }
      if (window.location) {
        return window.location.origin;
      }
      return null;
    }

    _getK2FileUrl(fileRequestData, fileName, filePath) {
      if (!fileRequestData || typeof fileRequestData !== 'string') {
        console.warn('[Button List] Invalid fileRequestData parameter');
        return '';
      }

      fileRequestData = fileRequestData.trim();
      if (!fileRequestData) {
        console.warn('[Button List] Empty fileRequestData after trim');
        return '';
      }

      // First, try K2.GetFileUrl() API if available (preferred method)
      if (window.K2?.GetFileUrl && typeof window.K2.GetFileUrl === 'function') {
        try {
          const url = window.K2.GetFileUrl(fileRequestData);
          if (url && url.trim()) {
            return url;
          }
        } catch (e) {
          console.warn('[Button List] K2.GetFileUrl() threw exception, using fallback:', e);
        }
      }

      // Fallback: construct URL manually using K2's Runtime/File.ashx pattern
      // Based on working K2 image control: /Runtime/Runtime/File.ashx?_path=...&_filerequestdata=...
      const baseUrl = this._getK2BaseUrl();
      if (!baseUrl) {
        console.warn('[Button List] Cannot construct file URL - no base URL available');
        return '';
      }

      // Build the path parameter - if filePath is available and not "NOPATH", use it
      // Otherwise, construct from fileName if available
      let pathParam = '';
      if (filePath && filePath !== 'NOPATH' && filePath.trim()) {
        // Use the filePath directly (it may already be encoded)
        pathParam = encodeURIComponent(filePath);
      } else if (fileName && fileName.trim()) {
        // Construct a simple path from fileName
        // K2 seems to use base64-like encoding for paths, but for simplicity, we'll just encode the filename
        pathParam = encodeURIComponent(fileName);
      }

      // Construct URL using K2's Runtime/File.ashx endpoint pattern
      // This matches the working K2 image control pattern
      let url = '';
      if (pathParam) {
        // Use the Runtime/File.ashx pattern with both _path and _filerequestdata
        url = `${baseUrl}/Runtime/Runtime/File.ashx?_path=${pathParam}&_filerequestdata=${encodeURIComponent(fileRequestData)}`;
      } else {
        // Fallback to AnonymousResources if we don't have path info
        url = `${baseUrl}/AnonymousResources.ashx?method=GETFILE&fileRequestData=${encodeURIComponent(fileRequestData)}`;
      }
      
      return url;
    }

    _handleButtonClick(item, event) {
      if (!this._isEnabled || this._isReadOnly) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      const oldValue = this._selectedValue;
      const oldSelectedItem = this._selectedItem ? JSON.parse(JSON.stringify(this._selectedItem)) : null;

      this.dispatchEvent(new CustomEvent("OnButtonClick", {
        detail: {
          button: item,
          value: item.value,
          content: item.content,
          index: this._items.indexOf(item),
          oldValue: oldValue,
          oldSelectedItem: oldSelectedItem
        },
        bubbles: true
      }));

      this.setSelectedItem(item);
    }

    setSelectedItem(item) {
      const oldValue = this._selectedValue;
      const newValue = item ? item.value : null;

      this._items.forEach(i => {
        i.selected = false;
      });

      if (this.wrapper) {
        const buttons = this.wrapper.querySelectorAll('.button-item');
        buttons.forEach(btn => btn.classList.remove('selected'));
      }

      if (item) {
        item.selected = true;
        this._selectedItem = item;
        this._selectedValue = newValue;

        if (this.wrapper) {
          const button = this.wrapper.querySelector(`[data-value="${item.value}"]`);
          if (button) {
            button.classList.add('selected');
          }
        }
      } else {
        this._selectedItem = null;
        this._selectedValue = null;
      }

      this.setAttribute('value', this._selectedValue || '');

      if (this._hasRendered) {
        safeRaisePropertyChanged(this, 'Value');
      }

      if (oldValue !== newValue) {
        this._fireChangedEvent(newValue, oldValue);
      }
    }

    clearSelection() {
      const oldValue = this._selectedValue;
      const oldSelectedItem = this._selectedItem;

      this._items.forEach(item => item.selected = false);

      if (this.wrapper) {
        const buttons = this.wrapper.querySelectorAll('.button-item');
        buttons.forEach(btn => btn.classList.remove('selected'));
      }

      this._selectedItem = null;
      this._selectedValue = null;

      if (this._hasRendered) {
        safeRaisePropertyChanged(this, 'Value');
      }

      if (oldValue !== null) {
        this._fireChangedEvent(this._selectedValue, oldValue);
      }
    }

    selectById(id) {
      // Extract actual value if K2 passed an object (e.g., {id: '1'})
      let actualId = id;
      if (id && typeof id === 'object' && !Array.isArray(id)) {
        actualId = id.id || id.value || Object.values(id)[0];
      }

      // Try to find by value (ID) - use String comparison to handle type mismatches
      const item = this._items.find(i => String(i.value) === String(actualId));
      
      if (item) {
        this.setSelectedItem(item);
      } else {
        console.warn('[Button List] selectById - no item found with id:', actualId, {
          availableValues: this._items.map(i => i.value)
        });
      }
    }

    selectByText(text) {
      // Extract actual value if K2 passed an object (e.g., {text: 'Home'})
      let actualText = text;
      if (text && typeof text === 'object' && !Array.isArray(text)) {
        actualText = text.text || text.display || Object.values(text)[0];
      }

      // Try to find by text (display) - use String comparison to handle type mismatches
      const item = this._items.find(i => String(i.text) === String(actualText));
      
      if (item) {
        this.setSelectedItem(item);
      } else {
        console.warn('[Button List] selectByText - no item found with text:', actualText, {
          availableTexts: this._items.map(i => i.text)
        });
      }
    }

    execute(objInfo = {}) {
      const method = objInfo?.methodName;
      let result = null;

      try {
        switch (method) {
          case 'clearSelection':
            this.clearSelection();
            break;
          case 'selectById':
          case 'selectByValue': // Backward compatibility
            {
              let idParam = objInfo?.value ?? objInfo?.id ?? objInfo?.parameters?.value ?? objInfo?.parameters?.id;
              // Extract value if it's an object (K2 sometimes passes {id: '1'})
              if (idParam && typeof idParam === 'object' && !Array.isArray(idParam)) {
                idParam = idParam.id || idParam.value || Object.values(idParam)[0];
              }
              this.selectById(idParam);
              break;
            }
          case 'selectByText':
          case 'selectByIndex': // Backward compatibility - but now selects by text, not index
            {
              let textParam = objInfo?.text ?? objInfo?.index ?? objInfo?.parameters?.text ?? objInfo?.parameters?.index;
              // Extract value if it's an object (K2 sometimes passes {text: 'Home'})
              if (textParam && typeof textParam === 'object' && !Array.isArray(textParam)) {
                textParam = textParam.text || textParam.display || Object.values(textParam)[0];
              }
              this.selectByText(textParam);
              break;
            }
          case 'refresh':
            this.refresh();
            break;
          default:
            console.warn('[Button List] execute called with unknown method', method);
            break;
        }
      } catch (error) {
        console.error('[Button List] execute error', { method: method, error: error });
        throw error;
      }

      // Ensure we always return a string (not null/undefined) for K2 text field compatibility
      return result !== null && result !== undefined ? result : "";
    }

    refresh() {
      if (this._hasRendered) {
        this._renderButtons();
      }
    }

    //#endregion Methods
  });
}

