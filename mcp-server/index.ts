#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import axios from 'axios';

// Configuration
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000/api';

// API Client
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Tool Definitions
const TOOLS: Tool[] = [
  // Products Tools
  {
    name: 'list-products',
    description:
      'Get all products from the store. Returns an array of products with id, name, description, price, category, and stock information.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get-product',
    description:
      'Get a specific product by its ID. Returns detailed product information.',
    inputSchema: {
      type: 'object',
      properties: {
        productId: {
          type: 'number',
          description: 'The ID of the product to retrieve',
        },
      },
      required: ['productId'],
    },
  },
  {
    name: 'filter-products-by-category',
    description:
      'Filter products by category. Available categories: Electronics, Furniture, Clothing, Books, Sports, Home & Garden, Toys, Food & Beverage, Beauty, Automotive.',
    inputSchema: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          description: 'The category to filter by',
        },
      },
      required: ['category'],
    },
  },

  // Orders Tools
  {
    name: 'list-orders',
    description:
      'Get all orders. Returns an array of orders with consumer, product, quantity, price, and status information.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get-order',
    description:
      'Get a specific order by its ID. Returns detailed order information.',
    inputSchema: {
      type: 'object',
      properties: {
        orderId: {
          type: 'number',
          description: 'The ID of the order to retrieve',
        },
      },
      required: ['orderId'],
    },
  },
  {
    name: 'filter-orders-by-consumer',
    description:
      'Get all orders for a specific consumer. Useful for viewing customer purchase history.',
    inputSchema: {
      type: 'object',
      properties: {
        consumerId: {
          type: 'number',
          description: 'The ID of the consumer',
        },
      },
      required: ['consumerId'],
    },
  },
  {
    name: 'filter-orders-by-status',
    description:
      'Filter orders by status. Available statuses: pending, processing, shipped, delivered, cancelled.',
    inputSchema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          description: 'The status to filter by',
          enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        },
      },
      required: ['status'],
    },
  },
  {
    name: 'get-order-statistics',
    description:
      'Get comprehensive order statistics including total orders, breakdown by status, and total revenue.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },

  // Consumers Tools
  {
    name: 'list-consumers',
    description:
      'Get all consumers. Returns an array of consumers with contact information and purchase statistics.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get-consumer',
    description:
      'Get a specific consumer by their ID. Returns detailed consumer information including purchase history.',
    inputSchema: {
      type: 'object',
      properties: {
        consumerId: {
          type: 'number',
          description: 'The ID of the consumer to retrieve',
        },
      },
      required: ['consumerId'],
    },
  },
  {
    name: 'get-top-consumers',
    description:
      'Get the top spending consumers. Returns consumers ranked by total spending.',
    inputSchema: {
      type: 'object',
      properties: {
        limit: {
          type: 'number',
          description: 'Number of top consumers to return (default: 5)',
          default: 5,
        },
      },
    },
  },
  {
    name: 'get-consumer-statistics',
    description:
      'Get detailed statistics for a specific consumer including average order value, days since registration, and days since last order.',
    inputSchema: {
      type: 'object',
      properties: {
        consumerId: {
          type: 'number',
          description: 'The ID of the consumer',
        },
      },
      required: ['consumerId'],
    },
  },

  // Analytics Tools
  {
    name: 'analyze-consumer-behavior',
    description:
      "Analyze a specific consumer's behavior and predict their reorder probability. Returns RFM (Recency, Frequency, Monetary) score, purchase patterns, preferred categories, and reorder prediction with probability (0-1), confidence level, expected days until next order, and churn risk assessment.",
    inputSchema: {
      type: 'object',
      properties: {
        consumerId: {
          type: 'number',
          description: 'The ID of the consumer to analyze',
        },
      },
      required: ['consumerId'],
    },
  },
  {
    name: 'get-all-predictions',
    description:
      'Get reorder probability predictions for all consumers. Returns consumer behavior analysis including RFM scores and reorder predictions for every consumer in the system.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get-prediction-summary',
    description:
      'Get a summary of reorder predictions across all consumers. Shows total consumers, how many have high/medium/low reorder probability, average reorder probability, and top 10 consumers most likely to reorder.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get-churn-risk-consumers',
    description:
      'Get consumers at high risk of churning (not ordering again). Returns consumers with high churn risk sorted by recency of last order.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get-high-value-reorder-candidates',
    description:
      'Get high-value consumers likely to reorder. Returns consumers with >60% reorder probability and high monetary scores (top spenders), sorted by reorder probability.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
];

// Tool Handler Functions
async function handleToolCall(name: string, args: any): Promise<any> {
  try {
    switch (name) {
      // Products
      case 'list-products': {
        const response = await apiClient.get('/products');
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      }

      case 'get-product': {
        const response = await apiClient.get(`/products/${args.productId}`);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      }

      case 'filter-products-by-category': {
        const response = await apiClient.get('/products', {
          params: { category: args.category },
        });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      }

      // Orders
      case 'list-orders': {
        const response = await apiClient.get('/orders');
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      }

      case 'get-order': {
        const response = await apiClient.get(`/orders/${args.orderId}`);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      }

      case 'filter-orders-by-consumer': {
        const response = await apiClient.get('/orders', {
          params: { consumerId: args.consumerId },
        });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      }

      case 'filter-orders-by-status': {
        const response = await apiClient.get('/orders', {
          params: { status: args.status },
        });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      }

      case 'get-order-statistics': {
        const response = await apiClient.get('/orders/statistics');
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      }

      // Consumers
      case 'list-consumers': {
        const response = await apiClient.get('/consumers');
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      }

      case 'get-consumer': {
        const response = await apiClient.get(`/consumers/${args.consumerId}`);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      }

      case 'get-top-consumers': {
        const limit = args.limit || 5;
        const response = await apiClient.get('/consumers/top', {
          params: { limit },
        });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      }

      case 'get-consumer-statistics': {
        const response = await apiClient.get(
          `/consumers/${args.consumerId}/statistics`,
        );
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      }

      // Analytics
      case 'analyze-consumer-behavior': {
        const response = await apiClient.get(
          `/analytics/consumer/${args.consumerId}`,
        );
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      }

      case 'get-all-predictions': {
        const response = await apiClient.get('/analytics/predictions');
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      }

      case 'get-prediction-summary': {
        const response = await apiClient.get('/analytics/summary');
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      }

      case 'get-churn-risk-consumers': {
        const response = await apiClient.get('/analytics/churn-risk');
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      }

      case 'get-high-value-reorder-candidates': {
        const response = await apiClient.get(
          '/analytics/high-value-candidates',
        );
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(response.data, null, 2),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const message = error.response?.data?.message || error.message;
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
    throw error;
  }
}

// Create and configure the server
const server = new Server(
  {
    name: 'mcp-api-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  },
);

// Set up request handlers
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: TOOLS,
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  return await handleToolCall(name, args || {});
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('MCP API Server running on stdio');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
