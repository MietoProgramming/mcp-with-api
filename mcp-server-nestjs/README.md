# MCP API Server - NestJS Implementation

A Model Context Protocol (MCP) server implementation using NestJS framework to interact with the e-commerce API.

## Overview

This is a NestJS-based MCP server that provides the same functionality as the plain TypeScript MCP server but leverages NestJS's dependency injection, modular architecture, and built-in HTTP client.

## Features

- **NestJS Architecture**: Built with NestJS for better code organization and maintainability
- **Dependency Injection**: Uses NestJS's powerful DI system
- **HTTP Module**: Leverages @nestjs/axios for HTTP requests with RxJS support
- **Modular Design**: Organized into modules, services, and constants
- **All MCP Tools**: Supports all 20 tools for products, orders, consumers, and analytics

## Architecture

```
mcp-server-nestjs/
├── src/
│   ├── mcp/
│   │   ├── mcp.constants.ts   # Tool definitions
│   │   ├── mcp.service.ts     # Tool handler logic
│   │   └── mcp.module.ts      # NestJS module
│   ├── app.module.ts          # Root module
│   └── main.ts                # Bootstrap & MCP server setup
├── package.json
├── tsconfig.json
└── nest-cli.json
```

## Prerequisites

- Node.js 18+
- yarn package manager
- Running API server on http://localhost:3000

## Installation

```bash
# Navigate to the directory
cd mcp-server-nestjs

# Install dependencies
yarn install
```

## Building

```bash
# Build the project
yarn build
```

## Running

```bash
# Run the built server
yarn start

# Or build and run
yarn dev
```

## Configuration

Set the API base URL via environment variable:

```bash
API_BASE_URL=http://localhost:3000/api yarn start
```

## Available Tools

### Products (3 tools)

- `list-products` - Get all products
- `get-product` - Get product by ID
- `filter-products-by-category` - Filter products by category

### Orders (5 tools)

- `list-orders` - Get all orders
- `get-order` - Get order by ID
- `filter-orders-by-consumer` - Filter orders by consumer
- `filter-orders-by-status` - Filter orders by status
- `get-order-statistics` - Get order statistics

### Consumers (4 tools)

- `list-consumers` - Get all consumers
- `get-consumer` - Get consumer by ID
- `get-top-consumers` - Get top spending consumers
- `get-consumer-statistics` - Get consumer statistics

### Analytics (5 tools)

- `analyze-consumer-behavior` - Analyze consumer behavior and reorder probability
- `get-all-predictions` - Get all reorder predictions
- `get-prediction-summary` - Get prediction summary
- `get-churn-risk-consumers` - Get consumers at risk of churning
- `get-high-value-reorder-candidates` - Get high-value consumers likely to reorder

## VS Code Configuration

The server is configured in `.vscode/mcp.json`:

```json
{
  "servers": {
    "mcp-api-server-nestjs": {
      "command": "node",
      "args": ["mcp-server-nestjs/dist/main.js"],
      "env": {
        "API_BASE_URL": "http://localhost:3000/api"
      }
    }
  }
}
```

## Development

### File Structure

- **mcp.constants.ts**: Defines all MCP tool schemas
- **mcp.service.ts**: Contains business logic for handling tool calls
- **mcp.module.ts**: NestJS module that provides the service
- **app.module.ts**: Root module that imports all feature modules
- **main.ts**: Application entry point that initializes NestJS and MCP server

### Adding New Tools

1. Add tool definition to `mcp.constants.ts`
2. Add handler case in `mcp.service.ts`
3. Rebuild the project

## Differences from Plain TypeScript Version

### Advantages

- **Better Structure**: Modular architecture with clear separation of concerns
- **Dependency Injection**: Easy to test and maintain
- **Built-in HTTP Module**: Better error handling and RxJS integration
- **Scalability**: Easy to add new features and modules
- **Type Safety**: Strong typing throughout the application

### Trade-offs

- **Bundle Size**: Slightly larger due to NestJS framework
- **Complexity**: More files and concepts for simple use cases
- **Build Time**: Slightly longer build time

## Troubleshooting

### Connection Issues

- Ensure the API server is running on http://localhost:3000
- Check that the MCP server is built (`yarn build`)
- Verify the path in `.vscode/mcp.json` is correct

### Build Errors

- Run `yarn install` to ensure all dependencies are installed
- Check Node.js version (18+)
- Clear `dist/` folder and rebuild

### Runtime Errors

- Check API server logs for errors
- Verify environment variables are set correctly
- Ensure all required NestJS modules are imported

## License

MIT
