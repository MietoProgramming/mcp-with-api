import { ApiProperty } from '@nestjs/swagger';

export class OrderDto {
  @ApiProperty({ example: 1, description: 'Order ID' })
  id: number;

  @ApiProperty({ example: 1, description: 'Consumer ID' })
  consumerId: number;

  @ApiProperty({ example: 1, description: 'Product ID' })
  productId: number;

  @ApiProperty({ example: 2, description: 'Quantity ordered' })
  quantity: number;

  @ApiProperty({ example: 59.98, description: 'Total price' })
  totalPrice: number;

  @ApiProperty({
    example: 'delivered',
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    description: 'Order status',
  })
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Order date',
  })
  orderDate: Date;

  @ApiProperty({
    example: '2024-01-05T00:00:00.000Z',
    description: 'Delivery date',
    required: false,
  })
  deliveryDate?: Date;
}

export class CreateOrderDto {
  @ApiProperty({ example: 1, description: 'Consumer ID' })
  consumerId: number;

  @ApiProperty({ example: 1, description: 'Product ID' })
  productId: number;

  @ApiProperty({ example: 2, description: 'Quantity to order' })
  quantity: number;

  @ApiProperty({ example: 59.98, description: 'Total price' })
  totalPrice: number;

  @ApiProperty({
    example: 'pending',
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    description: 'Order status',
  })
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

  @ApiProperty({
    example: '2024-01-05T00:00:00.000Z',
    description: 'Delivery date',
    required: false,
  })
  deliveryDate?: Date;
}

export class UpdateOrderDto {
  @ApiProperty({
    example: 1,
    description: 'Consumer ID',
    required: false,
  })
  consumerId?: number;

  @ApiProperty({
    example: 1,
    description: 'Product ID',
    required: false,
  })
  productId?: number;

  @ApiProperty({
    example: 2,
    description: 'Quantity',
    required: false,
  })
  quantity?: number;

  @ApiProperty({
    example: 59.98,
    description: 'Total price',
    required: false,
  })
  totalPrice?: number;

  @ApiProperty({
    example: 'delivered',
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    description: 'Order status',
    required: false,
  })
  status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

  @ApiProperty({
    example: '2024-01-05T00:00:00.000Z',
    description: 'Delivery date',
    required: false,
  })
  deliveryDate?: Date;
}

export class OrderStatisticsDto {
  @ApiProperty({ example: 10000, description: 'Total number of orders' })
  totalOrders: number;

  @ApiProperty({
    example: { pending: 1000, processing: 2000, shipped: 3000 },
    description: 'Orders by status',
  })
  ordersByStatus: Record<string, number>;

  @ApiProperty({ example: 250000.5, description: 'Total revenue' })
  totalRevenue: number;
}
