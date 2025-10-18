# API Quick Reference

Base URL: `http://localhost:3000`

## 🤖 AI Analysis Endpoints (NEW!)

| Method | Endpoint                | Description                   | Example                     |
| ------ | ----------------------- | ----------------------------- | --------------------------- |
| POST   | `/ai-analysis/generate` | Generate analysis notebook    | See body below              |
| GET    | `/ai-analysis/files`    | List generated files          | `GET /ai-analysis/files`    |
| GET    | `/ai-analysis/examples` | Get example analysis requests | `GET /ai-analysis/examples` |

### Generate Analysis Request Body

```json
{
  "analysisType": "consumers",
  "description": "Analyze consumer spending patterns and create visualizations including bar charts of top spenders, geographic distribution heatmap, and statistical summary of spending trends"
}
```

**Analysis Types**: `consumers`, `orders`, `products`, `analytics`, `custom`

## Products Endpoints

| Method | Endpoint                   | Description        | Example                              |
| ------ | -------------------------- | ------------------ | ------------------------------------ |
| GET    | `/products`                | Get all products   | `GET /products`                      |
| GET    | `/products?category={cat}` | Filter by category | `GET /products?category=Electronics` |
| GET    | `/products/:id`            | Get single product | `GET /products/42`                   |
| POST   | `/products`                | Create new product | See body below                       |
| PUT    | `/products/:id`            | Update product     | See body below                       |
| DELETE | `/products/:id`            | Delete product     | `DELETE /products/42`                |

### Product Categories

- Electronics
- Furniture
- Clothing
- Books
- Sports
- Home & Garden
- Toys
- Food & Beverage
- Beauty
- Automotive

## Orders Endpoints

| Method | Endpoint                  | Description          | Example                            |
| ------ | ------------------------- | -------------------- | ---------------------------------- |
| GET    | `/orders`                 | Get all orders       | `GET /api/orders`                  |
| GET    | `/orders?consumerId={id}` | Filter by consumer   | `GET /api/orders?consumerId=5`     |
| GET    | `/orders?productId={id}`  | Filter by product    | `GET /api/orders?productId=123`    |
| GET    | `/orders?status={status}` | Filter by status     | `GET /api/orders?status=delivered` |
| GET    | `/orders/statistics`      | Get order statistics | `GET /api/orders/statistics`       |
| GET    | `/orders/:id`             | Get single order     | `GET /api/orders/42`               |
| POST   | `/orders`                 | Create new order     | See body below                     |
| PUT    | `/orders/:id`             | Update order         | See body below                     |
| DELETE | `/orders/:id`             | Delete order         | `DELETE /api/orders/42`            |

### Order Statuses

- pending
- processing
- shipped
- delivered
- cancelled

## Consumers Endpoints

| Method | Endpoint                    | Description         | Example                                     |
| ------ | --------------------------- | ------------------- | ------------------------------------------- |
| GET    | `/consumers`                | Get all consumers   | `GET /api/consumers`                        |
| GET    | `/consumers?email={email}`  | Find by email       | `GET /api/consumers?email=john@example.com` |
| GET    | `/consumers/top?limit={n}`  | Get top consumers   | `GET /api/consumers/top?limit=10`           |
| GET    | `/consumers/:id`            | Get single consumer | `GET /api/consumers/42`                     |
| GET    | `/consumers/:id/statistics` | Get consumer stats  | `GET /api/consumers/42/statistics`          |
| POST   | `/consumers`                | Create new consumer | See body below                              |
| PUT    | `/consumers/:id`            | Update consumer     | See body below                              |
| DELETE | `/consumers/:id`            | Delete consumer     | `DELETE /api/consumers/42`                  |

## Sample Request Bodies

### Create Product

```json
{
  "name": "Gaming Laptop",
  "description": "High-performance gaming laptop",
  "price": 1599.99,
  "category": "Electronics",
  "stock": 25
}
```

### Create Order

```json
{
  "consumerId": 5,
  "productId": 123,
  "quantity": 2,
  "totalPrice": 199.98,
  "status": "pending"
}
```

### Create Consumer

```json
{
  "name": "Jane Doe",
  "email": "jane.doe@example.com",
  "phone": "+1-555-0199",
  "address": "789 Oak St, Seattle, WA 98101",
  "totalOrders": 0,
  "totalSpent": 0
}
```

## Useful Query Examples

### Get all electronics

```bash
curl http://localhost:3000/api/products?category=Electronics
```

### Get consumer's order history

```bash
curl http://localhost:3000/api/orders?consumerId=5
```

### Get all delivered orders

```bash
curl http://localhost:3000/api/orders?status=delivered
```

### Get top 10 spending customers

```bash
curl http://localhost:3000/api/consumers/top?limit=10
```

### Get order statistics

```bash
curl http://localhost:3000/api/orders/statistics
```

### Get detailed consumer statistics

```bash
curl http://localhost:3000/api/consumers/5/statistics
```

## Response Examples

### Product Response

```json
{
  "id": 42,
  "name": "Wireless Headphones",
  "description": "Noise-cancelling wireless headphones",
  "price": 249.99,
  "category": "Electronics",
  "stock": 150,
  "createdAt": "2024-03-15T00:00:00.000Z"
}
```

### Order Response

```json
{
  "id": 1234,
  "consumerId": 5,
  "productId": 42,
  "quantity": 1,
  "totalPrice": 249.99,
  "status": "delivered",
  "orderDate": "2024-09-15T00:00:00.000Z",
  "deliveryDate": "2024-09-20T00:00:00.000Z"
}
```

### Consumer Response

```json
{
  "id": 5,
  "name": "John Smith",
  "email": "john.smith@example.com",
  "phone": "+1-555-0123",
  "address": "123 Main St, New York, NY 10001",
  "registeredAt": "2024-01-15T00:00:00.000Z",
  "totalOrders": 15,
  "totalSpent": 2450.5,
  "lastOrderDate": "2024-09-15T00:00:00.000Z"
}
```

### Consumer Statistics Response

```json
{
  "id": 5,
  "name": "John Smith",
  "email": "john.smith@example.com",
  "phone": "+1-555-0123",
  "address": "123 Main St, New York, NY 10001",
  "registeredAt": "2024-01-15T00:00:00.000Z",
  "totalOrders": 15,
  "totalSpent": 2450.5,
  "lastOrderDate": "2024-09-15T00:00:00.000Z",
  "avgOrderValue": "163.37",
  "daysSinceRegistration": 275,
  "daysSinceLastOrder": 32
}
```

### Order Statistics Response

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

## Error Responses

### 404 Not Found

```json
{
  "statusCode": 404,
  "message": "Product with ID 9999 not found",
  "error": "Not Found"
}
```

### 400 Bad Request

```json
{
  "statusCode": 400,
  "message": ["price must be a number"],
  "error": "Bad Request"
}
```
