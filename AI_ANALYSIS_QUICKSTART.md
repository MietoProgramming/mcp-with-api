# AI Data Analysis - Quick Start Guide

## 🚀 5-Minute Setup

### Step 1: Get API Key (2 minutes)

1. Go to https://openrouter.ai/
2. Sign up (free)
3. Visit https://openrouter.ai/keys
4. Click "Create Key"
5. Copy your key

### Step 2: Configure (1 minute)

Create `.env` file in project root:

```env
OPENROUTER_API_KEY=sk-or-v1-your-key-here
```

### Step 3: Start Server (1 minute)

```bash
yarn start:dev
```

### Step 4: Generate Analysis (1 minute)

```bash
curl -X POST http://localhost:3000/ai-analysis/generate ^
  -H "Content-Type: application/json" ^
  -d "{\"analysisType\": \"consumers\", \"description\": \"Analyze consumer spending patterns and create visualizations\"}"
```

## 📊 Example Requests

### Consumer Analysis

```bash
curl -X POST http://localhost:3000/ai-analysis/generate ^
  -H "Content-Type: application/json" ^
  -d "{\"analysisType\": \"consumers\", \"description\": \"Identify high-value customers and create spending heat maps\"}"
```

### Sales Trends

```bash
curl -X POST http://localhost:3000/ai-analysis/generate ^
  -H "Content-Type: application/json" ^
  -d "{\"analysisType\": \"orders\", \"description\": \"Show sales trends over time with line charts and identify peak periods\"}"
```

### ML Predictions

```bash
curl -X POST http://localhost:3000/ai-analysis/generate ^
  -H "Content-Type: application/json" ^
  -d "{\"analysisType\": \"analytics\", \"description\": \"Predict customer churn using machine learning and RFM analysis\"}"
```

## 📁 Find Your Files

After generating, files are in:

```
generated-analysis/
  ├── consumers_analysis_[timestamp].ipynb  ← Open this in Jupyter
  └── consumers_data_[timestamp].csv        ← Data file
```

## 🐍 Run the Notebook

### Install Python Packages

```bash
pip install pandas matplotlib seaborn plotly scikit-learn jupyter
```

### Start Jupyter

```bash
cd generated-analysis
jupyter notebook
```

### Run Analysis

1. Click on the `.ipynb` file
2. Select "Kernel" → "Restart & Run All"
3. View your analysis!

## 💡 Tips

**Best results when you:**

- ✅ Be specific in descriptions
- ✅ Mention desired visualizations
- ✅ Specify ML models if needed
- ✅ Include analysis goals

**Example good description:**

```
"Perform customer segmentation using K-means clustering,
create scatter plots of RFM scores, identify top 10
high-value customers, and predict churn probability"
```

## 🔍 Available Analysis Types

| Type        | Data Analyzed     | Use For                |
| ----------- | ----------------- | ---------------------- |
| `consumers` | Customer info     | Demographics, spending |
| `orders`    | Transaction data  | Sales trends, revenue  |
| `products`  | Product catalog   | Inventory, pricing     |
| `analytics` | RFM + predictions | ML models, churn       |
| `custom`    | All combined      | Complex insights       |

## 🎯 What You Get

Each notebook includes:

- 📊 **Multiple charts** (bar, line, scatter, heatmaps)
- 📈 **Statistical analysis** (means, correlations, distributions)
- 🤖 **ML models** (if relevant to your description)
- 📝 **Explanations** (markdown cells describing insights)
- ✅ **Ready to run** (all code is executable)

## ❓ Troubleshooting

**Error: Unauthorized**
→ Check your `.env` file has the correct API key

**No data available**
→ Restart server (data generates on startup)

**Notebook errors**
→ Install Python packages: `pip install pandas matplotlib seaborn`

**Can't find files**
→ Check `generated-analysis/` folder in project root

## 📚 More Info

- Full docs: `AI_ANALYSIS_DOCUMENTATION.md`
- API reference: `API_DOCUMENTATION.md`
- OpenRouter docs: https://openrouter.ai/docs
