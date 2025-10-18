# MCP with API - Learning Project

A simple REST API built with NestJS featuring three modules: Products, Orders, and Consumers. This project uses **Faker.js** to generate large datasets of realistic mocked data (no database required) and is designed for learning how to create MCP (Model Context Protocol) servers that interact with APIs.

## Project Overview

This API generates and provides endpoints for managing:

- **Products**: 500 products across 10 categories with varied prices and stock levels
- **Orders**: 10,000 orders linking consumers and products with realistic dates and statuses
- **Consumers**: 100 consumers with realistic names, addresses, and dynamically calculated purchase history

### Data Generation

All data is generated at application startup using [@faker-js/faker](https://fakerjs.dev/):

- **500 Products** - Electronics, Furniture, Clothing, Books, Sports, Home & Garden, Toys, Food & Beverage, Beauty, and Automotive
- **100 Consumers** - With realistic names, emails, phone numbers, and addresses
- **10,000 Orders** - Distributed across all consumers and products with:
  - 70% delivered
  - 10% shipped
  - 8% processing
  - 7% pending
  - 5% cancelled

Consumer statistics (totalOrders, totalSpent, lastOrderDate) are automatically calculated from the generated orders.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- yarn (recommended) or npm

### Installation

```bash
yarn install
```

### Running the API

```bash
# development mode with hot reload
yarn start:dev

# production mode
yarn start:prod
```

The API will be available at: `http://localhost:3000/api`

**Note**: On startup, the application will generate all mock data (500 products, 100 consumers, and 10,000 orders). This takes a few seconds. You'll see console output:

```
Generated 500 products
Generated 100 consumers
Generated 10000 orders
```

## API Endpoints

### Products (`/api/products`)

- `GET /api/products` - Get all products
- `GET /api/products?category=Electronics` - Filter by category
- `GET /api/products/:id` - Get a specific product
- `POST /api/products` - Create a new product
- `PUT /api/products/:id` - Update a product
- `DELETE /api/products/:id` - Delete a product

**Sample Product:**

```json
{
  "id": 1,
  "name": "Laptop Pro 15",
  "description": "High-performance laptop with 16GB RAM and 512GB SSD",
  "price": 1299.99,
  "category": "Electronics",
  "stock": 45,
  "createdAt": "2024-01-15T00:00:00.000Z"
}
```

### Orders (`/api/orders`)

- `GET /api/orders` - Get all orders
- `GET /api/orders?consumerId=1` - Filter by consumer
- `GET /api/orders?productId=1` - Filter by product
- `GET /api/orders?status=delivered` - Filter by status
- `GET /api/orders/statistics` - Get order statistics
- `GET /api/orders/:id` - Get a specific order
- `POST /api/orders` - Create a new order
- `PUT /api/orders/:id` - Update an order
- `DELETE /api/orders/:id` - Delete an order

**Sample Order:**

```json
{
  "id": 1,
  "consumerId": 1,
  "productId": 1,
  "quantity": 1,
  "totalPrice": 1299.99,
  "status": "delivered",
  "orderDate": "2024-03-01T00:00:00.000Z",
  "deliveryDate": "2024-03-05T00:00:00.000Z"
}
```

### Consumers (`/api/consumers`)

- `GET /api/consumers` - Get all consumers
- `GET /api/consumers?email=john@example.com` - Find by email
- `GET /api/consumers/top?limit=5` - Get top consumers by spending
- `GET /api/consumers/:id` - Get a specific consumer
- `GET /api/consumers/:id/statistics` - Get consumer statistics
- `POST /api/consumers` - Create a new consumer
- `PUT /api/consumers/:id` - Update a consumer
- `DELETE /api/consumers/:id` - Delete a consumer

**Sample Consumer:**

```json
{
  "id": 1,
  "name": "John Smith",
  "email": "john.smith@example.com",
  "phone": "+1-555-0101",
  "address": "123 Main St, New York, NY 10001",
  "registeredAt": "2024-01-15T00:00:00.000Z",
  "totalOrders": 3,
  "totalSpent": 1409.96,
  "lastOrderDate": "2024-04-10T00:00:00.000Z"
}
```

## Testing the API

You can test the API using curl, Postman, or any HTTP client:

```bash
# Get all products
curl http://localhost:3000/api/products

# Get all orders for a specific consumer
curl http://localhost:3000/api/orders?consumerId=1

# Get consumer statistics
curl http://localhost:3000/api/consumers/1/statistics

# Get order statistics
curl http://localhost:3000/api/orders/statistics
```

## Project Structure

```
src/
├── products/
│   ├── products.controller.ts
│   ├── products.service.ts
│   └── products.module.ts
├── orders/
│   ├── orders.controller.ts
│   ├── orders.service.ts
│   └── orders.module.ts
├── consumers/
│   ├── consumers.controller.ts
│   ├── consumers.service.ts
│   └── consumers.module.ts
├── app.module.ts
└── main.ts
```

## Next Steps

This API is ready for MCP integration. The planned next steps are:

1. ✅ **Create simple API with generated data** (Complete)
2. 🔄 **Create MCP server** - Build an MCP server with tools to access this API data
3. 🔄 **Create analysis tool** - Build an MCP tool to analyze consumer behavior and predict repeat purchase probability

## Features

- ✅ Full CRUD operations for all entities
- ✅ Query filtering (by category, status, consumer, product)
- ✅ Statistics endpoints
- ✅ CORS enabled for MCP server access
- ✅ Global validation
- ✅ **Large realistic dataset**: 500 products, 100 consumers, 10,000 orders
- ✅ **Faker.js integration** for realistic mock data generation
- ✅ Dynamic consumer statistics calculation
- ✅ Mocked data (no database required)
- ✅ TypeScript with NestJS

## Performance Notes

The API generates all data in memory at startup:

- **Memory usage**: ~50-100MB for all generated data
- **Startup time**: ~2-5 seconds to generate all data
- **API response time**: Fast (data served from memory)

This makes it perfect for:

- Learning and development
- MCP server integration testing
- API design prototyping
- Running workshops or tutorials

## Development

```bash
# Run in watch mode
yarn start:dev

# Run tests
yarn test

# Lint code
yarn lint

# Format code
yarn format
```

## License

MIT
