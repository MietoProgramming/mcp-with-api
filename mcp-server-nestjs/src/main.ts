#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { NestFactory } from '@nestjs/core';
import 'reflect-metadata';
import { AppModule } from './app.module';
import { TOOLS } from './mcp/mcp.constants';
import { McpService } from './mcp/mcp.service';

async function bootstrap() {
  // Create NestJS application context
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  // Get MCP service instance
  const mcpService = app.get(McpService);

  // Create and configure the MCP server
  const server = new Server(
    {
      name: 'mcp-api-server-nestjs',
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
    return await mcpService.handleToolCall(name, args || {});
  });

  // Start the server
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('MCP API Server (NestJS) running on stdio');
}

bootstrap().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
