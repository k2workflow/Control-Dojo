# Control Dojo

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Release](https://img.shields.io/github/v/release/k2workflow/Control-Dojo?sort=semver)](https://github.com/k2workflow/Control-Dojo/releases/latest)
![Node](https://img.shields.io/badge/node-%3E%3D14-brightgreen)

A modern web-based development environment for Nintex K2 custom controls with both debugging and control generation capabilities.

This repository is maintained by the Nintex Cyberpunks team. Teams and partners are encouraged to download or fork this repository to host their own Control Dojo instance. You control upgrades and deployments of your fork; however, upstream pull requests are not accepted and changes are not merged back into this repository.

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
3. Navigate to the folder where you extracted the Control Dojo project and click **Select Folder** (or **Open**)

You should now see the project files in the left sidebar of VS Code.

#### Step 3: Open the Terminal

1. In VS Code, click **Terminal** → **New Terminal** (or press `` Ctrl+` `` on Windows/Linux, or `` Cmd+` `` on Mac)
2. A terminal window will appear at the bottom of VS Code

**Explanation**: The terminal is a text-based interface where you type commands. Don't worry if it looks unfamiliar - we'll guide you through the exact commands to type.

#### Step 4: Install Dependencies

To download/install the required software libraries, type the following command and press **Enter**:

```bash
npm install
```

**If you see errors**: 
- Make sure you're in the correct folder (the terminal should show the Control Dojo folder path)
- Ensure Node.js is installed correctly (type `node --version` to check)
- Try running the command again

#### Step 5: Start the Application

Once `npm install` has finished, to start both the frontend and backend components, type this command and press **Enter**:

```bash
npm run dev:full
```

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

## Understanding the Application

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

When you're done using Control Dojo, press `Ctrl+C` (Windows/Linux) or `Cmd+C` (Mac) in the terminal window to stop both servers. You can then close your IDE when finished.

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

### Create Your Control Tab - Build New Controls
- **Step-by-Step Builder**: 6 intuitive steps to create custom controls
- **Standard Properties**: Width, Height, IsVisible, IsEnabled, etc.
- **Custom Properties**: Add unlimited custom properties with types
- **Event Definition**: Define custom events for your control
- **File Structure**: Choose which files to generate
- **Real-time Preview**: Live manifest preview and file list
- **ZIP Generation**: Download complete control packages

## License

Control Dojo is released under the MIT License. See the `LICENSE` file for the full text.

## Support

Control Dojo is a utility; you are responsible for your own custom controls. For self-service help and options (including Professional Services for paid engagements), see [.github/SUPPORT.md](.github/SUPPORT.md). GitHub issues and pull requests are not monitored for this project.

## Assets & Attribution

### Favicon
The application favicon is sourced from [SVG Repo](https://www.svgrepo.com/svg/23254/tools-folder) under the CC0 License. The original design represents a tools folder, perfectly symbolizing the Control Dojo's purpose as a development environment for custom controls.

- **Source**: [Tools Folder Icon](https://www.svgrepo.com/svg/23254/tools-folder)
- **Collection**: Tech Support
- **License**: CC0 License (Public Domain)
- **Uploader**: SVG Repo
