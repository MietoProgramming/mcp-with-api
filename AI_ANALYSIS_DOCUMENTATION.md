# AI-Powered Data Analysis Feature

This feature allows you to generate Python Jupyter notebooks for data analysis using AI (OpenRouter with Qwen Coder model).

## Overview

The AI Analysis feature automatically:

1. Fetches data from your API (consumers, orders, products, or analytics)
2. Exports data to a CSV file
3. Uses AI to generate Python code for comprehensive data analysis
4. Creates a Jupyter notebook (.ipynb) with the generated code
5. The notebook is ready to run and will load the CSV data automatically

## Setup

### 1. Get OpenRouter API Key

1. Visit https://openrouter.ai/
2. Sign up or log in
3. Go to https://openrouter.ai/keys
4. Create a new API key
5. Copy the key

### 2. Configure Environment

Create a `.env` file in the project root:

```env
OPENROUTER_API_KEY=your_api_key_here
```

### 3. Install Dependencies (Already Done)

The required packages are already installed:

- `openai` - OpenAI SDK (compatible with OpenRouter)
- `csv-writer` - CSV file generation

## API Endpoints

### Generate Analysis

**POST** `/ai-analysis/generate`

Generate a data analysis notebook using AI.

**Request Body:**

```json
{
  "analysisType": "consumers" | "orders" | "products" | "analytics" | "custom",
  "description": "What analysis you want to perform",
  "filters": {} // optional, not yet implemented
}
```

**Response:**

```json
{
  "notebookPath": "D:\\ProgrammingProjects\\mcp-with-api\\generated-analysis\\consumers_analysis_1234567890.ipynb",
  "csvPath": "D:\\ProgrammingProjects\\mcp-with-api\\generated-analysis\\consumers_data_1234567890.csv",
  "analysisDescription": "Analyze consumer behavior patterns...",
  "generatedCode": "###CELL###\nimport pandas as pd\n..."
}
```

### List Generated Files

**GET** `/ai-analysis/files`

Get list of all generated notebooks and CSV files.

**Response:**

```json
{
  "files": [
    "consumers_analysis_1234567890.ipynb",
    "consumers_data_1234567890.csv",
    "orders_analysis_9876543210.ipynb",
    "orders_data_9876543210.csv"
  ]
}
```

### Get Examples

**GET** `/ai-analysis/examples`

Get example analysis requests.

**Response:**

```json
{
  "examples": [
    {
      "analysisType": "consumers",
      "description": "Analyze consumer demographics, spending patterns..."
    },
    ...
  ]
}
```

## Analysis Types

### 1. Consumers

Analyzes consumer data including:

- Demographics (city, country)
- Registration dates
- Total orders and spending

### 2. Orders

Analyzes order data including:

- Order details (product, quantity, price)
- Order status distribution
- Time-based trends

### 3. Products

Analyzes product data including:

- Product categories
- Pricing
- Stock levels

### 4. Analytics

Analyzes advanced analytics data including:

- RFM scores (Recency, Frequency, Monetary)
- Reorder predictions
- Churn risk assessment
- Customer behavior patterns

### 5. Custom

Combines all data sources for comprehensive analysis including:

- Consumer-product relationships
- Geographic sales patterns
- Complete purchase journey

## Usage Examples

### Example 1: Consumer Behavior Analysis

```bash
curl -X POST http://localhost:3000/ai-analysis/generate \
  -H "Content-Type: application/json" \
  -d '{
    "analysisType": "consumers",
    "description": "Analyze consumer behavior patterns, identify high-value customers, create geographic heat maps, and segment customers by spending levels"
  }'
```

### Example 2: Sales Trend Analysis

```bash
curl -X POST http://localhost:3000/ai-analysis/generate \
  -H "Content-Type: application/json" \
  -d '{
    "analysisType": "orders",
    "description": "Analyze sales trends over time, identify peak ordering periods, show product category popularity with charts, and calculate revenue metrics"
  }'
```

### Example 3: ML-Based Predictions

```bash
curl -X POST http://localhost:3000/ai-analysis/generate \
  -H "Content-Type: application/json" \
  -d '{
    "analysisType": "analytics",
    "description": "Use machine learning to predict customer churn, perform RFM analysis with clustering, create correlation heat maps, and identify high-value reorder candidates"
  }'
```

### Example 4: Custom Comprehensive Analysis

```bash
curl -X POST http://localhost:3000/ai-analysis/generate \
  -H "Content-Type: application/json" \
  -d '{
    "analysisType": "custom",
    "description": "Perform comprehensive business intelligence analysis combining all data sources, identify correlations between customer demographics and product preferences, forecast future sales, and recommend marketing strategies"
  }'
```

## What the AI Generates

The AI model (Qwen 2.5 Coder) generates Python code that typically includes:

### 1. Data Loading & Preprocessing

- CSV import with pandas
- Data cleaning
- Missing value handling
- Data type conversions

### 2. Exploratory Data Analysis (EDA)

- Statistical summaries
- Distribution plots
- Descriptive statistics

### 3. Visualizations

- **Bar charts** - Category comparisons
- **Line charts** - Trend analysis
- **Scatter plots** - Correlations
- **Heat maps** - Correlation matrices
- **Pie charts** - Proportions
- **Box plots** - Distribution analysis
- **Histograms** - Frequency distributions

### 4. Advanced Analytics

- **Clustering** - Customer segmentation
- **Classification** - Predictive models
- **Regression** - Forecasting
- **Time series analysis** - Trend forecasting

### 5. Libraries Used

- **pandas** - Data manipulation
- **matplotlib** - Basic plotting
- **seaborn** - Statistical visualizations
- **plotly** - Interactive charts
- **scikit-learn** - Machine learning models
- **numpy** - Numerical operations

## Generated Files

All files are created in the `generated-analysis/` directory:

```
generated-analysis/
  ├── consumers_analysis_1234567890.ipynb
  ├── consumers_data_1234567890.csv
  ├── orders_analysis_9876543210.ipynb
  ├── orders_data_9876543210.csv
  └── ...
```

### Notebook Structure

Each notebook contains:

1. **Title cell** - Markdown with analysis description
2. **Import cells** - Required libraries
3. **Data loading** - CSV import with error handling
4. **Analysis cells** - Multiple code cells with analysis
5. **Visualization cells** - Charts and graphs
6. **Insights cells** - Markdown explanations

### CSV Files

CSV files contain structured data ready for analysis:

- Column headers
- Properly formatted data
- Consistent data types

## Running Generated Notebooks

### Prerequisites

Install Python packages:

```bash
pip install pandas matplotlib seaborn plotly scikit-learn numpy jupyter
```

### Run Jupyter

```bash
# Navigate to the generated-analysis directory
cd generated-analysis

# Start Jupyter Notebook
jupyter notebook
```

### Open and Run

1. Open the generated `.ipynb` file in Jupyter
2. The CSV file is automatically referenced with relative path
3. Run all cells (Kernel -> Restart & Run All)
4. View the analysis results

## Technical Details

### Model Configuration

- **Model:** `qwen/qwen-2.5-coder-32b-instruct`
- **Provider:** OpenRouter
- **Interface:** OpenAI-compatible API
- **Temperature:** 0.7 (balanced creativity/consistency)
- **Max Tokens:** 4000

### Why This Model?

- **Free tier available** - Cost-effective testing
- **Code generation specialist** - Optimized for Python code
- **Large context window** - Handles complex analyses
- **High quality output** - Professional, runnable code

### Service Architecture

```
Controller (ai-analysis.controller.ts)
    ↓
Service (ai-analysis.service.ts)
    ↓
├── Data Fetching (ConsumersService, OrdersService, etc.)
├── CSV Generation (csv-writer)
├── AI Code Generation (OpenRouter/OpenAI SDK)
└── Notebook Creation (.ipynb file structure)
```

### Error Handling

The service handles:

- Missing API key
- Invalid analysis types
- Empty datasets
- API failures
- File system errors

## Troubleshooting

### API Key Issues

**Problem:** "Failed to generate code: Unauthorized"

**Solution:**

1. Check `.env` file exists
2. Verify `OPENROUTER_API_KEY` is set correctly
3. Restart the NestJS server

### Empty Data

**Problem:** "No data available for analysis"

**Solution:**

1. Ensure the API has generated mock data
2. Start the server - data is generated on startup
3. Check the specific endpoint has data

### File Not Found

**Problem:** Cannot find generated files

**Solution:**

1. Check the `generated-analysis/` directory exists
2. Look at the returned file paths in the API response
3. Use absolute paths provided in response

### Notebook Won't Run

**Problem:** Python notebook has errors

**Solution:**

1. Install required Python packages
2. Ensure CSV file is in same directory as notebook
3. Check Python version compatibility (3.8+)
4. Try regenerating with a more specific description

## Best Practices

### Writing Analysis Descriptions

**Good descriptions:**

- ✅ "Analyze customer churn by creating a logistic regression model, visualize feature importance, and identify at-risk customers"
- ✅ "Compare product categories by revenue, create bar charts showing top performers, and calculate profit margins"
- ✅ "Perform time series analysis on orders, forecast next month's sales, and identify seasonal patterns"

**Bad descriptions:**

- ❌ "Analyze data" (too vague)
- ❌ "Make charts" (not specific enough)
- ❌ "Do machine learning" (no clear objective)

### Choosing Analysis Types

- **consumers** - Focus on customer behavior
- **orders** - Focus on transaction patterns
- **products** - Focus on inventory and pricing
- **analytics** - Focus on predictions and ML
- **custom** - Complex multi-dimensional analysis

## Future Enhancements

Potential improvements:

- [ ] Support for filtering data before analysis
- [ ] Multiple AI models to choose from
- [ ] Interactive notebook generation with user prompts
- [ ] Automatic execution and result caching
- [ ] PDF report generation
- [ ] Scheduled analysis runs
- [ ] Integration with BI tools

## Security Considerations

- API keys stored in environment variables (not in code)
- Generated files in project directory (not exposed publicly)
- Input validation on analysis requests
- Rate limiting recommended for production use

## Performance

- **CSV generation:** < 1 second
- **AI code generation:** 5-15 seconds (depends on OpenRouter)
- **Notebook creation:** < 1 second
- **Total time:** ~10-20 seconds per request

## Support

For issues or questions:

1. Check this documentation
2. Review the API examples
3. Test with the example endpoints
4. Check OpenRouter status: https://openrouter.ai/docs
