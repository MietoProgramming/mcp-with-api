import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('consumer/:id')
  getConsumerBehavior(@Param('id', ParseIntPipe) id: number) {
    const analysis = this.analyticsService.analyzeConsumerBehavior(id);
    if (!analysis) {
      throw new NotFoundException(`Consumer with ID ${id} not found`);
    }
    return analysis;
  }

  @Get('predictions')
  getAllPredictions() {
    return this.analyticsService.getAllConsumerPredictions();
  }

  @Get('summary')
  getPredictionSummary() {
    return this.analyticsService.getPredictionSummary();
  }

  @Get('churn-risk')
  getChurnRiskConsumers() {
    return this.analyticsService.getChurnRiskConsumers();
  }

  @Get('high-value-candidates')
  getHighValueReorderCandidates() {
    return this.analyticsService.getHighValueReorderCandidates();
  }
}
