import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';

export interface EventQueueClient extends OnModuleInit, OnModuleDestroy {
  send(topic: string, messages: any[]): Promise<void>;
}
