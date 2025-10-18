# Getting Started Guide

## Prerequisites

- Node.js v18 or higher
- npm or yarn package manager

## Installation

1. **Clone or navigate to the project directory**

   ```bash
   cd d:\ProgrammingProjects\mcp-with-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

## Running the Application

### Development Mode (Recommended)

```bash
npm run start:dev
# or
yarn start:dev
```

This starts the application with hot-reload enabled. Any code changes will automatically restart the server.

### Production Mode

```bash
# Build first
npm run build
# or
yarn build

# Then start
npm run start:prod
# or
yarn start:prod
```

## Startup Process

When you start the application, you'll see:

```
[Nest] 12345  - 10/17/2025, 3:45:30 PM     LOG [NestFactory] Starting Nest application...
[Nest] 12345  - 10/17/2025, 3:45:30 PM     LOG [InstanceLoader] AppModule dependencies initialized
[Nest] 12345  - 10/17/2025, 3:45:30 PM     LOG [InstanceLoader] ProductsModule dependencies initialized
Generated 500 products
[Nest] 12345  - 10/17/2025, 3:45:30 PM     LOG [InstanceLoader] ConsumersModule dependencies initialized
Generated 100 consumers
[Nest] 12345  - 10/17/2025, 3:45:31 PM     LOG [InstanceLoader] OrdersModule dependencies initialized
Generated 10000 orders
[Nest] 12345  - 10/17/2025, 3:45:31 PM     LOG [RoutesResolver] AppController {/}
[Nest] 12345  - 10/17/2025, 3:45:31 PM     LOG [RouterExplorer] Mapped {/, GET} route
[Nest] 12345  - 10/17/2025, 3:45:31 PM     LOG [NestApplication] Nest application successfully started
Application is running on: http://localhost:3000/api
```

**Key Points:**

- Data generation takes 2-5 seconds
- You'll see confirmation messages for each dataset
- The API is ready when you see "Application is running on..."

## Testing the API

### Using curl (Command Line)

**Windows (PowerShell)**

```powershell
# Get all products
curl http://localhost:3000/api/products

# Get specific product
curl http://localhost:3000/api/products/1

# Filter products by category
curl "http://localhost:3000/api/products?category=Electronics"

# Get order statistics
curl http://localhost:3000/api/orders/statistics

# Get top consumers
curl "http://localhost:3000/api/consumers/top?limit=10"
```

**Note for PowerShell**: If curl doesn't work, use `Invoke-WebRequest` or install curl for Windows.

### Using Browser

Simply open these URLs in your browser:

- http://localhost:3000/api/products
- http://localhost:3000/api/orders
- http://localhost:3000/api/consumers
- http://localhost:3000/api/orders/statistics

### Using Postman or Insomnia

1. Import the base URL: `http://localhost:3000/api`
2. Create requests for each endpoint
3. Test GET, POST, PUT, DELETE operations

### Using VS Code REST Client Extension

Create a file called `test.http`:

```http
### Get all products
GET http://localhost:3000/api/products

### Get products by category
GET http://localhost:3000/api/products?category=Electronics

### Get specific product
GET http://localhost:3000/api/products/1

### Get all orders
GET http://localhost:3000/api/orders

### Get orders by consumer
GET http://localhost:3000/api/orders?consumerId=5

### Get order statistics
GET http://localhost:3000/api/orders/statistics

### Get all consumers
GET http://localhost:3000/api/consumers

### Get top consumers
GET http://localhost:3000/api/consumers/top?limit=10

### Get consumer statistics
GET http://localhost:3000/api/consumers/5/statistics

### Create a new product
POST http://localhost:3000/api/products
Content-Type: application/json

{
  "name": "Test Product",
  "description": "A test product",
  "price": 99.99,
  "category": "Electronics",
  "stock": 50
}
```

## Verifying Data Generation

### Check Data Counts

```bash
# Products (should be 500)
curl http://localhost:3000/api/products | jq 'length'

# Consumers (should be 100)
curl http://localhost:3000/api/consumers | jq 'length'

# Orders (should be 10000)
curl http://localhost:3000/api/orders | jq 'length'
```

**Note**: Requires `jq` JSON processor. Install from https://stedolan.github.io/jq/

### Check Order Statistics

```bash
curl http://localhost:3000/api/orders/statistics
```

Expected response:

```json
{
  "totalOrders": 10000,
  "ordersByStatus": {
    "delivered": 7000,
    "shipped": 1000,
    "processing": 800,
    "pending": 700,
    "cancelled": 500
  },
  "totalRevenue": "8534250.75"
}
```

### Verify Consumer Data Quality

```bash
# Get top 5 consumers
curl http://localhost:3000/api/consumers/top?limit=5

# Get detailed stats for consumer #1
curl http://localhost:3000/api/consumers/1/statistics
```

## Common Issues & Solutions

### Port Already in Use

**Error**: `Error: listen EADDRINUSE: address already in use :::3000`

**Solution**:

- Kill the process using port 3000
- Or change the port in `src/main.ts` or use environment variable:
  ```bash
  PORT=3001 npm run start:dev
  ```

### Slow Startup

**Issue**: Taking longer than 5 seconds to generate data

**Explanation**: Normal on first run or slower machines. Subsequent runs should be faster.

### Data Doesn't Appear

**Issue**: API returns empty arrays

**Solution**:

- Check console logs for "Generated X products/consumers/orders"
- Restart the application
- Check for TypeScript errors in the console

### CORS Errors

**Issue**: Browser shows CORS policy errors

**Solution**: CORS is enabled by default. If issues persist:

- Check `src/main.ts` for CORS configuration
- Make sure you're accessing from `http://localhost:3000/api`

## Development Commands

```bash
# Start in development mode (hot reload)
npm run start:dev

# Build the application
npm run build

# Start in production mode
npm run start:prod

# Run linter
npm run lint

# Format code
npm run format

# Run tests
npm run test

# Run e2e tests
npm run test:e2e
```

## Project Structure

```
mcp-with-api/
├── src/
│   ├── products/          # Products module
│   ├── orders/            # Orders module
│   ├── consumers/         # Consumers module
│   ├── app.module.ts      # Main application module
│   └── main.ts            # Application entry point
├── dist/                  # Compiled output (after build)
├── node_modules/          # Dependencies
├── API_DOCUMENTATION.md   # Complete API documentation
├── API_QUICK_REFERENCE.md # Quick endpoint reference
├── DATA_GENERATION.md     # Data generation details
├── PROJECT_SUMMARY.md     # Project completion summary
└── package.json           # Project configuration
```

## Next Steps

1. **Explore the API** - Try all endpoints with different parameters
2. **Check the data** - Verify the generated data makes sense
3. **Modify generation** - Adjust counts in service files if needed
4. **Build MCP Server** - Create tools to interact with this API
5. **Add Analysis** - Create prediction/analysis tools

## Need Help?

- Check `API_DOCUMENTATION.md` for detailed endpoint info
- Check `API_QUICK_REFERENCE.md` for quick examples
- Check `DATA_GENERATION.md` for data structure details
- Check console logs for error messages

## Success Checklist

- [ ] Application starts without errors
- [ ] See "Generated X products/consumers/orders" messages
- [ ] Can access http://localhost:3000/api/products
- [ ] Returns 500 products
- [ ] Can access http://localhost:3000/api/consumers
- [ ] Returns 100 consumers
- [ ] Can access http://localhost:3000/api/orders
- [ ] Returns 10000 orders
- [ ] Statistics endpoint works
- [ ] Consumer stats are calculated correctly

Once all checked, you're ready to start building your MCP server! 🎉
