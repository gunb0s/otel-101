package main

import (
	"context"
	"flag"
	"fmt"
	"github.com/gunb0s/otel-101/go-grpc/client"
	pb "github.com/gunb0s/otel-101/go-grpc/pb"
	"google.golang.org/grpc"
	"log"
	"net"
)

type paymentServiceServer struct {
	pb.UnimplementedPaymentServiceServer
}

var (
	port                        = flag.Int("port", 50051, "The server port")
	deliveryServiceClient, conn = client.DeliveryGrpcClient()
)

func (s *paymentServiceServer) Charge(ctx context.Context, in *pb.ChargeRequest) (*pb.ChargeResponse, error) {
	log.Printf("Received amount: %v", in.GetAmount())

	order, err := deliveryServiceClient.DeliveryOrder(ctx, &pb.DeliveryOrderRequest{Address: "Address"})
	if err != nil {
		log.Fatalf("Failed to get order: %v", err)
	}
	log.Printf("Order: %v", order)

	return &pb.ChargeResponse{TransactionId: "transaction-id"}, nil
}

func main() {
	flag.Parse()

	lis, err := net.Listen("tcp", fmt.Sprintf(":%d", *port))
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}
	s := grpc.NewServer()
	pb.RegisterPaymentServiceServer(s, &paymentServiceServer{})
	log.Printf("server listening at %v", lis.Addr())
	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
	defer conn.Close()
}
