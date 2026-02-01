package main

import (
	"fmt"
	"net/http"
	"os"
)

func main() {
	fmt.Println("Hi banana!")
	srv := &http.Server{
		Addr: ":8080",
	}

	err := srv.ListenAndServe()
	fmt.Println(err)
	os.Exit(1)
}
