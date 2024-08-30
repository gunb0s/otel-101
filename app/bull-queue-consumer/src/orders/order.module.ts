import { Module } from '@nestjs/common';
import { OrderConsumer } from './order.consumer';
import { BullModule } from '@nestjs/bull';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './order.entity';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'orders' }),
    TypeOrmModule.forFeature([OrderEntity]),
  ],
  providers: [OrderConsumer],
})
export class OrderModule {}
