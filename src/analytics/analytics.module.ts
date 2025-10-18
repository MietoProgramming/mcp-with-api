import { Module, forwardRef } from '@nestjs/common';
import { ConsumersModule } from '../consumers/consumers.module';
import { OrdersModule } from '../orders/orders.module';
import { ProductsModule } from '../products/products.module';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';

@Module({
  imports: [
    forwardRef(() => OrdersModule),
    forwardRef(() => ConsumersModule),
    forwardRef(() => ProductsModule),
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
