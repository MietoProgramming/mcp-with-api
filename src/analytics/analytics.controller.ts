import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';

@ApiTags('analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('consumer/:id')
  @ApiOperation({
    summary: 'Analyze consumer behavior and predict reorder probability',
  })
  @ApiParam({ name: 'id', description: 'Consumer ID' })
  @ApiResponse({
    status: 200,
    description: 'Consumer behavior analysis with reorder prediction',
  })
  @ApiResponse({ status: 404, description: 'Consumer not found' })
  getConsumerBehavior(@Param('id', ParseIntPipe) id: number) {
    const analysis = this.analyticsService.analyzeConsumerBehavior(id);
    if (!analysis) {
      throw new NotFoundException(`Consumer with ID ${id} not found`);
    }
    return analysis;
  }

  @Get('predictions')
  @ApiOperation({
    summary: 'Get reorder predictions for all consumers',
  })
  @ApiResponse({
    status: 200,
    description: 'List of consumer predictions',
  })
  getAllPredictions() {
    return this.analyticsService.getAllConsumerPredictions();
  }

  @Get('summary')
  @ApiOperation({
    summary: 'Get summary of reorder predictions',
  })
  @ApiResponse({
    status: 200,
    description: 'Prediction summary with statistics',
  })
  getPredictionSummary() {
    return this.analyticsService.getPredictionSummary();
  }

  @Get('churn-risk')
  @ApiOperation({
    summary: 'Get consumers at high risk of churning',
  })
  @ApiResponse({
    status: 200,
    description: 'List of consumers with high churn risk',
  })
  getChurnRiskConsumers() {
    return this.analyticsService.getChurnRiskConsumers();
  }

  @Get('high-value-candidates')
  @ApiOperation({
    summary: 'Get high-value consumers likely to reorder',
  })
  @ApiResponse({
    status: 200,
    description: 'List of high-value reorder candidates',
  })
  getHighValueReorderCandidates() {
    return this.analyticsService.getHighValueReorderCandidates();
  }
}
