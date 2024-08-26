import { DynamicModule, Module } from '@nestjs/common';
import { KafkaClient } from './kafka.client';

export enum EventQueueClientConst {
  KAFKA = 'KAFKA',
}

@Module({})
export class EventQueueModule {
  static register(token: string): DynamicModule {
    return {
      module: EventQueueModule,
      providers: [
        {
          provide: token,
          useFactory: () => {
            switch (token) {
              case EventQueueClientConst.KAFKA:
                return new KafkaClient();
              default:
                throw new Error(`Unknown token ${token}`);
            }
          },
        },
      ],
      exports: [token],
    };
  }
}
