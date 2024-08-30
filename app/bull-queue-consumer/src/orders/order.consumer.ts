import { OnQueueCompleted, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from './order.entity';
import { Repository } from 'typeorm';

@Processor('orders')
export class OrderConsumer {
  private readonly logger = new Logger(OrderConsumer.name);

  constructor(
    @InjectRepository(OrderEntity)
    private readonly repository: Repository<OrderEntity>,
  ) {}

  @Process('order_info')
  async processJob(job: Job<any>) {
    this.logger.log(`Order info job ${job.id} Start`);

    const order = this.repository.create({
      requestId: job.data.requestId || 'Request ID',
    });

    await this.repository.save(order);

    this.internalCall();

    this.logger.log(`Order info job ${job.id} End`);
  }

  @OnQueueCompleted()
  onCompleted(job: Job) {
    this.logger.log(`Job ${job.id} completed`);
  }

  internalCall() {
    this.logger.log('Internal call');
  }
}
