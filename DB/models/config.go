package models

import (
	"fmt"
)

type Config struct {
	DBPort          int    `json:"db_port"`
	DBName          string `json:"db_name"`
	DBUser          string `json:"user"`
	DBPassword      string `json:"password"`
	DBContainerName string `json:"container_name"`
	JWTSecret       string `json:"jwt_secret"`
	EmailAPIKey     string `json:"email_api_key"`
}

func (config Config) PSQLInfo() string {
	return fmt.Sprintf(
		"postgresql://%s:%s@%s:%d/%s?sslmode=disable",
		config.DBUser, config.DBPassword, config.DBContainerName, config.DBPort, config.DBName,
	)
}
