package main

import (
	"context"
	"database/sql"
	"log"
	"net"
	"os"

	"github.com/djslade/molly-recipes/internal/database"
	pb "github.com/djslade/molly-recipes/internal/proto"
	"github.com/google/uuid"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
	"google.golang.org/grpc"
)

type ServerDB interface {
	Begin() (*sql.Tx, error)
}

type ServerQueries interface {
	WithTx(*sql.Tx) *database.Queries
	GetRecipeByID(context.Context, uuid.UUID) (database.Recipe, error)
	GetRecipeByURL(context.Context, string) (database.Recipe, error)
	CreateRecipe(context.Context, database.CreateRecipeParams) (database.Recipe, error)
	GetIngredientsByRecipeID(context.Context, uuid.UUID) ([]database.Ingredient, error)
	GetInstructionsByRecipeID(context.Context, uuid.UUID) ([]database.Instruction, error)
	GetTimersByInstructionID(context.Context, uuid.UUID) ([]database.Timer, error)
	CreateIngredient(context.Context, database.CreateIngredientParams) (database.Ingredient, error)
	CreateInstruction(context.Context, database.CreateInstructionParams) (database.Instruction, error)
	CreateTimer(context.Context, database.CreateTimerParams) (database.Timer, error)
	CountRecipes(context.Context) (int64, error)
	GetRecipes(context.Context, int32) ([]database.Recipe, error)
}

type server struct {
	pb.RecipesServiceServer
	db      ServerDB
	queries ServerQueries
	logger  *log.Logger
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

	pb.RegisterRecipesServiceServer(srv, newServer(db, queries, logger))

	log.Printf("server listening at port %v\n", listener.Addr())

	if err := srv.Serve(listener); err != nil {
		logger.Printf("failed to serve: %v\n", err)
		os.Exit(1)
	}
}
