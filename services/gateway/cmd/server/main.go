package main

import (
	"context"
	"log"
	"net/http"
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

	log.Print(1)
	hub := ws.NewHub()
	log.Print(2)

	recipesClient, err := recipes.New("")
	if err != nil {
		log.Fatal(err)
	}
	defer recipesClient.Close()

	rmqConn, err := pubsub.NewConnection("amqp://localhost:5672")
	if err != nil {
		log.Fatal(err)
	}
	defer rmqConn.Close()

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

	handlerWs := ws.NewHandler(hub, scrapePublisher)

	routes := registerRoutes(*handlerHttp, *handlerWs)

	srv := server.New(routes)
	server.Run(context.Background(), srv, 10*time.Second)
}

func registerRoutes(httpHandler httphandler.Handler, wsHandler ws.Handler) *http.ServeMux {
	mux := http.NewServeMux()

	mux.HandleFunc("/recipes/:id", httpHandler.GetRecipe)
	mux.HandleFunc("/recipes", httpHandler.GetAllRecipes)
	mux.HandleFunc("/recipes/import", wsHandler.ServeHTTP)

	return mux
}
