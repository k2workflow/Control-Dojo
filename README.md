# Control Dojo

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![Node](https://img.shields.io/badge/node-%3E%3D14-brightgreen)

A modern web-based development environment for K2/Nintex custom controls with both debugging and control generation capabilities.

This repository is maintained by the Nintex Cyberpunks team. The published codebase is intended for teams and partners to download or fork so they can host their own Control Dojo instance; upstream pull requests are not accepted.

## Getting Started

### Prerequisites

Before you begin, you'll need the following software installed on your computer:

1. **Node.js** (version 14 or higher)
   - **Download**: Visit [nodejs.org](https://nodejs.org/) and download the LTS (Long Term Support) version
   - **Installation**: Run the installer and follow the on-screen instructions
   - **Verification**: Open a command prompt or terminal and type `node --version` to verify installation

2. **Visual Studio Code (VS Code)** or another code editor
   - **Download**: Visit [code.visualstudio.com](https://code.visualstudio.com/) and download VS Code
   - **Installation**: Run the installer and follow the on-screen instructions
   - **Why VS Code?**: It's a free, user-friendly code editor that makes working with this project easier

### Step-by-Step Setup Instructions

#### Step 1: Download and Extract the Project

1. Download the Control Dojo project files to your computer
2. Extract the files to a location you can easily find (e.g., `C:\Control Dojo` on Windows, or `~/Documents/Control Dojo` on Mac/Linux)

#### Step 2: Open the Project in VS Code

1. Open Visual Studio Code
2. Click **File** → **Open Folder** (or press `Ctrl+K` then `Ctrl+O` on Windows/Linux, or `Cmd+K` then `Cmd+O` on Mac)
3. Navigate to the folder where you extracted the Control Dojo project
4. Click **Select Folder** (or **Open**)

You should now see the project files in the left sidebar of VS Code.

#### Step 3: Open the Terminal

1. In VS Code, click **Terminal** → **New Terminal** (or press `` Ctrl+` `` on Windows/Linux, or `` Cmd+` `` on Mac)
2. A terminal window will appear at the bottom of VS Code

**Explanation**: The terminal is a text-based interface where you type commands. Don't worry if it looks unfamiliar - we'll guide you through the exact commands to type.

#### Step 4: Install Dependencies

In the terminal, type the following command and press **Enter**:

```bash
npm install
```

**What this does**: This command downloads and installs all the software libraries and tools that Control Dojo needs to run. This may take a few minutes the first time.

**What to expect**: You'll see a lot of text scrolling by as packages are downloaded. This is normal! Wait until you see a prompt where you can type again (it will show your folder path).

**If you see errors**: 
- Make sure you're in the correct folder (the terminal should show the Control Dojo folder path)
- Ensure Node.js is installed correctly (type `node --version` to check)
- Try running the command again

#### Step 5: Start the Application

Once `npm install` has finished, type this command and press **Enter**:

```bash
npm run dev:full
```

**What this does**: This command starts both the frontend (web interface) and backend (server) components of Control Dojo simultaneously.

**What to expect**: You'll see output in the terminal showing that servers are starting. When ready, you'll see messages like:
- "VITE ready in X ms"
- "Server running on port 3001"

**Important**: Keep this terminal window open while using Control Dojo. Closing it will stop the application.

#### Step 6: Open Control Dojo in Your Browser

1. Open your web browser (Chrome, Firefox, Edge, etc.)
2. In the address bar, type: `http://localhost:3000`
3. Press **Enter**

You should now see the Control Dojo Home page!

**Troubleshooting**:
- If the page doesn't load, wait a few seconds and try again (the servers may still be starting)
- Make sure you typed `localhost:3000` correctly (no spaces, no `www`, no `https://`)
- Check that the terminal shows the servers are running
- Try refreshing the page (press `F5` or `Ctrl+R` / `Cmd+R`)

### Understanding the Application

- **Frontend (Port 3000)**: This is the web interface you see in your browser - the Control Dojo application itself
- **Backend (Port 3001)**: This is the server that handles file operations, ZIP generation, and other backend tasks

Both components must be running for Control Dojo to work properly. That's why we use `npm run dev:full` - it starts both at once!

### Alternative Development Commands

If you prefer to start the servers separately (useful for advanced debugging):

**Terminal 1 - Backend Server:**
```bash
npm run start:backend
```

**Terminal 2 - Frontend Server:**
```bash
npm run start:frontend
```

Then access the application at `http://localhost:3000` as before.

### Stopping the Application

When you're done using Control Dojo:
1. Go back to the terminal window in VS Code
2. Press `Ctrl+C` (Windows/Linux) or `Cmd+C` (Mac)
3. This will stop both servers
4. You can close VS Code when you're finished

## Features

### Home Tab - Getting Started
- **Welcome Screen**: Overview of Control Dojo and its capabilities
- **Tab Descriptions**: Quick reference guide to all available tabs and their use cases
- **Important Notices**: Clear explanations about preview limitations and what to expect

### Inspector Tab - Debug Existing Controls
- **Dual Preview**: Test controls in both design-time and runtime environments
- **Property Management**: Interactive property panel with real-time updates
- **Event Testing**: Trigger and monitor custom events
- **Script & Style Management**: Enable/disable individual scripts and styles
- **Auto-Discovery**: Automatically detect and load controls from Controls folder
- **ZIP Export**: Create ZIP archives of existing controls
- **Console Logging**: Real-time debugging and logging

**Important Note**: The Designer and Runtime previews in the Inspector tab are **not 1-to-1 representations** of what you'll see when the control is imported into K2/Nintex. These previews do not include the form and view panel and table layouts that K2/Nintex provides. They are debugging tools to help test functionality, properties, and events before importing into the actual K2/Nintex environment.

### Create Your Control Tab - Build New Controls
- **Step-by-Step Builder**: 6 intuitive steps to create custom controls
- **Standard Properties**: Width, Height, IsVisible, IsEnabled, etc.
- **Custom Properties**: Add unlimited custom properties with types
- **Event Definition**: Define custom events for your control
- **File Structure**: Choose which files to generate
- **Real-time Preview**: Live manifest preview and file list
- **ZIP Generation**: Download complete control packages

## Architecture

This application uses a **two-server architecture** for optimal development and production:

### Frontend (Vue 3 + Vite + Tailwind)
- **Modern Framework**: Vue 3 with Composition API
- **Fast Development**: Vite with instant HMR (10x faster than webpack)
- **Beautiful UI**: Tailwind CSS with responsive design
- **Component-based**: Reusable, maintainable code
- **Port**: 3000 (development), serves the main application

### Backend (Express)
- **API Endpoints**: Control loading, ZIP generation, file management
- **Template Processing**: Server-side code generation
- **File Operations**: ZIP creation and file system management
- **Port**: 3001, handles all API requests

### How They Work Together
- The Vite dev server automatically proxies API calls from `/api/*` to the Express server
- Both servers must be running for full functionality
- Use `npm run dev:full` to start both servers with one command

## Project Structure

```
Control Dojo/
├── src/
│   ├── components/
│   │   ├── Home.vue          # Welcome and overview page
│   │   ├── Inspector.vue     # Debug existing controls
│   │   ├── Wizard.vue        # Step-by-step control builder
│   │   └── Documents.vue     # Documentation viewer
│   ├── utils/
│   │   └── file-generator.js  # Template processing
│   ├── templates/             # Code templates
│   └── styles/
│       └── main.css          # Tailwind + custom styles
├── Controls/                 # Control library (place your controls here for permanent access)
├── loaders/                  # Iframe loaders
├── assets/                   # Static assets
├── server.js                 # Express backend
└── vite.config.js           # Vite configuration
```

## Usage

### Inspector Tab - Debugging Controls
1. **Load Control**: 
   - **Permanent (Recommended)**: Place your control folder (with all files including manifest.json) in the `Controls` folder, then click the **Refresh** button. The control will appear in the dropdown and remain available after reloads.
   - **Temporary**: Click **Load from Folder** to browse and load a control from anywhere on your system. This loads the control temporarily - it will disappear after a page reload, so you'll need to load it again.
2. **Preview the Control**: Switch between **Design-time** and **Runtime** tabs to see how the control behaves in different modes.
3. **Refresh Button**: When you make changes to your control files (JavaScript, CSS, etc.), use the **Refresh** button next to the Design-time/Runtime tabs to reload both frames without refreshing the entire page. This preserves your property values and console logs while showing your latest changes. The development server is configured to ignore changes in the `Controls` folder, so you won't get unwanted reload prompts.
4. **Test Properties**: Modify properties and see real-time updates. Use the inline list editor for List properties to add, edit, or delete items.
5. **Trigger Events**: Click events to test functionality
6. **Trigger Methods**: Click methods to execute them on the control
7. **Toggle Scripts/Styles**: Enable/disable individual files for debugging
8. **Export ZIP**: Download control as ZIP archive

### Create Your Control Tab - Creating Controls

1. **Basic Info**: Enter control name, display name, tag name
2. **Standard Properties**: Select which standard K2/Nintex properties to support
3. **Custom Properties**: Add custom properties with types and defaults
4. **Events**: Define custom events for your control
5. **File Structure**: Choose which files to generate
6. **Generate**: Preview manifest and download ZIP

## Control Structure

Each custom control should include:
- `manifest.json` - Control definition and metadata
- **Required**: Icon file (SVG, JPG, JPEG, or PNG format)
- **Required**: Runtime JavaScript files (referenced in `runtimeScriptFileNames`)
- **Required**: Runtime CSS files (referenced in `runtimeStyleFileNames`)
- **Required**: Design-time files (referenced in `designtimeScriptFileNames` and `designtimeStyleFileNames`)

**File Structure Options:**
- **Separate Files**: Different scripts/styles for runtime vs design-time (recommended for complex controls)
- **Shared Files**: Same scripts/styles used for both runtime and design-time (simpler approach)

## Deployment

1. Build the frontend: `npm run build`
2. Deploy the `dist/` folder
3. Run the Express server: `npm start`
4. Configure reverse proxy if needed

## Configuration

### Vite Config (`vite.config.js`)
- Vue plugin with HMR
- Path aliases for clean imports
- Proxy to Express server
- Build optimization

### Tailwind Config (`tailwind.config.js`)
- Custom color palette
- Component utility classes
- Responsive breakpoints

## Notes

- **Backward Compatible**: All original functionality preserved in Inspector tab
- **Modern UI**: Beautiful, responsive design with Tailwind CSS
- **Performance**: 10x faster development with Vite
- **File Generation**: Server-side template processing for reliability
- **Easy Migration**: Gradual adoption of new features

## Forks and Customization

Clone or fork this repository to build a customized version of Control Dojo for your environment. You control upgrades and deployments of your fork; changes are not merged upstream.

## Support

For questions, bug reports, or feature requests, contact Nintex Support through the standard support channels. GitHub issues and pull requests are not monitored for this project.

## License

Control Dojo is released under the MIT License. See the `LICENSE` file for the full text.

## Assets & Attribution

### Favicon
The application favicon is sourced from [SVG Repo](https://www.svgrepo.com/svg/23254/tools-folder) under the CC0 License. The original design represents a tools folder, perfectly symbolizing the Control Dojo's purpose as a development environment for custom controls.

- **Source**: [Tools Folder Icon](https://www.svgrepo.com/svg/23254/tools-folder)
- **Collection**: Tech Support
- **License**: CC0 License (Public Domain)
- **Uploader**: SVG Repo
