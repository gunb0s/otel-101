# LGTM (Loki, Grafana, Tempo, Mimir) With Grafana Alloy

`Observability Data(Trace, Metric, Log)`를 내보낼(`export`)
`DataSource` 백엔드(`Tempo`, `Mimir`, `Loki`)와 `Grafana Dashboard` 구성 후에 `Grafana Alloy`(`OpenTelemetry Collector`) 를 설치한다.

## Tempo
https://grafana.com/docs/helm-charts/tempo-distributed/next/get-started-helm-charts/#tempo-helm-chart-values

`helm install -n traces tempo grafana/tempo-distributed -f values.yaml`

## Loki
https://grafana.com/docs/loki/latest/setup/install/helm/install-scalable/#install-the-simple-scalable-helm-chart
(`minio storage` 사용)

`helm install -n logs loki grafana/loki -f values.yaml`

## Grafana

```yaml
adminUser: admin
adminPassword: admin
```
`helm install -n monitoring grafana grafana/grafana -f values.yaml`

### Grafana DataSource 설정
#### Tempo
`Connection URL: http://tempo-query-frontend.traces:3100`
#### Loki
`Connection URL: http://loki-gateway.logs:80`

## Alloy
https://grafana.com/docs/alloy/latest/configure/kubernetes/#method-2-create-a-separate-configmap-from-a-file

[config.alloy](charts%2Falloy%2Fconfig.alloy)

[grafana-alloy.yaml](charts%2Falloy%2Fgrafana-alloy.yaml)

`otelcol.exporter.otlp "tempo"` 컴포넌트에서 `TLS` 비활성화가 필요하고
어플리케이션에서 다음과 같이`OpenTelemetry` 데이터를 밀어넣기 위하여 `values` 파일에서 `extraPorts` 를 통해 `alloy` 서비스에 추가적으로 포트를 열어줘야 한다.

```typescript
const traceExporter = new OTLPTraceExporter({
  url: 'http://alloy.alloy:4318/v1/traces',
});
```

`helm install -n alloy alloy grafana/alloy -f values.yaml`