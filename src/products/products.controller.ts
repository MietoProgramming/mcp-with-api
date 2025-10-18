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
import { Product, ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll(@Query('category') category?: string) {
    if (category) {
      return this.productsService.findByCategory(category);
    }
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    const product = this.productsService.findOne(id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  @Post()
  create(@Body() product: Omit<Product, 'id' | 'createdAt'>) {
    return this.productsService.create(product);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() product: Partial<Product>,
  ) {
    const updated = this.productsService.update(id, product);
    if (!updated) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return updated;
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    const deleted = this.productsService.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return { message: `Product with ID ${id} deleted successfully` };
  }
}
