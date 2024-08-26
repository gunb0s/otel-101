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
import { lastValueFrom, Observable } from 'rxjs';

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
  ) {}

  onModuleInit() {
    this.paymentService =
      this.client.getService<PaymentService>('PaymentService');
  }

  @Post()
  async createOrder(@Body() createOrderDto: { requestId: string }): Promise<{
    requestId: string;
    status: string;
  }> {
    // await this.customKafkaClient.send('orders', [
    //   {
    //     value: JSON.stringify({
    //       requestId: createOrderDto.requestId,
    //     }),
    //   },
    // ]);

    const chargeResponse = await lastValueFrom(
      this.paymentService.Charge({ amount: 1000 }),
    );
    this.logger.log(
      `Payment service response: txId=${chargeResponse.transactionId}`,
    );

    return {
      requestId: createOrderDto.requestId,
      status: 'OK',
    };
  }
}
