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
import { Order, OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  findAll(
    @Query('consumerId') consumerId?: string,
    @Query('productId') productId?: string,
    @Query('status') status?: string,
  ) {
    if (consumerId) {
      return this.ordersService.findByConsumer(parseInt(consumerId, 10));
    }
    if (productId) {
      return this.ordersService.findByProduct(parseInt(productId, 10));
    }
    if (status) {
      return this.ordersService.findByStatus(status);
    }
    return this.ordersService.findAll();
  }

  @Get('statistics')
  getStatistics() {
    return this.ordersService.getOrderStatistics();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    const order = this.ordersService.findOne(id);
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  @Post()
  create(@Body() order: Omit<Order, 'id' | 'orderDate'>) {
    return this.ordersService.create(order);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() order: Partial<Order>) {
    const updated = this.ordersService.update(id, order);
    if (!updated) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return updated;
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    const deleted = this.ordersService.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return { message: `Order with ID ${id} deleted successfully` };
  }
}
