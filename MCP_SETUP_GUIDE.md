# MCP Server Setup Guide

## ✅ Step 2 Complete: MCP Server Created!

You now have a fully functional MCP server with **12 tools** to interact with your API.

## Quick Setup

### 1. Ensure API is Running

```bash
# In the main project directory
npm run start:dev
```

Wait for:

```
Generated 500 products
Generated 100 consumers
Generated 10000 orders
Application is running on: http://localhost:3000/api
```

### 2. Build the MCP Server

```bash
cd mcp-server
npm install
npm run build
```

### 3. Configure Claude Desktop

**Windows**:
Open `%APPDATA%\Claude\claude_desktop_config.json`

**macOS**:
Open `~/Library/Application Support/Claude/claude_desktop_config.json`

Add this configuration (update the path to match your location):

```json
{
  "mcpServers": {
    "mcp-api-server": {
      "command": "node",
      "args": [
        "D:\\ProgrammingProjects\\mcp-with-api\\mcp-server\\dist\\index.js"
      ]
    }
  }
}
```

### 4. Restart Claude Desktop

Close and reopen Claude Desktop completely.

### 5. Test the Connection

In Claude Desktop, ask:

> "What MCP tools do you have available?"

You should see 12 tools listed!

## Available Tools

### 📦 Products (3 tools)

- **list-products** - Get all 500 products
- **get-product** - Get specific product by ID
- **filter-products-by-category** - Filter by category

### 📋 Orders (5 tools)

- **list-orders** - Get all 10,000 orders
- **get-order** - Get specific order by ID
- **filter-orders-by-consumer** - Get consumer's order history
- **filter-orders-by-status** - Filter by status
- **get-order-statistics** - Get comprehensive statistics

### 👥 Consumers (4 tools)

- **list-consumers** - Get all 100 consumers
- **get-consumer** - Get specific consumer by ID
- **get-top-consumers** - Get top spending customers
- **get-consumer-statistics** - Get detailed consumer analytics

## Example Queries in Claude

Once configured, try these natural language requests:

```
"Show me all Electronics products"

"What are the current order statistics?"

"Who are the top 10 spending customers?"

"Show me all orders for consumer ID 5"

"Get detailed analytics for consumer 5"

"Show me all delivered orders"

"Find products in the Sports category"

"How many pending orders are there?"
```

Claude will automatically use the appropriate MCP tools to answer!

## Verification Checklist

- [ ] API is running on port 3000
- [ ] MCP server is built (`mcp-server/dist/index.js` exists)
- [ ] Claude Desktop config file updated with correct path
- [ ] Claude Desktop restarted
- [ ] Tools appear in Claude's tool list
- [ ] Test query works

## Troubleshooting

### Tools not showing up

1. Check config file path is correct (use absolute path)
2. Verify `dist/index.js` exists
3. Restart Claude Desktop completely
4. Check Claude logs for errors

### Connection errors

1. Make sure API is running: http://localhost:3000/api/products
2. Check no firewall blocking localhost:3000
3. Verify the `API_BASE_URL` if you changed it

### Build errors

1. Make sure you're in `mcp-server/` directory
2. Run `npm install` first
3. Check for TypeScript errors

## What's Next?

### Step 3: Create Analysis Tool 🔄

Now that you have the MCP server working, you can create an advanced analysis tool to:

- Predict consumer repeat purchase probability
- Analyze buying patterns
- Identify product preferences
- Calculate customer lifetime value
- Detect churn risk

This can be:

1. **Another MCP tool** added to this server
2. **A separate MCP server** specialized for analytics
3. **Integrated into Claude** using the existing tools

Would you like to proceed with creating the consumer analysis tool?

## Architecture

```
┌──────────────────┐
│  Claude Desktop  │
│                  │
│  Natural Language│
│      Queries     │
└────────┬─────────┘
         │ MCP Protocol
         │
┌────────▼─────────┐
│  MCP Server      │
│                  │
│  12 Tools:       │
│  - Products (3)  │
│  - Orders (5)    │
│  - Consumers (4) │
└────────┬─────────┘
         │ HTTP/REST
         │
┌────────▼─────────┐
│  NestJS API      │
│                  │
│  Data:           │
│  - 500 Products  │
│  - 10K Orders    │
│  - 100 Consumers │
└──────────────────┘
```

## Success! 🎉

You now have:

- ✅ **Step 1**: REST API with 10,000 orders
- ✅ **Step 2**: MCP Server with 12 tools
- 🔄 **Step 3**: Ready to build analysis tools!
