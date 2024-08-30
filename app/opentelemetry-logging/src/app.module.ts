import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerModule } from 'nestjs-pino';
import { OrderModule } from './orders/order.module';
import { DeliveryModule } from './deliveries/delivery.module';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    LoggerModule.forRoot(),
    BullModule.forRoot({
      redis: {
        host: 'otel101-redis',
        port: 6379,
      },
    }),
    OrderModule,
    DeliveryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
