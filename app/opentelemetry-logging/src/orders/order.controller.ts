import {
  Body,
  Controller,
  Inject,
  Logger,
  OnModuleInit,
  Post,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { ChargeRequest, ChargeResponse } from '../pb/otel-101';
import { Observable } from 'rxjs';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

export interface PaymentService {
  Charge(request: ChargeRequest): Observable<ChargeResponse>;
}

@Controller('orders')
export class OrderController implements OnModuleInit {
  private paymentService: PaymentService;
  private readonly logger = new Logger(OrderController.name);
  constructor(
    // @Inject(EventQueueClientConst.KAFKA)
    // private readonly customKafkaClient: EventQueueClient,
    @Inject('GRPC_CLIENT') private client: ClientGrpc,
    @InjectQueue('orders') private readonly ordersQueue: Queue,
  ) {}

  onModuleInit() {
    this.paymentService =
      this.client.getService<PaymentService>('PaymentService');
  }

  @Post()
  async createOrder(@Body() createOrderDto: { requestId: string }): Promise<{
    requestId: string;
    job: number | string;
    status: string;
  }> {
    // await this.customKafkaClient.send('orders', [
    //   {
    //     value: JSON.stringify({
    //       requestId: createOrderDto.requestId,
    //     }),
    //   },
    // ]);

    // const chargeResponse = await lastValueFrom(
    //   this.paymentService.Charge({ amount: 1000 }),
    // );
    // this.logger.log(
    //   `Payment service response: txId=${chargeResponse.transactionId}`,
    // );
    this.internalCall();

    const job = await this.ordersQueue.add('order_info', {
      requestId: createOrderDto.requestId,
    });

    this.logger.log(`Order created: ${createOrderDto.requestId}`);

    return {
      requestId: createOrderDto.requestId,
      status: 'OK',
      job: job.id,
    };
  }

  internalCall() {
    this.logger.log('Internal call');
  }
}
