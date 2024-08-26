import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { DeliveryController } from './delivery.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'GRPC_CLIENT',
        transport: Transport.GRPC,
        options: {
          package: 'otel101',
          protoPath: join(__dirname, '../pb/otel-101.proto'),
          url: 'localhost:50052',
        },
      },
    ]),
  ],
  controllers: [DeliveryController],
})
export class DeliveryModule {}
