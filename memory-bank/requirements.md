# 🧠 My Local MCP Agent

A lightweight, local MCP (Multi-Agent Communication Protocol) server compatible with tools like Cursor, Windsurf, and Claude. This agent exposes a manifest and basic `/chat` endpoint that allows it to be discovered and queried by other agents.

---

## 🚀 Features

- MCP-compliant manifest at `/.well-known/mcp-manifest.json`
- Simple `/chat` endpoint that echoes input
- Runs via `npx` or local CLI
- Easy config through `~/.mcp/mcpServers.json`

---

## 📦 Installation

Clone this repo or use it directly with `npx`:

```bash
npx --yes ./bin/index.js
