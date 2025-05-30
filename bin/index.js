#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const manifest = require('../src/manifest'); // We need the manifest for the server name

// Configure yargs
const argv = yargs(hideBin(process.argv))
  .option('port', {
    alias: 'p',
    type: 'number',
    description: 'Port to run the server on'
  })
  .option('access-token', { // New option for access token
    alias: 't',
    type: 'string',
    description: 'Breathecode API access token'
  })
  .help()
  .alias('help', 'h')
  .argv;

// Determine port: CLI > Environment > Default
const cliPort = argv.port;
const envPort = process.env.PORT;
const defaultPort = 4321;
let resolvedPort = defaultPort;

if (cliPort !== undefined) {
  resolvedPort = cliPort;
} else if (envPort !== undefined) {
  resolvedPort = parseInt(envPort, 10);
  if (isNaN(resolvedPort)) {
    console.warn(`Warning: Invalid PORT environment variable '${envPort}'. Using default port ${defaultPort}.`);
    resolvedPort = defaultPort;
  }
} 

// Pass the resolved port to the server by setting it as an environment variable
// This way src/server.js doesn't need to know about yargs
process.env.PORT = resolvedPort.toString();

// Determine Access Token: CLI > Environment > Not Set
const cliToken = argv.accessToken;
const envToken = process.env.BREATHECODE_ACCESS_TOKEN;
let resolvedToken = null; // Default to null if not provided

if (cliToken) {
  resolvedToken = cliToken;
  console.log("Using Breathecode access token from CLI argument.");
} else if (envToken) {
  resolvedToken = envToken;
  console.log("Using Breathecode access token from BREATHECODE_ACCESS_TOKEN environment variable.");
} else {
  console.warn("Warning: Breathecode access token not provided via CLI (--access-token or -t) or BREATHECODE_ACCESS_TOKEN environment variable. Some tools may not function.");
}

if (resolvedToken) {
  // Make the token available to the server module via an environment variable
  process.env.RESOLVED_BREATHECODE_TOKEN = resolvedToken;
}

function registerAgent() {
  const mcpDir = path.join(os.homedir(), '.mcp');
  const serversFile = path.join(mcpDir, 'mcpServers.json');
  // Use the globally set process.env.PORT which has been resolved
  const port = process.env.PORT;
  const serverUrl = `http://localhost:${port}`;

  if (!fs.existsSync(mcpDir)) {
    fs.mkdirSync(mcpDir, { recursive: true });
    console.log(`Created directory: ${mcpDir}`)
  }

  let servers = [];
  if (fs.existsSync(serversFile)) {
    try {
      servers = JSON.parse(fs.readFileSync(serversFile, 'utf-8'));
      if (!Array.isArray(servers)) {
        console.warn(`Warning: ${serversFile} does not contain a valid JSON array. Initializing with new array.`);
        servers = [];
      }
    } catch (error) {
      console.warn(`Warning: Could not parse ${serversFile}. Initializing with new array. Error: ${error.message}`);
      servers = [];
    }
  }

  // Use manifest.name as the agent name
  const agentName = manifest.name || '4Geeks MCP Agent'; // Fallback name

  const existingAgentIndex = servers.findIndex(server => server.name === agentName);

  if (existingAgentIndex !== -1) {
    // Update existing agent URL if it's different
    if (servers[existingAgentIndex].url !== serverUrl) {
      servers[existingAgentIndex].url = serverUrl;
      console.log(`Updated existing agent '${agentName}' in ${serversFile}`);
    } else {
      console.log(`Agent '${agentName}' already registered and up-to-date in ${serversFile}`);
      return; // No change needed
    }
  } else {
    // Add new agent
    servers.push({ name: agentName, url: serverUrl });
    console.log(`Registered new agent '${agentName}' in ${serversFile}`);
  }

  try {
    fs.writeFileSync(serversFile, JSON.stringify(servers, null, 2));
  } catch (error) {
    console.error(`Error writing to ${serversFile}: ${error.message}`);
  }
}

// Register the agent before starting the server
registerAgent();

require('../src/server'); 