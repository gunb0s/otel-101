import { Module } from '@nestjs/common';
import { OrderConsumer } from './order.consumer';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [BullModule.registerQueue({ name: 'orders' })],
  providers: [OrderConsumer],
})
export class OrderModule {}
