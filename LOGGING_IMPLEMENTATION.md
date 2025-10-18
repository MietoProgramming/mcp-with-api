# Logging Implementation Guide

## Overview

Comprehensive logging has been added to all services to monitor data flow and application behavior. The built-in NestJS `Logger` is used throughout the application.

## Logger Configuration

Each service has its own logger instance initialized with the service name:

```typescript
import { Logger } from '@nestjs/common';

export class MyService {
  private readonly logger = new Logger(MyService.name);
}
```

## Logging Levels

The following logging levels are used:

- **`log`**: General information about successful operations
- **`debug`**: Detailed information for debugging
- **`warn`**: Warning messages (e.g., missing configuration)
- **`error`**: Error messages with error details

## Services with Logging

### 1. AI Analysis Service (`src/ai-analysis/ai-analysis.service.ts`)

#### Initialization

- Logs service initialization
- Logs output directory path
- **Warns if OPENROUTER_API_KEY is not set**

#### `generateAnalysis` Method

- Logs analysis type and description
- Logs data retrieval count
- Logs CSV file creation
- Logs code generation timing
- Logs notebook file creation
- Logs completion status
- Logs errors with full error details

#### `getAnalysisData` Method

- Logs analysis type
- Logs consumer/order/product counts

#### `createCsvFile` Method

- Logs file creation start
- Logs output directory
- Logs CSV headers
- Logs record count

#### `generateNotebookCode` Method

- Logs prompt preparation
- Logs prompt length
- Logs API call timing (duration in milliseconds)
- Logs response size
- Logs cell count
- Logs errors with full details

#### `createNotebookFile` Method

- Logs notebook file creation start
- Logs notebook path
- Logs cell parsing
- Logs cell count
- Logs file write operation
- Logs successful creation with filename

### 2. Analytics Service (`src/analytics/analytics.service.ts`)

#### Initialization

- Logs service initialization

#### `analyzeConsumerBehavior` Method

- Logs consumer ID being analyzed
- Warns if consumer not found
- Logs analysis result with reorder probability and total score

#### `getAllConsumerPredictions` Method

- Logs when fetching predictions for all consumers
- Logs total prediction count

### 3. Consumers Service (`src/consumers/consumers.service.ts`)

#### Initialization

- Logs service initialization
- Logs number of consumers generated

#### `findAll` Method

- Logs total consumer count

#### `findOne` Method

- Logs consumer ID being fetched

### 4. Orders Service (`src/orders/orders.service.ts`)

#### Initialization

- Logs service initialization
- Logs number of orders generated

#### `findAll` Method

- Logs total order count

#### `findOne` Method

- Logs order ID being fetched

#### `findByConsumer` Method

- Logs consumer ID
- Logs order count for consumer

### 5. Products Service (`src/products/products.service.ts`)

#### Initialization

- Logs service initialization
- Logs number of products generated

#### `findAll` Method

- Logs total product count

#### `findOne` Method

- Logs product ID being fetched

#### `findByCategory` Method

- Logs category being searched
- Logs product count in category

## Example Log Output

### Application Startup

```
[Nest] 12345  - 01/13/2025, 10:30:45 AM     LOG [ConsumersService] Initializing Consumers Service
[Nest] 12345  - 01/13/2025, 10:30:45 AM     LOG [ConsumersService] Generated 100 consumers
[Nest] 12345  - 01/13/2025, 10:30:45 AM     LOG [ProductsService] Initializing Products Service
[Nest] 12345  - 01/13/2025, 10:30:45 AM     LOG [ProductsService] Generated 500 products
[Nest] 12345  - 01/13/2025, 10:30:45 AM     LOG [OrdersService] Initializing Orders Service
[Nest] 12345  - 01/13/2025, 10:30:45 AM     LOG [OrdersService] Generated 10000 orders
[Nest] 12345  - 01/13/2025, 10:30:45 AM     LOG [AnalyticsService] Initializing Analytics Service
[Nest] 12345  - 01/13/2025, 10:30:45 AM     LOG [AiAnalysisService] Initializing AI Analysis Service
[Nest] 12345  - 01/13/2025, 10:30:45 AM     LOG [AiAnalysisService] Output directory: D:\ProgrammingProjects\mcp-with-api\output
```

### AI Analysis Request

```
[Nest] 12345  - 01/13/2025, 10:35:22 AM     LOG [AiAnalysisService] Starting analysis generation for type: consumer-behavior
[Nest] 12345  - 01/13/2025, 10:35:22 AM   DEBUG [AiAnalysisService] Getting data for analysis type: consumer-behavior
[Nest] 12345  - 01/13/2025, 10:35:22 AM   DEBUG [AiAnalysisService] Retrieved 100 consumers for analysis
[Nest] 12345  - 01/13/2025, 10:35:22 AM   DEBUG [AiAnalysisService] Creating CSV file for analysis
[Nest] 12345  - 01/13/2025, 10:35:22 AM   DEBUG [AiAnalysisService] Writing to output directory: D:\ProgrammingProjects\mcp-with-api\output
[Nest] 12345  - 01/13/2025, 10:35:22 AM   DEBUG [AiAnalysisService] CSV headers: id, name, email, totalOrders, totalSpent
[Nest] 12345  - 01/13/2025, 10:35:22 AM   DEBUG [AiAnalysisService] Writing 100 records to CSV
[Nest] 12345  - 01/13/2025, 10:35:22 AM     LOG [AiAnalysisService] Created CSV file: output\consumer-behavior_1736768122345.csv
[Nest] 12345  - 01/13/2025, 10:35:22 AM   DEBUG [AiAnalysisService] Generating notebook code with OpenRouter AI
[Nest] 12345  - 01/13/2025, 10:35:22 AM   DEBUG [AiAnalysisService] Prompt length: 542 characters
[Nest] 12345  - 01/13/2025, 10:35:22 AM   DEBUG [AiAnalysisService] Making API call to OpenRouter...
[Nest] 12345  - 01/13/2025, 10:35:24 AM   DEBUG [AiAnalysisService] API call completed in 2145ms
[Nest] 12345  - 01/13/2025, 10:35:24 AM   DEBUG [AiAnalysisService] Response length: 3456 characters
[Nest] 12345  - 01/13/2025, 10:35:24 AM   DEBUG [AiAnalysisService] Code cells count: 5
[Nest] 12345  - 01/13/2025, 10:35:24 AM   DEBUG [AiAnalysisService] Creating Jupyter notebook file
[Nest] 12345  - 01/13/2025, 10:35:24 AM   DEBUG [AiAnalysisService] Notebook path: D:\ProgrammingProjects\mcp-with-api\output\consumer-behavior_analysis_1736768122345.ipynb
[Nest] 12345  - 01/13/2025, 10:35:24 AM   DEBUG [AiAnalysisService] Parsing code into notebook cells
[Nest] 12345  - 01/13/2025, 10:35:24 AM   DEBUG [AiAnalysisService] Created 5 notebook cells
[Nest] 12345  - 01/13/2025, 10:35:24 AM   DEBUG [AiAnalysisService] Writing notebook file to disk
[Nest] 12345  - 01/13/2025, 10:35:24 AM     LOG [AiAnalysisService] Notebook file created successfully: consumer-behavior_analysis_1736768122345.ipynb
[Nest] 12345  - 01/13/2025, 10:35:24 AM     LOG [AiAnalysisService] Analysis completed successfully in 2.5 seconds
```

### Analytics Request

```
[Nest] 12345  - 01/13/2025, 10:40:15 AM   DEBUG [AnalyticsService] Analyzing consumer behavior for ID: 42
[Nest] 12345  - 01/13/2025, 10:40:15 AM     LOG [AnalyticsService] Consumer 42 analyzed - Reorder probability: 78.5%, Total score: 12
```

## Viewing Logs

### Development Mode

Logs are automatically displayed in the console when running the application:

```bash
yarn start:dev
```

### Production Mode

In production, logs can be:

1. Redirected to a file
2. Sent to a logging service (e.g., Winston, Sentry)
3. Collected by container orchestration systems

## Log Level Configuration

To change the log level, set the `LOG_LEVEL` environment variable in `.env`:

```env
LOG_LEVEL=debug  # Show all logs including debug
# or
LOG_LEVEL=log    # Show only log, warn, and error (default)
# or
LOG_LEVEL=warn   # Show only warn and error
# or
LOG_LEVEL=error  # Show only errors
```

## Debugging Tips

### 1. Monitor Data Flow

Use debug logs to track data as it flows through the application:

```
[DEBUG] Fetching consumer ID: 42
[DEBUG] Retrieved 15 orders for consumer 42
[DEBUG] Analyzing purchase pattern...
```

### 2. Performance Monitoring

Check timing logs to identify slow operations:

```
[DEBUG] API call completed in 2145ms
```

### 3. Error Tracking

All errors are logged with full details:

```
[ERROR] Failed to generate notebook code: API key invalid
Error: Request failed with status code 401
  at generateNotebookCode (ai-analysis.service.ts:330)
```

### 4. Missing Configuration

Warnings alert you to missing or invalid configuration:

```
[WARN] OPENROUTER_API_KEY is not set. AI analysis will not work.
```

## Best Practices

1. **Use appropriate log levels**:
   - `debug` for detailed flow information
   - `log` for important events
   - `warn` for potential issues
   - `error` for failures

2. **Include context in log messages**:
   - Include IDs, counts, and relevant data
   - Example: `Consumer 42 analyzed` instead of `Analysis complete`

3. **Log operation timing for performance monitoring**:
   - Start time before operation
   - Duration after completion

4. **Avoid logging sensitive data**:
   - Don't log passwords, API keys, or personal information
   - Sanitize data before logging if necessary

5. **Use structured logging for complex data**:
   - Include key-value pairs for easier parsing
   - Example: `Reorder probability: 78.5%, Total score: 12`

## Next Steps

- Consider adding log aggregation (e.g., ELK Stack, Datadog)
- Implement log rotation for production environments
- Add custom log formatters for different environments
- Consider adding request ID tracking for distributed tracing
