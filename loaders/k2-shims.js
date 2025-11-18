// Exposes a minimal K2 API surface into the iframe window
export function installK2Shim(targetWindow, dispatchLog) {
    targetWindow.K2 = targetWindow.K2 || {};
    targetWindow.K2.IsDesigner = targetWindow.__WB_MODE__ === 'design';

    targetWindow.K2.RaisePropertyChanged = function (ctrl, propId) {
        dispatchLog(`[K2] RaisePropertyChanged: ${propId} -> ${ctrl?.[propId] ?? ''}`);
        // Also dispatch a DOM event so the workbench can listen
        const ev = new targetWindow.CustomEvent('k2-prop-changed', { detail: { propId, value: ctrl?.[propId] } });
        targetWindow.dispatchEvent(ev);
    };

    // Optional: style template hook no-op
    targetWindow.K2.GetControlStyleTemplate = function () { return ''; };

    // Intercept console methods to forward to parent
    const originalConsole = {
        log: targetWindow.console.log,
        error: targetWindow.console.error,
        warn: targetWindow.console.warn,
        info: targetWindow.console.info,
        debug: targetWindow.console.debug
    };
    
    ['log', 'error', 'warn', 'info', 'debug'].forEach(method => {
        targetWindow.console[method] = function(...args) {
            // Call original console method
            originalConsole[method].apply(targetWindow.console, args);
            
            // Forward to parent
            if (targetWindow.parent && targetWindow.parent !== targetWindow) {
                try {
                    targetWindow.parent.postMessage({ 
                        type: 'k2-console', 
                        level: method,
                        message: args[0] || '',
                        args: args.slice(1)
                    }, '*');
                } catch (e) {
                    // Ignore cross-origin errors
                }
            }
        };
    });

    // Intercept uncaught errors
    targetWindow.addEventListener('error', (event) => {
        if (targetWindow.parent && targetWindow.parent !== targetWindow) {
            try {
                targetWindow.parent.postMessage({
                    type: 'k2-console',
                    level: 'error',
                    message: `Uncaught Error: ${event.error?.message || event.message}`,
                    args: [event.error?.stack || event.filename]
                }, '*');
            } catch (e) {
                // Ignore cross-origin errors
            }
        }
    });

    // Intercept unhandled promise rejections
    targetWindow.addEventListener('unhandledrejection', (event) => {
        if (targetWindow.parent && targetWindow.parent !== targetWindow) {
            try {
                targetWindow.parent.postMessage({
                    type: 'k2-console',
                    level: 'error',
                    message: `Unhandled Promise Rejection: ${event.reason}`,
                    args: []
                }, '*');
            } catch (e) {
                // Ignore cross-origin errors
            }
        }
    });
}