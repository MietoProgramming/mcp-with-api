import { faker } from '@faker-js/faker';
import { Injectable, OnModuleInit } from '@nestjs/common';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  createdAt: Date;
}

@Injectable()
export class ProductsService implements OnModuleInit {
  private products: Product[] = [];

  private readonly categories = [
    'Electronics',
    'Furniture',
    'Clothing',
    'Books',
    'Sports',
    'Home & Garden',
    'Toys',
    'Food & Beverage',
    'Beauty',
    'Automotive',
  ];

  onModuleInit() {
    this.generateProducts(500);
    console.log(`Generated ${this.products.length} products`);
  }

  private generateProducts(count: number): void {
    for (let i = 1; i <= count; i++) {
      const category = faker.helpers.arrayElement(this.categories);
      this.products.push({
        id: i,
        name: this.generateProductName(),
        description: faker.commerce.productDescription(),
        price: parseFloat(faker.commerce.price({ min: 5, max: 2000 })),
        category,
        stock: faker.number.int({ min: 0, max: 500 }),
        createdAt: faker.date.between({
          from: '2023-01-01',
          to: '2024-10-01',
        }),
      });
    }
  }

  private generateProductName(): string {
    const adjectives = faker.commerce.productAdjective();
    const material = faker.commerce.productMaterial();
    const product = faker.commerce.product();

    return `${adjectives} ${material} ${product}`;
  }

  findAll(): Product[] {
    return this.products;
  }

  findOne(id: number): Product | undefined {
    return this.products.find((product) => product.id === id);
  }

  findByCategory(category: string): Product[] {
    return this.products.filter(
      (product) => product.category.toLowerCase() === category.toLowerCase(),
    );
  }

  create(product: Omit<Product, 'id' | 'createdAt'>): Product {
    const newProduct: Product = {
      id: Math.max(...this.products.map((p) => p.id)) + 1,
      ...product,
      createdAt: new Date(),
    };
    this.products.push(newProduct);
    return newProduct;
  }

  update(id: number, product: Partial<Product>): Product | undefined {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) return undefined;

    this.products[index] = { ...this.products[index], ...product };
    return this.products[index];
  }

  delete(id: number): boolean {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) return false;

    this.products.splice(index, 1);
    return true;
  }
}
