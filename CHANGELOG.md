# Changelog

All notable changes to Control Dojo will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - The 5.9 Compatibility Update

### Added

#### Platform & Infrastructure
- **K2 Five 5.9 FP1 Compatibility**: Full compatibility with K2 Five 5.9 FP1, fully tested and aligned with the latest K2 release
- **Express v5 Upgrade**: Upgraded backend server to Express v5 for improved performance and modern features
- **Flowbite v4 Integration**: Upgraded to Flowbite v4 for enhanced UI components and improved theme support
- **Tailwind CSS v4**: Upgraded to Tailwind CSS v4 with new build tooling for better performance
- **Validation Error Popup Component**: New dedicated ValidationErrorPopup component for design-time validation feedback in the Inspector

#### Documentation
- **Accessibility Guide**: New comprehensive accessibility guide (`docs/Accessibility.md`) covering WCAG 2.1 Level AA standards, keyboard navigation, ARIA patterns, screen reader support, error handling, focus management, and complete implementation examples with best practices
- **Manifest Configuration Guide**: Major enhancements including:
  - **Control Data Type Declaration**: Complete documentation for `datatypes` array that enables field binding and Change Control functionality in K2 Designer, with full list of 20+ supported data types (AutoGuid, Date, DateTime, Decimal, File, Guid, Hyperlink, Image, Label, Memo, MultiValue, Number, Text, Time, Xml, YesNo, etc.)
  - **Property Categories**: Documentation for grouping properties in K2 designer's property panel with custom category support
  - **Design-time Property Validation**: Complete guide for `validationpattern` and `validationmessage` fields that provide regex-based validation in K2 Designer (design-time only, not runtime)
  - **Int Property Type**: Documentation for new `int` property type with built-in 32-bit range validation and default error messages
  - **ControlExpression Support**: Documentation explaining how ControlExpression works (uses Value property, no separate get/set methods required)
  - **Escaping Rules**: Documentation for property metadata character escaping rules to prevent manifest parsing errors
- **Standard Properties Guide**: Significant updates including:
  - **TabIndex Property**: Complete implementation patterns with code examples for keyboard navigation and tab order control
  - **ControlExpression Support**: Documentation explaining that ControlExpression uses Value property's getter/setter (no separate methods needed)
  - **Width Validation Rules**: Critical documentation about width property limitations (no "auto" support, validation requirements, valid/invalid formats, error messages)
  - **Complete Implementation Templates**: Updated templates showing all standard properties including TabIndex
- **Form View Validation Guide**: Enhanced with design-time property validation section explaining the distinction between design-time validation (via manifest) and runtime validation (via Validate method)
- **Data Binding Guide**: Added critical limitation documentation - K2 controls can only have one ListData property per control, with explanation of SMO binding restrictions
- **Overview Guide**: Updated with accessibility section link, file upload/download control creation guidance, and updated Drag & Drop features list

#### Control Enhancements
- **Drag & Drop**: 
  - **File Download**: Added SmartObject file download support via a new action container.
  - **Icon-Only Mode**: New "ShowInformation" toggle for space-constrained layouts.
  - **Visual Overhaul**: Smoother drag animations and improved error state indicators.
- **Arabic Calendar**: Added `TabIndex` support and enhanced keyboard navigation for better accessibility.
- **Button List**: Added `MaxItems` property (int) with built-in design-time validation to limit item display.
- **CAPTCHA Box**: Improved documentation regarding CORS handling and production deployment.

#### UI/UX Improvements
- **Inspector Component**: Major refactoring and enhancements including TabIndex helper UI with increment/decrement buttons and value display, improved theme support, better validation feedback, and Flowbite integration
- **Wizard Component**: Major updates and enhancements including design-time validation functionality, width auto limitation validation (blocks "auto" as initial value), data type support, int property type support with ValidationMessage, and improved validation feedback
- **App Component**: Updates to main application component with improved navigation and theme support
- **Documents Component**: Updates to documentation viewer with improved page navigation and document link handling
- **Home Component**: Updates to home page with improved layout and content
- **ValidationErrorPopup Component**: New component for design-time validation feedback with theme support
- **File Generator**: Updates to control file generation utility with improved code generation
- **Styles**: Updates to main CSS file with improved theming and Flowbite integration

### Changed

#### Platform
- **Express v5 Upgrade**: Upgraded from Express v4 to Express v5 for improved performance and modern async/await support
- **Flowbite v4 Upgrade**: Upgraded from Flowbite v3 to Flowbite v4 for enhanced UI components, improved theming, and better component integration
- **Tailwind CSS v4**: Upgraded from Tailwind CSS v3 to v4 with new @tailwindcss/postcss and @tailwindcss/vite packages for better build performance
- **Archiver Upgrade**: Upgraded archiver package for improved ZIP generation
- **Vite Upgrade**: Updated to latest Vite version for improved build performance
- **Package Updates**: Updated all dependencies to latest compatible versions for security and performance
- **Build Configuration**: Updates to PostCSS and Vite configuration for optimized builds
- **Base Control Script**: Updates to k2-base-control.js with code improvements

#### Documentation
- **Standard Properties Guide**: Enhanced with TabIndex implementation details, ControlExpression documentation, and comprehensive width validation rules
- **Manifest Configuration Guide**: Major updates with data types documentation, property categories, validation fields, int type documentation, and ControlExpression support
- **Form View Validation Guide**: Enhanced with design-time property validation section explaining validationpattern and validationmessage
- **Data Binding Guide**: Updated with ListData limitation documentation
- **Overview Guide**: Updated with accessibility section and file upload/download guidance
### Technical Notes

#### Breaking Changes
- None

#### Migration
- No manual migration steps required

#### Requirements
- Node.js 14+ and a modern web browser

---

## [1.0.0] - First Public Release

### Added
- Initial release of Control Dojo
- Control Inspector for debugging existing controls
- Control Wizard for creating new controls
- Support for multiple control examples
- ZIP generation for control packages
