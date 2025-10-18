const fs = require('fs');
const path = require('path');

// Get the absolute path to the MCP server
const mcpServerPath = path.join(__dirname, 'dist', 'index.js');

// Create the configuration object
const config = {
  mcpServers: {
    'mcp-api-server': {
      command: 'node',
      args: [mcpServerPath],
      env: {
        API_BASE_URL: 'http://localhost:3000/api',
      },
    },
  },
};

// Display the configuration
console.log('\n=== MCP Server Configuration ===\n');
console.log('Copy this configuration to your Claude Desktop config file:\n');
console.log(JSON.stringify(config, null, 2));
console.log('\n');

// Platform-specific config file locations
console.log('Claude Desktop Config Locations:');
console.log('-----------------------------------');

if (process.platform === 'win32') {
  const appData = process.env.APPDATA || path.join(process.env.USERPROFILE, 'AppData', 'Roaming');
  const configPath = path.join(appData, 'Claude', 'claude_desktop_config.json');
  console.log(`Windows: ${configPath}`);
} else if (process.platform === 'darwin') {
  const configPath = path.join(
    process.env.HOME,
    'Library',
    'Application Support',
    'Claude',
    'claude_desktop_config.json',
  );
  console.log(`macOS: ${configPath}`);
} else {
  const configPath = path.join(
    process.env.HOME,
    '.config',
    'Claude',
    'claude_desktop_config.json',
  );
  console.log(`Linux: ${configPath}`);
}

console.log('\n');
console.log('Steps:');
console.log('1. Open the config file location above');
console.log('2. Paste the configuration shown above');
console.log('3. Save the file');
console.log('4. Restart Claude Desktop');
console.log('\n');

// Also save to a local file for reference
const localConfigPath = path.join(__dirname, 'generated-config.json');
fs.writeFileSync(localConfigPath, JSON.stringify(config, null, 2));
console.log(`✓ Configuration also saved to: ${localConfigPath}`);
console.log('\n');
