import { ApiProperty } from '@nestjs/swagger';

export class ProductDto {
  @ApiProperty({ example: 1, description: 'Product ID' })
  id: number;

  @ApiProperty({ example: 'Wireless Mouse', description: 'Product name' })
  name: string;

  @ApiProperty({
    example: 'Ergonomic wireless mouse with USB receiver',
    description: 'Product description',
  })
  description: string;

  @ApiProperty({ example: 29.99, description: 'Product price' })
  price: number;

  @ApiProperty({ example: 'Electronics', description: 'Product category' })
  category: string;

  @ApiProperty({ example: 100, description: 'Stock quantity' })
  stock: number;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Creation date',
  })
  createdAt: Date;
}

export class CreateProductDto {
  @ApiProperty({ example: 'Wireless Mouse', description: 'Product name' })
  name: string;

  @ApiProperty({
    example: 'Ergonomic wireless mouse with USB receiver',
    description: 'Product description',
  })
  description: string;

  @ApiProperty({ example: 29.99, description: 'Product price' })
  price: number;

  @ApiProperty({ example: 'Electronics', description: 'Product category' })
  category: string;

  @ApiProperty({ example: 100, description: 'Stock quantity' })
  stock: number;
}

export class UpdateProductDto {
  @ApiProperty({
    example: 'Wireless Mouse',
    description: 'Product name',
    required: false,
  })
  name?: string;

  @ApiProperty({
    example: 'Ergonomic wireless mouse with USB receiver',
    description: 'Product description',
    required: false,
  })
  description?: string;

  @ApiProperty({
    example: 29.99,
    description: 'Product price',
    required: false,
  })
  price?: number;

  @ApiProperty({
    example: 'Electronics',
    description: 'Product category',
    required: false,
  })
  category?: string;

  @ApiProperty({
    example: 100,
    description: 'Stock quantity',
    required: false,
  })
  stock?: number;
}
