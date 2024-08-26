import { Controller, Get, Inject, Logger, OnModuleInit } from '@nestjs/common';
import {
  DeliveryInquiryRequest,
  DeliveryInquiryResponse,
} from '../pb/otel-101';
import { lastValueFrom, Observable } from 'rxjs';
import { ClientGrpc } from '@nestjs/microservices';

export interface DeliveryService {
  DeliveryInquiry(
    request: DeliveryInquiryRequest,
  ): Observable<DeliveryInquiryResponse>;
}

@Controller('delivery')
export class DeliveryController implements OnModuleInit {
  private deliveryService: DeliveryService;
  private readonly logger = new Logger(DeliveryController.name);

  constructor(@Inject('GRPC_CLIENT') private client: ClientGrpc) {}

  onModuleInit() {
    this.deliveryService =
      this.client.getService<DeliveryService>('DeliveryService');
  }

  @Get()
  async getDelivery() {
    const deliveryInquiryResp = await lastValueFrom(
      this.deliveryService.DeliveryInquiry({
        trackingId: '123456',
      }),
    );

    this.logger.log(
      `Delivery service response: status=${deliveryInquiryResp.status}`,
    );

    return deliveryInquiryResp;
  }
}
