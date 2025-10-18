import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createObjectCsvWriter } from 'csv-writer';
import { mkdir, writeFile } from 'fs/promises';
import OpenAI from 'openai';
import { join } from 'path';
import {
  AnalyticsService,
  ConsumerBehaviorScore,
} from '../analytics/analytics.service';
import { ConsumersService } from '../consumers/consumers.service';
import { OrdersService } from '../orders/orders.service';
import { ProductsService } from '../products/products.service';

export interface AnalysisRequest {
  analysisType: 'consumers' | 'orders' | 'products' | 'analytics' | 'custom';
  description: string;
  filters?: Record<string, any>;
}

export interface AnalysisResult {
  notebookPath: string;
  csvPath: string;
  analysisDescription: string;
  generatedCode: string;
}

@Injectable()
export class AiAnalysisService {
  private readonly logger = new Logger(AiAnalysisService.name);
  private openai: OpenAI;
  private outputDir = join(process.cwd(), 'generated-analysis');

  constructor(
    private configService: ConfigService,
    private consumersService: ConsumersService,
    private ordersService: OrdersService,
    private productsService: ProductsService,
    private analyticsService: AnalyticsService,
  ) {
    // Initialize OpenAI client with OpenRouter configuration
    const apiKey = this.configService.get<string>('OPENROUTER_API_KEY', '');
    this.logger.log('Initializing AI Analysis Service');
    this.logger.debug(`Output directory: ${this.outputDir}`);

    this.openai = new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: apiKey,
    });

    if (!apiKey) {
      this.logger.warn(
        'OPENROUTER_API_KEY is not set. AI analysis will not work.',
      );
    } else {
      this.logger.log('OpenRouter API client initialized successfully');
    }
  }

  /**
   * Generate a Python notebook for data analysis using AI
   */
  async generateAnalysis(request: AnalysisRequest): Promise<AnalysisResult> {
    this.logger.log(
      `Starting analysis generation for type: ${request.analysisType}`,
    );
    this.logger.debug(`Analysis description: ${request.description}`);

    try {
      // Step 1: Get the data based on analysis type
      this.logger.debug(`Fetching ${request.analysisType} data...`);
      const data = this.getAnalysisData(request);
      this.logger.log(`Retrieved ${data.length} records for analysis`);

      // Step 2: Generate CSV file with the data
      this.logger.debug('Generating CSV file...');
      const csvPath = await this.createCsvFile(request.analysisType, data);
      this.logger.log(`CSV file created: ${csvPath}`);

      // Step 3: Request AI to generate Python notebook code
      this.logger.log('Requesting AI to generate notebook code...');
      const generatedCode = await this.generateNotebookCode(request, data);
      this.logger.log(
        `Generated code length: ${generatedCode.length} characters`,
      );

      // Step 4: Create the Jupyter notebook file
      this.logger.debug('Creating notebook file...');
      const notebookPath = await this.createNotebookFile(
        request.analysisType,
        generatedCode,
        csvPath,
      );
      this.logger.log(`Notebook created: ${notebookPath}`);

      this.logger.log('Analysis generation completed successfully');
      return {
        notebookPath,
        csvPath,
        analysisDescription: request.description,
        generatedCode,
      };
    } catch (error) {
      this.logger.error('Failed to generate analysis', error);
      throw error;
    }
  }

  /**
   * Get data based on the analysis type
   */
  private getAnalysisData(
    request: AnalysisRequest,
  ): Record<string, string | number | Date>[] {
    this.logger.debug(
      `Getting data for analysis type: ${request.analysisType}`,
    );
    const data: Record<string, string | number | Date>[] = [];

    switch (request.analysisType) {
      case 'consumers': {
        this.logger.debug('Fetching consumer data...');
        const consumers = this.consumersService.findAll();
        this.logger.debug(`Found ${consumers.length} consumers`);
        return consumers.map((c) => ({
          id: c.id,
          name: c.name,
          email: c.email,
          phone: c.phone,
          address: c.address,
          registeredAt: c.registeredAt.toISOString(),
          totalOrders: c.totalOrders,
          totalSpent: c.totalSpent,
        }));
      }

      case 'orders': {
        const orders = this.ordersService.findAll();
        return orders.map((o) => {
          const consumer = this.consumersService.findOne(o.consumerId);
          const product = this.productsService.findOne(o.productId);
          return {
            id: o.id,
            consumerId: o.consumerId,
            consumerName: consumer?.name || 'Unknown',
            productId: o.productId,
            productName: product?.name || 'Unknown',
            productCategory: product?.category || 'Unknown',
            quantity: o.quantity,
            totalPrice: o.totalPrice,
            status: o.status,
            orderDate: o.orderDate.toISOString(),
          };
        });
      }

      case 'products': {
        const products = this.productsService.findAll();
        return products.map((p) => ({
          id: p.id,
          name: p.name,
          description: p.description,
          price: p.price,
          category: p.category,
          stock: p.stock,
        }));
      }

      case 'analytics': {
        // Get all predictions for comprehensive analysis
        const predictions: ConsumerBehaviorScore[] =
          this.analyticsService.getAllConsumerPredictions();
        return predictions.map((p) => ({
          consumerId: p.consumerId,
          consumerName: p.consumerName,
          recency: p.rfmScore.recency,
          frequency: p.rfmScore.frequency,
          monetary: p.rfmScore.monetary,
          recencyScore: p.rfmScore.recencyScore,
          frequencyScore: p.rfmScore.frequencyScore,
          monetaryScore: p.rfmScore.monetaryScore,
          totalScore: p.rfmScore.totalScore,
          avgDaysBetweenOrders: p.purchasePattern.averageDaysBetweenOrders,
          avgOrderValue: p.purchasePattern.averageOrderValue,
          reorderProbability: p.reorderPrediction.probability,
          confidence: p.reorderPrediction.confidence,
          expectedDaysUntilNextOrder:
            p.reorderPrediction.expectedDaysUntilNextOrder,
          churnRisk: p.reorderPrediction.riskOfChurn,
          preferredCategories: p.purchasePattern.preferredCategories.join(', '),
        }));
      }

      case 'custom': {
        // For custom analysis, combine multiple data sources
        const allOrders = this.ordersService.findAll();
        return allOrders.map((o) => {
          const consumer = this.consumersService.findOne(o.consumerId);
          const product = this.productsService.findOne(o.productId);
          return {
            orderId: o.id,
            consumerId: o.consumerId,
            consumerName: consumer?.name || 'Unknown',
            consumerAddress: consumer?.address || 'Unknown',
            productId: o.productId,
            productName: product?.name || 'Unknown',
            productCategory: product?.category || 'Unknown',
            productPrice: product?.price || 0,
            quantity: o.quantity,
            totalPrice: o.totalPrice,
            status: o.status,
            orderDate: o.orderDate.toISOString(),
          };
        });
      }

      default:
        throw new BadRequestException('Invalid analysis type');
    }

    return data;
  }

  /**
   * Create CSV file with the data
   */
  private async createCsvFile(
    analysisType: string,
    data: Record<string, any>[],
  ): Promise<string> {
    this.logger.debug(`Creating CSV file for ${analysisType} analysis`);

    // Ensure output directory exists
    await mkdir(this.outputDir, { recursive: true });
    this.logger.debug(`Output directory ensured: ${this.outputDir}`);

    const timestamp = Date.now();
    const filename = `${analysisType}_data_${timestamp}.csv`;
    const filepath = join(this.outputDir, filename);

    // Get headers from first data item
    if (data.length === 0) {
      this.logger.error('No data available for CSV creation');
      throw new BadRequestException('No data available for analysis');
    }

    const headers = Object.keys(data[0]).map((key) => ({
      id: key,
      title: key,
    }));
    this.logger.debug(`CSV headers: ${headers.map((h) => h.id).join(', ')}`);

    const csvWriter = createObjectCsvWriter({
      path: filepath,
      header: headers,
    });

    await csvWriter.writeRecords(data);
    this.logger.log(`CSV file written: ${filename} (${data.length} records)`);
    return filepath;
  }

  /**
   * Generate Python notebook code using OpenRouter AI
   */
  private async generateNotebookCode(
    request: AnalysisRequest,
    data: Record<string, any>[],
  ): Promise<string> {
    this.logger.log('Preparing prompt for AI code generation');

    // Prepare sample of data for context (first 3 rows)
    const dataSample = data.slice(0, 3);
    const columns = Object.keys(data[0]);
    this.logger.debug(`Data columns: ${columns.join(', ')}`);
    this.logger.debug(`Sample data rows: ${dataSample.length}`);

    const prompt = `You are a data science expert. Generate Python code for a Jupyter notebook that performs comprehensive data analysis.

**Analysis Request:** ${request.description}

**Data Type:** ${request.analysisType}

**Available Columns:** ${columns.join(', ')}

**Sample Data (first 3 rows):**
${JSON.stringify(dataSample, null, 2)}

**Requirements:**
1. The CSV file will be in the same directory as the notebook with a dynamic filename
2. Use pandas to load and analyze the data
3. Create meaningful visualizations (matplotlib, seaborn, plotly)
4. Generate statistical insights and summaries
5. Include data cleaning and preprocessing steps
6. Add appropriate heat maps for correlations
7. Create relevant charts (bar, line, scatter, distribution plots)
8. Apply machine learning models if relevant (scikit-learn)
9. Add markdown cells with explanations
10. Use the relative path './data.csv' to load the CSV file

**Important:**
- Return ONLY executable Python code cells separated by '###CELL###' marker
- Each code cell should be complete and runnable
- Include necessary imports at the beginning
- Add comments explaining each analysis step
- Make the analysis relevant to ${request.analysisType} data
- Ensure all code is production-ready and handles edge cases

Format your response as:
###CELL###
# Markdown content explaining the section
###CELL###
import pandas as pd
# Python code here
###CELL###
# Next markdown explanation
###CELL###
# Next Python code
...and so on`;

    this.logger.debug(`Prompt length: ${prompt.length} characters`);

    try {
      this.logger.log('Sending request to OpenRouter API...');
      const startTime = Date.now();

      const completion = await this.openai.chat.completions.create({
        model: 'qwen/qwen3-coder:free',
        messages: [
          {
            role: 'system',
            content:
              'You are an expert data scientist who creates professional Jupyter notebooks for data analysis. Generate clean, well-documented Python code.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 4000,
      });

      const duration = Date.now() - startTime;
      this.logger.log(`AI response received in ${duration}ms`);

      const generatedCode =
        completion.choices[0]?.message?.content || 'No code generated';

      this.logger.log(`Generated code: ${generatedCode.length} characters`);
      this.logger.debug(
        `Code cells count: ${(generatedCode.match(/###CELL###/g) || []).length}`,
      );

      return generatedCode;
    } catch (error: unknown) {
      this.logger.error('OpenRouter API request failed', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new BadRequestException(`Failed to generate code: ${errorMessage}`);
    }
  }

  /**
   * Create Jupyter notebook file
   */
  private async createNotebookFile(
    analysisType: string,
    generatedCode: string,
    csvPath: string,
  ): Promise<string> {
    this.logger.debug('Creating Jupyter notebook file');

    const timestamp = Date.now();
    const filename = `${analysisType}_analysis_${timestamp}.ipynb`;
    const filepath = join(this.outputDir, filename);
    this.logger.debug(`Notebook path: ${filepath}`);

    // Parse the generated code into cells
    this.logger.debug('Parsing code into notebook cells');
    const cells = this.parseCodeIntoCells(generatedCode, csvPath);
    this.logger.debug(`Created ${cells.length} notebook cells`);

    // Create notebook structure
    const notebook = {
      cells,
      metadata: {
        kernelspec: {
          display_name: 'Python 3',
          language: 'python',
          name: 'python3',
        },
        language_info: {
          codemirror_mode: {
            name: 'ipython',
            version: 3,
          },
          file_extension: '.py',
          mimetype: 'text/x-python',
          name: 'python',
          nbconvert_exporter: 'python',
          pygments_lexer: 'ipython3',
          version: '3.8.0',
        },
      },
      nbformat: 4,
      nbformat_minor: 4,
    };

    this.logger.debug('Writing notebook file to disk');
    await writeFile(filepath, JSON.stringify(notebook, null, 2));
    this.logger.log(`Notebook file created successfully: ${filename}`);

    return filepath;
  }

  /**
   * Parse generated code into notebook cells
   */
  private parseCodeIntoCells(
    generatedCode: string,
    csvPath: string,
  ): Array<any> {
    const cells: Array<any> = [];

    // Add initial setup cell with CSV path
    const csvFilename = csvPath.split('\\').pop() || csvPath.split('/').pop();
    cells.push({
      cell_type: 'markdown',
      metadata: {},
      source: [
        '# Data Analysis Notebook\n',
        '\n',
        `This notebook analyzes data from: **${csvFilename}**\n`,
        '\n',
        'Generated automatically by AI-powered analysis system.',
      ],
    });

    // Split by cell marker
    const cellContents = generatedCode
      .split('###CELL###')
      .filter((c) => c.trim());

    for (const content of cellContents) {
      const trimmed = content.trim();
      if (!trimmed) continue;

      // Determine if it's markdown or code
      const isMarkdown =
        trimmed.startsWith('#') &&
        !trimmed.includes('import') &&
        !trimmed.includes('=') &&
        trimmed.split('\n').length < 5;

      if (isMarkdown) {
        cells.push({
          cell_type: 'markdown',
          metadata: {},
          source: trimmed.split('\n').map((line) => line + '\n'),
        });
      } else {
        // Replace placeholder CSV path with actual relative path
        let codeContent = trimmed.replace(
          /['"]\.\/data\.csv['"]/g,
          `'./${csvFilename}'`,
        );
        codeContent = codeContent.replace(
          /pd\.read_csv\([^)]+\)/g,
          `pd.read_csv('./${csvFilename}')`,
        );

        cells.push({
          cell_type: 'code',
          execution_count: null,
          metadata: {},
          outputs: [],
          source: codeContent.split('\n').map((line) => line + '\n'),
        });
      }
    }

    // Add final summary cell if no cells were generated
    if (cells.length === 1) {
      cells.push({
        cell_type: 'code',
        execution_count: null,
        metadata: {},
        outputs: [],
        source: [
          'import pandas as pd\n',
          'import matplotlib.pyplot as plt\n',
          'import seaborn as sns\n',
          '\n',
          `# Load the data\n`,
          `df = pd.read_csv('./${csvFilename}')\n`,
          '\n',
          '# Display basic information\n',
          'print("Dataset Shape:", df.shape)\n',
          'print("\\nColumn Names:", df.columns.tolist())\n',
          'print("\\nFirst Few Rows:")\n',
          'df.head()\n',
        ],
      });
    }

    return cells;
  }

  /**
   * List all generated analyses
   */
  async listGeneratedAnalyses(): Promise<string[]> {
    try {
      const fs = await import('fs/promises');
      const files = await fs.readdir(this.outputDir);
      return files.filter((f) => f.endsWith('.ipynb') || f.endsWith('.csv'));
    } catch {
      return [];
    }
  }
}
