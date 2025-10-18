import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { AxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class McpService {
  private readonly logger = new Logger(McpService.name);
  private readonly apiBaseUrl: string;

  constructor(private readonly httpService: HttpService) {
    this.apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:3000/api';
    this.logger.log(`API Base URL: ${this.apiBaseUrl}`);
  }

  async handleToolCall(name: string, args: any): Promise<any> {
    try {
      switch (name) {
        // Products
        case 'list-products': {
          const response = await firstValueFrom(
            this.httpService.get(`${this.apiBaseUrl}/products`),
          );
          return this.formatResponse(response.data);
        }

        case 'get-product': {
          const response = await firstValueFrom(
            this.httpService.get(
              `${this.apiBaseUrl}/products/${args.productId}`,
            ),
          );
          return this.formatResponse(response.data);
        }

        case 'filter-products-by-category': {
          const response = await firstValueFrom(
            this.httpService.get(`${this.apiBaseUrl}/products`, {
              params: { category: args.category },
            }),
          );
          return this.formatResponse(response.data);
        }

        // Orders
        case 'list-orders': {
          const response = await firstValueFrom(
            this.httpService.get(`${this.apiBaseUrl}/orders`),
          );
          return this.formatResponse(response.data);
        }

        case 'get-order': {
          const response = await firstValueFrom(
            this.httpService.get(`${this.apiBaseUrl}/orders/${args.orderId}`),
          );
          return this.formatResponse(response.data);
        }

        case 'filter-orders-by-consumer': {
          const response = await firstValueFrom(
            this.httpService.get(`${this.apiBaseUrl}/orders`, {
              params: { consumerId: args.consumerId },
            }),
          );
          return this.formatResponse(response.data);
        }

        case 'filter-orders-by-status': {
          const response = await firstValueFrom(
            this.httpService.get(`${this.apiBaseUrl}/orders`, {
              params: { status: args.status },
            }),
          );
          return this.formatResponse(response.data);
        }

        case 'get-order-statistics': {
          const response = await firstValueFrom(
            this.httpService.get(`${this.apiBaseUrl}/orders/statistics`),
          );
          return this.formatResponse(response.data);
        }

        // Consumers
        case 'list-consumers': {
          const response = await firstValueFrom(
            this.httpService.get(`${this.apiBaseUrl}/consumers`),
          );
          return this.formatResponse(response.data);
        }

        case 'get-consumer': {
          const response = await firstValueFrom(
            this.httpService.get(
              `${this.apiBaseUrl}/consumers/${args.consumerId}`,
            ),
          );
          return this.formatResponse(response.data);
        }

        case 'get-top-consumers': {
          const limit = args.limit || 5;
          const response = await firstValueFrom(
            this.httpService.get(`${this.apiBaseUrl}/consumers/top`, {
              params: { limit },
            }),
          );
          return this.formatResponse(response.data);
        }

        case 'get-consumer-statistics': {
          const response = await firstValueFrom(
            this.httpService.get(
              `${this.apiBaseUrl}/consumers/${args.consumerId}/statistics`,
            ),
          );
          return this.formatResponse(response.data);
        }

        // Analytics
        case 'analyze-consumer-behavior': {
          const response = await firstValueFrom(
            this.httpService.get(
              `${this.apiBaseUrl}/analytics/consumer/${args.consumerId}`,
            ),
          );
          return this.formatResponse(response.data);
        }

        case 'get-all-predictions': {
          const response = await firstValueFrom(
            this.httpService.get(`${this.apiBaseUrl}/analytics/predictions`),
          );
          return this.formatResponse(response.data);
        }

        case 'get-prediction-summary': {
          const response = await firstValueFrom(
            this.httpService.get(`${this.apiBaseUrl}/analytics/summary`),
          );
          return this.formatResponse(response.data);
        }

        case 'get-churn-risk-consumers': {
          const response = await firstValueFrom(
            this.httpService.get(`${this.apiBaseUrl}/analytics/churn-risk`),
          );
          return this.formatResponse(response.data);
        }

        case 'get-high-value-reorder-candidates': {
          const response = await firstValueFrom(
            this.httpService.get(
              `${this.apiBaseUrl}/analytics/high-value-candidates`,
            ),
          );
          return this.formatResponse(response.data);
        }

        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    } catch (error) {
      return this.handleError(error);
    }
  }

  private formatResponse(data: any): any {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  }

  private handleError(error: any): any {
    if (error.isAxiosError || error instanceof AxiosError) {
      const axiosError = error as AxiosError;
      const status = axiosError.response?.status;
      const message =
        (axiosError.response?.data as any)?.message || axiosError.message;
      this.logger.error(`API Error (${status}): ${message}`);
      return {
        content: [
          {
            type: 'text',
            text: `API Error (${status}): ${message}`,
          },
        ],
        isError: true,
      };
    }
    this.logger.error(`Error: ${error.message}`);
    throw error;
  }
}
