# MCP Server Quick Start Guide

## ✅ All Configuration Files Ready!

Your MCP server now has all the necessary configuration files:

- `mcp-config.json` - Local configuration reference
- `generated-config.json` - Auto-generated config (created when you run `npm run config`)
- `MCP_CONFIGURATION.md` - Complete configuration documentation
- `generate-config.cjs` - Script to generate correct paths

## 🚀 Quick Setup (3 Steps)

### Step 1: Build the MCP Server

```bash
cd mcp-server
npm install
npm run build
```

### Step 2: Generate Your Configuration

```bash
npm run config
```

This will display:

- ✅ The exact configuration to copy
- ✅ Where to put the Claude Desktop config file
- ✅ Step-by-step instructions

Example output:

```json
{
  "mcpServers": {
    "mcp-api-server": {
      "command": "node",
      "args": [
        "D:\\ProgrammingProjects\\mcp-with-api\\mcp-server\\dist\\index.js"
      ],
      "env": {
        "API_BASE_URL": "http://localhost:3000/api"
      }
    }
  }
}
```

### Step 3: Configure Claude Desktop

**Windows**:

1. Open: `C:\Users\YourUsername\AppData\Roaming\Claude\claude_desktop_config.json`
2. Paste the configuration from Step 2
3. Save the file
4. Restart Claude Desktop

**macOS**:

1. Open: `~/Library/Application Support/Claude/claude_desktop_config.json`
2. Paste the configuration from Step 2
3. Save the file
4. Restart Claude Desktop

## ✅ Verification

In Claude Desktop, ask:

```
"What MCP tools do you have available?"
```

You should see **12 tools** listed:

- 3 Products tools
- 5 Orders tools
- 4 Consumers tools

## 📋 Available Tools

| Category      | Tools                                                                                            |
| ------------- | ------------------------------------------------------------------------------------------------ |
| **Products**  | list-products, get-product, filter-products-by-category                                          |
| **Orders**    | list-orders, get-order, filter-orders-by-consumer, filter-orders-by-status, get-order-statistics |
| **Consumers** | list-consumers, get-consumer, get-top-consumers, get-consumer-statistics                         |

## 💡 Try These Queries in Claude

Once configured:

```
"Show me all Electronics products"
"What are the order statistics?"
"Who are the top 10 customers?"
"Show consumer 5's purchase history"
"Get analytics for consumer 5"
"How many delivered orders are there?"
```

## 🛠️ Troubleshooting

### Config Generator Shows Wrong Path?

The generator uses your current project location. If you move the project, run `npm run config` again to get the updated path.

### Tools Not Showing in Claude?

1. Make sure you ran `npm run build`
2. Check that `dist/index.js` exists
3. Verify the path in Claude config matches the output of `npm run config`
4. Completely restart Claude Desktop (quit, don't just close)

### API Connection Errors?

1. Make sure the NestJS API is running:
   ```bash
   # In the main project directory
   npm run start:dev
   ```
2. Check the API is accessible: http://localhost:3000/api/products
3. If using a different port, update the `API_BASE_URL` in the config

## 📚 More Information

- **MCP_CONFIGURATION.md** - Detailed configuration guide
- **README.md** - Complete MCP server documentation
- **generated-config.json** - Your auto-generated config (after running `npm run config`)

## 🎯 What's Working

- ✅ MCP Server with 12 tools
- ✅ Configuration files created
- ✅ Auto-config generator
- ✅ Complete documentation
- ✅ Ready for Claude Desktop

## Next Steps

After successful setup:

1. Try the example queries above
2. Explore the 12 available tools
3. Build custom analysis tools (Step 3 of your plan!)

---

**Need Help?** See `MCP_CONFIGURATION.md` for detailed troubleshooting.
