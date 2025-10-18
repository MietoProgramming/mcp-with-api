import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { ConsumersService } from '../consumers/consumers.service';
import { OrdersService } from '../orders/orders.service';
import { ProductsService } from '../products/products.service';

export interface ConsumerBehaviorScore {
  consumerId: number;
  consumerName: string;
  rfmScore: {
    recency: number; // Days since last order (lower is better)
    frequency: number; // Number of orders
    monetary: number; // Total spent
    recencyScore: number; // 1-5 (5 is best - recent purchase)
    frequencyScore: number; // 1-5 (5 is best - frequent buyer)
    monetaryScore: number; // 1-5 (5 is best - high spender)
    totalScore: number; // Sum of scores (max 15)
  };
  purchasePattern: {
    averageDaysBetweenOrders: number;
    preferredCategories: string[];
    averageOrderValue: number;
    orderStatusDistribution: Record<string, number>;
  };
  reorderPrediction: {
    probability: number; // 0-1 probability of reordering
    confidence: string; // 'high' | 'medium' | 'low'
    expectedDaysUntilNextOrder: number;
    riskOfChurn: string; // 'high' | 'medium' | 'low'
  };
}

export interface PredictionSummary {
  totalConsumers: number;
  highProbabilityReorders: number; // >70% probability
  mediumProbabilityReorders: number; // 40-70%
  lowProbabilityReorders: number; // <40%
  averageReorderProbability: number;
  topPredictedConsumers: Array<{
    consumerId: number;
    name: string;
    probability: number;
  }>;
}

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(
    @Inject(forwardRef(() => OrdersService))
    private ordersService: OrdersService,
    @Inject(forwardRef(() => ConsumersService))
    private consumersService: ConsumersService,
    @Inject(forwardRef(() => ProductsService))
    private productsService: ProductsService,
  ) {
    this.logger.log('Initializing Analytics Service');
  }

  /**
   * Calculate RFM (Recency, Frequency, Monetary) score for a consumer
   */
  private calculateRFMScore(
    consumerId: number,
  ): ConsumerBehaviorScore['rfmScore'] {
    const consumerOrders = this.ordersService.findByConsumer(consumerId);
    const consumer = this.consumersService.findOne(consumerId);

    if (!consumer || consumerOrders.length === 0) {
      return {
        recency: 999,
        frequency: 0,
        monetary: 0,
        recencyScore: 1,
        frequencyScore: 1,
        monetaryScore: 1,
        totalScore: 3,
      };
    }

    // Calculate Recency (days since last order)
    const now = new Date();
    const lastOrderDate = new Date(
      Math.max(
        ...consumerOrders.map((order) => new Date(order.orderDate).getTime()),
      ),
    );
    const recency = Math.floor(
      (now.getTime() - lastOrderDate.getTime()) / (1000 * 60 * 60 * 24),
    );

    // Calculate Frequency
    const frequency = consumerOrders.length;

    // Calculate Monetary
    const monetary = consumer.totalSpent;

    // Score Recency (1-5, where 5 is most recent)
    let recencyScore = 5;
    if (recency > 180) recencyScore = 1;
    else if (recency > 90) recencyScore = 2;
    else if (recency > 60) recencyScore = 3;
    else if (recency > 30) recencyScore = 4;

    // Score Frequency (1-5, where 5 is most frequent)
    let frequencyScore = 1;
    if (frequency >= 50) frequencyScore = 5;
    else if (frequency >= 30) frequencyScore = 4;
    else if (frequency >= 15) frequencyScore = 3;
    else if (frequency >= 5) frequencyScore = 2;

    // Score Monetary (1-5, where 5 is highest spender)
    let monetaryScore = 1;
    if (monetary >= 5000) monetaryScore = 5;
    else if (monetary >= 2500) monetaryScore = 4;
    else if (monetary >= 1000) monetaryScore = 3;
    else if (monetary >= 500) monetaryScore = 2;

    const totalScore = recencyScore + frequencyScore + monetaryScore;

    return {
      recency,
      frequency,
      monetary,
      recencyScore,
      frequencyScore,
      monetaryScore,
      totalScore,
    };
  }

  /**
   * Analyze purchase patterns for a consumer
   */
  private analyzePurchasePattern(
    consumerId: number,
  ): ConsumerBehaviorScore['purchasePattern'] {
    const consumerOrders = this.ordersService.findByConsumer(consumerId);
    const consumer = this.consumersService.findOne(consumerId);

    if (!consumer || consumerOrders.length === 0) {
      return {
        averageDaysBetweenOrders: 0,
        preferredCategories: [],
        averageOrderValue: 0,
        orderStatusDistribution: {},
      };
    }

    // Calculate average days between orders
    const orderDates = consumerOrders
      .map((order) => new Date(order.orderDate).getTime())
      .sort((a, b) => a - b);

    let totalDaysBetween = 0;
    for (let i = 1; i < orderDates.length; i++) {
      totalDaysBetween +=
        (orderDates[i] - orderDates[i - 1]) / (1000 * 60 * 60 * 24);
    }
    const averageDaysBetweenOrders =
      orderDates.length > 1 ? totalDaysBetween / (orderDates.length - 1) : 0;

    // Find preferred categories
    const categoryCount: Record<string, number> = {};
    consumerOrders.forEach((order) => {
      const product = this.productsService.findOne(order.productId);
      if (product) {
        categoryCount[product.category] =
          (categoryCount[product.category] || 0) + 1;
      }
    });

    const preferredCategories = Object.entries(categoryCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map((entry) => entry[0]);

    // Calculate average order value
    const averageOrderValue =
      consumerOrders.length > 0
        ? consumer.totalSpent / consumerOrders.length
        : 0;

    // Order status distribution
    const orderStatusDistribution: Record<string, number> = {};
    consumerOrders.forEach((order) => {
      orderStatusDistribution[order.status] =
        (orderStatusDistribution[order.status] || 0) + 1;
    });

    return {
      averageDaysBetweenOrders,
      preferredCategories,
      averageOrderValue,
      orderStatusDistribution,
    };
  }

  /**
   * Predict reorder probability using multiple factors
   */
  private predictReorderProbability(
    consumerId: number,
    rfmScore: ConsumerBehaviorScore['rfmScore'],
    purchasePattern: ConsumerBehaviorScore['purchasePattern'],
  ): ConsumerBehaviorScore['reorderPrediction'] {
    const consumerOrders = this.ordersService.findByConsumer(consumerId);

    if (consumerOrders.length === 0) {
      return {
        probability: 0,
        confidence: 'low',
        expectedDaysUntilNextOrder: 999,
        riskOfChurn: 'high',
      };
    }

    // Factors influencing reorder probability:
    // 1. RFM Score (40% weight)
    const rfmWeight = (rfmScore.totalScore / 15) * 0.4;

    // 2. Order Frequency Trend (30% weight)
    const frequencyTrend =
      rfmScore.frequency >= 10 ? 0.3 : (rfmScore.frequency / 10) * 0.3;

    // 3. Recency Impact (20% weight)
    const recencyImpact = (rfmScore.recencyScore / 5) * 0.2;

    // 4. Order Success Rate (10% weight)
    const deliveredOrders =
      purchasePattern.orderStatusDistribution['delivered'] || 0;
    const successRate =
      consumerOrders.length > 0 ? deliveredOrders / consumerOrders.length : 0;
    const successWeight = successRate * 0.1;

    // Calculate probability (0-1)
    const probability = Math.min(
      rfmWeight + frequencyTrend + recencyImpact + successWeight,
      0.99,
    );

    // Determine confidence level
    let confidence: 'high' | 'medium' | 'low' = 'low';
    if (consumerOrders.length >= 20) confidence = 'high';
    else if (consumerOrders.length >= 10) confidence = 'medium';

    // Predict expected days until next order
    const expectedDaysUntilNextOrder =
      purchasePattern.averageDaysBetweenOrders > 0
        ? Math.round(purchasePattern.averageDaysBetweenOrders)
        : 30;

    // Calculate churn risk
    let riskOfChurn: 'high' | 'medium' | 'low' = 'low';
    if (
      rfmScore.recency > 90 ||
      rfmScore.recencyScore <= 2 ||
      probability < 0.3
    ) {
      riskOfChurn = 'high';
    } else if (rfmScore.recency > 60 || probability < 0.5) {
      riskOfChurn = 'medium';
    }

    return {
      probability: Math.round(probability * 100) / 100,
      confidence,
      expectedDaysUntilNextOrder,
      riskOfChurn,
    };
  }

  /**
   * Get complete behavior analysis for a consumer
   */
  analyzeConsumerBehavior(consumerId: number): ConsumerBehaviorScore | null {
    this.logger.debug(`Analyzing consumer behavior for ID: ${consumerId}`);

    const consumer = this.consumersService.findOne(consumerId);
    if (!consumer) {
      this.logger.warn(`Consumer not found: ${consumerId}`);
      return null;
    }

    const rfmScore = this.calculateRFMScore(consumerId);
    const purchasePattern = this.analyzePurchasePattern(consumerId);
    const reorderPrediction = this.predictReorderProbability(
      consumerId,
      rfmScore,
      purchasePattern,
    );

    this.logger.log(
      `Consumer ${consumerId} analyzed - Reorder probability: ${(reorderPrediction.probability * 100).toFixed(1)}%, Total score: ${rfmScore.totalScore}`,
    );

    return {
      consumerId,
      consumerName: consumer.name,
      rfmScore,
      purchasePattern,
      reorderPrediction,
    };
  }

  /**
   * Get predictions for all consumers
   */
  getAllConsumerPredictions(): ConsumerBehaviorScore[] {
    this.logger.debug('Getting predictions for all consumers');

    const consumers = this.consumersService.findAll();
    const predictions = consumers
      .map((consumer) => this.analyzeConsumerBehavior(consumer.id))
      .filter((score): score is ConsumerBehaviorScore => score !== null);

    this.logger.log(
      `Generated predictions for ${predictions.length} consumers`,
    );
    return predictions;
  }

  /**
   * Get summary of all predictions
   */
  getPredictionSummary(): PredictionSummary {
    const allPredictions = this.getAllConsumerPredictions();

    const highProbability = allPredictions.filter(
      (p) => p.reorderPrediction.probability > 0.7,
    ).length;
    const mediumProbability = allPredictions.filter(
      (p) =>
        p.reorderPrediction.probability >= 0.4 &&
        p.reorderPrediction.probability <= 0.7,
    ).length;
    const lowProbability = allPredictions.filter(
      (p) => p.reorderPrediction.probability < 0.4,
    ).length;

    const averageReorderProbability =
      allPredictions.length > 0
        ? allPredictions.reduce(
            (sum, p) => sum + p.reorderPrediction.probability,
            0,
          ) / allPredictions.length
        : 0;

    const topPredictedConsumers = allPredictions
      .sort(
        (a, b) =>
          b.reorderPrediction.probability - a.reorderPrediction.probability,
      )
      .slice(0, 10)
      .map((p) => ({
        consumerId: p.consumerId,
        name: p.consumerName,
        probability: p.reorderPrediction.probability,
      }));

    return {
      totalConsumers: allPredictions.length,
      highProbabilityReorders: highProbability,
      mediumProbabilityReorders: mediumProbability,
      lowProbabilityReorders: lowProbability,
      averageReorderProbability:
        Math.round(averageReorderProbability * 100) / 100,
      topPredictedConsumers,
    };
  }

  /**
   * Get consumers at risk of churning
   */
  getChurnRiskConsumers(): ConsumerBehaviorScore[] {
    const allPredictions = this.getAllConsumerPredictions();
    return allPredictions
      .filter((p) => p.reorderPrediction.riskOfChurn === 'high')
      .sort((a, b) => a.rfmScore.recency - b.rfmScore.recency);
  }

  /**
   * Get high-value consumers likely to reorder
   */
  getHighValueReorderCandidates(): ConsumerBehaviorScore[] {
    const allPredictions = this.getAllConsumerPredictions();
    return allPredictions
      .filter(
        (p) =>
          p.reorderPrediction.probability > 0.6 &&
          p.rfmScore.monetaryScore >= 4,
      )
      .sort(
        (a, b) =>
          b.reorderPrediction.probability - a.reorderPrediction.probability,
      );
  }
}
