package server

import (
	"context"
	"errors"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"
)

func New(mux *http.ServeMux) *http.Server {
	return &http.Server{
		Addr:    ":3000",
		Handler: cors(mux),
	}
}

func Run(ctx context.Context, srv *http.Server, shutdownTimeout time.Duration) error {
	srvErr := make(chan error, 1)

	go func() {
		if err := srv.ListenAndServe(); !errors.Is(err, http.ErrServerClosed) {
			srvErr <- err
		}
		close(srvErr)
	}()

	stop := make(chan os.Signal, 1)
	signal.Notify(stop, syscall.SIGTERM, syscall.SIGINT)
	defer signal.Stop(stop)

	select {
	case err := <-srvErr:
		return err
	case <-stop:
		log.Println("Shutdown signal received")
	case <-ctx.Done():
		log.Println("Context cancelled")
	}

	shutdownCtx, cancel := context.WithTimeout(
		context.Background(),
		shutdownTimeout,
	)
	defer cancel()

	if err := srv.Shutdown(shutdownCtx); err != nil {
		if closeErr := srv.Close(); closeErr != nil {
			return errors.Join(err, closeErr)
		}
		return err
	}

	return nil
}

func cors(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Headers", "*")
		w.Header().Set("Access-Control-Allow-Methods", "*")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		next.ServeHTTP(w, r)
	})
}
