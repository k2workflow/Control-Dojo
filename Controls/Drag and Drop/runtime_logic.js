if (!window.__dragDropRuntimeLoaded) {
  window.__dragDropRuntimeLoaded = true;

/* Drag and Drop Control – Runtime */

/**
 * Localization System for Drag and Drop Control
 * 
 * This embedded localization system provides multi-language support for the control.
 * It automatically detects the user's browser language and falls back to English.
 * 
 * Supported Languages:
 * - English (en) - Default fallback
 * - Arabic (ar) - RTL support
 */
const DRAG_DROP_STRINGS = {
  en: {
    watermark: "Upload File",
    secondary: "Drag and drop or click to upload",
    replace: "Drag and drop or click to replace",
    fileUploadArea: "File upload area",
    tooltip: "Click here to attach a file",
    fileTooLarge: "{fileName} exceeds the maximum allowed size of {maxSize}."
  },
  ar: {
    watermark: "رفع ملف",
    secondary: "اسحب وأفلت أو انقر للرفع",
    replace: "اسحب وأفلت أو انقر للاستبدال",
    fileUploadArea: "منطقة رفع الملف",
    tooltip: "انقر هنا لإرفاق ملف",
    fileTooLarge: "{fileName} يتجاوز الحد الأقصى للحجم وهو {maxSize}."
  }
};

/**
 * Detects the user's browser language and returns the appropriate language code
 */
function dragDropDetectBrowserCulture() {
  try {
    const browserLang = navigator.language || navigator.userLanguage || 'en';
    const langCode = browserLang.split('-')[0].toLowerCase();
    
    if (DRAG_DROP_STRINGS[langCode]) {
      return langCode;
    }
  } catch (e) {
    console.warn('[DragDrop] Error detecting browser culture:', e);
  }
  
  return 'en';
}

/**
 * Gets a localized string for the specified key and culture
 */
function dragDropGetLocalizedString(key, culture = null) {
  const currentCulture = culture || dragDropDetectBrowserCulture();
  const strings = DRAG_DROP_STRINGS[currentCulture] || DRAG_DROP_STRINGS.en;
  return strings[key] || DRAG_DROP_STRINGS.en[key] || key;
}

/**
 * Checks if the specified culture uses right-to-left (RTL) text direction
 */
function dragDropIsRTLCulture(culture = null) {
  const currentCulture = culture || dragDropDetectBrowserCulture();
  return currentCulture === 'ar';
}

const DEFAULT_WATERMARK = 'Upload File';
const DEFAULT_SECONDARY = 'Drag and drop or click to upload';
const DEFAULT_REPLACE = 'Drag and drop or click to replace';

const FILE_ICON_MAP = {
      // Documents
      'pdf': '📕',
      'doc': '📄',
      'docx': '📄',
      'txt': '📝',
      'rtf': '📄',

      // Spreadsheets
      'xls': '📊',
      'xlsx': '📊',
      'csv': '📊',

      // Presentations
      'ppt': '🖥️',
      'pptx': '🖥️',

      // Images
      'jpg': '🖼️',
      'jpeg': '🖼️',
      'png': '🖼️',
      'gif': '🖼️',
      'bmp': '🖼️',
      'svg': '🖼️',
      'ico': '🖼️',
      'webp': '🖼️',

      // Videos
      'mp4': '🎬',
      'avi': '🎬',
      'mov': '🎬',
      'wmv': '🎬',
      'flv': '🎬',
      'webm': '🎬',
      'mkv': '🎬',

      // Audio
      'mp3': '🎧',
      'wav': '🎧',
      'wma': '🎧',
      'aac': '🎧',
      'flac': '🎧',
      'ogg': '🎧',
      'm4a': '🎧',

      // Archives
      'zip': '🗂️',
      'rar': '🗂️',
      '7z': '🗂️',
      'tar': '🗂️',
      'gz': '🗂️',

      // Code
      'js': '💻',
      'css': '💻',
      'html': '💻',
      'htm': '💻',
      'xml': '💻',
      'json': '💻',
      'php': '💻',
      'py': '💻',
      'java': '💻',
      'cpp': '💻',
      'c': '💻',
      'cs': '💻',
      'sql': '💻',

      // Other
      'exe': '⚙️',
      'msi': '⚙️',
      'dmg': '💽',
      'iso': '💽',
      'bin': '💽'
    };

const FILE_LABEL_MAP = {
      // Documents
      'pdf': 'PDF',
      'doc': 'DOC',
      'docx': 'DOC',
      'txt': 'TXT',
      'rtf': 'RTF',

      // Spreadsheets
      'xls': 'XLS',
      'xlsx': 'XLS',
      'csv': 'CSV',

      // Presentations
      'ppt': 'PPT',
      'pptx': 'PPT',

      // Images
      'jpg': 'IMG',
      'jpeg': 'IMG',
      'png': 'IMG',
      'gif': 'IMG',
      'bmp': 'IMG',
      'svg': 'IMG',
      'ico': 'IMG',
      'webp': 'IMG',

      // Videos
      'mp4': 'VID',
      'avi': 'VID',
      'mov': 'VID',
      'wmv': 'VID',
      'flv': 'VID',
      'webm': 'VID',
      'mkv': 'VID',

      // Audio
      'mp3': 'AUD',
      'wav': 'AUD',
      'wma': 'AUD',
      'aac': 'AUD',
      'flac': 'AUD',
      'ogg': 'AUD',
      'm4a': 'AUD',

      // Archives
      'zip': 'ZIP',
      'rar': 'RAR',
      '7z': '7Z',
      'tar': 'TAR',
      'gz': 'GZ',

      // Code
      'js': 'JS',
      'css': 'CSS',
      'html': 'HTML',
      'htm': 'HTML',
      'xml': 'XML',
      'json': 'JSON',
      'php': 'PHP',
      'py': 'PY',
      'java': 'JAVA',
      'cpp': 'CPP',
      'c': 'C',
      'cs': 'CS',
      'sql': 'SQL',

      // Other
      'exe': 'EXE',
      'msi': 'MSI',
      'dmg': 'DMG',
      'iso': 'ISO',
      'bin': 'BIN'
    };

const DEFAULT_BACKEND_MAX_FILE_SIZE_BYTES = 5120 * 1024 * 1024;
const DEFAULT_NOT_ALLOWED_FILE_TYPES = [
  'ade', 'adp', 'app', 'asa', 'ashx', 'asmx', 'asp', 'aspx', 'bas', 'bat',
  'cdx', 'cer', 'chm', 'class', 'cmd', 'cnt', 'com', 'config', 'cpl', 'crt',
  'cs', 'csh', 'der', 'dll', 'exe', 'fxp', 'gadget', 'grp', 'hlp', 'hpj',
  'hta', 'htr', 'htw', 'ida', 'idc', 'idq', 'inf', 'ins', 'isp', 'its', 'jar',
  'javascript', 'jscript', 'js', 'jse', 'json', 'ksh', 'lib', 'lnk', 'mad',
  'maf', 'mag', 'mam', 'maq', 'mar', 'mas', 'mat', 'mau', 'mav', 'maw', 'mcf',
  'mda', 'mdb', 'mde', 'mdt', 'mdw', 'mdz', 'msc', 'msh', 'msh1', 'msh1xml',
  'msh2', 'msh2xml', 'mshxml', 'msi', 'ms-one-stub', 'msp', 'mst', 'ocx',
  'ops', 'pcd', 'pif', 'pl', 'plg', 'prf', 'prg', 'printer', 'ps', 'ps1',
  'ps1xml', 'ps2', 'ps2xml', 'psc1', 'psc2', 'pst', 'reg', 'scf', 'scr',
  'sct', 'shb', 'shs', 'shtm', 'shtml', 'soap', 'stm', 'svc', 'sys', 'tmp',
  'url', 'vb', 'vbe', 'vbs', 'vbscript', 'vxd', 'vscript', 'vsix',
  'vsmacros', 'vsw', 'ws', 'wsc', 'wsf', 'wsh', 'xamlx', 'xnk'
];

function buildNotAllowedSet(extraList) {
  const blocked = new Set(DEFAULT_NOT_ALLOWED_FILE_TYPES);
  if (!extraList || typeof extraList !== 'string') {
    return blocked;
  }
  extraList.split(',')
    .map(entry => entry.trim().toLowerCase())
    .filter(Boolean)
    .forEach(ext => {
      const normalized = ext.startsWith('.') ? ext.slice(1) : ext;
      if (normalized) {
        blocked.add(normalized);
      }
    });
  return blocked;
}

function isExtensionDisallowed(ext, blockedSet) {
  if (!ext) return false;
  const normalized = ext.startsWith('.') ? ext.slice(1) : ext;
  return blockedSet.has(normalized.toLowerCase());
}
function safeRaisePropertyChanged(ctrl, prop) {
  try {
    if (window?.K2?.RaisePropertyChanged) {
      window.K2.RaisePropertyChanged(ctrl, prop);
    }
  } catch (err) {
    console.warn('RaisePropertyChanged failed:', err);
  }
}

function toBool(val, fallback = false) {
  if (val === undefined || val === null || val === '') return fallback;
  if (typeof val === 'boolean') return val;
  return val.toString().toLowerCase() === 'true';
}

function toCssDimension(val) {
  if (val === undefined || val === null || val === '') return '';
  return isNaN(val) ? String(val) : `${val}px`;
}

function formatFileSize(bytes) {
  if (typeof bytes !== 'number' || Number.isNaN(bytes) || bytes < 0) return '';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = bytes;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  const precision = unitIndex === 0 ? 0 : 2;
  return `${size.toFixed(precision)} ${units[unitIndex]}`;
}

function parseMaxSizeValue(value) {
  if (value === undefined || value === null) return 0;
  if (typeof value === 'number' && !Number.isNaN(value) && value > 0) {
    return value;
  }
  const raw = String(value).trim();
  if (!raw) return 0;
  const match = raw.match(/^(\d+(?:\.\d+)?)(\s*(b|kb|mb|gb|tb))?$/i);
  if (!match) return 0;
  const size = parseFloat(match[1]);
  if (Number.isNaN(size) || size <= 0) return 0;
  const unit = (match[3] || 'b').toLowerCase();
  const multipliers = {
    b: 1,
    kb: 1024,
    mb: 1024 * 1024,
    gb: 1024 * 1024 * 1024,
    tb: 1024 * 1024 * 1024 * 1024
  };
  const multiplier = multipliers[unit] || 1;
  return Math.round(size * multiplier);
}

function describeFile(entry) {
  if (!entry) return null;
  const name = entry.name || 'Unnamed file';
  const size = typeof entry.size === 'number' ? entry.size : parseInt(entry.size, 10) || 0;
  const type = entry.type || '';
  return { name, size, type };
}

function getExtension(name) {
  if (!name || typeof name !== 'string') return '';
  const parts = name.split('.');
  if (parts.length < 2) return '';
  return parts.pop().toLowerCase();
}

function getIconLabel(ext) {
  if (!ext) return 'FILE';
  if (FILE_ICON_MAP[ext]) {
    return FILE_ICON_MAP[ext];
  }
  if (FILE_LABEL_MAP[ext]) {
    return FILE_LABEL_MAP[ext];
  }
  return ext.toUpperCase();
}

function getFriendlyTypeName(ext) {
  if (!ext) return 'File';
  try {
    const proto = window?.K2BaseControl?.prototype;
    if (proto?.getContentTypeFriendlyName) {
      const friendly = proto.getContentTypeFriendlyName.call(proto, ext);
      return friendly?.replace?.('(', '')?.replace?.(')', '')?.trim() || friendly || `${ext.toUpperCase()} File`;
    }
  } catch (err) {
    console.warn('Friendly type lookup failed:', err);
  }
  return `${ext.toUpperCase()} File`;
}

function parseSerializedFiles(value) {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed.slice(0, 1).map(describeFile).filter(Boolean);
    }
  } catch {
    // ignore
  }
  return [];
}

function serializeFiles(files) {
  return JSON.stringify(
    (files || []).map(file => ({
      name: file.name,
      size: file.size,
      type: file.type
    }))
  );
}

function escapeXmlValue(value) {
  if (value === undefined || value === null) {
    return '';
  }
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function serializeFilesToCollection(files) {
  if (!Array.isArray(files) || files.length === 0) {
    return '';
  }

  const firstFile = files[0] || {};
  return `<collection><object><fields>` +
    `<field name='FileName'><value>${escapeXmlValue(firstFile.name)}</value></field>` +
    `<field name='FilePath'><value>${escapeXmlValue(firstFile.path || '')}</value></field>` +
    `<field name='FileSize'><value>${escapeXmlValue(firstFile.size || '')}</value></field>` +
    `<field name='MimeType'><value>${escapeXmlValue(firstFile.type || '')}</value></field>` +
    `</fields></object></collection>`;
}

function parseCollectionValue(value) {
  if (!value || typeof value !== 'string' || value.indexOf('<collection') === -1) {
    return [];
  }

  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(value, 'text/xml');
    if (xmlDoc.querySelector('parsererror')) {
      return [];
    }

    const objects = Array.from(xmlDoc.querySelectorAll('collection object'));
    return objects
      .map(obj => {
        const getFieldValue = (fieldName) => {
          const field = obj.querySelector(`field[name='${fieldName}'] value`);
          return field ? field.textContent || '' : '';
        };

        const sizeValue = parseInt(getFieldValue('FileSize'), 10);
        return {
          name: getFieldValue('FileName'),
          path: getFieldValue('FilePath'),
          size: Number.isNaN(sizeValue) ? 0 : sizeValue,
          type: getFieldValue('MimeType')
        };
      })
      .filter(file => file.name);
  } catch {
    return [];
  }
}

function parseIncomingFileValue(value) {
  if (!value) return [];
  const trimmed = typeof value === 'string' ? value.trim() : '';
  if (!trimmed) return [];
  if (trimmed.startsWith('<collection')) {
    return parseCollectionValue(trimmed);
  }
  return parseSerializedFiles(trimmed);
}

function parseAcceptString(acceptString) {
  if (!acceptString || !acceptString.trim()) {
    return null; // No restrictions
  }
  
  const parts = acceptString.split(',').map(s => s.trim()).filter(Boolean);
  const extensions = [];
  const mimeTypes = [];
  const mimeWildcards = [];
  
  for (const part of parts) {
    if (part.startsWith('.')) {
      // File extension: .pdf, .docx
      extensions.push(part.toLowerCase());
    } else if (part.includes('/*')) {
      // MIME wildcard: image/*, application/*
      mimeWildcards.push(part.split('/')[0]);
    } else if (part.includes('/')) {
      // Specific MIME type: image/png, application/pdf
      mimeTypes.push(part.toLowerCase());
    }
  }
  
  return { extensions, mimeTypes, mimeWildcards };
}

function isFileTypeAllowed(file, acceptConfig) {
  if (!acceptConfig) return true; // No restrictions
  
  const fileName = (file.name || '').toLowerCase();
  const fileType = (file.type || '').toLowerCase();
  
  // Check file extension
  for (const ext of acceptConfig.extensions) {
    if (fileName.endsWith(ext)) {
      return true;
    }
  }
  
  // Check specific MIME types
  if (fileType && acceptConfig.mimeTypes.includes(fileType)) {
    return true;
  }
  
  // Check MIME wildcards
  if (fileType) {
    const [type] = fileType.split('/');
    if (acceptConfig.mimeWildcards.includes(type)) {
      return true;
    }
  }
  
  return false;
}

function getAcceptDisplayText(acceptString) {
  if (!acceptString || !acceptString.trim()) {
    return 'any file type';
  }
  
  const parts = acceptString.split(',').map(s => s.trim()).filter(Boolean);
  if (parts.length === 1) {
    return parts[0];
  } else if (parts.length <= 3) {
    return parts.join(', ');
  } else {
    return `${parts.slice(0, 2).join(', ')}, and ${parts.length - 2} more`;
  }
}

if (!window.customElements.get('drag-drop-control')) {
  window.customElements.define('drag-drop-control', class DragDropControl extends K2BaseControl {
    constructor() {
      super();
      this._culture = null;
      this._watermark = ''; // Will use localized default in render
      this._accept = '';
      this._tooltip = '';
      this._maxSizeInput = '';
      this._maxSizeBytes = DEFAULT_BACKEND_MAX_FILE_SIZE_BYTES;
      this._blockedFileTypes = buildNotAllowedSet('');
      this._isVisible = true;
      this._isEnabled = true;
      this._isReadOnly = false;
      this._showInformation = true;
      this._isBorderless = false;
      this._width = '';
      const initialHeight = this.getAttribute('height');
      this._height = initialHeight || '70px';
      if (!initialHeight) {
        this.setAttribute('height', '70px');
      }
      this._value = '';
      this._files = [];
      this._hasRendered = false;
      this._resizeObserver = null;
      this._isUploading = false;
      this._renderRoot = null;
    }

    checkExists(value) {
      return value !== undefined && value !== null;
    }

    checkExistsNotEmpty(value) {
      return this.checkExists(value) && value !== '';
    }

    ensureControlIdentifier() {
      if (this.id && this.id.toString().trim()) {
        return this.id;
      }
      const fallbackId = this.getAttribute('name')
        || this.dataset?.controlId
        || `drag-drop-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      this.id = fallbackId;
      return this.id;
    }

    static get observedAttributes() {
      return [
        'watermark',
        'accept',
        'tooltip',
        'maxsize',
        'showinformation',
        'borderless',
        'value',
        'width',
        'height',
        'isvisible',
        'isenabled',
        'isreadonly'
      ];
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if (oldValue === newValue) return;
      switch (name) {
        case 'watermark':
          this.Watermark = newValue;
          break;
        case 'accept':
          this.Accept = newValue;
          break;
        case 'tooltip':
          this.Tooltip = newValue;
          break;
        case 'maxsize':
          this.MaxSize = newValue;
          break;
        case 'showinformation':
          this.ShowInformation = newValue;
          break;
        case 'borderless':
          this.Borderless = newValue;
          break;
        case 'value':
          this.Value = newValue;
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
          break;
      }
    }

    connectedCallback() {
      this.ensureControlIdentifier();
      this._culture = dragDropDetectBrowserCulture();
      const isRTL = dragDropIsRTLCulture(this._culture);
      this.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
      this.classList.add(isRTL ? 'rtl' : 'ltr');
      super.connectedCallback();
    }

    ensureShadow() {
      if (!this._renderRoot) {
        this._renderRoot = document.createElement('div');
        this._renderRoot.classList.add('drag-drop-runtime-root');
      }

      if (this._renderRoot.parentNode !== this) {
        while (this.firstChild) {
          this.removeChild(this.firstChild);
        }
        this.appendChild(this._renderRoot);
      }

      this._shadow = this._renderRoot;
    }

    disconnectedCallback() {
      if (this._dropHandler) {
        this._dropZone?.removeEventListener('drop', this._dropHandler);
      }
      if (this._dragOverHandler) {
        this._dropZone?.removeEventListener('dragover', this._dragOverHandler);
      }
      if (this._dragLeaveHandler) {
        this._dropZone?.removeEventListener('dragleave', this._dragLeaveHandler);
      }
      if (this._resizeObserver) {
        this._resizeObserver.disconnect();
        this._resizeObserver = null;
      }
      // Clean up error popup
      this._removeErrorPopup();
      super.disconnectedCallback();
    }

    /* Standard K2 properties */
    set Property(objInfo) {
      try {
        if (!objInfo || !objInfo.property) return;
        const property = objInfo.property.toLowerCase();
        const value = objInfo.Value;

        switch (property) {
          case 'value':
            this.Value = objInfo;
            break;
          case 'width':
            this.Width = value;
            break;
          case 'height':
            this.Height = value;
            break;
          case 'isvisible':
            this.IsVisible = value;
            break;
          case 'isenabled':
            this.IsEnabled = value;
            break;
          case 'isreadonly':
            this.IsReadOnly = value;
            break;
          case 'watermark':
            this.Watermark = value;
            break;
          case 'accept':
            this.Accept = value;
            break;
          case 'tooltip':
            this.Tooltip = value;
            break;
          case 'maxsize':
            this.MaxSize = value;
            break;
          case 'showinformation':
            this.ShowInformation = value;
            break;
          case 'borderless':
            this.Borderless = value;
            break;
          default:
            this.setAttribute(objInfo.property, value);
            break;
        }
      } catch (err) {
        console.error('Error setting property:', err);
      }
    }

    getProperty(objInfo) {
      try {
        if (!objInfo || !objInfo.property) return '';
        const property = objInfo.property.toLowerCase();
        switch (property) {
          case 'value':
            return this.Value;
          case 'width':
            return this.Width;
          case 'height':
            return this.Height;
          case 'isvisible':
            return this.IsVisible;
          case 'isenabled':
            return this.IsEnabled;
          case 'isreadonly':
            return this.IsReadOnly;
          case 'watermark':
            return this.Watermark;
          case 'accept':
            return this.Accept;
          case 'tooltip':
            return this.Tooltip;
          case 'maxsize':
            return this.MaxSize;
          case 'showinformation':
            return this.ShowInformation;
          case 'borderless':
            return this.Borderless;
          default:
            return this.getAttribute(objInfo.property) || '';
        }
      } catch (err) {
        console.error('Error getting property:', err);
        return '';
      }
    }

    get Watermark() {
      return this._watermark;
    }
    set Watermark(val) {
      // If watermark is empty, use localized default
      const culture = this._culture || dragDropDetectBrowserCulture();
      const defaultWatermark = dragDropGetLocalizedString('watermark', culture);
      const next = val && val.trim() ? val : defaultWatermark;
      if (this._watermark === next) return;
      this._watermark = next;
      if (this.getAttribute('watermark') !== next) {
        this.setAttribute('watermark', next);
      }
      if (this._hasRendered) {
        this._watermarkText.textContent = this._watermark;
      }
      safeRaisePropertyChanged(this, 'Watermark');
    }

    get Accept() {
      return this._accept;
    }
    set Accept(val) {
      const next = val || '';
      if (this._accept === next) return;
      this._accept = next;
      if (this.getAttribute('accept') !== next) {
        this.setAttribute('accept', next);
      }
      if (this._hasRendered && this._fileInput) {
        this._fileInput.accept = this._accept;
      }
      // Clear any existing errors when accept changes
      if (this._hasRendered) {
        this.clearFileTypeError();
      }
      safeRaisePropertyChanged(this, 'Accept');
    }

    get Tooltip() {
      return this._tooltip || '';
    }
    set Tooltip(val) {
      const next = val ? String(val) : '';
      if (this._tooltip === next) return;
      this._tooltip = next;
      if (this.getAttribute('tooltip') !== next) {
        this.setAttribute('tooltip', next);
      }
      if (this._hasRendered) {
        this.applyTooltip();
      }
      safeRaisePropertyChanged(this, 'Tooltip');
    }

    get MaxSize() {
      return this._maxSizeInput || '';
    }
    set MaxSize(val) {
      const next = val ? String(val) : '';
      if (this._maxSizeInput === next) return;
      this._maxSizeInput = next;
      const parsed = parseMaxSizeValue(next);
      if (parsed > 0) {
        this._maxSizeBytes = Math.min(parsed, DEFAULT_BACKEND_MAX_FILE_SIZE_BYTES);
      } else {
        this._maxSizeBytes = DEFAULT_BACKEND_MAX_FILE_SIZE_BYTES;
      }
      if (this.getAttribute('maxsize') !== next) {
        this.setAttribute('maxsize', next);
      }
      safeRaisePropertyChanged(this, 'MaxSize');
    }


    get ShowInformation() {
      return this._showInformation;
    }
    set ShowInformation(val) {
      const next = toBool(val, true);
      if (this._showInformation === next) return;
      this._showInformation = next;
      this.setAttribute('showinformation', next);
      if (this._hasRendered) {
        this.updateShowInformationState();
        this.updatePreview();
      }
      safeRaisePropertyChanged(this, 'ShowInformation');
    }

    get Borderless() {
      return this._isBorderless;
    }
    set Borderless(val) {
      const next = toBool(val, false);
      if (this._isBorderless === next) return;
      this._isBorderless = next;
      this.setAttribute('borderless', next);
      if (this._hasRendered) {
        this.updateBorderlessState();
      }
      safeRaisePropertyChanged(this, 'Borderless');
    }

    get Value() {
      return this._value || '';
    }
    set Value(val) {
      const incoming = typeof val === 'object' && val !== null && Object.prototype.hasOwnProperty.call(val, 'Value')
        ? (val.Value || '')
        : (val || '');
      if (incoming === this._value) return;
      this._value = incoming || '';
      this._files = parseIncomingFileValue(this._value);
      this.updatePreview();
      safeRaisePropertyChanged(this, 'Value');
    }

    getValue() {
      return this.Value;
    }

    setValue(value) {
      this.Value = value;
    }

    get Width() {
      return this._width;
    }
    set Width(val) {
      this._width = val || '';
      if (this.getAttribute('width') !== this._width && this._width) {
        this.setAttribute('width', this._width);
      }
      this.updateDimensions();
      safeRaisePropertyChanged(this, 'Width');
    }

    get Height() {
      return this._height;
    }
    set Height(val) {
      this._height = val || '';
      if (this.getAttribute('height') !== this._height && this._height) {
        this.setAttribute('height', this._height);
      }
      this.updateDimensions();
      safeRaisePropertyChanged(this, 'Height');
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
      safeRaisePropertyChanged(this, 'IsVisible');
    }

    get IsEnabled() {
      return this._isEnabled;
    }
    set IsEnabled(val) {
      this._isEnabled = val === 'true' || val === true;
      this.setAttribute('isenabled', val);
      if (this._hasRendered) this.updateInteractivity();
      safeRaisePropertyChanged(this, 'IsEnabled');
    }

    get IsReadOnly() {
      return this._isReadOnly;
    }
    set IsReadOnly(val) {
      this._isReadOnly = val === 'true' || val === true;
      this.setAttribute('isreadonly', val);
      if (this._hasRendered) this.updateInteractivity();
      safeRaisePropertyChanged(this, 'IsReadOnly');
    }

    _render() {
      if (this._hasRendered) {
        this.updatePreview();
        this.updateInteractivity();
        return;
      }
      
      // Get localized strings
      const culture = this._culture || dragDropDetectBrowserCulture();
      const localizedWatermark = this._watermark && this._watermark.trim() 
        ? this._watermark.trim() 
        : dragDropGetLocalizedString('watermark', culture);
      const localizedSecondary = dragDropGetLocalizedString('secondary', culture);
      const localizedReplace = dragDropGetLocalizedString('replace', culture);
      const localizedAriaLabel = dragDropGetLocalizedString('fileUploadArea', culture);
      const localizedTooltip = this._tooltip && this._tooltip.trim()
        ? this._tooltip.trim()
        : dragDropGetLocalizedString('tooltip', culture);
      
      this._shadow.innerHTML = `
        <div class="drag-drop-root">
          <div class="drop-zone" role="button" tabindex="0" aria-label="${localizedAriaLabel}" title="${localizedTooltip}">
            <div class="drop-icon" aria-hidden="true">
              <svg viewBox="0 0 64 64">
                <rect x="12" y="20" width="40" height="32" rx="6" />
                <path d="M20 24v-6a6 6 0 0 1 6-6h12a6 6 0 0 1 6 6v6" />
                <path d="M24 36l8-8 8 8" />
                <path d="M32 28v16" />
              </svg>
              <span class="file-indicator"></span>
            </div>
            <div class="drop-copy">
              <div class="empty-state" aria-hidden="false">
                <span class="primary">${localizedWatermark}</span>
                <span class="secondary">${localizedSecondary}</span>
              </div>
              <div class="file-preview" aria-hidden="true">
                <div class="file-name-container">
                  <span class="file-name"></span>
                  <button type="button" class="download-file-button" title="Download file" aria-label="Download file" style="display: none;">
                    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                      <path d="M12 2v16m0 0l-5-5m5 5l5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                      <path d="M2 20h20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                  </button>
                </div>
                <span class="file-meta"></span>
                <span class="file-helper">${localizedReplace}</span>
              </div>
            </div>
            <input type="file" class="file-input" tabindex="-1" aria-hidden="true" />
            <button type="button" class="clear-upload-button" title="Remove file" aria-label="Remove file">
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M8 8L16 16" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M16 8L8 16" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
          </div>
          <div class="action-buttons-container" aria-hidden="true">
            <button type="button" class="external-download-button" title="Download file" aria-label="Download file">
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M12 2v16m0 0l-5-5m5 5l5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                <path d="M2 20h20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
            <button type="button" class="external-clear-button" title="Remove file" aria-label="Remove file">
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M8 8L16 16" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M16 8L8 16" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
          </div>
          <div class="state-overlay" aria-hidden="true"></div>
          <div role="status" aria-live="polite" aria-atomic="true" class="status-announcer" style="position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;"></div>
        </div>
      `;

      this._root = this._shadow.querySelector('.drag-drop-root');
      this._dropZone = this._shadow.querySelector('.drop-zone');
      this._watermarkText = this._shadow.querySelector('.empty-state .primary');
      this._emptyState = this._shadow.querySelector('.empty-state');
      this._preview = this._shadow.querySelector('.file-preview');
      this._previewName = this._shadow.querySelector('.file-preview .file-name');
      this._previewMeta = this._shadow.querySelector('.file-preview .file-meta');
      this._downloadButton = this._shadow.querySelector('.download-file-button');
      this._iconLabel = this._shadow.querySelector('.file-indicator');
      this._fileInput = this._shadow.querySelector('.file-input');
      this._clearButton = this._shadow.querySelector('.clear-upload-button');
      this._overlay = this._shadow.querySelector('.state-overlay');
      this._statusAnnouncer = this._shadow.querySelector('.status-announcer');
      this._externalActionContainer = this._shadow.querySelector('.action-buttons-container');
      this._externalDownloadButton = this._shadow.querySelector('.external-download-button');
      this._externalClearButton = this._shadow.querySelector('.external-clear-button');
      this._errorPopup = null; // Will be created dynamically and appended to form
      this._popupPositionHandler = null;
      this._containerPositionModified = false;
      this._previewNameClickHandler = null; // Store click handler reference

      // Watermark is already set in template with localized value
      // But update it if custom watermark was provided
      if (this._watermarkText && this._watermark && this._watermark.trim()) {
        const culture = this._culture || dragDropDetectBrowserCulture();
        const displayWatermark = this._watermark.trim() || dragDropGetLocalizedString('watermark', culture);
        this._watermarkText.textContent = displayWatermark;
      }
      if (this._fileInput) {
        this._fileInput.accept = this._accept;
      }
      this.applyTooltip();
      this.updateDimensions();
      this.updateShowInformationState();
      this.updateBorderlessState();
      this.updatePreview();
      this.updateInteractivity();

      this.registerEvents();
      this._hasRendered = true;
      
      // Set up resize observer after initial render
      requestAnimationFrame(() => {
        this._setupResizeObserver();
      });
    }

    registerEvents() {
      if (!this._dropZone || !this._fileInput) return;

      this._dropZone.addEventListener('click', () => {
        if (!this.canInteract()) return;
        this._fileInput.click();
      });

      this._dropZone.addEventListener('focus', () => {
        this.dispatchEvent(new Event('OnFocus'));
      });

      this._dropZone.addEventListener('blur', () => {
        this.dispatchEvent(new Event('OnBlur'));
      });

      this._dropZone.addEventListener('keydown', (event) => {
        if (!this.canInteract()) return;
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          this._fileInput.click();
          this.dispatchEvent(new Event('OnEnter'));
        }
      });

      this._fileInput.addEventListener('change', async (event) => {
        if (!event.target?.files) return;
        await this.applyFiles(event.target.files);
        event.target.value = '';
      });

      this._dragOverHandler = (event) => {
        if (!this.canInteract()) return;
        event.preventDefault();
        this._dropZone.classList.add('dragover');
      };
      this._dropZone.addEventListener('dragover', this._dragOverHandler);

      this._dragLeaveHandler = () => {
        this._dropZone.classList.remove('dragover');
      };
      this._dropZone.addEventListener('dragleave', this._dragLeaveHandler);

      this._dropHandler = async (event) => {
        if (!this.canInteract()) return;
        event.preventDefault();
        this._dropZone.classList.remove('dragover');
        if (event.dataTransfer?.files?.length) {
          await this.applyFiles(event.dataTransfer.files);
        }
      };
      this._dropZone.addEventListener('drop', this._dropHandler);

      if (this._clearButton) {
        this._clearButton.addEventListener('click', (event) => {
          event.preventDefault();
          event.stopPropagation();
          this.clearSelectedFile();
        });
      }

      // Wire up external buttons for icon-only mode
      if (this._externalClearButton) {
        this._externalClearButton.addEventListener('click', (event) => {
          event.preventDefault();
          event.stopPropagation();
          this.clearSelectedFile();
        });
      }

      if (this._externalDownloadButton) {
        this._externalDownloadButton.addEventListener('click', (event) => {
          event.preventDefault();
          event.stopPropagation();
          if (this._files && this._files.length > 0) {
            this.onFileItemClick(event, this._files[0]);
          }
        });
      }
    }

    canInteract() {
      return this._isEnabled && !this._isReadOnly && !this._isUploading;
    }

    async applyFiles(fileList) {
      if (!fileList || fileList.length === 0) return;
      
      const file = fileList[0];
      const fileExtension = getExtension(file?.name);
      if (isExtensionDisallowed(fileExtension, this._blockedFileTypes || buildNotAllowedSet(''))) {
        this.showBlockedFileExtensionError(file, fileExtension);
        return;
      }
      const acceptConfig = parseAcceptString(this._accept);
      
      // Validate file type
      if (!isFileTypeAllowed(file, acceptConfig)) {
        this.showFileTypeError(file, acceptConfig);
        return; // Block the upload
      }

      const numericSize = typeof file.size === 'number' ? file.size : parseInt(file.size, 10) || 0;
      if (this._maxSizeBytes > 0 && numericSize > this._maxSizeBytes) {
        this.showFileSizeError(file);
        return;
      }
      
      // Clear any previous errors
      this.clearFileTypeError();
      
      // Process valid file
      try {
        this._isUploading = true;
        this.updateInteractivity();
        const uploadedFile = await this._uploadAndDescribeFile(file);
        const files = [uploadedFile];
        this.Value = serializeFilesToCollection(files);
        
        // Announce successful upload to screen readers
        if (this._statusAnnouncer && uploadedFile.name) {
          this._statusAnnouncer.textContent = `File uploaded successfully: ${uploadedFile.name}`;
          // Clear after announcement
          setTimeout(() => {
            if (this._statusAnnouncer) {
              this._statusAnnouncer.textContent = '';
            }
          }, 2000);
        }
        
        this.dispatchEvent(new CustomEvent('OnChanged', {
          detail: {
            value: this._value,
            files
          },
          bubbles: true
        }));
      } catch (error) {
        console.error('DragDrop upload failed:', error);
        this.displayValidationError('File upload failed. Please try again.');
      } finally {
        this._isUploading = false;
        this.updateInteractivity();
      }
    }

    clearSelectedFile() {
      if (!this.canInteract()) return;
      if (!Array.isArray(this._files) || this._files.length === 0) return;

      // Remove click handler if present
      if (this._previewNameClickHandler && this._previewName) {
        this._previewName.removeEventListener('click', this._previewNameClickHandler);
        this._previewNameClickHandler = null;
      }

      // Hide download button
      if (this._downloadButton) {
        this._downloadButton.style.display = 'none';
        this._downloadButton.onclick = null;
      }

      this._files = [];
      this.clearFileTypeError();
      if (this._fileInput) {
        this._fileInput.value = '';
      }
      this.Value = '';
      this.dispatchEvent(new CustomEvent('OnChanged', {
        detail: { value: this._value, files: [] },
        bubbles: true
      }));
    }

    async _uploadAndDescribeFile(file) {
      if (!file) {
        throw new Error('No file provided for upload.');
      }
      const controlId = this.ensureControlIdentifier();
      if (!controlId) {
        throw new Error('Control ID is required to upload files.');
      }
      const response = await this._uploadFileWithFallback(controlId, file);
      if (!response?.ok) {
        throw new Error(`Upload failed with status ${response?.status || 'unknown'}`);
      }
      const payload = await response.text();
      if (!payload || payload.indexOf('|') === -1) {
        throw new Error('Unexpected upload response format.');
      }
      const [filePath, mimeType, fileSize] = payload.split('|', 3);
      return this._finishUploadFile(file, filePath, fileSize, mimeType);
    }

    _finishUploadFile(file, filePath, fileLength, mimeTypeOverride) {
      const fallbackName = file?.name || 'UploadedFile';
      const fileNameFromPath = filePath
        ? filePath.substring(filePath.lastIndexOf('\\') + 1)
        : fallbackName;
      const parsedSize = parseInt(fileLength, 10);
      const ext = getExtension(fileNameFromPath);
      const friendlyType = this.getContentTypeFriendlyName(ext) || '';
      return {
        name: fileNameFromPath,
        path: filePath || '',
        size: Number.isNaN(parsedSize) ? (file?.size || 0) : parsedSize,
        type: mimeTypeOverride || file?.type || friendlyType
      };
    }

    /**
     * Handle file item click for download
     * @param {Event} e - Click event
     * @param {Object} file - File object with name, path, size, type properties
     */
    onFileItemClick(e, file) {
      if (!file || !file.path) return;

      // Create file info object compatible with base control's downloadFile method
      const fileInfo = {
        filePath: file.path,
        fileName: file.name,
        fileDataURL: file.dataURL || null,
        fileRequestData: null
      };

      // Call base class method with file info
      if (this.downloadFile) {
        this.downloadFile(e, fileInfo);
      }
    }

    updatePreview() {
      if (!this._dropZone) return;
      const hasFile = Array.isArray(this._files) && this._files.length > 0;
      this._dropZone.classList.toggle('has-file', hasFile);
      const showInfoBlocks = this._showInformation;
      const previewVisible = hasFile && showInfoBlocks;
      const emptyVisible = !hasFile && showInfoBlocks;
      if (this._preview) {
        this._preview.setAttribute('aria-hidden', previewVisible ? 'false' : 'true');
        this._preview.style.display = previewVisible ? '' : 'none';
      }
      if (this._emptyState) {
        this._emptyState.setAttribute('aria-hidden', emptyVisible ? 'false' : 'true');
        this._emptyState.style.display = emptyVisible ? '' : 'none';
      }
      // Handle internal clear button (for full details mode)
      if (this._clearButton) {
        const showClear = hasFile && this.canInteract() && showInfoBlocks;
        this._clearButton.hidden = !showClear;
      }
      
      // Handle external action buttons (for icon-only mode)
      const isIconOnly = !showInfoBlocks;
      if (this._externalActionContainer) {
        const showExternal = isIconOnly && hasFile && this.canInteract();
        this._externalActionContainer.setAttribute('aria-hidden', showExternal ? 'false' : 'true');
        this._externalActionContainer.style.display = showExternal ? 'flex' : 'none';
      }
      
      if (this._externalDownloadButton) {
        const file = hasFile ? this._files[0] : null;
        const showDownload = isIconOnly && file && file.path;
        this._externalDownloadButton.hidden = !showDownload;
        if (showDownload && file) {
          this._externalDownloadButton.setAttribute('aria-label', `Download ${file.name}`);
        }
      }
      
      if (this._externalClearButton) {
        this._externalClearButton.hidden = !(isIconOnly && hasFile && this.canInteract());
      }
      
      let currentFile = null;
      if (this._previewName && this._previewMeta) {
        if (hasFile) {
          const file = this._files[0];
          currentFile = file;
          const ext = getExtension(file.name);
          const friendlyType = getFriendlyTypeName(ext);
          
          // Update file name (no longer clickable - download button handles it)
          this._previewName.textContent = file.name;
          this._previewName.style.cursor = '';
          this._previewName.title = '';
          
          // Remove existing click handler from name if present
          if (this._previewNameClickHandler) {
            this._previewName.removeEventListener('click', this._previewNameClickHandler);
            this._previewNameClickHandler = null;
          }
          
          // Show/hide download button based on file path
          if (file.path && this._downloadButton) {
            this._downloadButton.style.display = 'flex';
            // Set accessible name and description
            const fileId = `file-name-${this.id || 'drag-drop'}`;
            this._previewName.id = fileId;
            this._downloadButton.setAttribute('aria-label', `Download ${file.name}`);
            this._downloadButton.setAttribute('aria-describedby', fileId);
            // Remove existing handler if present
            const oldHandler = this._downloadButton.onclick;
            if (oldHandler) {
              this._downloadButton.onclick = null;
            }
            // Add new handler
            this._downloadButton.onclick = (e) => {
              e.stopPropagation();
              e.preventDefault();
              this.onFileItemClick(e, file);
            };
          } else if (this._downloadButton) {
            this._downloadButton.style.display = 'none';
            this._downloadButton.onclick = null;
            if (this._previewName) {
              this._previewName.removeAttribute('id');
            }
          }
          
          // Announce file name to screen readers
          if (this._statusAnnouncer && file.name) {
            this._statusAnnouncer.textContent = `File selected: ${file.name}`;
            // Clear after announcement
            setTimeout(() => {
              if (this._statusAnnouncer) {
                this._statusAnnouncer.textContent = '';
              }
            }, 1000);
          }
          
          const metaParts = [];
          metaParts.push(friendlyType);
          if (file.type) {
            metaParts.push(file.type);
          }
          // Only show file size if it exists and is not 0
          const formattedSize = formatFileSize(file.size);
          if (formattedSize && file.size !== 0 && this.checkExists(file.size)) {
            metaParts.push(formattedSize);
          }
          this._previewMeta.textContent = metaParts.join(' • ');
          if (this._iconLabel) {
            this._iconLabel.textContent = getIconLabel(ext);
          }
        } else {
          this._previewName.textContent = '';
          this._previewMeta.textContent = '';
          if (this._previewName) {
            this._previewName.removeAttribute('id');
          }
          if (this._iconLabel) {
            this._iconLabel.textContent = '';
          }
        }
      }

      const shouldShowCompactTooltip = hasFile && this._root?.classList.contains('compact-mode');
      if (shouldShowCompactTooltip && currentFile) {
        const ext = getExtension(currentFile.name);
        const friendlyType = getFriendlyTypeName(ext);
        const formattedSize = formatFileSize(currentFile.size);
        const tooltipParts = [currentFile.name, friendlyType, formattedSize].filter(Boolean);
        const tooltipText = tooltipParts.join(' • ');
        this.applyTooltip(tooltipText, tooltipText);
      } else {
        this.applyTooltip();
      }
    }

    async _uploadFileWithFallback(controlId, file) {
      const fileHandler = typeof document !== 'undefined'
        ? document.getElementById('FileHandler')
        : null;
      if (fileHandler && fileHandler.value) {
        return super.uploadFile(controlId, file);
      }

      const safeName = file?.name || 'UploadedFile';
      const mimeType = file?.type || 'application/octet-stream';
      const size = typeof file?.size === 'number' ? file.size : parseInt(file?.size, 10) || 0;
      const payload = `${safeName}|${mimeType}|${size}`;

      return {
        ok: true,
        status: 200,
        statusText: 'OK',
        text: async () => payload
      };
    }

    updateDimensions() {
      if (!this._root) return;
      if (this._width) {
        this.style.width = toCssDimension(this._width);
      } else {
        this.style.width = '';
      }
      if (this._height) {
        this.style.height = toCssDimension(this._height);
        this._root.style.minHeight = '100%';
      } else {
        this.style.height = '';
        this._root.style.minHeight = '';
      }
    }

    updateShowInformationState() {
      if (!this._root || !this._dropZone) return;
      const iconOnly = !this._showInformation;
      this._root.classList.toggle('icon-only', iconOnly);
      this._dropZone.classList.toggle('icon-only', iconOnly);
    }

    updateBorderlessState() {
      if (!this._root) return;
      this._root.classList.toggle('borderless', this._isBorderless);
    }

    applyTooltip(customText = null, ariaLabelOverride = null) {
      if (!this._dropZone) return;
      const culture = this._culture || dragDropDetectBrowserCulture();
      const fallback = dragDropGetLocalizedString('tooltip', culture);
      const defaultText = this._tooltip && this._tooltip.trim() ? this._tooltip.trim() : (fallback || '');
      const tooltipText = customText ?? defaultText;
      const ariaLabel = ariaLabelOverride || tooltipText || dragDropGetLocalizedString('fileUploadArea', culture);
      this._dropZone.setAttribute('title', tooltipText);
      this._dropZone.setAttribute('aria-label', ariaLabel);
    }

    _setupResizeObserver() {
      if (!this._root || !window.ResizeObserver) return;

      // Clean up existing observer
      if (this._resizeObserver) {
        this._resizeObserver.disconnect();
      }

      this._resizeObserver = new ResizeObserver(entries => {
        for (const entry of entries) {
          const height = entry.contentRect.height;
          const width = entry.contentRect.width;
          if (width > 0 && height > 0) {
            const iconSize = Math.min(Math.max(Math.min(width, height), 64), 400);
            this._root.style.setProperty('--icon-only-size', `${iconSize}px`);
          }

          // Remove existing mode classes
          this._root.classList.remove('compact-mode', 'small-mode', 'narrow-mode');

          // Apply appropriate mode based on height
          if (height > 0 && height < 100) {
            this._root.classList.add('small-mode', 'compact-mode');
          } else if (height >= 100 && height <= 150) {
            this._root.classList.add('compact-mode');
          }

          // Apply narrow mode for constrained width
          if (width > 0 && width < 200) {
            this._root.classList.add('narrow-mode');
          }
        }
      });

      this._resizeObserver.observe(this._root);
    }

    updateInteractivity() {
      if (!this._root || !this._dropZone) return;
      const interactive = this._isEnabled && !this._isReadOnly && !this._isUploading;
      
      // Disable interactions
      this._dropZone.style.pointerEvents = interactive ? '' : 'none';
      this._dropZone.setAttribute('aria-disabled', interactive ? 'false' : 'true');
      this._dropZone.tabIndex = interactive ? 0 : -1;
      
      // Visual state
      this._root.classList.toggle('is-disabled', !this._isEnabled);
      this._root.classList.toggle('is-readonly', this._isReadOnly);

      if (this._fileInput) {
        this._fileInput.disabled = !interactive;
      }
      if (this._clearButton) {
        this._clearButton.disabled = !interactive;
        if (!interactive) {
          this._clearButton.hidden = true;
        } else {
          const hasFile = Array.isArray(this._files) && this._files.length > 0;
          const showInfoBlocks = this._showInformation;
          this._clearButton.hidden = !(hasFile && showInfoBlocks);
        }
      }

      // Handle external buttons
      if (this._externalDownloadButton) {
        this._externalDownloadButton.disabled = !interactive;
      }
      if (this._externalClearButton) {
        this._externalClearButton.disabled = !interactive;
      }

      if (this._overlay) {
        const overlayVisible = !this._isEnabled || this._isReadOnly;
        this._overlay.setAttribute('aria-hidden', overlayVisible ? 'false' : 'true');
      }
    }

    showBlockedFileExtensionError(file, extension) {
      if (!this._root || !this._dropZone) return;
      const fileName = file?.name || 'This file';
      const extensionLabel = extension ? `.${extension}` : 'this file type';
      const errorMessage = `${fileName} cannot be uploaded because ${extensionLabel} files are blocked.`;
      this.displayValidationError(errorMessage);
      this.dispatchEvent(new CustomEvent('BlockedFileTypeError', {
        detail: {
          file: fileName,
          extension: extension || '',
          blockedList: Array.from(this._blockedFileTypes || [])
        },
        bubbles: true
      }));
    }

    showFileTypeError(file, acceptConfig) {
      if (!this._root || !this._dropZone) return;
      
      const allowedTypes = getAcceptDisplayText(this._accept);
      const fileName = file.name || 'This file';
      const errorMessage = `${fileName} is not an allowed file type. Please select a file matching: ${allowedTypes}`;
      this.displayValidationError(errorMessage);
      
      // Dispatch error event for potential external handling
      this.dispatchEvent(new CustomEvent('FileTypeError', {
        detail: { 
          file: file.name,
          fileType: file.type,
          allowedTypes: this._accept
        },
        bubbles: true
      }));
    }

    showFileSizeError(file) {
      if (!this._root || !this._dropZone || !this._maxSizeBytes) return;
      const culture = this._culture || dragDropDetectBrowserCulture();
      const limitText = formatFileSize(this._maxSizeBytes);
      const fileName = file?.name || dragDropGetLocalizedString('watermark', culture);
      const template = dragDropGetLocalizedString('fileTooLarge', culture);
      const errorMessage = template
        .replace('{fileName}', fileName)
        .replace('{maxSize}', limitText);
      this.displayValidationError(errorMessage);
      this.dispatchEvent(new CustomEvent('FileSizeError', {
        detail: {
          file: fileName,
          fileSize: file?.size ?? 0,
          maxSize: this._maxSizeBytes
        },
        bubbles: true
      }));
    }

    _getFormOrBody() {
      let element = this;
      while (element && element !== document.body) {
        if (element.tagName === 'FORM') {
          return element;
        }
        element = element.parentElement;
      }
      return document.body;
    }

    _createErrorPopup(message) {
      // Remove existing popup if any
      this._removeErrorPopup();

      const popup = document.createElement('div');
      popup.className = 'drag-drop-error-popup';
      popup.setAttribute('role', 'alert');
      popup.setAttribute('aria-live', 'polite');
      
      // Create message container
      const messageContainer = document.createElement('span');
      messageContainer.className = 'drag-drop-error-popup-message';
      messageContainer.textContent = message;
      
      // Create close button
      const closeButton = document.createElement('button');
      closeButton.className = 'drag-drop-error-popup-close';
      closeButton.setAttribute('type', 'button');
      closeButton.setAttribute('aria-label', 'Close error message');
      closeButton.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M8 8L16 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M16 8L8 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>';
      
      // Add click handler to close button
      closeButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this._removeErrorPopup();
        // Also clear the error state
        this.clearFileTypeError();
      });
      
      popup.appendChild(messageContainer);
      popup.appendChild(closeButton);

      // Append to form or body
      const container = this._getFormOrBody();
      
      // Ensure container has position relative for absolute positioning
      const originalPosition = window.getComputedStyle(container).position;
      if (originalPosition === 'static') {
        container.style.position = 'relative';
        this._containerPositionModified = true;
      }
      
      container.appendChild(popup);
      this._errorPopup = popup;

      // Position the popup above the control (use requestAnimationFrame to ensure layout)
      // Double RAF to ensure popup is rendered and has dimensions
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          this._positionErrorPopup(popup);
        });
      });

      // Update position on scroll/resize
      this._popupPositionHandler = () => {
        if (this._errorPopup) {
          this._positionErrorPopup(this._errorPopup);
        }
      };
      window.addEventListener('scroll', this._popupPositionHandler, true);
      window.addEventListener('resize', this._popupPositionHandler);
    }

    _positionErrorPopup(popup) {
      if (!popup || !this._root) return;

      const controlRect = this.getBoundingClientRect();
      const container = this._getFormOrBody();
      
      // Get container's bounding rect and scroll position
      const containerRect = container.getBoundingClientRect();
      let scrollTop = 0;
      let scrollLeft = 0;
      
      if (container === document.body || container === document.documentElement) {
        scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
      } else {
        scrollTop = container.scrollTop;
        scrollLeft = container.scrollLeft;
      }

      // Calculate position relative to container
      // Position above the control with 8px gap
      const popupHeight = popup.offsetHeight || 40; // Fallback height
      const top = controlRect.top - containerRect.top + scrollTop - popupHeight - 8;
      const left = controlRect.left - containerRect.left + scrollLeft + (controlRect.width / 2);

      popup.style.top = `${Math.max(8, top)}px`; // Ensure it doesn't go above viewport
      popup.style.left = `${left}px`;
      popup.style.transform = 'translateX(-50%)';
    }

    _removeErrorPopup() {
      if (this._popupPositionHandler) {
        window.removeEventListener('scroll', this._popupPositionHandler, true);
        window.removeEventListener('resize', this._popupPositionHandler);
        this._popupPositionHandler = null;
      }
      if (this._errorPopup && this._errorPopup.parentNode) {
        this._errorPopup.parentNode.removeChild(this._errorPopup);
      }
      this._errorPopup = null;
      
      // Restore container position if we modified it
      if (this._containerPositionModified) {
        const container = this._getFormOrBody();
        container.style.position = '';
        this._containerPositionModified = false;
      }
    }

    displayValidationError(message) {
      if (!this._root || !this._dropZone) return;
      this._root.classList.add('has-error');
      this._dropZone.classList.add('error-state');

      // Create and show popup above the control
      this._createErrorPopup(message);

      // Shake animation
      this._dropZone.style.animation = 'drag-drop-shake 0.5s ease-in-out';
      setTimeout(() => {
        if (this._dropZone) {
          this._dropZone.style.animation = '';
        }
      }, 500);
    }

    clearFileTypeError() {
      if (!this._root || !this._dropZone) return;
      
      this._root.classList.remove('has-error');
      this._dropZone.classList.remove('error-state');

      // Remove popup
      this._removeErrorPopup();
    }
  });
}


}
