# AI Analysis Architecture

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client / User                            │
│                  (curl, Postman, Browser, MCP)                   │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTP POST /ai-analysis/generate
                             │ { analysisType, description }
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    AI Analysis Controller                        │
│                  (ai-analysis.controller.ts)                     │
│                                                                   │
│  Endpoints:                                                       │
│  • POST /ai-analysis/generate                                    │
│  • GET  /ai-analysis/files                                       │
│  • GET  /ai-analysis/examples                                    │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ calls generateAnalysis()
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                     AI Analysis Service                          │
│                   (ai-analysis.service.ts)                       │
│                                                                   │
│  Main Flow:                                                       │
│  1. getAnalysisData()     ──────┐                                │
│  2. createCsvFile()             │                                │
│  3. generateNotebookCode()      │                                │
│  4. createNotebookFile()        │                                │
└─────────────────────────────────┼────────────────────────────────┘
                                  │
                ┌─────────────────┼─────────────────┐
                │                 │                 │
                ▼                 ▼                 ▼
    ┌───────────────┐  ┌──────────────┐  ┌──────────────┐
    │   Consumers   │  │    Orders    │  │   Products   │
    │    Service    │  │   Service    │  │   Service    │
    └───────────────┘  └──────────────┘  └──────────────┘
                │                 │                 │
                └─────────────────┼─────────────────┘
                                  │
                                  │ Data fetched
                                  │
                                  ▼
                        ┌──────────────────┐
                        │  Analytics       │
                        │  Service         │
                        │  (RFM, ML)       │
                        └──────────────────┘
                                  │
                                  │ Returns structured data
                                  │
        ┌─────────────────────────┴─────────────────────────┐
        │                                                     │
        ▼                                                     ▼
┌──────────────┐                                    ┌─────────────────┐
│ CSV Writer   │                                    │  OpenRouter AI  │
│              │                                    │  (OpenAI SDK)   │
│ Creates:     │                                    │                 │
│ data.csv     │                                    │  Model: Qwen    │
│              │                                    │  2.5 Coder      │
└──────┬───────┘                                    └────────┬────────┘
       │                                                     │
       │ Writes to disk                                     │ Returns code
       │                                                     │
       ▼                                                     ▼
┌────────────────────────────────────────────────────────────────────┐
│                    File System                                      │
│                                                                      │
│  generated-analysis/                                                 │
│    ├── consumers_analysis_1234567890.ipynb  ◄─────┐                │
│    └── consumers_data_1234567890.csv               │                │
│                                                     │                │
│  Notebook Structure:                                │                │
│  {                                                  │                │
│    "cells": [                                       │                │
│      { "cell_type": "markdown", ... },             │ Created by     │
│      { "cell_type": "code", ... },                 │ Service        │
│      ...                                            │                │
│    ],                                               │                │
│    "metadata": { ... },                             │                │
│    "nbformat": 4                                    │                │
│  }                                                  │                │
└─────────────────────────────────────────────────────┘                │
                             │                                         │
                             │ Response returned                       │
                             │                                         │
                             ▼                                         │
┌─────────────────────────────────────────────────────────────────┐  │
│                      API Response                                │  │
│                                                                   │  │
│  {                                                                │  │
│    "notebookPath": "D:\\...\\consumers_analysis_123.ipynb",      │  │
│    "csvPath": "D:\\...\\consumers_data_123.csv",                 │  │
│    "analysisDescription": "...",                                  │  │
│    "generatedCode": "..."                                         │  │
│  }                                                                │  │
└────────────────────────────┬────────────────────────────────────┘  │
                             │                                         │
                             │                                         │
                             ▼                                         │
┌─────────────────────────────────────────────────────────────────┐  │
│                    User Opens Notebook                           │  │
│                                                                   │  │
│  jupyter notebook                                                 │  │
│    → Opens .ipynb file                                           │  │
│    → Reads ./data.csv  ◄──────────────────────────────────────────┘
│    → Executes Python code                                        │
│    → Generates visualizations                                    │
│    → Shows analysis results                                      │
└──────────────────────────────────────────────────────────────────┘
```

## Data Flow

### Step-by-Step Process

1. **Client Request**

   ```
   POST /ai-analysis/generate
   Body: { analysisType: "consumers", description: "..." }
   ```

2. **Controller Receives Request**
   - Validates input
   - Calls service method
   - Returns response

3. **Service Fetches Data**

   ```typescript
   switch (analysisType) {
     case 'consumers':
       consumersService.findAll();
     case 'orders':
       ordersService.findAll();
     case 'products':
       productsService.findAll();
     case 'analytics':
       analyticsService.getAllPredictions();
   }
   ```

4. **CSV Generation**

   ```typescript
   csvWriter.writeRecords(data)
   → generated-analysis/consumers_data_123.csv
   ```

5. **AI Code Generation**

   ```typescript
   openai.chat.completions.create({
     model: 'qwen/qwen-2.5-coder-32b-instruct',
     messages: [prompt with data context]
   })
   → Returns Python code as string
   ```

6. **Notebook Creation**

   ```typescript
   parseCodeIntoCells(generatedCode)
   → Creates .ipynb JSON structure
   → Writes to generated-analysis/consumers_analysis_123.ipynb
   ```

7. **Response to Client**

   ```json
   {
     "notebookPath": "...",
     "csvPath": "...",
     "analysisDescription": "...",
     "generatedCode": "..."
   }
   ```

8. **User Execution**
   ```bash
   jupyter notebook
   # Opens notebook
   # Runs cells
   # Views results
   ```

## Component Interactions

### Dependencies

```
AiAnalysisModule
  ├── imports
  │   ├── ConsumersModule (provides ConsumersService)
  │   ├── OrdersModule (provides OrdersService)
  │   ├── ProductsModule (provides ProductsService)
  │   └── AnalyticsModule (provides AnalyticsService)
  │
  ├── controllers
  │   └── AiAnalysisController
  │
  └── providers
      └── AiAnalysisService
          ├── uses OpenAI SDK → OpenRouter API
          ├── uses csv-writer → CSV files
          └── uses fs/promises → File system
```

## External Services

### OpenRouter API Integration

```
AiAnalysisService
    │
    │ HTTP Request
    ▼
https://openrouter.ai/api/v1/chat/completions
    │
    │ Authentication: Bearer ${OPENROUTER_API_KEY}
    │ Headers: X-Title, HTTP-Referer
    │
    │ Request Body:
    │ {
    │   "model": "qwen/qwen-2.5-coder-32b-instruct",
    │   "messages": [...],
    │   "temperature": 0.7,
    │   "max_tokens": 4000
    │ }
    │
    ▼
Response: { choices: [{ message: { content: "Python code" }}]}
    │
    │ Extract code
    ▼
Parse and create notebook
```

## File Structure

```
project-root/
├── src/
│   ├── ai-analysis/
│   │   ├── ai-analysis.controller.ts   ← HTTP endpoints
│   │   ├── ai-analysis.service.ts      ← Business logic
│   │   └── ai-analysis.module.ts       ← Module config
│   │
│   ├── consumers/
│   │   └── consumers.service.ts        ← Data source
│   ├── orders/
│   │   └── orders.service.ts           ← Data source
│   ├── products/
│   │   └── products.service.ts         ← Data source
│   └── analytics/
│       └── analytics.service.ts        ← Data source
│
├── generated-analysis/                  ← Output directory
│   ├── *.ipynb                         ← Generated notebooks
│   └── *.csv                           ← Generated data
│
├── .env                                 ← API key
├── AI_ANALYSIS_DOCUMENTATION.md        ← Full docs
└── AI_ANALYSIS_QUICKSTART.md          ← Quick guide
```

## Analysis Types & Data Sources

| Analysis Type | Data Source      | Fields Exported             |
| ------------- | ---------------- | --------------------------- |
| consumers     | ConsumersService | id, name, email, city, etc. |
| orders        | OrdersService    | order details, products     |
| products      | ProductsService  | product catalog             |
| analytics     | AnalyticsService | RFM scores, predictions     |
| custom        | All services     | Combined data               |

## Security & Configuration

```
Environment Variables (.env)
    │
    └── OPENROUTER_API_KEY
            │
            ▼
    AiAnalysisService constructor
            │
            ├── Initializes OpenAI client
            ├── Sets base URL
            └── Configures headers
```

## Error Handling Flow

```
Request → Controller
              │
              │ try/catch
              ▼
          Service Method
              │
              ├── Data fetching error
              │   └→ BadRequestException("No data available")
              │
              ├── AI API error
              │   └→ BadRequestException("Failed to generate code")
              │
              └── File system error
                  └→ System error response
```

## Performance Characteristics

| Operation         | Time        | Details             |
| ----------------- | ----------- | ------------------- |
| Data Fetch        | < 100ms     | In-memory data      |
| CSV Write         | < 500ms     | Disk I/O            |
| AI Generation     | 5-15s       | External API call   |
| Notebook Creation | < 100ms     | JSON serialization  |
| **Total**         | **~10-20s** | Mostly AI wait time |

## Scalability Considerations

- Data sources are in-memory (fast)
- AI calls are sequential (could be parallelized)
- File writes are async (non-blocking)
- No database dependencies
- Stateless service (horizontally scalable)

---

This architecture provides:

- ✅ Clean separation of concerns
- ✅ Reusable data services
- ✅ External AI integration
- ✅ File-based output
- ✅ Error handling at all layers
- ✅ Easy to test and maintain
