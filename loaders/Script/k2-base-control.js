/**
 * Base class for K2 Custom Controls
 * Contains common functionality shared across all K2 controls
 */
class K2BaseControl extends HTMLElement
{
    constructor()
    {
        super();
        
        /** @private @type {boolean} Indicates whether the control is connected to the DOM */
        this._isConnected = false;
        
        /** @private @type {boolean} Indicates whether the control has been rendered */
        this._hasRendered = false;
        
        /** @private @type {ShadowRoot|null} The shadow root of the control */
        this._shadow = null;
        
        /** @private @type {string} The name of the control (tag name in lowercase) */
        this._name = this.tagName.toLowerCase();
        
        /** @private @type {string|null} The control type identifier */
        this._controlType = null;
        
        /** @private @type {Object} Dictionary of registered templates keyed by part name */
        this._templates = {};
        
        /** @private @type {string} The current control style identifier */
        this._style = "";

        // Initialize script and style file arrays
        /** @private @type {Array<string>} List of design-time JavaScript file names */
        this._designtimeScriptFileNames = [];
        
        /** @private @type {Array<string>} List of runtime JavaScript file names */
        this._runtimeScriptFileNames = [];
        
        /** @private @type {Array<string>} List of design-time CSS file names */
        this._designtimeStyleFileNames = [];
        
        /** @private @type {Array<string>} List of runtime CSS file names */
        this._runtimeStyleFileNames = [];
    }

    /**
     * Get the class name of this control
     * @returns {string} The class name
     */
    getClassName()
    {
        return this.constructor.name;
    }

    /**
     * Get the tag name of this control
     * @returns {string} The tag name in lowercase
     */
    getTagName()
    {
        return this.tagName.toLowerCase();
    }

    /**
     * Gets the name of the control.
     * This is typically the tag name in lowercase.
     * @returns {string} The control name
     */
    get Name()
    {
        return this._name;
    }

    /**
     * Sets the name of the control.
     * Updates the internal name property which identifies the control instance.
     * @param {string} value - The new name for the control
     */
    set Name(value)
    {
        this._name = value;
    }

    /**
     * Gets the control type identifier.
     * This identifies the type/category of the control (e.g., "TextBox", "Button", etc.).
     * @returns {string|null} The control type identifier, or null if not set
     */
    get ControlType()
    {
        return this._controlType;
    }

    /**
     * Sets the control type identifier.
     * This should match the control type registered in the K2 Forms system.
     * @param {string|null} value - The control type identifier
     */
    set ControlType(value)
    {
        this._controlType = value;
    }

    /**
     * Gets the list of CSS file names to be loaded at runtime.
     * These stylesheets are loaded when the control is rendered in runtime mode.
     * @returns {Array<string>} Array of CSS file names
     */
    get RuntimeStyleFileNames()
    {
        return this._runtimeStyleFileNames;
    }

    /**
     * Sets the list of CSS file names to be loaded at runtime.
     * Ensures the value is always an array. Non-array values are converted to empty arrays.
     * @param {Array<string>|*} value - Array of CSS file names, or any value (will be converted to array if needed)
     */
    set RuntimeStyleFileNames(value)
    {
        this._runtimeStyleFileNames = Array.isArray(value) ? value : [];
    }

    /**
     * Gets the list of JavaScript file names to be loaded at runtime.
     * These scripts are loaded when the control is rendered in runtime mode.
     * @returns {Array<string>} Array of JavaScript file names
     */
    get RuntimeScriptFileNames()
    {
        return this._runtimeScriptFileNames;
    }

    /**
     * Sets the list of JavaScript file names to be loaded at runtime.
     * Ensures the value is always an array. Non-array values are converted to empty arrays.
     * @param {Array<string>|*} value - Array of JavaScript file names, or any value (will be converted to array if needed)
     */
    set RuntimeScriptFileNames(value)
    {
        this._runtimeScriptFileNames = Array.isArray(value) ? value : [];
    }

    /**
     * Gets the list of CSS file names to be loaded at design time.
     * These stylesheets are loaded when the control is rendered in the designer.
     * @returns {Array<string>} Array of CSS file names
     */
    get DesigntimeStyleFileNames()
    {
        return this._designtimeStyleFileNames;
    }

    /**
     * Sets the list of CSS file names to be loaded at design time.
     * Ensures the value is always an array. Non-array values are converted to empty arrays.
     * @param {Array<string>|*} value - Array of CSS file names, or any value (will be converted to array if needed)
     */
    set DesigntimeStyleFileNames(value)
    {
        this._designtimeStyleFileNames = Array.isArray(value) ? value : [];
    }

    /**
     * Gets the list of JavaScript file names to be loaded at design time.
     * These scripts are loaded when the control is rendered in the designer.
     * @returns {Array<string>} Array of JavaScript file names
     */
    get DesigntimeScriptFileNames()
    {
        return this._designtimeScriptFileNames;
    }

    /**
     * Sets the list of JavaScript file names to be loaded at design time.
     * Ensures the value is always an array. Non-array values are converted to empty arrays.
     * @param {Array<string>|*} value - Array of JavaScript file names, or any value (will be converted to array if needed)
     */
    set DesigntimeScriptFileNames(value)
    {
        this._designtimeScriptFileNames = Array.isArray(value) ? value : [];
    }

    /**
     * Gets the control style identifier - not implemented
     * This determines which registered style (if any) should be applied to the control.
     * @returns {string} The control style identifier (empty string if no style is set)
     */
    get ControlStyle()
    {
        return this._style;
    }

    /**
     * Sets the control style identifier.
     * When changed, this triggers the onControlStyleChanged callback and re-renders the control.
     * The style identifier should match a registered control style in the K2 Forms system.
     * @param {string} value - The new control style identifier
     * @fires K2BaseControl#onControlStyleChanged
     */
    set ControlStyle(value)
    {
        const oldValue = this._style;
        this._style = value;

        // Call the overridable method for custom style change handling
        this.onControlStyleChanged(oldValue, value);

        // Re-render the control when style changes
        this.render();
    }

    /**
     * Override this method in derived classes to handle style changes.
     * This is called before the control is re-rendered when the ControlStyle property changes.
     * @param {string} oldValue - The previous style value
     * @param {string} newValue - The new style value
     * @protected
     */
    onControlStyleChanged(oldValue, newValue)
    {
        // Base implementation does nothing
        // Derived classes can override this for custom behavior
    }

    /**
     * Called when the element is connected to the DOM.
     * Triggers the initial render if not already rendered.
     */
    connectedCallback()
    {
        this._isConnected = true;
        if (!this._hasRendered) this.render();
    }

    /**
     * Common rendering pattern for K2 controls.
     * Ensures shadow DOM exists and initiates the render process.
     */
    render()
    {
        if (!this._isConnected) return;
        this.ensureShadow();
        this.element = $(this._shadow);
        this._render();
    }

    /**
     * Ensures the shadow DOM is created and removes any existing child elements.
     * Creates a shadow root with 'open' mode if it doesn't exist.
     */
    ensureShadow()
    {
        $(this).children().remove();
        if (!this._shadow)
        {
            this._shadow = this.attachShadow({ mode: 'open' });
        }
    }

    /**
     * Override this method in derived classes to implement control-specific rendering logic.
     * This is called after the shadow DOM is ensured and the element is ready.
     * @protected
     */
    _render()
    {
        // This code is commented out to allow immediate rendering without waiting for style resources
        // K2.LoadControlStyleResources(this, this._shadow).then($.proxy(function () {
        //     this._render();
        //     this._hasRendered = true;

        //     // Design-time - Notifies the designer to relocate canvas widgets
        //     // Runtime - lets the page know its done rendering and ready for animating or showing.
        //     this.dispatchEvent(new Event('Rendered'));
        // }, this));
        this.attachEventListeners();
    }

    /**
     * Common method to attach event listeners.
     * Override in derived classes to add specific event handlers.
     * @protected
     */
    attachEventListeners()
    {

    }

    /**
     * Gets the list of attributes to observe for changes.
     * Base implementation observes 'controlstyle', 'name', and 'controltype'.
     * Can be extended by derived classes by overriding this getter.
     * @returns {Array<string>} Array of attribute names to observe
     */
    get observedAttributes()
    {
        return ['controlstyle', 'name', 'controltype'];
    }

    /**
     * Called when an observed attribute changes.
     * Base implementation handles 'controlstyle', 'name', and 'controltype' attributes.
     * Can be extended by derived classes via the onAttributeChanged hook.
     * @param {string} name - Attribute name that changed
     * @param {string} oldValue - Previous attribute value
     * @param {string} newValue - New attribute value
     */
    attributeChangedCallback(name, oldValue, newValue)
    {
        //console.log(`Base attribute changed: ${name} from '${oldValue}' to '${newValue}'`);

        switch (name)
        {
            case "controlstyle":
                this.ControlStyle = newValue;
                break;
            case "name":
                this.Name = newValue;
                break;
            case "controltype":
                this.ControlType = newValue;
                break;
            default:
                // Allow derived classes to handle additional attributes
                this.onAttributeChanged(name, oldValue, newValue);
                break;
        }
    }

    /**
     * Override this method in derived classes to handle additional attribute changes
     * that are not handled by the base implementation.
     * @param {string} name - Attribute name that changed
     * @param {string} oldValue - Previous attribute value
     * @param {string} newValue - New attribute value
     * @protected
     */
    onAttributeChanged(name, oldValue, newValue)
    {
        // Base implementation does nothing
        // Derived classes can override this for custom behavior
    }

    /**
     * Raises a property changed notification to the K2 framework.
     * This notifies the K2 system that a control property has changed.
     * @param {string} propertyName - The name of the property that changed
     * @param {*} value - The new value of the property
     */
    raisePropertyChanged(propertyName, value)
    {
        if (typeof K2 !== 'undefined' && K2.RaisePropertyChanged)
        {
            K2.RaisePropertyChanged(this, propertyName, value);
        }
    }

    /**
     * Helper method to bind event handlers to elements with proper context.
     * Automatically binds the handler to this control instance.
     * @param {jQuery|HTMLElement} element - The element to attach the event listener to
     * @param {string} eventName - The name of the event (e.g., 'click', 'change')
     * @param {Function} handler - The event handler function
     */
    bindControl(element, eventName, handler)
    {
        if (element && handler)
        {
            element.on(eventName, handler.bind(this));
        }
    }

    /**
     * Called when the element is disconnected from the DOM.
     * Performs cleanup by removing event listeners and freeing resources.
     */
    disconnectedCallback()
    {
        // Remove event listeners and clean up resources
        if (this._shadow)
        {
            $(this._shadow).off();
        }
    }

    /**
     * K2 API function required to provide default template if no custom template is provided.
     * Checks registered templates first, then base templates, then common K2 templates.
     * This is the base implementation that can be overridden by derived classes.
     * @param {string} partName - The name of the template part to retrieve
     * @returns {jQuery|string} A jQuery object or string containing the template, or empty string if not found
     */
    getDefaultTemplate(partName)
    {
        // First check if template was registered dynamically
        const registeredTemplate = this.getRegisteredTemplate(partName);
        if (registeredTemplate)
        {
            return registeredTemplate;
        }

        // Then check base templates from derived class
        const baseTemplates = this.getBaseTemplates();
        if (baseTemplates && baseTemplates[partName])
        {
            return $(baseTemplates[partName]);
        }

        // Finally check for common K2 templates
        const commonTemplates = this.getCommonK2Templates();
        if (commonTemplates && commonTemplates[partName])
        {
            return $(commonTemplates[partName]);
        }

        // If no template found, return empty string
        console.warn(`No template found for part: ${partName} in control: ${this.getClassName()}`);
        return "";
    }

    /**
     * Override this method in derived classes to provide control-specific templates.
     * Base implementation returns an empty object.
     * @returns {Object} An object containing template definitions keyed by part name
     * @protected
     */
    getBaseTemplates()
    {
        // Base class provides no default templates
        // Derived classes should override this method to provide their templates
        return {};
    }

    /**
     * Returns common K2 templates that can be shared across controls.
     * Provides default templates for "Empty", "Loading", and "Error" states.
     * @returns {Object} An object containing common template definitions keyed by part name
     */
    getCommonK2Templates()
    {
        return {
            "Empty": "<div class='k2-control-empty'>No content available</div>",
            "Loading": "<div class='k2-control-loading'>Loading...</div>",
            "Error": "<div class='k2-control-error'>An error occurred</div>"
        };
    }

    /**
     * Helper method to register multiple templates for a control at once.
     * This allows runtime template configuration.
     * Merges new templates with existing registered templates.
     * @param {Object} templates - Object containing template definitions keyed by part name
     */
    registerTemplates(templates)
    {
        this._templates = { ...this._templates, ...templates };
    }

    /**
     * Register a single template by name.
     * Adds or updates a template in the internal templates dictionary.
     * @param {string} partName - The template part name (e.g., "header", "body", "footer")
     * @param {string} template - The template string (HTML content)
     */
    registerTemplate(partName, template)
    {
        if (!this._templates)
        {
            this._templates = {};
        }
        this._templates[partName] = template;
    }

    /**
     * Get a registered template by name.
     * Returns the template wrapped in a jQuery object if found.
     * @param {string} partName - The template part name
     * @returns {jQuery|string} A jQuery object containing the template, or empty string if not found
     */
    getRegisteredTemplate(partName)
    {
        // Check if templates exist
        if (!this._templates)
        {
            return "";
        }

        // Check if the specific template exists
        if (this._templates[partName])
        {
            return $(this._templates[partName]);
        }

        // Template not found
        return "";
    }

    /**
     * Clear all registered templates.
     * Resets the internal templates dictionary to an empty object.
     */
    clearRegisteredTemplates()
    {
        this._templates = {};
    }

    /**
     * Get all available template names for this control.
     * Combines registered, base, and common template names into a unique array.
     * @returns {Array<string>} Array of unique template part names
     */
    getAvailableTemplates()
    {
        const registered = Object.keys(this._templates || {});
        const base = Object.keys(this.getBaseTemplates());
        const common = Object.keys(this.getCommonK2Templates());

        return [...new Set([...registered, ...base, ...common])];
    }

    /**
     * Parse and render an XML template with data values.
     * Processes template items with SourceType "ObjectProperty" or "Value".
     * ObjectProperty items get their values from the data object.
     * Value items use literal values from SourceValue elements.
     * @param {string} template - The XML template string starting with <Template>
     * @param {Object} data - The data object containing property values to substitute
     * @returns {string} The rendered display text with values substituted
     * @example
     * // Template: <Template><Item SourceType="Value"><SourceValue>Name: </SourceValue></Item><Item SourceType="ObjectProperty" SourceID="Name"/></Template>
     * // Data: { Name: "John Doe" }
     * // Returns: "Name: John Doe"
     */
    parseDisplayTemplate(template, data)
    {
        if (!template || typeof template !== 'string')
        {
            return template;
        }

        // Check if it's an XML template
        if (!template.startsWith('<Template>'))
        {
            return template; // Return as-is if not a template
        }

        try
        {
            // Parse the XML template
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(template, 'text/xml');

            // Check for parsing errors
            const parserError = xmlDoc.querySelector('parsererror');
            if (parserError)
            {
                console.warn('XML parsing error:', parserError.textContent);
                return template;
            }

            const items = xmlDoc.querySelectorAll('Item');
            let result = '';

            items.forEach(item =>
            {
                const sourceType = item.getAttribute('SourceType');

                if (sourceType === 'ObjectProperty')
                {
                    // Get property value from data object
                    const sourceID = item.getAttribute('SourceID');
                    const value = data && data[sourceID] ? data[sourceID] : '';
                    result += value;
                } else if (sourceType === 'Value')
                {
                    // Get literal value from SourceValue element
                    const sourceValueElement = item.querySelector('SourceValue');
                    if (sourceValueElement)
                    {
                        result += sourceValueElement.textContent || '';
                    }
                }
            });

            return result;
        } catch (error)
        {
            console.error('Error parsing display template:', error);
            return template; // Fallback to original template
        }
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports)
{
    module.exports = K2BaseControl;
}
