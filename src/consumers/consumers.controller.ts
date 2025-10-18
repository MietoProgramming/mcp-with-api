import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  ConsumerDto,
  ConsumerStatisticsDto,
  CreateConsumerDto,
  UpdateConsumerDto,
} from './consumer.dto';
import { ConsumersService } from './consumers.service';

@ApiTags('consumers')
@Controller('consumers')
export class ConsumersController {
  constructor(private readonly consumersService: ConsumersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all consumers or search by email' })
  @ApiQuery({
    name: 'email',
    required: false,
    description: 'Search consumer by email',
  })
  @ApiResponse({
    status: 200,
    description: 'List of consumers',
    type: [ConsumerDto],
  })
  findAll(@Query('email') email?: string) {
    if (email) {
      const consumer = this.consumersService.findByEmail(email);
      if (!consumer) {
        throw new NotFoundException(`Consumer with email ${email} not found`);
      }
      return consumer;
    }
    return this.consumersService.findAll();
  }

  @Get('top')
  @ApiOperation({ summary: 'Get top spending consumers' })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of top consumers to return (default: 5)',
    example: 5,
  })
  @ApiResponse({
    status: 200,
    description: 'List of top consumers',
    type: [ConsumerDto],
  })
  getTopConsumers(@Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit, 10) : 5;
    return this.consumersService.getTopConsumers(limitNum);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a consumer by ID' })
  @ApiParam({ name: 'id', description: 'Consumer ID' })
  @ApiResponse({
    status: 200,
    description: 'Consumer found',
    type: ConsumerDto,
  })
  @ApiResponse({ status: 404, description: 'Consumer not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    const consumer = this.consumersService.findOne(id);
    if (!consumer) {
      throw new NotFoundException(`Consumer with ID ${id} not found`);
    }
    return consumer;
  }

  @Get(':id/statistics')
  @ApiOperation({ summary: 'Get consumer statistics' })
  @ApiParam({ name: 'id', description: 'Consumer ID' })
  @ApiResponse({
    status: 200,
    description: 'Consumer statistics',
    type: ConsumerStatisticsDto,
  })
  @ApiResponse({ status: 404, description: 'Consumer not found' })
  getStatistics(@Param('id', ParseIntPipe) id: number) {
    const stats = this.consumersService.getConsumerStatistics(id);
    if (!stats) {
      throw new NotFoundException(`Consumer with ID ${id} not found`);
    }
    return stats;
  }

  @Post()
  @ApiOperation({ summary: 'Create a new consumer' })
  @ApiBody({ type: CreateConsumerDto })
  @ApiResponse({
    status: 201,
    description: 'Consumer created',
    type: ConsumerDto,
  })
  create(@Body() consumer: CreateConsumerDto) {
    return this.consumersService.create({
      ...consumer,
      totalOrders: consumer.totalOrders ?? 0,
      totalSpent: consumer.totalSpent ?? 0,
    });
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a consumer' })
  @ApiParam({ name: 'id', description: 'Consumer ID' })
  @ApiBody({ type: UpdateConsumerDto })
  @ApiResponse({
    status: 200,
    description: 'Consumer updated',
    type: ConsumerDto,
  })
  @ApiResponse({ status: 404, description: 'Consumer not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() consumer: UpdateConsumerDto,
  ) {
    const updated = this.consumersService.update(id, consumer);
    if (!updated) {
      throw new NotFoundException(`Consumer with ID ${id} not found`);
    }
    return updated;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a consumer' })
  @ApiParam({ name: 'id', description: 'Consumer ID' })
  @ApiResponse({ status: 200, description: 'Consumer deleted' })
  @ApiResponse({ status: 404, description: 'Consumer not found' })
  delete(@Param('id', ParseIntPipe) id: number) {
    const deleted = this.consumersService.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Consumer with ID ${id} not found`);
    }
    return { message: `Consumer with ID ${id} deleted successfully` };
  }
}
