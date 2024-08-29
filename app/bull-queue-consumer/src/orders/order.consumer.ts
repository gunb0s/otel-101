import { Process, Processor } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Job } from 'bull';

@Injectable()
@Processor('orders')
export class OrderConsumer {
  private readonly logger = new Logger(OrderConsumer.name);
  @Process('order_info')
  async transcode(job: Job<unknown>) {
    this.logger.log(`Order info job ${job.id}`);
  }
}
