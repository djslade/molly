package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/djslade/molly-recipes/internal/database"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

type application struct {
	logger *log.Logger
	db     *database.Queries
}

func main() {
	godotenv.Load()
	port := os.Getenv("PORT")
	if port == "" {
		fmt.Println("'PORT' is not defined")
	}
	dbURL := os.Getenv("POSTGRES_CONNECTION_STRING")
	if dbURL == "" {
		fmt.Println("'POSTGRES_CONNECTION_STRING' is not defined")
		os.Exit(1)
	}

	db, err := sql.Open("postgres", dbURL)
	if err != nil {
		fmt.Println("Could not connect to database: ", err)
		os.Exit(1)
	}
	dbQueries := database.New(db)

	app := &application{
		db:     dbQueries,
		logger: log.New(os.Stdout, "", log.Ldate|log.Ltime),
	}

	srv := &http.Server{
		Addr:         ":" + port,
		Handler:      app.routes(),
		IdleTimeout:  time.Minute,
		ReadTimeout:  time.Second * 10,
		WriteTimeout: time.Second * 30,
	}

	app.logger.Printf("server started on port %s\n", srv.Addr)
	if err := srv.ListenAndServe(); err != nil {
		app.logger.Fatal(err)
	}
}
