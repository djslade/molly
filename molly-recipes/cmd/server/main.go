package main

import (
	"database/sql"
	"log"
	"net"
	"os"

	"github.com/djslade/molly-recipes/internal/database"
	pb "github.com/djslade/molly-recipes/internal/proto"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
	"google.golang.org/grpc"
)

type server struct {
	pb.RecipesServiceServer
	db     *database.Queries
	logger *log.Logger
}

func main() {
	logger := log.New(os.Stdout, "", log.Ldate|log.Ltime)

	godotenv.Load()

	port := os.Getenv("PORT")
	if port == "" {
		logger.Println("'PORT' is not defined")
		os.Exit(1)
	}
	dbURL := os.Getenv("POSTGRES_CONNECTION_STRING")
	if dbURL == "" {
		logger.Println("'POSTGRES_CONNECTION_STRING' is not defined")
		os.Exit(1)
	}

	db, err := sql.Open("postgres", dbURL)
	if err != nil {
		logger.Printf("Could not connect to database: %v\n", err)
		os.Exit(1)
	}

	queries := database.New(db)

	listener, err := net.Listen("tcp", ":"+port)
	if err != nil {
		logger.Printf("failed to serve: %v\n", err)
		os.Exit(1)
	}

	srv := grpc.NewServer()

	pb.RegisterRecipesServiceServer(srv, newServer(queries, logger))

	log.Printf("server listening at port %v\n", listener.Addr())

	if err := srv.Serve(listener); err != nil {
		logger.Printf("failed to serve: %v\n", err)
		os.Exit(1)
	}
}
