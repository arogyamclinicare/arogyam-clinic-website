#!/bin/bash

# Advanced MCP Tools Setup Script
# This script helps you set up additional MCP tools for maximum productivity

echo "🚀 Setting up Advanced MCP Tools for Cursor Pro..."

# 1. GitHub MCP (for repository management)
echo "📦 Installing GitHub MCP..."
# Add to your MCP configuration:
cat << 'EOF' >> ~/.cursor/mcp-config.json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "your_github_token_here"
      }
    }
  }
}
EOF

# 2. Filesystem MCP (enhanced file operations)
echo "📁 Setting up Filesystem MCP..."
cat << 'EOF' >> ~/.cursor/mcp-config.json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-filesystem", "/path/to/your/project"]
    }
  }
}
EOF

# 3. Terminal MCP (command execution)
echo "💻 Setting up Terminal MCP..."
cat << 'EOF' >> ~/.cursor/mcp-config.json
{
  "mcpServers": {
    "terminal": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-terminal"]
    }
  }
}
EOF

# 4. Web Search MCP (research capabilities)
echo "🔍 Setting up Web Search MCP..."
cat << 'EOF' >> ~/.cursor/mcp-config.json
{
  "mcpServers": {
    "web-search": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-web-search"],
      "env": {
        "SEARCH_API_KEY": "your_search_api_key_here"
      }
    }
  }
}
EOF

# 5. Memory MCP (persistent context)
echo "🧠 Setting up Memory MCP..."
cat << 'EOF' >> ~/.cursor/mcp-config.json
{
  "mcpServers": {
    "memory": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-memory"]
    }
  }
}
EOF

echo "✅ MCP Tools setup complete!"
echo "📝 Next steps:"
echo "1. Update the configuration file with your API keys"
echo "2. Restart Cursor to load the new MCP tools"
echo "3. Test the tools with: @mcp list available tools"








