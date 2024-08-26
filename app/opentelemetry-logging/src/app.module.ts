import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerModule } from 'nestjs-pino';
import { OrderModule } from './orders/order.module';
import { DeliveryModule } from './deliveries/delivery.module';

@Module({
  imports: [LoggerModule.forRoot(), OrderModule, DeliveryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
