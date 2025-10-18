# MCP Server for API

This is a Model Context Protocol (MCP) server that provides tools to interact with the NestJS REST API.

## Overview

The MCP server exposes **17 tools** to query and interact with the API data:

### Products Tools (3)

- `list-products` - Get all 500 products
- `get-product` - Get a specific product by ID
- `filter-products-by-category` - Filter products by category

### Orders Tools (5)

- `list-orders` - Get all 10,000 orders
- `get-order` - Get a specific order by ID
- `filter-orders-by-consumer` - Get all orders for a consumer
- `filter-orders-by-status` - Filter orders by status
- `get-order-statistics` - Get comprehensive order statistics

### Consumers Tools (4)

- `list-consumers` - Get all 100 consumers
- `get-consumer` - Get a specific consumer by ID
- `get-top-consumers` - Get top spending consumers
- `get-consumer-statistics` - Get detailed consumer analytics

### Analytics Tools (5) 🆕

- `analyze-consumer-behavior` - Predict reorder probability for a consumer using RFM analysis
- `get-all-predictions` - Get reorder predictions for all consumers
- `get-prediction-summary` - Get aggregate prediction statistics
- `get-churn-risk-consumers` - Identify consumers at risk of not ordering again
- `get-high-value-reorder-candidates` - Find high-value consumers likely to reorder

## Installation

```bash
cd mcp-server
npm install
```

## Building

```bash
npm run build
```

This compiles TypeScript to JavaScript in the `dist/` folder.

## Configuration

### Quick Config Generator

The easiest way to get the correct configuration is to use the config generator:

```bash
npm run config
```

This will:

1. Display the correct configuration for your system
2. Show where to put the Claude Desktop config file
3. Save a `generated-config.json` file for reference

### Manual Configuration

The MCP server connects to the API at:

```
http://localhost:3000/api
```

You can change this by setting the `API_BASE_URL` environment variable:

```bash
API_BASE_URL=http://your-api-url:port/api npm start
```

For detailed configuration instructions, see [MCP_CONFIGURATION.md](./MCP_CONFIGURATION.md)

## Running

### Prerequisites

Make sure the NestJS API is running first:

```bash
# In the main project directory
npm run start:dev
```

### Start the MCP Server

```bash
cd mcp-server
npm start
```

The server runs on stdio (standard input/output) and waits for MCP protocol messages.

## Using with Claude Desktop

### 1. Build the MCP Server

```bash
cd mcp-server
npm run build
```

### 2. Configure Claude Desktop

Add to your Claude Desktop config file:

**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`

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

**Note**: Update the path to match your actual project location.

### 3. Restart Claude Desktop

Close and reopen Claude Desktop to load the MCP server.

### 4. Verify Tools are Available

In Claude Desktop, you should see the 12 tools available. Try asking:

> "What tools do you have available?"

## Example Tool Usage

### In Claude Desktop

Once configured, you can ask Claude to use these tools:

```
"Show me all products in the Electronics category"
→ Uses: filter-products-by-category

"Get order statistics"
→ Uses: get-order-statistics

"Who are the top 10 spending customers?"
→ Uses: get-top-consumers

"Show me all orders for consumer ID 5"
→ Uses: filter-orders-by-consumer

"Get detailed statistics for consumer 5"
→ Uses: get-consumer-statistics

"Show me all delivered orders"
→ Uses: filter-orders-by-status
```

## Tool Reference

### Products

#### list-products

```typescript
// No parameters required
Returns: Array of all 500 products
```

#### get-product

```typescript
{
  productId: number  // Required
}
Returns: Single product object
```

#### filter-products-by-category

```typescript
{
  category: string  // Required
  // Options: Electronics, Furniture, Clothing, Books, Sports,
  //          Home & Garden, Toys, Food & Beverage, Beauty, Automotive
}
Returns: Array of products in the category
```

### Orders

#### list-orders

```typescript
// No parameters required
Returns: Array of all 10,000 orders
```

#### get-order

```typescript
{
  orderId: number  // Required
}
Returns: Single order object
```

#### filter-orders-by-consumer

```typescript
{
  consumerId: number  // Required
}
Returns: Array of orders for the consumer
```

#### filter-orders-by-status

```typescript
{
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"  // Required
}
Returns: Array of orders with the specified status
```

#### get-order-statistics

```typescript
// No parameters required
Returns: {
  totalOrders: number,
  ordersByStatus: { [status: string]: number },
  totalRevenue: string
}
```

### Consumers

#### list-consumers

```typescript
// No parameters required
Returns: Array of all 100 consumers
```

#### get-consumer

```typescript
{
  consumerId: number  // Required
}
Returns: Single consumer object
```

#### get-top-consumers

```typescript
{
  limit?: number  // Optional, default: 5
}
Returns: Array of top spending consumers
```

#### get-consumer-statistics

```typescript
{
  consumerId: number  // Required
}
Returns: {
  ...consumerData,
  avgOrderValue: string,
  daysSinceRegistration: number,
  daysSinceLastOrder: number | null
}
```

## Development

### Watch Mode

For development, you can run TypeScript in watch mode:

```bash
npm run watch
```

This will recompile automatically when you change the code.

### Testing Tools

You can test the MCP server by running it and sending MCP protocol messages via stdin. However, it's easier to test through Claude Desktop or an MCP client.

## Error Handling

The MCP server includes error handling for:

- **Network errors** - If the API is not running
- **404 errors** - When requesting non-existent IDs
- **Invalid parameters** - Missing required fields
- **API errors** - Any other HTTP errors from the API

Errors are returned as text content with descriptive messages.

## Architecture

```
┌─────────────────┐         ┌──────────────┐         ┌──────────────┐
│  Claude Desktop │ ◄─MCP──►│  MCP Server  │ ◄─HTTP──►│  NestJS API  │
│                 │         │              │         │              │
│  (AI Client)    │         │  12 Tools    │         │  10K Orders  │
│                 │         │  via axios   │         │  500 Products│
│                 │         │              │         │  100 Consumers│
└─────────────────┘         └──────────────┘         └──────────────┘
```

## Files

- `index.ts` - Main MCP server implementation
- `tsconfig.json` - TypeScript configuration
- `package.json` - Dependencies and scripts
- `dist/` - Compiled JavaScript (created after build)

## Dependencies

- `@modelcontextprotocol/sdk` - MCP SDK for building servers
- `axios` - HTTP client for API requests
- `typescript` - TypeScript compiler
- `@types/node` - Node.js type definitions

## Next Steps

With the MCP server running, you can now:

1. ✅ Query the API through natural language in Claude
2. ✅ Analyze consumer behavior patterns
3. 🔄 **Create analysis tools** (Step 3 of your plan)

## Troubleshooting

### "Connection refused" or "ECONNREFUSED"

- Make sure the NestJS API is running on port 3000
- Check that you can access http://localhost:3000/api/products in your browser

### "MCP server not found" in Claude Desktop

- Verify the path in `claude_desktop_config.json` is correct
- Make sure you ran `npm run build` in the mcp-server directory
- Restart Claude Desktop after config changes

### Tools not appearing

- Check Claude Desktop logs (usually in the same folder as config)
- Verify the MCP server builds without errors
- Try rebuilding: `npm run build`

## License

MIT
