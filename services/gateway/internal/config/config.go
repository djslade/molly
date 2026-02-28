package config

type AppConfig struct {
	Port string
	Env  string
}

func New() (*AppConfig, error) {
	cfg := AppConfig{
		Port: "3000",
		Env:  "dev",
	}
	return &cfg, nil
}
