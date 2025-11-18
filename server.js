// Simple server to handle generate_controls_list.js execution
import express from 'express';
import { exec, spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import archiver from 'archiver';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3002;

// Middleware
app.use(express.json());
app.use(express.static('.'));

// Endpoint to run generate_controls_list.js
app.post('/api/generate-controls', (req, res) => {
    console.log('Running generate_controls_list.js...');
    
    exec('node scripts/generate_controls_list.js', { cwd: __dirname }, (error, stdout, stderr) => {
        if (error) {
            console.error('Error running script:', error);
            return res.status(500).json({ 
                success: false, 
                error: error.message,
                stdout: stdout,
                stderr: stderr
            });
        }
        
        console.log('Script output:', stdout);
        if (stderr) console.log('Script stderr:', stderr);
        
        // Check if index.json was updated
        const indexPath = path.join(__dirname, 'Controls', 'index.json');
        if (fs.existsSync(indexPath)) {
            const content = fs.readFileSync(indexPath, 'utf8');
            console.log('Updated index.json:', content);
        }
        
        res.json({ 
            success: true, 
            message: 'Controls list generated successfully',
            stdout: stdout,
            stderr: stderr
        });
    });
});

// Endpoint to get current controls
app.get('/api/controls', (req, res) => {
    const indexPath = path.join(__dirname, 'Controls', 'index.json');
    if (fs.existsSync(indexPath)) {
        const content = fs.readFileSync(indexPath, 'utf8');
        res.json(JSON.parse(content));
    } else {
        res.json([]);
    }
});

// Endpoint to generate a new control from wizard
app.post('/api/generate-control', (req, res) => {
    const { files, controlName } = req.body;
    
    if (!files || !controlName) {
        return res.status(400).json({ 
            success: false, 
            error: 'Files and control name are required' 
        });
    }
    
    // Create a temporary directory for the new control
    const tempDir = path.join(__dirname, 'temp', controlName);
    const zipPath = path.join(__dirname, 'temp', `${controlName}.zip`);
    
    // Ensure temp directory exists
    if (!fs.existsSync(path.join(__dirname, 'temp'))) {
        fs.mkdirSync(path.join(__dirname, 'temp'));
    }
    
    // Create control directory
    if (fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true });
    }
    fs.mkdirSync(tempDir);
    
    // Write files
    Object.keys(files).forEach(fileName => {
        const filePath = path.join(tempDir, fileName);
        fs.writeFileSync(filePath, files[fileName]);
    });
    
    // Create ZIP
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });
    
    output.on('close', () => {
        console.log(`Control generated: ${zipPath} (${archive.pointer()} bytes)`);
        
        // Send the ZIP file
        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', `attachment; filename="${controlName}.zip"`);
        
        const zipStream = fs.createReadStream(zipPath);
        zipStream.pipe(res);
        
        // Clean up after sending
        zipStream.on('end', () => {
            fs.rmSync(tempDir, { recursive: true });
            fs.unlinkSync(zipPath);
        });
    });
    
    archive.on('error', (err) => {
        console.error('Archive error:', err);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to create ZIP: ' + err.message 
        });
    });
    
    archive.pipe(output);
    archive.directory(tempDir, false);
    archive.finalize();
});

// Endpoint to create ZIP of a control folder
app.post('/api/zip-control', async (req, res) => {
    console.log('Received ZIP request:', req.body);
    const { folderName, controlPath: customPath } = req.body;
    
    if (!folderName) {
        return res.status(400).json({ 
            success: false, 
            error: 'Folder name is required' 
        });
    }
    
    // Use custom path if provided, otherwise assume it's in Controls folder
    const controlPath = customPath || path.join(__dirname, 'Controls', folderName);
    let zipPath = path.join(__dirname, 'Controls', `${folderName}.zip`);
    
    // Check if control folder exists
    if (!fs.existsSync(controlPath)) {
        return res.status(404).json({ 
            success: false, 
            error: `Control folder '${folderName}' not found at ${controlPath}` 
        });
    }
    
    // Ensure Controls directory exists
    const controlsDir = path.join(__dirname, 'Controls');
    if (!fs.existsSync(controlsDir)) {
        try {
            fs.mkdirSync(controlsDir, { recursive: true });
        } catch (e) {
            return res.status(500).json({ 
                success: false, 
                error: 'Failed to create Controls directory: ' + e.message 
            });
        }
    }
    
    // Delete existing ZIP if it exists
    if (fs.existsSync(zipPath)) {
        try {
            fs.unlinkSync(zipPath);
            console.log(`Deleted existing ZIP: ${zipPath}`);
            // Add a small delay to ensure the file is fully deleted
            await new Promise(resolve => setTimeout(resolve, 100));
        } catch (e) {
            console.error('Error deleting existing ZIP:', e);
            // If we can't delete the existing file, try to create with a timestamp
            const timestamp = Date.now();
            const newZipPath = path.join(__dirname, 'Controls', `${folderName}_${timestamp}.zip`);
            console.log(`Creating new ZIP with timestamp: ${newZipPath}`);
            zipPath = newZipPath;
        }
    }
    
    // Create new ZIP
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });
    
    // Handle output stream errors
    output.on('error', (err) => {
        console.error('Output stream error:', err);
        if (!res.headersSent) {
            res.status(500).json({ 
                success: false, 
                error: 'Failed to create ZIP file: ' + err.message 
            });
        }
    });
    
    output.on('close', () => {
        clearTimeout(timeout);
        console.log(`ZIP created: ${zipPath} (${archive.pointer()} bytes)`);
        
        // Open the directory where the ZIP was created
        const controlsDir = path.join(__dirname, 'Controls');
        
        console.log(`Attempting to open directory: ${controlsDir}`);
        
        // Use spawn for better control on Windows
        let child;
        if (process.platform === 'win32') {
            child = spawn('explorer', [controlsDir], { 
                detached: true, 
                stdio: 'ignore' 
            });
        } else if (process.platform === 'darwin') {
            child = spawn('open', [controlsDir], { 
                detached: true, 
                stdio: 'ignore' 
            });
        } else {
            child = spawn('xdg-open', [controlsDir], { 
                detached: true, 
                stdio: 'ignore' 
            });
        }
        
        child.on('error', (error) => {
            console.log('Could not open directory:', error.message);
        });
        
        child.on('spawn', () => {
            console.log(`Successfully opened directory: ${controlsDir}`);
            child.unref(); // Allow the parent process to exit
        });
        
        // Send JSON response
        if (!res.headersSent) {
            res.json({ 
                success: true, 
                message: `ZIP created successfully: ${folderName}.zip`,
                zipPath: `${folderName}.zip`,
                size: archive.pointer(),
                directoryOpened: controlsDir
            });
        }
    });
    
    archive.on('error', (err) => {
        console.error('Archive error:', err);
        if (!res.headersSent) {
            res.status(500).json({ 
                success: false, 
                error: 'Failed to create ZIP: ' + err.message 
            });
        }
    });
    
    // Set a timeout to prevent hanging requests
    const timeout = setTimeout(() => {
        if (!res.headersSent) {
            console.error('ZIP creation timeout');
            res.status(500).json({ 
                success: false, 
                error: 'ZIP creation timed out' 
            });
        }
    }, 30000); // 30 second timeout
    
    
    archive.pipe(output);
    archive.directory(controlPath, false);
    archive.finalize();
});

// Documentation API endpoints
app.get('/api/docs', (req, res) => {
    const docsDir = path.join(__dirname, 'docs');
    
    if (!fs.existsSync(docsDir)) {
        return res.json([]);
    }
    
    try {
        // Define logical order for documentation
        const docOrder = [
            'Overview.md',
            'Getting Started.md',
            'Manifest Configuration.md',
            'Standard Properties.md',
            'Script References.md',
            'Data Binding.md',
            'Form View Validation.md',
            'Triggering Control Methods.md',
            'Responsive Controls.md',
            'Style Integration.md',
            'Localization.md'
        ];
        
        const allFiles = fs.readdirSync(docsDir)
            .filter(file => file.endsWith('.md'))
            .map(file => ({
                filename: file,
                title: file.replace('.md', '').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                order: docOrder.indexOf(file) !== -1 ? docOrder.indexOf(file) : 999
            }))
            .sort((a, b) => {
                // Sort by order first, then alphabetically for any files not in the order list
                if (a.order !== b.order) {
                    return a.order - b.order;
                }
                return a.filename.localeCompare(b.filename);
            })
            .map(({ filename, title }) => ({ filename, title }));
        
        res.json(allFiles);
    } catch (error) {
        console.error('Error reading docs directory:', error);
        res.status(500).json({ error: 'Failed to read documentation files' });
    }
});

app.get('/api/docs/:filename', (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(__dirname, 'docs', filename);
    
    // Security check - ensure the file is in the docs directory
    if (!filePath.startsWith(path.join(__dirname, 'docs'))) {
        return res.status(403).json({ error: 'Access denied' });
    }
    
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'Document not found' });
    }
    
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.send(content);
    } catch (error) {
        console.error('Error reading document:', error);
        res.status(500).json({ error: 'Failed to read document' });
    }
});

// Load control into workbench endpoint
app.post('/api/load-to-workbench', (req, res) => {
    const { files, controlName, displayName } = req.body;
    
    if (!files || !controlName) {
        return res.status(400).json({ 
            success: false, 
            error: 'Files and control name are required' 
        });
    }
    
    try {
        // Create control directory in Controls folder
        const controlsDir = path.join(__dirname, 'Controls');
        const controlDir = path.join(controlsDir, controlName);
        
        // Ensure Controls directory exists
        if (!fs.existsSync(controlsDir)) {
            fs.mkdirSync(controlsDir, { recursive: true });
        }
        
        // Remove existing control directory if it exists
        if (fs.existsSync(controlDir)) {
            fs.rmSync(controlDir, { recursive: true });
        }
        
        // Create new control directory
        fs.mkdirSync(controlDir);
        
        // Write files to control directory
        Object.keys(files).forEach(fileName => {
            const filePath = path.join(controlDir, fileName);
            fs.writeFileSync(filePath, files[fileName]);
        });
        
        // Regenerate controls index
        exec('node scripts/generate_controls_list.js', { cwd: __dirname }, (error, stdout, stderr) => {
            if (error) {
                console.error('Error regenerating controls index:', error);
                // Don't fail the request, just log the error
            } else {
                console.log('Controls index regenerated successfully');
            }
        });
        
        console.log(`Control loaded into workbench: ${controlName}`);
        
        res.json({ 
            success: true, 
            message: `Control '${displayName || controlName}' loaded successfully into workbench`,
            controlPath: controlDir,
            filesCreated: Object.keys(files)
        });
        
    } catch (error) {
        console.error('Error loading control into workbench:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to load control into workbench: ' + error.message 
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
