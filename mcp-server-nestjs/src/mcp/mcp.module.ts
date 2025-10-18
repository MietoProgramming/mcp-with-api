import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { McpService } from './mcp.service';

@Module({
  imports: [HttpModule],
  providers: [McpService],
  exports: [McpService],
})
export class McpModule {}
