## MCP Server: `/tools` Capability Implementation Plan

This plan outlines the steps to add a `/tools` capability to the existing MCP server, allowing it to expose and execute tools, starting with a `get_events` tool that interacts with the Breathecode API.

---

### Phase 1: Configuration for API Token

1.  **Update `bin/index.js` for Token Configuration**
    *   Modify `yargs` setup to accept a `--access-token` (or `-t`) CLI argument.
    *   Establish precedence: CLI argument > Environment variable (`BREATHECODE_ACCESS_TOKEN`) > Default (or error if not provided and required).
    *   Store the resolved token securely, accessible by the server logic (e.g., by passing it to the server module or using a config object).
2.  **Update Agent Registration for Token Info (Conceptual)**
    *   Consider how the agent registration in `~/.mcp/mcpServers.json` might reflect that it requires/uses an access token. For now, no direct changes to the file structure, but keep in mind for future capabilities or agent descriptions.
    *   **Note:** The example provided (`"4geeks": { "command": "npx", ... }`) seems to be for client-side configuration of how to *launch* an MCP agent, not for the agent to store its own token. We will focus on the agent being *provided* a token at startup.
3.  **Test Token Configuration**
    *   Test passing the token via CLI argument.
    *   Test passing the token via environment variable.
    *   Test precedence.

---

### Phase 2: Define and Expose `/tools` Endpoint

1.  **Update `src/manifest.js`**
    *   Add a `tools` capability to the manifest, pointing to a `/tools` endpoint (e.g., `"get": "/tools"`).
2.  **Modify `src/server.js` to Handle `/tools` Route**
    *   Add a new route handler for `GET /tools`.
    *   This endpoint should return a JSON array describing the available tools. Initially, it will describe the `get_events` tool.
3.  **Define `get_events` Tool Structure**
    *   Create a new file (e.g., `src/tools.js`) to define the structure and metadata for available tools.
    *   The `get_events` tool definition should include:
        *   `name`: "get_events"
        *   `description`: "Lists workshops from the Breathecode API that the student has access to."
        *   `parameters`: (Define if any are needed for the tool, e.g., filters. For now, assume none for `GET /v1/events/me`.)
        *   `path`: (The internal path or identifier for executing this tool, e.g., `/execute/get_events` - this will be handled in Phase 3)
4.  **Test `/tools` Endpoint**
    *   Restart the server.
    *   Request `http://localhost:PORT/.well-known/mcp-manifest.json` to confirm the `tools` capability is listed.
    *   Request `http://localhost:PORT/tools` and confirm it returns the JSON description of the `get_events` tool.

---

### Phase 3: Implement Tool Execution Logic

1.  **Create `/execute/:tool_name` Endpoint in `src/server.js`**
    *   Add a dynamic route like `/execute/:tool_name` (e.g., `/execute/get_events`) that accepts POST requests.
    *   This endpoint will be responsible for running the specified tool.
2.  **Implement `get_events` Tool Logic in `src/tools.js` (or a new file)**
    *   Create a function that:
        *   Takes the access token as an argument.
        *   Makes a `GET` request to the Breathecode API: `https://api.breatheco.de/v1/events/me` (or the correct production URL).
        *   Includes the `Authorization: Bearer <access_token>` header.
        *   Parses the JSON response from the API.
        *   Returns the relevant data or an error.
    *   Use a library like `axios` or Node's built-in `https` module for the API request.
3.  **Connect `/execute/get_events` to the Tool Logic**
    *   In the `/execute/get_events` route handler in `src/server.js`:
        *   Ensure the access token is available (from Phase 1).
        *   Call the `get_events` tool function.
        *   Return the result from the tool function as a JSON response.
        *   Handle potential errors from the tool execution (e.g., API errors, missing token).
4.  **Test `get_events` Tool Execution**
    *   Restart the server (passing a test token).
    *   Make a POST request to `http://localhost:PORT/execute/get_events`.
    *   Verify that the response contains the expected event data (or an appropriate error if the token is invalid/API fails).

---

### Phase 4: Refinements and Error Handling

1.  **Install `axios` (or other HTTP client)**
    *   Run `npm install axios` if chosen for API calls.
2.  **Secure Token Handling**
    *   Ensure the token is not accidentally logged or exposed in error messages.
3.  **Comprehensive Error Handling**
    *   Implement robust error handling for:
        *   Missing/invalid token during tool execution.
        *   API request failures (network errors, non-2xx responses from Breathecode API).
        *   Invalid tool names requested via `/execute/:tool_name`.
4.  **Refine Tool Definitions in `src/tools.js`**
    *   Ensure parameter definitions are clear if tools require them in the future.
5.  **Update Documentation/README (if applicable)**
    *   Document how to provide the access token and use the new `/tools` capability.

---

This plan provides a structured approach to implementing the `/tools` capability with an initial `get_events` tool. Each phase includes testing to ensure functionality before moving to the next. 