// Test script to verify explorer opening works
const { spawn } = require('child_process');
const path = require('path');

const controlsDir = path.join(__dirname, '..', 'Controls');
console.log(`Testing directory opening: ${controlsDir}`);

const child = spawn('explorer', [controlsDir], { 
    detached: true, 
    stdio: 'ignore' 
});

child.on('error', (error) => {
    console.log('Error opening directory:', error.message);
});

child.on('spawn', () => {
    console.log('Successfully spawned explorer process');
    child.unref();
});

setTimeout(() => {
    console.log('Test completed');
    process.exit(0);
}, 2000);
