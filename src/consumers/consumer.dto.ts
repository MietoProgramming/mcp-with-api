import { ApiProperty } from '@nestjs/swagger';

export class ConsumerDto {
  @ApiProperty({ example: 1, description: 'Consumer ID' })
  id: number;

  @ApiProperty({ example: 'John Doe', description: 'Consumer name' })
  name: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Consumer email',
  })
  email: string;

  @ApiProperty({ example: '+1234567890', description: 'Consumer phone' })
  phone: string;

  @ApiProperty({
    example: '123 Main St, City',
    description: 'Consumer address',
  })
  address: string;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Registration date',
  })
  registeredAt: Date;

  @ApiProperty({ example: 15, description: 'Total number of orders' })
  totalOrders: number;

  @ApiProperty({ example: 1250.5, description: 'Total amount spent' })
  totalSpent: number;

  @ApiProperty({
    example: '2024-10-01T00:00:00.000Z',
    description: 'Last order date',
    required: false,
  })
  lastOrderDate?: Date;
}

export class CreateConsumerDto {
  @ApiProperty({ example: 'John Doe', description: 'Consumer name' })
  name: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Consumer email',
  })
  email: string;

  @ApiProperty({ example: '+1234567890', description: 'Consumer phone' })
  phone: string;

  @ApiProperty({
    example: '123 Main St, City',
    description: 'Consumer address',
  })
  address: string;

  @ApiProperty({
    example: 0,
    description: 'Total orders',
    default: 0,
    required: false,
  })
  totalOrders?: number;

  @ApiProperty({
    example: 0,
    description: 'Total spent',
    default: 0,
    required: false,
  })
  totalSpent?: number;

  @ApiProperty({
    example: '2024-10-01T00:00:00.000Z',
    description: 'Last order date',
    required: false,
  })
  lastOrderDate?: Date;
}

export class UpdateConsumerDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'Consumer name',
    required: false,
  })
  name?: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Consumer email',
    required: false,
  })
  email?: string;

  @ApiProperty({
    example: '+1234567890',
    description: 'Consumer phone',
    required: false,
  })
  phone?: string;

  @ApiProperty({
    example: '123 Main St, City',
    description: 'Consumer address',
    required: false,
  })
  address?: string;
}

export class ConsumerStatisticsDto {
  @ApiProperty({ example: 1, description: 'Consumer ID' })
  consumerId: number;

  @ApiProperty({ example: 15, description: 'Total orders' })
  totalOrders: number;

  @ApiProperty({ example: 1250.5, description: 'Total spending' })
  totalSpent: number;

  @ApiProperty({ example: 83.37, description: 'Average order value' })
  averageOrderValue: number;

  @ApiProperty({ example: 30, description: 'Days since registration' })
  daysSinceRegistration: number;

  @ApiProperty({ example: 5, description: 'Days since last order' })
  daysSinceLastOrder: number;
}
