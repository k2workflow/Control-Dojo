

//A Springboard implementation of the K2 Controls API (methods custom controls can use)
//TODO CvG A lot of this is commented out until we are certain they are needed
class K2ControlsAPI
{

    constructor()
    {

    }

    /**
     * Custom controls can notify the K2 runtime that a property has changed by calling this method.
     * @param {any} customElement
     * @param {any} propertyName
     * @param {any} data
     */
    RaisePropertyChanged(customElement, propertyName, data)
    {
        var ev = new Event("PropertyChanged");
        ev.usesK2Api = true;
        ev.Property = propertyName;
        ev.data = data;
        customElement.dispatchEvent(ev);
        SourceCode.Forms.ControlStyles.raiseControlStyleEvent(customElement, ev);
    }

}
if (!window.K2) window.K2 = new K2ControlsAPI();