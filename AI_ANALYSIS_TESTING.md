# Testing AI Analysis Feature

## Test Examples

Here are real-world test scenarios you can use to test the AI analysis feature.

## Prerequisites

1. **API Key Setup**

```bash
# Create .env file
echo OPENROUTER_API_KEY=your_actual_key_here > .env
```

2. **Start Server**

```bash
yarn start:dev
```

3. **Verify Server Running**

```bash
curl http://localhost:3000
```

## Test 1: Consumer Spending Analysis

**Goal**: Analyze consumer spending patterns and demographics

**Request**:

```bash
curl -X POST http://localhost:3000/ai-analysis/generate ^
  -H "Content-Type: application/json" ^
  -d "{\"analysisType\": \"consumers\", \"description\": \"Create a comprehensive analysis of consumer spending patterns including: 1) Distribution of customers by country with bar chart, 2) Top 10 spenders with horizontal bar chart, 3) Correlation heatmap between total orders and total spent, 4) Statistical summary of spending distribution\"}"
```

**Expected Output**:

- Notebook file path
- CSV file path
- Generated code preview

**Expected Notebook Contents**:

- Bar chart of customers by country
- Top 10 spenders visualization
- Correlation heatmap
- Statistical summaries

## Test 2: Sales Trends Analysis

**Goal**: Analyze order trends over time

**Request**:

```bash
curl -X POST http://localhost:3000/ai-analysis/generate ^
  -H "Content-Type: application/json" ^
  -d "{\"analysisType\": \"orders\", \"description\": \"Perform time series analysis of orders including: 1) Line chart of orders over time, 2) Revenue trends by month, 3) Order status distribution pie chart, 4) Average order value by product category with bar chart, 5) Statistical analysis of order quantities\"}"
```

**Expected Notebook Contents**:

- Time series line charts
- Pie chart for order status
- Bar chart for avg order value by category
- Statistical insights

## Test 3: Product Category Analysis

**Goal**: Analyze product inventory and pricing

**Request**:

```bash
curl -X POST http://localhost:3000/ai-analysis/generate ^
  -H "Content-Type: application/json" ^
  -d "{\"analysisType\": \"products\", \"description\": \"Analyze product data including: 1) Distribution of products by category with pie chart, 2) Price distribution histogram, 3) Stock levels box plot by category, 4) Top 10 most expensive products, 5) Low stock alert (stock < 20) with table\"}"
```

**Expected Notebook Contents**:

- Pie chart of product categories
- Histogram of prices
- Box plot of stock levels
- Low stock products table

## Test 4: ML-Based Churn Prediction

**Goal**: Use machine learning to predict customer churn

**Request**:

```bash
curl -X POST http://localhost:3000/ai-analysis/generate ^
  -H "Content-Type: application/json" ^
  -d "{\"analysisType\": \"analytics\", \"description\": \"Build a machine learning model to predict customer churn including: 1) RFM score correlation heatmap, 2) Scatter plot of frequency vs monetary colored by reorder probability, 3) Logistic regression model to predict churn, 4) Feature importance chart, 5) Confusion matrix, 6) List of top 20 at-risk customers\"}"
```

**Expected Notebook Contents**:

- RFM correlation heatmap
- Scatter plots with reorder probability
- ML model implementation (scikit-learn)
- Model evaluation metrics
- At-risk customer list

## Test 5: Comprehensive Business Intelligence

**Goal**: Multi-dimensional analysis combining all data sources

**Request**:

```bash
curl -X POST http://localhost:3000/ai-analysis/generate ^
  -H "Content-Type: application/json" ^
  -d "{\"analysisType\": \"custom\", \"description\": \"Create a comprehensive business intelligence report including: 1) Sales by country on a geographical heat map, 2) Product category preference by customer location, 3) Time series forecasting for next 30 days using ARIMA or Prophet, 4) Customer segmentation using K-means clustering with 4 segments, 5) Top product-customer pairs, 6) Revenue forecast with confidence intervals\"}"
```

**Expected Notebook Contents**:

- Geographic visualizations
- Customer segmentation (K-means)
- Time series forecasting
- Multiple correlation analyses
- Business recommendations

## Test 6: Quick Exploratory Analysis

**Goal**: Simple data exploration

**Request**:

```bash
curl -X POST http://localhost:3000/ai-analysis/generate ^
  -H "Content-Type: application/json" ^
  -d "{\"analysisType\": \"orders\", \"description\": \"Quick exploratory data analysis with basic statistics and visualizations\"}"
```

**Expected Notebook Contents**:

- Data overview (shape, columns, types)
- Basic statistics
- Simple visualizations
- Missing value analysis

## Test 7: Advanced Statistical Analysis

**Goal**: Deep statistical analysis

**Request**:

```bash
curl -X POST http://localhost:3000/ai-analysis/generate ^
  -H "Content-Type: application/json" ^
  -d "{\"analysisType\": \"analytics\", \"description\": \"Perform advanced statistical analysis including: 1) Distribution analysis with Q-Q plots, 2) Hypothesis testing (t-tests) comparing high vs low spenders, 3) ANOVA for category comparisons, 4) Confidence intervals for key metrics, 5) Outlier detection using IQR method\"}"
```

**Expected Notebook Contents**:

- Q-Q plots
- Hypothesis test results
- ANOVA tables
- Outlier visualization
- Statistical interpretations

## Verification Steps

### 1. Check Response

After each request, verify the response contains:

```json
{
  "notebookPath": "D:\\...\\generated-analysis\\..._analysis_[timestamp].ipynb",
  "csvPath": "D:\\...\\generated-analysis\\..._data_[timestamp].csv",
  "analysisDescription": "...",
  "generatedCode": "###CELL###..."
}
```

### 2. Verify Files Created

```bash
# List generated files
curl http://localhost:3000/ai-analysis/files
```

### 3. Check Directory

```bash
dir generated-analysis
```

You should see:

- `.ipynb` files (notebooks)
- `.csv` files (data)

### 4. Open in Jupyter

```bash
cd generated-analysis
jupyter notebook
```

1. Open the notebook file
2. Verify cells are present
3. Run "Restart & Run All"
4. Check for errors
5. Verify visualizations appear

## Common Test Scenarios

### Edge Cases

**Test: Empty Description**

```bash
curl -X POST http://localhost:3000/ai-analysis/generate ^
  -H "Content-Type: application/json" ^
  -d "{\"analysisType\": \"consumers\", \"description\": \"\"}"
```

Expected: 400 Bad Request

**Test: Invalid Analysis Type**

```bash
curl -X POST http://localhost:3000/ai-analysis/generate ^
  -H "Content-Type: application/json" ^
  -d "{\"analysisType\": \"invalid\", \"description\": \"Test\"}"
```

Expected: 400 Bad Request

**Test: Missing API Key**

```bash
# Remove .env file temporarily
curl -X POST http://localhost:3000/ai-analysis/generate ^
  -H "Content-Type: application/json" ^
  -d "{\"analysisType\": \"consumers\", \"description\": \"Test\"}"
```

Expected: Error about missing API key

## Performance Testing

**Test: Generate 5 Analyses Sequentially**

```bash
for /L %i in (1,1,5) do (
  curl -X POST http://localhost:3000/ai-analysis/generate ^
    -H "Content-Type: application/json" ^
    -d "{\"analysisType\": \"consumers\", \"description\": \"Test %i\"}"
  timeout /t 15
)
```

Expected:

- 5 notebooks created
- ~10-20 seconds per request
- All files in `generated-analysis/`

## Validation Checklist

For each test, verify:

- [ ] API returns 200 OK
- [ ] Response includes `notebookPath`
- [ ] Response includes `csvPath`
- [ ] Notebook file exists on disk
- [ ] CSV file exists on disk
- [ ] CSV file has correct data
- [ ] Notebook has multiple cells
- [ ] Notebook has both markdown and code cells
- [ ] Code cells have imports
- [ ] Code cells reference CSV file correctly
- [ ] Notebook runs without errors in Jupyter
- [ ] Visualizations are generated
- [ ] Analysis matches description

## Jupyter Notebook Requirements

**Python Packages Required**:

```bash
pip install pandas matplotlib seaborn plotly scikit-learn numpy jupyter
```

**Test Notebook Execution**:

```python
# Run this in Python to test if all packages are available
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import plotly.express as px
from sklearn.cluster import KMeans
import numpy as np

print("All packages installed successfully!")
```

## Troubleshooting Tests

### Issue: "No data available"

**Solution**:

```bash
# Restart server to regenerate mock data
# Stop server (Ctrl+C)
yarn start:dev
```

### Issue: "Failed to generate code"

**Check**:

1. OpenRouter API key is valid
2. API key has credits/quota
3. Check OpenRouter status: https://status.openrouter.ai/

### Issue: Notebook has errors

**Check**:

1. Python packages installed
2. CSV file in same directory as notebook
3. File paths are correct

### Issue: Empty notebook cells

**Try**:

1. More specific description
2. Different analysis type
3. Regenerate with clearer instructions

## Success Criteria

A successful test should produce:

1. **Notebook File**:
   - Has 5+ cells
   - Mix of markdown and code
   - Imports are present
   - Code is syntactically correct

2. **CSV File**:
   - Has headers
   - Has data rows
   - Matches analysis type

3. **Generated Code**:
   - Loads CSV correctly
   - Creates visualizations
   - Performs analysis
   - Includes explanations

4. **Execution**:
   - Runs without errors in Jupyter
   - Produces output in each cell
   - Generates expected charts
   - Provides insights

## Expected Results Summary

| Analysis Type | Expected Charts | Expected ML Models | Typical Cell Count |
| ------------- | --------------- | ------------------ | ------------------ |
| consumers     | 3-5 charts      | Optional           | 6-10 cells         |
| orders        | 4-6 charts      | Rare               | 8-12 cells         |
| products      | 3-4 charts      | Rare               | 6-8 cells          |
| analytics     | 5-8 charts      | Often              | 10-15 cells        |
| custom        | 6-10 charts     | Often              | 12-20 cells        |

## Next Steps After Testing

1. Review generated notebooks
2. Customize descriptions for better results
3. Share notebooks with team
4. Integrate into workflow
5. Schedule regular analyses

## Feedback & Issues

If you encounter issues:

1. Check the error message
2. Verify API key
3. Check logs in terminal
4. Review documentation
5. Try simpler descriptions first
