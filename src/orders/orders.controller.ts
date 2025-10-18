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
  CreateOrderDto,
  OrderDto,
  OrderStatisticsDto,
  UpdateOrderDto,
} from './order.dto';
import { OrdersService } from './orders.service';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all orders or filter by consumer/product/status',
  })
  @ApiQuery({
    name: 'consumerId',
    required: false,
    description: 'Filter by consumer ID',
  })
  @ApiQuery({
    name: 'productId',
    required: false,
    description: 'Filter by product ID',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filter by order status',
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
  })
  @ApiResponse({
    status: 200,
    description: 'List of orders',
    type: [OrderDto],
  })
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
  @ApiOperation({ summary: 'Get order statistics' })
  @ApiResponse({
    status: 200,
    description: 'Order statistics',
    type: OrderStatisticsDto,
  })
  getStatistics() {
    return this.ordersService.getOrderStatistics();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an order by ID' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  @ApiResponse({ status: 200, description: 'Order found', type: OrderDto })
  @ApiResponse({ status: 404, description: 'Order not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    const order = this.ordersService.findOne(id);
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiBody({ type: CreateOrderDto })
  @ApiResponse({ status: 201, description: 'Order created', type: OrderDto })
  create(@Body() order: CreateOrderDto) {
    return this.ordersService.create(order);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an order' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  @ApiBody({ type: UpdateOrderDto })
  @ApiResponse({ status: 200, description: 'Order updated', type: OrderDto })
  @ApiResponse({ status: 404, description: 'Order not found' })
  update(@Param('id', ParseIntPipe) id: number, @Body() order: UpdateOrderDto) {
    const updated = this.ordersService.update(id, order);
    if (!updated) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return updated;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an order' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  @ApiResponse({ status: 200, description: 'Order deleted' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  delete(@Param('id', ParseIntPipe) id: number) {
    const deleted = this.ordersService.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return { message: `Order with ID ${id} deleted successfully` };
  }
}
