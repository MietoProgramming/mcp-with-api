import { faker } from '@faker-js/faker';
import {
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
  forwardRef,
} from '@nestjs/common';
import { ConsumersService } from '../consumers/consumers.service';

export interface Order {
  id: number;
  consumerId: number;
  productId: number;
  quantity: number;
  totalPrice: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: Date;
  deliveryDate?: Date;
}

@Injectable()
export class OrdersService implements OnModuleInit {
  private readonly logger = new Logger(OrdersService.name);
  private orders: Order[] = [];

  // We'll need these to be injected after products and consumers are generated
  private productsCount = 500;
  private consumersCount = 100;

  constructor(
    @Inject(forwardRef(() => ConsumersService))
    private readonly consumersService: ConsumersService,
  ) {}

  onModuleInit() {
    this.logger.log('Initializing Orders Service');
    // Delay order generation slightly to ensure products and consumers are ready
    setTimeout(() => {
      this.generateOrders(10000);
      this.updateConsumerStatistics();
      this.logger.log(`Generated ${this.orders.length} orders`);
    }, 100);
  }

  private generateOrders(count: number): void {
    for (let i = 1; i <= count; i++) {
      const consumerId = faker.number.int({ min: 1, max: this.consumersCount });
      const productId = faker.number.int({ min: 1, max: this.productsCount });
      const quantity = faker.number.int({ min: 1, max: 5 });
      const unitPrice = parseFloat(faker.commerce.price({ min: 5, max: 2000 }));
      const totalPrice = parseFloat((unitPrice * quantity).toFixed(2));

      const orderDate = faker.date.between({
        from: '2023-01-01',
        to: '2024-10-15',
      });

      // Weighted status distribution: more delivered than others
      const random = Math.random() * 100;
      let status: Order['status'];
      if (random < 70) status = 'delivered';
      else if (random < 80) status = 'shipped';
      else if (random < 88) status = 'processing';
      else if (random < 95) status = 'pending';
      else status = 'cancelled';

      // Add delivery date for delivered orders
      let deliveryDate: Date | undefined = undefined;
      if (status === 'delivered') {
        deliveryDate = faker.date.soon({
          days: faker.number.int({ min: 2, max: 14 }),
          refDate: orderDate,
        });
      }

      this.orders.push({
        id: i,
        consumerId,
        productId,
        quantity,
        totalPrice,
        status,
        orderDate,
        deliveryDate,
      });
    }

    // Sort orders by date for more realistic data
    this.orders.sort((a, b) => a.orderDate.getTime() - b.orderDate.getTime());
  }

  findAll(): Order[] {
    this.logger.debug(`Fetching all orders (${this.orders.length} total)`);
    return this.orders;
  }

  findOne(id: number): Order | undefined {
    this.logger.debug(`Fetching order ID: ${id}`);
    return this.orders.find((order) => order.id === id);
  }

  findByConsumer(consumerId: number): Order[] {
    this.logger.debug(`Fetching orders for consumer ID: ${consumerId}`);
    const orders = this.orders.filter(
      (order) => order.consumerId === consumerId,
    );
    this.logger.debug(
      `Found ${orders.length} orders for consumer ${consumerId}`,
    );
    return orders;
  }

  findByProduct(productId: number): Order[] {
    return this.orders.filter((order) => order.productId === productId);
  }

  findByStatus(status: string): Order[] {
    return this.orders.filter(
      (order) => order.status.toLowerCase() === status.toLowerCase(),
    );
  }

  create(order: Omit<Order, 'id' | 'orderDate'>): Order {
    const newOrder: Order = {
      id: Math.max(...this.orders.map((o) => o.id)) + 1,
      ...order,
      orderDate: new Date(),
    };
    this.orders.push(newOrder);
    return newOrder;
  }

  update(id: number, order: Partial<Order>): Order | undefined {
    const index = this.orders.findIndex((o) => o.id === id);
    if (index === -1) return undefined;

    this.orders[index] = { ...this.orders[index], ...order };
    return this.orders[index];
  }

  delete(id: number): boolean {
    const index = this.orders.findIndex((o) => o.id === id);
    if (index === -1) return false;

    this.orders.splice(index, 1);
    return true;
  }

  getOrderStatistics() {
    const total = this.orders.length;
    const byStatus = this.orders.reduce(
      (acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );
    const totalRevenue = this.orders.reduce(
      (sum, order) => sum + order.totalPrice,
      0,
    );

    return {
      totalOrders: total,
      ordersByStatus: byStatus,
      totalRevenue: totalRevenue.toFixed(2),
    };
  }

  private updateConsumerStatistics(): void {
    // Group orders by consumer
    const consumerOrders = new Map<
      number,
      { count: number; total: number; lastDate: Date }
    >();

    this.orders.forEach((order) => {
      const existing = consumerOrders.get(order.consumerId);
      if (existing) {
        existing.count++;
        existing.total += order.totalPrice;
        if (order.orderDate > existing.lastDate) {
          existing.lastDate = order.orderDate;
        }
      } else {
        consumerOrders.set(order.consumerId, {
          count: 1,
          total: order.totalPrice,
          lastDate: order.orderDate,
        });
      }
    });

    // Update each consumer's statistics
    consumerOrders.forEach((stats, consumerId) => {
      this.consumersService.updateConsumerStats(
        consumerId,
        stats.count,
        stats.total,
        stats.lastDate,
      );
    });
  }
}
