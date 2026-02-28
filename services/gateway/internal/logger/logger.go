package logger

import (
	"log/slog"
	"os"
)

var logLevel slog.LevelVar

func Init() {
	if os.Getenv("ENV") == "production" {
		logLevel.Set(slog.LevelInfo)
	} else {
		logLevel.Set(slog.LevelDebug)
	}
}
