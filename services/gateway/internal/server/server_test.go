package server

import (
	"context"
	"net/http"
	"syscall"
	"testing"
	"time"
)

func TestRun(t *testing.T) {
	srv := &http.Server{
		Addr: ":8000",
		Handler: http.HandlerFunc(
			func(w http.ResponseWriter, r *http.Request) {
				time.Sleep(2 * time.Second)
				w.Write([]byte("completed"))
			},
		),
	}

	srvErrors := make(chan error)
	go func() {
		srvErrors <- Run(context.Background(), srv, 5*time.Second)
	}()

	res, err := http.Get("http://localhost" + srv.Addr)

	syscall.Kill(syscall.Getpid(), syscall.SIGINT)

	if err != nil {
		t.Fatalf("unable to send request to server: %v", err)
	}

	if res.StatusCode != http.StatusOK {
		t.Errorf("expected status code 200, got %d", res.StatusCode)
	}
}
