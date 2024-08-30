import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrderModule } from './orders/order.module';
import { BullModule } from '@nestjs/bull';
import { LoggerModule } from 'nestjs-pino';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './orders/order.entity';

@Module({
  imports: [
    LoggerModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'otel101-mysql',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'otel101',
      entities: [OrderEntity],
      synchronize: true,
    }),
    BullModule.forRoot({
      redis: {
        host: 'otel101-redis',
        port: 6379,
      },
    }),
    OrderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
