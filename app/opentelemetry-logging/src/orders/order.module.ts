import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

@Module({
  imports: [
    // EventQueueModule.register(EventQueueClientConst.KAFKA),
    ClientsModule.register([
      {
        name: 'GRPC_CLIENT',
        transport: Transport.GRPC,
        options: {
          package: 'otel101',
          protoPath: join(__dirname, '../pb/otel-101.proto'),
          url: 'localhost:50051',
        },
      },
    ]),
  ],
  controllers: [OrderController],
})
export class OrderModule {}
