import { Module } from '@nestjs/common';
import { ConsumersController } from './consumers.controller';
import { ConsumersService } from './consumers.service';

@Module({
  controllers: [ConsumersController],
  providers: [ConsumersService],
  exports: [ConsumersService],
})
export class ConsumersModule {}
