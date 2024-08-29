import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import {
  context,
  ROOT_CONTEXT,
  Span,
  SpanContext,
  SpanStatusCode,
  trace,
} from '@opentelemetry/api';

@Processor('orders')
export class OrderConsumer {
  private readonly logger = new Logger(OrderConsumer.name);
  @Process('order_info')
  async transcode(job: Job<any>) {
    this.logger.log(job.data);
    const { traceId, spanId, traceFlags } = job.data;

    // SpanContext 객체를 생성
    const spanContext: SpanContext = {
      traceId,
      spanId,
      traceFlags,
      isRemote: true, // SpanContext가 외부로부터 전파되었음을 표시
    };

    // Context 복원
    const extractedContext = trace.setSpan(
      ROOT_CONTEXT,
      trace.wrapSpanContext(spanContext),
    );

    context.with(extractedContext, () => {
      const tracer = trace.getTracer('default');
      const span: Span = tracer.startSpan(
        'process-job',
        undefined,
        extractedContext,
      );

      try {
        // 여기에 실제 작업을 수행하는 코드를 작성
        this.logger.log(`Order info job ${job.id} Start`);
        this.internalCall();

        // 작업 성공 시 Span을 성공으로 마무리
        span.setStatus({ code: SpanStatusCode.OK });
      } catch (error) {
        // 오류 발생 시 Span을 오류로 표시
        span.setStatus({ code: SpanStatusCode.ERROR, message: String(error) });
        throw error; // 오류를 다시 던져 Bull이 오류를 인지하도록 함
      } finally {
        // Span 종료
        this.logger.log(`Order info job ${job.id} End`);
        span.end();
      }
    });
  }

  internalCall() {
    this.logger.log('Internal call');
  }
}
