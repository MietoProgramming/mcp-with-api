# Data Generation Summary

## Overview

This document describes the mock data generation strategy used in the MCP-with-API project.

## Generated Data Volumes

- **Products**: 500 items
- **Consumers**: 100 customers
- **Orders**: 10,000 transactions

## Products (500 items)

### Categories Distribution (Random)

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

### Product Attributes

- **ID**: Sequential (1-500)
- **Name**: Generated using Faker commerce methods (adjective + material + product)
- **Description**: Faker product description
- **Price**: Random between $5.00 - $2,000.00
- **Stock**: Random between 0-500 units
- **Created Date**: Random between Jan 1, 2023 - Oct 1, 2024

## Consumers (100 people)

### Consumer Attributes

- **ID**: Sequential (1-100)
- **Name**: Faker person full name
- **Email**: Faker internet email (lowercase)
- **Phone**: Faker phone number
- **Address**: Full formatted US address (street, city, state, zip)
- **Registered Date**: Random between Jan 1, 2023 - Sep 1, 2024
- **Total Orders**: Calculated from generated orders
- **Total Spent**: Calculated from generated orders
- **Last Order Date**: Calculated from generated orders

## Orders (10,000 transactions)

### Order Attributes

- **ID**: Sequential (1-10000)
- **Consumer ID**: Random (1-100)
- **Product ID**: Random (1-500)
- **Quantity**: Random (1-5)
- **Total Price**: Calculated (unit price × quantity)
- **Order Date**: Random between Jan 1, 2023 - Oct 15, 2024
- **Status**: Weighted random distribution
- **Delivery Date**: Set for delivered orders (2-14 days after order date)

### Status Distribution

- **Delivered**: 70% (7,000 orders)
- **Shipped**: 10% (1,000 orders)
- **Processing**: 8% (800 orders)
- **Pending**: 7% (700 orders)
- **Cancelled**: 5% (500 orders)

## Data Relationships

### Consumer-Order Relationship

- Each consumer can have 0 to many orders
- On average: 100 orders per consumer (10,000 ÷ 100)
- Distribution is random, so some consumers may have many orders, others few

### Product-Order Relationship

- Each product can be in 0 to many orders
- On average: 20 orders per product (10,000 ÷ 500)
- Distribution is random based on order generation

## Data Generation Process

1. **Products Generated First** (at startup)
   - 500 products created with faker-generated attributes
   - Stored in memory

2. **Consumers Generated Second** (at startup)
   - 100 consumers created with faker-generated attributes
   - Initially: totalOrders=0, totalSpent=0, lastOrderDate=undefined

3. **Orders Generated Third** (100ms delay)
   - 10,000 orders created linking random consumers and products
   - Orders sorted chronologically

4. **Consumer Statistics Updated** (after orders)
   - Iterate through all orders
   - Group by consumer
   - Update each consumer's:
     - totalOrders (count of orders)
     - totalSpent (sum of order totals)
     - lastOrderDate (most recent order date)

## Memory and Performance

### Estimated Memory Usage

- **Products**: ~500KB (500 × ~1KB each)
- **Consumers**: ~100KB (100 × ~1KB each)
- **Orders**: ~5MB (10,000 × ~500B each)
- **Total**: ~6-10MB for all data structures

### Generation Time

- Products: ~50ms
- Consumers: ~20ms
- Orders: ~500ms - 1s
- Statistics Update: ~10ms
- **Total**: ~2-3 seconds on average

## API Response Performance

All data is served from memory (JavaScript arrays):

- List endpoints: <10ms
- Single item endpoints: <1ms
- Filtered queries: <50ms
- Statistics calculations: <20ms

## Faker.js Configuration

The project uses [@faker-js/faker](https://fakerjs.dev/) v8.x with default locale (en).

### Key Faker Methods Used

- `faker.person.fullName()` - Consumer names
- `faker.internet.email()` - Email addresses
- `faker.phone.number()` - Phone numbers
- `faker.location.*` - Addresses (street, city, state, zip)
- `faker.commerce.*` - Product names, descriptions, prices
- `faker.date.between()` - Date ranges
- `faker.number.int()` - Random integers
- `faker.helpers.arrayElement()` - Random selection from array

## Reproducibility

Each application restart generates **different data** because:

- Faker uses random seed by default
- No seed is explicitly set

To make data reproducible across restarts, you could add:

```typescript
faker.seed(123); // Fixed seed number
```

This is currently **not implemented** to provide variety in testing.

## Future Enhancements

Potential improvements to data generation:

1. **Configurable volumes** - Environment variables for counts
2. **Seeded generation** - Reproducible data option
3. **More realistic distributions** - Some products more popular than others
4. **Customer segments** - VIP, regular, new customer types
5. **Seasonal patterns** - Order dates follow seasonal trends
6. **Product availability** - Out-of-stock items not in recent orders
7. **Geographic distribution** - Consumers clustered by region
8. **Price ranges by category** - Electronics more expensive than toys
