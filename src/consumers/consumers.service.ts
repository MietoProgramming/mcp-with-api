import { faker } from '@faker-js/faker';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';

export interface Consumer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  registeredAt: Date;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: Date;
}

@Injectable()
export class ConsumersService implements OnModuleInit {
  private readonly logger = new Logger(ConsumersService.name);
  private consumers: Consumer[] = [];

  onModuleInit() {
    this.logger.log('Initializing Consumers Service');
    this.generateConsumers(100);
    this.logger.log(`Generated ${this.consumers.length} consumers`);
  }

  private generateConsumers(count: number): void {
    for (let i = 1; i <= count; i++) {
      const registeredAt = faker.date.between({
        from: '2023-01-01',
        to: '2024-09-01',
      });

      // Initialize with zero orders/spent - will be updated when orders are generated
      this.consumers.push({
        id: i,
        name: faker.person.fullName(),
        email: faker.internet.email().toLowerCase(),
        phone: faker.phone.number(),
        address: `${faker.location.streetAddress()}, ${faker.location.city()}, ${faker.location.state({ abbreviated: true })} ${faker.location.zipCode()}`,
        registeredAt,
        totalOrders: 0,
        totalSpent: 0,
        lastOrderDate: undefined,
      });
    }
  }

  // Method to update consumer statistics after orders are generated
  updateConsumerStats(
    consumerId: number,
    orderCount: number,
    totalSpent: number,
    lastOrderDate: Date,
  ): void {
    const consumer = this.findOne(consumerId);
    if (consumer) {
      consumer.totalOrders = orderCount;
      consumer.totalSpent = totalSpent;
      consumer.lastOrderDate = lastOrderDate;
    }
  }

  findAll(): Consumer[] {
    this.logger.debug(
      `Fetching all consumers (${this.consumers.length} total)`,
    );
    return this.consumers;
  }

  findOne(id: number): Consumer | undefined {
    this.logger.debug(`Fetching consumer ID: ${id}`);
    return this.consumers.find((consumer) => consumer.id === id);
  }

  findByEmail(email: string): Consumer | undefined {
    return this.consumers.find(
      (consumer) => consumer.email.toLowerCase() === email.toLowerCase(),
    );
  }

  create(consumer: Omit<Consumer, 'id' | 'registeredAt'>): Consumer {
    const newConsumer: Consumer = {
      id: Math.max(...this.consumers.map((c) => c.id)) + 1,
      ...consumer,
      registeredAt: new Date(),
    };
    this.consumers.push(newConsumer);
    return newConsumer;
  }

  update(id: number, consumer: Partial<Consumer>): Consumer | undefined {
    const index = this.consumers.findIndex((c) => c.id === id);
    if (index === -1) return undefined;

    this.consumers[index] = { ...this.consumers[index], ...consumer };
    return this.consumers[index];
  }

  delete(id: number): boolean {
    const index = this.consumers.findIndex((c) => c.id === id);
    if (index === -1) return false;

    this.consumers.splice(index, 1);
    return true;
  }

  getTopConsumers(limit: number = 5): Consumer[] {
    return [...this.consumers]
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, limit);
  }

  getConsumerStatistics(id: number) {
    const consumer = this.findOne(id);
    if (!consumer) return undefined;

    const avgOrderValue =
      consumer.totalOrders > 0
        ? (consumer.totalSpent / consumer.totalOrders).toFixed(2)
        : '0.00';

    const daysSinceRegistration = Math.floor(
      (new Date().getTime() - consumer.registeredAt.getTime()) /
        (1000 * 60 * 60 * 24),
    );

    const daysSinceLastOrder = consumer.lastOrderDate
      ? Math.floor(
          (new Date().getTime() - consumer.lastOrderDate.getTime()) /
            (1000 * 60 * 60 * 24),
        )
      : null;

    return {
      ...consumer,
      avgOrderValue,
      daysSinceRegistration,
      daysSinceLastOrder,
    };
  }
}
