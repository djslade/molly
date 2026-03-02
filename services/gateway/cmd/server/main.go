package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/djslade/molly/internal/httphandler"
	"github.com/djslade/molly/internal/pubsub"
	"github.com/djslade/molly/internal/recipes"
	"github.com/djslade/molly/internal/server"
	"github.com/djslade/molly/internal/ws"
)

func main() {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	hub := ws.NewHub()

	recipesClient, err := recipes.New(os.Getenv("RECIPES_CONN"))
	if err != nil {
		log.Fatal(err)
	}
	defer recipesClient.Close()
	log.Print("gRPC connection to recipes service established")

	rmqConn, err := pubsub.NewConnection(os.Getenv("RMQ_CONN"))
	if err != nil {
		log.Fatal(err)
	}
	defer rmqConn.Close()
	log.Print("amqp connection to RMQ broker established")

	rmqChannel, err := pubsub.NewChannel(rmqConn)
	if err != nil {
		log.Fatal(err)
	}
	defer rmqChannel.Close()

	scrapePublisher := pubsub.NewPublisher(rmqChannel)

	scrapeSubscriber := pubsub.NewScraperResultsConsumer(rmqChannel, hub, recipesClient)

	if err := scrapeSubscriber.Setup(); err != nil {
		log.Fatal(err)
	}

	if err := scrapeSubscriber.Start(ctx); err != nil {
		log.Fatal(err)
	}

	handlerHttp := httphandler.New(recipesClient, nil)

	handlerWs := ws.NewHandler(hub, scrapePublisher, recipesClient)

	routes := registerRoutes(*handlerHttp, *handlerWs)

	srv := server.New(routes)
	server.Run(context.Background(), srv, 10*time.Second)
}

func registerRoutes(httpHandler httphandler.Handler, wsHandler ws.Handler) *http.ServeMux {
	mux := http.NewServeMux()

	mux.HandleFunc("/recipes/", httpHandler.GetRecipe)
	mux.HandleFunc("/recipes", httpHandler.SearchRecipes)
	mux.HandleFunc("/recipes/import", wsHandler.ServeHTTP)

	return mux
}
