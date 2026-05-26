import type { AutomationKeyType } from './types';

function getServerPath() {
  return 'npx -y @pathworks/mcp';
}

export function getAutomationSetupSecret(secret: string | null) {
  return secret ?? '<paste-your-mcp-key>';
}

export function getClaudeCodeSnippet(secret: string | null) {
  const apiKey = getAutomationSetupSecret(secret);

  return `claude mcp add-json pathworks '{
  "command": "npx",
  "args": ["-y", "@pathworks/mcp"],
  "env": {
    "PATHWORKS_API_URL": "https://api.pathworks.neur3.dev",
    "PATHWORKS_API_KEY": "${apiKey}"
  }
}'`;
}

export function getCodexSnippet(secret: string | null) {
  const apiKey = getAutomationSetupSecret(secret);

  return `codex mcp add pathworks \\
  --env PATHWORKS_API_URL=https://api.pathworks.neur3.dev \\
  --env PATHWORKS_API_KEY=${apiKey} \\
  -- npx -y @pathworks/mcp`;
}

export function getOpenCodeSnippet(secret: string | null) {
  const apiKey = getAutomationSetupSecret(secret);

  return `{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "pathworks": {
      "type": "local",
      "command": ["npx", "-y", "@pathworks/mcp"],
      "enabled": true,
      "environment": {
        "PATHWORKS_API_URL": "https://api.pathworks.neur3.dev",
        "PATHWORKS_API_KEY": "${apiKey}"
      }
    }
  }
}`;
}

export function getCursorSnippet(secret: string | null) {
  const apiKey = getAutomationSetupSecret(secret);

  return `{
  "mcpServers": {
    "pathworks": {
      "command": "npx",
      "args": ["-y", "@pathworks/mcp"],
      "env": {
        "PATHWORKS_API_URL": "https://api.pathworks.neur3.dev",
        "PATHWORKS_API_KEY": "${apiKey}"
      }
    }
  }
}`;
}

export function getDefaultAutomationKeyLabel(type: AutomationKeyType) {
  switch (type) {
    case 'mcp':
      return 'PathWorks MCP';
    case 'api':
      return 'PathWorks API';
    case 'zapier':
      return 'PathWorks Zapier';
  }
}

export function getAutomationKeyTypeLabel(type: AutomationKeyType) {
  switch (type) {
    case 'mcp':
      return 'MCP';
    case 'api':
      return 'API';
    case 'zapier':
      return 'Zapier';
  }
}

export function getMaskedAutomationSecret(prefix: string) {
  return `${prefix}...`;
}

export function getCopyableServerCommand() {
  return getServerPath();
}
