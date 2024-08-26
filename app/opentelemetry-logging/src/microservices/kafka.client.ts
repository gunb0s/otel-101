import { Kafka, Producer } from 'kafkajs';
import { Injectable, Logger } from '@nestjs/common';
import { EventQueueClient } from './event-queue.client';

@Injectable()
export class KafkaClient implements EventQueueClient {
  private readonly kafkaClient: Kafka;
  private readonly kafkaProducer: Producer;
  private readonly logger = new Logger(KafkaClient.name);
  constructor() {
    this.kafkaClient = new Kafka({
      clientId: 'OTEL-101',
      brokers: ['kafka00:9092', 'kafka01:9092', 'kafka02:9092'],
    });
    this.kafkaProducer = this.kafkaClient.producer({
      allowAutoTopicCreation: true,
    });
  }

  async send(topic: string, messages: any[]) {
    const result = await this.kafkaProducer.send({
      topic,
      messages,
    });

    this.logger.log(result);
  }

  async onModuleDestroy() {
    await this.kafkaProducer.disconnect();
  }

  async onModuleInit() {
    await this.kafkaProducer.connect();
  }
}
