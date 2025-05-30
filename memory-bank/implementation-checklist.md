## MCP Server Implementation Plan

### Phase 1: Project Setup

- [x] **Initialize project**
    - [x] Create a new project folder.
    - [x] Initialize with a package manager (e.g., `npm init`).
    - [x] Create `bin/` and `src/` directories.
- [x] **Set up CLI entry point**
    - [x] Create an executable file in `bin/` that will be the `npx`-callable entry.
- [x] **Run a dummy script via `npx`**
    - [x] Confirm you can run `npx ./bin/index.js` and see output.
    - [x] **Test:** Confirm that a console log prints something like "MCP Server starting…".

---

### Phase 2: Basic HTTP Server

- [x] **Implement a minimal HTTP server**
    - [x] Bind to `localhost` on a fixed port (e.g., `4321`).
- [x] **Add a root route `/`**
    - [x] Return a plain-text "OK" response.
- [x] **Test the HTTP server**
    - [x] **Test:** Open `http://localhost:4321/` in a browser or use `curl` to confirm "OK" is returned.

---

### Phase 3: MCP Manifest

- [x] **Create manifest data structure**
    - [x] Use a separate file to define MCP manifest metadata.
- [x] **Serve `/.well-known/mcp-manifest.json`**
    - [x] Respond with a valid JSON manifest at the required route.
- [x] **Test manifest availability**
    - [x] **Test:** Request `http://localhost:4321/.well-known/mcp-manifest.json` and confirm structure.

---

### Phase 4: Implement `/chat` Endpoint

- [x] **Add `/chat` route (POST only)**
    - [x] Accept a JSON payload with a `message` field.
- [x] **Respond with simple echo reply**
    - [x] Format a JSON reply: `{ reply: "Echo: <message>" }`.
- [x] **Test basic chat functionality**
    - [x] **Test:** Use Postman or `curl` to POST to `/chat` and verify the echoed message.

---

### Phase 5: Integration via `mcpServers.json`

- [x] **Create the `.mcp` directory if it doesn't exist**
    - [x] Store config in the user's home directory.
- [x] **Write entry to `~/.mcp/mcpServers.json`**
    - [x] Add this server's name and URL to the array of MCP servers.
- [x] **Test agent discovery**
    - [x] **Test:** Open and verify that your server appears in `~/.mcp/mcpServers.json`.

---

### Phase 6: Dynamic Configuration and Port Handling

- [x] **Add optional support for environment-based port**
    - [x] Use `PORT` from env vars, fallback to default.
- [x] **Make server configurable through CLI or env**
    - [x] Allow optional arguments (e.g., config file path, port override).
- [x] **Test port override and config loading**
    - [x] **Test:** Run server with a custom port and confirm it's reflected in URL and manifest.

---

### Phase 7: Final Sanity Checks

- [x] **Test all endpoints together**
    - [x] Run a test suite or manual checks on:
        - [x] `/` root
        - [x] `/.well-known/mcp-manifest.json`
        - [x] `/chat` POST
- [x] **Simulate another agent discovering and using your agent**
    - [x] Manually or via tool (like Cursor or Claude), test discovery and interaction.

## MCP Server: `/tools` Capability Implementation Checklist

---

### Phase 1: Configuration for API Token

- [ ] **Update `bin/index.js` for Token Configuration**
    - [ ] Modify `yargs` setup to accept a `--access-token` (or `-t`) CLI argument.
    - [ ] Establish precedence: CLI argument > Environment variable (`BREATHECODE_ACCESS_TOKEN`) > Default (or error if not provided and required).
    - [ ] Store the resolved token securely, accessible by the server logic.
- [ ] **Update Agent Registration for Token Info (Conceptual)**
    - [ ] Consider how agent registration might reflect token requirement (no direct file changes yet).
- [ ] **Test Token Configuration**
    - [ ] Test passing token via CLI argument.
    - [ ] Test passing token via environment variable.
    - [ ] Test precedence.

---

### Phase 2: Define and Expose `/tools` Endpoint

- [ ] **Update `src/manifest.js`**
    - [ ] Add `tools` capability (e.g., `"get": "/tools"`).
- [ ] **Modify `src/server.js` to Handle `/tools` Route**
    - [ ] Add `GET /tools` route handler.
    - [ ] Return JSON array describing available tools (initially `get_events`).
- [ ] **Define `get_events` Tool Structure in `src/tools.js`**
    - [ ] Create `src/tools.js`.
    - [ ] Define `get_events` tool metadata (name, description, parameters, execution path).
- [ ] **Test `/tools` Endpoint**
    - [ ] Restart server.
    - [ ] Check manifest for `tools` capability.
    - [ ] Request `/tools` and verify `get_events` tool description.

---

### Phase 3: Implement Tool Execution Logic

- [ ] **Create `/execute/:tool_name` Endpoint in `src/server.js`**
    - [ ] Add dynamic route for `POST /execute/:tool_name`.
- [ ] **Implement `get_events` Tool Logic in `src/tools.js` (or new file)**
    - [ ] Create function to call Breathecode API (`GET /v1/events/me`) with token.
    - [ ] Include `Authorization: Bearer <access_token>` header.
    - [ ] Parse JSON response.
- [ ] **Connect `/execute/get_events` to Tool Logic**
    - [ ] In route handler, ensure token availability.
    - [ ] Call `get_events` tool function.
    - [ ] Return tool result as JSON, handle errors.
- [ ] **Test `get_events` Tool Execution**
    - [ ] Restart server (with test token).
    - [ ] POST to `/execute/get_events`.
    - [ ] Verify response (event data or error).

---

### Phase 4: Refinements and Error Handling

- [ ] **Install `axios` (or other HTTP client)**
    - [ ] `npm install axios` (if chosen).
- [ ] **Secure Token Handling**
    - [ ] Prevent accidental token logging/exposure.
- [ ] **Comprehensive Error Handling**
    - [ ] Missing/invalid token.
    - [ ] API request failures.
    - [ ] Invalid tool names.
- [ ] **Refine Tool Definitions in `src/tools.js`**
    - [ ] Ensure clarity for future parameters.
- [ ] **Update Documentation/README (if applicable)**
    - [ ] Document token provision and `/tools` usage. 