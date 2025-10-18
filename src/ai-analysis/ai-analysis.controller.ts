import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';
import {
  AiAnalysisService,
  AnalysisRequest,
  AnalysisResult,
} from './ai-analysis.service';

@Controller('ai-analysis')
export class AiAnalysisController {
  constructor(private readonly aiAnalysisService: AiAnalysisService) {}

  /**
   * Generate a data analysis notebook using AI
   *
   * POST /ai-analysis/generate
   *
   * Body:
   * {
   *   "analysisType": "consumers" | "orders" | "products" | "analytics" | "custom",
   *   "description": "What analysis you want to perform",
   *   "filters": {} // optional
   * }
   *
   * Example:
   * {
   *   "analysisType": "consumers",
   *   "description": "Analyze consumer behavior patterns, identify high-value customers, and predict churn risk"
   * }
   */
  @Post('generate')
  async generateAnalysis(
    @Body() request: AnalysisRequest,
  ): Promise<AnalysisResult> {
    if (!request.analysisType || !request.description) {
      throw new BadRequestException(
        'analysisType and description are required',
      );
    }

    return this.aiAnalysisService.generateAnalysis(request);
  }

  /**
   * Get list of all generated analysis files
   *
   * GET /ai-analysis/files
   */
  @Get('files')
  async listFiles(): Promise<{ files: string[] }> {
    const files = await this.aiAnalysisService.listGeneratedAnalyses();
    return { files };
  }

  /**
   * Get example analysis requests
   *
   * GET /ai-analysis/examples
   */
  @Get('examples')
  getExamples() {
    return {
      examples: [
        {
          analysisType: 'consumers',
          description:
            'Analyze consumer demographics, spending patterns, and geographical distribution. Create visualizations showing top customers and customer segmentation.',
        },
        {
          analysisType: 'orders',
          description:
            'Analyze order trends over time, identify peak ordering periods, calculate average order values, and show product category popularity.',
        },
        {
          analysisType: 'products',
          description:
            'Analyze product inventory, pricing strategies, category distribution, and identify low-stock products.',
        },
        {
          analysisType: 'analytics',
          description:
            'Perform RFM analysis, predict customer reorder probability, identify high-value customers, and assess churn risk using machine learning models.',
        },
        {
          analysisType: 'custom',
          description:
            'Comprehensive analysis combining all data sources to identify business insights, correlations between customer behavior and product categories, and sales forecasting.',
        },
      ],
    };
  }
}
