use tonic::{Request, Response, Status};
use tonic::transport::Server;
use otel101::delivery_service_server::{DeliveryServiceServer, DeliveryService};
use otel101::{DeliveryOrderRequest, DeliveryOrderResponse, DeliveryInquiryRequest, DeliveryInquiryResponse};
pub mod otel101 {
    tonic::include_proto!("otel101");
}

#[derive(Default)]
struct DeliveryServiceImpl;

#[tonic::async_trait]
impl DeliveryService for DeliveryServiceImpl {
    async fn delivery_order(&self, request: Request<DeliveryOrderRequest>) -> Result<Response<DeliveryOrderResponse>, Status> {
        println!("Got a request: {:?}", request);
        let response = DeliveryOrderResponse { tracking_id: "123456".to_string() };

        Ok(Response::new(response))
    }

    async fn delivery_inquiry(&self, request: Request<DeliveryInquiryRequest>) -> Result<Response<DeliveryInquiryResponse>, Status> {
        println!("Got a request: {:?}", request);
        let response = DeliveryInquiryResponse { status: "Delivered".to_string() };

        Ok(Response::new(response))
    }
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let addr = "[::1]:50052".parse().unwrap();
    let delivery_server = DeliveryServiceImpl::default();

    println!("Delivery service server listening on {}", addr);

    Server::builder()
        .add_service(DeliveryServiceServer::new(delivery_server))
        .serve(addr)
        .await?;

    Ok(())
}
