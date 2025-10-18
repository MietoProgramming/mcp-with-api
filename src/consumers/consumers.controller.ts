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
import { Consumer, ConsumersService } from './consumers.service';

@Controller('consumers')
export class ConsumersController {
  constructor(private readonly consumersService: ConsumersService) {}

  @Get()
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
  getTopConsumers(@Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit, 10) : 5;
    return this.consumersService.getTopConsumers(limitNum);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    const consumer = this.consumersService.findOne(id);
    if (!consumer) {
      throw new NotFoundException(`Consumer with ID ${id} not found`);
    }
    return consumer;
  }

  @Get(':id/statistics')
  getStatistics(@Param('id', ParseIntPipe) id: number) {
    const stats = this.consumersService.getConsumerStatistics(id);
    if (!stats) {
      throw new NotFoundException(`Consumer with ID ${id} not found`);
    }
    return stats;
  }

  @Post()
  create(@Body() consumer: Omit<Consumer, 'id' | 'registeredAt'>) {
    return this.consumersService.create(consumer);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() consumer: Partial<Consumer>,
  ) {
    const updated = this.consumersService.update(id, consumer);
    if (!updated) {
      throw new NotFoundException(`Consumer with ID ${id} not found`);
    }
    return updated;
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    const deleted = this.consumersService.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Consumer with ID ${id} not found`);
    }
    return { message: `Consumer with ID ${id} deleted successfully` };
  }
}
