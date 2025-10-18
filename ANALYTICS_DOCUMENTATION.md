# Consumer Behavior Analytics & Prediction

## Overview

The Analytics module provides advanced consumer behavior analysis and reorder prediction capabilities using RFM (Recency, Frequency, Monetary) scoring and machine learning-inspired algorithms.

## Prediction Algorithm

### RFM Score Calculation

The system calculates a **3-dimensional RFM score** for each consumer:

#### 1. Recency (R) - Days since last order

- **Score 5**: 0-30 days (Very Recent)
- **Score 4**: 31-60 days (Recent)
- **Score 3**: 61-90 days (Moderate)
- **Score 2**: 91-180 days (Aging)
- **Score 1**: 180+ days (At Risk)

#### 2. Frequency (F) - Number of orders

- **Score 5**: 50+ orders (Super Loyal)
- **Score 4**: 30-49 orders (Very Loyal)
- **Score 3**: 15-29 orders (Loyal)
- **Score 2**: 5-14 orders (Regular)
- **Score 1**: 1-4 orders (New/Occasional)

#### 3. Monetary (M) - Total spent

- **Score 5**: $5000+ (VIP)
- **Score 4**: $2500-$4999 (High Value)
- **Score 3**: $1000-$2499 (Medium Value)
- **Score 2**: $500-$999 (Low Value)
- **Score 1**: $0-$499 (Minimal Value)

**Total RFM Score**: Sum of R + F + M (range: 3-15)

### Reorder Probability Prediction

The reorder probability is calculated using a **weighted scoring model**:

```
Probability = (RFM_Weight × 40%) + (Frequency_Trend × 30%) + (Recency_Impact × 20%) + (Success_Rate × 10%)
```

**Factors:**

1. **RFM Weight (40%)**: `(Total RFM Score / 15) × 0.4`
   - Higher RFM scores indicate better engagement

2. **Frequency Trend (30%)**: `(Order Count / 10) × 0.3`
   - Capped at 30% for 10+ orders
   - Measures buying habit strength

3. **Recency Impact (20%)**: `(Recency Score / 5) × 0.2`
   - Recent activity strongly indicates likelihood to return

4. **Success Rate (10%)**: `(Delivered Orders / Total Orders) × 0.1`
   - Order fulfillment success impacts trust and retention

**Result**: Probability value between 0 and 1 (0% to 100%)

### Confidence Levels

Prediction confidence based on data availability:

- **High Confidence**: 20+ orders (substantial purchase history)
- **Medium Confidence**: 10-19 orders (moderate history)
- **Low Confidence**: <10 orders (limited data)

### Churn Risk Assessment

Consumers are flagged for churn risk based on:

- **High Risk**:
  - 90+ days since last order, OR
  - Recency score ≤ 2, OR
  - Reorder probability < 30%

- **Medium Risk**:
  - 60-90 days since last order, OR
  - Reorder probability 30-50%

- **Low Risk**:
  - Recent activity (<60 days)
  - Reorder probability > 50%

### Expected Days Until Next Order

Calculated from historical purchase patterns:

```
Average Days Between Orders = Total Days Span / (Number of Orders - 1)
```

## API Endpoints

### 1. Analyze Consumer Behavior

```
GET /api/analytics/consumer/:id
```

Returns complete behavior analysis for a consumer:

- RFM scores with raw metrics
- Purchase patterns (average order value, preferred categories)
- Reorder prediction with probability
- Churn risk assessment

**Example Response:**

```json
{
  "consumerId": 42,
  "consumerName": "John Doe",
  "rfmScore": {
    "recency": 15,
    "frequency": 35,
    "monetary": 3250.75,
    "recencyScore": 5,
    "frequencyScore": 4,
    "monetaryScore": 4,
    "totalScore": 13
  },
  "purchasePattern": {
    "averageDaysBetweenOrders": 12,
    "preferredCategories": ["Electronics", "Home", "Sports"],
    "averageOrderValue": 92.88,
    "orderStatusDistribution": {
      "delivered": 30,
      "shipped": 3,
      "processing": 2
    }
  },
  "reorderPrediction": {
    "probability": 0.82,
    "confidence": "high",
    "expectedDaysUntilNextOrder": 12,
    "riskOfChurn": "low"
  }
}
```

### 2. Get All Predictions

```
GET /api/analytics/predictions
```

Returns behavior analysis for **all consumers** (array of consumer analyses).

### 3. Get Prediction Summary

```
GET /api/analytics/summary
```

Provides aggregate statistics:

```json
{
  "totalConsumers": 100,
  "highProbabilityReorders": 35,
  "mediumProbabilityReorders": 42,
  "lowProbabilityReorders": 23,
  "averageReorderProbability": 0.58,
  "topPredictedConsumers": [
    {
      "consumerId": 5,
      "name": "Alice Smith",
      "probability": 0.95
    }
  ]
}
```

**Probability Segments:**

- **High**: >70% probability
- **Medium**: 40-70% probability
- **Low**: <40% probability

### 4. Get Churn Risk Consumers

```
GET /api/analytics/churn-risk
```

Returns consumers at **high risk of churning**, sorted by recency (most at-risk first).

### 5. Get High-Value Reorder Candidates

```
GET /api/analytics/high-value-candidates
```

Returns **high-spending consumers** (monetary score ≥ 4) with >60% reorder probability, sorted by probability.

## MCP Tools

The MCP server now includes **5 analytics tools**:

### 1. `analyze-consumer-behavior`

**Input:** `consumerId` (number)  
**Purpose:** Predict reorder probability for a specific consumer  
**Use Case:** "What's the likelihood that consumer 42 will order again?"

### 2. `get-all-predictions`

**Input:** None  
**Purpose:** Get predictions for all consumers  
**Use Case:** "Show me reorder predictions for everyone"

### 3. `get-prediction-summary`

**Input:** None  
**Purpose:** Get aggregate prediction statistics  
**Use Case:** "How many consumers are likely to reorder?"

### 4. `get-churn-risk-consumers`

**Input:** None  
**Purpose:** Identify consumers at risk of leaving  
**Use Case:** "Who should we target with retention campaigns?"

### 5. `get-high-value-reorder-candidates`

**Input:** None  
**Purpose:** Find high-value consumers likely to reorder  
**Use Case:** "Which top spenders should we market to?"

## Usage Examples

### Example 1: Analyze a Specific Consumer

**Question:** "Analyze consumer 15's behavior and tell me if they'll order again"

**MCP Tool:** `analyze-consumer-behavior`

```json
{
  "consumerId": 15
}
```

**Interpretation:**

- Probability > 0.7: **Very likely to reorder**
- Probability 0.4-0.7: **Moderate likelihood**
- Probability < 0.4: **Unlikely to reorder**

### Example 2: Identify At-Risk Customers

**Question:** "Which customers are we about to lose?"

**MCP Tool:** `get-churn-risk-consumers`

**Action:** Target these consumers with:

- Re-engagement emails
- Special discount offers
- Personalized product recommendations

### Example 3: Plan Marketing Campaign

**Question:** "Who should we target for our premium product launch?"

**MCP Tool:** `get-high-value-reorder-candidates`

**Result:** High-spending consumers with strong reorder likelihood - perfect targets for premium offerings.

### Example 4: Business Intelligence

**Question:** "Give me an overview of our customer retention outlook"

**MCP Tool:** `get-prediction-summary`

**Insights:**

- Overall reorder probability trend
- Distribution of customer engagement levels
- Top customers to prioritize

## Predictive Insights

### Customer Segments

Based on RFM and predictions, consumers fall into segments:

1. **Champions** (R:5, F:5, M:5, P>0.8)
   - Your best customers
   - Action: Reward loyalty, upsell premium products

2. **Loyal Customers** (R:4-5, F:4-5, M:3-4, P>0.6)
   - Regular high-value customers
   - Action: Maintain engagement, cross-sell

3. **At Risk** (R:1-2, F:4-5, M:4-5, P<0.4)
   - Previously valuable, now disengaged
   - Action: Win-back campaigns, surveys

4. **Hibernating** (R:1-2, F:1-2, M:1-2, P<0.3)
   - Dormant customers
   - Action: Reactivation campaigns

5. **New Customers** (R:5, F:1-2, M:1-2, P:varies)
   - Recently acquired
   - Action: Nurture, build relationship

### Business Actions

**High Churn Risk + High Value:**

```
Priority: CRITICAL
Action: Immediate personalized outreach, special offers
```

**High Reorder Probability + High Value:**

```
Priority: HIGH
Action: VIP treatment, exclusive offers, upsell
```

**Low Engagement + Low Value:**

```
Priority: LOW
Action: Automated re-engagement campaigns
```

## Technical Details

### Algorithm Performance

- **Complexity**: O(n) per consumer analysis
- **Data Points**: Analyzes 10,000 orders, 500 products, 100 consumers
- **Calculation Time**: ~10ms per consumer
- **Batch Analysis**: ~1 second for all 100 consumers

### Accuracy Factors

Prediction accuracy improves with:

- More historical orders (>10 orders ideal)
- Longer time span of data
- Consistent ordering patterns
- Higher order success rates

### Limitations

- Cannot predict external factors (economic changes, life events)
- New consumers have low confidence predictions
- Assumes past behavior predicts future behavior
- Does not account for seasonality (yet)

## Future Enhancements

Potential improvements:

1. **Seasonal Adjustment**: Factor in seasonal buying patterns
2. **Product Affinity**: Predict specific product preferences
3. **Time Series Analysis**: Trend detection over time
4. **Cohort Analysis**: Group-based predictions
5. **A/B Testing Integration**: Measure campaign effectiveness
6. **Real-time Updates**: Dynamic recalculation on new orders

---

## Quick Reference

| Metric              | Formula                        | Range           |
| ------------------- | ------------------------------ | --------------- |
| RFM Score           | R + F + M                      | 3-15            |
| Reorder Probability | Weighted average               | 0-1             |
| Confidence          | Based on order count           | low/medium/high |
| Churn Risk          | Based on recency & probability | low/medium/high |

**Tool Count**: 17 total (12 existing + 5 analytics)

**Endpoints**: 5 analytics endpoints added to REST API
