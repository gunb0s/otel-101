import { NodeSDK } from '@opentelemetry/sdk-node';
import { Resource } from '@opentelemetry/resources';

import {
  SEMRESATTRS_SERVICE_NAME,
  SEMRESATTRS_SERVICE_VERSION,
} from '@opentelemetry/semantic-conventions';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-node';
import { BullInstrumentation } from '@useparagon/opentelemetry-instrumentation-bull';
import { NestInstrumentation } from '@opentelemetry/instrumentation-nestjs-core';
import { IORedisInstrumentation } from '@opentelemetry/instrumentation-ioredis';
import { PinoInstrumentation } from '@opentelemetry/instrumentation-pino';
import { MySQL2Instrumentation } from '@opentelemetry/instrumentation-mysql2';

const traceExporter = new OTLPTraceExporter({
  url: 'http://alloy.alloy:4318/v1/traces',
});

const sdk = new NodeSDK({
  resource: new Resource({
    [SEMRESATTRS_SERVICE_NAME]: 'opentelemetry-101',
    [SEMRESATTRS_SERVICE_VERSION]: '0.0.1',
  }),
  traceExporter: traceExporter,
  spanProcessors: [new BatchSpanProcessor(traceExporter)],
  // metricReader: new PeriodicExportingMetricReader({
  //   exporter: new OTLPMetricExporter({
  //     url: 'http://alloy.alloy:4318/v1/metrics',
  //   }),
  //   exportIntervalMillis: 1000,
  // }),
  instrumentations: [
    new PinoInstrumentation(),
    new NestInstrumentation(),
    new BullInstrumentation(),
    new IORedisInstrumentation(),
    new MySQL2Instrumentation(),
  ],
});

sdk.start();

process.on('SIGTERM', () => {
  sdk
    .shutdown()
    .then(() => console.log('Tracing terminated'))
    .catch((error) => console.log('Error terminating tracing', error))
    .finally(() => process.exit(0));
});
