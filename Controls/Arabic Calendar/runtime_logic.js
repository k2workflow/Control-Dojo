// Ensure a safe K2 namespace even when running outside K2 runtime/Designer
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

// Runtime control: full interactivity, keyboard navigation and popup portal
if (!window.customElements.get('arabic-calendar')) {
  window.customElements.define('arabic-calendar', class ArabicCalendarControl extends HTMLElement {
  // Properties
  get Value() { return this._value; }
  set Value(val) {
    this._value = val;
    if (this._hasRendered) {
      this.input.val(val);
      if (val && val.trim() !== '') {
        this.container.classList.remove('empty');
        // Hide watermark when there's a value
        if (this.watermarkSpan) {
          this.watermarkSpan.style.display = 'none';
          this.watermarkSpan.style.visibility = 'hidden';
          this.watermarkSpan.style.opacity = '0';
        }
      } else {
        this.container.classList.add('empty');
        // Show watermark when empty
        if (this.watermarkSpan) {
          this.watermarkSpan.style.display = 'block';
          this.watermarkSpan.style.visibility = 'visible';
          this.watermarkSpan.style.opacity = '1';
        }
      }
    }
  }

  get Watermark() { return this._watermark; }
  set Watermark(val) {
    this._watermark = val;
    if (this._hasRendered && this.watermarkSpan) {
      this.watermarkSpan.textContent = val;
      // Ensure watermark is visible when empty
      if (!this._value || this._value.trim() === '') {
        this.watermarkSpan.style.display = 'block';
        this.watermarkSpan.style.visibility = 'visible';
        this.watermarkSpan.style.opacity = '1';
      }
    }
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
  
  get AllowManualInput() { return this._allowManualInput; }
  set AllowManualInput(val) {
    this._allowManualInput = val === 'true' || val === true;
    this.setAttribute('allowmanualinput', val);
    if (this._hasRendered) {
      this.updateInteractivity();
    }
    safeRaisePropertyChanged(this, 'AllowManualInput');
  }
  
  get DateFormat() { return this._dateFormat; }
  set DateFormat(val) {
    this._dateFormat = val;
    this.setAttribute('dateformat', val);
    safeRaisePropertyChanged(this, 'DateFormat');
  }
  

  // Template without styles (CSS is external)
  _TEMPLATE = `
      <div class="container empty">
        <div class="input-wrap">
          <input type="text" class="date-input" aria-haspopup="dialog" aria-expanded="false" aria-controls="k2-cal-popup"/>
          <span class="floating-watermark">اضغط الزر لاختيار التاريخ</span>
          <div class="icon-background"></div>
        </div>
         <svg class="calendar-icon" width="16" height="16" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="فتح التقويم" role="button" tabindex="0" aria-haspopup="dialog" aria-expanded="false" aria-controls="k2-cal-popup">
           <path class="calendar-body" d="M25.2 5.3H22c-0.5 0-0.9 0.4-0.9 0.9s0.4 0.9 0.9 0.9h3.2c1 0 1.8 0.8 1.8 1.7v1.3H3.9v-1.3c0-0.9 0.8-1.7 1.8-1.7H9.2c0.5 0 0.9-0.4 0.9-0.9s-0.4-0.9-0.9-0.9H5.7c-2 0-3.7 1.6-3.7 3.5v16.5c0 2 1.7 3.5 3.7 3.5h19.5c2 0 3.7-1.6 3.7-3.5V8.9c0-2-1.7-3.6-3.7-3.6z m0 21.7H5.7c-1 0-1.8-0.8-1.8-1.7V12.1h23.1v13.2c0 0.9-0.8 1.7-1.8 1.7z" fill="var(--icon-base-color, #4d4d4d)" />
           <path class="calendar-header" d="M14 6.8c-0.4-0.2-0.8-0.1-1.1 0.2-0.1-0.2-0.1-0.5-0.1-0.9 0-0.4 0.1-0.7 0.1-0.9 0.3 0.3 0.7 0.3 1.1 0.1 0.4-0.3 0.6-0.8 0.3-1.3-0.5-0.8-1.1-0.9-1.5-0.9-1.1 0-2 1.3-2 3.1s0.8 3.1 2 3.1c0.6 0 1.2-0.4 1.6-1.1 0.2-0.5 0-1-0.4-1.3zM19.9 6.8c-0.4-0.2-0.8-0.1-1.1 0.2-0.1-0.2-0.1-0.5-0.1-0.9 0-0.4 0.1-0.7 0.1-0.9 0.3 0.3 0.7 0.3 1.1 0.1 0.4-0.3 0.6-0.8 0.3-1.3-0.5-0.8-1.1-0.9-1.5-0.9-1.1 0-2 1.3-2 3.1s0.8 3.1 2 3.1c0.6 0 1.2-0.4 1.6-1.1 0.2-0.5 0-1-0.4-1.3z" fill="var(--icon-base-color, #4d4d4d)" />
           <path class="calendar-grid" d="M21.9 16.1H6.3c-0.5 0-0.9 0.4-0.9 0.9s0.4 0.9 0.9 0.9h15.6c0.5 0 0.9-0.4 0.9-0.9s-0.4-0.9-0.9-0.9zM20.9 21.6h-2.3c-0.5 0-0.9 0.4-0.9 0.9s0.4 0.9 0.9 0.9h2.3c0.5 0 0.9-0.4 0.9-0.9s-0.4-0.9-0.9-0.9zM15 21.6H6.3c-0.5 0-0.9 0.4-0.9 0.9s0.4 0.9 0.9 0.9H15c0.5 0 0.9-0.4 0.9-0.9s-0.4-0.9-0.9-0.9z" fill="var(--icon-accent-color, #00a3d3)" />
        </svg>

        <div class="calendar-popup" id="k2-cal-popup" role="dialog" aria-modal="true" aria-label="التقويم">
          <div class="calendar-header">
            <button class="nav-btn prev" aria-label="الشهر السابق" type="button">‹</button>
            <div class="header-title" aria-live="polite"></div>
            <button class="nav-btn next" aria-label="الشهر التالي" type="button">›</button>
          </div>
          <div class="weekdays"></div>
          <div class="calendar-grid" role="grid"></div>
          <div class="calendar-footer">
            <div class="selected-date-display"></div>
          </div>
        </div>
      </div>
    `;

  _value = "";
  _watermark = "اضغط الزر لاختيار التاريخ";
  _hasRendered = false;
  _isConnected = false;
  _selectedDate = null;
  _viewYear = null;
  _viewMonth = null;
  _locale = 'ar-SA';
  _formatterHijriMonthYear = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', { month: 'long', year: 'numeric' });
  _formatterArabicDigits = new Intl.NumberFormat('ar-SA');
  _weekdaysShort = ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'];
  _width = "";
  _isVisible = true;
  _isEnabled = true;
  _isReadOnly = false;
  _allowManualInput = true;
  _dateFormat = "dd/MM/yyyy";
  _isValid = true;
  _logPrefix = '[arabic-calendar]';
  _isProgrammaticValue = false; // Flag to track programmatically set values
  
  // Picker state management
  _currentView = 'days'; // 'days', 'months', 'years'
  _currentDecade = null; // For year picker (e.g., 2020 for 2020-2029)
  _hijriMonths = [
    'محرم', 'صفر', 'ربيع الأول', 'ربيع الآخر', 
    'جمادى الأولى', 'جمادى الآخرة', 'رجب', 'شعبان',
    'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'
  ];

  constructor() { super(); }

  connectedCallback() {
    this._isConnected = true;
    this.render();
  }

  disconnectedCallback() {
    // Clean up popup from body if it was portaled
    if (this.popupEl && this.popupEl.__portaled && this.popupEl.parentNode) {
      this.popupEl.parentNode.removeChild(this.popupEl);
    }
  }

  render() {
    if (this._hasRendered) return;

    this.innerHTML = this._TEMPLATE;

    // References
    this.container = this.querySelector('.container');
    this.input = $(this.querySelector('.date-input'));
    this.watermarkSpan = this.querySelector('.floating-watermark');
    this.iconBackground = this.querySelector('.icon-background');
    this.popupEl = this.querySelector('.calendar-popup');
    
    this.popup = $(this.popupEl);
    this.button = this.querySelector('.calendar-icon');
    this.headerTitle = this.querySelector('.header-title');
    this.grid = this.querySelector('.calendar-grid');
    this.weekdaysRow = this.querySelector('.weekdays');
    this.prevBtn = this.querySelector('.prev');
    this.nextBtn = this.querySelector('.next');
    this.selectedDateDisplay = this.querySelector('.selected-date-display');
    
    // Set up manual input validation
    this.setupManualInput();

    // Initial state
    this.Width = this._width;
    this.IsVisible = this._isVisible;
    this.IsEnabled = this._isEnabled;
    if (this._value && this._value.trim() !== '') {
      this.container.classList.remove('empty');
      // Hide watermark when there's a value
      if (this.watermarkSpan) {
        this.watermarkSpan.style.display = 'none';
      }
    } else {
      this.container.classList.add('empty');
      // Show watermark when empty
      if (this.watermarkSpan) {
        this.watermarkSpan.style.display = 'block';
        this.watermarkSpan.style.visibility = 'visible';
        this.watermarkSpan.style.opacity = '1';
      }
    }

    const today = new Date();
    this._viewYear = today.getFullYear();
    this._viewMonth = today.getMonth();
    // Initialize selected date to today if no value is set
    if (!this._value || this._value.trim() === '') {
      this._selectedDate = today;
    }

    // Events
    this.input.on('focus', () => this.dispatchEvent(new Event('Focus')));
    this.input.on('blur', () => this.doBlur());

    // Toggle popup (button inside input area)
    this.button.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (this._isReadOnly || !this._isEnabled) return;
      const isHidden = !this.popupEl || this.popupEl.style.display === 'none' || getComputedStyle(this.popupEl).display === 'none';
      if (isHidden) {
        this.openPopup();
        this.focusGrid();
      } else {
        this.closePopup();
      }
    });

    // Icon background hover effects
    this.button.addEventListener('mouseenter', () => {
      if (this.iconBackground) {
        this.iconBackground.style.background = 'var(--icon-accent-color, #00abf0)';
      }
    });

    this.button.addEventListener('mouseleave', () => {
      if (this.iconBackground) {
        this.iconBackground.style.background = 'transparent';
      }
    });

    // Outside click handling: close popup when clicking anywhere else
    document.addEventListener('click', (e) => {
      const clickedInsideControl = this.contains(e.target);
      const clickedInsidePopup = this.popupEl && this.popupEl.contains(e.target);
      // Check if clicked element is part of the calendar (including portaled elements)
      const clickedCalendarElement = e.target.closest('.calendar-popup') || 
                                   e.target.closest('arabic-calendar') ||
                                   e.target.classList.contains('year-btn') ||
                                   e.target.classList.contains('month-btn') ||
                                   e.target.classList.contains('calendar-grid') ||
                                   e.target.classList.contains('header-title');
      
      if (!clickedInsideControl && !clickedInsidePopup && !clickedCalendarElement) {
        this.closePopup();
      }
    });

    // Keyboard handling: ESC closes popup, focus returns to the icon button
    this.addEventListener('keydown', (e) => {
      if (!this.popupEl || this.popupEl.style.display === 'none') return;
      if (e.key === 'Escape') {
        this.closePopup();
        this.button.focus();
      }
    });

    // Navigation between months
    this.prevBtn.addEventListener('click', () => this.shiftMonth(-1));
    this.nextBtn.addEventListener('click', () => this.shiftMonth(1));
    
    // Header title click handler for view switching
    this.headerTitle.addEventListener('click', () => this.cycleView());

    // Don't set initial value - let the input show placeholder
    // The user can select a date or type manually

    // Render initial calendar
    this.renderCalendar(this._viewYear, this._viewMonth);

    this._hasRendered = true;
    
    // Set watermark after rendering is complete
    this.Watermark = this._watermark;
    
    // Fallback: ensure watermark text is set
    if (this.watermarkSpan && (!this.watermarkSpan.textContent || this.watermarkSpan.textContent.trim() === '')) {
      this.watermarkSpan.textContent = this._watermark;
    }
    
    this.dispatchEvent(new Event('Rendered'));
  }

  openPopup() {
    if (!this.popupEl) return;

    // Portal popup to body for overlay behavior
    if (!this.popupEl.__portaled) {
      document.body.appendChild(this.popupEl);
      this.popupEl.__portaled = true;

      // CRITICAL: mark the popup as portaled so CSS can target it
      this.popupEl.setAttribute('data-portal', 'true');

      // Fixed positioning - no z-index needed, DOM order handles stacking
      this.popupEl.style.position = 'fixed';

      // Preserve RTL direction
      this.popupEl.dir = 'rtl';
    }

    // Position popup with top-left corner just under the icon button
    const buttonRect = this.button.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let top = buttonRect.bottom + 4; // 4px gap below icon
    let left = buttonRect.left; // Align with left edge of icon

    // Clamp to viewport bounds so popup is always visible
    if (left + this.popupEl.offsetWidth > viewportWidth) {
      left = viewportWidth - this.popupEl.offsetWidth - 8;
    }
    if (left < 8) left = 8;

    if (top + this.popupEl.offsetHeight > viewportHeight) {
      // align above the icon if there is no space below
      top = buttonRect.top - this.popupEl.offsetHeight - 4;
    }
    if (top < 8) top = 8;

    this.popupEl.style.top = `${top}px`;
    this.popupEl.style.left = `${left}px`;
    this.popupEl.style.display = 'block';

    // Re-find grid element after portaling (it might have moved)
    this.grid = this.popupEl.querySelector('.calendar-grid');
    this.weekdaysRow = this.popupEl.querySelector('.weekdays');
    this.headerTitle = this.popupEl.querySelector('.header-title');
    this.selectedDateDisplay = this.popupEl.querySelector('.selected-date-display');

    // Set view based on whether we have a selected date or not
    if (this._selectedDate) {
      // If we have a selected date, find the Gregorian month that displays the selected Islamic day
      const selectedIslamic = this.convertGregorianToIslamic(this._selectedDate);
      
      // Search starting from the selected date's month
      // The calendar shows all days of the Islamic month that starts in the Gregorian month,
      // so we need to find a Gregorian month where the 1st has the same Islamic month/year
      const selectedYear = this._selectedDate.getFullYear();
      const selectedMonth = this._selectedDate.getMonth();
      let foundGregorianMonth = null;
      
      // Search starting from the selected date's month (0), then nearby months
      // This ensures we find the month that actually displays the selected Islamic day
      const searchOrder = [0, -1, 1, -2, 2, -3, 3, -4, 4, -5, 5, -6, 6];
      
      for (const monthOffset of searchOrder) {
        const testDate = new Date(selectedYear, selectedMonth + monthOffset, 1);
        const testIslamic = this.convertGregorianToIslamic(testDate);
        
        // Check if this Gregorian month displays the same Islamic month/year
        // When rendered, it will show all days of that Islamic month, including our selected day
        if (testIslamic.year === selectedIslamic.year && testIslamic.month === selectedIslamic.month) {
          foundGregorianMonth = testDate;
          break;
        }
      }
      
      if (foundGregorianMonth) {
        this._viewYear = foundGregorianMonth.getFullYear();
        this._viewMonth = foundGregorianMonth.getMonth();
      } else {
        // Fallback to selected date's Gregorian month
        this._viewYear = this._selectedDate.getFullYear();
        this._viewMonth = this._selectedDate.getMonth();
      }
    } else {
      // If no selected date, show today's Islamic date
      const today = new Date();
      const todayIslamic = this.convertGregorianToIslamic(today);
      
      // Find a Gregorian month that contains today's Islamic month
      // We'll search around the current month
      let foundGregorianMonth = null;
      for (let monthOffset = -6; monthOffset <= 6; monthOffset++) {
        const testDate = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
        const testIslamic = this.convertGregorianToIslamic(testDate);
        
        if (testIslamic.year === todayIslamic.year && testIslamic.month === todayIslamic.month) {
          foundGregorianMonth = testDate;
          break;
        }
      }
      
      if (foundGregorianMonth) {
        this._viewYear = foundGregorianMonth.getFullYear();
        this._viewMonth = foundGregorianMonth.getMonth();
      } else {
        // Fallback to current month
        this._viewYear = today.getFullYear();
        this._viewMonth = today.getMonth();
      }
    }

    // Reset to days view when opening
    this._currentView = 'days';

    // Render the current view when popup opens
    this.renderCurrentView();

    this.button.setAttribute('aria-expanded', 'true');
    this.input[0].setAttribute('aria-expanded', 'true');

    // Make popup draggable by header for better UX on dense forms
    const header = this.popupEl.querySelector('.calendar-header');
    this.makeDraggable(this.popupEl, header);
  }

  closePopup() {
    if (!this.popupEl) return;
    
    this.popupEl.style.display = 'none';
    this.button.setAttribute('aria-expanded', 'false');
    this.input[0].setAttribute('aria-expanded', 'false');
    
    // Ensure popup is properly hidden
    if (this.popupEl.__portaled) {
      this.popupEl.style.display = 'none';
    }
  }

  // Enables drag via a specific handle element (header)
  makeDraggable(el, handle) {
    if (!el || !handle) return;
    if (el.__draggableInitialized) return;
    el.__draggableInitialized = true;

    let isDown = false;
    let startX, startY, startLeft, startTop;

    const onMouseDown = (e) => {
      if (e.button !== 0) return;
      isDown = true;
      el.style.willChange = 'transform';
      startLeft = parseInt(el.style.left || '0', 10);
      startTop = parseInt(el.style.top || '0', 10);
      startX = e.clientX;
      startY = e.clientY;
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
      e.preventDefault();
    };

    const onMouseMove = (e) => {
      if (!isDown) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      // Calculate new position
      let newLeft = startLeft + dx;
      let newTop = startTop + dy;

      // Clamp to viewport to avoid losing the popup off-screen
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const popupWidth = el.offsetWidth;
      const popupHeight = el.offsetHeight;

      newLeft = Math.max(8, Math.min(newLeft, viewportWidth - popupWidth - 8));
      newTop = Math.max(8, Math.min(newTop, viewportHeight - popupHeight - 8));

      el.style.left = `${newLeft}px`;
      el.style.top = `${newTop}px`;
    };

    const onMouseUp = () => {
      isDown = false;
      el.style.willChange = '';
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    handle.style.cursor = 'move';
    handle.addEventListener('mousedown', onMouseDown);
  }

  doBlur() {
    this.dispatchEvent(new Event("Blur"));
  }

  updateInteractivity() {
    if (!this.container) return;
    const interactive = this._isEnabled && !this._isReadOnly;
    this.container.style.pointerEvents = interactive ? '' : 'none';
    this.container.setAttribute('aria-disabled', interactive ? 'false' : 'true');
    this.container.classList.toggle('is-disabled', !this._isEnabled);
    this.container.classList.toggle('is-readonly', this._isReadOnly);
    
    // Update input field for manual input
    if (this.input && this.input.length > 0) {
      const inputEl = this.input[0];
      inputEl.readOnly = this._isReadOnly || !this._allowManualInput;
      inputEl.style.cursor = (this._isReadOnly || !this._allowManualInput) ? 'default' : 'text';
    }
  }

  setupManualInput() {
    if (!this.input || this.input.length === 0) return;
    
    const inputEl = this.input[0];
    
    // Input event for real-time validation
    inputEl.addEventListener('input', (e) => {
      if (!this._allowManualInput || this._isReadOnly) return;
      
      // Reset programmatic flag when user manually types
      this._isProgrammaticValue = false;
      
      const value = e.target.value.trim();
      if (value === '') {
        this.clearValidation();
        this.container.classList.add('empty');
        this._value = '';
        // Show watermark when empty
        if (this.watermarkSpan) {
          this.watermarkSpan.style.display = 'block';
          this.watermarkSpan.style.visibility = 'visible';
          this.watermarkSpan.style.opacity = '1';
        }
        safeRaisePropertyChanged(this, "Value");
        this.doChanged(); // Raise changed event when clearing
        return;
      }
      
      // Clear validation state when user starts typing
      this.clearValidation();
      
      // Don't validate on every keystroke - only on blur
      // this.validateDateInput(value, false);
    });
    
    // Blur event for final validation
    inputEl.addEventListener('blur', (e) => {
      if (!this._allowManualInput || this._isReadOnly) return;
      
      // Don't validate if the value was set programmatically (e.g., from picker)
      if (this._isProgrammaticValue) {
        this._isProgrammaticValue = false; // Reset the flag
        return;
      }
      
      const value = e.target.value.trim();
      if (value === '') {
        if (typeof this.clearValidation === 'function') {
          this.clearValidation();
        }
        this.container.classList.add('empty');
        this._value = '';
        // Show watermark when empty
        if (this.watermarkSpan) {
          this.watermarkSpan.style.display = 'block';
          this.watermarkSpan.style.visibility = 'visible';
          this.watermarkSpan.style.opacity = '1';
        }
        safeRaisePropertyChanged(this, "Value");
        return;
      }
      
      // Only validate if the value is different from what was set programmatically
      // or if it's clearly a manual input (contains invalid characters)
      this.validateDateInput(value, true);
    });
    
    // Focus event to clear validation state
    inputEl.addEventListener('focus', () => {
      if (!this._allowManualInput || this._isReadOnly) return;
      if (typeof this.clearValidation === 'function') {
        this.clearValidation();
      }
    });
  }

  validateDateInput(value, isBlur = false) {
    if (!this._allowManualInput || this._isReadOnly) return;
    
    const isValid = this.parseDate(value);
    
    if (isValid) {
      // Clear any previous validation errors first
      this.clearValidation();
      this.showValidationSuccess();
      this._value = value;
      this._isValid = true;
      if (value && value.trim() !== '') {
        this.container.classList.remove('empty');
        // Hide watermark when there's a value
        if (this.watermarkSpan) {
          this.watermarkSpan.style.display = 'none';
        }
      } else {
        this.container.classList.add('empty');
        // Show watermark when empty
        if (this.watermarkSpan) {
          this.watermarkSpan.style.display = 'block';
          this.watermarkSpan.style.visibility = 'visible';
          this.watermarkSpan.style.opacity = '1';
        }
      }
      safeRaisePropertyChanged(this, "Value");
      this.doChanged();
    } else {
      this.showValidationError();
      this._isValid = false;
      this.dispatchEvent(new CustomEvent("ValidationError", {
        detail: { message: "تنسيق التاريخ غير صحيح", value: value }
      }));
      this.doChanged(); // Raise changed event even for invalid input
    }
  }

  doChanged() {
    // Raise the changed event for K2 framework
    this.dispatchEvent(new CustomEvent("changed", {
      detail: { value: this._value }
    }));
  }

  clearValidation() {
    if (!this.container) return;
    this.container.classList.remove('validation-error');
    this.container.classList.remove('validation-valid');
    this._isValid = true; // Reset to valid state
  }

  parseDate(value) {
    try {
      // Handle empty values
      if (!value || value.trim() === '') {
        return true; // Empty is considered valid (no error state)
      }
      
      // Check for obviously invalid patterns first
      if (this.isInvalidInput(value)) {
        return false;
      }
      
      // Check if it's an Arabic Hijri date format (contains Arabic month names)
      if (this.isArabicHijriDate(value)) {
        return this.parseArabicHijriDate(value);
      }
      
      // Convert Arabic numerals to English for parsing
      const englishValue = value.replace(/[٠-٩]/g, (match) => {
        return String.fromCharCode(match.charCodeAt(0) - '٠'.charCodeAt(0) + '0'.charCodeAt(0));
      });
      
      // Parse based on date format
      let date;
      if (this._dateFormat === 'dd/MM/yyyy') {
        const parts = englishValue.split('/');
        if (parts.length === 3) {
          const day = parseInt(parts[0], 10);
          const month = parseInt(parts[1], 10) - 1; // JavaScript months are 0-based
          const year = parseInt(parts[2], 10);
          date = new Date(year, month, day);
          
          // Validate the date is correct
          return date.getDate() === day && date.getMonth() === month && date.getFullYear() === year;
        }
      } else if (this._dateFormat === 'MM/dd/yyyy') {
        const parts = englishValue.split('/');
        if (parts.length === 3) {
          const month = parseInt(parts[0], 10) - 1;
          const day = parseInt(parts[1], 10);
          const year = parseInt(parts[2], 10);
          date = new Date(year, month, day);
          
          return date.getDate() === day && date.getMonth() === month && date.getFullYear() === year;
        }
      } else if (this._dateFormat === 'yyyy-MM-dd') {
        const parts = englishValue.split('-');
        if (parts.length === 3) {
          const year = parseInt(parts[0], 10);
          const month = parseInt(parts[1], 10) - 1;
          const day = parseInt(parts[2], 10);
          date = new Date(year, month, day);
          
          return date.getDate() === day && date.getMonth() === month && date.getFullYear() === year;
        }
      }
      
      return false;
    } catch (e) {
      return false;
    }
  }

  isInvalidInput(value) {
    // Check for obviously invalid input patterns
    const trimmedValue = value.trim();
    
    // Check for random characters (no numbers, no valid separators)
    if (!/[0-9٠-٩]/.test(trimmedValue)) {
      return true; // No numbers at all
    }
    
    // No length validation - Arabic text can be naturally longer
    
    // Check for Latin letters (a-z, A-Z) which are invalid in Arabic dates
    const hasLatinLetters = /[a-zA-Z]/.test(trimmedValue);
    
    if (hasLatinLetters) {
      return true;
    }
    
    return false;
  }

  isArabicHijriDate(value) {
    // Check if the value contains Arabic month names
    const arabicMonths = ['محرم', 'صفر', 'ربيع الأول', 'ربيع الآخر', 'جمادى الأولى', 'جمادى الآخرة', 'رجب', 'شعبان', 'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'];
    return arabicMonths.some(month => value.includes(month));
  }

  parseArabicHijriDate(value) {
    try {
      // This is a simplified validation for Arabic Hijri dates
      // We just check if it contains valid Arabic month names and numbers
      const arabicMonths = ['محرم', 'صفر', 'ربيع الأول', 'ربيع الآخر', 'جمادى الأولى', 'جمادى الآخرة', 'رجب', 'شعبان', 'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'];
      
      // Check if it contains at least one valid Arabic month
      const hasValidMonth = arabicMonths.some(month => value.includes(month));
      
      // Check if it contains Arabic numerals (at least one digit)
      const hasArabicNumerals = /[٠-٩]/.test(value);
      
      // For Arabic Hijri dates, we accept them if they have a valid month name
      // The presence of Arabic numerals is optional since the month name is the key indicator
      return hasValidMonth;
    } catch (e) {
      return false;
    }
  }

  showValidationError() {
    if (!this.container) return;
    this.container.classList.add('validation-error');
    this.container.classList.remove('validation-valid');
  }

  showValidationSuccess() {
    if (!this.container) return;
    this.container.classList.remove('validation-error');
    this.container.classList.add('validation-valid');
    this._isValid = true;
  }


  shiftMonth(delta) {
    if (this._currentView === 'days') {
      let m = this._viewMonth + delta;
      let y = this._viewYear;
      if (m < 0) { m = 11; y -= 1; }
      if (m > 11) { m = 0; y += 1; }
      this._viewMonth = m;
      this._viewYear = y;
      this.renderCalendar(y, m);
    } else if (this._currentView === 'months') {
      // In month picker, arrows change year
      this._viewYear += delta;
      this.renderMonthPicker();
    } else if (this._currentView === 'years') {
      // In year picker, arrows change decade
      this._currentDecade += (delta * 10);
      this.renderYearPicker();
    }
  }

  // Moves focus to first day button to enable keyboard navigation
  focusGrid() {
    const firstButton = this.grid.querySelector('button');
    if (firstButton) firstButton.focus();
  }

  // Cycle through picker views: days → months → years → days
  cycleView() {
    switch (this._currentView) {
      case 'days':
        this._currentView = 'months';
        break;
      case 'months':
        this._currentView = 'years';
        // Initialize decade based on current Islamic year
        if (!this._currentDecade) {
          const currentGregorianYear = new Date().getFullYear();
          const currentIslamicDate = this.convertGregorianToIslamic(new Date(currentGregorianYear, 0, 1));
          const currentIslamicYear = currentIslamicDate.year;
          this._currentDecade = Math.floor(currentIslamicYear / 10) * 10;
        }
        break;
      case 'years':
        this._currentView = 'days';
        break;
    }
    this.renderCurrentView();
    // Update footer to show current context
    this.updateSelectedDateDisplay();
  }

  // Update the footer display with selected date or current context
  updateSelectedDateDisplay() {
    if (this.selectedDateDisplay) {
      let contextText = '';
      
      // If we have a selected date and we're in the days view, show the selected date
      if (this._selectedDate && this._currentView === 'days') {
        const hijriDate = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }).format(this._selectedDate);
        contextText = hijriDate;
      } else {
        // Show current selection context based on the current view
        if (this._currentView === 'years') {
          // Show Islamic decade range for year picker
          const currentIslamicDate = this.convertGregorianToIslamic(new Date(this._viewYear, 0, 1));
          const currentIslamicYear = currentIslamicDate.year;
          const islamicDecadeStart = Math.floor(currentIslamicYear / 10) * 10;
          const islamicDecadeEnd = islamicDecadeStart + 9;
          contextText = `اختر السنة من ${this._formatterArabicDigits.format(islamicDecadeStart)} إلى ${this._formatterArabicDigits.format(islamicDecadeEnd)}`;
        } else if (this._currentView === 'months') {
          // Show selected Islamic year for month picker
          const firstOfYear = new Date(this._viewYear, 0, 1);
          const hijriYear = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', {
            year: 'numeric'
          }).format(firstOfYear);
          contextText = `اختر الشهر للسنة ${hijriYear}`;
        } else if (this._currentView === 'days') {
          // Show selected month and year for day picker
          const firstOfMonth = new Date(this._viewYear, this._viewMonth, 1);
          const hijriMonthYear = this._formatterHijriMonthYear.format(firstOfMonth);
          contextText = `اختر اليوم من ${hijriMonthYear}`;
        } else {
          // Fallback to today's date
          const today = new Date();
          const hijriToday = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }).format(today);
          contextText = hijriToday;
        }
      }
      
      this.selectedDateDisplay.textContent = contextText;
    }
  }

  // Render current view based on state
  renderCurrentView() {
    switch (this._currentView) {
      case 'days':
        this.renderCalendar(this._viewYear, this._viewMonth);
        break;
      case 'months':
        this.renderMonthPicker();
        break;
      case 'years':
        this.renderYearPicker();
        break;
    }
  }

  // Render visible month grid using Islamic calendar days
  renderCalendar(gYear, gMonthZero) {
    // Header title using Hijri month+year
    const firstOfMonth = new Date(gYear, gMonthZero, 1);
    const hijriTitle = this._formatterHijriMonthYear.format(firstOfMonth);
    this.headerTitle.textContent = hijriTitle;

    // Weekday headers
    this.weekdaysRow.innerHTML = this._weekdaysShort.map(d => `<div>${d}</div>`).join('');

    // Update footer with selected date
    this.updateSelectedDateDisplay();

    // Clear old days
    if (!this.grid) {
      console.error('Grid element not found!');
      return;
    }
    this.grid.innerHTML = '';

    // Get the Islamic month and year for this Gregorian month
    const islamicDate = this.convertGregorianToIslamic(firstOfMonth);
    const islamicYear = islamicDate.year;
    const islamicMonth = islamicDate.month;

    // Calculate Islamic calendar days for this month
    // Islamic months have 29 or 30 days
    let islamicDaysInMonth = islamicMonth % 2 === 1 ? 30 : 29;
    
    // For Muharram (month 1), check if it's a leap year
    if (islamicMonth === 1) {
      // Simple leap year calculation for Islamic calendar
      const islamicLeapYear = (islamicYear * 11 + 14) % 30 < 11;
      if (islamicLeapYear) {
        islamicDaysInMonth = 30;
      }
    }

    // Today and selected checks using Islamic dates
    const today = new Date();
    const todayIslamic = this.convertGregorianToIslamic(today);
    
    const isToday = (islamicDay) => {
      // Compare Islamic dates instead of Gregorian dates
      const isTodayDate = todayIslamic.year === islamicYear && 
             todayIslamic.month === islamicMonth && 
             todayIslamic.day === islamicDay;
      
      return isTodayDate;
    };
    
    const isSelected = (islamicDay) => {
      if (!this._selectedDate) {
        return false;
      }
      const selectedIslamic = this.convertGregorianToIslamic(this._selectedDate);
      const isSelectedDate = selectedIslamic.year === islamicYear && 
             selectedIslamic.month === islamicMonth && 
             selectedIslamic.day === islamicDay;
      
      return isSelectedDate;
    };

    // Add Islamic day buttons
    for (let islamicDay = 1; islamicDay <= islamicDaysInMonth; islamicDay++) {
      const btn = document.createElement('button');
      
      // Find the Gregorian date that corresponds to this Islamic day
      let gregorianDate = null;
      for (let dayOffset = -15; dayOffset <= 15; dayOffset++) {
        const testGregorianDate = new Date(gYear, gMonthZero, 1 + dayOffset);
        const testIslamicCheck = this.convertGregorianToIslamic(testGregorianDate);
        
        if (testIslamicCheck.year === islamicYear && 
            testIslamicCheck.month === islamicMonth && 
            testIslamicCheck.day === islamicDay) {
          gregorianDate = testGregorianDate;
          break;
        }
      }
      
      // Fallback to first of month if we can't find the exact date
      if (!gregorianDate) {
        gregorianDate = new Date(gYear, gMonthZero, 1);
      }

      btn.type = 'button';
      btn.setAttribute('role', 'gridcell');
      btn.setAttribute('aria-label', gregorianDate.toLocaleDateString('ar-SA', { dateStyle: 'full' }));
      btn.textContent = this._formatterArabicDigits.format(islamicDay);

      // Check if this is today's date
      if (isToday(islamicDay)) {
        btn.classList.add('today');
      }
      
      // Check if this is the selected date
      if (isSelected(islamicDay)) {
        btn.classList.add('selected');
      }

      btn.addEventListener('click', (e) => {
        this._selectedDate = gregorianDate;

        // Format as Hijri date for display in the input
        const hijriFull = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', {
          day: 'numeric', month: 'long', year: 'numeric'
        }).format(gregorianDate);

        // Set flag to indicate this is a programmatic value
        this._isProgrammaticValue = true;
        
        // Clear the flag after a short delay to allow blur event to see it
        setTimeout(() => {
          this._isProgrammaticValue = false;
        }, 100);
        
        this.input.val(hijriFull);
        this.container.classList.remove('empty');
        this._value = hijriFull;
        
        // Clear any validation errors when date is selected
        if (typeof this.clearValidation === 'function') {
          this.clearValidation();
        }
        
        // Hide watermark when date is selected
        if (this.watermarkSpan) {
          this.watermarkSpan.style.display = 'none';
          this.watermarkSpan.style.visibility = 'hidden';
          this.watermarkSpan.style.opacity = '0';
        }
        
        safeRaisePropertyChanged(this, "Value");

        // Update footer to show selected date
        this.updateSelectedDateDisplay();

        // Ensure popup closes after date selection
        this.closePopup();
        
        // Force close popup if it's still visible
        if (this.popupEl && this.popupEl.style.display !== 'none') {
          this.popupEl.style.display = 'none';
        }

        // Refresh styles to update today/selected states
        this.renderCalendar(this._viewYear, this._viewMonth);
      });

      this.grid.appendChild(btn);
    }
  }

  // Render month picker
  renderMonthPicker() {
    // Header shows current year in Arabic Hijri format
    const firstOfYear = new Date(this._viewYear, 0, 1);
    const hijriYear = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', {
      year: 'numeric'
    }).format(firstOfYear);
    this.headerTitle.textContent = hijriYear;
    
    // Hide weekdays for month picker
    this.weekdaysRow.innerHTML = '';
    
    // Update footer to show current context
    this.updateSelectedDateDisplay();
    
    // Clear grid
    if (!this.grid) {
      console.error('Grid element not found!');
      return;
    }
    this.grid.innerHTML = '';
    
    // Get current Islamic month and year from the current view (not from selected date)
    // This ensures the picker highlights the month being viewed, not the previously selected month
    const currentGregorianDate = new Date(this._viewYear, this._viewMonth, 1);
    const currentIslamicDate = this.convertGregorianToIslamic(currentGregorianDate);
    const currentIslamicMonth = currentIslamicDate.month;
    const currentIslamicYear = currentIslamicDate.year;
    
    // Create month buttons (4x3 grid)
    for (let i = 0; i < 12; i++) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = this._hijriMonths[i];
      btn.className = 'month-btn';
      
      // Highlight current Islamic month (from selected date or current view)
      if ((i + 1) === currentIslamicMonth) {
        btn.classList.add('selected');
      }
      
      btn.addEventListener('click', () => {
        
        // Find a Gregorian month that contains this Islamic month
        // Use the currentIslamicYear from the view (which was set by the year picker)
        const selectedIslamicMonth = i + 1; // Convert 0-based index to 1-based month number
        let foundGregorianMonth = null;
        
        // Search around the current view year (±3 years should be enough)
        // We need to find a Gregorian month that contains the selected Islamic month
        // within the current Islamic year being viewed
        for (let yearOffset = -3; yearOffset <= 3; yearOffset++) {
          for (let monthOffset = 0; monthOffset < 12; monthOffset++) {
            const testDate = new Date(this._viewYear + yearOffset, monthOffset, 1);
            const testIslamic = this.convertGregorianToIslamic(testDate);
            
            // Match the Islamic year AND month
            if (testIslamic.year === currentIslamicYear && testIslamic.month === selectedIslamicMonth) {
              foundGregorianMonth = testDate;
              break;
            }
          }
          if (foundGregorianMonth) break;
        }
        
        if (foundGregorianMonth) {
          this._viewYear = foundGregorianMonth.getFullYear();
          this._viewMonth = foundGregorianMonth.getMonth();
        } else {
          // Enhanced fallback: try to find ANY Gregorian month with this Islamic month/year
          // Search more broadly
          const startYear = currentIslamicYear + 579; // Approximate conversion
          for (let yearOffset = -5; yearOffset <= 5; yearOffset++) {
            for (let monthOffset = 0; monthOffset < 12; monthOffset++) {
              const testDate = new Date(startYear + yearOffset, monthOffset, 1);
              const testIslamic = this.convertGregorianToIslamic(testDate);
              
              if (testIslamic.year === currentIslamicYear && testIslamic.month === selectedIslamicMonth) {
                foundGregorianMonth = testDate;
                this._viewYear = foundGregorianMonth.getFullYear();
                this._viewMonth = foundGregorianMonth.getMonth();
                break;
              }
            }
            if (foundGregorianMonth) break;
          }
          
          if (!foundGregorianMonth) {
            console.error('[Arabic Calendar] Could not find Gregorian month for Islamic', selectedIslamicMonth, currentIslamicYear);
            // Last resort: keep current view but this will likely be wrong
            // Don't set _viewMonth = i as that's definitely wrong
          }
        }
        
        this._currentView = 'days';
        this.renderCurrentView();
        // Update footer to show current context
        this.updateSelectedDateDisplay();
        // Don't close popup - stay open for day picker
      });
      
      this.grid.appendChild(btn);
    }
  }

  // Add Islamic calendar conversion utilities
  convertGregorianToIslamic(date) {
    try {
      // First try using formatToParts
      const islamicDate = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', {
        year: 'numeric',
        month: 'numeric', 
        day: 'numeric'
      }).formatToParts(date);
      
      const yearPart = islamicDate.find(part => part.type === 'year');
      const monthPart = islamicDate.find(part => part.type === 'month');
      const dayPart = islamicDate.find(part => part.type === 'day');
      
      if (yearPart && monthPart && dayPart && 
          !isNaN(parseInt(yearPart.value)) && 
          !isNaN(parseInt(monthPart.value)) && 
          !isNaN(parseInt(dayPart.value))) {
        
        const result = {
          year: parseInt(yearPart.value),
          month: parseInt(monthPart.value),
          day: parseInt(dayPart.value)
        };
        return result;
      }
      
      // Alternative method: use the formatted string and parse it
      const islamicString = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', {
        year: 'numeric',
        month: 'numeric', 
        day: 'numeric'
      }).format(date);
      
      // Parse the Arabic numerals from the string
      const arabicToEnglish = (str) => {
        return str.replace(/[٠-٩]/g, (match) => {
          return String.fromCharCode(match.charCodeAt(0) - '٠'.charCodeAt(0) + '0'.charCodeAt(0));
        });
      };
      
      const englishString = arabicToEnglish(islamicString);
      
      // Extract numbers from the string (format is usually "day/month/year" or similar)
      const numbers = englishString.match(/\d+/g);
      if (numbers && numbers.length >= 3) {
        const result = {
          year: parseInt(numbers[2]), // Usually year is last
          month: parseInt(numbers[1]), // Month is middle
          day: parseInt(numbers[0]) // Day is first
        };
        return result;
      }
      
      throw new Error('Could not parse Islamic date string');
      
    } catch (error) {
      console.error('Error converting to Islamic date:', error);
      // Fallback to approximate conversion
      const gregorianYear = date.getFullYear();
      const islamicYear = gregorianYear - 579; // Approximate conversion
      const result = {
        year: islamicYear,
        month: date.getMonth() + 1,
        day: date.getDate()
      };
      return result;
    }
  }

  convertIslamicToGregorian(islamicYear, islamicMonth, islamicDay) {
    try {
      // Create a date and use Intl to convert
      // This is a simplified approach - for production use a proper Islamic calendar library
      const tempDate = new Date();
      tempDate.setFullYear(islamicYear + 579); // Approximate conversion
      tempDate.setMonth(islamicMonth - 1);
      tempDate.setDate(islamicDay);
      
      // Use Intl to get the proper Islamic date and adjust
      const islamicCheck = this.convertGregorianToIslamic(tempDate);
      const yearDiff = islamicYear - islamicCheck.year;
      tempDate.setFullYear(tempDate.getFullYear() + yearDiff);
      
      return tempDate;
    } catch (error) {
      console.error('Error converting Islamic to Gregorian:', error);
      // Fallback to approximate conversion
      const gregorianYear = islamicYear + 579;
      return new Date(gregorianYear, islamicMonth - 1, islamicDay);
    }
  }

  // Render year picker with Islamic years
  renderYearPicker() {
    // Get current Islamic year from the current view (not from selected date)
    // This ensures the picker highlights the year being viewed, not the previously selected year
    const currentGregorianDate = new Date(this._viewYear, this._viewMonth, 1);
    const currentIslamicDate = this.convertGregorianToIslamic(currentGregorianDate);
    const currentIslamicYear = currentIslamicDate.year;
    
    // Calculate Islamic decade (e.g., 1440-1449)
    const islamicDecadeStart = Math.floor(currentIslamicYear / 10) * 10;
    const islamicDecadeEnd = islamicDecadeStart + 9;
    this.headerTitle.textContent = `${this._formatterArabicDigits.format(islamicDecadeStart)} - ${this._formatterArabicDigits.format(islamicDecadeEnd)}`;
    
    // Hide weekdays for year picker
    this.weekdaysRow.innerHTML = '';
    
    // Update footer to show current context
    this.updateSelectedDateDisplay();
    
    // Clear grid
    if (!this.grid) {
      console.error('Grid element not found!');
      return;
    }
    this.grid.innerHTML = '';
    
    // Create year buttons with Islamic years (4x3 grid)
    for (let islamicYear = islamicDecadeStart; islamicYear <= islamicDecadeEnd; islamicYear++) {
      const btn = document.createElement('button');
      btn.type = 'button';
      const formattedYear = this._formatterArabicDigits.format(islamicYear);
      btn.textContent = formattedYear;
      btn.className = 'year-btn';
      
      // Highlight current Islamic year (from selected date or today)
      if (islamicYear === currentIslamicYear) {
        btn.classList.add('selected');
      }
      
      btn.addEventListener('click', () => {
        // Find a Gregorian year that corresponds to this Islamic year
        // We'll use the middle of the Islamic year for better accuracy
        const islamicMidYear = new Date();
        islamicMidYear.setFullYear(islamicYear + 579); // Approximate conversion
        
        // Adjust to get closer to the actual Islamic year
        const islamicCheck = this.convertGregorianToIslamic(islamicMidYear);
        const yearDiff = islamicYear - islamicCheck.year;
        islamicMidYear.setFullYear(islamicMidYear.getFullYear() + yearDiff);
        
        this._viewYear = islamicMidYear.getFullYear();
        this._viewMonth = islamicMidYear.getMonth();
        this._currentView = 'months';
        this.renderCurrentView();
        // Update footer to show current context
        this.updateSelectedDateDisplay();
        // Don't close popup - stay open for month picker
      });
      
      this.grid.appendChild(btn);
    }
  }
});
}