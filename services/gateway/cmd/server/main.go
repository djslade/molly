package main

import (
	"context"
	"net/http"
	"time"

	"github.com/djslade/molly/internal/config"
	"github.com/djslade/molly/internal/server"
)

type application struct {
	version string
	config  *config.AppConfig
}

func main() {
	srv := server.New(http.NewServeMux())
	server.Run(context.Background(), srv, 10*time.Second)
}
