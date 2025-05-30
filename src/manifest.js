const manifest = {
  name: "4Geeks MCP Agent",
  description: "An MCP agent by 4Geeks, providing assistance for schools, teachers, and learners in their journey of acquiring tech skills. Part of the 4geeks.com community for learning.",
  iconUrl: "https://placehold.co/64x64.png", // TODO: Replace with 4Geeks official icon URL
  mcp_version: "0.1.0",
  capabilities: {
    chat: {
      post: "/chat"
    },
    // Add other capabilities here as they are implemented
    // e.g., complete, tools
  },
  author: "4Geeks",
  homepage: "https://4geeks.com",
  email: "support@4geeks.com" // TODO: Confirm or replace with a more specific email
};

module.exports = manifest; 