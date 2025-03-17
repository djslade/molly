package main

import "fmt"

type config struct {
	port int
	env  string
}

type application struct {
	config config
}

func main() {
	// var cfg config
	fmt.Println("Hi banana!")
}
