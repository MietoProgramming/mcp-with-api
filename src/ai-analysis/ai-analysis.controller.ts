import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  AiAnalysisService,
  AnalysisRequest,
  AnalysisResult,
} from './ai-analysis.service';

@ApiTags('ai-analysis')
@Controller('ai-analysis')
export class AiAnalysisController {
  constructor(private readonly aiAnalysisService: AiAnalysisService) {}

  @Post('generate')
  @ApiOperation({
    summary: 'Generate a data analysis notebook using AI',
    description:
      'Creates a Jupyter notebook with Python code for data analysis based on your requirements',
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['analysisType', 'description'],
      properties: {
        analysisType: {
          type: 'string',
          enum: ['consumers', 'orders', 'products', 'analytics', 'custom'],
          description: 'Type of analysis to perform',
          example: 'consumers',
        },
        description: {
          type: 'string',
          description: 'Detailed description of the analysis you want',
          example:
            'Analyze consumer behavior patterns, identify high-value customers, and predict churn risk',
        },
        filters: {
          type: 'object',
          description: 'Optional filters for the analysis',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Analysis notebook generated successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request - missing required fields',
  })
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

  @Get('files')
  @ApiOperation({
    summary: 'Get list of all generated analysis files',
  })
  @ApiResponse({
    status: 200,
    description: 'List of generated analysis file paths',
  })
  async listFiles(): Promise<{ files: string[] }> {
    const files = await this.aiAnalysisService.listGeneratedAnalyses();
    return { files };
  }

  @Get('examples')
  @ApiOperation({
    summary: 'Get example analysis requests',
    description: 'Returns sample requests for different types of analyses',
  })
  @ApiResponse({
    status: 200,
    description: 'List of example analysis requests',
  })
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
