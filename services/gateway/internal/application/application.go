package application

import "github.com/djslade/molly/internal/config"

type application struct {
	version string
	config  *config.AppConfig
}
