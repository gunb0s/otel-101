package client

import (
	"flag"
	pb "github.com/gunb0s/otel-101/go-grpc/pb"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
	"log"
)

var (
	serverAddr = flag.String("addr", "localhost:50052", "The server address in the format of host:port")
)

// export this client to main
func DeliveryGrpcClient() (pb.DeliveryServiceClient, *grpc.ClientConn) {
	var opts []grpc.DialOption
	opts = append(opts, grpc.WithTransportCredentials(insecure.NewCredentials()))

	conn, err := grpc.NewClient(*serverAddr, opts...)
	if err != nil {
		log.Fatalf("fail to dial: %v", err)
	}

	client := pb.NewDeliveryServiceClient(conn)

	return client, conn
}
