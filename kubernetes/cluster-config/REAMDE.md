## Loki

https://grafana.com/docs/loki/latest/setup/install/helm/install-scalable/

위 링크의 안내사항을 그대로 따라한다. 
추가로 value 파일에 다음을 추가한다.

```
auth_enabled: false
```
minio 에 데이터가 잘 쌓이는지 접속해보고 싶다면
다음의 정보로 접속할 수 있다.

```text
$ k port-forward -n metrics svc/loki-minio-console 9001
rootUser: enterprise-logs
rootPassword: supersecret
```

## Grafana

https://grafana.com/docs/grafana/latest/setup-grafana/installation/helm/


## Alloy

