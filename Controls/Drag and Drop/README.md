# Drag and Drop Control

The Drag and Drop control replaces the legacy Multi File Upload component with a lightweight, responsive surface that mirrors the out-of-the-box K2 file input experience. Users can drag files directly into the control or click to trigger the browser file picker. Design-time and runtime logic are fully separated so the designer preview stays lightweight while runtime logic handles interaction.

## Highlights

- **Simple UX** – clean drop zone with keyboard, mouse, and drag support  
- **Click to browse** – mirrors native file input behavior  
- **Automatic preview** – selected file details replace the empty state  
- **Designer preview** – static visual with overlay indicators for Enabled/Read Only  
- **Responsive by default** – Shadow DOM layout + width overrides from `designtime_style.css`  
- **Standard properties** – Implements `Width`, `Height`, `IsVisible`, `IsEnabled`, `IsReadOnly` (false by default) following the guidance in `docs/Standard Properties.md`

## File Layout

```
Drag and Drop/
├── designtime_logic.js     # Preview-only markup + overlays
├── designtime_style.css    # K2 width overrides (forms/views)
├── runtime_logic.js        # Interactive drag-and-drop implementation
├── runtime_style.css       # Host-level defaults
├── manifest.json           # Metadata, properties, events
├── icon.svg                # Designer icon
└── README.md               # You are here
```

## Key Properties

| Property | Description | Default |
|---------|-------------|---------|
| `Watermark` | Primary instruction text inside the drop zone | `Upload File` |
| `Accept` | Comma-separated list of accepted file types passed to the native file input. Supports file extensions (e.g., `.pdf`, `.docx`) and MIME types (e.g., `image/*`, `image/png`, `application/pdf`). Examples: `.pdf,.doc,.docx` or `image/*,application/pdf` or `.pdf,image/png,image/jpeg` | empty |
| `Tooltip` | Title/aria-label applied to the drop surface. Falls back to the localized resource if left blank. | `Click here to attach a file` |
| `MaxSize` | Optional maximum file size. Accepts raw bytes (`5000000`) or shorthand with units (`5 MB`, `750 kb`). Values larger than the runtime ceiling are clamped to the backend fallback (5 GB). | empty |
| `ShowInformation` | Toggles the textual file details. When `false`, the control renders an icon-only experience. | `true` |
| `Borderless` | Removes the standard border and background so the control can blend into custom layouts. | `false` |
| `IsVisible` | Standard property – toggles host visibility | `true` |
| `IsEnabled` | Standard property – blocks interaction and shows overlay | `true` |
| `IsReadOnly` | Standard property – overlay plus no interactions | `false` |
| `Width` / `Height` | Standard sizing properties per responsive guidelines | empty |
| `Value` | JSON string describing selected files (name/size/type) | empty |

## Events

- `OnChanged` – fired when the selected file set changes (drag/drop or browse)  
- `OnFocus` / `OnBlur` – fired when the drop surface gains or loses focus  
- `OnEnter` – fired when the user presses Enter/Space on the focused drop zone

## Runtime Behavior

- Shadow DOM encapsulates structure and styling while `runtime_style.css` keeps the host element full-width.  
- Drop zone listens for drag enter/leave/drop plus click/keyboard interactions.  
- Files are captured one at a time; the drop surface flips to a file preview showing name, type, and size.  
- Files are serialized to JSON for downstream processing; no list data binding or SmartObject scaffolding remains.  
- Accessibility: drop zone uses `role="button"`, focus outlines, and status updates via a live region.  
- Overlays show Disabled or Read Only states without using z-index values, satisfying the guidance in `docs/Style Integration.md`.
- File validation enforces the runtime max size guard before emitting `OnChanged`. If no limit is supplied by the host, the control uses the backend fallback defined in `runtime_logic.js` (`DEFAULT_BACKEND_MAX_FILE_SIZE_BYTES = 5120 * 1024 * 1024`, i.e., 5 GB).
- Unsafe file types are rejected even if the Accept list would otherwise allow them. The hard-coded block list (also in `runtime_logic.js`) covers executable and script extensions such as `.exe`, `.dll`, `.bat`, `.cmd`, `.ps1`, `.js`, `.vbs`, `.jar`, `.msi`, `.reg`, and similar entries so only benign payloads reach the host logic.

## Usage Constraints

- The control only uploads files from the browser into downstream logic. It cannot download, stream, or hydrate files that already live on the K2 server.
- Pair it with SmartObject Create or Save methods where the runtime expects incoming file content. It is not suitable for SmartObject Load methods or any scenario where the control would need to render server-side file payloads back to the user.

## Suggested Use Cases

- SmartObject Create/Save methods that receive a single attachment payload serialized as JSON.
- Case or task forms that need a lightweight, accessible alternative to the legacy Multi File Upload control.
- Custom layouts that suppress captions (`ShowInformation = false`) or borders (`Borderless = true`) to integrate tightly with branded UI shells.

## Design-time Preview

`designtime_logic.js` renders a static card with the watermark text and overlays for Enabled/Read Only. No file APIs run at design-time, keeping the designer fast and deterministic.

## Responsive Notes

- `designtime_style.css` applies the documented form/view overrides so the control can stretch to 100% width.  
- Shadow DOM styles use `display: block` and `width: 100%` on `:host`, matching `docs/Responsive Controls.md`.  
- No z-index values ≥ 1 are used anywhere inside the control styles.

## Updating the Control

1. Adjust properties or events in `manifest.json`.  
2. Keep design-time and runtime logic separate—only runtime should touch drag/drop APIs.  
3. Follow the helper patterns in `docs/Standard Properties.md` when adding new standard property support.  
4. After changes, rebuild the `.zip` package if you distribute controls via the gallery.

## Icon Attribution

- **Asset**: `icon.svg`  
- **Collection**: Shopify Polaris Interface Icons  
- **License**: MIT License  
- **Author**: Shopify

Enjoy the cleaner Drag and Drop experience!  

