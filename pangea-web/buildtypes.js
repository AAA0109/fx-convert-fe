/* eslint-disable @typescript-eslint/no-var-requires */

const fs = require('fs'),
  path = require('path'),
  filePath = path.join(__dirname, 'buildtypes.ps1');
const PowerShell = require('powershell');
const fileContents = fs.readFileSync(filePath, { endcoding: 'utf-8' });

// Start the process
let ps = new PowerShell(fileContents);

// Handle process errors (e.g. powershell not found)
ps.on('error', (err) => {
  console.error(err);
});

// Stdout
ps.on('output', (data) => {
  console.log(data);
});

// Stderr
ps.on('error-output', (data) => {
  console.error(data);
});

// End
ps.on('end', (code) => {
  // Do Something on end
});
