// Simple script to generate controls list for the workbench
// Run this with: node generate_controls_list.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getCaseInsensitiveProperty(obj, propName) {
    if (!obj || typeof obj !== 'object') {
        return undefined;
    }

    if (Object.prototype.hasOwnProperty.call(obj, propName)) {
        return obj[propName];
    }

    const target = propName.toLowerCase();
    for (const key of Object.keys(obj)) {
        if (key.toLowerCase() === target) {
            return obj[key];
        }
    }

    return undefined;
}

function findControls() {
    const controlsDir = path.join(__dirname, '..', 'Controls');
    const controls = [];
    
    console.log('Looking for controls in:', controlsDir);
    
    if (!fs.existsSync(controlsDir)) {
        console.log('Controls directory not found:', controlsDir);
        return controls;
    }
    
    const items = fs.readdirSync(controlsDir);
    console.log('Found items in Controls directory:', items);
    
    for (const item of items) {
        const itemPath = path.join(controlsDir, item);
        const stat = fs.statSync(itemPath);
        
        if (stat.isDirectory()) {
            console.log(`Checking directory: ${item}`);
            // Check if it has a manifest.json
            const manifestPath = path.join(itemPath, 'manifest.json');
            const manifestPathCap = path.join(itemPath, 'Manifest.json');
            
            if (fs.existsSync(manifestPath) || fs.existsSync(manifestPathCap)) {
                console.log(`Found manifest for ${item}`);
                // Validate that it has required files
                const manifestFile = fs.existsSync(manifestPath) ? manifestPath : manifestPathCap;
                try {
                    const manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf8'));
                    
                    // Check for required fields
                    const tagName = getCaseInsensitiveProperty(manifest, 'tagName');
                    if (tagName) {
                        console.log(`Manifest has tagName: ${tagName}`);
                        // Check for at least one runtime file
                        const runtimeScripts = getCaseInsensitiveProperty(manifest, 'runtimeScriptFileNames');
                        const runtimeStyles = getCaseInsensitiveProperty(manifest, 'runtimeStyleFileNames');
                        const hasRuntimeFiles = (runtimeScripts && runtimeScripts.length > 0) ||
                                             (runtimeStyles && runtimeStyles.length > 0);
                        
                        console.log(`Runtime files check: ${hasRuntimeFiles}`);
                        console.log(`Script files: ${runtimeScripts}`);
                        console.log(`Style files: ${runtimeStyles}`);
                        
                        if (hasRuntimeFiles) {
                            console.log(`Valid control: ${item}`);
                            controls.push(item);
                        } else {
                            console.log(`Invalid control: ${item} - missing runtime files`);
                        }
                    } else {
                        console.log(`Invalid control: ${item} - missing tagName`);
                    }
                } catch (e) {
                    console.log(`Error parsing manifest for ${item}:`, e.message);
                }
            } else {
                console.log(`No manifest found for ${item}`);
            }
        } else {
            console.log(`Skipping non-directory: ${item}`);
        }
    }
    
    return controls;
}

function main() {
    console.log('Scanning for Control Dojo controls...');
    const controls = findControls();
    
    if (controls.length > 0) {
        const indexPath = path.join(__dirname, '..', 'Controls', 'index.json');
        fs.writeFileSync(indexPath, JSON.stringify(controls, null, 2));
        console.log(`\nGenerated index.json with ${controls.length} controls:`);
        console.log(JSON.stringify(controls, null, 2));
    } else {
        console.log('\nNo valid controls found.');
    }
}

main();

